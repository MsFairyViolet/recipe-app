export default function RecipeIngredientsList({ ingredients }) {

    return (

        <div className="ingredients-list">
            <div className="row column-title">
                <span className="first-column">Name</span>
                <span className="second-column">Amount</span>
                <span className="third-column">Type</span>
            </div>
            {ingredients.length > 0 ? (
                ingredients.map((ingredient, index) => (
                    <div data-test={`ingredient-row-${index}`} className="row" key={`${ingredient.name}-${index}`}>
                        <span className="first-column">{ingredient.name}</span>
                        <span className="second-column">{parseFloat(ingredient.amount)}</span>
                        <span className="third-column">{ingredient.amountType}</span>
                    </div>
                ))
            ) : (
                <p className="warning">No ingredients yet...</p>
            )}

        </div >

    )
}