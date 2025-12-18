import './Results.css'

function Results({ restaurant, topDishes, categories, onReset }) {
  return (
    <div className="results">
      <div className="results-header">
        <h2>Top Dishes at {restaurant?.name || 'Restaurant'}</h2>
        {restaurant?.address && (
          <p className="restaurant-address">{restaurant.address}</p>
        )}
      </div>

      <div className="dishes-container">
        {topDishes && topDishes.length > 0 ? (
          topDishes.map((dish, index) => (
            <div key={index} className="dish-card">
              <div className="dish-rank">#{index + 1}</div>
              <div className="dish-content">
                <h3 className="dish-name">{dish.name}</h3>
                {dish.category && (
                  <span className="dish-category">{dish.category}</span>
                )}
                {dish.description && (
                  <p className="dish-description">{dish.description}</p>
                )}
                {dish.mentions && (
                  <p className="dish-mentions">
                    Mentioned in {dish.mentions} review{dish.mentions !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No dishes found for the selected categories.</p>
            <p>Try selecting different categories.</p>
          </div>
        )}
      </div>

      <div className="results-footer">
        <button onClick={onReset} className="new-search-btn">
          Search Another Restaurant
        </button>
      </div>
    </div>
  )
}

export default Results

