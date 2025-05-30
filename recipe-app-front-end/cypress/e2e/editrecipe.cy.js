describe('Edit Recipe Page', () => {

   describe('Recipe information', () => {

      it('displays all the correct detail information for unedited Albondigas', () => {
         cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' }).as("getRecipe")
         cy.visit('http://localhost:3000/recipe/1/edit')
         cy.wait("@getRecipe")

         cy.get(".page-title").should("have.value", "Albondigas")
         cy.get(".description-details").should("have.value", "Midden-oosterse gehaktballetjes in tomatensaus met couscous en tzatziki")
         cy.get(".url-details").should("have.value", "https://www.ah.nl/allerhande/recept/R-R1196836/albondigas")
         cy.get('input[name="servingCalories"').should("have.value", "945")
         cy.get('input[name="servingCount"').should("have.value", "2")
         cy.get('select[name="cuisine"').should("have.value", "Midden-Oosters")
         cy.dataTest("ingredient-edit-row-0").within(() => {
            cy.dataTest("ingredient-name").should("have.value", "tomatenblokjes")
            cy.dataTest("ingredient-amount").should("have.value", "1")
            cy.dataTest("amount-type").should("have.value", "stuk")
            })
      })

      //Fetch this recipe information, loading, failed
      it('gives a warning when fetching recipe is loading', () => {
         cy.intercept('GET', '/api/recipe/1', { fixture: 'single-recipe.json' }).as("getRecipe")
         cy.visit('http://localhost:3000/recipe/1/edit')
         cy.wait("@getRecipe")
      })
      it('gives a error when fetching recipe failed', () => {
         cy.intercept('GET', '/api/recipe/1', { statusCode: 500, body: {}}).as("getRecipe")
         cy.visit('http://localhost:3000/recipe/1/edit')
         cy.wait("@getRecipe")
      })

      //Fetch Global Ingredients, loading?, failed

      //Fetch All recipes, loading?, failed

      //Fetch cuisines, failed
      //Fetch AmountTypes, failed

      //If 2 fetches fail at the same time, still errors?

      //Document title
      //Prefilled information correct?

      //Handlechange on input fields, number saved as number?

      //Delete button
      //Confirm popup
      //cancel, no call made
      //confirm, call made, failed
      //redirect to main page

      //Cancel button, redirect to unedited edit page recipe, and no call

      //Save button
      //Alert required fields
      //Alert all fields ingredients
      //Alert Recipe Exists
      //Patch API made, failed
      //Redirect to recipe page
      //is json.stringify(formdata) correct? (numbers for numbers etc)

      //Enter works on input and text area
   })

   describe('Ingredients', () => {
      //Correct ingredients

      //Add Ingredient button
      //Create empty row with default information

      //Handle Ingredient Change, updates field when typing

      //Delete ingredient from recipe, correct row gets removed

      //Delete all ingredients from recipe
      //Confirm popup
      //Cancel, no change
      //Delete, did list change?

      //Dropdown shows when clicking/focus ingredient name
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



      //If you click away from dropdown, does it dissappear?

   })




})