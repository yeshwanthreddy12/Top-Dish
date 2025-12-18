import './CategorySelection.css'

function CategorySelection({ 
  categories, 
  selectedCategories, 
  onCategoryToggle, 
  onSubmit, 
  onBack,
  loading 
}) {
  const defaultCategories = [
    'Appetizers',
    'Main Courses',
    'Desserts',
    'Beverages',
    'Salads',
    'Soups',
    'Pizza',
    'Pasta',
    'Seafood',
    'Vegetarian',
    'Vegan',
    'Breakfast',
    'Lunch',
    'Dinner'
  ]

  const availableCategories = categories.length > 0 ? categories : defaultCategories

  return (
    <div className="category-selection">
      <h2>Select Dish Categories</h2>
      <p className="subtitle">Choose the categories you're interested in</p>

      <div className="categories-grid">
        {availableCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryToggle(category)}
            className={`category-chip ${selectedCategories.includes(category) ? 'selected' : ''}`}
            disabled={loading}
          >
            {category}
            {selectedCategories.includes(category) && <span className="checkmark">✓</span>}
          </button>
        ))}
      </div>

      <div className="category-actions">
        <button onClick={onBack} className="back-btn" disabled={loading}>
          Back
        </button>
        <button 
          onClick={onSubmit} 
          className="analyze-btn"
          disabled={loading || selectedCategories.length === 0}
        >
          {loading ? 'Analyzing...' : `Find Top Dishes (${selectedCategories.length} selected)`}
        </button>
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing reviews with AI...</p>
        </div>
      )}
    </div>
  )
}

export default CategorySelection

