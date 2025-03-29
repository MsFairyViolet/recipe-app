package nl.rmspek.recipes.service.persistence

import nl.rmspek.recipes.model.persistence.Recipe
import nl.rmspek.recipes.model.persistence.RecipeIngredient
import nl.rmspek.recipes.model.persistence.RecipeIngredientKey
import nl.rmspek.recipes.model.rest.RecipeView
import nl.rmspek.recipes.model.rest.toDb
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal

@Transactional
fun RecipeRepository.persistRecipe(
    recipeView: RecipeView,
): Recipe {
    val recipe = if (recipeView.id == null) {
        save(Recipe(recipeView.name))
    } else {
        findById(recipeView.id).orElseThrow().also { it.name = recipeView.name }
    }

    recipe.ingredients.clear()

    recipe.ingredients.addAll(
        recipeView.ingredients.map { recipeIngredientView ->
            RecipeIngredient(
                BigDecimal(recipeIngredientView.amount),
                recipeIngredientView.amountType,
            ).also { recipeIngredient ->
                val ingredient =  recipeIngredientView.ingredient.toDb()
                recipeIngredient.id = RecipeIngredientKey(recipe.id, ingredient.id)
                recipeIngredient.recipe = recipe
                recipeIngredient.ingredient = ingredient
            }
        }
    )

    save(recipe)
    return recipe
}
