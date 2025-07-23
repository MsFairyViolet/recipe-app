"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useConfirm } from "@components/common/ConfirmProvider"
import { v4 as uuidv4 } from 'uuid'
import EditRecipeIngriedientList from "./EditRecipeIngredientList"
import { getIngredients, getRecipes, getCuisines, getAmountTypes, createRecipe, updateRecipe, deleteRecipe } from "@components/common/Apicalls"

export default function EditRecipe({ recipe, isNew = false }) {
    const router = useRouter()
    const confirm = useConfirm()
    const [loading, setLoading] = useState({
        ingredients: true,
        recipes: true,
        cuisines: true,
        amountTypes: true
    })
    const [error, setError] = useState({
        ingredients: null,
        recipes: null,
        cuisines: null,
        amountTypes: null
    })
    const [ingredients, setIngredients] = useState(null)
    const [recipes, setRecipes] = useState([])
    const [cuisines, setCuisines] = useState(null)
    const [amountTypes, setAmountTypes] = useState(null)
    const [formData, setFormData] = useState({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        externalRecipeLink: recipe.externalRecipeLink,
        servingCalories: recipe.servingCalories,
        servingCount: recipe.servingCount,
        cuisine: recipe.cuisine,
        note: recipe.note,
        ingredientList: recipe.ingredients
    })
    const [isCuisineOpen, setIsCuisineOpen] = useState(false);
    const [selectedCuisine, setSelectedCuisine] = useState(formData.cuisine || "");


    const fetchIngredients = () => {
        getIngredients()
            .then((data) => {
                setIngredients(data)
                setLoading(prev => ({ ...prev, ingredients: false }))
            })
            .catch((error) => {
                console.log("Error fetching ingredients: ", error)
                setError(prev => ({ ...prev, ingredients: error.message }))
                setLoading(prev => ({ ...prev, ingredients: false }))
            })
    }

    const fetchRecipes = () => {
        getRecipes()
            .then((data) => {
                setRecipes(data)
                setLoading(prev => ({ ...prev, recipes: false }))
            })
            .catch((error) => {
                console.log("Error fetching recipes: ", error)
                setError(prev => ({ ...prev, recipes: error.message }))
                setLoading(prev => ({ ...prev, recipes: false }))
            })
    }

    const fetchCuisines = () => {
        getCuisines()
            .then((data) => {
                setCuisines(data)
                setLoading(prev => ({ ...prev, cuisines: false }))
            })
            .catch((error) => {
                console.log("Error fetching cuisines: ", error)
                setError(prev => ({ ...prev, cuisines: error.message }))
                setLoading(prev => ({ ...prev, cuisines: false }))
            })
    }

    const fetchAmountTypes = () => {
        getAmountTypes()
            .then((data) => {
                setAmountTypes(data)
                setLoading(prev => ({ ...prev, amountTypes: false }))
            })
            .catch((error) => {
                console.log("Error fetching amount types: ", error)
                setError(prev => ({ ...prev, amountTypes: error.message }))
                setLoading(prev => ({ ...prev, amountTypes: false }))
            })
    }

    useEffect(() => {
        fetchIngredients()
        fetchRecipes()
        fetchCuisines()
        fetchAmountTypes()
    }, [])

    useEffect(() => {
        if (isNew) {
            document.title = "New Recipe";
        } else {
            document.title = "Edit " + recipe.name;
        }
    }, [isNew, recipe.name]);


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
            ingredientList: [
                ...prev.ingredientList,
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
            const updatedIngredientList = [...prev.ingredientList]
            updatedIngredientList[index] = {
                ...updatedIngredientList[index],
                [field]: value
            }
            return {
                ...prev,
                ingredientList: updatedIngredientList
            }
        })
    }

    const handleIngredientDelete = (indexToDelete) => {
        setFormData(prev => {
            const updatedIngredientList = prev.ingredientList.filter((ingredient, index) => index !== indexToDelete)
            return {
                ...prev,
                ingredientList: updatedIngredientList
            }
        })
    }

    const handleAllIngredientsDelete = async () => {
        await confirm("Do you want to delete all ingredients for", recipe.name)
            .then((confirmed) => {

                if (confirmed) {
                    setFormData(prev => {
                        const updatedIngredientList = []
                        return {
                            ...prev,
                            ingredientList: updatedIngredientList
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
        return formData.ingredientList.every(ingredient => {
            return ingredient.name.trim() !== "" && ingredient.amount.trim() !== ""
        })
    }

    const handleKeyDown = (event) => {
        if (event.target.closest(".ingredient-input") || event.target.tagName === "textarea") {
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

        createRecipe(formData)
            .then((savedRecipe) => {
                router.push(`/recipe/${savedRecipe.id}`)
            })
            .catch((error) => {
                console.error(error)
                alert("Failed to create the recipe.")
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

        updateRecipe(recipe, formData)
            .then(() => {
                router.push(`/recipe/${recipe.id}`)
            })
            .catch((error) => {
                console.error(error)
                alert("Failed to update recipe.")
            })
    }

    const handleDelete = async () => {
        await confirm("Do you want to delete the recipe for", recipe.name)
            .then((confirmed) => {
                if (confirmed) {
                    deleteRecipe(recipe.id)
                        .then(() => {
                            router.push("/recipe")
                        })
                        .catch((error) => {
                            console.error(error)
                            alert("Failed to delete the recipe.")
                        })
                }
            })
    }

    if (loading.ingredients || loading.recipes || loading.cuisines || loading.amountTypes) {
        return <p className="warning">Loading...</p>
    }

    if (error.ingredients || error.recipes || error.cuisines || error.amountTypes) {
        return <p className="warning error">Failed to load.</p>
    }

    return (
        <>
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
                            <div className="custom-cuisine-dropdown-container">
                                <div className={`custom-cuisine-dropdown ${!selectedCuisine ? "placeholder" : ""}`}
                                    onClick={() => setIsCuisineOpen(!isCuisineOpen)}
                                    tabIndex={0}
                                    onBlur={() => setTimeout(() => setIsCuisineOpen(false), 100)}
                                >
                                    <span className="dropdown-label">{selectedCuisine || "Cuisine*"}</span>
                                    <span className="dropdown-arrow">&#9662;</span>
                                </div>
                                {isCuisineOpen && (
                                    <ul className="custom-cuisine-dropdown-options">
                                        {cuisines.map((item, index) => (
                                            <li
                                                key={`${item.cuisineTitle}=${index}`}
                                                onMouseDown={(e) => {
                                                    e.preventDefault()
                                                    setSelectedCuisine(item.cuisineTitle)
                                                    handleChange({ target: { name: "cuisine", value: item.cuisineTitle } })
                                                    setIsCuisineOpen(false)
                                                }}
                                            >
                                                {item.cuisineTitle}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                        </div>

                    </div>

                    <div>
                        <h4>Ingredients:</h4>
                        <EditRecipeIngriedientList ingredientList={formData.ingredientList} handleIngredientAdd={handleIngredientAdd} handleIngredientChange={handleIngredientChange} handleIngredientDelete={handleIngredientDelete} handleAllIngredientsDelete={handleAllIngredientsDelete} ingredients={ingredients} fetchIngredients={fetchIngredients} amountTypes={amountTypes} />
                    </div>

                    <div>
                        <h4>Notes:</h4>
                        <textarea className="note-details" placeholder="Add additional notes" type="text" name="note" value={formData.note} onChange={handleChange}></textarea>
                    </div>
                    <div className="button-container">
                        <button data-test="recipe-delete-button" className="recipe-button" onClick={isNew ? handleCancel : handleDelete}>Delete</button>
                        <button data-test="edit-cancel-button" className="recipe-button" onClick={handleCancel}>Cancel</button>
                        <button data-test="recipe-save-button" className="recipe-button" onClick={handleSave}>Save</button>
                    </div>
                </div >
            </div >
        </>
    )
}
