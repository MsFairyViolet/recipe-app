"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import recipesData from "@data/mockrecipes.json";
import ViewRecipe from "@components/ViewRecipe/ViewRecipe";

export default function ViewRecipeContainer() {
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const foundRecipe = recipesData.find((recipe) => recipe.id === Number(id));
        setRecipe(foundRecipe);
    }, [id]);

    // useEffect(() => {
    //     console.log(recipe);
    // }, [recipe]);

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
