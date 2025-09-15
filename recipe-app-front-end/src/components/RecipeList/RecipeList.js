import Link from 'next/link'

export default function RecipeList({ recipes, searchQuery }) {

   const toBaseChars = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    const filteredRecipes = recipes.filter((recipe) =>
        toBaseChars(recipe.name.toLowerCase()).includes(toBaseChars(searchQuery.toLowerCase())))

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
                <span className="warning">No recipes found.</span>
            )
            }
        </div>
    )
}