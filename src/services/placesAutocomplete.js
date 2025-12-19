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

/**
 * Get autocomplete suggestions for restaurant search
 */
export async function getAutocompleteSuggestions(input) {
  if (!input || input.trim().length < 2) {
    return []
  }

  if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY.trim() === '') {
    console.warn('Google Places API key not configured')
    return []
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=establishment&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('Autocomplete API error:', response.status)
      return []
    }

    const data = await response.json()

    if (data.status === 'OK' && data.predictions) {
      return data.predictions.map(prediction => ({
        id: prediction.place_id,
        name: prediction.structured_formatting.main_text,
        address: prediction.structured_formatting.secondary_text || '',
        description: prediction.description,
        placeId: prediction.place_id
      }))
    }

    return []
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error)
    return []
  }
}

