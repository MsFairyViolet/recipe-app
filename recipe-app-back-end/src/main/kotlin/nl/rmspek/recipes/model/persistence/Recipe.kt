package nl.rmspek.recipes.model.persistence

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name="recipes")
class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null

    @Column(unique = true)
    var name: String = ""

    var description: String = ""

    var servingCalories: Int = 0

    var servingCount: Int = 0

    @Enumerated(EnumType.STRING)
    var cuisine: Cuisine? = null

    var note: String = ""

    var externalRecipeLink: String? = null

    @OneToMany(mappedBy = "recipe", fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
    @OrderBy("ordinal")
    val ingredients: MutableList<RecipeIngredient> = mutableListOf()
}

fun Recipe.addIngredient(ingredient: Ingredient, amount: BigDecimal, amountType: AmountType) {
    this.ingredients.add(RecipeIngredient(amount, amountType).also {
        it.id = RecipeIngredientKey(this.id, ingredient.id)
        it.ingredient = ingredient
        it.recipe = this
        it.ordinal = this.ingredients.size
    })
}
