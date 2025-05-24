package nl.rmspek.recipes.model.rest

import nl.rmspek.recipes.model.persistence.AmountType

data class AmountTypeView(val amountType: String)

fun AmountType.toView(): AmountTypeView = AmountTypeView(this.present())
