describe('View Recipe Page', () => {
   beforeEach(() => {
      cy.visit("http://localhost:3000/recipe/1")
   })

   it('displays all the correct detail information for full Albondigas', () => {
      cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' })
      cy.title().should("include", "Albondigas")
      cy.get(".page-title").contains("Albondigas")
      cy.get(".description-details").contains("Midden-oosterse gehaktballetjes in tomatensaus met couscous en tzatziki")
      cy.get(".url-details").should("have.attr", "href", "https://www.ah.nl/allerhande/recept/R-R1196836/albondigas")
      cy.dataTest("calories").contains("945")
      cy.dataTest("serving").contains("2")
      cy.dataTest("cuisine").contains("Midden-Oosters")
      cy.get(".note-details").contains("Couscous : water = 1 : 1")
   })

   it('hides empty information boxes for simple Albondigas', () => {
      cy.intercept('GET', '/api/recipe/1', { fixture: 'single-simple-recipe.json' })
      cy.get(".description-details").should("not.exist")
      cy.get(".url-details").should("not.exist")
      cy.get(".note-details").should("not.exist")
   })

   it(`successfully fetches Recipe`, () => {
         cy.intercept('GET', "/api/recipe", {
            statusCode: 200,
         }).as(`getRecipe`)

         cy.visit('http://localhost:3000/recipe/1')

         cy.wait(`@getRecipe`).its('response.statusCode').should('eq', 200)
      })

   it('shows a loading message while waiting for the recipe to load', () => {
      let sendResponse
      const trigger = new Promise((resolve) => {
         sendResponse = resolve
      })

      cy.intercept('GET', '/api/recipe/1', (req) => {
         return trigger.then(() => req.reply({ fixture: 'single-recipe.json' }))
      })

      cy.wait(500)
      cy.contains("Loading recipe...").should("be.visible").then(() => {
         sendResponse()
         cy.contains("Loading recipe...").should("not.exist")
      })
   })

   it('shows a warning message when API fails to fetch recipe', () => {
      cy.intercept('GET', '/api/recipe/1', { statusCode: 500, body: {} })
      cy.get(".error").contains("Failed to get recipe.")
   })

   it('when pressing Edit button redirects to the edit page of this recipe', () => {
      cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' })
      cy.dataTest("edit-button").contains("Edit").click()
      cy.location("pathname").should("equal", "/recipe/1/edit")
   })

   it('shows the correct recipe ingredients for Albondigas', () => {
      cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' })
      cy.dataTest("ingredient-row-0").contains("tomatenblokjes")
      cy.dataTest("ingredient-row-0").contains("1")
      cy.dataTest("ingredient-row-0").contains("stuk")
   })

   it('warns when there are no ingredients to show', () => {
      cy.intercept('GET', '/api/recipe/1', { fixture: 'single-simple-recipe.json' })
      cy.get(".warning").contains("No ingredients yet...")
   })

   it('rounds the ingredient amounts correctly', () => {
      cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' })
      const expectedAmounts = ["1", "300", "0.75", "0.5"]
      expectedAmounts.forEach((value, index) => {
         cy.dataTest(`ingredient-row-${index}`).contains(`${value}`)
      })
   })
})