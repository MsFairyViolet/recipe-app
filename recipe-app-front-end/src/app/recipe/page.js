"use client"

import { useState, useEffect } from "react"
import recipesData from "../../../data/mockrecipes.json"
import RecipeListPage from "../../components/RecipeList/RecipeListPage";

export default function RecipeApp() {
    const [recipes, setRecipes] = useState([])

    useEffect(() => {
        setRecipes(recipesData)
    }, [])

    useEffect(() => {
        console.log(recipes[0])
    })

    return (
        <div className="app">
            <main>
                <RecipeListPage recipes={recipes} />
            </main>
        </div>
    );
}
