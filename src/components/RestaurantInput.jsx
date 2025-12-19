import { useState, useEffect, useRef } from 'react'
import './RestaurantInput.css'
import { getAutocompleteSuggestions } from '../services/placesAutocomplete'

function RestaurantInput({ onSubmit, loading }) {
  const [restaurantName, setRestaurantName] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const debounceTimer = useRef(null)

  useEffect(() => {
    if (restaurantName.trim().length >= 2 && !loading) {
      // Debounce the API call
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      debounceTimer.current = setTimeout(async () => {
        const results = await getAutocompleteSuggestions(restaurantName)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
        setSelectedIndex(-1)
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [restaurantName, loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (restaurantName.trim()) {
      setShowSuggestions(false)
      onSubmit(restaurantName.trim())
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setRestaurantName(suggestion.description)
    setShowSuggestions(false)
    setSuggestions([])
    // Auto-submit when suggestion is selected
    onSubmit(suggestion.description)
  }

  const handleInputChange = (e) => {
    setRestaurantName(e.target.value)
    setShowSuggestions(true)
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
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
          <strong>How to search:</strong> Start typing a restaurant name and select from the dropdown suggestions, or click an example below.
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
        <div className="input-wrapper">
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              value={restaurantName}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              placeholder="Start typing restaurant name..."
              className="restaurant-input-field"
              disabled={loading}
              required
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !restaurantName.trim()}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown" ref={suggestionsRef}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="suggestion-name">{suggestion.name}</div>
                  {suggestion.address && (
                    <div className="suggestion-address">{suggestion.address}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="input-hint">
          💡 Start typing to see restaurant suggestions, or click an example above
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

