import Link from "next/link"

export default function UsedInDisplay({ recipes, onOpenModal }) {

   const sortedRecipes = recipes.slice().sort((a, b) =>
      a.name.localeCompare(b.name))

   if (!recipes || recipes.length === 0) {
      return <span>-</span>
   }

   if (recipes.length <= 2) {
      return (
         <div className="used-in-display">
            {sortedRecipes.map((recipe, index) => (
               <div className="used-in-element" key={recipe.id}>
                  <Link href={`/recipe/${recipe.id}`} className="recipe-link-inline">
                     {recipe.name}
                  </Link>
                  {index < sortedRecipes.length - 1 && ", "}
               </div>
            ))}
         </div>
      )
   }

   const displayed = sortedRecipes.slice(0, 2)
   const hiddenCount = sortedRecipes.length - 2

   return (
      <div className="used-in-display">
         {displayed.map((recipe, index) => (
            <div className="used-in-element" key={recipe.id}>
               <Link href={`/recipe/${recipe.id}`} className="recipe-link-inline">
                  {recipe.name}
               </Link>
               {index < displayed.length && ", "}
            </div>
         ))}
         <button onClick={onOpenModal} className="inline-button">
            and {hiddenCount} more
         </button>
      </div>
   )
}