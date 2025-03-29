package nl.rmspek.recipes.util

import org.hamcrest.BaseMatcher
import org.hamcrest.Description

class IterableNumberTypeAgnosticMatcher<T : Number?>(private val to: Iterable<T>?) : BaseMatcher<Iterable<T>>() {
    override fun describeTo(description: Description?) {
        description?.appendText(to.toString())
    }

    override fun matches(other: Any?) = bothNull(other) ||
            (other is List<*> && itemsEqualInAnyOrder(other))

    private fun bothNull(other: Any?) = to == null && other == null

    private fun itemsEqualInAnyOrder(other: List<*>): Boolean {
        return to!!.map { it!!.toLong() }.sorted() == (other as Iterable<Number>).map { it.toLong() }.sorted()
    }
}
