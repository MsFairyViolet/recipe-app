package nl.rmspek.recipes.model.rest

import nl.rmspek.recipes.model.persistence.Recipe

data class IngredientRecipeView(
    val id: Long?,
    val name: String,
)


fun Recipe.toIngredientRecipeView() = IngredientRecipeView(id, name)
