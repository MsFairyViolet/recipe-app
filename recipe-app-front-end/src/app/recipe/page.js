"use client"

import { useState, useEffect } from "react"
import RecipeListPage from "@components/RecipeList/RecipeListPage";

export default function RecipeListContainer() {
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchRecipes = () => {
        fetch("/api/recipe")
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

    return (
            <RecipeListPage recipes={recipes} />
    );
}
