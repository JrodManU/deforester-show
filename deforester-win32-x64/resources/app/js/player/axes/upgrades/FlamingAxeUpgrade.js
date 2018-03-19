function FlamingAxeUpgrade(game, parameters) {
	AxeUpgrade.call(this, game, parameters);
	CooldownAddon.call(this, parameters);
	ButtonActivatedAddon.call(this, parameters);
	
	this.DOTDamagePerSecond = parameters.DOTDamagePerSecond;
	this.DOTLength = parameters.DOTLength;
}

FlamingAxeUpgrade.prototype = Object.create(AxeUpgrade.prototype);
Object.assign(FlamingAxeUpgrade.prototype, CooldownAddon.prototype, ButtonActivatedAddon.prototype, UpdateAddon.prototype);
FlamingAxeUpgrade.prototype.constructor = FlamingAxeUpgrade;

FlamingAxeUpgrade.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	CooldownAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe);
	UpdateAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe);
	
	this.playerAxe = playerAxe;
	
	playerAxe.fireEmitter = this.game.add.emitter(0,0,100);
	playerAxe.fireEmitter.makeParticles("fireParticle", 0, 20);
	playerAxe.fireEmitter.gravity = 0;
	playerAxe.fireEmitter.angularDrag = 100;
	playerAxe.fireEmitter.minParticleAlpha = .5;
	playerAxe.fireEmitter.minParticleScale = .5;
	playerAxe.fireEmitter.maxParticleScale = 2;
	playerAxe.fireEmitter.minParticleSpeed.setTo(-30, -20);
	playerAxe.fireEmitter.maxParticleSpeed.setTo(30, -60);
	playerAxe.fireEmitter.width = this.game.playerManager.playerController.sprite.body.width;
	playerAxe.fireEmitter.height = this.game.playerManager.playerController.sprite.body.height;
	playerAxe.fireEmitter.frequency = 200;
	
	var upgradeContext = this;
	
	playerAxe.endFlame = function() {
		this.cooldownManager.startCooldownWipe(upgradeContext.id);
		this.isFlaming = false;
	}

	playerAxe.startFlame = function() {
		if(this.cooldownManager.cooldownFinished(upgradeContext.id)) {
			this.fireEmitter.flow(2000, 150, 1, 3000 / 150);
			this.fireEmitter.x = this.game.playerManager.playerController.sprite.x;
			this.fireEmitter.y = this.game.playerManager.playerController.sprite.y;
			this.cooldownManager.startCooldown(upgradeContext.id);
			this.isFlaming = true;
			var that = this;
			setTimeout(function() {
				that.endFlame();
			}, 3000);
		}
	}
	
	var oldHitEnemy = playerAxe.hitEnemy;
	playerAxe.hitEnemy = function(axeHeadSprite, enemySprite) {
		oldHitEnemy.call(this, axeHeadSprite, enemySprite);
		if(this.isFlaming) {
			enemySprite.object.applyDOT(upgradeContext.id, upgradeContext.DOTDamagePerSecond, upgradeContext.DOTLength);
		}
	}
	
	ButtonActivatedAddon.prototype.applyUpgradeAtRuntime.call(this, playerAxe, playerAxe.startFlame);
}

FlamingAxeUpgrade.prototype.axeUpdateAddition = function() {
	if(this.playerAxe.isFlaming) {
		this.playerAxe.fireEmitter.x = this.playerAxe.axeHead.world.x + (this.playerAxe.axeHead.width / 2) * this.game.playerManager.playerController.sprite.scale.x;
		this.playerAxe.fireEmitter.y = this.playerAxe.axeHead.world.y + this.playerAxe.axeHead.height / 2;
	}
}