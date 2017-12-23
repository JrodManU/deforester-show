function Block(game, parameters){
	AxeUpgrade.call(this, game, parameters);
	CooldownAddon.call(this, parameters);
	ButtonActivatedAddon.call(this, parameters);
}
Block.prototype = Object.create(AxeUpgrade.prototype);
Object.assign(Block.prototype, CooldownAddon.prototype,ButtonActivatedAddon.prototype, UpdateAddon.prototype);
Block.prototype.constructor = Block;
		
Block.prototype.applyUpgrade = function(axePreset) {
			
}
		
Block.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	CooldownAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe);
	UpdateAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe);
	
	var upgradeContext = this;
	this.playerAxe = playerAxe;
	
	playerAxe.shield = this.game.add.sprite(40, -30, "block");
	this.game.playerManager.playerController.sprite.addChild(playerAxe.shield);
	this.game.physics.arcade.enableBody(playerAxe.shield);
	playerAxe.shieldActive = false;
	playerAxe.shield.kill();
	playerAxe.endBlock = function(){
		this.cooldownManager.startCooldownWipe(upgradeContext.id);
		this.shieldActive = false;
		this.shield.kill();
	}
	playerAxe.startBlock = function(){
		if(this.cooldownManager.cooldownFinished(upgradeContext.id)){
			this.cooldownManager.startCooldown(upgradeContext.id);
			this.shieldActive = true;
			this.shield.revive();
			setTimeout(function(){
				playerAxe.endBlock();
			},250);
		}
	}
	playerAxe.destroyProjectile = function(shieldSprite, projSprite) {
		console.log("hi");
		projSprite.object.markedForDeletion = true;
	}
	ButtonActivatedAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe, playerAxe.startBlock);
}
Block.prototype.axeUpdateAddition = function(){
	if(this.playerAxe.shieldActive){
		this.game.physics.arcade.overlap(this.playerAxe.shield, this.game.currentState.projectiles, this.playerAxe.destroyProjectile);
	}
}