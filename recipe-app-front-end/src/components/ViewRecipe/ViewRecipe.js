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
    <>
      <h1 className="page-title">{recipe.name}</h1>

      <div className="recipe-card">
        <div className="top-details">
          <div className="big-details">
            <span className="description-details">{recipe.description}</span>
            <a className="url-details" href={recipe.externalRecipeLink}>{recipe.externalRecipeLink}</a>
          </div>

          <div className="small-details">
            <span>{recipe.servingCalories}</span>
            <span>{recipe.servingCount}</span>
            <span>{recipe.cuisine}</span>
          </div>
        </div>

        <div>
          <h4>Ingredients:</h4>
          <span><RecipeIngredientsList recipe={recipe} /></span>
        </div>

        {recipe.note && (
          <div>
            <h4>Notes:</h4>
            <div className="note-details">
              <span>{recipe.note}</span>
            </div>
          </div>
        )}
        <div className="button-container">
          <button className="recipe-button" onClick={handleClick}>Edit</button>
        </div>
      </div >
    </>
  );
}
