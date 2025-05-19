package nl.rmspek.recipes.service.persistence

import nl.rmspek.recipes.model.persistence.Recipe
import nl.rmspek.recipes.model.persistence.RecipeIngredient
import nl.rmspek.recipes.model.persistence.RecipeIngredientKey
import nl.rmspek.recipes.model.persistence.parseAmountType
import nl.rmspek.recipes.model.rest.RecipeView
import nl.rmspek.recipes.model.rest.toDbIngredient
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal

@Transactional
fun RecipeRepository.persistRecipe(
    recipeView: RecipeView,
): Recipe {
    val recipe = if (recipeView.id == null) {
        save(
            Recipe(
                recipeView.name,
                recipeView.description,
                recipeView.servingCalories,
                recipeView.servingCount,
                recipeView.cuisine,
                recipeView.note,
                recipeView.externalRecipeLink
            )
        )
    } else {
        findById(recipeView.id).orElseThrow().also { it.name = recipeView.name }
    }

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
