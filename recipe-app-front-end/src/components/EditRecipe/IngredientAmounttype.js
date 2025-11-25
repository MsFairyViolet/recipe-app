import ErrorToolTip from "@components/common/ErrorToolTip"
import { useState, useEffect } from "react"

export default function IngredientAmountType({ ingredient, row, handleIngredientChange, showErrors }) {

   const [errorField, setErrorField] = useState({ error: false, message: "" })

   const validateAmount = (amount) => {
      if (isNaN(parseFloat(amount))) {
         setErrorField({ error: true, message: "Not a valid number" })
         return
      }
      setErrorField({ error: false, message: "" })
   }

   useEffect(() => {
      if (showErrors) {
         validateAmount(ingredient.amount)
      }
   }, [showErrors, ingredient.amount])

   return (
      <div className="amount-box second-column">
         <input
            data-test="ingredient-amount" className={`ingredient-input ${showErrors && errorField.error ? 'error' : ''}`} type="text" placeholder="quanity"
            value={ingredient.amount}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleIngredientChange(row, "amount", e.target.value.replace(',', '.'))}
         >
         </input>
         {errorField.error && (
            <ErrorToolTip message={errorField.message}/>
         )}
      </div >
   )
}