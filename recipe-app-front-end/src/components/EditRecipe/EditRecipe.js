"use client"

import { useEffect } from "react";

export default function EditRecipe({ recipe }) {

      useEffect(() => {
        document.title = "Edit " + recipe.name
      }, [recipe.name])

    return (
        <>
            <h1 className="page-title">EDIT {recipe.name}</h1>

            <div className="recipe-card">
                <div className="top-details">
                    <div className="big-details">
                        <span>{recipe.description}</span>
                        <a className="url-details" href={recipe.externalRecipeLink}>{recipe.externalRecipeLink}</a>
                    </div>

                    <div className="small-details">
                        <span>{recipe.servingCalories}</span>
                        <span>{recipe.servingCount} span</span>
                        <span>{recipe.cuisine}</span>
                    </div>
                </div>

                <div>
                    <h4>Ingredients:</h4>
                </div>

                {recipe.note && (
                    <div>
                        <h4>Notes:</h4>
                        <div className="note-details">
                            <span>{recipe.note}</span>
                        </div>
                    </div>
                )}

                <button className="delete-recipe-button">Delete</button>
                <button className="save-recipe-button">Save</button>
            </div >
        </>
    );
}
