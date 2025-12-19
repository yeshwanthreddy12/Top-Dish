import { llmService } from './llmService'

// Get API key from runtime config, localStorage, or build-time env
function getGooglePlacesApiKey() {
  if (typeof window !== 'undefined' && window.APP_CONFIG?.GOOGLE_PLACES_API_KEY) {
    return window.APP_CONFIG.GOOGLE_PLACES_API_KEY
  }
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('GOOGLE_PLACES_API_KEY')
    if (stored) return stored
  }
  return import.meta.env.VITE_GOOGLE_PLACES_API_KEY
}

const GOOGLE_PLACES_API_KEY = getGooglePlacesApiKey()

// Debug helper (only in development)
if (import.meta.env.DEV) {
  console.log('Google Places API Key loaded:', GOOGLE_PLACES_API_KEY ? 'Yes (length: ' + GOOGLE_PLACES_API_KEY.length + ')' : 'No')
}

/**
 * Fetch restaurant data and reviews from Google Places API
 */
export async function fetchRestaurantReviews(restaurantName) {
  if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY.trim() === '') {
    throw new Error('Google Places API key is not configured. Please check your .env file or config.js')
  }

  try {
    // Step 1: Search for the restaurant
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(restaurantName)}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
    
    let searchResponse
    try {
      searchResponse = await fetch(searchUrl)
    } catch (fetchError) {
      console.error('Network error:', fetchError)
      throw new Error('Network error: Unable to connect to Google Places API. Please check your internet connection.')
    }

    if (!searchResponse.ok) {
      throw new Error(`API request failed with status ${searchResponse.status}. Please check your API key.`)
    }

    const searchData = await searchResponse.json()

    if (searchData.status === 'REQUEST_DENIED') {
      throw new Error('API request denied. Please check your Google Places API key and ensure the Places API is enabled.')
    }
    
    if (searchData.status === 'OVER_QUERY_LIMIT') {
      throw new Error('API quota exceeded. Please try again later or check your Google Cloud billing.')
    }

    if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
      throw new Error('Restaurant not found. Please try a more specific name or include the city (e.g., "McDonald\'s, New York").')
    }

    const place = searchData.results[0]
    const placeId = place.place_id

    // Step 2: Get place details including reviews
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,reviews,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`
    
    let detailsResponse
    try {
      detailsResponse = await fetch(detailsUrl)
    } catch (fetchError) {
      console.error('Network error:', fetchError)
      throw new Error('Network error: Unable to fetch restaurant details. Please check your internet connection.')
    }

    if (!detailsResponse.ok) {
      throw new Error(`Failed to fetch restaurant details (status ${detailsResponse.status}). Please try again.`)
    }

    const detailsData = await detailsResponse.json()

    if (detailsData.status !== 'OK' || !detailsData.result) {
      throw new Error('Failed to fetch restaurant details.')
    }

    const restaurantData = detailsData.result
    const reviews = restaurantData.reviews || []

    if (reviews.length === 0) {
      throw new Error('No reviews found for this restaurant.')
    }

    // Extract categories from reviews using LLM
    const categories = await extractCategoriesFromReviews(reviews)

    return {
      restaurant: {
        name: restaurantData.name,
        address: restaurantData.formatted_address,
        rating: restaurantData.rating,
        totalRatings: restaurantData.user_ratings_total
      },
      reviews: reviews.map(review => ({
        text: review.text,
        rating: review.rating,
        author: review.author_name,
        time: review.time
      })),
      categories
    }
  } catch (error) {
    // Re-throw our custom errors
    if (error.message && (
      error.message.includes('API key') ||
      error.message.includes('Network error') ||
      error.message.includes('not found') ||
      error.message.includes('denied') ||
      error.message.includes('quota')
    )) {
      throw error
    }
    // Handle unexpected errors
    console.error('Unexpected error:', error)
    throw new Error(`Failed to fetch restaurant data: ${error.message || 'Unknown error'}. Please check your API key and try again.`)
  }
}

/**
 * Extract dish categories from reviews using LLM
 */
async function extractCategoriesFromReviews(reviews) {
  const reviewTexts = reviews.slice(0, 10).map(r => r.text).join('\n\n')
  
  const prompt = `Analyze the following restaurant reviews and extract unique dish categories mentioned (e.g., Appetizers, Main Courses, Desserts, Pizza, Pasta, Seafood, etc.). 
Return only a JSON array of category names, nothing else.

Reviews:
${reviewTexts}`

  try {
    const response = await llmService.generate(prompt)
    // Try to parse JSON from response
    const jsonMatch = response.match(/\[.*\]/s)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    // Fallback to default categories
    return []
  } catch (error) {
    console.error('Error extracting categories:', error)
    return []
  }
}

/**
 * Analyze reviews to find top dishes using LLM
 */
export async function analyzeTopDishes(reviews, categories) {
  if (!reviews || reviews.length === 0) {
    throw new Error('No reviews available for analysis.')
  }

  // Combine review texts
  const reviewTexts = reviews.map((r, i) => `Review ${i + 1} (Rating: ${r.rating}/5):\n${r.text}`).join('\n\n')

  const prompt = `Analyze the following restaurant reviews and identify the top 2 most mentioned and highly rated dishes in the categories: ${categories.join(', ')}.

For each dish, provide:
- The exact dish name as mentioned in reviews
- The category it belongs to
- A brief description based on what reviewers said
- How many times it was mentioned

Return the results as a JSON array with this exact format:
[
  {
    "name": "Dish Name",
    "category": "Category Name",
    "description": "Brief description from reviews",
    "mentions": number
  }
]

Reviews:
${reviewTexts}

Return ONLY the JSON array, no additional text.`

  try {
    const response = await llmService.generate(prompt)
    
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/s)
    if (jsonMatch) {
      const dishes = JSON.parse(jsonMatch[0])
      // Ensure we return top 2 dishes
      return dishes.slice(0, 2).map((dish, index) => ({
        ...dish,
        rank: index + 1
      }))
    }
    
    throw new Error('Failed to parse dish data from AI response.')
  } catch (error) {
    if (error.message.includes('parse')) {
      throw error
    }
    throw new Error('Failed to analyze dishes. Please try again.')
  }
}

