import { useState, useRef } from "react"

export default function IngredientAmountType({ ingredient, row, handleIngredientChange, showErrors }) {

   const [errorField, setErrorField] = useState({error: false, message: ""})
   const inputRef = useRef(null)

   const validateAmount = (amount) => {
      if(isNaN(parseFloat(amount))){
         setErrorField({error: true, message: "Not a valid number"})
         return
      }
      setErrorField({error: false, message: ""})
   }

   return (
      <input
         data-test="ingredient-amount" className={`second-column ingredient-input ${showErrors && errorField.error ? 'error' : ''}`} type="text" placeholder="quanity"
         value={ingredient.amount}
         onFocus={(e) => e.target.select()}
         onChange={(e) => handleIngredientChange(row, "amount", e.target.value.replace(',', '.'))}
         onBlur={(e) => validateAmount(e.target.value)}>
      </input>
   )
}