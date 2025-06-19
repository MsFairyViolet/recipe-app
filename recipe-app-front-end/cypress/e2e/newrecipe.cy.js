describe('New Recipe Page', () => {
   it('has empty fields and placeholders', () => {
      cy.visit("http://localhost:3000/recipe/new")
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

   it('redirects to recipe list page on cancel', () => {
      cy.visit("http://localhost:3000/recipe/new")
      cy.dataTest('edit-cancel-button').should("contain", "Cancel").click()
      cy.location("pathname").should("equal", "/recipe")
   })

   it('sends a post request with correct data when saving recipe', () => {
      cy.intercept('POST', '/api/recipe', { statusCode: 200, body: { id: 99 } }).as('postRecipe')
      cy.intercept('GET', '/api/recipe', { fixture: 'all-recipes.json' })
      cy.intercept('GET', '/api/ingredient', { fixture: 'all-ingredients.json' })

      cy.visit("http://localhost:3000/recipe/new")

      cy.get(".page-title").type("Pasta")
      cy.get('select[name="cuisine"]').select("Italiaans")
      cy.get('.description-details').type("aa")
      cy.get('.url-details').type("aa")
      cy.get('input[name="servingCalories"]').type("1000")
      cy.get('input[name="servingCount"]').type("1")

      const ingredientData = [
         { name: "tomatenblokjes", amount: "1.00", type: "stuk" },
         { name: "gehakt", amount: "300", type: "gram" },
         { name: "cous cous", amount: "0.75", type: "cup" },
         { name: "komkommer", amount: "0.5", type: "stuk" }
      ]
      ingredientData.forEach((ingredient, i) => {
         cy.get(".add-ingredient-button").click()
         cy.dataTest(`ingredient-edit-row-${i}`).within(() => {
            cy.dataTest("ingredient-name").type(ingredient.name)
            cy.get('.autocomplete-dropdown').should("exist")
            cy.dataTest('autocomplete-option').first().click()
            cy.dataTest("ingredient-amount").type(ingredient.amount)
            cy.dataTest("amount-type").select(ingredient.type)
         })
      })

      cy.dataTest('recipe-save-button').contains("Save").click()
      cy.wait('@postRecipe').then((interception) => {
         expect(interception.request.body).to.deep.include, ({
            "name": "Pasta",
            "description": "aa",
            "servingCalories": 1000,
            "servingCount": 1,
            "note": "",
            "cuisine": "Italiaans",
            "externalRecipeLink": "aa",
         })
         expect(interception.request.body.ingredients).to.deep.include, ({
            "ingredients": [
               {
                  "id": 1,
                  "name": "Tomatenblokjes",
                  "amount": "1.00",
                  "amountType": "stuk"
               },
               {
                  "id": 3,
                  "name": "gehakt",
                  "amount": "300",
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
                  "amount": "0.5",
                  "amountType": "stuk"
               }]
         })
      })
      cy.location("pathname").should("equal", "/recipe/99")
   })

   it('alerts recipe with the same name exists when saving recipe', () => {
      cy.intercept('GET', '/api/recipe', { fixture: 'all-recipes.json' })
      cy.intercept('POST', '/api/recipe', req => {
         throw new Error('POST request should not be called when duplicate recipe exists')
      })
      const alertStub = cy.stub()
      cy.on('window:alert', alertStub)

      cy.visit('http://localhost:3000/recipe/new')

      cy.get('.page-title').type('AGBeef')
      cy.get('select[name="cuisine"]').select('Europees')
      cy.get('input[name="servingCalories"]').type('1000')
      cy.get('input[name="servingCount"]').type('1')
      cy.dataTest("recipe-save-button").click().then(() => {
         expect(alertStub).to.have.been.calledOnce
         expect(alertStub).to.have.been.calledWith("A recipe with the same name already exists!")
      })
   })

   it('shows an alert if the POST fails', () => {
      cy.intercept('POST', '/api/recipe', { statusCode: 500, body: {} }).as('postRecipe')
      const alertStub = cy.stub()
      cy.on('window:alert', alertStub)

      cy.visit('http://localhost:3000/recipe/new')

      cy.get('.page-title').type('Aaaaaa')
      cy.get('select[name="cuisine"]').select('Europees')
      cy.get('input[name="servingCalories"]').type('1000')
      cy.get('input[name="servingCount"]').type('1')

      cy.dataTest("recipe-save-button").click().then(() => {
         expect(alertStub).to.have.been.calledOnce
         expect(alertStub).to.have.been.calledWith("There was a problem creating the recipe.")
      })
      cy.wait('@postRecipe')
   })
})


