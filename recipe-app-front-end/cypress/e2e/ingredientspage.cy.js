describe("Ingredients Page", () => {
   beforeEach(() => {
      cy.visit("http://localhost:3000/ingredients")
   })

   it("has the Ingredients title", () => {
      cy.get("h1").contains("All Ingredients")
   })

   //List content
   it("has an ingredient list", () => {

   })

   it("has nothing to display", () => {

   })

   it("shows an error when API fails", () => {

   })

   //UsedInModal
   it("opens Used In modal", () =>{
      
   })

   //Searchbar
   it(`returns 'Okonamiyakisaus' when searching ${term}`, () => {

   })

   it("returns 2 ingredients when searching for 'kip'", () => {

   })

   it("returns warning if there is no result", () => {

   })

   //New Ingredient Button
   it("opens new ingredient modal", () =>{

   })

   //Edit Ingredient Button
   it("opens edit ingredient modal", () =>{
      
   })

   //Delete Ingredient Button
   it("opens delete ingredient modal", () =>{
      
   })

   //Modal
   it("cancel works", () =>{
      
   })

   it("saves input", () =>{
      
   })

   it("gives warning when ingredient with same name exists", () =>{
      
   })

})