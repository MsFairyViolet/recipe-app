import Link from "next/link"

export default function UsedInDisplay({ recipes, onOpenModal }) {

   const sortedRecipes = recipes.slice().sort((a, b) =>
      a.name.localeCompare(b.name))

   if (!recipes || recipes.length === 0) {
      return <span>-</span>
   }

   if (recipes.length <= 2) {
      return (
         <span>
            {sortedRecipes.map((recipe, index) => (
               <span key={recipe.id}>
                  <Link href={`/recipe/${recipe.id}`} className="recipe-link-inline">
                     {recipe.name}
                  </Link>
                  {index < sortedRecipes.length - 1 && ", "}
               </span>
            ))}
         </span>
      )
   }

   const displayed = sortedRecipes.slice(0, 2)
   const hiddenCount = sortedRecipes.length - 2

   return (
      <span>
         {displayed.map((recipe, index) => (
            <span key={recipe.id}>
               <Link href={`/recipe/${recipe.id}`} className="recipe-link-inline">
                  {recipe.name}
               </Link>
               {index < displayed.length - 1 && ", "}
            </span>
         ))}
         {", "}
         <button onClick={onOpenModal} className="inline-button">
            and {hiddenCount} more
         </button>
      </span>
   )

}