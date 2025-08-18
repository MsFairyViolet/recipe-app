package nl.rmspek.recipes.util

import jakarta.transaction.NotSupportedException
import org.hamcrest.BaseMatcher
import org.hamcrest.Description

class SingleNumberTypeAgnosticMatcher<T : Number?>(private val to: T) : BaseMatcher<T>() {
    override fun describeTo(description: Description?) {
        description?.appendText(to.toString())
    }

    override fun matches(other: Any?) = bothNull(other) ||
            when (other) {
                is Int -> (to!!.toInt()) == other
                is Long -> (to!!.toLong()) == other
                else -> throw NotSupportedException("cannot match ${other?.javaClass}")
            }

    private fun bothNull(other: Any?) = to == null && other == null
}
