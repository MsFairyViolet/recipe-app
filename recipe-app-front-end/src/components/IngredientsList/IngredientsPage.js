import { useState } from "react";
import { useRouter } from "next/navigation"
import IngredientsList from "./IngredientsList";
import SearchBar from "@components/common/SearchBar";
import { useConfirm } from "@components/common/ConfirmProvider";

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

                    fetch(`/api/ingredient`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: newIngredient })
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Failed to add ingredient");
                            }
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

                    fetch(`api/ingredient/${ingredient.id}`, {
                        method: "PATCH",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ...ingredient, name: newName })
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Failed to update ingredient");
                            }
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
                if (!confirmed) {
                    return
                }
                if (confirmed) {
                    fetch(`/api/ingredient/${ingredient.id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            if (response.ok) {
                                fetchIngredients()
                            } else {
                                console.error("Failed to delete")
                                alert("Something went wrong when trying to delete the ingredient.")
                            }
                        })
                }
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
                <button className="ingredient-button" onClick={handleIngredientAdd}>Add new ingredient</button>
            </div>
        </>
    )
}