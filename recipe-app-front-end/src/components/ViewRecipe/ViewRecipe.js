import RecipeIngredientsList from "./RecipeIngredientsList";

export default function ViewRecipe({ recipe }) {
  return (
    <div className="recipe-container">
      <h1 className="page-title">{recipe.name}</h1>

      <dl className="recipe-details">
        <div>
          <dt>Calories per serving:</dt>
          <dd>{recipe.servingCalories}</dd>
        </div>

        <div>
          <dt>Serving Count:</dt>
          <dd>{recipe.servingCount} people</dd>
        </div>

        <div>
          <dt>Description:</dt>
          <dd>{recipe.description}</dd>
        </div>

        <div>
          <dt>Recipe URL:</dt>
          <dd>
            <a href={recipe.externalRecipeLink}>
              {recipe.externalRecipeLink}
            </a>
          </dd>
        </div>

        <div>
          <dt>Cuisine:</dt>
          <dd>{recipe.cuisine}</dd>
        </div>

        <div>
          <dt>Ingredients:</dt>
          <dd><RecipeIngredientsList recipe={recipe} /></dd>
        </div>

        {recipe.note && (
          <div>
            <dt>Notes:</dt>
            <dd>{recipe.note}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
