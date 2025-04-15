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
        <>
            <div className="page-header">
                <h1 className="page-title">Recipe List Page</h1>
            </div>

            <div className="recipe-list-container">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={"Search for recipe..."} />
                <RecipeList recipes={recipes} searchQuery={searchQuery} />
                <button className="recipe-button" onClick={handleRecipeAdd}>Add new recipe</button>
            </div>
        </>
    )
}