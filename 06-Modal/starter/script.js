'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal')

const closeModal = () => {
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
}

const openModal = () => {
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
}

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));
overlay.addEventListener('click', closeModal);
btnCloseModal.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
})
