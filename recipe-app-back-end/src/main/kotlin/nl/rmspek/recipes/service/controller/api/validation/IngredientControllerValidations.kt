package nl.rmspek.recipes.service.controller.api.validation

import nl.rmspek.recipes.model.rest.IngredientView
import nl.rmspek.recipes.service.persistence.IngredientRepository
import nl.rmspek.recipes.service.persistence.RecipeRepository
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

fun validatePersistIngredient(
    ingredientView: IngredientView,
    ingredientRepository: IngredientRepository
) {
    if (ingredientRepository.findFirstByName(ingredientView.name) != null) {
        throw ResponseStatusException(
            HttpStatus.UNPROCESSABLE_ENTITY,
            "Ingredient with name ${ingredientView.name} already exists"
        )
    }
}

fun validateIngredientExistence(id: Long, ingredientRepository: IngredientRepository) {
    if (ingredientRepository.findById(id).isEmpty) {
        throw ResponseStatusException(HttpStatus.NOT_FOUND, "Can not find Ingredient with id $id")
    }
}

fun validateIngredientUnused(id: Long, recipeRepository: RecipeRepository) {
    val recipes = recipeRepository.byIngredientId(id)
    if (recipes.any()) {
        throw ResponseStatusException(
            HttpStatus.CONFLICT,
            "Ingredient is used in recipes: ${recipes.joinToString { it.id?.toString() ?: "" }}"
        )
    }
}
