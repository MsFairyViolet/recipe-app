package nl.rmspek.recipes.model.persistence

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(
    name = "recipe_ingredient",
    uniqueConstraints = [UniqueConstraint(columnNames = ["recipe_id", "ingredient_id"])]
)
class RecipeIngredient(
    @Column(precision = 10, scale = 2)
    val amountValue: BigDecimal,
    val amountType: String,
) {
    @EmbeddedId
    lateinit var id: RecipeIngredientKey

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("recipeId")
    @JoinColumn(name = "recipe_id")
    lateinit var recipe: Recipe

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("ingredientId")
    @JoinColumn(name = "ingredient_id")
    lateinit var ingredient: Ingredient
}
