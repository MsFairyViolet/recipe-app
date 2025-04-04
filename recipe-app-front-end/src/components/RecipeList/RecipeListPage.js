import { useState } from "react"
import SearchBar from "@common/SearchBar"
import RecipeList from "./RecipeList"

export default function RecipeListPage({recipes}) {
    const [searchQuery, setSearchQuery] = useState("")

return (
    <>
    <h1 className="page-title">Recipe List Page</h1>

    <div className="recipe-list-container">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={"Search for recipe..."}/>
        <RecipeList recipes={recipes} searchQuery={searchQuery}/>
    </div>
    </>
    )
}