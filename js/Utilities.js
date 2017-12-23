// inclusive, exclusive
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
//both inclusive
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}