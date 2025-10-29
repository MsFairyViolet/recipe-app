import { useState, useEffect } from "react"
import { validate } from "uuid"

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
      if(showErrors==true){
         validateAmount()
      }
   }, [showErrors])
   
   return (
      <div className="amount-box">
         <input
            data-test="ingredient-amount" className={`second-column ingredient-input ${showErrors && errorField.error ? 'error' : ''}`} type="text" placeholder="quanity"
            value={ingredient.amount}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleIngredientChange(row, "amount", e.target.value.replace(',', '.'))}
            onBlur={(e) => validateAmount(e.target.value)}>
         </input>
         {errorField.error && (
            <button className="error-alert-button" onClick={() => console.log("test")}></button>
         )}
      </div >
   )
}