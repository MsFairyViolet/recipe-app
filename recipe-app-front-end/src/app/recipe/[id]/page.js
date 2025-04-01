"use client"

import {useState, useEffect} from "react"
import {useParams} from 'next/navigation'
import recipesData from "../../../../data/mockrecipes.json"
import ViewRecipe from "../../../components/ViewRecipe/ViewRecipe";

export default function RecipeApp() {
  const [recipes, setRecipes] = useState([])

  const params = useParams()

  useEffect(() => {
  setRecipes(recipesData)
  }, [])

  useEffect(() => {
    console.log(recipes[0])
    console.log("Params: ", params)
  })

  return (
    <div className="app">
      <main>
        {recipes.length > 0 ?
        <ViewRecipe recipe={recipes[params.id]}/> : <p className="no-results-message">Loading recipe...</p>
        }
      </main>
    </div>
  );
}
