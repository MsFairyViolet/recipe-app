"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ViewRecipe from "@components/ViewRecipe/ViewRecipe";
import { getRecipe } from "@components/common/Apicalls"


export default function ViewRecipeContainer() {
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchRecipe = () => {
        getRecipe(id)
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
            ) :
                error ? (
                    <p className="warning error">Failed to fetch recipe</p>
                ) : (
                    <p className="warning">Loading recipe...</p>
                )

            }
        </>
    );
}
