export default function EditRecipeIngredientsList({ ingredients, onIngredientChange }) {

    const amountTypeOptions = ["stuk", "portie", "gram", "cup", "ml", "tsp", "tbsp"]
    
    return (
        <div className="edit-page ingredients-list">
            <div className="row column-title">
                <span className="name-column">Name</span>
                <span className="amount-column">Amount</span>
                <span className="type-column">Type</span>
                <span className="delete-column">Delete</span>
            </div>
            {ingredients.map((ingredient, index) => (
                <div className="row" key={ingredient.id}>
                    <input className="name-column" type="text" value={ingredient.name} onChange={(e) => onIngredientChange(index, "name" , e.target.value) }></input>
                    <input className="amount-column" type="number" value={ingredient.amount} onChange={(e) => onIngredientChange(index, "amount" , e.target.value) }></input>
                    <select className="type-column" type="text" value={ingredient.amountType} onChange={(e) => onIngredientChange(index, "type" , e.target.value) }>
                        {amountTypeOptions.map((type) => (
                            <option key={type} value={type}>{type}</option> 
                        ))}
                    </select>
                    <button className="delete-column">x</button>
                </div>
            ))
            }
        </div >

    )
}