"use client"

import {useState, useEffect} from "react"
import recipesData from "../../data/mockrecipes.json"
import RecipeListPage from "@/app/components/RecipeList/RecipeListPage";


export default function RecipeApp() {
  const [recipes, setRecipes] = useState([])

  useEffect(() =>
  setRecipes(recipesData))

  return (
    <div>
      <main>
        <RecipeListPage recipes={recipes}/>
      </main>
    </div>
  );
}
