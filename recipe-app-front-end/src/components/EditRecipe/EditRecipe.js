"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from 'uuid'
import EditRecipeIngriedientList from "./EditRecipeIngredientList"

export default function EditRecipe({ recipe }) {

    const router = useRouter();
    const [formData, setFormData] = useState({
        name: recipe.name,
        description: recipe.description,
        externalRecipeLink: recipe.externalRecipeLink,
        servingCalories: recipe.servingCalories,
        servingCount: recipe.servingCount,
        cuisine: recipe.cuisine,
        note: recipe.note,
        ingredients: recipe.ingredients
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

    const handleIngredientAdd = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [
                ...prev.ingredients,
                {
                    id: uuidv4(),
                    name: "",
                    amount: "",
                    amountType: "stuk"
                }
            ]
        }))
        console.log("Added new ingredient")
    }

    const handleIngredientChange = (index, field, value) => {
        console.log(`Updating ingredient ${index}, field: ${field}, value: ${value}`);
        setFormData(prev => {
            const updatedIngredients = [...prev.ingredients]
            updatedIngredients[index] = {
                ...updatedIngredients[index],
                [field]: value
            }
            console.log("Updated ingredients:", updatedIngredients);
            return {
                ...prev,
                ingredients: updatedIngredients
            }
        })
    }

    const handleIngredientDelete = (indexToDelete) => {
        setFormData(prev => {
            const updatedIngredients = prev.ingredients.filter((ingredient, index) => index !== indexToDelete);
            return {
                ...prev,
                ingredients: updatedIngredients
            };
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Data saved! ", formData)
        router.push(`/recipe/${recipe.id}`)
    }
    return (
        <div className="edit-page">
            <input className="page-title" type="text" name="name" value={formData.name} onChange={handleChange}></input>

            <div className="recipe-card">
                <div className="top-details">
                    <div className="big-details">
                        <textarea className="description-details" type="text" name="description" value={formData.description} onChange={handleChange}></textarea>
                        <textarea className="url-details" type="text" name="externalRecipeLink" value={formData.externalRecipeLink} onChange={handleChange}></textarea>
                    </div>

                    <div className="small-details">
                        <input name="servingCalories" type="number" value={formData.servingCalories} onChange={handleChange}></input>
                        <input name="servingCount" type="number" value={formData.servingCount} onChange={handleChange}></input>
                        <input name="cuisine" type="text" value={formData.cuisine} onChange={handleChange}></input>
                    </div>
                </div>

                <div>
                    <h4>Ingredients:</h4>
                    <EditRecipeIngriedientList recipe={recipe} ingredients={formData.ingredients} onIngredientAdd={handleIngredientAdd} onIngredientChange={handleIngredientChange} onIngredientDelete={handleIngredientDelete} />
                </div>

                {recipe.note && (
                    <div>
                        <h4>Notes:</h4>
                        <textarea className="note-details" type="text" name="note" value={formData.note} onChange={handleChange}></textarea>
                    </div>
                )}
                <div className="button-container">
                    <button className="recipe-button">Delete</button>
                    <button className="recipe-button">Cancel</button>
                    <button className="recipe-button" onClick={handleSave}>Save</button>
                </div>
            </div >
        </div>
    );
}
