package nl.rmspek.recipes.service.persistence

import nl.rmspek.recipes.model.persistence.Ingredient
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

interface IngredientRepository : CrudRepository<Ingredient, Long> {
    fun findFirstByName(@Param("name") name: String): Ingredient?
}
