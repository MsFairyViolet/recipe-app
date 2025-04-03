import RecipeIngredientsList from "./RecipeIngredientsList";

export default function ViewRecipe({ recipe }) {
  return (
    <>
      <h1 className="page-title">{recipe.name}</h1>

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
          <h5>Ingredients:</h5>
          <p><RecipeIngredientsList recipe={recipe} /></p>
        </div>

        {recipe.note && (
          <div>
            <h5>Notes:</h5>
            <div className="note-details">
              <p>{recipe.note}</p>
            </div>
          </div>
        )}

      </div >
    </>
  );
}
