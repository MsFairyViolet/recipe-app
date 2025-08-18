package nl.rmspek.recipes.util

import nl.rmspek.recipes.model.persistence.Cuisine
import nl.rmspek.recipes.model.persistence.Recipe
import nl.rmspek.recipes.model.rest.RecipeView

fun defaultRecipe(name: String = "recipe") = Recipe().also {
    it.name = name
    it.description = ""
    it.servingCalories = 1
    it.servingCount = 1
    it.cuisine = Cuisine.MEXICAN
    it.note = ""
    it.externalRecipeLink = ""
}

fun defaultRecipeView(id: Long? = null, name: String = "recipe") = RecipeView(
    id,
    name,
    "",
    1,
    1,
    Cuisine.MEXICAN.title,
    "",
    "",
    mutableListOf()
)
