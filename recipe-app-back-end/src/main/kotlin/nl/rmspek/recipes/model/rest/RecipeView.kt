package nl.rmspek.recipes.model.rest

import nl.rmspek.recipes.model.persistence.Recipe

data class RecipeView(
    val id: Long?,
    val name: String,
    val description: String,
    val servingCalories: Int,
    val servingCount: Int,
    val cuisine: String,
    val note: String,
    val externalRecipeLink: String?,
    val ingredients: MutableList<RecipeIngredientView>
)

fun Recipe.fromDb() = RecipeView(
    id,
    name,
    description,
    servingCalories,
    servingCount,
    cuisine?.title ?: "",
    note,
    externalRecipeLink,
    ingredients.map { it.fromDb() }.toMutableList()
)
