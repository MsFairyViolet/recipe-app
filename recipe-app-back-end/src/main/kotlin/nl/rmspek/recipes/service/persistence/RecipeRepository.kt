package nl.rmspek.recipes.service.persistence

import nl.rmspek.recipes.model.persistence.Recipe
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

interface RecipeRepository : CrudRepository<Recipe, Long> {
    @Query("SELECT * FROM recipes WHERE name = :name LIMIT 1", nativeQuery = true)
    fun recipeByName(@Param("name")name: String): Recipe?

    @Query("""
        SELECT *
        FROM recipes r
        LEFT JOIN recipe_ingredient ri ON ri.recipe_id = r.id
        WHERE ri.ingredient_id = :ingredientId
    """, nativeQuery = true)
    fun byIngredientId(
        @Param("ingredientId") ingredientId: Long,
    ): List<Recipe>
}
