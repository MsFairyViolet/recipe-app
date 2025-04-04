export default function RecipeIngredientsList({ recipe }) {
    return (

        <div className="ingredients-list">
            <div className="row column-title">
                <span className="name-column">Name</span>
                <span className="amount-column">Amount</span>
                <span className="type-column">Type</span>
            </div>
            {recipe.ingredients.map((ingredient, index) => (
                <div className="row" key={`${ingredient.name}-${index}`}>
                    <span className="name-column">{ingredient.name}</span>
                    <span className="amount-column">{ingredient.amount}</span>
                    <span className="type-column">{ingredient.amountType}</span>
                    </div>
            ))
            }
        </div >

    )
}