package nl.rmspek.recipes.controller.api

import nl.rmspek.recipes.model.persistence.Cuisine
import nl.rmspek.recipes.model.rest.toView
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/cuisine")
class CuisineController {
    @GetMapping
    fun all() = Cuisine.entries.map { it.toView() }
}
