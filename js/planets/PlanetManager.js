function PlanetManager(game) {
	this.game = game;
	this.create();
}

PlanetManager.prototype.create = function() {

}

PlanetManager.prototype.generatePlanet = function(difficulty) {
	var planetDifficultyMin = 2 * difficulty;
	var planetDifficultyMax = 3 * difficulty;
	var planetDifficulty = getRandom(planetDifficultyMin, planetDifficultyMax);
	
	var planetWidthMin = 20 * (planetDifficulty / 18 + 1);
	var planetWidthMax = 25 * (planetDifficulty / 18 + 1);
	var planetWidth = getRandomInt(planetWidthMin, planetWidthMax);
	
	var planetHeightMin = 20 * (planetDifficulty / 18 + 1);
	var planetHeightMax = 22 * (planetDifficulty / 18 + 1);
	var planetHeight = getRandomInt(planetHeightMin, planetHeightMax);
	
	var numberOfEnemiesMin = 1 * (planetDifficulty / 4 + 1);
	var numberOfEnemiesMax = 2 * (planetDifficulty / 4 + 1);
	var numberOfEnemies = getRandomInt(numberOfEnemiesMin, numberOfEnemiesMax);
	
	var platformOccuranceRateMin = .1;
	var platformOccuranceRateMax = .2;// old was .12
	var platformOccuranceRate = getRandom(platformOccuranceRateMin, platformOccuranceRateMax);
	
	var numberOfTreesMin = 1 * (planetDifficulty / 3 + 1);
	var numberOfTreesMax = 2 * (planetDifficulty / 3 + 1);
	var numberOfTrees = getRandomInt(numberOfTreesMin, numberOfTreesMax);
	
	var passiveDamageBaseMin = .04 * (planetDifficulty / 3 + 1);
	var passiveDamageBaseMax = .07 * (planetDifficulty / 3 + 1);
	var passiveDamageBase = getRandom(passiveDamageBaseMin, passiveDamageBaseMax);
	
	var passiveDamageMaxMin = .1 * (planetDifficulty / 3 + 1);
	var passiveDamageMaxMax = .2 * (planetDifficulty / 3 + 1);
	var passiveDamageMax = getRandom(passiveDamageMaxMin, passiveDamageMaxMax);
	
	var platformSizeMinMin = 1;
	var platformSizeMinMax = 3;
	var platformSizeMin = getRandomInt(platformSizeMinMin, platformSizeMinMax);
	
	var platformSizeMaxMin = 5;
	var platformSizeMaxMax = 9;
	var platformSizeMax = getRandomInt(platformSizeMaxMin, platformSizeMaxMax);
	
	var treeSizeMinMin = 1;
	var treeSizeMinMax = 3;
	var treeSizeMin = getRandomInt(treeSizeMinMin, treeSizeMinMax);
	
	var treeSizeMaxMin = 4;
	var treeSizeMaxMax = 8;
	var treeSizeMax = getRandomInt(treeSizeMaxMin, treeSizeMaxMax);

	return new Planet(this.game, planetDifficulty, planetWidth, planetHeight, numberOfEnemies,
		platformOccuranceRate, numberOfTrees, passiveDamageBase, passiveDamageMax,
		platformSizeMin, platformSizeMax, treeSizeMin, treeSizeMax);
} 