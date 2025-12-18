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

  return (
    <div className="restaurant-input">
      <h2>Find Top Dishes</h2>
      <p className="subtitle">Enter the name of a restaurant to discover its most popular dishes</p>
      
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-group">
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="e.g., The Cheesecake Factory, New York"
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

