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

// MUST CHECK OUT
// https://twitter.com/oliverjumpertz/status/1586329719452180484?s=20&t=ef5DlJI93bpYItPzXp3AlA

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// CLEAN CODE

/*
1. Readable code
  - avoid "clever" / overcomplicated solutions
  - descriptive variable and function names 
2. General rules
  - write DRY code (refactor code)
  - don't pollute global namespace, rather encapsulate!
  - use const and let (not var!)
  - use strong type checks (===)
3. Functions  
  - write small functions if possible (that do one thing)
  - don't use more than 3 function parameters
  - use default params whenever possible
  - generally, return same data type as you received
  - use arrow functions when they make code more readable (e.g. cb in array methods)
4. "Classes"
  - use ES6 classes syntax (but understand what it really does)
  - encapsulate data and don't mutate it outside of the class
  - implement method chaining
  - always use function declarations (never arrow functions) as methods!
5. Avoiding nested code
  - use guard clauses (return early if some condition is not met)
  - use ternary (conditional) or logical operators instead of IF
  - use multiple IF statements instead of IF/ELSE
  - avoid for loops, use array methods instead
  - avoid callback based async APIs
6. Async code
  - consume promises with async/await (avoid .then())
  - whenever you can, run promises in parallel (Promise.all, Promise.race ...)
  - handle errors and promise rejection
*/