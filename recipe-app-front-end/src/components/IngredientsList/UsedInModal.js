import Link from "next/link"

export default function UsedInModal({ ingredient, onClose }) {

   const sortedRecipes = (ingredient.recipes || []).slice().sort((a, b) =>
      a.name.localeCompare(b.name)
    )


   return (
      <div className="overlay">
         <div className="overlay-content">
            <button className="overlay-close-button" onClick={onClose}>✕</button>
            <p><strong>{ingredient.name} </strong> is used in:</p>
            {sortedRecipes.length > 0 ? (
               <ul>
                  {sortedRecipes.map((recipe) => (
                     <li key={recipe.id}><Link href={`/recipe/${recipe.id}`}>{recipe.name}</Link></li>
                  ))}
               </ul>
            ) : (
               <p>This ingredient isn&apos;t used in any recipes yet.</p>
            )}

         </div>
      </div>
   )
}