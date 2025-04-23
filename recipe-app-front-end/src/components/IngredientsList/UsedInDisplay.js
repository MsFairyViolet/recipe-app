export default function UsedInDisplay({ recipes, onClick }) {

   const sortedRecipes = recipes.slice().sort((a, b) =>
      a.name.localeCompare(b.name))

   if (!recipes || recipes.length === 0) {
      return <span>-</span>
   }

   if (recipes.length <= 2) {
      return <span>{sortedRecipes.map((recipe) => recipe.name).join(", ")}</span>
   }

   const displayed = sortedRecipes.slice(0, 2).map((recipe) => recipe.name).join(", ")

   return (
      <span>{displayed},{" "} <button onClick={onClick} className="inline-button">
         and {recipes.length - 2} more
      </button>
      </span>
   )

}