describe('Edit Recipe Page', () => {
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
         cy.get(".error").contains("Failed to fetch recipe.")
      })

      const apiEndPoints = [
         { alias: "Ingredients", url: "/api/ingredient", fixture: "all-ingredients.json" },
         { alias: "Recipe", url: "/api/recipe", fixture: "all-recipes.json" },
         { alias: "Cuisines", url: "/api/cuisine", fixture: "all-cuisines.json" },
         { alias: "Amounttype", url: "/api/amounttype", fixture: "all-amounttypes.json" },
      ]

      apiEndPoints.forEach((api) => {
         it(`it shows a loader when fetching ${api.alias}`, () => {
            cy.intercept('GET', `${api.url}`, (req) => {
               req.reply((res) => {
                  res.delay = 1000
                  res.send({ fixture: `${api.fixture}` })
               })
            }).as(`get${api.alias}`)

            apiEndPoints.filter((endpoint) => endpoint.alias !== api.alias).forEach(({ url, fixture }) => {
               cy.intercept('GET', url, { fixture })
            })

            cy.visit('http://localhost:3000/recipe/1/edit')
            cy.contains('Loading...').should('be.visible')

            cy.wait(`@get${api.alias}`)
            cy.contains('Loading...').should('not.exist')
         })
      })

      apiEndPoints.forEach((api) => {
         it(`gives an error when fetching ${api.alias} failed`, () => {
            cy.intercept('GET', `${api.url}`, { statusCode: 500, body: {} })

            apiEndPoints.filter((endpoint) => endpoint.alias !== api.alias).forEach(({ url, fixture }) => {
               cy.intercept('GET', url, { fixture })
            })

            cy.visit('http://localhost:3000/recipe/1/edit')
            cy.get(".error").contains("Failed!")
         })
      })
   })

   describe('Recipe information', () => {
      beforeEach(() => {
         cy.intercept('GET', '/api/ingredient', { fixture: "all-ingredients.json" })
         cy.intercept('GET', '/api/recipe', { fixture: "all-recipes.json" })
         cy.intercept('GET', '/api/cuisine', { fixture: "all-cuisines.json" })
         cy.intercept('GET', '/api/amounttype', { fixture: "all-amounttypes.json" })
      })

      it('displays all the correct detail information for unedited Albondigas', () => {
         cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' }).as("getRecipe")
         cy.visit('http://localhost:3000/recipe/1/edit')
         cy.wait("@getRecipe")

         cy.title().should("include", "Edit Albondigas")
         cy.get(".page-title").should("have.value", "Albondigas")
         cy.get(".description-details").should("have.value", "Midden-oosterse gehaktballetjes in tomatensaus met couscous en tzatziki")
         cy.get(".url-details").should("have.value", "https://www.ah.nl/allerhande/recept/R-R1196836/albondigas")
         cy.get('input[name="servingCalories"').should("have.value", "945")
         cy.get('input[name="servingCount"').should("have.value", "2")
         cy.get('select[name="cuisine"').should("have.value", "Midden-Oosters")
         cy.get('.note-details').should("have.value", "Couscous : water = 1 : 1")
      })

      describe('Ingredients', () => {
         beforeEach(() => {
            cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' }).as("getRecipe")
            cy.intercept('GET', '/api/ingredient', { fixture: "all-ingredients.json" })
            cy.intercept('GET', '/api/cuisine', { fixture: "all-cuisines.json" })
            cy.intercept('GET', '/api/amounttype', { fixture: "all-amounttypes.json" })
            cy.visit('http://localhost:3000/recipe/1/edit')
            cy.wait("@getRecipe")
         })

         it('displays all the correct ingredients for unedited Albondigas', () => {
            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").should("have.value", "tomatenblokjes")
               cy.dataTest("ingredient-amount").should("have.value", "1")
               cy.dataTest("amount-type").should("have.value", "stuk")
            })
         })

         it('adds a new empty ingredients row', () => {
            cy.get(".add-ingredient-button").contains("Add ingredient").click()
            cy.dataTest("ingredient-edit-row-4").within(() => {
               cy.dataTest("ingredient-name").should("be.empty")
               cy.dataTest("ingredient-amount").should("be.empty")
               cy.dataTest("amount-type").should("have.value", "stuk")
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
               cy.dataTest("ingredient-name").click()
               cy.get(".autocomplete-dropdown").should("exist").within(() => {
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
            cy.dataTest("autocomplete-option").should("contain", "Bosui")
            cy.dataTest("autocomplete-option").should("contain", "Ui")
            cy.dataTest("add-ingredient-option").should("not.exist")
         })

         it("adds a 'add new global ingredient' button when there is no exact ingredient match", () => {
            cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' }).as("getIngredients")
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

         it("does not add a global ingredient when canceling in the modal", () => {
            cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })
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
               cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })
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
            cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })
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
            cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' }).as('getIngredients')

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
               cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' }).as("getRecipe")
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
                  expect(alertStub).to.have.been.calledWith("There was an error deleting the recipe.")
               })
            })
         })

         describe("Cancel button", () => {
            it('undoes the edit, redirects and makes no call if user cancels', () => {
               cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' }).as("getRecipe")
               cy.visit('http://localhost:3000/recipe/1/edit')
               cy.wait("@getRecipe")

               const patchSpy = cy.spy().as('patchSpy')
               cy.intercept('PATCH', "/api/recipe/**", patchSpy)
               cy.dataTest("edit-cancel-button").click()
               cy.get('@patchSpy').should("not.have.been.called")
               cy.location("pathname").should("equal", "/recipe/1")
            })
         })

         describe("Save button", () => {
            beforeEach(() => {
               cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' }).as("getRecipe")
               cy.intercept('PATCH', '/api/recipe/*', { fixture: { statusCode: 200, body: {} } })
               cy.visit('http://localhost:3000/recipe/1/edit')
               cy.wait("@getRecipe")
            })

            it('sends a patch request with correct edits when saving recipe', () => {
               cy.intercept('PATCH', '/api/recipe/1').as('patchRecipe')

               cy.get(".page-title").clear().type("Albondigas!")
               cy.get('select[name="cuisine"').select("Japans")
               cy.dataTest("ingredient-edit-row-0").within(() => {
                  cy.dataTest("ingredient-name").click()
                  cy.get(".autocomplete-dropdown").should("exist").within(() => {
                     cy.dataTest("autocomplete-option").contains("Aardappel").click()
                  })
                  cy.dataTest("ingredient-amount").type("5")
                  cy.dataTest("amount-type").select("portie")
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
                  expect(interception.request.body).to.deep.include, {
                     "id": 1,
                     "name": "Albondigas!",
                     "description": "Midden-oosterse gehaktballetjes in tomatensaus met couscous en tzatziki",
                     "servingCalories": 945,
                     "servingCount": 2,
                     "note": "",
                     "cuisine": "Japans",
                     "externalRecipeLink": "https://www.ah.nl/allerhande/recept/R-R1196836/albondigas",
                  }
                  expect(interception.request.body.ingredients).to.deep.include, {
                     "ingredients": [
                        {
                           "id": 15,
                           "name": "Aardappel",
                           "amount": "15.00",
                           "amountType": "portie"
                        }]
                  }
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
})