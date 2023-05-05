import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

const Home = () => {
  const ingredients = [
    'rice',
    'ground beef',
    'steak',
    'chicken thighs',
    'chicken breasts',
    'salmon',
    'potatoes',
    'black beans',
    'flour tortillas',
    'heavy cream',
    'carrots',
    'onions',
    'celery',
    'diced tomatoes',
    'canned corn',
    'ginger',
    'dry pasta',
    'lemons',
    'limes',
    'chicken stock',
    'garlic',
    'pepper jack cheese',
    'parmesan cheese',
  ];
  const [cart, setCart] = useState([]);
  const [options, setOptions] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const styles = {
    loading: {
      position: 'fixed',
      height: '100vh',
      width: '100vw',
      top: '0',
      left: '0',
      backgroundColor: 'rgba(0,0,0,0.75)',
      overflow: 'hidden',
    },
  };

  const selectHandler = (e) => {
    e.target.selected = !e.target.selected;
    const selected = e.target.selected;

    // UPDATE CART
    const updateCart = selected
      ? [...cart, e.target.innerText]
      : cart.filter((item) => item !== e.target.innerText);
    setCart([...updateCart]);

    // UPDATE CLASS
    if (selected) e.target.classList.add('selected');
    else e.target.classList.remove('selected');
  };
  const clearSelected = () => {
    const allIngredients = document.querySelectorAll('.ingredient');

    allIngredients.forEach((ingredient) => {
      if (ingredient.selected) {
        ingredient.selected = false;
        ingredient.classList.remove('selected');
      }
    });
    setCart([]);
  };
  const generateIdeas = async () => {
    if (cart.length === 0) return alert('Select at least one ingredient');

    setLoading(true);
    const url = '/openai/recipeideas';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: [...cart] }),
    });
    if (!res.ok) {
      alert('ERROR processing request');
      return setLoading(false);
    }
    const result = await res.json(res);
    setOptions(result.options);
    clearSelected();
    return setLoading(false);
  };
  const generateRecipe = async (name, description) => {
    setLoading(true);
    const url = '/openai/generaterecipe';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) {
      alert('ERROR processing request');
      return setLoading(false);
    }
    const result = await res.json(res);
    setRecipe(result.recipe);
    return setLoading(false);
  };
  return (
    <div id="Home">
      {loading && (
        <div style={styles.loading}>
          <h1>Loading...</h1>
        </div>
      )}
      <h1>Meal Maker</h1>
      <h2>Ingredients</h2>
      <h4>Select your available ingredients:</h4>
      <div>
        {ingredients.map((item) => (
          <div
            key={item}
            selected={false}
            className={`ingredient`}
            onClick={selectHandler}
          >
            {item}
          </div>
        ))}
      </div>

      <button className="submit" onClick={generateIdeas}>
        Generate Ideas
      </button>
      <button className="clear" onClick={clearSelected}>
        Clear Cart
      </button>

      <div>
        <h2>Ideas</h2>
        <h4>Select an option for the full recipe:</h4>
        {options.map((option) => (
          <div
            key={option.name}
            id={option.name}
            className="option"
            onClick={() => generateRecipe(option.name, option.description)}
          >
            <h3 name="name">{option.name}</h3>
            <p name="description">{option.description}</p>
          </div>
        ))}
      </div>

      {recipe && (
        <div className="recipe">
          <h2>Recipe: {recipe.name}</h2>
          <p>{recipe.description}</p>
          <h4>Prep Time: {recipe.prep_time}</h4>
          <h4>Cook Time: {recipe.cook_time}</h4>
          <h3>Ingredients:</h3>
          <ul>
            {recipe.ingredients.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
          <h3>Procedures:</h3>
          <ol>
            {recipe.procedures.map((step) => (
              <li>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Home;
