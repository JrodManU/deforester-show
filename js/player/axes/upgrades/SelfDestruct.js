function SelfDestruct(game, parameters) {
	AxeUpgrade.call(this, game, parameters);
	CooldownAddon.call(this, parameters);
	ButtonActivatedAddon.call(this, parameters);
	this.explosionRadius = parameters.explosionRadius;
}
		
SelfDestruct.prototype = Object.create(AxeUpgrade.prototype);
Object.assign(SelfDestruct.prototype, CooldownAddon.prototype);
SelfDestruct.prototype.constructor = SelfDestruct;
		
SelfDestruct.prototype.applyUpgrade = function(axePreset) {
	
}
		
SelfDestruct.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	CooldownAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe);
	var upgradeContext = this;
	playerAxe.startExplosion = function(){
		if(this.cooldownManager.cooldownFinished(upgradeContext.id)){
			this.cooldownManager.startCooldownWithWipe(upgradeContext.id);
			var halfHp = .5*(this.game.playerManager.playerController.getHealth());
			this.game.playerManager.playerController.changeHealth(-halfHp);
			this.game.currentState.enemies.forEach(function(enemySprite){
				var distance = Math.sqrt(Math.pow(this.game.playerManager.playerController.sprite.x - enemySprite.x,2) + Math.pow(this.game.playerManager.playerController.sprite.y - enemySprite.y,2));
				if (distance <= upgradeContext.explosionRadius){
					enemySprite.object.changeHealth(-halfHp);
				}
			},this);
			var explosionSprite = this.game.add.sprite(this.game.playerManager.playerController.sprite.x,this.game.playerManager.playerController.sprite.y,"sRadius");
			explosionSprite.alpha = .5;
			explosionSprite.width =5;
			explosionSprite.height =5;
			explosionSprite.anchor.setTo(.5);
			var explosionTween = this.game.add.tween(explosionSprite).to( { width: upgradeContext.explosionRadius,height: upgradeContext.explosionRadius}, 190, Phaser.Easing.Linear.None,true); 
			explosionTween.onComplete.add(function(sprite,tween){
				sprite.destroy();
			});
		}
	}
	ButtonActivatedAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe, playerAxe.startExplosion);
}