"use client"

import EditRecipe from "@components/EditRecipe/EditRecipe"

export default function NewRecipePage() {
   const emptyRecipe = {
      id: null,
      name: "",
      description: "",
      externalRecipeLink: "",
      servingCalories: null,
      servingCount: null,
      cuisine: "",
      note: "",
      ingredients: []
   }

   return (
      <EditRecipe recipe={emptyRecipe} isNew={true} />
   )

}