function AxePreset(game, name) {
	this.game = game;
	this.name = name;
	this.axeUpgrades = [];
	this.stats;
	this.create();
}

AxePreset.prototype.create = function() {
	this.updateUpgrades([]);
}

AxePreset.prototype.resetProperties = function() {
	this.price = 0;
	this.stats = {
		"swingSpeed": 100,
		"returnSpeed": 150,
		"durability": 15,
		"maxDurability": 15,
		"attackDelay": 200,
		"attackDamage": 6,
		"treeCuttingSpeed": .8,
		"staminaCost": 10
	}
}

//Make sure that you use updateProperties.call(axePreset) because it needs the context
AxePreset.prototype.updateUpgrades = function(axeUpgrades) {
	this.axeUpgrades = axeUpgrades;
	this.resetProperties();
	for(var i = 0; i < this.axeUpgrades.length; i++) {
		this.price += this.game.axeUpgradeManager.upgrades[this.axeUpgrades[i]].price;
		this.game.axeUpgradeManager.upgrades[this.axeUpgrades[i]].applyUpgrade(this);
	}
}

//same as above
AxePreset.prototype.createPlayerAxe = function() {
	var playerAxe = new PlayerAxe(this.game, Object.assign({}, this.stats));
	for(var i = 0; i < this.axeUpgrades.length; i++) {
		this.game.axeUpgradeManager.upgrades[this.axeUpgrades[i]].applyUpgradeAtRuntime(playerAxe);
	}
	return playerAxe;
}

AxePreset.prototype.unapplyUpgrades = function() {
	for(var i = 0; i < this.axeUpgrades.length; i++) {
		this.game.axeUpgradeManager.upgrades[this.axeUpgrades[i]].unapplyUpgrade();
	}
}

AxePreset.prototype.loadSaveData = function(saveData) {
	this.updateUpgrades(saveData.axeUpgrades);
	this.name = saveData.name;
}

AxePreset.prototype.getSaveData = function() {
	return {
		"axeUpgrades": this.axeUpgrades,
		"name": this.name
	};
}