package nl.rmspek.recipes.model.persistence

import jakarta.persistence.Entity
import nl.rmspek.recipes.model.rest.RecipeIngredientView
import java.util.*

enum class AmountType {
    STUK,
    PORTIE,
    GRAM,
    CUP,
    MILLILITER,
    THEELEPEL,
    EETLEPEL,
}

val representationMap = mapOf(
    Pair("stuk", AmountType.STUK),
    Pair("portie", AmountType.PORTIE),
    Pair("g", AmountType.GRAM),
    Pair("cup", AmountType.CUP),
    Pair("ml", AmountType.MILLILITER),
    Pair("theelepel", AmountType.THEELEPEL),
    Pair("eetlepel", AmountType.EETLEPEL)
)

fun RecipeIngredientView.parseAmountType(): AmountType = representationMap[this.amountType]!!
