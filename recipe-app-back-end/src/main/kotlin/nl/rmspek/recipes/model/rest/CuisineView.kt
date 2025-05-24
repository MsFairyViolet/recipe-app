package nl.rmspek.recipes.model.rest

import nl.rmspek.recipes.model.persistence.Cuisine

data class CuisineView(val cuisineTitle: String)

fun Cuisine.toView() = CuisineView(this.title)
