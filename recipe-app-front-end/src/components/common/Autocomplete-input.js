"use client"

import { useState } from "react"
import { addIngredient } from "@components/common/Apicalls"
import { useConfirm } from "@components/common/ConfirmProvider"



export default function AutocompleteInput({ ingredient, index, allIngredients, ingredientList, handleIngredientChange, fetchIngredients }) {

   const confirm = useConfirm()

   const [isOpen, setIsOpen] = useState(false)
   const [query, setQuery] = useState("")

   const [focusedIndex, setFocusedIndex] = useState(null)

   const handleFocus = (index) => {
      setFocusedIndex(index)
      setIsOpen(true)
   }

   const handleBlur = () => {
      setTimeout(() => {
         setQuery("")
         setFocusedIndex(null)
         setIsOpen(false)
      }, 100)
   }

   const handleQueryIngredientAdd = async (defaultName = "", index) => {
      await confirm("Add new global ingredient", defaultName, true)
         .then((queryIngredient) => {
            if (!queryIngredient) return

            const newIngredient = queryIngredient.trim();
            const ingredientExists = allIngredients.some(
               (ingredient) => ingredient.name.toLowerCase() === newIngredient.toLowerCase()
            );

            if (ingredientExists) {
               alert("That ingredient already exists! Please modify the name and try again.")
               return
            }

            addIngredient(newIngredient)
               .then((data) => {
                  fetchIngredients();

                  if (data && data.name) {
                     handleIngredientChange(index, "name", data.name)
                     handleIngredientChange(index, "id", data.id)
                  } else {
                     handleIngredientChange(index, "name", newIngredient)
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
         <input data-test={`ingredient-name-${index}`} className="autocomplete-input"
            type="text"
            value={ingredient.name}
            onChange={(e) => {
               handleIngredientChange(index, "name", e.target.value)
               setQuery(e.target.value)
            }}
            onFocus={() => handleFocus(index)}
            onBlur={() => handleBlur()}
            placeholder="Start typing..."
         />
         {focusedIndex === index && (
            <ul className="autocomplete-dropdown ingredient-input">
               {filteredIngredients.map((option) => (
                  <li data-test="autocomplete-option" key={option.id}
                     onMouseDown={(e) => {
                        e.preventDefault()
                        handleIngredientChange(index, "name", option.name)
                        handleIngredientChange(index, "id", option.id)
                        setFocusedIndex(null)
                     }}>
                     {option.name}
                  </li>
               ))}
               {!allIngredients.some(
                  (item) => item.name.toLowerCase() === query.toLowerCase()
               ) && (
                     <li data-test="add-ingredient-option" className="add-new-ingredient" onClick={(e) => {
                        e.preventDefault()
                        handleQueryIngredientAdd(query, index)
                        setFocusedIndex(null)
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

