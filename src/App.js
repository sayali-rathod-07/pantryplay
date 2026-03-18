import React, { useState, useEffect } from 'react'; // Added useEffect import
import './App.css';

// 1. Ingredient List 
const INGREDIENTS_LIST = [
  { id: 1, name: 'Chicken', icon: '🍗' }, { id: 2, name: 'Beef', icon: '🥩' },
  { id: 3, name: 'Salmon', icon: '🐟' }, { id: 4, name: 'Pork', icon: '🥓' },
  { id: 5, name: 'Egg', icon: '🥚' }, { id: 6, name: 'Shrimp', icon: '🦐' },
  { id: 7, name: 'Tofu', icon: '🧊' }, { id: 8, name: 'Lamb', icon: '🍖' },
  { id: 9, name: 'Tomato', icon: '🍅' }, { id: 10, name: 'Potato', icon: '🥔' },
  { id: 11, name: 'Onion', icon: '🧅' }, { id: 12, name: 'Garlic', icon: '🧄' },
  { id: 13, name: 'Carrot', icon: '🥕' }, { id: 14, name: 'Broccoli', icon: '🥦' },
  { id: 15, name: 'Spinach', icon: '🥬' }, { id: 16, name: 'Mushroom', icon: '🍄' },
  { id: 17, name: 'Corn', icon: '🌽' }, { id: 18, name: 'Pepper', icon: '🫑' },
  { id: 19, name: 'Cucumber', icon: '🥒' }, { id: 20, name: 'Eggplant', icon: '🍆' },
  { id: 21, name: 'Avocado', icon: '🥑' }, { id: 22, name: 'Peas', icon: '🫛' },
  { id: 23, name: 'Cheese', icon: '🧀' }, { id: 24, name: 'Milk', icon: '🥛' },
  { id: 25, name: 'Butter', icon: '🧈' }, { id: 26, name: 'Rice', icon: '🍚' },
  { id: 27, name: 'Pasta', icon: '🍝' }, { id: 28, name: 'Bread', icon: '🍞' },
  { id: 29, name: 'Flour', icon: '🌾' }, { id: 30, name: 'Noodles', icon: '🍜' },
  { id: 31, name: 'Lemon', icon: '🍋' }, { id: 32, name: 'Apple', icon: '🍎' },
  { id: 33, name: 'Honey', icon: '🍯' }, { id: 34, name: 'Sugar', icon: '🧂' },
  { id: 35, name: 'Chocolate', icon: '🍫' }, { id: 36, name: 'Olive Oil', icon: '🫒' },
  { id: 37, name: 'Chili', icon: '🌶️' }, { id: 38, name: 'Ginger', icon: '🫚' },
  { id: 39, name: 'Basil', icon: '🌿' }, { id: 40, name: 'Cinnamon', icon: '🪵' },
  { id: 41, name: 'Yogurt', icon: '🍦' }
];

function App() {
  // 2. States
  const [pantry, setPantry] = useState([]); 
  const [recipes, setRecipes] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [expandedId, setExpandedId] = useState(null); 
  const [view, setView] = useState('search'); 
  const [isVeg, setIsVeg] = useState(false); 

  // ✨ Persistent Favorites State (Step 1: Read from cabinet)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pantryPlay_favs');
    return saved ? JSON.parse(saved) : [];
  });

  // ✨ Sync Favorites to LocalStorage (Step 2: Write to cabinet)
  useEffect(() => {
    localStorage.setItem('pantryPlay_favs', JSON.stringify(favorites));
  }, [favorites]);

  // 3. Logic: Filtered Recipes calculation
  const filteredRecipes = isVeg 
    ? recipes.filter(r => r.strCategory === 'Vegetarian' || r.strCategory === 'Vegan') 
    : recipes;

  const toggleIngredient = (name) => {
    if (pantry.includes(name)) {
      setPantry(pantry.filter(item => item !== name));
    } else {
      setPantry([...pantry, name]);
    }
  };

  const toggleFavorite = (recipe) => {
    const isFavorited = favorites.some(fav => fav.idMeal === recipe.idMeal);
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav.idMeal !== recipe.idMeal));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  const fetchRecipes = async () => {
    if (pantry.length === 0) return;
    setLoading(true);
    setRecipes([]); 
    try {
      const mainItem = pantry[0];
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mainItem}`);
      const data = await response.json();
      setRecipes(data.meals || []);
      setExpandedId(null);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 onClick={() => setView('search')} style={{cursor: 'pointer'}}>🥗 PantryPlay</h1>
        <div 
          className={`fav-counter ${view === 'favorites' ? 'active-tab' : ''}`} 
          onClick={() => setView(view === 'favorites' ? 'search' : 'favorites')}
          style={{cursor: 'pointer'}}
        >
          ❤️ Saved: {favorites.length}
        </div>
      </header>

      <main>
        {view === 'search' ? (
          <>
            <section className="pantry-section">
              <h2>🛒 Select Your Ingredients</h2>
              <div className="pantry-grid">
                {INGREDIENTS_LIST.map((item) => (
                  <div 
                    key={item.id} 
                    className={`ingredient-card ${pantry.includes(item.name) ? 'selected' : ''}`}
                    onClick={() => toggleIngredient(item.name)}
                  >
                    <span className="icon">{item.icon}</span>
                    <p>{item.name}</p>
                  </div>
                ))}
              </div>
              
              <button 
                className="generate-btn" 
                onClick={fetchRecipes} 
                disabled={pantry.length === 0 || loading}
              >
                {loading ? '🔍 Finding Recipes...' : 'What can I cook? 🍳'}
              </button>
            </section>

            {recipes.length > 0 && (
              <div className="filter-container">
                <label className="veg-toggle">
                  <input 
                    type="checkbox" 
                    checked={isVeg} 
                    onChange={() => setIsVeg(!isVeg)} 
                  />
                  🥗 Vegetarian Only
                </label>
              </div>
            )}

            <section className="recipe-results">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.idMeal} className="recipe-card">
                  <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                  <div className="recipe-content">
                    <h3>{recipe.strMeal}</h3>
                    <p className="category-text">Category: {recipe.strCategory}</p>
                    <div className="card-actions">
                      <button 
                        className="details-btn"
                        onClick={() => setExpandedId(expandedId === recipe.idMeal ? null : recipe.idMeal)}
                      >
                        {expandedId === recipe.idMeal ? 'Hide Details' : 'Show Details'}
                      </button>
                      <button 
                        className={`favorite-btn ${favorites.some(f => f.idMeal === recipe.idMeal) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(recipe)}
                      >
                        {favorites.some(f => f.idMeal === recipe.idMeal) ? '❤️' : '🤍'}
                      </button>
                    </div>
                    {expandedId === recipe.idMeal && (
                      <div className="instructions">
                        <h4>Instructions:</h4>
                        <p>{recipe.strInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {!loading && filteredRecipes.length === 0 && pantry.length > 0 && (
                <div className="empty-state">
                  <p>No recipes match your selection. Try another combo!</p>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="favorites-section">
            <h2>📖 Your Saved Cookbook</h2>
            {favorites.length > 0 ? (
              <div className="recipe-results">
                {favorites.map((recipe) => (
                  <div key={recipe.idMeal} className="recipe-card">
                    <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                    <div className="recipe-content">
                      <h3>{recipe.strMeal}</h3>
                      <div className="card-actions">
                        <button className="favorite-btn active" onClick={() => toggleFavorite(recipe)}>❤️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-msg">Your cookbook is empty! Go back and heart some recipes. ❤️</p>
            )}
            <button className="generate-btn" onClick={() => setView('search')}>Back to Market</button>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;