describe('Edit Recipe Page', () => {
   beforeEach(() => {
      cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' }).as("getRecipe")
      cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' }).as("getIngredients")
      cy.intercept('GET', '/api/recipe', { fixture: 'all-recipes.json' })
      cy.intercept('GET', '/api/cuisine', { fixture: 'all-cuisines.json' })
      cy.intercept('GET', '/api/amounttype', { fixture: 'all-amounttypes.json' })
      cy.intercept('POST', '/api/ingredient', { statusCode: 200, body: {} })
      cy.intercept('PATCH', '/api/recipe/1', { statusCode: 200, body: {} }).as('patchRecipe')
      cy.intercept('DELETE', '/api/recipe/**', { statusCode: 204, body: {} })
   })

   describe('Recipe information', () => {
      it('displays all the correct detail information for unedited Albondigas', () => {
         cy.visit('http://localhost:3000/recipe/1/edit')
         cy.wait("@getRecipe")

         cy.get(".page-title").should("have.value", "Albondigas")
         cy.title().should("include", "Edit Albondigas")
         cy.get(".description-details").should("have.value", "Midden-oosterse gehaktballetjes in tomatensaus met couscous en tzatziki")
         cy.get(".url-details").should("have.value", "https://www.ah.nl/allerhande/recept/R-R1196836/albondigas")
         cy.get('input[name="servingCalories"').should("have.value", "945")
         cy.get('input[name="servingCount"').should("have.value", "2")
         cy.dataTest('cuisine').should("contain", "Midden-Oosters")
         cy.get('.note-details').should("have.value", "Couscous : water = 1 : 1")
      })

      describe('Ingredients', () => {
         beforeEach(() => {
            cy.visit('http://localhost:3000/recipe/1/edit')
            cy.wait("@getRecipe")
         })

         it('displays all the correct ingredients for unedited Albondigas', () => {
            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").should("have.value", "tomatenblokjes")
               cy.dataTest("ingredient-amount").should("have.value", "1")
               cy.dataTest("amount-type").should("contain", "stuk")
            })
         })

         it('adds a new empty ingredients row', () => {
            cy.get(".add-ingredient-button").contains("Add ingredient").click()
            cy.dataTest("ingredient-edit-row-4").within(() => {
               cy.dataTest("ingredient-name").should("be.empty")
               cy.dataTest("ingredient-amount").should("be.empty")
               cy.dataTest("amount-type").should("contain", "stuk")
            })
         })

         it('updates ingredient field when typing', () => {
            cy.dataTest("ingredient-edit-row-3").within(() =>
               cy.dataTest("ingredient-amount").clear().type(4).should("have.value", 4))
         })

         it('deletes ingredient row when clicking row-delete-button', () => {
            cy.dataTest("ingredient-edit-row-3").within(() =>
               cy.dataTest("ingredient-delete-button").contains("x").click().should("not.exist"))
         })

         it('deletes all ingredients when confirming delete-all-ingredients modal', () => {
            cy.get(".delete-all-ingredients-button").contains("Delete all ingredients").click()
            cy.get(".overlay-content").should("contain", "Do you want to delete all ingredients for Albondigas?")
            cy.dataTest("confirm-button").should("contain", "Confirm").click()
            cy.dataTest("ingredient-edit-row", "^=").should("not.exist")
         })

         it('keeps all ingredients when canceling delete-all-ingredients modal', () => {
            cy.get(".delete-all-ingredients-button").contains("Delete all ingredients").click()
            cy.get(".overlay-content").should("exist")
            cy.dataTest("cancel-button").should("contain", "Cancel").click()
            cy.dataTest("ingredient-edit-row-0").should("exist")
         })

         it('changes ingredient when selecting ingredient from dropdown', () => {
            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").click().clear()
               cy.get(".autocomplete-container").should("exist").within(() => {
                  cy.dataTest("autocomplete-option").contains("Aardappel").click()
               })
               cy.dataTest("ingredient-name").should("have.value", "Aardappel")
            })
         })

         it("auto-complete dropdown dissappears when focussing outside of the element", () => {
            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").click()
            })
            cy.get(".page-title").click()
            cy.get(".autocomplete-dropdown").should("not.exist")
         })

         it("filters the autocomplete list to 1 existing result when typing in ingredient name field (case-insensitive)", () => {
            const query = ["boter", "BOTER"]
            cy.dataTest("ingredient-edit-row-0").within(() => {
               query.forEach((query) => {
                  cy.dataTest("ingredient-name").click()
                  cy.dataTest("ingredient-name").clear().type(`${query}`)
                  cy.dataTest("autocomplete-option").should("contain", "Boter")
                  cy.dataTest("add-ingredient-option").should("not.exist")
               })
            })
         })

         it("filters the autocomplete list to multiple existing results when typing in ingredient name field", () => {
            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").click()
               cy.dataTest("ingredient-name").clear().type(`ui`)
            })
            cy.dataTest("autocomplete-option").should("contain", "bosui")
            cy.dataTest("autocomplete-option").should("contain", "Ui")
            cy.dataTest("add-ingredient-option").should("not.exist")
         })

         it("ingredient change > adds a 'add new global ingredient' button when there is no exact ingredient match", () => {
            cy.intercept('POST', '/api/ingredient', { statusCode: 200, body: { id: 53, name: "zzzz" } }).as('postIngredient')

            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").click()
               cy.dataTest("ingredient-name").clear().type(`zzzz`)
            })
            cy.dataTest("add-ingredient-option").should("contain", "+ Add zzzz").click()

            cy.get(".overlay-content").should("contain", "Add new global ingredient zzzz?")
            cy.dataTest("confirm-button").contains("Confirm").click()

            cy.wait('@postIngredient')
            cy.get('@postIngredient').its('request.body').should('include', { name: "zzzz" })

            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").should("have.value", "zzzz")
            })

            cy.wait("@getIngredients")
         })

         it("new ingredient > adds a 'add new global ingredient' button when there is no exact ingredient match", () => {
            cy.intercept('POST', '/api/ingredient', { statusCode: 200, body: { id: 53, name: "zzzz" } }).as('postIngredient')

            cy.get(".add-ingredient-button").click()
            cy.dataTest("ingredient-edit-row-4").within(() => {
               cy.dataTest("ingredient-name").click()
               cy.dataTest("ingredient-name").clear().type(`zzzz`)
            })
            cy.dataTest("add-ingredient-option").should("contain", "+ Add zzzz").click()

            cy.get(".overlay-content").should("contain", "Add new global ingredient zzzz?")
            cy.dataTest("confirm-button").contains("Confirm").click()

            cy.wait('@postIngredient')
            cy.get('@postIngredient').its('request.body').should('include', { name: "zzzz" })

            cy.dataTest("ingredient-edit-row-4").within(() => {
               cy.dataTest("ingredient-name").should("have.value", "zzzz")
            })

            cy.wait("@getIngredients")
         })

         it("does not add a global ingredient when canceling in the modal", () => {
            const postSpy = cy.spy().as('postSpy')
            cy.intercept('POST', '/api/ingredient', postSpy)

            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").click()
               cy.dataTest("ingredient-name").clear().type(`zzzz`)
            })
            cy.dataTest("add-ingredient-option").click()
            cy.dataTest("cancel-button").contains("Cancel").click()

            cy.get("@postSpy").should("not.have.been.called")
         })

         const newIngredient = ["Aardappel", "AARDAPPEL"]
         newIngredient.forEach((name) => {
            it(`gives a warning when ${name} already exists`, () => {
               const postSpy = cy.spy().as('postSpy')
               cy.intercept('POST', '/api/ingredient', postSpy)
               const alertStub = cy.stub()
               cy.on('window:alert', alertStub)

               cy.dataTest("ingredient-edit-row-0").within(() => {
                  cy.dataTest("ingredient-name").click()
                  cy.dataTest("ingredient-name").clear().type(`zzzz`)
               })

               cy.dataTest("add-ingredient-option").click()
               cy.dataTest("overlay-input").clear().type(`${name}`)
               cy.dataTest("confirm-button").contains("Confirm").click().then(() => {
                  expect(alertStub).to.have.been.calledOnce
                  expect(alertStub).to.have.been.calledWith("That ingredient already exists! Please modify the name and try again.")
               })
               cy.get("@postSpy").should("not.have.been.called")
            })
         })

         it("alerts when adding a new ingredient fails on the API", () => {
            cy.intercept('POST', '/api/ingredient', { statusCode: 500, body: {} }).as('postIngredient')

            const alertStub = cy.stub()
            cy.on('window:alert', alertStub)

            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").click()
               cy.dataTest("ingredient-name").clear().type(`zzzz`)
            })
            cy.dataTest("add-ingredient-option").click()
            cy.dataTest("confirm-button").click().then(() => {
               expect(alertStub).to.have.been.calledOnce
               expect(alertStub).to.have.been.calledWith("There was an error adding the ingredient.")
            })
            cy.wait('@postIngredient')
         })

         it("saves recipe with new global ingredient having correct ID", () => {
            cy.intercept('POST', '/api/ingredient', {
               statusCode: 200,
               body: { id: 53, name: "zzzz" }
            }).as('postIngredient')

            cy.intercept('PATCH', '/api/recipe/1').as('patchRecipe')

            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").click()
               cy.dataTest("ingredient-name").clear().type("zzzz")
            })
            cy.dataTest("add-ingredient-option").click()
            cy.dataTest("confirm-button").click()

            cy.wait('@postIngredient').its('request.body').should('deep.include', { name: "zzzz" })

            cy.dataTest('recipe-save-button').click()

            cy.wait('@patchRecipe').its('request.body').then((body) => {
               const found = body.ingredients.find(i => i.id === 53 && i.name === "zzzz")
               expect(found).to.exist
            })
         })
      })

      describe("Button functionality", () => {
         describe("Delete button", () => {
            beforeEach(() => {
               cy.visit('http://localhost:3000/recipe/1/edit')
               cy.wait("@getRecipe")
               cy.dataTest("recipe-delete-button").contains("Delete").click()
            })

            it('opens a confirmation popup when clicking Delete', () => {
               cy.get(".overlay-content").should("exist")
               cy.dataTest("overlay-message").should("contain", "Do you want to delete the recipe for Albondigas?")
            })

            it('closes the popup and makes no call if user cancels', () => {
               const patchSpy = cy.spy().as('patchSpy')
               cy.intercept('DELETE', "/api/recipe/**", patchSpy)
               cy.dataTest("cancel-button").contains("Cancel").click()
               cy.get(".overlay-content").should("not.exist")
               cy.get('@patchSpy').should("not.have.been.called")
            })

            it('makes a DELETE call if user confirms', () => {
               const patchSpy = cy.spy().as('patchSpy')
               cy.intercept('DELETE', "/api/recipe/**", patchSpy)
               cy.dataTest("confirm-button").contains("Confirm").click()
               cy.get(".overlay-content").should("not.exist")
               cy.get('@patchSpy').should("have.been.called")
            })

            it('shows an error if the DELETE fails', () => {
               cy.intercept('DELETE', '/api/recipe/**', { statusCode: 500, body: {} })
               const alertStub = cy.stub()
               cy.on('window:alert', alertStub)

               cy.dataTest("confirm-button").click().then(() => {
                  expect(alertStub).to.have.been.calledOnce
                  expect(alertStub).to.have.been.calledWith("Failed to delete the recipe.")
               })
            })
         })

         describe("Cancel button", () => {
            it('undoes the edit, redirects and makes no call if user cancels', () => {
               cy.visit('http://localhost:3000/recipe/1/edit')
               cy.wait("@getRecipe")

               const patchSpy = cy.spy().as('patchSpy')
               cy.intercept('PATCH', "/api/recipe/**", patchSpy)
               cy.dataTest("edit-cancel-button").click()
               cy.dataTest("overlay-message").should("contain", "Do you want to cancel editing Albondigas?")

               cy.dataTest("confirm-button").click()
               cy.get('@patchSpy').should("not.have.been.called")
               cy.location("pathname").should("equal", "/recipe/1")
            })

            it('undoes the creating of new page, redirects and makes no call if user cancels', () => {
               cy.visit('http://localhost:3000/recipe/new')

               const patchSpy = cy.spy().as('patchSpy')
               cy.intercept('PATCH', "/api/recipe/**", patchSpy)
               cy.dataTest("edit-cancel-button").click()
               cy.dataTest("overlay-message").should("contain", "Do you want to cancel creating recipe ?")

               cy.dataTest("confirm-button").click()
               cy.get('@patchSpy').should("not.have.been.called")
               cy.location("pathname").should("equal", "/recipe")
            })
         })

         describe("Save button", () => {
            beforeEach(() => {
               cy.visit('http://localhost:3000/recipe/1/edit')
               cy.wait("@getRecipe")
            })

            it('sends a patch request with correct edits when saving recipe', () => {
               cy.get(".page-title").clear().type("Albondigas!")
               cy.dataTest('cuisine').click()
               cy.dataTest('cuisine-options').contains("Japans").click()
               cy.dataTest("ingredient-edit-row-0").within(() => {
                  cy.dataTest("ingredient-name").click().clear()
                  cy.get(".autocomplete-dropdown").should("exist").within(() => {
                     cy.dataTest("autocomplete-option").contains("Aardappel").click()
                  })
                  cy.dataTest("ingredient-amount").type("5")
                  cy.get(".dropdown-label").click()
                  cy.get(".dropdown-options").contains("portie").click()
               })
               cy.get(".note-details").clear()

               const rows = ["3", "2", "1"]
               rows.forEach((row) => {
                  cy.dataTest(`ingredient-edit-row-${row}`).within(() => {
                     cy.dataTest("ingredient-delete-button").click()
                  })
               })

               cy.dataTest('recipe-save-button').contains("Save").click()
               cy.wait('@patchRecipe').then((interception) => {
                  console.log("Actual request body:", interception.request.body);

                  expect(interception.request.body).to.deep.equal({
                     "id": 1,
                     "name": "Albondigas!",
                     "description": "Midden-oosterse gehaktballetjes in tomatensaus met couscous en tzatziki",
                     "servingCalories": 945,
                     "servingCount": 2,
                     "note": "",
                     "cuisine": "Japans",
                     "externalRecipeLink": "https://www.ah.nl/allerhande/recept/R-R1196836/albondigas",
                     "ingredients": [
                        {
                           "id": 15,
                           "name": "Aardappel",
                           "amount": "15",
                           "amountType": "portie"
                        }]
                  })
               })
            })

            it('alerts for missing required fields when saving recipe', () => {
               const patchSpy = cy.spy().as('patchSpy')
               cy.intercept('PATCH', '/api/recipe/1', patchSpy)
               const alertStub = cy.stub()
               cy.on('window:alert', alertStub)

               cy.get(".page-title").clear()
               cy.dataTest('recipe-save-button').click().then(() => {
                  expect(alertStub).to.have.been.calledOnce
                  expect(alertStub).to.have.been.calledWith("Please fill in the required fields.")
               })
               cy.get('@patchSpy').should("not.have.been.called")
            })

            it('alerts for missing ingredient fields when saving recipe', () => {
               const patchSpy = cy.spy().as('patchSpy')
               cy.intercept('PATCH', '/api/recipe/1', patchSpy)
               const alertStub = cy.stub()
               cy.on('window:alert', alertStub)

               cy.dataTest("ingredient-edit-row-0").within(() => {
                  cy.dataTest("ingredient-name").clear()
                  cy.dataTest("ingredient-amount").clear()
               })

               cy.dataTest('recipe-save-button').click()
                  .then(() => {
                     expect(alertStub).to.have.been.calledOnce
                     expect(alertStub).to.have.been.calledWith("Please fill in all ingredient fields.")
                  })
               cy.get('@patchSpy').should("not.have.been.called")
            })

            it('alerts recipe with the same name exists when saving recipe', () => {
               const patchSpy = cy.spy().as('patchSpy')
               cy.intercept('PATCH', '/api/recipe/1', patchSpy)
               const alertStub = cy.stub()
               cy.on('window:alert', alertStub)

               cy.get(".page-title").clear().type("Pad Thai")
               cy.dataTest('recipe-save-button').click()
                  .then(() => {
                     expect(alertStub).to.have.been.calledOnce
                     expect(alertStub).to.have.been.calledWith("A recipe with the same name already exists!")
                  })
               cy.get('@patchSpy').should("not.have.been.called")
            })

            it('shows an alert if the PATCH fails', () => {
               cy.intercept('PATCH', '/api/recipe/1', { statusCode: 500, body: {} }).as('patchRecipe')
               const alertStub = cy.stub()
               cy.on('window:alert', alertStub)

               cy.dataTest("recipe-save-button").click()
                  .then(() => {
                     expect(alertStub).to.have.been.calledOnce
                     expect(alertStub).to.have.been.calledWith("Failed to update recipe.")
                  })
               cy.wait('@patchRecipe')
            })
         })
      })
   })
   describe.only("Ingredient validation", () => {
      beforeEach(() => {
         cy.visit('http://localhost:3000/recipe/1/edit')
         cy.wait("@getRecipe")
      })

      it(`marks a temporary ingredient as non-valid`, () => {
         cy.dataTest("ingredient-edit-row-0").within(() => {
            cy.dataTest("ingredient-name").click().clear().type("bbb").blur()
            cy.dataTest("ingredient-name").should("have.class", "error")
         })
      })

      it(`clears non-valid mark when input becomes empty`, () => {
         cy.dataTest("ingredient-edit-row-0").within(() => {
            cy.dataTest("ingredient-name").click().clear().type("bbb").blur()
            cy.dataTest("ingredient-name").should("have.class", "error")
            cy.dataTest("ingredient-name").click().clear()
            cy.dataTest("ingredient-name").should("not.have.class", "error")
         })
      })

      it(`keeps non-valid mark when canceling adding a new ingredient`, () => {
         cy.dataTest("ingredient-edit-row-0").within(() => {
            cy.dataTest("ingredient-name").click().clear().type("bbb")
            cy.dataTest("add-ingredient-option").should("contain", "+ Add bbb").click()
         })
         cy.get(".overlay-content").should("exist")
         cy.dataTest("cancel-button").click()

         cy.dataTest("ingredient-edit-row-0").within(() => {
            cy.dataTest("ingredient-name").should("have.class", "error")
         })
      })

      it(`clears non-valid mark when ingredient is added to database`, () => {
         cy.dataTest("ingredient-edit-row-0").within(() => {
            cy.dataTest("ingredient-name").click().clear().type("bbb")
            cy.dataTest("add-ingredient-option").should("contain", "+ Add bbb").click()
         })
         cy.get(".overlay-content").should("exist")
         cy.dataTest("confirm-button").click()

         cy.dataTest("ingredient-edit-row-0").within(() => {
            cy.dataTest("ingredient-name").should("not.have.class", "error")
         })
      })

      it.only(`clears non-valid mark when typing valid existing ingredient`, () => {
         cy.dataTest("ingredient-edit-row-0").within(() => {
            cy.dataTest("ingredient-name").click().clear().type("bbb").blur()
            cy.dataTest("ingredient-name").should("have.class", "error")
            cy.dataTest("ingredient-name").click().clear().type("Boter")
            cy.dataTest("ingredient-name").should("not.have.class", "error")
         })
      })
   })
})

