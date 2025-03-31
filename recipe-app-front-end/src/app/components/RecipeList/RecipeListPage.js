import SearchBar from "../common/SearchBar"
import RecipeList from "./RecipeList"

export default function RecipeListPage() {
    return (
    <>
    <h1>Recipe List Page</h1>

    <div>
        <SearchBar/>
        <RecipeList/>
    </div>
    </>
    )
}