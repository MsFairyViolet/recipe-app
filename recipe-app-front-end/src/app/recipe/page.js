"use client"

import { useState, useEffect } from "react"
import recipesData from "../../../data/mockrecipes.json"
import RecipeListPage from "../../components/RecipeList/RecipeListPage";

export default function RecipeListContainer() {
    const [recipes, setRecipes] = useState([])

    useEffect(() => {
        setRecipes(recipesData)
    }, [])

    // useEffect(() => {
    //     console.log(recipes[0])
    // })

    return (
            <RecipeListPage recipes={recipes} />
    );
}
