import Link from 'next/link'

export default function RecipeList({ recipes, searchQuery }) {

    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="recipe-list">
            <div className="row column-title">
                <span className="name-column">Name</span>
                <span className="calorie-column">Cal.</span>
                <span className="cuisine-column">Cuisine</span>
            </div>
            {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                    <div className="row" key={recipe.id}>
                        <span className="name-column"><Link href={`/recipe/${recipe.id}`}>{recipe.name}</Link></span>
                        <span className="calorie-column">{recipe.servingCalories}</span>
                        <span className="cuisine-column">{recipe.cuisine}</span>
                    </div>
                ))
            ) : (
                <span className="no-results-message">No recipes found.</span>
            )
            }
        </div>
    )
}