"use client"

import { useState, useRef } from "react"
import { addIngredient } from "@components/common/Apicalls"
import { useConfirm } from "@components/common/ConfirmProvider"
import { toBaseChars } from "@components/common/filterHelpers"

export default function RecipeIngredientSelector({ ingredient, row, allIngredients, ingredientList, handleIngredientChange, fetchIngredients }) {

   const confirm = useConfirm()
   const [searchQuery, setSearchQuery] = useState("")
   const [isOpen, setIsOpen] = useState(false)
   const [isSelectingFromDropdown, setIsSelectingFromDropdown] = useState(false)
   const [hasError, setHasError] = useState(false)
   const inputRef = useRef(null)

   const handleFocus = () => {
      setIsOpen(true)
      setSearchQuery(ingredient.name)
   }

   const handleBlur = (inputfield) => {
      if (inputfield.target.value.trim() !== "") {
         if (!isSelectingFromDropdown && !validateIngredient(ingredient)) {
            setHasError(true)
            setIsOpen(false)
            setIsSelectingFromDropdown(false)
            return
         }
      }
      setSearchQuery("")
      setIsOpen(false)
      setHasError(false)
      setIsSelectingFromDropdown(false)
   }

   const validateIngredient = (queryIngredient) => {
      return !isNaN(Number(queryIngredient.id))
   }

   const checkIngredientExists = (queryIngredient) => {
      const ingredientExists = allIngredients.some(
         (ingredient) => ingredient.name.toLowerCase() === queryIngredient.trim().toLowerCase()
      )
      return ingredientExists
   }

   const handleQueryIngredientAdd = async (defaultName = "") => {
      await confirm("Add new global ingredient", defaultName, true)
         .then((queryIngredient) => {
            if (!queryIngredient) {
               if (ingredient.name.trim() !== "" && !checkIngredientExists(ingredient.name)) {
                  setHasError(true)
               }
               return
            }

            const newIngredient = queryIngredient.trim()

            if (checkIngredientExists(newIngredient)) {
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
                  setHasError(false)
                  setSearchQuery("")
               })
               .catch((error) => {
                  console.error("Error adding ingredient:", error)
                  alert("There was an error adding the ingredient.")
               })
         })
   }

   const filteredIngredients = allIngredients.filter(i =>
      toBaseChars(i.name.toLowerCase()).includes(toBaseChars(searchQuery.toLowerCase()))
   )

   return (
      <div className="first-column autocomplete-container">
         <input
            ref={inputRef}
            data-test={`ingredient-name`}
            className={`autocomplete-input ${hasError ? 'error' : ''}`}
            type="text"
            value={ingredient.name}
            onChange={(e) => {
               handleIngredientChange(row, "name", e.target.value)
               setSearchQuery(e.target.value)

               if (e.target.value.trim() === "") {
                  setHasError(false)
               }
            }}
            onFocus={handleFocus}
            onBlur={(field) => handleBlur(field)}
            placeholder="ingredient"
         />
         {isOpen && (
            <ul className="autocomplete-dropdown ingredient-input">
               {filteredIngredients.map((option, index) => {
                  const occursInRecipe = ingredientList.some((ingredient, index) => ingredient.id === option.id && index !== row)
                  const isSelected = ingredientList.some((ingredient, index) => ingredient.id === option.id && index === row)

                  return (
                     <li data-test="autocomplete-option" key={`${option.id}-${index}`}
                        className={`${isSelected ? 'selected' : ''} ${occursInRecipe ? 'occurs' : ''}`}
                        onMouseDown={(e) => {
                           e.preventDefault()
                           if (occursInRecipe) {
                              alert("Ingredient is already used in this recipe.")
                              handleIngredientChange(row, "name", "")
                              setSearchQuery("")
                              inputRef.current.focus()
                              return
                           }
                           setIsSelectingFromDropdown(true)
                           handleIngredientChange(row, "name", option.name)
                           handleIngredientChange(row, "id", option.id)
                           setHasError(false)
                        }}>
                        {option.name}
                     </li>)
               })}
               {!allIngredients.some(
                  (item) => item.name.toLowerCase() === searchQuery.toLowerCase()
               ) && (
                     <li data-test="add-ingredient-option" className="add-new-ingredient"
                        onMouseDown={(e) => {
                           setIsSelectingFromDropdown(true)
                           e.preventDefault()
                           handleQueryIngredientAdd(searchQuery)
                           setIsOpen(false)
                        }}>
                        + Add <i>{searchQuery}</i>
                     </li>
                  )
               }
            </ul>
         )}
      </div>
   )
}

