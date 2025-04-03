import Link from 'next/link'

export default function RecipeList({ recipes, searchQuery }) {

    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="recipe-list">
            <div className="row column-title">
                <p className="name-column">Name</p>
                <p className="calorie-column">Cal.</p>
                <p className="cuisine-column">Cuisine</p>
            </div>
            {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                    <div className="row" key={recipe.id}>
                        <div className="name-column"><Link href={`/recipe/${recipe.id}`}>{recipe.name}</Link></div>
                        <div className="calorie-column">{recipe.servingCalories}</div>
                        <div className="cuisine-column">{recipe.cuisine}</div>
                    </div>
                ))
            ) : (
                <p className="no-results-message">No recipes found.</p>
            )
            }
        </div>
    )
}