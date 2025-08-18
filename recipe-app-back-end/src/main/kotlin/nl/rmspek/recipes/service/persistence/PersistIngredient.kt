package nl.rmspek.recipes.service.persistence

import nl.rmspek.recipes.model.persistence.Ingredient
import nl.rmspek.recipes.model.rest.IngredientView

fun IngredientRepository.persistIngredient(
    ingredientView: IngredientView
): Ingredient =  save(if (ingredientView.id == null) {
    Ingredient(ingredientView.name)
} else {
    findById(ingredientView.id).orElseThrow().also { it.name = ingredientView.name }
})
