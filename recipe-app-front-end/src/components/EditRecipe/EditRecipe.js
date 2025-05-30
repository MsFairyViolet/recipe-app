"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useConfirm } from "@components/common/ConfirmProvider"
import { v4 as uuidv4 } from 'uuid'
import EditRecipeIngriedientList from "./EditRecipeIngredientList"

export default function EditRecipe({ recipe, isNew = false }) {
    const router = useRouter()
    const confirm = useConfirm()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [globalIngredients, setGlobalIngredients] = useState([])
    const [recipes, setRecipes] = useState([])
    const [cuisines, setCuisines] = useState([])
    const [amountTypes, setAmountTypes] = useState([])
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

    const fetchRecipes = () => {
        fetch("/api/recipe")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch recipes")
                }
                return response.json()
            })
            .then((data) => {
                setRecipes(data)
                setLoading(false)
            })
            .catch((error) => {
                console.log("Error fetching recipes: ", error)
                setError(error.message)
                setLoading(false)
            })
    }

    const fetchCuisines = () => {
        fetch("/api/cuisine")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch cuisines")
                }
                return response.json()
            })
            .then((data) => {
                setCuisines(data)
                setLoading(false)
            })
            .catch((error) => {
                console.log("Error fetching cuisines: ", error)
                setError(error.message)
                setLoading(false)
            })
    }

    const fetchAmountTypes = () => {
        fetch("/api/amounttype")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch amount types")
                }
                return response.json()
            })
            .then((data) => {
                setAmountTypes(data)
                setLoading(false)
            })
            .catch((error) => {
                console.log("Error fetching amount types: ", error)
                setError(error.message)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchGlobalIngredients()
        fetchRecipes()
        fetchCuisines()
        fetchAmountTypes()
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
            const updatedIngredients = prev.ingredients.filter((ingredient, index) => index !== indexToDelete)
            return {
                ...prev,
                ingredients: updatedIngredients
            }
        })
    }

    const handleAllIngredientsDelete = async () => {
        await confirm("Do you want to delete all ingredients for", recipe.name)
            .then((confirmed) => {

                if (confirmed) {
                    setFormData(prev => {
                        const updatedIngredients = []
                        return {
                            ...prev,
                            ingredients: updatedIngredients
                        }
                    })
                }
            })
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
            handleSave()
        }
    }

    const handleSave = () => {
        if (!validateFormData()) {
            alert("Please fill in the required fields.")
            return
        }

        if (!validateIngredients()) {
            alert("Please fill in all ingredient fields.")
            return
        }

        if (isNew) {
            handleCreate()
        } else {
            handleUpdate()
        }
    }

    const handleCreate = () => {
        const recipeExists = recipes.some(
            (recipe) => recipe.name.toLowerCase() === formData.name.toLowerCase()
        )

        if (recipeExists) {
            alert("A recipe with the same name already exists!")
            return
        }

        fetch("/api/recipe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to create recipe")
                }
                return response.json()
            })
            .then((savedRecipe) => {
                router.push(`/recipe/${savedRecipe.id}`)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const handleUpdate = async () => {
        const recipeExists = recipes.some(
            (recipe) => recipe.id !== formData.id && recipe.name.toLowerCase() === formData.name.toLowerCase()
        )

        if (recipeExists) {
            alert("A recipe with the same name already exists!")
            return
        }

        fetch(`/api/recipe/${recipe.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update recipe")
                }
                router.push(`/recipe/${recipe.id}`)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const handleDelete = async () => {
        await confirm("Do you want to delete the recipe for", recipe.name)
            .then((confirmed) => {
                if (confirmed) {
                    fetch(`/api/recipe/${recipe.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Failed to delete recipe")
                            }
                            router.push("/recipe")
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                }
            })
    }

    return (
        <>
            {globalIngredients && recipes && cuisines && amountTypes ? (
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
                                <select name="cuisine" value={formData.cuisine} onChange={handleChange}>
                                    <option value="" hidden disabled>
                                        Cuisine*
                                    </option>
                                    {cuisines.map((item) => {
                                        return <option key={item.cuisineTitle} value={item.cuisineTitle}>{item.cuisineTitle}</option>
                                    })}
                                </select>
                            </div>
                        </div>

                        <div>
                            <h4>Ingredients:</h4>
                            <EditRecipeIngriedientList ingredients={formData.ingredients} handleIngredientAdd={handleIngredientAdd} handleIngredientChange={handleIngredientChange} handleIngredientDelete={handleIngredientDelete} handleAllIngredientsDelete={handleAllIngredientsDelete} globalIngredients={globalIngredients} fetchGlobalIngredients={fetchGlobalIngredients} amountTypes={amountTypes} />
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
            ) : error ? (
                <p className="warning error">Failed!</p>
            ) : (
                <p className="warning">Loading...</p>
            )
            }
        </>
    )
}
