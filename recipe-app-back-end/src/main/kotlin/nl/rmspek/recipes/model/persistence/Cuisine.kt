package nl.rmspek.recipes.model.persistence

enum class Cuisine (val title: String) {
    MID_EASTERN("Midden-Oosters"),
    EUROPEAN("Europees"),
    ITALIAN("Italiaans"),
    JAPANESE("Japans"),
    ASIAN("Aziatisch"),
    THAI("Thais"),
    MEXICAN("Mexicaans"),
    INDIAN("Indiaas"),
    MEDITERRANEAN("Mediteraans"),
    CARIBBEAN("Caribbean"),

}

fun validCuisineTitle(title: String) = title.isEmpty() || Cuisine.entries.any { it.title == title }

fun cuisineByTitle(title: String) = Cuisine.entries.first { it.title == title }
