describe('Edit Recipe Page', () => {

   describe('API calls on Edit Page', () => {
      it('gives a warning when fetching this recipe is loading', () => {
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

      it('gives a error when fetching this recipe failed', () => {
         cy.intercept('GET', '/api/recipe/1', { statusCode: 500, body: {} }).as("getRecipe")
         cy.visit('http://localhost:3000/recipe/1/edit')
         cy.wait("@getRecipe")
      })

      const apiEndPoints = [
         { alias: "Ingredients", url: "/api/ingredient", fixture: "all-ingredients.json" },
         { alias: "Recipe", url: "/api/recipe", fixture: "all-recipes.json" },
         { alias: "Cuisines", url: "/api/cuisine", fixture: "all-ingredients.json" },
         { alias: "Amounttype", url: "/api/amounttype", fixture: "all-amounttypes.json" },
      ]

      apiEndPoints.forEach((api) => {
         it(`gives a warning when fetching ${api.alias} is loading`, () => {
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
         it(`gives a error when fetching ${api.alias} failed`, () => {
            cy.intercept('GET', `${api.url}`, { statusCode: 500, body: {} }).as(`get${api.alias}`)

            apiEndPoints.filter((endpoint) => endpoint.alias !== api.alias).forEach(({ url, fixture }) => {
               cy.intercept('GET', url, { fixture })
            })

            cy.visit('http://localhost:3000/recipe/1/edit')

            cy.get(".error").contains("Failed!")
         })
      })
   })

   describe('Recipe information', () => {

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

      //Enter works on input and text area


      describe.only('Ingredients', () => {

         beforeEach(() => {
            cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' }).as("getRecipe")
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

         it('abort deletes all ingredients when canceling delete-all-ingredients modal', () => {
            cy.get(".delete-all-ingredients-button").contains("Delete all ingredients").click()
            cy.get(".overlay-content").should("exist")
            cy.dataTest("cancel-button").should("contain", "Cancel").click()
            cy.dataTest("ingredient-edit-row-0").should("exist")
         })

         it.only('changes ingredient when clicking in dropdown when editing ingredient name', () => {
            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").click()
               cy.get(".autocomplete-dropdown").should("exist").within(() => {
                  cy.dataTest("autocomplete-option").contains("Aardappel").click()
               })
               cy.dataTest("ingredient-name").should("have.value", "Aardappel")
            })
         })

         it.only("auto-complete dropdown dissappears when focussing outside of the element", () => {
            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").click()
            })
            cy.get(".page-title").click()
            cy.get(".autocomplete-dropdown").should("not.exist")
         })

         //Filter when start typing (1 result, 2 results, 0 results, case insensitive)
         //"Add {queryname} +" on that button
         //That button is hidden with exact match

         //Add + opens > new global ingredient
         //Confirm popup, correct info?
         //Cancel, no call
         //Confirm
         //Alert already exist (case insensitive)
         //API call made, failed
         //reload globalingredients, api call made
         //Add new ingredient to this recipe list



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

         it('makes a DELETE call if the user confirms', () => {
            const patchSpy = cy.spy().as('patchSpy')
            cy.intercept('DELETE', "/api/recipe/**", patchSpy)
            cy.dataTest("confirm-button").contains("Confirm").click()
            cy.get(".overlay-content").should("not.exist")
            cy.get('@patchSpy').should("have.been.called")
         })

         it('shows an error if the DELETE fails', () => {
            cy.intercept('DELETE', '/api/recipe/**', { statusCode: 500, body: {} })
            cy.dataTest("confirm-button").click()
            cy.on('window:alert', (alert) => {
               expect(alert).to.equal("There was an error deleting the recipe.")
            })
         })

         it('redirects to the main page if the DELETE succeeds', () => {
            cy.intercept('DELETE', '/api/recipe/**', { statusCode: 200, body: {} }).as("deleteRecipe")
            cy.dataTest("confirm-button").click()
            cy.wait("@deleteRecipe")
            cy.location("pathname").should("equal", "/recipe")
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
            cy.visit('http://localhost:3000/recipe/1/edit')
            cy.wait("@getRecipe")
         })

         //Save button
         it('sends a patch request when saving recipe', () => {
            cy.intercept('PATCH', '/api/recipe/1').as('patchRecipe')
            cy.get(".page-title").clear().type("Albondigas!")

            cy.dataTest('recipe-save-button').contains("Save").click()
            cy.wait('@patchRecipe').its('request.body').should('deep.include', {
               "id": 1,
               "name": "Albondigas!",
               "description": "Midden-oosterse gehaktballetjes in tomatensaus met couscous en tzatziki",
               "servingCalories": 945,
               "servingCount": 2,
               "cuisine": "Midden-Oosters",
               "note": "Couscous : water = 1 : 1",
               "externalRecipeLink": "https://www.ah.nl/allerhande/recept/R-R1196836/albondigas",
               "ingredients": [
                  {
                     "id": 1,
                     "name": "tomatenblokjes",
                     "amount": "1.00",
                     "amountType": "stuk"
                  },
                  {
                     "id": 3,
                     "name": "gehakt",
                     "amount": "300.00",
                     "amountType": "gram"
                  },
                  {
                     "id": 4,
                     "name": "cous cous",
                     "amount": "0.75",
                     "amountType": "cup"
                  },
                  {
                     "id": 12,
                     "name": "Komkommer",
                     "amount": "0.50",
                     "amountType": "stuk"
                  }
               ]
            })

            cy.location('pathname').should('equal', '/recipe/1')
         })

         it('alerts for missing required fields when saving recipe', () => {
            const patchSpy = cy.spy().as('patchSpy')
            cy.intercept('PATCH', '/api/recipe/1', patchSpy)

            cy.get(".page-title").clear()
            cy.dataTest('recipe-save-button').click()
            cy.on('window:alert', (alert) => {
               expect(alert).to.equal("Please fill in the required fields.")
            })
            cy.get('@patchSpy').should("not.have.been.called")
         })

         it('alerts for missing ingredient fields when saving recipe', () => {
            const patchSpy = cy.spy().as('patchSpy')
            cy.intercept('PATCH', '/api/recipe/1', patchSpy)

            cy.dataTest("ingredient-edit-row-0").within(() => {
               cy.dataTest("ingredient-name").clear()
               cy.dataTest("ingredient-amount").clear()
            })

            cy.dataTest('recipe-save-button').click()
            cy.on('window:alert', (alert) => {
               expect(alert).to.equal("Please fill in all ingredient fields.")
            })
            cy.get('@patchSpy').should("not.have.been.called")
         })

         it('alerts recipe with the same name exists when saving recipe', () => {
            const patchSpy = cy.spy().as('patchSpy')
            cy.intercept('PATCH', '/api/recipe/1', patchSpy)

            cy.get(".page-title").clear().type("Pad Thai")
            cy.dataTest('recipe-save-button').click()
            cy.on('window:alert', (alert) => {
               expect(alert).to.equal("A recipe with the same name already exists!")
            })
            cy.get('@patchSpy').should("not.have.been.called")
         })

         it('shows an alert if the PATCH fails', () => {
            cy.intercept('PATCH', '/api/recipe/1', { statusCode: 500, body: {} }).as('patchRecipe')

            cy.dataTest("recipe-save-button").click()
            cy.on('window:alert', (alert) => {
               expect(alert).to.equal("Failed to update recipe.")
            })
            cy.wait('@patchRecipe')
         })
      })
   })
})