package nl.rmspek.recipes.data

import nl.rmspek.recipes.model.persistence.*
import nl.rmspek.recipes.service.persistence.IngredientRepository
import nl.rmspek.recipes.service.persistence.RecipeRepository
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import java.math.BigDecimal
import java.math.BigInteger

@Configuration
class SeedRecipes(
    private val recipeRepository: RecipeRepository,
    private val ingredientRepository: IngredientRepository
) {
    @Bean
    @Profile("local")
    fun loadDevRecipes() = ApplicationRunner {
        if(recipeRepository.count() > 1 || ingredientRepository.count() > 1) return@ApplicationRunner

        val i1 = ingredientRepository.save(Ingredient("tomatenblokjes"))
        val i2 = ingredientRepository.save(Ingredient("tomatenpuree"))
        val i3 = ingredientRepository.save(Ingredient("gehakt"))
        val i4 = ingredientRepository.save(Ingredient("cous cous"))
        val i5 = ingredientRepository.save(Ingredient("bosui"))
        val i6 = ingredientRepository.save(Ingredient("paprika"))
        val i7 = ingredientRepository.save(Ingredient("courgette"))
        val i8 = ingredientRepository.save(Ingredient("bouillon"))
        val i9 = ingredientRepository.save(Ingredient("ei"))
        val i10 = ingredientRepository.save(Ingredient("harissa"))

        val r1 = recipeRepository.save(Recipe("Albondigas"))
        r1.addIngredient(i1, BigDecimal(1), "unit")
        r1.addIngredient(i2, BigDecimal(2), "unit")
        r1.addIngredient(i3, BigDecimal(300), "gram")
        r1.addIngredient(i4, BigDecimal(BigInteger.valueOf(75L), 2), "cup")
        r1.addIngredient(i5, BigDecimal(1), "unit")
        r1.addIngredient(i6, BigDecimal(1), "unit")
        r1.addIngredient(i7, BigDecimal(1), "unit")
        r1.addIngredient(i8, BigDecimal(1), "unit")
        r1.addIngredient(i10, BigDecimal(1), "unit")

        val r2 = recipeRepository.save(Recipe("Shaksuka"))
        r2.addIngredient(i1, BigDecimal(1), "unit")
        r2.addIngredient(i2, BigDecimal(2), "unit")
        r2.addIngredient(i3, BigDecimal(300), "gram")
        r2.addIngredient(i4, BigDecimal(1), "cup")
        r2.addIngredient(i5, BigDecimal(1), "unit")
        r2.addIngredient(i6, BigDecimal(1), "unit")
        r2.addIngredient(i7, BigDecimal(1), "unit")
        r2.addIngredient(i8, BigDecimal(1), "unit")
        r2.addIngredient(i9, BigDecimal(4), "unit")

        recipeRepository.save(r1)
        recipeRepository.save(r2)
    }
}
