export default function RecipeList() {
    return (
        <div className="recipe-list-container">
            <div className="recipe-title-column">
            <h2>Recipe</h2>
            <h2>Recipe2</h2>
            <h2>Recipe 3</h2>
            </div>
            
            <div className="recipe-calorie-column">
                <p>800</p>
                <p>905</p>
                <p>1202</p>
            </div>

            <div className="recipe-cuisine-column">
                <p>Italiaans</p>
                <p>Japans</p>
                <p>Midden-Oosters</p>
            </div>
        </div>
    )
}