export default function IngredientsList({ ingredients, searchQuery}) {

   const filteredIngredients = ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()))

   return (
      <div className="list">
         <div className="row column-title">
            <span className="first-column">Name</span>
            <span className="second-column">Used in</span>
         </div>
         {ingredients.length > 0 ? (
            filteredIngredients.map((ingredient) => (
               <div className="row" key={ingredient.id}>
                  <span className="first-column">{ingredient.name}</span>
                  <span className="second-column">recipes here</span>
               </div>
            ))
         ) : (
            <span className="no-results-message">No ingredients found.</span>
         )}

      </div>
   )
}