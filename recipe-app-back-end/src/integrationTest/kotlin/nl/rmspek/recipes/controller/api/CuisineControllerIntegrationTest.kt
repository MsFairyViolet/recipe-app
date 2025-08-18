package nl.rmspek.recipes.controller.api

import nl.rmspek.recipes.BaseIntegrationTest
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class CuisineControllerIntegrationTest: BaseIntegrationTest() {
    @Test
    fun `all() returns success and configured cuisine types`() {
        mockMvc.perform(
            MockMvcRequestBuilders
                .get("/api/cuisine")
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.*").isArray)
            .andExpect(jsonPath("$.[0].cuisineTitle").value("Midden-Oosters"))
    }
}
