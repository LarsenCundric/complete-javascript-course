import 'regenerator-runtime/runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return  {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: false,
    ...(recipe.key && { key: recipe.key }),
  }
}

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/recipes/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bm) => bm.id === id)) {
      state.recipe.bookmarked = true;
    }

  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const { data } = await AJAX(`${API_URL}/recipes?search=${query}&key=${KEY}`);
    const { recipes } = data;
    state.search.results = recipes.map((r) => ({
      id: r.id,
      title: r.title,
      publisher: r.publisher,
      image: r.image_url,
      ...(r.key && { key: r.key }),
    }))
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end)
}

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function (recipe) { // add - all data
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persistBookmarks();
}

export const deleteBookmark = function (id) { // delete - only id
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
}

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (!storage) return;
  state.bookmarks = JSON.parse(storage);
  console.log(state.bookmarks)
}

init();

// For debugging purposes
const clearBookmarks = function () {
  localStorage.clear('bookmarks')
}

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map((ing) => {
        const ingArr = ing[1].split(',').map((el) => el.trim());
        if (ingArr.length !== 3) throw Error('Wrong ingredient format! Please use the correct format.');

        const [quantity, unit, description] = ingArr
        return {
          quantity: quantity && +quantity,
          unit,
          description
        }
      })

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    }

    const data = await AJAX(`${API_URL}/recipes?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data)
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}