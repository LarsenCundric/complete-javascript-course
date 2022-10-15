const gameEvents = new Map([
  [17, '⚽ GOAL'],
  [36, '🔁 Substitution'],
  [47, '⚽ GOAL'],
  [61, '🔁 Substitution'],
  [64, '🔶 Yellow card'],
  [69, '🔴 Red card'],
  [70, '🔁 Substitution'],
  [72, '🔁 Substitution'],
  [76, '⚽ GOAL'],
  [80, '⚽ GOAL'],
  [92, '🔶 Yellow card'],
]);

console.log(gameEvents);

const uniqueEvents = new Set(gameEvents.values())
console.log([...uniqueEvents]);

gameEvents.delete(64)
console.log(gameEvents);

console.log(`An event happened on average every ${90/gameEvents.size}, minutes.`);

for (const [k, v] of gameEvents) {
  const half = k < 45 ? 'FIRST' : 'SECOND'
  console.log(`[${half} HALF] ${k}: ${v}`);
}