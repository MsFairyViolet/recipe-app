"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EditRecipe from "@components/EditRecipe/EditRecipe";

export default function EditRecipeContainer() {
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchRecipe = () => {
        fetch(`/api/recipe/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch recipe ${id}`)
                }
                return response.json()
            })
            .then((data) => {
                setRecipe(data)
                setLoading(false)
            })
            .catch((error) => {
                console.log(`Error fetching recipe ${id}: `, error)
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
                <EditRecipe recipe={recipe} />
            ) : error ? (
                <p className="warning error">Failed to fetch recipe</p>
            ) : (
                <p className="warning">Loading recipe...</p>
            )}
        </>
    );
}
