package nl.rmspek.recipes.model.persistence

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name="recipes")
class Recipe(
    @Column(unique = true) var name: String,
    var description: String,
    var servingCalories: Int,
    var servingCount: Int,
    var cuisine: String,
    var note: String,
    var externalRecipeLink: String,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null

    @OneToMany(mappedBy = "recipe", fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
    @OrderBy("ingredient.id")
    val ingredients: MutableSet<RecipeIngredient> = mutableSetOf()
}

fun Recipe.addIngredient(ingredient: Ingredient, amount: BigDecimal, amountType: AmountType) {
    this.ingredients.add(RecipeIngredient(amount, amountType).also {
        it.id = RecipeIngredientKey(this.id, ingredient.id)
        it.ingredient = ingredient
        it.recipe = this
    })
}
