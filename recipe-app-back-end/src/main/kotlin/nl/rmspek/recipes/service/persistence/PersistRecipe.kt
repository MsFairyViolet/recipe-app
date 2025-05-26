package nl.rmspek.recipes.service.persistence

import nl.rmspek.recipes.model.persistence.*
import nl.rmspek.recipes.model.rest.RecipeView
import nl.rmspek.recipes.model.rest.toDbIngredient
import org.springframework.http.HttpStatus
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal

@Transactional
fun RecipeRepository.persistRecipe(
    recipeView: RecipeView,
): Recipe {
    val recipe = if (recipeView.id == null) {
        Recipe()
    } else {
        findById(recipeView.id).orElseThrow().also { it.name = recipeView.name }
    }

    recipe.name = recipeView.name
    recipe.description = recipeView.description
    recipe.servingCalories = recipeView.servingCalories
    recipe.servingCount = recipeView.servingCount
    recipe.cuisine = cuisineByTitle(recipeView.cuisine)
    recipe.note = recipeView.note
    recipe.externalRecipeLink = recipeView.externalRecipeLink
    save(recipe)

    recipe.ingredients.clear()
    recipe.ingredients.addAll(
        recipeView.ingredients.mapIndexed { index, recipeIngredientView->
            RecipeIngredient(
                BigDecimal(recipeIngredientView.amount),
                recipeIngredientView.parseAmountType(),
            ).also { recipeIngredient ->
                val ingredient =  recipeIngredientView.toDbIngredient()
                recipeIngredient.id = RecipeIngredientKey(recipe.id, ingredient.id)
                recipeIngredient.recipe = recipe
                recipeIngredient.ingredient = ingredient
                recipeIngredient.ordinal = index
            }
        }
    )

    save(recipe)
    return recipe
}
