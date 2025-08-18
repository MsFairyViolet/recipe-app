package nl.rmspek.recipes.model.rest

import nl.rmspek.recipes.model.persistence.Ingredient
import nl.rmspek.recipes.model.persistence.RecipeIngredient

data class RecipeIngredientView(
    val id: Long?,
    val name: String,
    val amount: String,
    val amountType: String
)

fun RecipeIngredient.fromDb() = RecipeIngredientView(
    ingredient.id,
    ingredient.name,
    amountValue.toPlainString(),
    amountType.present()
)

fun RecipeIngredientView.toDbIngredient() = Ingredient(this.name).also { it.id = this.id }
