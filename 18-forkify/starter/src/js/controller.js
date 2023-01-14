// import icons from '../img/icons.svg'; // parcel 1
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './views/recipeView';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// subscriber function
const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1); 
    if (!id) return;

    recipeView.renderSpinner();

    // Loading our recipe
    await model.loadRecipe(id);

    // Render recipe
    console.log(model.state.recipe)
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
}

const init = () => recipeView.addHandlerRender(controlRecipes);

init();
