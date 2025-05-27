package nl.rmspek.recipes.controller.api

import nl.rmspek.recipes.model.persistence.AmountType
import nl.rmspek.recipes.model.rest.toView
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/amounttype")
class AmountTypeController {
    @GetMapping
    fun all() = AmountType.entries.map { it.toView() }
}
