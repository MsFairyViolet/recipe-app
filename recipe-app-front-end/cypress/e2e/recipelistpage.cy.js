describe('Recipe List Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/recipe', { fixture: 'all-recipes.json' })
    cy.visit("http://localhost:3000")
  })

  it('has the "Recipes" title', () => {
    cy.get("h1").contains("Recipes")
  })

  it(`successfully fetches Recipes`, () => {
         cy.intercept('GET', "/api/recipe", {
            statusCode: 200,
         }).as(`getRecipes`)

         cy.visit('http://localhost:3000/recipe')

         cy.wait(`@getRecipes`).its('response.statusCode').should('eq', 200)
      })

  describe("Recipe list", () => {
    it('has a recipe list', () => {
      cy.dataTest('recipe-row-0').contains("Albondigas")
      cy.dataTest('recipe-row-0').contains("945")
      cy.dataTest('recipe-row-0').contains("Midden-Oosters")
    })

    it('goes to correct recipe', () => {
      cy.dataTest('recipe-row-0').find("a").click()
      cy.location("pathname").should("equal", "/recipe/1")
    })

    it('has nothing to display', () => {
      cy.intercept('GET', '/api/recipe', { fixture: 'no-content.json' })
      cy.get(".warning").contains("No recipes found.")
    })

    it('shows an error when API fails', () => {
      cy.intercept('GET', '/api/recipe', { statusCode: 500, body: {} })
      cy.get(".error").contains("Something went wrong.")
    })
  })

  describe("Searchbar", () => {
    const searchTerms = ['okono', 'Okono', "OKONO", "Okonomiyaki"]
    searchTerms.forEach((term) => {
      it(`returns Okonomiyaki when searching ${term}`, () => {
        cy.dataTest('search-bar').type(term)
        cy.dataTest('recipe-row', "^=").should("have.length", 1)
        cy.dataTest('recipe-row-0').contains("Okonomiyaki")
      })
    })

    it("returns 2 recipes containing 'beef'", () => {
      cy.dataTest('search-bar').type("beef")
      cy.dataTest('recipe-row', "^=").should("have.length", 2)
    })

    it("returns warning if there's no result", () => {
      cy.dataTest('search-bar').type("zzzzzzzz")
      cy.get(".warning").contains("No recipes found.")
    })
  })

  describe("New Recipe Button", () => {
    it("redirects to an empty recipe edit page", () => {
      cy.dataTest('new-recipe-button').contains("Add new recipe").click()
      cy.location("pathname").should("equal", "/recipe/new")
    })
  })

  describe("Nav Bar", () => {
    it("has a correct active Nav Bar element", () => {
      cy.dataTest("nav-link-recipes").contains("Recipes").should("have.class", "active")
      cy.dataTest("nav-link-ingredients").contains("Ingredients").should("not.have.class", "active")
    })
  })
})