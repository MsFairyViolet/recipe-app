export default function IngredientsList({ ingredients, searchQuery, onIngredientEdit, onIngredientDelete}) {

   const filteredIngredients = ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()))

   return (
      <div className="ingredients-page list">
         <div className="row column-title">
            <span className="first-column">Name</span>
            <span className="second-column">Used in</span>
            <span className="third-column">Edit</span>
            <span className="fourth-column">Delete</span>
         </div>
         {ingredients.length > 0 ? (
            filteredIngredients.map((ingredient, index) => (
               <div className="row" key={ingredient.id}>
                  <span className="first-column">{ingredient.name}</span>
                  <span className="second-column">recipes here</span>
                  <button className="third-column edit-button" onClick={() => onIngredientEdit(index)}>✎</button>
                  <button className="fourth-column delete-button" onClick={() => onIngredientDelete(index)}>x</button>
               </div>
            ))
         ) : (
            <span className="no-results-message">No ingredients found.</span>
         )}

      </div>
   )
}