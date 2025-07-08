import { useState } from "react";
import { useRouter } from "next/navigation"
import IngredientsList from "./IngredientsList";
import SearchBar from "@components/common/SearchBar";
import { useConfirm } from "@components/common/ConfirmProvider";
import { addIngredient, patchIngredient, deleteIngredient } from "@components/common/Apicalls"


export default function IngredientsPage({ ingredients, fetchIngredients, error }) {
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
                            alert("There was an error adding the ingredient.");
                        })
                }
            })
    }

    const handleIngredientEdit = async (index) => {
        const ingredient = ingredients[index]

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

                    patchIngredient(ingredient.id, {name: newName })
                        .then(() => {
                            fetchIngredients()
                        })
                        .catch((error) => {
                            console.error("Error updating ingredient:", error);
                            alert("There was an error updating the ingredient.");
                        })
                }
            })
    }

    const handleIngredientDelete = async (index) => {

        const ingredient = ingredients[index]
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
                        alert("Something went wrong when trying to delete the ingredient.")
                    })
            })
    }

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">All Ingredients</h1>
            </div>
            <div className="ingredients-container">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={"Search for ingredient..."} />
                <IngredientsList ingredients={ingredients} searchQuery={searchQuery} onIngredientEdit={handleIngredientEdit} onIngredientDelete={handleIngredientDelete} />
                <button data-test="new-global-ingredient-button" className="ingredient-button" onClick={handleIngredientAdd}>Add new ingredient</button>
            </div>
        </>
    )
}