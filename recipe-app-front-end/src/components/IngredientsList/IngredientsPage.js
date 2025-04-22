import { useState } from "react";
import { useRouter } from "next/navigation"
import IngredientsList from "./IngredientsList";
import SearchBar from "@components/common/SearchBar";
import { useConfirm } from "@components/common/ConfirmProvider";

export default function IngredientsPage({ ingredients, fetchIngredients }) {
    const [searchQuery, setSearchQuery] = useState("")
    const confirm = useConfirm();
    const router = useRouter();

    const handleIngredientAdd = () => {
        return
    }

    const handleIngredientEdit = async (index) => {
        const ingredient = ingredients[index]

        const newName = await confirm("Globally edit", ingredient.name, true)

        if (newName && newName !== ingredient.name) {
            try {
                const response = await fetch(`api/ingredient/${ingredient.id}`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...ingredient, name: newName })
                })
                if (!response.ok) {
                    throw new Error("Failed to update ingredient");
                }
                fetchIngredients()
            }
            catch (error) {
                console.error("Error updating ingredient:", error);
                alert("There was an error updating the ingredient.");
            }
        }
    }

    const handleIngredientDelete = async (index) => {
        const confirmed = await confirm(
            "Do you want to globally delete:",
            ingredients[index].name
        );

        if (confirmed) {
            const res = await fetch(`/api/ingredient/${ingredients[index].id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                console.log("Deleted");
            } else {
                console.error("Failed to delete");
                alert("You can't delete an ingredient globally if it is being used in recipes.")
                //Show list of where ingredient is used and provide option to remove it there
            }
        }
    };

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