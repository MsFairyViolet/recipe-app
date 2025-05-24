package nl.rmspek.recipes.controller.api

import nl.rmspek.recipes.BaseIntegrationTest
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class AmountTypeControllerIntegrationTest: BaseIntegrationTest() {
    @Test
    fun `all() returns the list of amount types`() {
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/amounttype").accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.*").isArray)
            .andExpect(jsonPath("$.[0].amountType").value("stuk"))

    }
}
