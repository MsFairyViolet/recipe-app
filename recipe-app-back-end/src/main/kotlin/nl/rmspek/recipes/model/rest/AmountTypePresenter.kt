package nl.rmspek.recipes.model.rest

import nl.rmspek.recipes.model.persistence.AmountType

fun AmountType.present(): String = when (this) {
    AmountType.STUK -> "stuk"
    AmountType.PORTIE -> "portie"
    AmountType.GRAM -> "gram"
    AmountType.CUP -> "cup"
    AmountType.MILLILITER -> "ml"
    AmountType.THEELEPEL -> "tsp"
    AmountType.EETLEPEL -> "tbsp"
}
