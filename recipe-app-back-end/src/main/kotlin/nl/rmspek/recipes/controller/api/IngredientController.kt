package nl.rmspek.recipes.controller.api

import nl.rmspek.recipes.model.persistence.Ingredient
import nl.rmspek.recipes.model.rest.IngredientView
import nl.rmspek.recipes.model.rest.fromDb
import nl.rmspek.recipes.model.rest.toDb
import nl.rmspek.recipes.service.controller.api.validation.validateIngredientExistence
import nl.rmspek.recipes.service.controller.api.validation.validateIngredientUnused
import nl.rmspek.recipes.service.controller.api.validation.validatePersistIngredient
import nl.rmspek.recipes.service.persistence.IngredientRepository
import nl.rmspek.recipes.service.persistence.RecipeRepository
import nl.rmspek.recipes.service.persistence.persistIngredient
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/ingredient")
class IngredientController(
    @Autowired
    private val ingredientRepository: IngredientRepository,
    @Autowired
    private val recipeRepository: RecipeRepository
) {
    @GetMapping
    fun all(): List<IngredientView> = ingredientRepository.findAll().map(Ingredient::fromDb)

    @PostMapping
    fun create(
        @RequestBody ingredientView: IngredientView,
    ): ResponseEntity<IngredientView> {
        if (ingredientView.id != null) {
            throw ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Cannot create ingredient with existing ID")
        }

        validatePersistIngredient(ingredientView, ingredientRepository)

        return ResponseEntity(ingredientRepository.save(ingredientView.toDb()).fromDb(), HttpStatus.CREATED)
    }

    @PatchMapping("{id}")
    fun update (
        @PathVariable id: Long,
        @RequestBody ingredientView: IngredientView,
    ): ResponseEntity<IngredientView> {
       if (id != ingredientView.id) {
           throw ResponseStatusException(
               HttpStatus.UNPROCESSABLE_ENTITY,
               "Ids mismatch, url says $id, and object says ${ingredientView.id}"
           )
       }

       validateIngredientExistence(ingredientView.id, ingredientRepository)
       validatePersistIngredient(ingredientView, ingredientRepository)

        val ingredient = ingredientRepository.persistIngredient(ingredientView)
        return ResponseEntity(
            ingredientRepository.findById(ingredient.id!!).get().fromDb(),
            HttpStatus.OK
        )
    }

    @DeleteMapping("{id}")
    fun delete(
        @PathVariable id: Long,
    ): ResponseEntity<Any> {
        validateIngredientExistence(id, ingredientRepository)
        validateIngredientUnused(id, recipeRepository)

        ingredientRepository.deleteById(id)
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }
}
