package nl.rmspek.recipes.model.rest

import nl.rmspek.recipes.model.persistence.Ingredient

data class IngredientView(
    val id: Long?,
    val name: String,
    var recipes: MutableList<IngredientRecipeView> = mutableListOf()
)

fun Ingredient.fromDb() = IngredientView(
    id,
    name,
).also {
    it.recipes = recipeIngredients.map { it.recipe.toIngredientRecipeView() }.toMutableList()
}

fun IngredientView.toDb() = Ingredient(name).also { it.id = this.id }
