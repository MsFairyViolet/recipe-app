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

        val tomBlok = ingredientRepository.save(Ingredient("Tomatenblokjes"))
        val tomPuree = ingredientRepository.save(Ingredient("Tomatenpuree"))
        val gehakt = ingredientRepository.save(Ingredient("Gehakt"))
        val cousCous = ingredientRepository.save(Ingredient("Cous cous"))
        val bosui = ingredientRepository.save(Ingredient("Bosui"))
        val paprika = ingredientRepository.save(Ingredient("Paprika"))
        val courgette = ingredientRepository.save(Ingredient("Courgette"))
        val bouillon = ingredientRepository.save(Ingredient("Bouillon"))
        val ei = ingredientRepository.save(Ingredient("Ei"))
        val harissa = ingredientRepository.save(Ingredient("Harissa"))
        val yoghurt = ingredientRepository.save(Ingredient("Griekse yoghurt"))
        val komkommer = ingredientRepository.save(Ingredient("Komkommer"))
        val knoflooksaus = ingredientRepository.save(Ingredient("Knoflooksaus"))
        val ui = ingredientRepository.save(Ingredient("Ui"))
        val aardappel = ingredientRepository.save(Ingredient("Aardappel"))
        val boter = ingredientRepository.save(Ingredient("Boter"))
        val ossenhaas = ingredientRepository.save(Ingredient("Ossenhaas"))
        val snijbonen = ingredientRepository.save(Ingredient("Snijbonen"))
        val orech = ingredientRepository.save(Ingredient("Orechiette"))
        val wortel = ingredientRepository.save(Ingredient("Wortel"))
        val bleeks = ingredientRepository.save(Ingredient("Bleekselderij"))
        val kikkererw = ingredientRepository.save(Ingredient("Kikkererwrten"))
        val olie = ingredientRepository.save(Ingredient("Olijfolie"))
        val pkaas = ingredientRepository.save(Ingredient("Parmezaanse kaas"))
        val spitskool = ingredientRepository.save((Ingredient("Spitskool")))
        val oesterzwam = ingredientRepository.save(Ingredient("Oesterzwam"))
        val bloem = ingredientRepository.save(Ingredient("Bloem"))
        val surimi = ingredientRepository.save(Ingredient("Surimi"))
        val nori = ingredientRepository.save(Ingredient("Nori"))
        val mayo = ingredientRepository.save(Ingredient("Mayonnaise"))
        val okosaus = ingredientRepository.save(Ingredient("Okonamiyakisaus"))
        val chinkool = ingredientRepository.save(Ingredient("Chinese kool"))
        val pandanRijst = ingredientRepository.save(Ingredient("Pandan rijst"))
        val kidneybonen = ingredientRepository.save(Ingredient("Kidneybonen"))
        val oPaprika = ingredientRepository.save(Ingredient("Oranje paprika"))
        val ketchup = ingredientRepository.save(Ingredient("Ketchup"))
        val soja = ingredientRepository.save(Ingredient("Sojasaus"))
        val kippendij = ingredientRepository.save(Ingredient("Kippendij filet"))
        val mais = ingredientRepository.save(Ingredient("Maiskorrels"))
        val lasagnebladen = ingredientRepository.save(Ingredient("Lasagnebladen"))
        val knoflook = ingredientRepository.save(Ingredient("Knoflook"))
        val bechamel = ingredientRepository.save(Ingredient("Bechamelsaus"))
        val rijstnoedels = ingredientRepository.save(Ingredient("Rijstnoedels"))
        val kipfilet = ingredientRepository.save(Ingredient("Kipfilet"))
        val tauge = ingredientRepository.save(Ingredient("Taugé"))
        val lenteUi = ingredientRepository.save(Ingredient("Lente-ui"))
        val pindas = ingredientRepository.save(Ingredient("Pinda’s"))
        val limoen = ingredientRepository.save(Ingredient("Limoen"))
        val chilipoeder = ingredientRepository.save(Ingredient("Chilipoeder"))
        val komijn = ingredientRepository.save(Ingredient("Komijn"))
        val rijst = ingredientRepository.save(Ingredient("Rijst"))

        val r1 = recipeRepository.save(Recipe(
            "Albondigas",
            "Midden-oosterse gehaktballetjes in tomatensaus met couscous en tzatziki",
            945,
            2,
            Cuisine.MID_EASTERN,
            "Couscous : water = 1 : 1",
            "https://www.ah.nl/allerhande/recept/R-R1196836/albondigas"
        ))
        r1.addIngredient(tomBlok, BigDecimal(1), AmountType.STUK)
        r1.addIngredient(tomPuree, BigDecimal(2), AmountType.STUK)
        r1.addIngredient(gehakt, BigDecimal(300), AmountType.GRAM)
        r1.addIngredient(cousCous, BigDecimal(BigInteger.valueOf(75L), 2), AmountType.CUP)
        r1.addIngredient(bosui, BigDecimal(1), AmountType.STUK)
        r1.addIngredient(paprika, BigDecimal(1), AmountType.STUK)
        r1.addIngredient(courgette, BigDecimal(1), AmountType.STUK)
        r1.addIngredient(bouillon, BigDecimal(1), AmountType.STUK)
        r1.addIngredient(harissa, BigDecimal(1), AmountType.STUK)
        r1.addIngredient(ui, BigDecimal(1), AmountType.STUK)
        r1.addIngredient(komkommer, BigDecimal(0.5), AmountType.STUK)
        r1.addIngredient(knoflooksaus, BigDecimal(0.5), AmountType.PORTIE)
        r1.addIngredient(yoghurt, BigDecimal(3), AmountType.EETLEPEL)
        recipeRepository.save(r1)

        val r2 = recipeRepository.save(Recipe(
            "Shaksuka",
            "Gestoofde eieren in pittige tomatensaus met couscous.",
            870,
            2,
            Cuisine.MID_EASTERN,
            "Couscous : water = 1 : 1",
            "https://www.ah.nl/allerhande/recept/R-R1196837/shakshuka"
        ))
        r2.addIngredient(tomBlok, BigDecimal(1), AmountType.STUK)
        r2.addIngredient(tomPuree, BigDecimal(2), AmountType.STUK)
        r2.addIngredient(cousCous, BigDecimal(1), AmountType.CUP)
        r2.addIngredient(bosui, BigDecimal(1), AmountType.STUK)
        r2.addIngredient(paprika, BigDecimal(1), AmountType.STUK)
        r2.addIngredient(courgette, BigDecimal(1), AmountType.STUK)
        r2.addIngredient(bouillon, BigDecimal(1), AmountType.STUK)
        r2.addIngredient(ei, BigDecimal(4), AmountType.STUK)
        r2.addIngredient(harissa, BigDecimal(1), AmountType.STUK)
        r2.addIngredient(ui, BigDecimal(1), AmountType.STUK)
        r2.addIngredient(komkommer, BigDecimal(0.5), AmountType.STUK)
        r2.addIngredient(knoflooksaus, BigDecimal(0.5), AmountType.PORTIE)
        r2.addIngredient(yoghurt, BigDecimal(3), AmountType.EETLEPEL)
        recipeRepository.save(r2)

        val r3 = recipeRepository.save(Recipe(
            "AGBeef",
            "Gebakken ossenhaas met oven aardappelen en snijbonen",
            833,
            2,
            Cuisine.WESTERN,
            "",
            ""
        ))
        r3.addIngredient(aardappel, BigDecimal(700), AmountType.GRAM)
        r3.addIngredient(knoflooksaus, BigDecimal(2), AmountType.STUK)
        r3.addIngredient(olie, BigDecimal(5), AmountType.GRAM)
        r3.addIngredient(boter, BigDecimal(1), AmountType.EETLEPEL)
        r3.addIngredient(ossenhaas, BigDecimal(375), AmountType.GRAM)
        r3.addIngredient(snijbonen, BigDecimal(700), AmountType.GRAM)
        recipeRepository.save(r3)

        val r4 = recipeRepository.save(Recipe(
            "Pasta e Ceci",
            "Pasta met groenten en Parmezaanse kaas",
            878,
            2,
            Cuisine.ITALIAN,
            "Gezonde pasta met groenten",
            "https://example.com/orechiette-vegetables"
        ))
        r4.addIngredient(orech, BigDecimal(200), AmountType.GRAM)
        r4.addIngredient(paprika, BigDecimal(1), AmountType.STUK)
        r4.addIngredient(wortel, BigDecimal(250), AmountType.GRAM)
        r4.addIngredient(bleeks, BigDecimal(250), AmountType.GRAM)
        r4.addIngredient(courgette, BigDecimal(1), AmountType.STUK)
        r4.addIngredient(tomBlok, BigDecimal(1), AmountType.STUK)
        r4.addIngredient(kikkererw, BigDecimal(200), AmountType.GRAM)
        r4.addIngredient(ui, BigDecimal(1), AmountType.STUK)
        r4.addIngredient(olie, BigDecimal(12), AmountType.GRAM)
        r4.addIngredient(pkaas, BigDecimal(70), AmountType.GRAM)
        recipeRepository.save(r4)

        val okonomiyaki = recipeRepository.save(Recipe(
            "Okonomiyaki",
            "Japanse hartige pannenkoek met groenten en saus",
            1154,
            2,
            Cuisine.JAPANESE,
            "Hartige pannenkoek met verse groenten",
            "https://example.com/okonomiyaki"
        ))
        okonomiyaki.addIngredient(bosui, BigDecimal(1), AmountType.STUK)
        okonomiyaki.addIngredient(spitskool, BigDecimal(120), AmountType.GRAM)
        okonomiyaki.addIngredient(oesterzwam, BigDecimal(150), AmountType.GRAM)
        okonomiyaki.addIngredient(wortel, BigDecimal(280), AmountType.GRAM)
        okonomiyaki.addIngredient(ei, BigDecimal(4), AmountType.STUK)
        okonomiyaki.addIngredient(bloem, BigDecimal(1), AmountType.CUP)
        okonomiyaki.addIngredient(surimi, BigDecimal(125), AmountType.GRAM)
        okonomiyaki.addIngredient(nori, BigDecimal(3), AmountType.STUK)
        okonomiyaki.addIngredient(mayo, BigDecimal(50), AmountType.GRAM)
        okonomiyaki.addIngredient(okosaus, BigDecimal(2), AmountType.PORTIE)
        okonomiyaki.addIngredient(chinkool, BigDecimal(190), AmountType.GRAM)
        recipeRepository.save(okonomiyaki)

        val jerkChicken = recipeRepository.save(Recipe(
            "Jerk Chicken",
            "Geurige pandan rijst met kip, kidneybonen en verse groenten",
            987,
            2,
            Cuisine.ASIAN,
            "Rijstgerecht met kip en groenten",
            "https://example.com/pandan-rijst"
        ))
        jerkChicken.addIngredient(pandanRijst, BigDecimal(1), AmountType.CUP)
        jerkChicken.addIngredient(kidneybonen, BigDecimal(125), AmountType.GRAM)
        jerkChicken.addIngredient(spitskool, BigDecimal(120), AmountType.GRAM)
        jerkChicken.addIngredient(oPaprika, BigDecimal(1), AmountType.STUK)
        jerkChicken.addIngredient(bosui, BigDecimal(1), AmountType.STUK)
        jerkChicken.addIngredient(ketchup, BigDecimal(25), AmountType.GRAM)
        jerkChicken.addIngredient(soja, BigDecimal(20), AmountType.MILLILITER)
        jerkChicken.addIngredient(kippendij, BigDecimal(375), AmountType.GRAM)
        jerkChicken.addIngredient(mais, BigDecimal(140), AmountType.GRAM)
        recipeRepository.save(jerkChicken)

        val lasagne = recipeRepository.save(Recipe(
            "Lasagne Bolognese",
            "Klassieke Italiaanse lasagne met gehaktsaus en bechamel",
            1200,
            2,
            Cuisine.ITALIAN,
            "Ovengebakken pasta met romige saus",
            "https://example.com/lasagne-bolognese"
        ))
        lasagne.addIngredient(lasagnebladen, BigDecimal(250), AmountType.GRAM)
        lasagne.addIngredient(gehakt, BigDecimal(300), AmountType.GRAM)
        lasagne.addIngredient(tomBlok, BigDecimal(400), AmountType.GRAM)
        lasagne.addIngredient(ui, BigDecimal(1), AmountType.STUK)
        lasagne.addIngredient(knoflook, BigDecimal(2), AmountType.STUK)
        lasagne.addIngredient(bechamel, BigDecimal(500), AmountType.MILLILITER)
        lasagne.addIngredient(pkaas, BigDecimal(50), AmountType.GRAM)
        recipeRepository.save(lasagne)

        val padThai = recipeRepository.save(Recipe(
            "Pad Thai",
            "Thaise noedels met kip, groenten en pinda’s",
            950,
            2,
            Cuisine.THAI,
            "Authentieke Thaise wokschotel",
            "https://example.com/pad-thai"
        ))
        padThai.addIngredient(rijstnoedels, BigDecimal(200), AmountType.GRAM)
        padThai.addIngredient(kipfilet, BigDecimal(250), AmountType.GRAM)
        padThai.addIngredient(tauge, BigDecimal(100), AmountType.GRAM)
        padThai.addIngredient(lenteUi, BigDecimal(2), AmountType.STUK)
        padThai.addIngredient(pindas, BigDecimal(50), AmountType.GRAM)
        padThai.addIngredient(ei, BigDecimal(2), AmountType.STUK)
        padThai.addIngredient(soja, BigDecimal(30), AmountType.MILLILITER)
        padThai.addIngredient(limoen, BigDecimal(1), AmountType.STUK)
        recipeRepository.save(padThai)

        val chili = recipeRepository.save(Recipe(
            "Chili con Carne",
            "Pittige bonenschotel met gehakt en tomatensaus",
            1100,
            2,
            Cuisine.MEXICAN,
            "Stevige bonenschotel met kruiden",
            "https://example.com/chili-con-carne"
        ))
        chili.addIngredient(gehakt, BigDecimal(300), AmountType.GRAM)
        chili.addIngredient(kidneybonen, BigDecimal(250), AmountType.GRAM)
        chili.addIngredient(tomBlok, BigDecimal(400), AmountType.GRAM)
        chili.addIngredient(paprika, BigDecimal(1), AmountType.STUK)
        chili.addIngredient(ui, BigDecimal(1), AmountType.STUK)
        chili.addIngredient(knoflook, BigDecimal(2), AmountType.STUK)
        chili.addIngredient(chilipoeder, BigDecimal(1), AmountType.THEELEPEL)
        chili.addIngredient(komijn, BigDecimal(1), AmountType.THEELEPEL)
        chili.addIngredient(rijst, BigDecimal(200), AmountType.GRAM)
        recipeRepository.save(chili)
    }
}
