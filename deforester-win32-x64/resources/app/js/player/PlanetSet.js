function PlanetSet(game) {
	this.game = game;
	this.difficulty = 1;
	this.numberOfSetsCreated = 0;
	this.planets;
	this.selectedPlanet;
	this.create();
}

PlanetSet.prototype.create = function() {
	this.generateNewSet();
}

PlanetSet.prototype.generateNewSet = function() {
	this.numberOfSetsCreated++;
	this.difficulty = Math.log(this.numberOfSetsCreated / 50 + 1) * 19;
	this.planets = [];
	for(var i = 0; i < 3; i++) {
		this.planets[i] = this.game.planetManager.generatePlanet(this.difficulty);
	}
}

PlanetSet.prototype.selectPlanet = function(planetIndex) {
	this.selectedPlanet = this.planets[planetIndex];
	this.generateNewSet();
}

PlanetSet.prototype.loadSaveData = function(saveData) {
	this.numberOfSetsCreated = saveData.numberOfSetsCreated;
	this.difficulty = saveData.difficulty;
	for(var i = 0; i < this.planets.length; i++) {
		this.planets[i].loadSaveData(saveData.planets[i]);
	}
}

PlanetSet.prototype.getSaveData = function() {
	var dataList = [];
	for(var i = 0; i < this.planets.length; i++) {
		dataList.push(this.planets[i].getSaveData());
	}	
	return {
		"numberOfSetsCreated": this.numberOfSetsCreated,
		"difficulty": this.difficulty,
		"planets": dataList
	};
}