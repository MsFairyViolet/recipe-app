"use client"

import { useState } from "react"
import { addIngredient } from "@components/common/Apicalls"
import { useConfirm } from "@components/common/ConfirmProvider"

export default function RecipeIngredientSelector({ ingredient, row, allIngredients, ingredientList, handleIngredientChange, fetchIngredients }) {

   const confirm = useConfirm()
   const [query, setQuery] = useState("")
   const [isOpen, setIsOpen] = useState(false)

   const handleFocus = () => {
      setIsOpen(true)
   }

   const handleBlur = () => {
      setQuery("")
      setIsOpen(false)
   }

   const handleQueryIngredientAdd = async (defaultName = "") => {
      await confirm("Add new global ingredient", defaultName, true)
         .then((queryIngredient) => {
            if (!queryIngredient) return

            const newIngredient = queryIngredient.trim();
            const ingredientExists = allIngredients.some(
               (ingredient) => ingredient.name.toLowerCase() === newIngredient.toLowerCase()
            )

            if (ingredientExists) {
               alert("That ingredient already exists! Please modify the name and try again.")
               return
            }

            addIngredient(newIngredient)
               .then((data) => {
                  fetchIngredients();

                  if (data && data.name) {
                     handleIngredientChange(row, "name", data.name)
                     handleIngredientChange(row, "id", data.id)
                  } else {
                     handleIngredientChange(row, "name", newIngredient)
                  }
               })
               .catch((error) => {
                  console.error("Error adding ingredient:", error)
                  alert("There was an error adding the ingredient.")
               })
         })
   }

   const filteredIngredients = allIngredients.filter(i =>
      i.name.toLowerCase().includes(query.toLowerCase()) &&
      !ingredientList.some(ingredient => ingredient.id === i.id)
   )

   return (
      <div className="first-column autocomplete-container">
         <input data-test={`ingredient-name`} className="autocomplete-input"
            type="text"
            value={ingredient.name}
            onChange={(e) => {
               handleIngredientChange(row, "name", e.target.value)
               setQuery(e.target.value)
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Start typing..."
         />
         {isOpen && (
            <ul className="autocomplete-dropdown ingredient-input">
               {filteredIngredients.map((option) => (
                  <li data-test="autocomplete-option" key={option.id}
                     onMouseDown={(e) => {
                        e.preventDefault()
                        handleIngredientChange(row, "name", option.name)
                        handleIngredientChange(row, "id", option.id)
                        setIsOpen(false)
                     }}>
                     {option.name}
                  </li>
               ))}
               {!allIngredients.some(
                  (item) => item.name.toLowerCase() === query.toLowerCase()
               ) && (
                     <li data-test="add-ingredient-option" className="add-new-ingredient" onMouseDown={(e) => {
                        e.preventDefault()
                        handleQueryIngredientAdd(query)
                        setIsOpen(false)
                     }}>
                        + Add <i>{query}</i>
                     </li>
                  )
               }
            </ul>
         )}
      </div>
   )
}

