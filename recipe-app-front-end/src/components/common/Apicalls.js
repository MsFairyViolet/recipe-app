"use client"
// GET /ingredient
// /ingredients/page.js
// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
export async function getIngredients() {
   const response = await fetch(`/api/ingredient`)
   if (!response.ok) {
      throw new Error("Failed to fetch ingredients")
   }
   return response.json()
}



