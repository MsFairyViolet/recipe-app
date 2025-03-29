import Main from "@/app/components/RecipeList/RecipeListPage";
import AllIngredients from "./components/IngredientsList/IngredientsPage";
import AlterRecipe from "./components/EditRecipe/EditRecipe";
import Recipe from "./components/ViewRecipe/ViewRecipe";

export default function Home() {
  return (
    <div>
      <main>
        <Main/>
        <AllIngredients/>
        <AlterRecipe/>
        <Recipe/>
      </main>
    </div>
  );
}
