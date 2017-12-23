function AxeUpgrade(game, parameters) {
	this.game = game;
	this.id = parameters.id;
	this.name = parameters.name;
	this.skillPointCost = parameters.skillPointCost;
	this.price = parameters.price;
	this.info = parameters.info;
}

AxeUpgrade.prototype.applyUpgrade = function(axePreset) {
	
}

AxeUpgrade.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	
}