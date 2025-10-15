import RecipeIngredientSelector from "@components/EditRecipe/RecipeIngredientSelector"
import Select from "../common/Select"
import IngredientAmountType from "./IngredientAmounttype"

export default function EditRecipeIngredientsList({ ingredientList, handleIngredientAdd, handleIngredientChange, handleIngredientDelete, handleAllIngredientsDelete, allIngredients, fetchIngredients, amountTypes }) {

    return (
        <div className="edit-page ingredients-list">
            <div className="row column-title">
                <span className="first-column">Name</span>
                <span className="second-column">Amount</span>
                <span className="third-column">Type</span>
                <span className="fourth-column">x</span>
            </div>

            {ingredientList.map((ingredient, index) => (
                <div data-test={`ingredient-edit-row-${index}`} className="row" key={`${ingredient.id}-${index}`}>
                    <RecipeIngredientSelector ingredient={ingredient} row={index} allIngredients={allIngredients} ingredientList={ingredientList} handleIngredientChange={handleIngredientChange} fetchIngredients={fetchIngredients} />
                    <IngredientAmountType ingredient={ingredient} row={index} handleIngredientChange={handleIngredientChange}/>
                    <Select options={amountTypes}
                        selected={ingredient.amountType}
                        onSelect={(value) => handleIngredientChange(index, "amountType", value)}
                        getOptionLabel={(item) => item.amountType}
                        styleType="inline"
                        dataTest="amount-type" />
                    <button data-test="ingredient-delete-button" className="fourth-column" onClick={() => handleIngredientDelete(index)}>x</button>
                </div>
            ))
            }
            <div className="button-container">
                <button className="add-ingredient-button" type="button" onClick={() => handleIngredientAdd()}>Add ingredient</button>
                <button className="delete-all-ingredients-button" type="button" onClick={() => handleAllIngredientsDelete()}>Delete all ingredients</button>
            </div>

        </div>
    )
}