"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import EditRecipeIngriedientList from "./EditRecipeIngredientList"

export default function EditRecipe({ recipe }) {

    const [formData, setFormData] = useState({
        name: recipe.name,
        description: recipe.description,
        externalRecipeLink: recipe.externalRecipeLink,
        servingCalories: recipe.servingCalories,
        servingCount: recipe.servingCount,
        cuisine: recipe.cuisine,
        note: recipe.note
    })

      useEffect(() => {
        document.title = "Edit " + recipe.name
      }, [recipe.name])

    const handleChange = (e) => {
        const { name, value, type } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }))
    }
    const router = useRouter();

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Data saved! ",formData)
        router.push(`/recipe/${recipe.id}`)
    }
    return (
        <form onSubmit={handleSave}>
            <input className="page-title" type="text" name="name" value={formData.name} onChange={handleChange}></input>

            <div className="recipe-card">
                <div className="top-details">
                    <div className="big-details">
                        <input className="description-details" type="text" name="description" value={formData.description} onChange={handleChange}></input>
                        <input className="url-details" type="text" name="externalRecipeLink" value={formData.externalRecipeLink} onChange={handleChange}></input>
                    </div>

                    <div className="small-details">
                        <input name="servingCalories" type="number" value={formData.servingCalories} onChange={handleChange}></input>
                        <input name="servingCount" type="number" value={formData.servingCount} onChange={handleChange}></input>
                        <input name="cuisine" type="text" value={formData.cuisine} onChange={handleChange}></input>
                    </div>
                </div>

                <div>
                    <h4>Ingredients:</h4>
                    <EditRecipeIngriedientList recipe={recipe}/>
                </div>

                {recipe.note && (
                    <div>
                        <h4>Notes:</h4>
                        <textarea className="note-details" type="text" name="note" value={formData.note} onChange={handleChange}></textarea>
                    </div>
                )}
                <div className="button-container">
                <button className="recipe-button">Delete</button>
                <button className="recipe-button" type="submit">Save</button>
                </div>
            </div >
        </form>
    );
}
