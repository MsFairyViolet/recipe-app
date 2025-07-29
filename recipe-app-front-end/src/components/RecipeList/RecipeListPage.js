import { useState } from "react"
import { useRouter } from "next/navigation"
import SearchBar from "@common/SearchBar"
import RecipeList from "./RecipeList"

export default function RecipeListPage({ recipes }) {
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter();

    const handleRecipeAdd = () => {
        router.push("/recipe/new")
    }

    return (
        <div className="recipe-page">
            <div className="page-header">
                <div className="page-title">Recipes</div>
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={"Search for recipe..."} />
            </div>

            <div className="recipes-container">
                <RecipeList recipes={recipes} searchQuery={searchQuery} />
                <button data-test="new-recipe-button" className="recipe-button primary-button" onClick={handleRecipeAdd}>Add new recipe</button>
            </div>
        </div>
    )
}