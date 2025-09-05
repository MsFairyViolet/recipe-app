"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation"
import RecipeIngredientsList from "./RecipeIngredientsList";

export default function ViewRecipe({ recipe }) {

  const router = useRouter();
  const handleClick = () => {
    router.push(`/recipe/${recipe.id}/edit`)
  }

  useEffect(() => {
    document.title = recipe.name
  }, [recipe.name])

  const recipeNotes = recipe.note ? recipe.note.split("\n") : [];

  return (
    <div className="recipe-view-page">
      <div className="page-header">
        <div className="page-title">{recipe.name}</div>
      </div>
      <div className="recipe-card">
        <div className="top-details">
          <div className="big-details">
            <span className="description-details">{recipe.description}</span>
            <a className="url-details" href={recipe.externalRecipeLink}>{recipe.externalRecipeLink}</a>
          </div>

          <div className="small-details">
            <div data-test="calories">
              <label className="box-label">Calories</label>
              <span className="box-content">{recipe.servingCalories}</span>
            </div>
            <div data-test="serving">
              <label className="box-label">Servings</label>
              <span className="box-content">{recipe.servingCount}</span>
            </div>
            <div data-test="cuisine">
              <label className="box-label">Cuisine</label>
              <span className="box-content">{recipe.cuisine}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="box-title"> Ingredients:</h4>
          <span><RecipeIngredientsList ingredients={recipe.ingredients} /></span>
        </div>

        {recipe.note && (
          <div>
            <h4 className="box-title">Notes:</h4>
            <div className="note-details">
              {recipeNotes.map((note, index) => {
                return <p key={index}>{note}</p>
              }
              )}
            </div>
          </div>
        )}
        <div className="button-container">
          <button data-test="edit-button" className="recipe-button primary-button" onClick={handleClick}>Edit</button>
        </div>
      </div>
    </div>
  );
}
