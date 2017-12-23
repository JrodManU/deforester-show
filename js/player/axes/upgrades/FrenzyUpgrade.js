function FrenzyUpgrade(game, parameters) {
	AxeUpgrade.call(this, game, parameters);
	CooldownAddon.call(this, parameters);
	ButtonActivatedAddon.call(this, parameters);
}

FrenzyUpgrade.prototype = Object.create(AxeUpgrade.prototype);
Object.assign(FrenzyUpgrade.prototype, CooldownAddon.prototype, ButtonActivatedAddon.prototype);
FrenzyUpgrade.prototype.constructor = FrenzyUpgrade;

FrenzyUpgrade.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	CooldownAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe);
	
	var upgradeContext = this;
	playerAxe.endFrenzy = function() {
		this.cooldownManager.startCooldownWipe(upgradeContext.id);
		this.axeHead.width = 40;
		this.axeHead.height = 30;
	}
	playerAxe.startFrenzy = function() {
		if(this.cooldownManager.cooldownFinished(upgradeContext.id)) {
			this.cooldownManager.startCooldown(upgradeContext.id);
			this.axeHead.width = 55;
			this.axeHead.height = 45;
			//this will be a different value in the function, if we store it in that it will work.
			var that = this;
			setTimeout(function() {
				that.endFrenzy();
			}, 3000);
		}
	}
	ButtonActivatedAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe, playerAxe.startFrenzy);
}