import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
	_message = 'Recipe was successfully uploaded and bookmarked.'

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
		this._addHandlerHideWindow();
  }

  _toggleWindow() {
		this._overlay.classList.toggle('hidden');
		this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this))
  }

	_addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this))
  }

	// Publisher
	addHandlerUpload(subscriberFunc) {
		this._parentElement.addEventListener('submit', function (e) {
			e.preventDefault();
			const dataArr = [...new FormData(this)];
			const data = Object.fromEntries(dataArr);
			subscriberFunc(data)
		})
	}

  _generateMarkup() {

  }
}

export default new AddRecipeView();