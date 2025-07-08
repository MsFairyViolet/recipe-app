"use client"

import { useState, useEffect } from "react"
import RecipeListPage from "@components/RecipeList/RecipeListPage";
import { getRecipes } from "@components/common/Apicalls"


export default function RecipeListContainer() {
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchRecipes = () => {
       getRecipes()
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
        <RecipeListPage recipes={recipes} error={error} />
    );
}
