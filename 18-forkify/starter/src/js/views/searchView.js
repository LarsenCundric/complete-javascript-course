class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  // Publisher
  addHandlerRender(subscriberFunc) {
    this._parentElement.addEventListener('submit', (e) => {
      e.preventDefault();
      subscriberFunc();
    });
  }
}

export default new SearchView();