import { useState } from 'react'
import './RestaurantInput.css'

function RestaurantInput({ onSubmit, loading }) {
  const [restaurantName, setRestaurantName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (restaurantName.trim()) {
      onSubmit(restaurantName.trim())
    }
  }

  const exampleRestaurants = [
    'The Cheesecake Factory, New York',
    'Olive Garden, Los Angeles',
    'Red Lobster, Chicago',
    'Outback Steakhouse, Miami'
  ]

  const handleExampleClick = (example) => {
    setRestaurantName(example)
  }

  return (
    <div className="restaurant-input">
      <h2>Find Top Dishes</h2>
      <p className="subtitle">Discover the most loved dishes at any restaurant</p>
      
      <div className="instructions">
        <p className="instruction-text">
          <strong>How to search:</strong> Enter the restaurant name, and optionally include the city or location for better results.
        </p>
        <p className="instruction-examples">
          <strong>Examples:</strong>
        </p>
        <div className="example-buttons">
          {exampleRestaurants.map((example, index) => (
            <button
              key={index}
              type="button"
              className="example-btn"
              onClick={() => handleExampleClick(example)}
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-group">
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="Restaurant name, City (e.g., McDonald's, San Francisco)"
            className="restaurant-input-field"
            disabled={loading}
            required
          />
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || !restaurantName.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <p className="input-hint">
          💡 Tip: Include the city name for more accurate results (e.g., "Pizza Hut, Boston")
        </p>
      </form>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Fetching restaurant reviews...</p>
        </div>
      )}
    </div>
  )
}

export default RestaurantInput

