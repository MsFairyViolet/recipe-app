package nl.rmspek.recipes.model.rest

import nl.rmspek.recipes.model.persistence.Recipe

data class RecipeView(
    val id: Long?,
    val name: String,
    val ingredients: MutableSet<RecipeIngredientView>
)

fun Recipe.fromDb() = RecipeView(id, name, ingredients.map { it.fromDb() }.toMutableSet())
