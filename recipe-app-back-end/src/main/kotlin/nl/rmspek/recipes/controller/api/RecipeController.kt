package nl.rmspek.recipes.controller.api;

import nl.rmspek.recipes.model.persistence.Recipe
import nl.rmspek.recipes.model.rest.RecipeView
import nl.rmspek.recipes.model.rest.fromDb
import nl.rmspek.recipes.service.controller.api.validation.validatePersistRecipe
import nl.rmspek.recipes.service.persistence.IngredientRepository
import nl.rmspek.recipes.service.persistence.RecipeRepository
import nl.rmspek.recipes.service.persistence.persistRecipe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/recipe")
public class RecipeController(
    @Autowired
    private val recipeRepository: RecipeRepository,
    @Autowired
    private val ingredientRepository: IngredientRepository
) {
    @GetMapping
    fun all(): List<RecipeView> = recipeRepository.findAll().map(Recipe::fromDb)

    @PostMapping
    fun create(
        @RequestBody recipeView: RecipeView,
    ): ResponseEntity<RecipeView> {
        if (recipeView.id != null) {
            throw ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Cannot create recipe with existing ID")
        }

        validatePersistRecipe(recipeView, recipeRepository, ingredientRepository)

        val recipe = recipeRepository.persistRecipe(recipeView)
        return ResponseEntity(
            recipeRepository.findById(recipe.id!!).get().fromDb(),
            HttpStatus.CREATED
        )
    }

    @PatchMapping("{id}")
    fun update(
        @PathVariable id: Long,
        @RequestBody recipeView: RecipeView
    ): ResponseEntity<RecipeView> {
        if (recipeView.id != id) {
            throw ResponseStatusException(
                HttpStatus.UNPROCESSABLE_ENTITY,
                "Ids mismatch, url says $id and object says ${recipeView.id}"
            )
        }

        validatePersistRecipe(recipeView, recipeRepository, ingredientRepository)

        return try {
            val recipeId = recipeRepository.persistRecipe(recipeView).id!!
            ResponseEntity(
                recipeRepository.findById(recipeId).get().fromDb(),
                HttpStatus.OK,
            )
        } catch (e: NoSuchElementException) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find recipe with id: $id")
        }
    }
}
