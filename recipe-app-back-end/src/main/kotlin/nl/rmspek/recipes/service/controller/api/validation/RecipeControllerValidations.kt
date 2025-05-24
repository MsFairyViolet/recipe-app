package nl.rmspek.recipes.service.controller.api.validation

import nl.rmspek.recipes.model.persistence.representationMap
import nl.rmspek.recipes.model.persistence.validCuisineTitle
import nl.rmspek.recipes.model.rest.RecipeView
import nl.rmspek.recipes.service.persistence.IngredientRepository
import nl.rmspek.recipes.service.persistence.RecipeRepository
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

fun validatePersistRecipe(
    recipeView: RecipeView,
    recipeRepository: RecipeRepository,
    ingredientRepository: IngredientRepository
) {
    val recipeByName = recipeRepository.findFirstByName(recipeView.name)
    if (recipeByName != null && recipeByName.id != recipeView.id) {
        throw ResponseStatusException(
            HttpStatus.UNPROCESSABLE_ENTITY,
            "Recipe with name ${recipeView.name} already exists"
        )
    }

    if (!validCuisineTitle(recipeView.cuisine)) {
        throw ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Could not parse cuisine ${recipeView.cuisine}.")
    }

    recipeView.ingredients.map { it.amountType }.forEach { amountString ->
        if (!representationMap.keys.contains(amountString)) {
            throw ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid unit type $amountString")
        }
    }

    if (!ingredientRepository.findAll().map { it.id }.containsAll(recipeView.ingredients.map { it.id })) {
        throw ResponseStatusException(HttpStatus.NOT_FOUND, "Not all ingredients exist.")
    }
}
