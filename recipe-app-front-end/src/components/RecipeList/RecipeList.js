import Link from 'next/link'

export default function RecipeList({ recipes, searchQuery, error }) {

    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="list">
            <div className="row column-title">
                <span className="first-column">Name</span>
                <span className="second-column">Cal.</span>
                <span className="third-column">Cuisine</span>
            </div>
            {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe, index) => (
                    <div data-test={`recipe-row-${index}`} className="row" key={recipe.id}>
                        <span className="first-column"><Link href={`/recipe/${recipe.id}`} className='recipe-link-inline'>{recipe.name}</Link></span>
                        <span className="second-column">{recipe.servingCalories}</span>
                        <span className="third-column">{recipe.cuisine}</span>
                    </div>
                ))
            ) : (
                error === null ?
                    <span className="warning">No recipes found.</span>
                    :
                    <span className="warning error">Something went wrong.</span>
            )
            }
        </div>
    )
}