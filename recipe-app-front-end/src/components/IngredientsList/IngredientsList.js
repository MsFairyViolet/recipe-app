export default function IngredientsList({ ingredients, searchQuery}) {

   const filteredIngredients = ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()))

   return (
      <div className="list">
         <div className="row column-title">
            <span className="name-column">Name</span>
         </div>
         {ingredients.length > 0 ? (
            filteredIngredients.map((ingredient) => (
               <div className="row" key={ingredient.id}>
                  <span className="name-column">{ingredient.name}</span>
               </div>
            ))
         ) : (
            <span className="no-results-message">No ingredients found.</span>
         )}

      </div>
   )
}