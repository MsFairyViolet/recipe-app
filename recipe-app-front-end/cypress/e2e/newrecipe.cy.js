describe('New Recipe Page', () => {
   beforeEach(() => {
      cy.visit("http://localhost:3000/recipe/new")
   })

   it('has empty fields and placeholders', () => {
      cy.intercept('GET', '/api/recipe', { fixture: 'empty-recipe.json' })
      cy.title().should("eq", "New Recipe")
      cy.get(".page-title").should("have.value", "").and("have.attr", "placeholder", "Recipe name*")
      cy.get(".description-details").should("have.value", "").and("have.attr", "placeholder", "Add a description")
      cy.get(".url-details").should("have.value", "").and("have.attr", "placeholder", "Add a reference link")
      cy.get('input[name="servingCalories"').should("have.value", "").and("have.attr", "placeholder", "Calories*")
      cy.get('input[name="servingCount"').should("have.value", "").and("have.attr", "placeholder", "Servings*")
      cy.get('select[name="cuisine"').should("have.value", null).find("option:selected").should("have.text", "Cuisine*")
      cy.get('.note-details').should("have.value", "").and("have.attr", "placeholder", "Add additional notes")
      cy.dataTest("ingredient-edit-row", "^=").should("not.exist")
   })
})


