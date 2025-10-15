import { useState, useRef } from "react"

export default function IngredientAmountType({ ingredient, row, handleIngredientChange }) {

   const [hasError, setHasError] = useState(false)
   const inputRef = useRef(null)

   //check if all the amounts are a valid number
   const validateAmount = (amount) => {
      if(isNaN(parseFloat(amount))){
         setHasError(true)
         console.log("error on this amount")
      }
      setHasError(false)
   }

   return (
      <input
         data-test="ingredient-amount" className={`second-column ingredient-input ${hasError ? 'error' : ''}`} type="text" placeholder="quanity"
         value={ingredient.amount}
         onFocus={(e) => e.target.select()}
         onChange={(e) => handleIngredientChange(row, "amount", e.target.value.replace(',', '.'))}
         onBlur={(e) => validateAmount(e.target.value)}>
      </input>
   )
}