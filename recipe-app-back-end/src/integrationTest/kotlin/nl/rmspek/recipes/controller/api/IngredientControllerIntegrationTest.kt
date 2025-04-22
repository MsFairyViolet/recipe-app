package nl.rmspek.recipes.controller.api

import com.fasterxml.jackson.databind.ObjectMapper
import nl.rmspek.recipes.BaseIntegrationTest
import nl.rmspek.recipes.model.persistence.*
import nl.rmspek.recipes.model.rest.IngredientView
import nl.rmspek.recipes.service.persistence.IngredientRepository
import nl.rmspek.recipes.service.persistence.RecipeRepository
import nl.rmspek.recipes.util.IterableNumberTypeAgnosticMatcher
import nl.rmspek.recipes.util.SingleNumberTypeAgnosticMatcher
import nl.rmspek.recipes.util.defaultRecipe
import org.hamcrest.CoreMatchers.`is`
import org.hamcrest.MatcherAssert
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.math.BigDecimal

class IngredientControllerIntegrationTest(
    @Autowired val ingredientRepository: IngredientRepository,
    @Autowired val recipeRepository: RecipeRepository,
): BaseIntegrationTest() {
    private fun getAll() = mockMvc.perform(
        MockMvcRequestBuilders
            .get("/api/ingredient")
            .accept(MediaType.APPLICATION_JSON)
    )

    @Test
    fun `all() returns success when no ingredient are present`() {
        getAll().andExpect(status().isOk())
    }

    @Test
    fun `all() returns one ingredient`() {
        val ingredient = ingredientRepository.save(Ingredient("testIngredient"))

        getAll()
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.*").isArray)
            .andExpect(MockMvcResultMatchers.jsonPath("$.[0].id", SingleNumberTypeAgnosticMatcher(ingredient.id)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.[1].id").doesNotExist())
    }

    @Test
    fun `all() returns multiple ingredients`() {
        val i1 = ingredientRepository.save(Ingredient("ingredient"))
        val i2 = ingredientRepository.save(Ingredient("otherIngredient"))

        getAll()
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.*").isArray)
            .andExpect(
                MockMvcResultMatchers.jsonPath("$.*.id").value(IterableNumberTypeAgnosticMatcher(listOf(i1.id, i2.id))))
    }


    private fun getOne(id: Long) = mockMvc.perform(
        MockMvcRequestBuilders
            .get("/api/ingredient/${id}")
            .accept(MediaType.APPLICATION_JSON)
    )

    @Test
    fun `getOne() returns one ingredient`() {
        val ingredient = ingredientRepository.save(Ingredient("testIngredient"))

        getOne(ingredient.id!!)
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", SingleNumberTypeAgnosticMatcher(ingredient.id)))
    }

    @Test
    fun `getOne() returns not found when there is no ingredient for that id`() {
        getOne(99).andExpect(status().isNotFound)
    }

    private fun createIngredient(ingredient: IngredientView) = mockMvc.perform(
        MockMvcRequestBuilders.post("/api/ingredient")
            .accept(MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON)
            .characterEncoding(Charsets.UTF_8)
            .content(ObjectMapper().writeValueAsString(ingredient))
    )
    @Test
    fun `create() saves a new ingredient`() {
        assertThat(ingredientRepository.findAll(), Matchers.emptyIterable())

        val ingredient = IngredientView(null, "foo")
        createIngredient(ingredient)
            .andExpect(status().isCreated)
            .andExpect(MockMvcResultMatchers.jsonPath("$.name", Matchers.`is`(ingredient.name)))

        assertThat(ingredientRepository.findAll().map { it.name }, Matchers.`is`(listOf(ingredient.name)))
    }

    @Test
    fun `create() responds with unprocessible entity if the ingredient name is already used`() {
        ingredientRepository.save(Ingredient("taken"))

        val ingredient = IngredientView(null, "taken")
        createIngredient(ingredient).andExpect(status().isUnprocessableEntity)

        assertThat(ingredientRepository.findAll().map { it.name }, Matchers.`is`(listOf("taken")))
    }

    @Test
    fun `create responds with unprocessible entity if the ingredientcontains an ID`() {
        createIngredient(IngredientView(1L, "foo"))
            .andExpect(status().isUnprocessableEntity)
    }

    private fun updateIngredient(
        id: Long,
        ingredientView: IngredientView
    ) = mockMvc.perform(
        MockMvcRequestBuilders.patch("/api/ingredient/$id")
            .accept(MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON)
            .characterEncoding(Charsets.UTF_8)
            .content(ObjectMapper().writeValueAsString(ingredientView))
    )

    @Test
    fun `updates changes an ingredient`() {
        val i = ingredientRepository.save(Ingredient("ingredient"))

        updateIngredient(
            i.id!!,
            IngredientView(i.id!!, "newname")
        ).andExpect(status().isOk)

        assertThat(ingredientRepository.findById(i.id!!).get().name, `is`("newname"))
    }

    @Test
    fun `update respons with 404 when an ingredient cannot be found`() {
        updateIngredient(
            3,
            IngredientView(3, "newname")
        ).andExpect(status().isNotFound)
    }

    @Test
    fun `update returns unprocessable entity if the ids do not match`() {
        val i = ingredientRepository.save(Ingredient("ingredient"))

        updateIngredient(
            i.id!!,
            IngredientView(i.id!! + 1, "newname")
        ).andExpect(status().isUnprocessableEntity)
    }

    @Test
    fun `update cannot change the name to that of another ingredient`() {
        val i1 = ingredientRepository.save(Ingredient("ingredient"))
        val i2 = ingredientRepository.save(Ingredient("takenName"))

        updateIngredient(
            i1.id!!,
            IngredientView(i1.id!!, i2.name)
        ).andExpect(status().isUnprocessableEntity)
    }

    private fun deleteIngredient(id: Long) = mockMvc.perform(
        MockMvcRequestBuilders.delete("/api/ingredient/$id")
            .accept(MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON)
            .characterEncoding(Charsets.UTF_8)
    )

    @Test
    fun `delete removes an ingredient`() {
        val i = ingredientRepository.save(Ingredient("ingredient"))

        deleteIngredient(
            i.id!!
        ).andExpect(status().isNoContent)

        assertThat(ingredientRepository.count(), `is`(0))
    }

    @Test
    fun `delete returns 404 when the ingredient does not exist`() {
        deleteIngredient(
            99L,
        ).andExpect(status().isNotFound)
    }

    @Test
    fun `delete fails if the ingredient is used in a recipe`() {
        val i1 = ingredientRepository.save(Ingredient( "one"))
        val dbRecipe = recipeRepository.save(defaultRecipe())

        dbRecipe.addIngredient(i1, BigDecimal(10), AmountType.STUK)
        recipeRepository.save(dbRecipe)

        deleteIngredient(i1.id!!).andExpect(status().isConflict)
    }
}
