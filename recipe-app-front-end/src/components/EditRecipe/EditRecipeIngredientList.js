export default function EditRecipeIngredientsList({ ingredients, onIngredientAdd, onIngredientChange, onIngredientDelete, onAllIngredientsDelete}) {

    const amountTypeOptions = ["stuk", "portie", "g", "cup", "ml", "tsp", "tbsp"]

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
                    <input className="first-column" type="text" value={ingredient.name} onChange={(e) => onIngredientChange(index, "name", e.target.value)}></input>
                    <input className="second-column" type="number" value={ingredient.amount} onChange={(e) => onIngredientChange(index, "amount", e.target.value)}></input>
                    <select className="third-column" type="text" value={ingredient.amountType} onChange={(e) => onIngredientChange(index, "amountType", e.target.value)}>
                        {amountTypeOptions.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button className="fourth-column" onClick={() => onIngredientDelete(index)}>x</button>
                </div>
            ))
            }
            <div className="button-container">
            <button className="add-ingredient-button" onClick={() => onIngredientAdd()}>Add ingredient</button>
            <button className="delete-all-ingredients-button" type="button" onClick={() => onAllIngredientsDelete()}>Delete all ingredients</button>
            </div>
        </div >

    )
}