package nl.rmspek.recipes.model.persistence

import nl.rmspek.recipes.model.rest.RecipeIngredientView

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
    Pair("gram", AmountType.GRAM),
    Pair("cup", AmountType.CUP),
    Pair("ml", AmountType.MILLILITER),
    Pair("tsp", AmountType.THEELEPEL),
    Pair("tbsp", AmountType.EETLEPEL)
)

fun RecipeIngredientView.parseAmountType(): AmountType = representationMap[this.amountType]!!
