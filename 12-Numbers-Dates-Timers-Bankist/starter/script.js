'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

let currentAccount;
let timer;

const now = new Date();
// labelDate.textContent = now.toLocaleDateString() // day/month/year
const dateOptions = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
};
// const locale = navigator.language
// console.log(locale);

// labelDate.textContent = new Intl.DateTimeFormat(locale, dateOptions).format(now);

const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

const formatDate = (date) => {
  const today = new Date();
  const daysPassed = calcDaysPassed(date, today);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(currentAccount.locale).format(date);
}

const formatCur = (value, locale, currency) => {
  const opts = { style: 'currency', currency };
  return new Intl.NumberFormat(locale, opts).format(value);
};

// DISPLAY MOVEMENTS
const displayMovements = function (account, sort = false) {

  // slice to make a copy!
  const movements = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const movType = mov > 0 ? 'deposit' : 'withdrawal';
    const date = formatDate(new Date(account.movementsDates[i]));
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movType}">${i + 1} ${movType}</div>
        <div class="movements__date">${date}</div>
        <div class="movements__value">${formatCur(mov, account.locale, account.currency)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html)
  });
}

// CREATE USERNAMES
const createUsernames = function(accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
    .toLocaleLowerCase()
    .split(' ')
    .reduce((p, c) => `${p}${c.charAt(0)}`, '');
  });
}
createUsernames(accounts)

// CALCULATE BALANCE
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => mov + acc, 0);
  labelBalance.textContent = formatCur(account.balance, account.locale, account.currency)
}

// DISPLAY SUMMARY
const calcDisplaySummary = function (account) {
  const movements = account.movements;
  const income = movements.filter((mov) => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(income, account.locale, account.currency)

  const out = movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, account.locale, account.currency)

  const interest = movements
    .filter((mov) => mov > 0)
    .map((deposit) => deposit * account.interestRate / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent =formatCur(interest, account.locale, account.currency)
}

const updateUI = (acc) => {
  calcDisplaySummary(acc);
  calcDisplayBalance(acc);
  displayMovements(acc);
  labelDate.textContent = new Intl.DateTimeFormat(acc.locale, dateOptions).format(now);
}

const startLogOutTimer = function () {
  let toSeconds = 5 * 60;
  // let toSeconds = 10;

  const tick = () => {
    toSeconds = toSeconds - 1;
    let minutes = String(Math.trunc(toSeconds / 60)).padStart(2, '0')
    let seconds = String(toSeconds % 60).padStart(2, '0')
    labelTimer.textContent = `${minutes}:${seconds}`;
    if (toSeconds === 0) {
      // LOGOUT
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
      clearInterval(timer);
    }
  };

  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submitting!
  currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);

  if (currentAccount?.pin !== Number(inputLoginPin.value)) return;
  console.log('LOGIN');

  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ').shift()}`
  containerApp.style.opacity = 100;

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur(); // lose focus!

  updateUI(currentAccount);
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
})

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find((acc) => acc.username === inputTransferTo.value);

  if (!receiverAccount?.username) {
    alert('Username does not exist!');
    return;
  }

  if (amount <= 0) {
    alert('Can only transfer positive amounts!');
    return;
  }

  if (amount > currentAccount.balance) {
    alert('Insufficient funds!');
    return;
  }

  if (currentAccount.username === receiverAccount.username) {
    alert('You cannot transfer funds to yourself!');
    return;
  }

  currentAccount.movements.push(-amount)
  currentAccount.movementsDates.push((new Date()).toISOString())
  receiverAccount.movements.push(amount)
  receiverAccount.movementsDates.push((new Date()).toISOString())

  updateUI(currentAccount);

  clearInterval(timer);
  timer = startLogOutTimer();

  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferAmount.blur(); // lose focus!
});