describe('API calls on Edit Page', () => {
   it('shows a loader when fetching recipe', () => {
      cy.intercept('GET', '/api/recipe/1', (req) => {
         req.reply((res) => {
            res.delay = 1000
            res.send({ fixture: 'single-recipe.json' })
         })
      }).as('getRecipe')
      cy.visit('http://localhost:3000/recipe/1/edit')
      cy.contains("Loading recipe...").should("be.visible")
      cy.wait('@getRecipe')
      cy.contains("Loading recipe...").should("not.exist")
   })

   it('gives an error when fetching this recipe failed', () => {
      cy.intercept('GET', '/api/recipe/1', { statusCode: 500, body: {} }).as("getRecipe")
      cy.visit('http://localhost:3000/recipe/1/edit')
      cy.wait("@getRecipe")
      cy.get(".error").contains("Failed to get recipe.")
   })

   const apiEndPoints = [
      { name: "ingredients", alias: "Ingredients", url: "/api/ingredient", fixture: "all-ingredients.json" },
      { name: "recipes", alias: "Recipe", url: "/api/recipe", fixture: "all-recipes.json" },
      { name: "cuisines", alias: "Cuisines", url: "/api/cuisine", fixture: "all-ingredients.json" },
      { name: "amount types", alias: "Amounttype", url: "/api/amounttype", fixture: "all-amounttypes.json" },
   ]

   apiEndPoints.forEach(api => {
      const otherEndpoints = apiEndPoints.filter(endpoint => endpoint.alias !== api.alias)

      it(`successfully fetches ${api.alias}`, () => {
         cy.intercept('GET', api.url, { statusCode: 200 }).as(`get${api.alias}`)
         cy.visit('http://localhost:3000/recipe/1/edit')
         cy.wait(`@get${api.alias}`).its('response.statusCode').should('eq', 200)
      })

      it(`shows a loader when fetching ${api.alias}`, () => {
         cy.intercept('GET', api.url, req => {
            req.reply(res => {
               res.delay = 1000
               res.send({ fixture: api.fixture })
            })
         }).as(`get${api.alias}`)

         otherEndpoints.forEach(({ url, fixture }) => {
            cy.intercept('GET', url, { fixture })
         })

         cy.visit('http://localhost:3000/recipe/1/edit')

         cy.contains(`Loading...`).should('be.visible')

         otherEndpoints.forEach(endpoint => {
            cy.contains(`Loading...`).should('not.exist')
         })

         cy.wait(`@get${api.alias}`)

         cy.contains(`Loading ${api.name}...`).should('not.exist')
      })

      it(`gives an error when fetching ${api.alias} failed`, () => {
         cy.intercept('GET', api.url, { statusCode: 500, body: {} })

         otherEndpoints.forEach(({ url, fixture }) => {
            cy.intercept('GET', url, { fixture })
         })

         cy.visit('http://localhost:3000/recipe/1/edit')

         cy.get('.error').should('contain.text', `Failed to load.`)
      })
   })
})