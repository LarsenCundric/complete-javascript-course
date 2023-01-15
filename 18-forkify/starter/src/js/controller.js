// import icons from '../img/icons.svg'; // parcel 1
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import { MODAL_CLOSE_SECONDS } from './config';

import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';

// if (module.hot) { // Parcel - application state can be retained as you change small things
//   module.hot.accept()
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// subscriber function
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); 
    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {
    // Get query string
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err);
    resultsView.renderError();
  }
}

const controlPagination = function (goto) {
  resultsView.render(model.getSearchResultsPage(goto));
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function () {
  if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
}

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
