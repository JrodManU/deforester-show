function PlayerAxe(game, stats) {
	this.game = game;
	
	this.state;
	this.stats = stats;
	//these ones arnt in stats because the won't be effected by upgrades
	this.treeSwingRangeX = 70;
	this.treeSwingRangeY = 20;
	
	this.cooldownManager;
	
	this.registeredSignalBindings = [];
	this.alreadyHit = [];
	
	this.create();
	
	this.isFlaming = false;
}

PlayerAxe.prototype.create = function() {
	this.state = "rest";
	
	this.cooldownManager = new PlayerAxeCooldownManager(this.game);
	
	this.axeHead = this.game.add.sprite(60,0);
	this.axeHead.anchor.setTo(.5);
	this.game.physics.arcade.enable(this.axeHead);
	this.axeHead.body.setSize(40,60, 0,-20);
	
	var attackKey = this.game.input.keyboard.addKey(this.game.playerManager.keybindManager.getKeybind("attack"));
	this.registerSignalBinding(attackKey.onDown.add(this.axeAttack, this));
	
	this.chopKey = this.game.input.keyboard.addKey(this.game.playerManager.keybindManager.getKeybind("chop"));
	
	this.game.playerManager.playerController.attackAnimation.onComplete.add(function() {
		this.state = "rest";
	}, this);
} 
 
PlayerAxe.prototype.update = function() {
	if (this.state == "swing") {
		this.game.physics.arcade.overlap(this.axeHead, this.game.currentState.enemies, this.hitEnemy, null, this);
	} else if(this.state == "rest" || this.state == "chopping") {
		var closestTree = { "distance": this.treeSwingRangeX, "tree": null };
		this.game.currentState.trees.forEach(function(treeSprite) {
			var distance = Math.abs(treeSprite.x - this.game.playerManager.playerController.sprite.x);
			//+ 60 because the player is short
			if(distance < closestTree["distance"] && Math.abs(treeSprite.y + 60 - this.game.playerManager.playerController.sprite.y) <= this.treeSwingRangeY && (treeSprite.x == this.game.playerManager.playerController.sprite.x || (treeSprite.x - this.game.playerManager.playerController.sprite.x) / Math.abs(treeSprite.x -this.game.playerManager.playerController.sprite.x) == this.game.playerManager.playerController.sprite.scale.x)) {
				closestTree["distance"] = distance;
				closestTree["tree"] = treeSprite;
			}
		}, this);
		if(closestTree["tree"]) {
			this.game.playerManager.playerController.treeIsNearbySprite.revive();
		} else {
			this.game.playerManager.playerController.treeIsNearbySprite.kill();
		}
		if(closestTree["tree"] && this.chopKey.isDown) {
			if(this.state != "chopping") {
				this.state = "chopping";
				this.game.playerManager.playerController.disablePlayerMovement();
				this.game.playerManager.playerController.sprite.animations.play("chop", this.game.playerManager.playerController.chopAnimation.speed, true);
				var that = this;
				this.game.playerManager.playerController.sprite.animations.currentAnim.onLoop.removeAll();
				this.game.playerManager.playerController.sprite.animations.currentAnim.onLoop.add(function() {
					that.game.audioManager.playSoundFx("treeHit");
					closestTree["tree"].object.changeHealth(-that.stats["treeCuttingSpeed"]);
				});
			}
		} else {
			this.state = "rest";
			this.game.playerManager.playerController.enablePlayerMovement();
			this.game.playerManager.playerController.sprite.animations.stop(null,true);
		}	
	}
}

PlayerAxe.prototype.axeAttack = function() {
	if(this.state == "rest" && this.game.playerManager.playerController.hasEnoughStamina(this.stats["staminaCost"])) {
		this.game.audioManager.playSoundFx("axeSwing");
		this.changeDurability();
		this.game.playerManager.playerController.changeStamina(-this.stats["staminaCost"]);
		this.state = "swing";
		this.game.playerManager.playerController.sprite.animations.play("attack");
		this.alreadyHit = [];
	}
} 

PlayerAxe.prototype.changeDurability = function(){
	this.stats["durability"] -= 1;
	if(this.stats["durability"] == 0) {
		this.game.playerManager.playerController.renewAxe();
	}
}

PlayerAxe.prototype.hitEnemy = function(axeHeadSprite, enemySprite) {
	if(!this.alreadyHit.includes(this.enemySprite)) {
		enemySprite.object.changeHealth(-this.stats["attackDamage"]);
		this.alreadyHit.push(this.enemySprite);
		this.emitBloodParticles();
		this.game.audioManager.playSoundFx("enemyHit");
	}
}

PlayerAxe.prototype.emitBloodParticles = function() {
	this.game.currentState.bloodEmitter.x = this.axeHead.world.x + this.axeHead.width / 2;
	this.game.currentState.bloodEmitter.y = this.axeHead.world.y + this.axeHead.height;
	this.game.currentState.bloodEmitter.start(true, 2000, null, 10);
}

PlayerAxe.prototype.getDurability = function() {
	return this.stats["durability"];
}

PlayerAxe.prototype.getRealY = function() {
	return this.sprite.y + this.game.playerManager.playerController.sprite.y;
}

PlayerAxe.prototype.getRealX = function() {
	return this.sprite.x * this.game.playerManager.playerController.sprite.scale.x + this.game.playerManager.playerController.sprite.x;
}

PlayerAxe.prototype.registerSignalBinding = function(signalBinding) {
	this.registeredSignalBindings.push(signalBinding);
}

PlayerAxe.prototype.removeRegisteredSignalBindings = function() {
	this.registeredSignalBindings.forEach(function(signalBinding) {
		signalBinding.detach();
	}, this);
}