package nl.rmspek.recipes.util

import nl.rmspek.recipes.model.persistence.Recipe
import nl.rmspek.recipes.model.rest.RecipeView
import nl.rmspek.recipes.model.rest.fromDb

fun defaultRecipe(name: String = "recipe") = Recipe(name, "", 1, 1, "", "", "")

fun defaultRecipeView(id: Long? = null, name: String = "recipe") = RecipeView(id, name, "", 1, 1, "", "", "", mutableListOf())
