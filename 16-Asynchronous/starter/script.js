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

// getPosition()
//   .then(({ coords: { latitude: lat, longitude: lng }}) => {
//     console.log('Fetching geolocation data...')
//     return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
//   })
//   .then((res) => {
//     if (!res.ok) throw Error('Error while fetching data from geolocation API.')
//     return res.json();
//   })
//   .then(({ country }) => {
//     console.log('Fetching country data...')
//     return fetch(`https://restcountries.com/v3.1/name/${country.toLowerCase()}`)
//   })
//   .then((res) => {
//     if (!res.ok) throw Error('Error while fetching data from country API.')
//     return res.json();
//   })
//   .then((data) => {
//     console.log(data[0]);
//     console.log(data[0].name);
//     // renderCountry(data.shift())
//   })
//   .catch(console.error)

// const whereAmI = async function () { // async func automatically returns a promise!
//   // same as .then(), just a bit different syntax...
//   try {
//     const { coords: { latitude: lat, longitude: lng } } = await getPosition();
//     const res = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
//     const { country } = await res.json();
//     const res2 = await fetch(`https://restcountries.com/v3.1/name/${country.toLowerCase()}`);
//     const data = await res2.json();
//     renderCountry(data.shift());
//     return country;
//   } catch (err) {
//     console.error(err);
//   }
// }

// console.log('1: Fetching your country...');
// // IIFE
// (async function () {
//   try {
//     const country = await whereAmI();
//     console.log(`2: You live in ${country}`);
//   } catch (err) {
//     console.log('2: Error while fetching country...');
//   }
//   console.log('3: Done fetching country.');
// })();

const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

const loadImages = async function (images) {
  try {
    const imgs = images.map((i) => createImage(i));
    console.log(imgs);
    const imgEls = await Promise.all(imgs);
    console.log(imgEls);
    imgEls.forEach((el) => el.classList.add('parallel'))
  } catch (err) {
    console.error(err);
  }
}

loadImages(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'])