'use strict';

let scores = [0, 0];
let activeScore = 0;
let activePlayer = 0;
let playing = true;

const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

function resetGame() {
  playing = true;
  scores = [0, 0];
  activePlayer = 0;
  score0El.textContent = 0;
  score1El.textContent = 0;
  diceEl.classList.add('hidden');
  document.getElementById(`current--0`).textContent = 0;
  document.getElementById(`current--1`).textContent = 0;
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
}

function switchPlayer() {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  // if the class is present, remove, otherwise add! :D
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
  activeScore = 0;
}

function rollDice() {
  if (!playing) return;

  const roll = Math.trunc(Math.random() * 6) + 1;
  diceEl.classList.remove('hidden');
  diceEl.src = `dice-${roll}.png`;

  if (roll === 1) {
    switchPlayer()
  } else {
    activeScore = activeScore + roll;
    document.getElementById(`current--${activePlayer}`).textContent = activeScore;
  }
}

function holdScore() {
  if (!playing) return;

  scores[activePlayer] = scores[activePlayer] + activeScore;
  document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

  if (scores[activePlayer] >= 10) {
    diceEl.classList.add('hidden');
    document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
    document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
    playing = false;
    return;
  }

  switchPlayer(scores[activePlayer]);
}

btnRoll.addEventListener('click', rollDice);
btnHold.addEventListener('click', holdScore);
btnNew.addEventListener('click', resetGame);

resetGame();
