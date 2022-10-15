'use strict';

function oneWord(str) {
  return str.replaceAll(' ', '').toLowerCase();
}

function upperFirstWord (str) {
  const [first, ...other] = str.split(' ');
  return [first.toUpperCase(), ...other].join(' ');
}

// Higher Order function
function transformer(str, fn) {
  console.log(`Transforming string '${str}' with function ${fn.name}.`)
  return fn(str);
}

console.log(transformer('Testing my HIgher Order function!', oneWord));
console.log(transformer('first word upper?', upperFirstWord));

const myForEach = (arr, fn) => {
  for (const el of arr) {
    fn(el);
  }
};

const arr = [1, 2, 3, 4, 5];

myForEach(arr, console.log);

// Higher Order function
const greet = function(greeting) {
  return function(name) {
    console.log(`${greeting} ${name}`);
  }
}

const greeterHey = greet('Hey');
greeterHey('Jonas');
// functional programming...
greet('Hola')('boi');

// Arrow...
const greetArrow = (greeting) => (name) => { console.log(`${greeting} ${name}`) }

greetArrow('Test')('arrow');

// BIND
const addTax = (rate, val) => val + rate * val;
const addVATSlovenia = addTax.bind(null, 0.21);
console.log(addVATSlovenia(100));

// addTax but with higher order func
const partialFuncVAT = (rate) => {
  return (val) => addTax(rate, val); 
}
const addVATPortugal = partialFuncVAT(0.23);

console.log(addVATPortugal(100))