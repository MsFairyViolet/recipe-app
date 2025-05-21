import { useState } from "react"
import UsedInDisplay from "./UsedInDisplay"
import UsedInModal from "./UsedInModal"

export default function IngredientsList({ ingredients, searchQuery, error, onIngredientEdit, onIngredientDelete }) {

   const filteredIngredients = ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()))

   const [selectedIngredient, setSelectedIngredient] = useState(null)

   return (
      <div className="ingredients-page list">
         <div className="row column-title">
            <span className="first-column">Name</span>
            <span className="second-column">Used in</span>
            <span className="third-column">Edit</span>
            <span className="fourth-column">X</span>
         </div>
         {filteredIngredients.length > 0 ? (
            filteredIngredients.map((ingredient, index) => (
               <div data-test={`ingredient-row-${index}`} className="row" key={ingredient.id}>
                  <span className="first-column">{ingredient.name}</span>
                  <span className="second-column"><UsedInDisplay recipes={ingredient.recipes} onOpenModal={() => setSelectedIngredient(ingredient)} /></span>
                  <button className="third-column edit-button" onClick={() => onIngredientEdit(index)}>✎</button>
                  <button className="fourth-column delete-button" onClick={() => onIngredientDelete(index)}>x</button>
               </div>
            ))
         ) : (
            error === null ?
               <span className="warning">No ingredients found.</span>
               :
               <span className="warning error">Something went wrong.</span>
         )}

         {selectedIngredient && (
            <UsedInModal ingredient={selectedIngredient} onClose={() => setSelectedIngredient(null)} />
         )}

      </div>
   )
}