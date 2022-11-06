// executed before script.js
console.log('Exporting module.');

// private to module!
const cart = [];

// default (unnamed export)
export default function (product, quantity) {
  cart.push({ product, quantity });
  console.log(`${quantity} ${product} added to cart.`);
}