import { useState } from "react"
import { useConfirm } from "@components/common/ConfirmProvider"


export default function EditRecipeIngredientsList({ ingredientList, handleIngredientAdd, handleIngredientChange, handleIngredientDelete, handleAllIngredientsDelete, ingredients, fetchIngredients, amountTypes }) {

    const [query, setQuery] = useState("")
    const [focusedIndex, setFocusedIndex] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const confirm = useConfirm()

    const filteredIngredients = ingredients.filter(i =>
        i.name.toLowerCase().includes(query.toLowerCase()) &&
        !ingredientList.some(ingredient => ingredient.id === i.id)
    )

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
                const ingredientExists = ingredients.some(
                    (ingredient) => ingredient.name.toLowerCase() === newIngredient.toLowerCase()
                );

                if (ingredientExists) {
                    alert("That ingredient already exists! Please modify the name and try again.")
                    return
                }

                fetch(`/api/ingredient`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: newIngredient })
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to add ingredient")
                        }
                        return response.json()
                    })
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

    return (
        <div className="edit-page ingredients-list">
            <div className="row column-title">
                <span className="first-column">Name</span>
                <span className="second-column">Amount</span>
                <span className="third-column">Type</span>
                <span className="fourth-column">x</span>
            </div>

            {ingredientList.map((ingredient, index) => (
                <div data-test={`ingredient-edit-row-${index}`} className="row" key={ingredient.id}>
                    <div className="first-column autocomplete-container">
                        <input data-test="ingredient-name" className="autocomplete-input ingredient-input"
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
                                {!ingredients.some(
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
                    <input
                        data-test="ingredient-amount" className="second-column ingredient-input" type="number"
                        value={ingredient.amount === "" | isNaN(parseFloat(ingredient.amount)) ? "" : parseFloat(ingredient.amount)}
                        onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}>
                    </input>
                    <select data-test="amount-type" className="third-column ingredient-input" type="text" value={ingredient.amountType} onChange={(e) => handleIngredientChange(index, "amountType", e.target.value)}>
                        {amountTypes.map((type) => (
                            <option key={type.amountType} value={type.amountType}>{type.amountType}</option>
                        ))}
                    </select>
                    <button data-test="ingredient-delete-button" className="fourth-column" onClick={() => handleIngredientDelete(index)}>x</button>
                </div>
            ))
            }
            <div className="button-container">
                <button className="add-ingredient-button" type="button" onClick={() => handleIngredientAdd()}>Add ingredient</button>
                <button className="delete-all-ingredients-button" type="button" onClick={() => handleAllIngredientsDelete()}>Delete all ingredients</button>
            </div>
        </div>
    )
}