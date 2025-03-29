package nl.rmspek.recipes.model.persistence

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name="recipes")
class Recipe(@Column(unique = true) var name: String) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null

    @OneToMany(mappedBy = "recipe", fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
    val ingredients: MutableSet<RecipeIngredient> = mutableSetOf()
}

fun Recipe.addIngredient(ingredient: Ingredient, amount: BigDecimal, unitType: String) {
    this.ingredients.add(RecipeIngredient(amount, unitType).also {
        it.id = RecipeIngredientKey(this.id, ingredient.id)
        it.ingredient = ingredient
        it.recipe = this
    })
}
