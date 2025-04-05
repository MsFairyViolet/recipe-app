package nl.rmspek.recipes.model.rest

import nl.rmspek.recipes.model.persistence.AmountType

fun AmountType.present(): String = when (this) {
    AmountType.STUK -> "stuk"
    AmountType.PORTIE -> "portie"
    AmountType.GRAM -> "g"
    AmountType.CUP -> "cup"
    AmountType.MILLILITER -> "ml"
    AmountType.THEELEPEL -> "theelepel"
    AmountType.EETLEPEL -> "eetlepel"
}
