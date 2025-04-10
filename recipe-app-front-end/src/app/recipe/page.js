"use client"

import { useState, useEffect } from "react"
import recipesData from "@data/mockrecipes.json"
import RecipeListPage from "@components/RecipeList/RecipeListPage";

export default function RecipeListContainer() {
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // useEffect(() => {
    //     setRecipes(recipesData)
    // }, [])

    const fetchRecipes = () => {
        fetch("api/recipe")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch recipes")
            }
            return response.json()
        })
        .then((data) => {
            setRecipes(data)
            setLoading(false)
        })
        .catch((error) => {
            console.log("Error fetching recipes: ", error)
            setError(error.message)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchRecipes()
    }, [])
    
    // useEffect(() => {
    //     console.log(recipes[0])
    // })

    return (
            <RecipeListPage recipes={recipes} />
    );
}
