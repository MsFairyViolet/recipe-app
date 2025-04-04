"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EditRecipe from "@/components/EditRecipe/EditRecipe";
import recipesData from "../../../../../data/mockrecipes.json";

export default function EditRecipeContainer() {
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const foundRecipe = recipesData.find((recipe) => recipe.id === Number(id));
        setRecipe(foundRecipe);
    }, [id]);

    return (
        <>
                {recipe ? (
                    <EditRecipe recipe={recipe} />
                ) : (
                    <p className="no-results-message">Loading recipe...</p>
                )}
        </>
    );
}
