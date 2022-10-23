'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const section1 = document.querySelector('#section--1');
const btnScrollTo = document.querySelector('.btn--scroll-to');
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' })
});

////////////////////////////////////////////////////////////
// Page navigation

// will perform badly if many listeners! Use common parent event and use BUBBLING!
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href'); // relative!
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.classList.contains('nav__link')) return;
  const id = e.target.getAttribute('href');
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
})

////////////////////////////////////////////////////////////
// Tabbed Component --> Operations 

const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

document.querySelector('.operations__tab-container').addEventListener('click', function (e) {
  e.preventDefault();

  const tabClicked = e.target.closest('.operations__tab'); // we also have child elements! (e.g. span)
  if (!tabClicked) return;

  tabs.forEach((t) => t.classList.remove('operations__tab--active'));
  tabClicked.classList.add('operations__tab--active');

  tabsContent.forEach((t) => t.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${tabClicked.dataset.tab}`).classList.add('operations__content--active');
});

////////////////////////////////////////////////////////////
// Change opacity of nav elements 

function handleNavHover(e) {
  const link = e.target;
  if (!link.classList.contains('nav__link')) return;
  const siblings = link.closest('.nav').querySelectorAll('.nav__link');
  const logo = link.closest('.nav').querySelector('img');
  siblings.forEach((el) => {
    if (el !== link) el.style.opacity = this;
  })
  logo.style.opacity = this;
}
const nav = document.querySelector('.nav');
nav.addEventListener('mouseover', handleNavHover.bind(0.5));
nav.addEventListener('mouseout',  handleNavHover.bind(1));

////////////////////////////////////////////////////////////
// Create sticky nav after a certain point 

// BAD PERFORMANCE!
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function (e) {
//   if (this.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// })

// sticky navigation: Intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(console.log)
// };

// const obsOptions = {
//   root: null, // target to intersect
//   threshold: [0, 0.2], // 0 - 1 of intersection (% of visibility)
// }

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const { height: navHeight } = nav.getBoundingClientRect();

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, { root: null, rootMargin: `-${navHeight}px`, threshold: 0 });
headerObserver.observe(header);

////////////////////////////////////////////////////////////
// Show sections when close to them

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, { root: null, threshold: 0.15 });

allSections.forEach((s) => {
  sectionObserver.observe(s);
  s.classList.add('section--hidden');
});

////////////////////////////////////////////////////////////
// Lazy loading

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  // listen for load event! (when image loads)
  // only then remove the lazy-img class!
  entry.target.addEventListener('load', () => entry.target.classList.remove('lazy-img'));
  observer.unobserve(entry.target);
}

const imgTargets = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver(loadImg, { root: null, threshold: 0, rootMargin: '300px' });
imgTargets.forEach((img) => imgObserver.observe(img));

////////////////////////////////////////////////////////////
// Slider

let currSlide = 0;

// init
const slider = document.querySelector('.slider');

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');


const slides = document.querySelectorAll('.slide');

const dotContainer = document.querySelector('.dots');
const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
  });
};
createDots();

const setActiveDot = (slide) => {
  document.querySelectorAll('.dots__dot').forEach((dot) => dot.classList.remove('dots__dot--active'))
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

const goToSlide = (goTo) => {
  slides.forEach((slide, idx) => {
    slide.style.transform = `translateX(${(idx - goTo) * 100}%)`;
  });
  setActiveDot(goTo);
};
goToSlide(0);

const prevSlide = function () {
  currSlide--;
  if (currSlide < 0) {
    currSlide = slides.length - 1;
  }
  goToSlide(currSlide);  
}

const nextSlide = function () {
  currSlide++;
  if (currSlide >= slides.length) {
    currSlide = 0;
  }
  goToSlide(currSlide);
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  const { slide } = e.target.dataset;
  goToSlide(slide);
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// EXPERIMENTING

// console.log(document.documentElement);

// const allSections = document.querySelectorAll('.section')
// console.log(allSections);

// document.getElementById('section--1');
// const btns = document.getElementsByTagName('button'); // all buttons
// console.log(btns); // HTML collection --> automatically updates upon element deletion, unlike NodeList!

// console.log(document.getElementsByClassName('btn')); // HTML collection

// // Creating and inserting elements
// // .insertAdjacentHTML

// const message = document.createElement('div'); // just created, not in DOM yet, but is just an object with all its properties
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML = 'We use cookies for improved functionality and analytics <button class="btn btn--close-cookie"> Got it!</button>';

// const header = document.querySelector('.header');
// header.prepend(message);
// header.append(message); // move from being first child to being last child
// // DOM element is unique and can be only in one place at a time
// // header.append(message.cloneNode(true)); // clone element
// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   // message.remove() // VERY RESENT!
//   message.parentElement.removeChild(message) // OLD WAY
// });

// // inline styles
// message.style.backgroundColor = '#37383d'
// message.style.width = '120%'
// console.log(message.style.height); // will not get anything! Only works on inline styles...

// console.log(getComputedStyle(message).height); // real style as it appears in the website
// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

// // :root in styles
// document.documentElement.style.setProperty('--color-primary', 'orangered')

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src); // absolute
// console.log(logo.getAttribute('src')); // relative
// console.log(logo.className);

// // Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// console.log(logo.setAttribute('company', 'Bankist'));
// console.log(logo.dataset.versionNumber); // data-version-number!

// event CAPTURING, TARGET, BUBBLING
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
//   // stop event propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   // currentTarget === this
//   console.log('NAV', e.target, e.currentTarget);
// }, true);

// SMOOTH SCROLL

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);
//   console.log(this.getBoundingClientRect());
//   console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
//   console.log('Height and width of view port', document.documentElement.clientHeight, document.documentElement.clientWidth);

//   // modern smooth scrolling (only modern browsers!)
//   section1.scrollIntoView({ behavior: 'smooth' })

//   // old school jump scrolling
//   // window.scrollTo(s1coords.left, s1coords.top) // .top is height till top... it is relative
//   // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset) // absolute!

//   // old school smooth scrolling
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // })
// });