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
            <span data-test="calories">{recipe.servingCalories}</span>
            <span data-test="serving">{recipe.servingCount}</span>
            <span data-test="cuisine">{recipe.cuisine}</span>
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
              <span>{recipe.note}</span>
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
