import SearchBar from "../common/SearchBar"
import RecipeList from "./RecipeList"

export default function RecipeListPage({recipes}) {

return (
    <>
    <h1 className="page-title">Recipe List Page</h1>

    <div className="recipe-page-container">
        <SearchBar/>
        <RecipeList recipes={recipes}/>
    </div>
    </>
    )
}