// GET /ingredient

// /ingredients/page.js
const fetchIngredients = () => {
   fetch("/api/ingredient")
      .then((response) => {
         if (!response.ok) {
            throw new Error("Failed to fetch recipes")
         }
         return response.json()
      })
      .then((data) => {
         setIngredients(data)
         setLoading(false)
      })
      .catch((error) => {
         console.log("Error fetching recipes: ", error)
         setError(error.message)
         setLoading(false)
      })
}

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
const fetchGlobalIngredients = () => {
   fetch(`/api/ingredient`)
      .then((response) => {
         if (!response.ok) {
            throw new Error("Failed to fetch global ingredients")
         }
         return response.json()
      })
      .then((data) => {
         setGlobalIngredients(data)
         setLoading(false)
      })
      .catch((error) => {
         console.log("Error fetching global ingredients: ", error)
         setError(error.message)
         setLoading(false)
      })
}

// POST /ingredient

// /ingredients/page.js/IngredientsPage.js
const handleIngredientAdd = async () => {
   await confirm("Add new ingredient", "", true)
      .then((newIngredient) => {
         if (newIngredient) {
            const ingredientExists = ingredients.some(
               (ingredient) => ingredient.name.toLowerCase() === newIngredient.toLowerCase()
            )

            if (ingredientExists) {
               alert("That ingredient already exists!")
               return
            }

            fetch(`/api/ingredient`, {
               method: "POST",
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({ name: newIngredient })
            })
               .then((response) => {
                  if (!response.ok) {
                     throw new Error("Failed to add ingredient");
                  }
                  fetchIngredients()
               })
               .catch((error) => {
                  console.error("Error adding ingredient:", error);
                  alert("There was an error adding the ingredient.");
               })
         }
      })
}

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js/EditRecipeIngredientList.js
const handleQueryIngredientAdd = async (defaultName = "", index) => {
   await confirm("Add new global ingredient", defaultName, true)
      .then((queryIngredient) => {
         if (!queryIngredient) return

         const newIngredient = queryIngredient.trim();
         const ingredientExists = globalIngredients.some(
            (ingredient) => ingredient.name.toLowerCase() === newIngredient.toLowerCase()
         );

         if (ingredientExists) {
            alert("That ingredient already exists! Please modify the name and try again.")
            return
         }

         fetch(`/api/ingredient`, {
            method: "POST",
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newIngredient })
         })
            .then((response) => {
               if (!response.ok) {
                  throw new Error("Failed to add ingredient")
               }
               return response.json()
            })
            .then((data) => {
               fetchGlobalIngredients();

               if (data && data.name) {
                  handleIngredientChange(index, "name", data.name)
                  handleIngredientChange(index, "id", data.id)
               } else {
                  handleIngredientChange(index, "name", newIngredient)
               }
            })
            .catch((error) => {
               console.error("Error adding ingredient:", error)
               alert("There was an error adding the ingredient.")
            })
      })
}

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
                     throw new Error("Failed to update ingredient");
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
                     alert("Something went wrong when trying to delete the ingredient.")
                  }
               })
         }
      })
}

// GET /recipe

// RecipeList /recipe/page.js
const fetchRecipes = () => {
   fetch("/api/recipe")
      .then((response) => {
         if (!response.ok) {
            throw new Error("Failed to fetch recipes")
         }
         return response.json()
      })
      .then((data) => {
         setRecipes(data)
         setLoading(false)
      })
      .catch((error) => {
         console.log("Error fetching recipes: ", error)
         setError(error.message)
         setLoading(false)
      })
}

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
const fetchRecipes = () => {
   fetch("/api/recipe")
      .then((response) => {
         if (!response.ok) {
            throw new Error("Failed to fetch recipes")
         }
         return response.json()
      })
      .then((data) => {
         setRecipes(data)
         setLoading(false)
      })
      .catch((error) => {
         console.log("Error fetching recipes: ", error)
         setError(error.message)
         setLoading(false)
      })
}

// POST /recipe

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
const handleCreate = () => {
   const recipeExists = recipes.some(
      (recipe) => recipe.name.toLowerCase() === formData.name.toLowerCase()
   )

   if (recipeExists) {
      alert("A recipe with the same name already exists!")
      return
   }

   fetch("/api/recipe", {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
   })
      .then((response) => {
         if (!response.ok) {
            alert("There was a problem creating the recipe.")
            throw new Error("Failed to create recipe")
         }
         return response.json()
      })
      .then((savedRecipe) => {
         router.push(`/recipe/${savedRecipe.id}`)
      })
      .catch((error) => {
         console.error(error)
      })
}

// GET /recipe/id

// ViewRecipe /recipe/id/page.js
const fetchRecipe = () => {
   fetch(`/api/recipe/${id}`)
      .then((response) => {
         if (!response.ok) {
            throw new Error("Failed to fetch recipe")
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

// Edit Recipe /recipe/id/edit/page.js
const fetchRecipe = () => {
   fetch(`/api/recipe/${id}`)
      .then((response) => {
         if (!response.ok) {
            throw new Error(`Failed to fetch recipe.`)
         }
         return response.json()
      })
      .then((data) => {
         setRecipe(data)
         setLoading(false)
      })
      .catch((error) => {
         console.log(`Error fetching recipe.`)
         setError(error.message)
         setLoading(false)
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
         alert("Failed to update recipe.")
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

// GET /cuisine

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
const fetchCuisines = () => {
   fetch("/api/cuisine")
      .then((response) => {
         if (!response.ok) {
            throw new Error("Failed to fetch cuisines")
         }
         return response.json()
      })
      .then((data) => {
         setCuisines(data)
         setLoading(false)
      })
      .catch((error) => {
         console.log("Error fetching cuisines: ", error)
         setError(error.message)
         setLoading(false)
      })
}

// GET /amounttypes

// Edit Recipe /recipe/id/edit/page.js/EditRecipe.js
const fetchAmountTypes = () => {
   fetch("/api/amounttype")
      .then((response) => {
         if (!response.ok) {
            throw new Error("Failed to fetch amount types")
         }
         return response.json()
      })
      .then((data) => {
         setAmountTypes(data)
         setLoading(false)
      })
      .catch((error) => {
         console.log("Error fetching amount types: ", error)
         setError(error.message)
         setLoading(false)
      })
}

