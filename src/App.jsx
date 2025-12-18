import { useState } from 'react'
import './App.css'
import RestaurantInput from './components/RestaurantInput'
import CategorySelection from './components/CategorySelection'
import Results from './components/Results'
import { fetchRestaurantReviews, analyzeTopDishes } from './services/api'

function App() {
  const [restaurant, setRestaurant] = useState(null)
  const [reviews, setReviews] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [topDishes, setTopDishes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1) // 1: restaurant input, 2: category selection, 3: results

  const handleRestaurantSubmit = async (restaurantName) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRestaurantReviews(restaurantName)
      setRestaurant(data.restaurant)
      setReviews(data.reviews)
      setCategories(data.categories || [])
      setStep(2)
    } catch (err) {
      setError(err.message || 'Failed to fetch restaurant data')
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySubmit = async () => {
    if (selectedCategories.length === 0) {
      setError('Please select at least one category')
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const dishes = await analyzeTopDishes(reviews, selectedCategories)
      setTopDishes(dishes)
      setStep(3)
    } catch (err) {
      setError(err.message || 'Failed to analyze dishes')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setRestaurant(null)
    setReviews([])
    setCategories([])
    setSelectedCategories([])
    setTopDishes(null)
    setError(null)
    setStep(1)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍽️ Top Dish</h1>
        <p>Discover the most loved dishes at any restaurant</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={handleReset} className="reset-btn">Try Again</button>
          </div>
        )}

        {step === 1 && (
          <RestaurantInput 
            onSubmit={handleRestaurantSubmit} 
            loading={loading}
          />
        )}

        {step === 2 && (
          <CategorySelection
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryToggle={(cat) => {
              setSelectedCategories(prev => 
                prev.includes(cat) 
                  ? prev.filter(c => c !== cat)
                  : [...prev, cat]
              )
            }}
            onSubmit={handleCategorySubmit}
            onBack={handleReset}
            loading={loading}
          />
        )}

        {step === 3 && topDishes && (
          <Results
            restaurant={restaurant}
            topDishes={topDishes}
            categories={selectedCategories}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}

export default App

