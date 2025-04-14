package nl.rmspek.recipes.service.persistence

import nl.rmspek.recipes.model.persistence.Recipe
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

interface RecipeRepository : CrudRepository<Recipe, Long> {
    @EntityGraph(attributePaths = ["ingredients"])
    override fun findAll(): List<Recipe>

    fun findFirstByName(@Param("name")name: String): Recipe?

    @Query("""
        SELECT r
        FROM Recipe r
        JOIN r.ingredients i
        WHERE i.ingredient.id = :ingredientId
    """)
    fun byIngredientId(
        @Param("ingredientId") ingredientId: Long,
    ): List<Recipe>
}
