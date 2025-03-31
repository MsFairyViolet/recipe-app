export default function RecipeList({ recipes }) {

    return (
        <div className="recipe-list-container">
            {recipes.map((recipe) => (
                <div className="recipe-row" key={recipe.id}>
                    <div className="recipe-title-column">{recipe.name}</div>
                    <div className="recipe-calorie-column">{recipe.calories}</div>
                    <div className="recipe-cuisine-column">{recipe.cuisine}</div>
                </div>
            ))
            }
        </div>
    )
}