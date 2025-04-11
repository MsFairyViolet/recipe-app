"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ViewRecipe from "@components/ViewRecipe/ViewRecipe";

export default function ViewRecipeContainer() {
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchRecipe = () => {
        fetch(`/api/recipe/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch recipes")
                }
                return response.json()
            })
            .then((data) => {
                setRecipe(data)
                setLoading(false)
            })
            .catch((error) => {
                console.log("Error fetching recipes: ", error)
                setError(error.message)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchRecipe()
    }, [])

    return (
        <>
            {recipe ? (
                <ViewRecipe recipe={recipe} />
            ) : (
                <p className="no-results-message">Loading recipe...</p>
            )}
        </>
    );
}
