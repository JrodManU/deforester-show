function ThrowingAxeUpgrade(game, parameters) {
	AxeUpgrade.call(this, game, parameters);
	CooldownAddon.call(this, parameters);
	ButtonActivatedAddon.call(this, parameters);
	
}

ThrowingAxeUpgrade.prototype = Object.create(AxeUpgrade.prototype);
Object.assign(ThrowingAxeUpgrade.prototype, CooldownAddon.prototype, ButtonActivatedAddon.prototype);
ThrowingAxeUpgrade.prototype.constructor = ThrowingAxeUpgrade;


ThrowingAxeUpgrade.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	CooldownAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe);
	var upgradeContext = this;
	
	playerAxe.throwAxe = function() {
		if(this.cooldownManager.cooldownFinished(upgradeContext.id)) {
			this.cooldownManager.startCooldownWithWipe(upgradeContext.id); 
			var direction = this.game.playerManager.playerController.sprite.scale.x;
			var throwingAxe = new Projectile(this.game, "throwingAxe", this.game.currentState.enemies, 5, 2000, this.game.playerManager.playerController.sprite.x, this.game.playerManager.playerController.sprite.y, 1000 * direction, -700, 2500);
			var oldUpdate = throwingAxe.update;
			throwingAxe.update = function() {
				oldUpdate.call(this);
				this.sprite.angle += 20 * direction;
			}
		}
	}
	
	ButtonActivatedAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe, playerAxe.throwAxe);
}