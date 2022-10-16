const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

const howIsDogEating = (dog) => {
  const { recommendedFood: r, curFood: c} = dog;
  if (c > r * 1.1) return 1;
  if (c < r * 0.9) return -1;
  return 0;
};

dogs.forEach((dog) => dog.recommendedFood = Math.trunc((dog.weight ** 0.75) * 28));
console.log('All dogs', dogs);

const sarahsDog = dogs.find((dog) => dog.owners.includes('Sarah'));
console.log(sarahsDog);
const sEating = howIsDogEating(sarahsDog);
sEating || console.log('Sarahs dog eating enough.')
sEating > 0 && console.log('Sarahs dog eating much.')
sEating < 0 && console.log('Sarahs dog eating too little.')

const ownersEatTooMuch = dogs.filter((dog) => howIsDogEating(dog) > 0)
const ownersEatTooLittle = dogs.filter((dog) => howIsDogEating(dog) < 0)

console.log(`${ownersEatTooLittle.flatMap((dog) => dog.owners).join(' and ')}'s dogs eat too little.` );
console.log(`${ownersEatTooMuch.flatMap((dog) => dog.owners).join(' and ')}'s dogs eat too much.` );

console.log('Any dog exact', dogs.some((dog) => dog.curFood === dog.recommendedFood));
console.log('Any dog recommended', dogs.some((dog) => !howIsDogEating(dog)));

console.log('Dogs that eat recommended', dogs.filter((dog) => !howIsDogEating(dog)));

const dogShallowCopy = dogs.slice();
dogShallowCopy.sort((dogA, dogB) => dogA.recommendedFood - dogB.recommendedFood)
console.log('Sorted by recommended food', dogShallowCopy);