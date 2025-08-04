"use client"

import { useState } from "react"

export default function IngredientAmountTypeSelector({ingredient, amountTypes, handleIngredientChange}){

   const [isOpen, setIsOpen] = useState(false)
return (
   <select data-test="amount-type" className="third-column ingredient-input" type="text" value={ingredient.amountType} onChange={(e) => handleIngredientChange(index, "amountType", e.target.value)}>
                        {amountTypes.map((type) => (
                            <option key={type.amountType} value={type.amountType}>{type.amountType}</option>
                        ))}
                    </select>
)
}