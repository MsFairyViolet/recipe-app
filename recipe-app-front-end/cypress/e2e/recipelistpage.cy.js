describe('Recipe List Page', () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000")
  })

  //Page content

  it('has the "Recipes" title', () => {
    cy.get("h1").contains("Recipes")
  })

  //List content
  it('has a recipe list', () => {
    cy.intercept('GET', '/api/recipe', { fixture: 'single-recipe.json' })
    cy.dataTest('recipe-row-0').contains("Albondigas")
    cy.dataTest('recipe-row-0').contains("945")
    cy.dataTest('recipe-row-0').contains("Midden-Oosters")
  })

  it('goes to correct recipe', () => {
    cy.intercept('GET', '/api/recipe', { fixture: 'single-recipe.json' })
    cy.dataTest('recipe-row-0').find("a").click()
    cy.location("pathname").should("equal", "/recipe/1")
  })

  it('has nothing to display', () => {
    cy.intercept('GET', '/api/recipe', { fixture: 'no-recipes.json' })
    cy.get(".warning").contains("No recipes found.")
  })

  it('shows an error when API fails', () => {
    cy.intercept('GET', '/api/recipe', { statusCode: 500, body: {} })
    cy.get(".error").contains("Something went wrong.")
  })

  //Searchbar
  const searchTerms = ['okono', 'Okono', "OKONO", "Okonomiyaki"]
  searchTerms.forEach((term) => {
    it(`returns Okonomiyaki when searching ${term}`, () => {
      cy.intercept('GET', '/api/recipe', { fixture: 'all-recipes.json' })
      cy.dataTest('search-bar').type(term)
      cy.dataTest('recipe-row', "^=").should("have.length", 1)
      cy.dataTest('recipe-row-0').contains("Okonomiyaki")
    })
  })

  it("returns 2 recipes containing 'beef'", () => {
    cy.intercept('GET', '/api/recipe', { fixture: 'all-recipes.json' })
    cy.dataTest('search-bar').type("beef")
    cy.dataTest('recipe-row', "^=").should("have.length", 2)
  })

  it("returns warning if there's no result", () => {
    cy.intercept('GET', '/api/recipe', { fixture: 'all-recipes.json' })
    cy.dataTest('search-bar').type("zzzzzzzz")
    cy.get(".warning").contains("No recipes found.")
  })

  //New Recipe Button
  it("redirects to an empty recipe edit page", () => {
    cy.dataTest('new-recipe-button').contains("Add new recipe").click()
    cy.location("pathname").should("equal", "/recipe/new")
  })

  //Nav Bar
  it("has a correct active Nav Bar element", () => {
    cy.dataTest("nav-link-recipes").contains("Recipes").should("have.class", "active")
    cy.dataTest("nav-link-ingredients").contains("Ingredients").should("not.have.class", "active")
  })
})