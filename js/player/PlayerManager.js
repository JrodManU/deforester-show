function PlayerManager(game) {
	this.game = game;
	this.playerController = null;
	this.axeManager = null;
	
	this.playerLevel = 1;
	this.playerExperience = 0;
	this.playerExperienceCap = 20;
	this.skillPoints = 100;
	
	this.money = 0;
	
	this.unlockedUpgrades = [];
	
	this.create();
}

PlayerManager.prototype.create = function() {
	this.axeManager = new AxeManager(this.game);
	this.planetSet = new PlanetSet(this.game);
	this.keybindManager = new KeybindManager(this.game);
}

PlayerManager.prototype.createPlayerController = function(startX, startY) {
	this.playerController = new PlayerController(this.game, startX, startY);
}

PlayerManager.prototype.changeExperience = function(experienceAmount) {
	this.playerExperience += experienceAmount;
	
	if (this.playerExperience >= this.playerExperienceCap) {
		this.playerExperience = 0;
		this.playerLevel += 1;
		this.skillPoints += 1;
	}
}

PlayerManager.prototype.hasMoneyToPay = function(moneyAmount) {
	return this.money >= moneyAmount;
}

PlayerManager.prototype.changeMoney = function(moneyAmount) {
	if(this.money + moneyAmount >= 0) {
		this.money += moneyAmount;
		return true;
	}
	return false;
}

PlayerManager.prototype.hasUnlockedUpgrade = function(upgradeId) {
	return this.unlockedUpgrades.indexOf(upgradeId) != -1;
}

PlayerManager.prototype.tryToUnlockUpgrade = function(upgrade) {
	if(upgrade.skillPointCost <= this.skillPoints) {
		this.unlockedUpgrades.push(upgrade.id);
		this.skillPoints -= upgrade.skillPointCost;
		return true;
	}
	return false;
}

PlayerManager.prototype.loadSaveData = function(saveData) {
	this.playerLevel = saveData.playerLevel;
	this.playerExperience = saveData.playerExperience;
	this.money = saveData.money;
	this.unlockedUpgrades = saveData.unlockedUpgrades;
	this.axeManager.loadSaveData(saveData.axeManagerData);
	this.planetSet.loadSaveData(saveData.planetSetData);
	this.keybindManager.loadSaveData(saveData.keybindManagerData);
}

PlayerManager.prototype.getSaveData = function() {
	return {
		"playerLevel": this.playerLevel,
		"playerExperience": this.playerExperience,
		"skillPoints": this.skillPoints,
		"money": this.money,
		"unlockedUpgrades": this.unlockedUpgrades,
		"axeManagerData": this.axeManager.getSaveData(),
		"planetSetData": this.planetSet.getSaveData(),
		"keybindManagerData": this.keybindManager.getSaveData()
	};
}