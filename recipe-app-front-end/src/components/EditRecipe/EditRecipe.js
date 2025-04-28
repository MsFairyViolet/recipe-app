"use client"

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from 'uuid'
import EditRecipeIngriedientList from "./EditRecipeIngredientList"
import { useConfirm } from "@components/common/ConfirmProvider";

export default function EditRecipe({ recipe, isNew = false }) {

    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [globalIngredients, setGlobalIngredients] = useState([])
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
    const confirm = useConfirm();

    const fetchGlobalIngredients = () => {
        fetch(`/api/ingredient`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch global ingredients")
                }
                return response.json()
            })
            .then((data) => {
                setGlobalIngredients(data)
                setLoading(false)
            })
            .catch((error) => {
                console.log("Error fetching global ingredients: ", error)
                setError(error.message)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchGlobalIngredients()
    }, [])


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

    const handleAllIngredientsDelete = async () => {
        const confirmed = await confirm("Do you want to delete all ingredients for", recipe.name)

        if (confirmed) {
            setFormData(prev => {
                const updatedIngredients = []
                return {
                    ...prev,
                    ingredients: updatedIngredients
                };
            });
        }
    };

    const handleCreate = async () => {
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

    const validateFormData = () => {
        const { name, servingCalories, servingCount, cuisine } = formData
        return name && servingCalories && servingCount && cuisine
    }

    const validateIngredients = () => {
        return formData.ingredients.every(ingredient => {
            return ingredient.name.trim() !== "" && ingredient.amount.trim() !== ""
        })
    }

    const handleKeyDown = (event) => {
        if (event.target.closest(".ingredient-input") || event.target.tagName === "TEXTAREA") {
            if (event.key === "Enter") {
                event.preventDefault()
            }
            return
        }
        if (event.key === "Enter") {
            handleSave();
        }
    }


    const handleSave = () => {
        if (!validateFormData()) {
            alert("Please fill in the required fields.")
            return
        }

        if (!validateIngredients()) {
            console.log("Please fill in all ingredient fields.")
            alert("Please fill in all ingredient fields.")
            return
        }

        if (isNew) {
            handleCreate()
        } else {
            handleUpdate()
        }
    }

    const handleUpdate = async () => {
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
        const confirmed = await confirm("Do you want to delete the recipe for", recipe.name)
        if (confirmed) {
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
    }

    return (
        <div className="edit-page" onKeyDown={handleKeyDown}>
            <input className="page-title" placeholder="Recipe name*" autoFocus={true} type="text" name="name" value={formData.name} onChange={handleChange}></input>

            <div className="recipe-card">
                <div className="top-details">
                    <div className="big-details">
                        <textarea className="description-details" placeholder="Add a description" type="text" name="description" value={formData.description} onChange={handleChange}></textarea>
                        <textarea className="url-details" type="text" placeholder="Add a reference link" name="externalRecipeLink" value={formData.externalRecipeLink} onChange={handleChange}></textarea>
                    </div>

                    <div className="small-details">
                        <input name="servingCalories" type="number" placeholder="Calories*" value={formData.servingCalories} onChange={handleChange}></input>
                        <input name="servingCount" type="number" placeholder="Servings*" value={formData.servingCount} onChange={handleChange}></input>
                        <input name="cuisine" type="text" placeholder="Cuisine*" value={formData.cuisine} onChange={handleChange}></input>
                    </div>
                </div>

                <div>
                    <h4>Ingredients:</h4>
                    <EditRecipeIngriedientList ingredients={formData.ingredients} handleIngredientAdd={handleIngredientAdd} handleIngredientChange={handleIngredientChange} handleIngredientDelete={handleIngredientDelete} handleAllIngredientsDelete={handleAllIngredientsDelete} globalIngredients={globalIngredients} />
                </div>

                <div>
                    <h4>Notes:</h4>
                    <textarea className="note-details" placeholder="Add additional notes" type="text" name="note" value={formData.note} onChange={handleChange}></textarea>
                </div>
                <div className="button-container">
                    <button className="recipe-button" onClick={isNew ? handleCancel : handleDelete}>Delete</button>
                    <button className="recipe-button" onClick={handleCancel}>Cancel</button>
                    <button className="recipe-button" onClick={handleSave}>Save</button>
                </div>
            </div >
        </div>
    );
}
