describe('Nav Bar - Desktop', () => {
   beforeEach(() => {
      cy.visit("http://localhost:3000")
   })

   it("has a nav bar", () => {
      cy.dataTest("nav-bar").should("exist")
   })

   it("has correct nav bar links and redirects for recipe page", () => {
      cy.dataTest("nav-link-recipes").contains("Recipes").click()
      cy.location("pathname").should("equal", "/recipe")
   })

   it("has correct nav bar links and redirects for ingredients page", () => {
      cy.dataTest("nav-link-ingredients").contains("Ingredients").click()
      cy.location("pathname").should("equal", "/ingredients")
   })

   it("has a correct active Nav Bar element on recipe page", () => {
      cy.dataTest("nav-link-recipes").should("have.class", "active")
      cy.dataTest("nav-link-ingredients").contains("Ingredients").should("not.have.class", "active")
   })

   it("has a correct active Nav Bar element on ingredient page", () => {
      cy.visit("http://localhost:3000/ingredients")
      cy.dataTest("nav-link-recipes").should("not.have.class", "active")
      cy.dataTest("nav-link-ingredients").contains("Ingredients").should("have.class", "active")
   })

   it("switches active class after navigation", () => {
      cy.dataTest("nav-link-ingredients").click()
      cy.dataTest("nav-link-ingredients").should("have.class", "active")
      cy.dataTest("nav-link-recipes").should("not.have.class", "active")
   })
})

describe.only("Nav bar - Mobile", () => {
   beforeEach(() => {
      cy.visit("http://localhost:3000")
      cy.viewport(375, 667)
   })

   it("has a hamburger menu", () => {
      cy.dataTest("menu-button").should("exist")
   })

   it("clicking the hamburger menu button toggles the open state", () => {
      cy.dataTest("nav-links-mobile").should("not.have.class", "open")

      cy.dataTest("menu-button").click()
      cy.dataTest("nav-links-mobile").should("have.class", "open")

      cy.dataTest("menu-button").click()
      cy.dataTest("nav-links-mobile").should("not.have.class", "open")
   })

   it("clicking a link closes the hamburger menu", () => {
      cy.dataTest("menu-button").click()
      cy.dataTest("nav-link-recipes").click()
      cy.dataTest("nav-links-mobile").should("not.have.class", "open")
   })
})