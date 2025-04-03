export default function RecipeIngredientsList({ recipe }) {
    return (

        <div className="ingredients-list">
            <div className="row column-title">
                <p className="name-column">Name</p>
                <p className="type-column">Type</p>
                <p className="amount-column">Amount</p>
            </div>
            {recipe.ingredients.map((ingredient, index) => (
                <p className="row" key={`${ingredient.name}-${index}`}>{ingredient.name}</p>
            ))
            }
        </div >

    )
}