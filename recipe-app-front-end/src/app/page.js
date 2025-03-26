import Main from "@/app/pages/Main";
import AllIngredients from "./pages/AllIngredients";
import AlterRecipe from "./pages/AlterRecipe";
import Recipe from "./pages/Recipe";

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
