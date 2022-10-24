'use strict';

// 1. new {} is created
// 2. function is called, this = {}
// 3. {} linked to prototype
// 4. function automatically returns {}

const Person = function (firstName, birthYear) {
  this.firstName = firstName;
  this.birthYear = birthYear;

  // never create a method inside a constructor function!
  // all of the instanced would have this method copy!
  // this.calcAge = function () {
  //   console.log(2037 - this.birthYear);
  // }
}

const jonas = new Person('Jonas', 1991);
console.log(jonas);

const matilda = new Person('Matilda', 2012);
console.log(matilda);

console.log(jonas instanceof Person);

const jay = { firstName: 'Jay', birthYear: 1990 }; // not created with new Person()!
console.log(jay instanceof Person);

Person.hey = function () { // not inherited! It is a static method on Person!
  console.log('Hi, there 🫡');
}
Person.hey()

// Prototypes - reusable, one-time defined, functions for all obj. instances
Person.prototype.calcAge = function () {
  console.log(2022 - this.birthYear);
}

console.log(Person.prototype);
jonas.calcAge();
console.log(jonas.__proto__); // all instances have a reference to the Person prototype.
console.log(jonas.__proto__ === Person.prototype); // true
console.log(Person.prototype.isPrototypeOf(jonas)); // true
console.log(Person.prototype.isPrototypeOf(matilda)); // true
console.log(Person.prototype.isPrototypeOf(Person)); // false --> prototype of linked objects! Not of Person itself
console.log(Object.prototype.isPrototypeOf(Person)); // true --> Persons prototype is actually that one of the Object

Person.prototype.species = 'Homo Sapiens';
console.log(jonas.species); // Homo Sapiens
console.log(jonas.hasOwnProperty('firstName')); // true
console.log(jonas.hasOwnProperty('species')); // false
jonas.species = 'Crazy Man';
console.log(jonas.hasOwnProperty('species')); // true

// PROTOTYPE CHAIN
console.log(jonas.__proto__.__proto__ === Person.prototype); // false
console.log(jonas.__proto__.__proto__ === Object.prototype); // true
console.log(jonas.__proto__.__proto__.__proto__); // null --> __proto__ of Object is null

// array prototype
const arr = [1, 2, 3, 2, 1, 2, 4];
console.log(arr.__proto__); // fill, sort, map...
console.log(arr.__proto__ === Array.prototype); // true

// not really practical! Avoid this. But its a nice experiment...
// Array.prototype.unique = function () {
//   return [...new Set(this)];
// }
// console.log(arr.unique()); // [1, 2, 3, 4]

console.dir(x => x + 1); // also has prototypes! Its basically an object

// ES6 Classes (syntax sugar over constructor functions)

// Class expression
// const PersonCl = class {
// }

// Class declaration
class PersonCl {
  constructor(fullName, birthYear) { // needs to be called constructor
    this.fullName = fullName;
    this.birthYear = birthYear;
  }
  // no commas between functions! INSTANCE method (added to prototype)
  calcAge() { // gets added to the PersonCl prototype
    console.log(2022 - this.birthYear);
  }

  get age() {
    return 2022 - this.birthYear;
  }

  set fullName(name) {
    if (name.includes(' ')) {
      this._fullName = name; // convention...
    } else {
      alert(`${name} is not a full name!`);
    }
  }

  get fullName() { // if setting a property that already exists, we need a getter!
    return this._fullName;
  }

  // static method (not added to prototype --> is a function of the class / constructor function itself)
  static hey() {
    console.log('Hey, boi 🥹');
  }
}

const jessica = new PersonCl('Jessica Test', 1996);
console.log(jessica);
console.log(jessica.__proto__ === PersonCl.prototype);
PersonCl.prototype.greet = function () { // can still add like this
  console.log('Hi', this.firstName);
};
jessica.greet;


const account = {
  owner: 'jonas',
  movements: [200, 530, 120 , 300],
  get latest() {
    return this.movements.slice(-1).pop();
  },
  set latest(mov) {
    this.movements.push(mov);
  }
};

console.log(account.latest);
console.log(account.movements);
account.latest = 230
console.log(account.movements);

console.log(jessica.age);
console.log(jessica);
console.log(jessica.fullName);
PersonCl.hey();

////////////////////////////////////////////////
// Object.create (no new, constructor functions...)

// simple object literal (defining the prototype manually)
const PersonProto = {
  calcAge() { // we want this to be inherited
    console.log(2022 - this.birthYear);
  },
  init(firstName, birthYear) { // looks like a constructor function (but has nothing to do with it)
    this.firstName = firstName;
    this.birthYear = birthYear
  }
};

const steven = Object.create(PersonProto)
steven.name = 'Steven';
steven.birthYear = 2002;
console.log(steven); // link new object to PersonProto (this is its prototype)
steven.calcAge();
console.log(steven.__proto__ === PersonProto); // true

const sarah = Object.create(PersonProto);
sarah.init('Sarah', 1987);
sarah.calcAge();
console.log(sarah);

////////////////////////////////////////////////
// "Class" Inheritance
const Student = function (firstName, birthYear, course) {
  Person.call(this, firstName, birthYear); 
  this.course = course;
}

Student.prototype = Object.create(Person.prototype); // First link Student __proto__ to Person.prototype --> this makes that constructor is Person instead of Person
Student.prototype.introduce = function () { // Then add a new prototype function
  console.log(`My name is ${this.firstName} and I study ${this.course}`);
}

const mike = new Student('Mike', 1999, 'Computer Science')
console.log(mike);
mike.introduce()
mike.calcAge()

console.log(mike.__proto__); // Student prototype
console.log(mike.__proto__.__proto__); // Person prototype
console.log(mike.__proto__.__proto__.__proto__); // Object prototype

console.dir(Student.prototype.constructor) // should be Student!
Student.prototype.constructor = Student;
console.dir(Student.prototype.constructor);

console.log(mike instanceof Student); // true
console.log(mike instanceof Person); // true
console.log(mike instanceof Object); // true


class StudentCl extends PersonCl { // extends already links prototypes behind the scenes
  constructor(fullName, birthYear, course) {
    // Always needs to happen first!
    super(fullName, birthYear); // construction function of PersonCl
    this.course = course;
  }

  introduce() {
    console.log(`My name is ${this.firstName} and I study ${this.course}`);
  }
};

const martha = new StudentCl('Martha Jones', 2001, 'CS');
console.log(martha);
