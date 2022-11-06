// module is by default in strict mode
import { addToCart, totalPrice as price, tq, cart } from './shoppingCart.js'; // hoisted!
import * as ShoppingCart from './shoppingCart.js'; // import everything under namespace ShoppingCart!
import add from './shoppingCart2.js'; // import from default export can be named whatever we want.

console.log('Importing module.');

// console.log(shippingCost); // Reference error! Variable is private to module!

addToCart('oranges', 3)
console.log(price, tq);
ShoppingCart.addToCart('apples', 1)
add('kiwi', 4)
ShoppingCart.addToCart('apples', 1)

console.log(cart); // live connection to export! --> we get the mutated array