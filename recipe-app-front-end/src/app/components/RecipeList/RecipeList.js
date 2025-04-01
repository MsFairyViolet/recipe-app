export default function RecipeList({ recipes, searchQuery }) {

    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="recipe-list-container">
            <div className="recipe-row column-title">
                <p className="recipe-name-column">Name</p>
                <p className="recipe-calorie-column">Cal.</p>
                <p className="recipe-cuisine-column">Cuisine</p>
            </div>
            {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                    <div className="recipe-row" key={recipe.id}>
                        <div className="recipe-name-column">{recipe.name}</div>
                        <div className="recipe-calorie-column">{recipe.servingCalories}</div>
                        <div className="recipe-cuisine-column">{recipe.cuisine}</div>
                    </div>
                ))
            ) : (
                <p className="no-results-message">No recipes found.</p>
            )
            }
        </div>
    )
}