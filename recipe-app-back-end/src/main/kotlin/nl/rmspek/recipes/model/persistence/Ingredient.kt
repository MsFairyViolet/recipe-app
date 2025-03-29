package nl.rmspek.recipes.model.persistence

import jakarta.persistence.*

@Entity
@Table(name="ingredients")
class Ingredient(
    @Column(unique = true)
    var name: String,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
}
