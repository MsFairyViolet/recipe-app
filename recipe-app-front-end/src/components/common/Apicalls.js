// /ingredients/page.js
// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
export async function getIngredients() {
   const response = await fetch(`/api/ingredient`)
   if (!response.ok) {
      throw new Error("Failed to fetch ingredients")
   }
   return response.json()
}

// RecipeList /recipe/page.js
// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
export async function getRecipes() {
   const response = await fetch(`/api/recipe`)
   if (!response.ok) {
      throw new Error("Failed to fetch recipes.")
   }
   return response.json()
}

// ViewRecipe /recipe/id/page.js
// Edit Recipe /recipe/id/edit/page.js
export async function getRecipe(id) {
   const response = await fetch(`/api/recipe/${id}`)
   if (!response.ok) {
      throw new Error(`Failed to fetch recipe.`)
   }
   return response.json()
}

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
export async function getCuisines() {
   const response = await fetch("/api/cuisine")
   if (!response.ok) {
      throw new Error("Failed to fetch cuisines.")
   }
   return response.json()
}

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
export async function getAmountTypes() {
   const response = await fetch("/api/amounttype")
   if (!response.ok) {
      throw new Error("Failed to fetch amount types.")
   }
   return response.json()
}

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js/EditRecipeIngredientList.js
// /ingredients/page.js/IngredientsPage.js
export async function addIngredient(name) {
   const response = await fetch('/api/ingredient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
   })

   if (!response.ok) {
      throw new Error('Failed to add ingredient.')
   }
   return response.json()
}

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
export async function createRecipe(recipe) {
   const response = await fetch("/api/recipe", {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify(recipe)
   })
   if (!response.ok) {
      throw new Error("Failed to create recipe.")
   }
   return response.json()
}

// /ingredients/page.js/IngredientsPage.js
export async function patchIngredient(id, updates) {
   const response = await fetch(`api/ingredient/${id}`, {
      method: "PATCH",
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
   })
   if (!response.ok) {
      throw new Error("Failed to update ingredient.");
   }
   return response.json()
}

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
export async function updateRecipe(recipe, newRecipe) {
   const response = await fetch(`/api/recipe/${recipe.id}`, {
      method: "PATCH",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify(newRecipe)
   })
   if (!response.ok) {
      throw new Error("Failed to update recipe.")
   }
   return response.json()
}

// /ingredients/page.js/IngredientsPage.js
export async function deleteIngredient(id) {
   const response = await fetch(`/api/ingredient/${id}`, {
      method: "DELETE",
   })

   if (!response.ok) {
      throw new Error("Failed to delete ingredient.")
   }
}

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
export async function deleteRecipe(id) {
   const response = await fetch(`/api/recipe/${id}`, {
      method: "DELETE",
   })

   if (!response.ok) {
      throw new Error("Failed to delete recipe.")
   }
}
