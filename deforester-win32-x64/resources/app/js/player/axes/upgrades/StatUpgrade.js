function StatUpgrade(game, parameters) {
	AxeUpgrade.call(this, game, parameters);
	this.playerStatChanges = parameters.playerStatChanges;
	this.axeStatChanges = parameters.axeStatChanges;
}

StatUpgrade.prototype = Object.create(AxeUpgrade.prototype);
StatUpgrade.prototype.constructor = StatUpgrade;

StatUpgrade.prototype.applyUpgrade = function(axePreset) {
	if(this.axeStatChanges) {
		this.axeStatChanges.forEach(function(statChange) {
			axePreset.stats[statChange.name] += statChange.amount;
		}, this);
	}
}

StatUpgrade.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	if(this.playerStatChanges) {
		this.playerStatChanges.forEach(function(statChange) {
			this.game.playerManager.playerController.stats[statChange.name] += statChange.amount;
		}, this);
	}
}

StatUpgrade.prototype.unapplyUpgrade = function() {
	if(this.playerStatChanges) {
		this.playerStatChanges.forEach(function(statChange) {
			this.game.playerManager.playerController.stats[statChange.name] -= statChange.amount;
		}, this);
	}
}