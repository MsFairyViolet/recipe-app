package nl.rmspek.recipes.model.rest

import nl.rmspek.recipes.model.persistence.RecipeIngredient

data class RecipeIngredientView(
    val ingredient: IngredientView,
    val amount: Long,
    val amountType: String
)

fun RecipeIngredient.fromDb() = RecipeIngredientView(
    ingredient.fromDb(),
    amountValue.toLong(),
    amountType.present()
)
