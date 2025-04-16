"use client"

import EditRecipe from "@components/EditRecipe/EditRecipe"

export default function NewRecipePage() {
   const emptyRecipe = {
      id: null,
      name: "",
      description: "",
      externalRecipeLink: "",
      servingCalories: "",
      servingCount: "",
      cuisine: "",
      note: "",
      ingredients: []
   }

   return (
      <EditRecipe recipe={emptyRecipe} isNew={true} />
   )

}