// LOANS
const approveLoan = (acc, amount) => {
  acc.movements.push(amount);
  acc.movementsDates.push((new Date()).toISOString());

  updateUI(acc);
}

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount <= 0) {
    alert('Invalid amount!');
    return;
  }

  if (!currentAccount.movements.some((mov) => mov >= amount * 0.1)) {
    alert('Condition not met! You need to have at least one deposit greater or equal to 10% of the loan amount.');
    return;
  }

  clearInterval(timer);
  timer = startLogOutTimer();
  setTimeout(() => approveLoan(currentAccount, amount), 3000);
  inputLoanAmount.value = '';
  inputLoanAmount.blur(); // lose focus!
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const pin = Number(inputClosePin.value);
  const deleteAccountName = inputCloseUsername.value;

  if (deleteAccountName !== currentAccount.username) {
    alert('Invalid username! Please write in your username');
    return;
  }

  if (currentAccount.pin !== pin) {
    alert('Invalid credentials!');
    return;
  }

  const deleteAccountIndex = accounts.findIndex((acc) => acc.username === currentAccount.username);

  // Delete UI
  accounts.splice(deleteAccountIndex, 1);

  // Hide UI
  containerApp.style.opacity = 0;

  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputClosePin.blur(); // lose focus!
})

// console.log(
//   accounts
//     .map((acc) => acc.movements)
//     .flat()
//     .reduce((acc, mov) => mov + acc, 0)
// );

// console.log(
//   accounts
//     .flatMap((acc) => acc.movements)
//     .reduce((acc, mov) => mov + acc, 0)
// );

// SORTING --> return < 0 A, B (keep order); return > 0 B, A (switch order)
// console.log(
//   account1.movements.sort((a, b) => a - b)
// );

let sortedMovements = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sortedMovements = !sortedMovements;
  displayMovements(currentAccount, sortedMovements)
});

// Array.from()
// console.log(Array.from({ length: 5 }, (_, i) => i + 1)); // 1, 2, 3, 4, 5
// const randomDiceRolls = Array.from({ length: 1000 }, (_, i) => Math.trunc(Math.random() * 6 + 1));
// const initRolls = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
// console.log(randomDiceRolls.reduce((acc, e) => ({ ...acc, [e]: acc[e] + 1 }), initRolls));

// If we don't have an array of movements
// document.querySelector('.movements').addEventListener('click', function () {
//   const htmlMovements = document.querySelectorAll('.movements__value')
//   // from nodelist to array!
//   console.log(Array.from(htmlMovements, (el) => el.textContent.replace('€', '')));

//   const array2 = [...htmlMovements] // same but we have to do map() separately
//   console.log(array2);
// })

/////////////////////////////////////////////////
// TIME, DATES

// console.log(0.1 + 0.2); // difficult to represent 0.1 in binary, just like 1/3 = 0.3333333333 in decimal!
// console.log(0.1 + 0.2 === 0.3); // bug in JS that we have to accept! is false, but should be true
// console.log(typeof +'23') // number!
// console.log(Number.parseInt('23px', 10)) // if starts with number...
// console.log(parseInt('  1.23rem', 10)) // is on global object, but use Number. to provide namespace
// console.log(Number.parseFloat('  1.23rem', 10)) // if starts with number...
// console.log(23 / 0); // Infinity - not consider NaN!

// // Alternating colors
// document.querySelector('.movements').addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')] // same but we have to do map() separately
//     .forEach((row, i) => {
//       i % 2 || (row.style.backgroundColor = '#FBCEB1');
//     });
// })

// const diameter = 287_460_000_000; // parser does not see _!
// const bigInt = 3249278954789274098923n;

// FAKE LOGIN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// console.log(new Date());
// console.log(new Date(account1.movementsDates[0]));

// const future = new Date(2037, 10, 19, 15, 23)
// console.log(+future);

// const calcDaysPassed = (date1, date2) => Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
// const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 6))
// console.log(days1);

// // NUMBER FORMATER
// const numberOptions = {
//   style: 'currency',
//   currency: 'EUR', // Add manually
//   // useGrouping: true,
// }

// const num = 39_094_390.34;
// console.log('US', new Intl.NumberFormat('en-US', numberOptions).format(num));
// console.log('DE', new Intl.NumberFormat('de-DE', numberOptions).format(num));
// console.log('SY', new Intl.NumberFormat('ar-SY', numberOptions).format(num));

// TIMERS
// setTimeout((what) => console.log(`Done waiting for ${what}!`), 2000, 'pizza 🍕'); // async ;) callback stack
// console.log('Waiting!');
// setInterval(function () {
//   const now = new Date();
//   console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
// }, 1000)