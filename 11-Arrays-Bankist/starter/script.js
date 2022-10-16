'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

// DISPLAY MOVEMENTS
const displayMovements = function (account) {
  containerMovements.innerHTML = '';
  account.movements.forEach((mov, i) => {
    const movType = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movType}">${i + 1} ${movType}</div>
        <div class="movements__value">${mov}€</div>
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
  labelBalance.textContent = `${account.balance} EUR`;
}

// DISPLAY SUMMARY
const calcDisplaySummary = function (account) {
  const movements = account.movements;
  const income = movements.filter((mov) => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const out = movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${out}€`;

  const interest = movements
    .filter((mov) => mov > 0)
    .map((deposit) => deposit * account.interestRate / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
}

const updateUI = (acc) => {
  calcDisplaySummary(acc);
  calcDisplayBalance(acc);
  displayMovements(acc);
}

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
  receiverAccount.movements.push(amount)

  updateUI(currentAccount);

  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferAmount.blur(); // lose focus!
});

// LOANS
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount <= 0) {
    alert('Invalid amount!');
    return;
  }

  if (!currentAccount.movements.some((mov) => mov >= amount * 0.1)) {
    alert('Condition not met! You need to have at least one deposit greater or equal to 10% of the loan amount.');
    return;
  }

  currentAccount.movements.push(amount);

  updateUI(currentAccount);
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

/////////////////////////////////////////////////
