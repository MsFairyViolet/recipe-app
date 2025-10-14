import Link from "next/link"

export default function UsedInDisplay({ recipes, onOpenModal }) {

   const sortedRecipes = recipes.slice().sort((a, b) =>
      a.name.localeCompare(b.name))

   if (!recipes || recipes.length === 0) {
      return <span>-</span>
   }

   const displayRecipes = sortedRecipes.slice(0, 2)
   const hasMoreRecipes = sortedRecipes.length > 2
   const hiddenCount = sortedRecipes.length - 2

   return (
      <div className="used-in-display">
         {displayRecipes.map((recipe, index) => (
            <div className="used-in-element" key={recipe.id}>
               <Link href={`/recipe/${recipe.id}`} className="recipe-link-inline">
                  {recipe.name}
               </Link>
               {(index < displayRecipes.length - 1 || hasMoreRecipes) && ", "}
            </div>
         ))}
         {hasMoreRecipes ?
            <button onClick={onOpenModal} className="inline-button">
               and {hiddenCount} more</button>
            : null}
      </div>
   )
}