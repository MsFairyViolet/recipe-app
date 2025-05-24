package nl.rmspek.recipes.model.persistence

enum class Cuisine (val title: String) {
    MID_EASTERN("Midden-Oosters"),
    WESTERN("Westers"),
    ITALIAN("Italiaans"),
    JAPANESE("Japans"),
    ASIAN("Asiatisch"),
    THAI("Thais"),
    MEXICAN("Mexicaans"),
}

fun validCuisineTitle(title: String) = title.isEmpty() || Cuisine.entries.any { it.title == title }

fun cuisineByTitle(title: String) = Cuisine.entries.first { it.title == title }
