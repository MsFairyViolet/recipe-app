"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useConfirm } from "@components/common/ConfirmProvider"
import { v4 as uuidv4 } from 'uuid'
import EditRecipeIngriedientList from "./EditRecipeIngredientList"
import { getIngredients, getRecipes, getCuisines, getAmountTypes, createRecipe, updateRecipe, deleteRecipe } from "@components/common/Apicalls"
import Select from "../common/Select"

export default function EditRecipe({ recipe, isNew = false }) {
    const router = useRouter()
    const confirm = useConfirm()
    const [loading, setLoading] = useState({
        allIngredients: true,
        recipes: true,
        cuisines: true,
        amountTypes: true
    })
    const [error, setError] = useState({
        allIngredients: null,
        recipes: null,
        cuisines: null,
        amountTypes: null
    })
    const [allIngredients, setAllIngredients] = useState(null)
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
        ingredients: recipe.ingredients
    })
    const [selectedCuisine, setSelectedCuisine] = useState(formData.cuisine || "");

    const fetchIngredients = () => {
        getIngredients()
            .then((data) => {
                setAllIngredients(data)
                setLoading(prev => ({ ...prev, allIngredients: false }))
            })
            .catch((error) => {
                console.log("Error fetching all ingredients: ", error)
                setError(prev => ({ ...prev, allIngredients: error.message }))
                setLoading(prev => ({ ...prev, allIngredients: false }))
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

    const handleCancel = async () => {
        await confirm(
            isNew ? "Do you want to cancel creating recipe"
                : "Do you want to cancel editing", recipe.name)
            .then((confirmed) => {
                if (confirmed) {
                    router.push(isNew ? `/recipe` : `/recipe/${recipe.id}`)

                }
                else return
            })
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
            const updatedIngredientList = [...prev.ingredients]
            updatedIngredientList[index] = {
                ...updatedIngredientList[index],
                [field]: value
            }
            return {
                ...prev,
                ingredients: updatedIngredientList
            }
        })
    }

    const handleIngredientDelete = (indexToDelete) => {
        setFormData(prev => {
            const updatedIngredientList = prev.ingredients.filter((ingredient, index) => index !== indexToDelete)
            return {
                ...prev,
                ingredients: updatedIngredientList
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
                            ingredients: updatedIngredientList
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
        if (event.target.closest(".ingredient-input") || event.target.closest(".select-container") || event.target.closest(".autocomplete-input") || event.target.closest(".note-details") || event.target.closest(".description-details") || event.target.closest(".url-details")) {
            if (event.key === "Enter") {
                console.log("should prevent enter on textarea")
                return
            }
        }
        if (event.key === "Enter") {
            console.log("should save on enter")
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

    if (loading.allIngredients || loading.recipes || loading.cuisines || loading.amountTypes) {
        return <p className="warning">Loading...</p>
    }

    if (error.allIngredients || error.recipes || error.cuisines || error.amountTypes) {
        return <p className="warning error">Failed to load.</p>
    }

    return (
        <>
            <div className="edit-page" onKeyDown={handleKeyDown}>
                <div className="title-detail-box">
                    <label className="box-label" htmlFor="page-title">Recipe name*</label>
                    <input className="page-title" id="page-title" placeholder="Name your recipe" type="text" name="name" value={formData.name} onChange={handleChange}></input>
                </div>
                <div className="recipe-card">
                    <div className="top-details">
                        <div className="big-details">
                            <div className="big-detail-box">
                                <label className="box-label" htmlFor="description-details">Description</label>
                                <textarea className="description-details" id="description-details" placeholder="Brief description of your recipe" type="text" name="description" value={formData.description} onChange={handleChange}></textarea>
                            </div>
                            <div className="big-detail-box">
                                <label className="box-label" htmlFor="url-details">Link</label>
                                <textarea className="url-details" id="url-details" type="text" placeholder="Add a reference link" name="externalRecipeLink" value={formData.externalRecipeLink} onChange={handleChange}></textarea>
                            </div>
                        </div>

                        <div className="small-details">
                            <div className="small-detail-box">
                                <label className="box-label" htmlFor="servingCalories">Calories*</label>
                                <input name="servingCalories" id="servingCalories" className="small-detail-input" type="number" placeholder="kcal" value={formData.servingCalories} onChange={handleChange}></input>
                            </div>
                            <div className="small-detail-box">
                                <label className="box-label" htmlFor="servingCount">Servings*</label>
                                <input name="servingCount" id="servingCount" className="small-detail-input" type="number" placeholder="people" value={formData.servingCount} onChange={handleChange}></input>
                            </div>
                            <div className="small-detail-box">
                                <label className="box-label" htmlFor="cuisine">Cuisine*</label>
                                <Select options={cuisines}
                                    selected={selectedCuisine}
                                    onSelect={(value) => {
                                        setSelectedCuisine(value)
                                        handleChange({ target: { name: "cuisine", value } })
                                    }}
                                    getOptionLabel={(item) => item.cuisineTitle}
                                    placeholder="style"
                                    styleType="card-box"
                                    id="cuisine"
                                    dataTest="cuisine" />
                            </div>
                        </div >
                    </div>
                </div>

                <div>
                    <h4 className="box-title">Ingredients:</h4>
                    <EditRecipeIngriedientList ingredientList={formData.ingredients} handleIngredientAdd={handleIngredientAdd} handleIngredientChange={handleIngredientChange} handleIngredientDelete={handleIngredientDelete} handleAllIngredientsDelete={handleAllIngredientsDelete} allIngredients={allIngredients} fetchIngredients={fetchIngredients} amountTypes={amountTypes} />
                </div>

                <div>
                    <h4 className="box-title">Notes:</h4>
                    <textarea className="note-details" placeholder="Add instructions or notes" type="text" name="note" value={formData.note} onChange={handleChange}></textarea>
                </div>
                <div className="button-container">
                    {!isNew ? <button data-test="recipe-delete-button" className="recipe-button secondary-button" onClick={handleDelete}>Delete</button> : ""}
                    <button data-test="edit-cancel-button" className="recipe-button secondary-button" onClick={handleCancel}>Cancel</button>
                    <button data-test="recipe-save-button" className="recipe-button primary-button" onClick={handleSave}>Save</button>
                </div>
            </div >
        </>
    )
}
