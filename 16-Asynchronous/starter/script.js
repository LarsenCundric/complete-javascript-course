'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}m people</p>
      <p class="country__row"><span>🗣️</span>${Object.values(data.languages)[0]}</p>
      <p class="country__row"><span>💰</span>${Object.values(data.currencies)[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

///////////////////////////////////////

const getPosition = function () {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
}

getPosition()
  .then(({ coords: { latitude: lat, longitude: lng }}) => {
    console.log('Fetching geolocation data...')
    return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
  })
  .then((res) => {
    if (!res.ok) throw Error('Error while fetching data from geolocation API.')
    return res.json();
  })
  .then(({ country }) => {
    console.log('Fetching country data...')
    return fetch(`https://restcountries.com/v3.1/name/${country.toLowerCase()}`)
  })
  .then((res) => {
    if (!res.ok) throw Error('Error while fetching data from country API.')
    return res.json();
  })
  .then((data) => {
    console.log(data[0]);
    console.log(data[0].name);
    renderCountry(data.shift())
  })
  .catch(console.error)
  // .then((data) => console.log(data));