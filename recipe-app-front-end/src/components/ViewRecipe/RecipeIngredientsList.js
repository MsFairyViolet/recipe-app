export default function RecipeIngredientsList({ recipe }) {
    return (

        <div className="ingredients-list">
            <div className="row column-title">
                <p className="name-column">Name</p>
                <p className="amount-column">Amount</p>
                <p className="type-column">Type</p>
            </div>
            {recipe.ingredients.map((ingredient, index) => (
                <div className="row" key={`${ingredient.name}-${index}`}>
                    <p className="name-column">{ingredient.name}</p>
                    <p className="amount-column">{ingredient.amount}</p>
                    <p className="type-column">{ingredient.amountType}</p>
                    </div>
            ))
            }
        </div >

    )
}