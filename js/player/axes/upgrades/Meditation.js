function Meditation(game, parameters) {
	AxeUpgrade.call(this, game, parameters);
	CooldownAddon.call(this, parameters);
	ButtonActivatedAddon.call(this, parameters);
}
		
Meditation.prototype = Object.create(AxeUpgrade.prototype);
Object.assign(Meditation.prototype, CooldownAddon.prototype);
Meditation.prototype.constructor = Meditation;
		
Meditation.prototype.applyUpgrade = function(axePreset) {
			
}
		
Meditation.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	CooldownAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe);
	var upgradeContext = this;
	
	playerAxe.endMeditate = function(){
		this.cooldownManager.startCooldownWipe(upgradeContext.id);
		this.game.playerManager.playerController.enablePlayerMovement();
		this.state = "rest";
	}
	playerAxe.startMeditate = function(){
		if(this.cooldownManager.cooldownFinished(upgradeContext.id)){
			this.cooldownManager.startCooldown(upgradeContext.id);
			this.game.playerManager.playerController.applyDOT(upgradeContext.id,-5,5000);
			this.game.playerManager.playerController.disablePlayerMovement();
			this.state = "meditating";
			var that = this;
			setTimeout(function() {
				that.endMeditate();
			}, 5000);
		}
	}	

	ButtonActivatedAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe, playerAxe.startMeditate);
}