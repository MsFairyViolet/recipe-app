describe("Ingredients Page", () => {
   beforeEach(() => {
      cy.visit("http://localhost:3000/ingredients")
   })

   it("has the Ingredients title", () => {
      cy.get("h1").contains("All Ingredients")
   })

   describe("List Content", () => {
      it("has an ingredient list", () => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })
         cy.dataTest('ingredient-row-0').within(() => {
            cy.contains("Aardappel")
            cy.contains("AGBeef")
            cy.get(".edit-button").should("exist")
            cy.get(".delete-button").should("exist")
         })
      })

      it("used-in redirects to correct recipe", () => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })
         cy.dataTest('ingredient-row-0').find("a").click()
         cy.location("pathname").should("equal", "/recipe/3")
      })

      it("has nothing to display", () => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'no-content.json' })
         cy.get(".warning").contains("No ingredients found.")
      })
   })

   describe("API calls", () => {
      it(`successfully fetches Ingredients`, () => {
         cy.intercept('GET', "/api/ingredient", {
            statusCode: 200,
         }).as(`getIngredients`)

         cy.visit('http://localhost:3000/ingredients')

         cy.wait(`@getIngredients`).its('response.statusCode').should('eq', 200)
      })

      it('shows a loader when fetching recipes', () => {
         let sendResponse
         const trigger = new Promise((resolve) => {
            sendResponse = resolve
         })

         cy.intercept('GET', '/api/ingredient', (req) => {
            return trigger.then(() => req.reply())
         }).as('delayedApi')

         cy.wait(500)
         cy.visit('http://localhost:3000/ingredients')

         cy.contains("Loading ingredients...").should("be.visible").then(() => {
            sendResponse()
            cy.contains("Loading ingredients...").should("not.exist")
         })
      })

      it("shows an error when API fails to fetch all ingredients", () => {
         cy.intercept('GET', '/api/ingredient', { statusCode: 500, body: {} })
         cy.get(".warning").contains("Failed to get ingredients.")
      })
   })

   describe("UsedInModal", () => {
      beforeEach(() => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'single-ingredient.json' })
         cy.dataTest("ingredient-row-0").find(".inline-button").click()
      })

      it("'and more...' opens Used In modal", () => {
         cy.dataTest("used-in-ingredient").contains("bosui")
         cy.get("li").contains("Albondigas")
         cy.get("li").contains("Jerk Chicken")
         cy.get("li").contains("Okonomiyaki")
         cy.get("li").contains("Shaksuka")
      })

      it("Used In modal redirects to correct recipe", () => {
         cy.get(".overlay-content").find("a").contains("Albondigas").click()
         cy.location("pathname").should("equal", "/recipe/1")
      })

      it("Used In modal X closes modal", () => {
         cy.get(".overlay-close-button").click()
         cy.get(".overlay-content").should("not.exist")
         cy.location("pathname").should("equal", "/ingredients")
      })
   })

   describe("Searchbar", () => {
      beforeEach(() => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })
      })

      const searchTerms = ['okono', 'Okono', "OKONO", "Okonomiyaki"]
      searchTerms.forEach((term) => {
         it(`returns 'Okonomiyakisaus' when searching ${term}`, () => {
            cy.dataTest('search-bar').type(term)
            cy.dataTest('ingredient-row', "^=").should("have.length", 1)
            cy.dataTest('ingredient-row-0').contains("Okonomiyaki")
         })
      })

      it("returns 2 ingredients when searching for 'kip'", () => {
         cy.dataTest('search-bar').type("kip")
         cy.dataTest('ingredient-row', "^=").should("have.length", 2)
      })

      it("returns warning if there is no result", () => {
         cy.dataTest('search-bar').type("zzzzzzzz")
         cy.get(".warning").contains("No ingredients found.")
      })
   })

   describe("Edit Ingredient Button", () => {
      it("opens edit ingredient modal", () => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'single-ingredient.json' })
         cy.get(".edit-button").click()
         cy.dataTest("overlay-value").contains("bosui")
         cy.dataTest("overlay-input").should("have.value", "bosui")
      })

      it("send a patch request when confirm in the edit ingredient modal", () => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'single-ingredient.json' })
         cy.intercept('PATCH', '/api/ingredient/5', { fixture: "single-ingredient.json" }).as('patchIngredient')
         cy.get(".edit-button").click()
         cy.dataTest("overlay-input").type("zzz")
         cy.intercept('GET', "/api/ingredient", { fixture: "updated-single-ingredient.json" }).as('getUpdatedIngredients')
         cy.dataTest("confirm-button").click()
         cy.wait('@patchIngredient')
         cy.wait('@getUpdatedIngredients')
      })

      const editIngredient = ["kip", "KIP", "Kip"]
      editIngredient.forEach((word) => {
         it("gives warning when ingredient with same name (capital insensitive) exists when editing", () => {
            cy.intercept('GET', '/api/ingredient', { fixture: "two-ingredients.json" }).as("getIngredients")
            const patchSpy = cy.spy().as('patchSpy')
            cy.intercept('PATCH', '/api/ingredient/**', patchSpy)
            cy.intercept('GET', '/api/ingredient').as('reloadIngredients')

            cy.dataTest("ingredient-row-1").within(() => {
               cy.get(".edit-button").click()
            })
            cy.dataTest("overlay-input").clear().type(`${word}`)
            cy.dataTest("confirm-button").click()
            cy.on('window:alert', (alert) => {
               expect(alert).to.equal("Another ingredient with that name already exists!")
            })
            cy.get('@patchSpy').should("not.have.been.called")
         })
      })

      it("aborts edit ingredient when pressing cancel in modal", () => {
         cy.intercept('GET', '/api/ingredient', { fixture: "single-ingredient.json" })
         const patchSpy = cy.spy().as('patchSpy')
         cy.intercept('PATCH', '/api/ingredient/**', patchSpy)
         cy.dataTest("ingredient-row-0").within(() => {
            cy.get(".edit-button").click()
         })
         cy.dataTest("overlay-input").clear().type("newname")
         cy.dataTest("cancel-button").click()
         cy.get(".overlay-content").should("not.exist")
         cy.get('@patchSpy').should("not.have.been.called")
      })

      it("shows an error when API fails to edit ingredient", () => {
         cy.intercept('PATCH', '/api/ingredient/5', { statusCode: 500, body: {} }).as('patchIngredient')

         cy.intercept('GET', '/api/ingredient', { fixture: "single-ingredient.json" })
         cy.dataTest("ingredient-row-0").within(() => {
            cy.get(".edit-button").click()
         })
         cy.dataTest("overlay-input").clear().type("newname")
         cy.dataTest("confirm-button").click()
         cy.on('window:alert', (alert) => {
            expect(alert).to.equal("There was an error updating the ingredient.")
         })
         cy.wait('@patchIngredient')
      })
   })

   describe("Delete Ingredient Button", () => {
      beforeEach(() => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })
         cy.intercept('DELETE', '/api/ingredient/**', { statusCode: 204, body: {} }).as('deleteIngredient')
      })

      it("shows a confirmation modal when pressing delete on an ingredient that is not used in a recipe", () => {
         cy.dataTest('ingredient-row-1').within(() => {
            cy.get(".second-column").contains("-")
            cy.get(".delete-button").click()
         })
         cy.get(".overlay-content").should("exist")
         cy.dataTest("cancel-button").contains("Cancel")
         cy.dataTest("confirm-button").contains("Confirm")
         cy.dataTest("overlay-value").contains("Bechamelsaus")
      })

      it("shows an alert when pressing delete on an ingredient that is used in a recipe", () => {
         cy.dataTest('ingredient-row-0').within(() => {
            cy.get(".second-column").should("not.have", "-")
            cy.get(".delete-button").click()
         })
         cy.on('window:alert', (alert) => {
            expect(alert).to.equal("You can't delete an ingredient globally if it is being used in recipes. Please remove it manually from the associated recipes.")
         })
      })

      it("aborts delete ingredient when pressing cancel in modal", () => {
         const patchSpy = cy.spy().as('patchSpy')
         cy.intercept('DELETE', '/api/ingredient/**', patchSpy)
         cy.dataTest('ingredient-row-1').within(() => {
            cy.get(".delete-button").click()
         })
         cy.get(".overlay-content").should("exist")
         cy.dataTest("cancel-button").click()
         cy.get(".overlay-content").should("not.exist")
         cy.get('@patchSpy').should("not.have.been.called")
      })

      it("makes a delete api call when pressing confirm in modal", () => {
         cy.intercept('DELETE', '/api/ingredient/42', { statusCode: 200, body: {}, }).as('deleteIngredient')
         cy.intercept('GET', '/api/ingredient').as('reloadIngredients')
         cy.dataTest('ingredient-row-1').within(() => {
            cy.get(".delete-button").click()
         })
         cy.dataTest("confirm-button").click()
         cy.wait('@deleteIngredient')
         cy.wait('@reloadIngredients')
      })

      it("shows an error when API fails to delete ingredient", () => {
         cy.intercept('DELETE', '/api/ingredient/42', { statusCode: 500, body: {} })

         cy.dataTest("ingredient-row-1").within(() => {
            cy.get(".delete-button").click()
         })
         cy.dataTest("confirm-button").click()
         cy.on('window:alert', (alert) => {
            expect(alert).to.equal("Something went wrong when trying to delete the ingredient.")
         })
      })
   })

   describe("New Ingredient Button", () => {

      it("opens new ingredient modal", () => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })
         cy.dataTest("new-global-ingredient-button").contains("Add new ingredient").click()
         cy.get(".overlay-content").should("exist")
         cy.dataTest("cancel-button").contains("Cancel")
         cy.dataTest("confirm-button").contains("Confirm")
         cy.dataTest("overlay-value").should("be.empty")
      })

      it("send a post request when confirm in the add ingredient modal", () => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })
         cy.intercept('POST', '/api/ingredient', { statusCode: 201, body: {} }).as('postIngredient')
         cy.dataTest("new-global-ingredient-button").click()
         cy.dataTest("overlay-input").type("AAAZOUT")
         cy.intercept('GET', '/api/ingredient', { fixture: 'updated-all-ingredients.json' }).as('getUpdatedIngredients')
         cy.dataTest("confirm-button").click()
         cy.wait('@postIngredient')
         cy.wait('@getUpdatedIngredients')
      })

      const newIngredient = ["bosui", "BOSUI", "Bosui"]
      newIngredient.forEach((word) => {
         it("gives warning when ingredient with same name (capital insensitive) exists when adding", () => {
            cy.intercept('GET', '/api/ingredient', { fixture: "single-ingredient.json" })
            const patchSpy = cy.spy().as('patchSpy')
            cy.intercept('POST', '/api/ingredient', patchSpy)
            cy.dataTest("new-global-ingredient-button").click()
            cy.dataTest("overlay-input").type(`${word}`)
            cy.dataTest("confirm-button").click()
            cy.on('window:alert', (alert) => {
               expect(alert).to.equal("That ingredient already exists!")
            })
            cy.get('@patchSpy').should("not.have.been.called")
         })
      })

      it("shows an error when API fails to add ingredient", () => {
         cy.intercept('POST', '/api/ingredient', { statusCode: 500, body: {} })
         cy.intercept('GET', '/api/ingredient', { fixture: "single-ingredient.json" })
         cy.dataTest("new-global-ingredient-button").click()
         cy.dataTest("overlay-input").type("AAAZOUT")
         cy.dataTest("confirm-button").click()
         cy.on('window:alert', (alert) => {
            expect(alert).to.equal("There was an error adding the ingredient.")
         })
      })

      it("aborts add ingredient when pressing cancel in modal", () => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })
         const postSpy = cy.spy().as('postSpy')
         cy.intercept('POST', '/api/ingredient', postSpy)
         cy.dataTest("new-global-ingredient-button").click()
         cy.dataTest("overlay-input").type("AAAZOUT")
         cy.dataTest("cancel-button").click()
         cy.get(".overlay-content").should("not.exist")
         cy.get('@postSpy').should("not.have.been.called")
      })

      it("alerts when input in modal is empty", () => {
         cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })

         const alertStub = cy.stub()
         cy.on('window:alert', alertStub)

         cy.dataTest("new-global-ingredient-button").click()
         cy.dataTest("overlay-input").clear()
         cy.dataTest("confirm-button").click().then(() => {
            expect(alertStub).to.have.been.calledOnce
            expect(alertStub).to.have.been.calledWith("Can't be empty. Please provide an input.")
         })
      })
   })

   describe("Nav Bar", () => {
      it("has a correct active Nav Bar element", () => {
         cy.dataTest("nav-link-recipes").contains("Recipes").should("not.have.class", "active")
         cy.dataTest("nav-link-ingredients").contains("Ingredients").should("have.class", "active")
      })
   })
})