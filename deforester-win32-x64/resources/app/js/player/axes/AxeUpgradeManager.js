function AxeUpgradeManager(game) {
	this.game = game;
	this.upgrades = [];
	this.upgradesEnum = {
		STAT: "Stat",
		THROWING_AXE: "ThrowingAxe",
		FLAMING_AXE: "FlamingAxe",
		INVINCIBILITY: "Invincibility",
		LIFESTEAL_AXE: "LifestealAxe",
		MEDITATION: "Meditation",
		SELF_DESTRUCT: "SelfDestruct",
		BLOCK: "Block"
	};
	
	this.loadUpgrades();
}

AxeUpgradeManager.prototype.loadUpgrades = function() {
	var upgradesJSON = this.game.cache.getJSON("axeUpgrades");
	upgradesJSON.forEach(function(upgrade) {
		switch(upgrade.type) {
			case this.upgradesEnum.STAT:
				this.upgrades[upgrade.parameters.id] = new StatUpgrade(this.game, upgrade.parameters);
				break;
			case this.upgradesEnum.THROWING_AXE:
				this.upgrades[upgrade.parameters.id] = new ThrowingAxeUpgrade(this.game, upgrade.parameters);
				break;
			case this.upgradesEnum.FLAMING_AXE:
				this.upgrades[upgrade.parameters.id] = new FlamingAxeUpgrade(this.game, upgrade.parameters);
				break;
			case this.upgradesEnum.INVINCIBILITY:
				this.upgrades[upgrade.parameters.id] = new Invincibility(this.game,upgrade.parameters);
				break;
			case this.upgradesEnum.LIFESTEAL_AXE:
				this.upgrades[upgrade.parameters.id] = new LifestealAxeUpgrade(this.game,upgrade.parameters);
				break;
			case this.upgradesEnum.MEDITATION:
				this.upgrades[upgrade.parameters.id] = new Meditation(this.game,upgrade.parameters);
				break;
			case this.upgradesEnum.SELF_DESTRUCT:
				this.upgrades[upgrade.parameters.id] = new SelfDestruct(this.game,upgrade.parameters);
				break;
			case this.upgradesEnum.BLOCK:
				this.upgrades[upgrade.parameters.id] = new Block(this.game, upgrade.parameters);
				break;
	
			default:
				console.log(upgrade.type + " upgrade type not found in enum");
				break;
		}
	}, this);
}