function LifestealAxeUpgrade(game, parameters) {
	AxeUpgrade.call(this, game, parameters);
	CooldownAddon.call(this, parameters);
	ButtonActivatedAddon.call(this, parameters);
}

LifestealAxeUpgrade.prototype = Object.create(AxeUpgrade.prototype);
Object.assign(LifestealAxeUpgrade.prototype, CooldownAddon.prototype, ButtonActivatedAddon.prototype);
LifestealAxeUpgrade.prototype.constructor = LifestealAxeUpgrade;


LifestealAxeUpgrade.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	CooldownAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe);
	
	var upgradeContext = this;
	
	playerAxe.endLifesteal = function() {
		this.cooldownManager.startCooldownWipe(upgradeContext.id);
		this.lifestealActive = false;
	}
	
	playerAxe.startLifesteal = function() {
		if(this.cooldownManager.cooldownFinished(upgradeContext.id)) {
			this.cooldownManager.startCooldown(upgradeContext.id);
			this.lifestealActive = true;
			
			
			
			var that = this;
			setTimeout(function() {
				that.endLifesteal();
			}, 3000);
		}
	}
	
	var oldHitEnemy = playerAxe.hitEnemy;
	playerAxe.hitEnemy = function(axeHeadSprite, enemySprite) {
		oldHitEnemy.call(this, axeHeadSprite, enemySprite);
		if(this.lifestealActive) {
			this.game.playerManager.playerController.changeHealth(this.stats["attackDamage"] / 5);
		}
	}
	
	ButtonActivatedAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe, playerAxe.startLifesteal);
}