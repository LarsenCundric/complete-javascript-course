// import icons from '../img/icons.svg'; // parcel 1
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './views/recipeView';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// API KEY - fd168a15-c447-4447-af85-09741639f324

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
    alert(err)
  }
}

const addEventListeners = function () {
  ['hashchange', 'load'].forEach((ev) => window.addEventListener(ev, controlRecipes));
}

addEventListeners();
