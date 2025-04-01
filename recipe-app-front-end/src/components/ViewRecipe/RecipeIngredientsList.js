export default function RecipeIngredientsList({ recipe }) {
    return (

        <div className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
                <p className="ingredient-row" key={`${ingredient.name}-${index}`}>{ingredient.name}</p>
            ))
            }
        </div >

    )
}