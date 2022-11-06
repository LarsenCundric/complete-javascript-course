// executed before script.js
console.log('Exporting module.');

// private to module!
const shippingCost = 10;
export const cart = [];

// named export
export const addToCart = function (product, quantity) {
  cart.push({ product, quantity });
  console.log(`${quantity} ${product} added to cart.`);
}

const totalPrice = 29;
const totalQuantity = 3;

// named export!
export { totalPrice, totalQuantity as tq }