"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from 'uuid'
import EditRecipeIngriedientList from "./EditRecipeIngredientList"

export default function EditRecipe({ recipe, isNew = false }) {

    const router = useRouter();
    const [formData, setFormData] = useState({
        id: recipe.id,
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

    const handleCancel = () => {
        router.push(isNew ? `/recipe` : `/recipe/${recipe.id}`)
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
    }

    const handleIngredientChange = (index, field, value) => {
        setFormData(prev => {
            const updatedIngredients = [...prev.ingredients]
            updatedIngredients[index] = {
                ...updatedIngredients[index],
                [field]: value
            }
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

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            if (!res.ok) {
                throw new Error("Failed to create recipe")
            }
            const savedRecipe = await res.json()
            router.push(`/recipe/${savedRecipe.id}`)
        } catch (err) {
            console.error(err)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/recipe/${recipe.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            if (!res.ok) {
                throw new Error("Failed to update recipe")
            }
            router.push(`/recipe/${recipe.id}`)
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/recipe/${recipe.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (!res.ok) {
                throw new Error("Failed to delete recipe");
            }
            router.push("/recipe");
        } catch (err) {
            console.error(err);
        }
    }

return (
    <form className="edit-page" onSubmit={isNew ? handleCreate : handleUpdate}>
        <input className="page-title" placeholder="Recipe name*" required={true} autoFocus={true} type="text" name="name" value={formData.name} onChange={handleChange}></input>

        <div className="recipe-card">
            <div className="top-details">
                <div className="big-details">
                    <textarea className="description-details" placeholder="Add a description" type="text" name="description" value={formData.description} onChange={handleChange}></textarea>
                    <textarea className="url-details" type="text" placeholder="Add a reference link" name="externalRecipeLink" value={formData.externalRecipeLink} onChange={handleChange}></textarea>
                </div>

                <div className="small-details">
                    <input name="servingCalories" type="number" placeholder="Calories*" required={true} value={formData.servingCalories} onChange={handleChange}></input>
                    <input name="servingCount" type="number" placeholder="Servings*" required={true} value={formData.servingCount} onChange={handleChange}></input>
                    <input name="cuisine" type="text" placeholder="Cuisine*" required={true} value={formData.cuisine} onChange={handleChange}></input>
                </div>
            </div>

            <div>
                <h4>Ingredients:</h4>
                <EditRecipeIngriedientList ingredients={formData.ingredients} onIngredientAdd={handleIngredientAdd} onIngredientChange={handleIngredientChange} onIngredientDelete={handleIngredientDelete} />
            </div>

            <div>
                <h4>Notes:</h4>
                <textarea className="note-details" placeholder="Add additional notes" type="text" name="note" value={formData.note} onChange={handleChange}></textarea>
            </div>
            <div className="button-container">
                <button className="recipe-button" type="button" onClick={isNew ? handleCancel : handleDelete}>Delete</button>
                <button className="recipe-button" type="button" onClick={handleCancel}>Cancel</button>
                <button className="recipe-button" type="submit">Save</button>
            </div>
        </div >
    </form>
);
}
