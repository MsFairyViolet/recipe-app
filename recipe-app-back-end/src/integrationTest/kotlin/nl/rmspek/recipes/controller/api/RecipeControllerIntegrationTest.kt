package nl.rmspek.recipes.controller.api

import com.fasterxml.jackson.databind.ObjectMapper
import nl.rmspek.recipes.BaseIntegrationTest
import nl.rmspek.recipes.model.persistence.Ingredient
import nl.rmspek.recipes.model.persistence.Recipe
import nl.rmspek.recipes.model.persistence.RecipeIngredient
import nl.rmspek.recipes.model.persistence.RecipeIngredientKey
import nl.rmspek.recipes.model.rest.IngredientView
import nl.rmspek.recipes.model.rest.RecipeIngredientView
import nl.rmspek.recipes.service.persistence.RecipeRepository
import nl.rmspek.recipes.model.rest.RecipeView
import nl.rmspek.recipes.model.rest.fromDb
import nl.rmspek.recipes.service.persistence.IngredientRepository
import nl.rmspek.recipes.util.IterableNumberTypeAgnosticMatcher
import nl.rmspek.recipes.util.SingleNumberTypeAgnosticMatcher
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.math.BigDecimal

class RecipeControllerIntegrationTest(
    @Autowired val recipeRepository: RecipeRepository,
    @Autowired val ingredientRepository: IngredientRepository
) : BaseIntegrationTest() {
    private fun getAll() = mockMvc.perform(
        MockMvcRequestBuilders
            .get("/api/recipe")
            .accept(MediaType.APPLICATION_JSON)
    )

    @Test
    fun `all() returns success when no recipes are present`() {
        getAll().andExpect(status().isOk())
    }

    @Test
    fun `all() returns one recipe`() {
        val recipe = recipeRepository.save(Recipe("testfood"))

        getAll()
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.*").isArray)
            .andExpect(jsonPath("$.[0].id", SingleNumberTypeAgnosticMatcher(recipe.id)))
            .andExpect(jsonPath("$.[1].id").doesNotExist())
    }

    @Test
    fun `all() returns multiple recipes`() {
        val r1 = recipeRepository.save(Recipe( "testfood"))
        val r2 = recipeRepository.save(Recipe( "testOther"))

        getAll()
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.*").isArray)
            .andExpect(jsonPath("$.*.id").value(IterableNumberTypeAgnosticMatcher(listOf(r1.id, r2.id))))
    }

    private fun createRecipe(recipe: RecipeView) = mockMvc.perform(
            MockMvcRequestBuilders.post("/api/recipe")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding(Charsets.UTF_8)
                .content(ObjectMapper().writeValueAsString(recipe))
        )
    @Test
    fun `create() saves a new recipe witout ingredients`() {
        assertThat(recipeRepository.findAll(), emptyIterable())

        val recipe = RecipeView(null, "foo", mutableSetOf())
        createRecipe(recipe)
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.name", `is`(recipe.name)))

        assertThat(recipeRepository.findAll().map { it.name }, `is`(listOf(recipe.name)))
    }

    @Test
    fun `create() responds with unprocessible entity if the recipe name is already used`() {
        recipeRepository.save(Recipe( "taken"))

        val recipe = RecipeView(null, "taken", mutableSetOf())
        createRecipe(recipe).andExpect(status().isUnprocessableEntity)

        assertThat(recipeRepository.findAll().map { it.name }, `is`(listOf("taken")))
    }

    @Test
    fun `create responds with unprocessible entity if the recipe contains an ID`() {
        createRecipe(RecipeView(1L, "foo", mutableSetOf()))
            .andExpect(status().isUnprocessableEntity)
    }

    @Test
    fun `create() saves a new recipe with ingredients`() {
        val ingredient = ingredientRepository.save(Ingredient("ingredient"))

        val recipe = RecipeView(null, "foo", mutableSetOf(RecipeIngredientView(ingredient.fromDb(), 1L, "unit")))
        createRecipe(recipe)
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.name", `is`(recipe.name)))

        val dbRecipe = recipeRepository.findAll().first()
        assertThat(dbRecipe.name, `is`(recipe.name))
        assertThat(dbRecipe.ingredients.first().ingredient.id, `is`(ingredient.id))
    }

    @Test
    fun `create throws an error if it tries to create a recipe with non existent ingredients`() {
        createRecipe(
            RecipeView(
                null,
                "foo",
                mutableSetOf(
                    RecipeIngredientView(IngredientView(1L, "ingredient"), 1L, "unit")
                )
            )
        ).andExpect(status().isNotFound)
    }

    @Test
    fun `create throws an error if it tries to create one with a mix of existing and non existent ingredients`() {
        val i1 = ingredientRepository.save(Ingredient( "one"))
        val i2 = ingredientRepository.save(Ingredient( "two"))
        createRecipe(
            RecipeView(
                null,
                "foo",
                mutableSetOf(
                    RecipeIngredientView(IngredientView(i2.id!! + 1L, "Missing ingredient 1"), 1L, "unit"),
                    RecipeIngredientView(IngredientView(i2.id!! + 2L, "Missing ingredient 2"), 1L, "unit"),
                    RecipeIngredientView(IngredientView(i1.id, "Ingredient 1"), 1L, "unit"),
                    RecipeIngredientView(IngredientView(i2.id, "Ingredient 2"), 1L, "unit"),
                )
            )
        ).andExpect(status().isNotFound)
    }

    private fun updateRecipe(id: Long, recipe: RecipeView) = mockMvc.perform(
        MockMvcRequestBuilders.patch("/api/recipe/${id}")
            .accept(MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON)
            .characterEncoding(Charsets.UTF_8)
            .content(ObjectMapper().writeValueAsString(recipe))
    )
    @Test
    fun `update adds new ingredients`() {
        val i1 = ingredientRepository.save(Ingredient( "one"))
        val i2 = ingredientRepository.save(Ingredient( "two"))
        val dbRecipe = recipeRepository.save(
            Recipe("recipe")
        ).also { recipe ->
            recipe.ingredients += RecipeIngredient(BigDecimal(10), "units").also {
                it.ingredient = i1
                it.recipe = recipe
                it.id = RecipeIngredientKey(recipe.id, i1.id)
            }
            recipeRepository.save(recipe)
        }

        updateRecipe(
            dbRecipe.id!!,
            dbRecipe.fromDb().also {
                it.ingredients += RecipeIngredientView(i2.fromDb(), 10, "units")
            }
        ).andExpect(status().isOk)

        assertThat(recipeRepository.findAll().first().ingredients, hasSize(2))
}
    @Test
    fun `update removes unused ingredients`() {
        val i1 = ingredientRepository.save(Ingredient( "one"))
        val i2 = ingredientRepository.save(Ingredient( "two"))
        val dbRecipe = recipeRepository.save(
            Recipe("recipe")
        ).also { recipe ->
            recipe.ingredients += RecipeIngredient(BigDecimal(10), "units").also {
                it.ingredient = i1
                it.recipe = recipe
                it.id = RecipeIngredientKey(recipe.id, i1.id)
            }
            recipe.ingredients += RecipeIngredient(BigDecimal(10), "units").also {
                it.ingredient = i2
                it.recipe = recipe
                it.id = RecipeIngredientKey(recipe.id, i2.id)
            }
            recipeRepository.save(recipe)
        }

        updateRecipe(
            dbRecipe.id!!,
            dbRecipe.fromDb().also {
                it.ingredients.remove(it.ingredients.first())
            }
        ).andExpect(status().isOk)

        assertThat(recipeRepository.findAll().first().ingredients, hasSize(1))
    }

    @Test
    fun `update can clear all the ingredients of a recipe`() {

        val i1 = ingredientRepository.save(Ingredient( "one"))
        val i2 = ingredientRepository.save(Ingredient( "two"))
        val dbRecipe = recipeRepository.save(
            Recipe("recipe")
        ).also { recipe ->
            recipe.ingredients += RecipeIngredient(BigDecimal(10), "units").also {
                it.ingredient = i1
                it.recipe = recipe
                it.id = RecipeIngredientKey(recipe.id, i1.id)
            }
            recipe.ingredients += RecipeIngredient(BigDecimal(10), "units").also {
                it.ingredient = i2
                it.recipe = recipe
                it.id = RecipeIngredientKey(recipe.id, i2.id)
            }
            recipeRepository.save(recipe)
        }

        updateRecipe(
            dbRecipe.id!!,
            dbRecipe.fromDb().also {
                it.ingredients.clear()
            }
        ).andExpect(status().isOk)

        assertThat(recipeRepository.findAll().first().ingredients, hasSize(0))
    }


    @Test
    fun `update updates the values of existing ingredients`() {
        val i1 = ingredientRepository.save(Ingredient( "one"))
        val dbRecipe = recipeRepository.save(
            Recipe("recipe")
        ).also { recipe ->
            recipe.ingredients += RecipeIngredient(BigDecimal(10), "units").also {
                it.ingredient = i1
                it.recipe = recipe
                it.id = RecipeIngredientKey(recipe.id, i1.id)
            }
        }

        updateRecipe(
            dbRecipe.id!!,
            dbRecipe.fromDb().also {
                it.ingredients.clear()
                it.ingredients += RecipeIngredientView(i1.fromDb(), 14, "blorgons")
            }
        ).andExpect(status().isOk)

        val newRecipe = recipeRepository.findAll().first()
        assertThat(newRecipe.ingredients, hasSize(1))
        val recipeIngredient = newRecipe.ingredients.first()
        assertThat(recipeIngredient.amountValue, `is`(BigDecimal("14.00")))
        assertThat(recipeIngredient.amountType, `is`("blorgons"))
    }

    @Test
    fun `update can rename a recipe`() {
        val dbRecipe = recipeRepository.save(
            Recipe("recipe")
        )

        updateRecipe(
            dbRecipe.id!!,
            RecipeView(dbRecipe.id, "new name", mutableSetOf())
        ).andExpect(status().isOk)

        assertThat(recipeRepository.findAll().first().name, `is`("new name"))
    }

    @Test
    fun `update can save a recipe without ingredients`() {
        val dbRecipe = recipeRepository.save(
            Recipe("recipe")
        )

        updateRecipe(
            dbRecipe.id!!,
            RecipeView(dbRecipe.id, "recipe", mutableSetOf())
        ).andExpect(status().isOk)

        assertThat(recipeRepository.findAll().first().name, `is`("recipe"))
    }

    @Test
    fun `update returns 404 when the recipe does not exist`() {
        updateRecipe(
            1,
            RecipeView(1, "recipe", mutableSetOf())
        ).andExpect(status().isNotFound)
    }

    @Test
    fun `update cannot change the name to an existing recipe name`() {
        recipeRepository.save(Recipe("first"))
        val second = recipeRepository.save(Recipe("second"))
        updateRecipe(
            second.id!!,
            RecipeView(second.id, "first", mutableSetOf())
        ).andExpect(status().isUnprocessableEntity)
    }

    @Test
    fun `update fails when not all ingredients exist`() {
        val recipe = recipeRepository.save(Recipe("recipe"))
        updateRecipe(
            recipe.id!!,
            RecipeView(
                recipe.id,
                "recipe",
                mutableSetOf(
                    RecipeIngredientView(IngredientView(1, "ingredient"), 5, "units")
                )
            )
        ).andExpect(status().isNotFound)
    }
}
