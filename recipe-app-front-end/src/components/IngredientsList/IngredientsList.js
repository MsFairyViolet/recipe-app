import { useState } from "react"
import UsedInDisplay from "./UsedInDisplay"
import UsedInModal from "./UsedInModal"

export default function IngredientsList({ ingredients, searchQuery, onIngredientEdit, onIngredientDelete }) {

   const toBaseChars = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

   const filteredIngredients = ingredients.filter(i =>
      toBaseChars(i.name.toLowerCase()).includes(toBaseChars(searchQuery.toLowerCase())) 
   )

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
                  <div className="second-column"><UsedInDisplay recipes={ingredient.recipes} onOpenModal={() => setSelectedIngredient(ingredient)} /></div>
                  <button className="third-column edit-button" onClick={() => onIngredientEdit(ingredient)}>✎</button>
                  <button className="fourth-column delete-button" onClick={() => onIngredientDelete(ingredient)}>x</button>
               </div>
            ))
         ) : (
            <span className="warning">No ingredients found.</span>
         )}

         {selectedIngredient && (
            <UsedInModal ingredient={selectedIngredient} onClose={() => setSelectedIngredient(null)} />
         )}

      </div>
   )
}