import { useState, useEffect } from "react"

export default function EditRecipeIngredientsList({ ingredients, handleIngredientAdd, handleIngredientChange, handleIngredientDelete, handleAllIngredientsDelete, globalIngredients }) {

    const amountTypeOptions = ["stuk", "portie", "gram", "cup", "ml", "tsp", "tbsp"]

    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState(null)

    const filteredGlobalIngredients = globalIngredients.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))

    const isDropDownOpen = query && filteredGlobalIngredients.length > 0

    return (
        <div className="edit-page ingredients-list">
            <div className="row column-title">
                <span className="first-column">Name</span>
                <span className="second-column">Amount</span>
                <span className="third-column">Type</span>
                <span className="fourth-column">x</span>
            </div>

            {ingredients.map((ingredient, index) => (
                <div className="row" key={ingredient.id}>
                    <input className="first-column autocomplete-wrapper ingredient-input"
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => {
                            handleIngredientChange(index, "name", e.target.value)
                            setQuery(e.target.value)
                        }}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setTimeout(() => setQuery(""), 100)}
                        placeholder="Start typing..."
                    />
                    {focusedIndex === index && filteredGlobalIngredients.length > 0 && (
                        <ul className="autocomplete-dropdown ingredient-input">
                            {filteredGlobalIngredients.map((option) => (
                                <li key={option.id}
                                    onClick={() => {
                                        handleIngredientChange(index, "name", option.name)
                                        handleIngredientChange(index, "id", option.id)
                                        setFocusedIndex(null)
                                    }}>
                                    {option.name}
                                </li>
                            ))}
                        </ul>
                    )}
                    <input className="second-column ingredient-input" type="number" value={ingredient.amount} onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}></input>
                    <select className="third-column ingredient-input" type="text" value={ingredient.amountType} onChange={(e) => handleIngredientChange(index, "amountType", e.target.value)}>
                        {amountTypeOptions.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button className="fourth-column" onClick={() => handleIngredientDelete(index)}>x</button>
                </div>
            ))
            }
            <div className="button-container">
                <button className="add-ingredient-button" type="button" onClick={() => handleIngredientAdd()}>Add ingredient</button>
                <button className="delete-all-ingredients-button" type="button" onClick={() => handleAllIngredientsDelete()}>Delete all ingredients</button>
            </div>
        </div >

    )
}