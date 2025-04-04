export default function EditRecipe({ recipe }) {
    return (
        <>
            <h1 className="page-title">EDIT {recipe.name}</h1>

            <div className="recipe-card">
                <div className="top-details">
                    <div className="big-details">
                        <p>{recipe.description}</p>
                        <a className="url-details" href={recipe.externalRecipeLink}>{recipe.externalRecipeLink}</a>
                    </div>

                    <div className="small-details">
                        <p>{recipe.servingCalories}</p>
                        <p>{recipe.servingCount} p</p>
                        <p>{recipe.cuisine}</p>
                    </div>
                </div>

                <div>
                    <h4>Ingredients:</h4>
                </div>

                {recipe.note && (
                    <div>
                        <h4>Notes:</h4>
                        <div className="note-details">
                            <p>{recipe.note}</p>
                        </div>
                    </div>
                )}

                <button className="delete-recipe-button">Delete</button>
                <button className="save-recipe-button">Save</button>


            </div >
        </>
    );
}
