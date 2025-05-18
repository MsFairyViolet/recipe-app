describe('Recipe List Page', () => {
  beforeEach(()=> {
    cy.visit("http://localhost:3000")
  })

  it('has the "Recipes" title', () => {
    cy.get("h1").contains("Recipes")
  })

  it.only('has a recipe list', () => {
    cy.intercept('GET', '/api/recipe', { fixture: 'single-recipe.json'})
    cy.get("[data-test='recipe-row-0']").contains("Albondigas")
    cy.get("[data-test='recipe-row-0']").contains("945")
    cy.get("[data-test='recipe-row-0']").contains("Midden-Oosters")
  })

  it('goes to correct recipe', () => {
    cy.get("[data-test='recipe-row-0']").find("a").click()
    cy.location("pathname").should("equal", "/recipe/1")
  })
})