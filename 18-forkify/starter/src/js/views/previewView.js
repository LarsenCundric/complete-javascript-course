import View from "./View";

class PreviewView extends View {
  _generateMarkupPreview(el) {
    const id = window.location.hash.slice(1);
    return `
      <li class="preview">
        <a class="preview__link ${el.id === id ? 'preview__link--active' : ''}" href="#${el.id}">
          <figure class="preview__fig">
            <img src="${el.image}" alt="${el.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${el.title}</h4>
            <p class="preview__publisher">${el.publisher}</p>
            <div class="preview__user-generated">
              <svg>
                <use href="src/img/icons.svg#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default PreviewView;