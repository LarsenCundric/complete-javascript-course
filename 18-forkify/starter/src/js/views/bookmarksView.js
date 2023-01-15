import PreviewView from "./previewView";

class BookmarksView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it!';
  _message = '';

  // Publisher
  addHandlerRender(subscriberFunc) {
    window.addEventListener('load', subscriberFunc)
  }

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }
}

export default new BookmarksView();