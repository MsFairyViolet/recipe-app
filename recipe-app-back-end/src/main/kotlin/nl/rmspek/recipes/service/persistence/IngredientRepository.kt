package nl.rmspek.recipes.service.persistence

import nl.rmspek.recipes.model.persistence.Ingredient
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

interface IngredientRepository : CrudRepository<Ingredient, Long> {
    @Query("SELECT * FROM ingredients WHERE name = :name LIMIT 1", nativeQuery = true)
    fun ingredientByName(@Param("name") name: String): Ingredient?
}
