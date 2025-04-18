import { useState } from "react";
import IngredientsList from "./IngredientsList";
import SearchBar from "@components/common/SearchBar";

export default function IngredientsPage({ ingredients }) {
    const [searchQuery, setSearchQuery] = useState("")

    const handleIngredientAdd = () => {
        return
    }

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">All Ingredients Page</h1>
            </div>
            <div className="ingredients-container">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={"Search for ingredient..."} />
                <IngredientsList ingredients={ingredients} searchQuery={searchQuery} />
                <button className="ingredient-button" onClick={handleIngredientAdd}>Add new ingredient</button>
            </div>
        </>
    )
}