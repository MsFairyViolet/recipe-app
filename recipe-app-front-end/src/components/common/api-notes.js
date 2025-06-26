// PATCH /ingredient

// /ingredients/page.js/IngredientsPage.js
const handleIngredientEdit = async (index) => {
   const ingredient = ingredients[index]

   await confirm("Globally edit", ingredient.name, true)
      .then((newName) => {

         if (newName && newName.toLowerCase() !== ingredient.name.toLowerCase()) {
            const nameExists = ingredients.some(
               (i) => i.name.toLowerCase() === newName.toLowerCase() && i.id !== ingredient.id
            )

            if (nameExists) {
               alert("Another ingredient with that name already exists!")
               return
            }

            fetch(`api/ingredient/${ingredient.id}`, {
               method: "PATCH",
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({ ...ingredient, name: newName })
            })
               .then((response) => {
                  if (!response.ok) {
                     throw new Error("Failed to update ingredient.");
                  }
                  fetchIngredients()
               })
               .catch((error) => {
                  console.error("Error updating ingredient:", error);
                  alert("There was an error updating the ingredient.");
               })
         }
      })
}

// DELETE /ingredient

// /ingredients/page.js/IngredientsPage.js
const handleIngredientDelete = async (index) => {

   const ingredient = ingredients[index]
   const usedInCount = ingredient.recipes.length

   if (usedInCount > 0) {
      alert("You can't delete an ingredient globally if it is being used in recipes. Please remove it manually from the associated recipes.")
      return
   }

   await confirm("Do you want to globally delete:", ingredient.name)
      .then((confirmed) => {
         if (!confirmed) {
            return
         }
         if (confirmed) {
            fetch(`/api/ingredient/${ingredient.id}`, {
               method: "DELETE",
            })
               .then((response) => {
                  if (response.ok) {
                     fetchIngredients()
                  } else {
                     console.error("Failed to delete")
                     alert("Failed to delete ingredient.")
                  }
               })
         }
      })
}

// PATCH /recipe/id

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
const handleUpdate = async () => {
   const recipeExists = recipes.some(
      (recipe) => recipe.id !== formData.id && recipe.name.toLowerCase() === formData.name.toLowerCase()
   )

   if (recipeExists) {
      alert("A recipe with the same name already exists!")
      return
   }

   fetch(`/api/recipe/${recipe.id}`, {
      method: "PATCH",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
   })
      .then((response) => {
         if (!response.ok) {
            throw new Error("Failed to update recipe.")
         }
         router.push(`/recipe/${recipe.id}`)
      })
      .catch((error) => {
         console.error(error)
         alert("There was an error updating the recipe.")
      })
}

// DELETE /recipe/id

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
const handleDelete = async () => {
   await confirm("Do you want to delete the recipe for", recipe.name)
      .then((confirmed) => {
         if (confirmed) {
            fetch(`/api/recipe/${recipe.id}`, {
               method: "DELETE",
               headers: {
                  "Content-Type": "application/json"
               }
            })
               .then((response) => {
                  if (!response.ok) {
                     throw new Error("Failed to delete recipe")
                  }
                  router.push("/recipe")
               })
               .catch((error) => {
                  console.error(error)
                  alert("There was an error deleting the recipe.")
               })
         }
      })
}
