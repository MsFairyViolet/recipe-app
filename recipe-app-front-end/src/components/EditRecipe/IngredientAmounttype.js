import { useState, useRef } from "react"

export default function IngredientAmountType({ingredient, row, handleIngredientChange}) {

   const [hasError, setHasError] = useState(false)
   const inputRef = useRef(null)

   return (
   <input
      data-test="ingredient-amount" className="second-column ingredient-input" type="text" placeholder="quanity"
      value={ingredient.amount}
      onFocus={(e) => e.target.select()}
      onChange={(e) => handleIngredientChange(row, "amount", e.target.value)}>
   </input>
   )
}