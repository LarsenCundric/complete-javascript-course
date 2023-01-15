import View from "./view";
import icons from 'url:../../img/icons.svg'; // parcel2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Publisher
  addHandlerClick(subscriberFunc) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      subscriberFunc(+btn.dataset.goto);
    })
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    
    if (currPage === 1 && numPages > 1) {
      return this._generateNextButtonMarkup(currPage);
    }

    if (currPage === numPages && numPages > 1) {
      return this._generateBackButtonMarkup(currPage);
    }

    if (currPage < numPages) {
      return `${this._generateBackButtonMarkup(currPage)}${this._generateNextButtonMarkup(currPage)}`;
    }

    return '';
  }

  _generateBackButtonMarkup(currPage) {
    const goto = currPage - 1;
    return `
      <button data-goto=${goto} class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${goto}</span>
      </button>
    `;
  }

  _generateNextButtonMarkup(currPage) {
    const goto = currPage + 1;
    return `
      <button data-goto=${goto} class="btn--inline pagination__btn--next">
        <span>Page ${goto}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }
}

export default new PaginationView();