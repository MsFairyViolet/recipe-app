"use client"

import { useState } from "react"

export default function IngredientAmountTypeSelector({ ingredient, row, amountTypes, handleIngredientChange }) {

    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(ingredient.amountType)

    const handleFocus = () => {
        setIsOpen(true)
    }

    const handleBlur = () => {
        setIsOpen(false)
    }

    return (
        <>
            <div className="amount-type ingredient-input third-column select-container">
                <div className="amount-type select-box"
                    tabIndex={0}
                    onMouseDown={() => handleFocus()}
                    onBlur={() => handleBlur()}>
                    <span className="dropdown-label">{selected}</span>
                    <span className="dropdown-arrow">&#9662;</span>
                </div>
                {isOpen && (
                    <ul className="dropdown-options" >
                        {amountTypes.map((item, index) => (
                            <li
                                key={`${item.amountType}-${index}`}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    setSelected(item.amountType)
                                    handleIngredientChange(row, "amountType", item.amountType)
                                    setIsOpen(false)
                                }}
                            >
                                {item.amountType}</li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}