package nl.rmspek.recipes.model.rest

import nl.rmspek.recipes.model.persistence.Ingredient

data class IngredientView(
    val id: Long?,
    val name: String,
)

fun Ingredient.fromDb() = IngredientView(id, name)

fun IngredientView.toDb() = Ingredient(name).also { it.id = this.id }
