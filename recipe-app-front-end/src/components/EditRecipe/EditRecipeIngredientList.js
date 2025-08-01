import RecipeIngredientSelector from "@components/common/RecipeIngredientSelector"

export default function EditRecipeIngredientsList({ ingredientList, handleIngredientAdd, handleIngredientChange, handleIngredientDelete, handleAllIngredientsDelete, allIngredients, fetchIngredients, amountTypes }) {

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
                    <RecipeIngredientSelector ingredient={ingredient} row={index} allIngredients={allIngredients} ingredientList={ingredientList} handleIngredientChange={handleIngredientChange} fetchIngredients={fetchIngredients} />
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