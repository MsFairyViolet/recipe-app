// "use client"

// import {useState, useEffect} from "react"
// import recipesData from "../../data/mockrecipes.json"
// import RecipeListPage from "../components/RecipeList/RecipeListPage";
// import ViewRecipe from "../components/ViewRecipe/ViewRecipe";


// export default function RecipeApp() {
//   const [recipes, setRecipes] = useState([])

//   useEffect(() => {
//   setRecipes(recipesData)
//   }, [])

//   useEffect(() => {
//     console.log(recipes[0])
//   })

//   return (
//     <div className="app">
//       <main>
//         <RecipeListPage recipes={recipes}/>
        
//         {recipes.length > 0 ?
//         <ViewRecipe recipe={recipes[0]}/> : <p className="no-results-message">Loading recipe...</p>
//         }
        
//       </main>
//     </div>
//   );
// }
