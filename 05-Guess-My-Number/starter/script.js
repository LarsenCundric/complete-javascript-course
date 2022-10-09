'use strict';

const maxNumber = 20;

const msgs = {
  invalid: '⛔️ No number!',
  success: '🎉 Correct number!',
  lower: '📈 Too high!',
  higher: '📉 Too low!',
  lost: '😭 You lost!',
  start: 'Start guessing...',
}

let score;
let secretNumber;
let highScore = 0;

const getRandomNumber = () => Math.trunc(Math.random() * maxNumber) + 1;

const displayMessage = (msg) => document.querySelector('.message').textContent = msg;

function keepScore() {
  if (score === 1) {
    displayMessage(msgs.lost);
    document.querySelector('.score').textContent = 0;
    return;
  }
  score = score - 1;
  document.querySelector('.score').textContent = score;
}

function getHighScore() {
  if (score > highScore) {
    highScore = score;
    document.querySelector('.highscore').textContent = highScore;
  }
}

function resetGame() {
  secretNumber = getRandomNumber();
  score = maxNumber;
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').textContent = '?';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.guess').value = '';
  displayMessage(msgs.start);
  console.log(secretNumber);
}

function checkNumber() {
  const guess = Number(document.querySelector('.guess').value);
  if (!guess) {
    displayMessage(msgs.invalid);
  } else if (guess === secretNumber) {
    displayMessage(msgs.success);
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').textContent = secretNumber;
    document.querySelector('.number').style.width = '30rem';
    getHighScore();
  } else if (guess > secretNumber) {
    displayMessage(msgs.lower);
    keepScore();
  } else if (guess < secretNumber) {
    displayMessage(msgs.higher);
    keepScore();
  }
}

function setListeners() {
  document.querySelector('.check').addEventListener('click', checkNumber);
  document.querySelector('.again').addEventListener('click', resetGame);
}

setListeners();
resetGame();