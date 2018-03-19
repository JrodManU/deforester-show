function Invincibility(game, parameters) {
	AxeUpgrade.call(this, game, parameters);
	CooldownAddon.call(this, parameters);
	ButtonActivatedAddon.call(this, parameters);
}
		
Invincibility.prototype = Object.create(AxeUpgrade.prototype);
Object.assign(Invincibility.prototype, CooldownAddon.prototype,ButtonActivatedAddon.prototype);
Invincibility.prototype.constructor = Invincibility;
		
Invincibility.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	CooldownAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe);
	var upgradeContext = this;
	var oldChangeHealth = this.game.playerManager.playerController.changeHealth;
	this.game.playerManager.playerController.changeHealth = function(change){
		if(this.axe.invincible && change < 0){
			return;
		}
		oldChangeHealth.call(this, change);
	}
	this.game.playerManager.playerController.registerFunctionOverride("changeHealth", oldChangeHealth);
	playerAxe.endInvincibility = function(){
		this.cooldownManager.startCooldownWipe(upgradeContext.id);
		this.invincible = false;
	}
	playerAxe.startInvincibility = function(){
		if(this.cooldownManager.cooldownFinished(upgradeContext.id)){
			this.cooldownManager.startCooldown(upgradeContext.id);
			this.invincible = true;
			var that = this;
			setTimeout(function() {
				that.endInvincibility();
			}, 1500);
		}
	}
	ButtonActivatedAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe, playerAxe.startInvincibility);
}
