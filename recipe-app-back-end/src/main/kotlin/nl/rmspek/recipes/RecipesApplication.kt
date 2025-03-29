package nl.rmspek.recipes

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@SpringBootApplication
class RecipesApplication: WebMvcConfigurer {
    val frontendRoutes = listOf("", "about")
    override fun addViewControllers(registry: ViewControllerRegistry) {
        frontendRoutes.forEach { registry.addViewController("/$it").setViewName("index.html") }
    }
}

fun main(args: Array<String>) {
    runApplication<RecipesApplication>(*args)
}
