package nl.rmspek.recipes.model.persistence

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import java.io.Serializable

@Embeddable
class RecipeIngredientKey(
    @Column(name = "recipe_id")
    var recipeId: Long?,

    @Column(name = "ingredient_id")
    var ingredientId: Long?,
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as RecipeIngredientKey

        if (recipeId != other.recipeId) return false
        if (ingredientId != other.ingredientId) return false

        return true
    }

    override fun hashCode(): Int {
        var result = recipeId.hashCode()
        result = 31 * result + ingredientId.hashCode()
        return result
    }
}
