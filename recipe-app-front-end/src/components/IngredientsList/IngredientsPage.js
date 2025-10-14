import { useState } from "react";
import { useRouter } from "next/navigation"
import IngredientsList from "./IngredientsList";
import SearchBar from "@components/common/SearchBar";
import { useConfirm } from "@components/common/ConfirmProvider";
import { addIngredient, patchIngredient, deleteIngredient } from "@components/common/Apicalls"


export default function IngredientsPage({ ingredients, fetchIngredients }) {
    const [searchQuery, setSearchQuery] = useState("")
    const confirm = useConfirm();
    const router = useRouter();

    const handleIngredientAdd = async () => {
        await confirm("Add new ingredient", "", true)
            .then((newIngredient) => {
                if (newIngredient) {
                    const ingredientExists = ingredients.some(
                        (ingredient) => ingredient.name.toLowerCase() === newIngredient.toLowerCase()
                    )

                    if (ingredientExists) {
                        alert("That ingredient already exists!")
                        return
                    }

                    addIngredient(newIngredient)
                        .then(() => {
                            fetchIngredients()
                        })
                        .catch((error) => {
                            console.error("Error adding ingredient:", error);
                            alert("Failed to add the ingredient.");
                        })
                }
            })
    }

    const handleIngredientEdit = async (ingredient) => {

        console.log("Ingredient edit:", ingredient)
        await confirm("Globally edit", ingredient.name, true)
            .then((newName) => {

                if (newName && newName.toLowerCase() !== ingredient.name.toLowerCase()) {
                    const nameExists = ingredients.some(
                        (i) => i.name.toLowerCase() === newName.toLowerCase() && i.id !== ingredient.id
                    )

                    if (nameExists) {
                        alert("Another ingredient with that name already exists!")
                        return
                    }

                    patchIngredient(ingredient.id, { name: newName })
                        .then(() => {
                            fetchIngredients()
                        })
                        .catch((error) => {
                            console.error("Error updating ingredient:", error);
                            alert("Failed to update the ingredient.");
                        })
                }
            })
    }

    const handleIngredientDelete = async (ingredient) => {

        console.log("Ingredient delete:", ingredient)

        const usedInCount = ingredient.recipes.length

        if (usedInCount > 0) {
            alert("You can't delete an ingredient globally if it is being used in recipes. Please remove it manually from the associated recipes.")
            return
        }

        await confirm("Do you want to globally delete:", ingredient.name)
            .then((confirmed) => {
                if (!confirmed) return

                deleteIngredient(ingredient.id)
                    .then(() => {
                        fetchIngredients()
                    })
                    .catch((error) => {
                        console.error("Failed to delete:", error)
                        alert("Failed to delete the ingredient.")
                    })
            })
    }

    return (
        <div className="ingredients-page">
            <div className="page-header">
                <div className="page-title">Ingredients</div>
                <SearchBar value={searchQuery} changeValue={setSearchQuery} placeholder={"Search for ingredient..."} />
            </div>

            <div className="ingredients-container">
                <IngredientsList ingredients={ingredients} searchQuery={searchQuery} onIngredientEdit={handleIngredientEdit} onIngredientDelete={handleIngredientDelete} />
                <div className="button-container">
                    <button data-test="new-global-ingredient-button" className="ingredient-button primary-button" onClick={handleIngredientAdd}>Add new ingredient</button>
                </div>
            </div>

        </div>
    )
}