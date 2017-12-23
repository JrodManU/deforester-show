function PlayerAxe(game, stats) {
	this.game = game;
	
	this.state;
	this.stats = stats;
	
	this.cooldownManager;
	
	this.registeredSignalBindings = [];
	
	this.create();
	
	this.isFlaming = false;
}

PlayerAxe.prototype.create = function() {
	this.state = "rest";
	
	this.cooldownManager = new PlayerAxeCooldownManager(this.game);
	
	this.sprite = this.game.add.sprite(30, 15, "axe");
	this.sprite.anchor.setTo(.5, 1);
	
	this.treeIsNearbySprite = this.game.add.sprite(0,-160,"gemBlue");
	this.sprite.addChild(this.treeIsNearbySprite);
	
	this.axeHead = this.sprite.addChild(this.game.make.sprite(5, -100, "axeHead"));
	this.axeHead.height = 30;
	this.axeHead.width = 40;
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.rotation = 0;
	
	var attackKey = this.game.input.keyboard.addKey(this.game.playerManager.keybindManager.getKeybind("attack"));
	this.registerSignalBinding(attackKey.onDown.add(this.axeAttack, this));
	
	this.returnTween = this.game.add.tween(this.sprite).to( { rotation: 0}, this.stats["returnSpeed"], Phaser.Easing.Linear.None); 
	this.swingTween = this.game.add.tween(this.sprite).to( { rotation: 3.14 / 2 }, this.stats["swingSpeed"], Phaser.Easing.Linear.None);
	
	this.swingTween.onComplete.add(function() {
		this.state = "return";
		this.returnTween.start();
	}, this);
	this.returnTween.onComplete.add(function() {
		var that = this;
		this.changeDurability();
		setTimeout(function(){ that.state = "rest"; }, this.stats["attackDelay"]);
	}, this);
	
	this.chopKey = this.game.input.keyboard.addKey(this.game.playerManager.keybindManager.getKeybind("chop"));
} 

PlayerAxe.prototype.update = function() {
	if (this.state == "swing") {
		this.game.physics.arcade.overlap(this.axeHead, this.game.currentState.enemies, this.hitEnemy, null, this);
	} else if(this.state == "rest" || this.state == "chopping") {
		var closestTree = { "distance": 200, "tree": null };
		this.game.currentState.trees.forEach(function(treeSprite) {
			var distance = Math.abs(treeSprite.x - this.sprite.world.x);
			if(distance < closestTree["distance"] && Math.abs(treeSprite.y - this.sprite.world.y) <= 80) {
				closestTree["distance"] = distance;
				closestTree["tree"] = treeSprite;
			}
		}, this);
		if(closestTree["tree"]) {
			this.treeIsNearbySprite.revive();
		} else {
			this.treeIsNearbySprite.kill();
		}
		if(closestTree["tree"] && this.chopKey.isDown) {
			closestTree["tree"].object.changeHealth(-this.stats["treeCuttingSpeed"]);
			this.state = "chopping";
			this.game.playerManager.playerController.disablePlayerMovement();
		} else {
			this.state = "rest";
			this.game.playerManager.playerController.enablePlayerMovement();
		}	
	}
}

PlayerAxe.prototype.axeAttack = function() {
	if(this.state == "rest" && this.game.playerManager.playerController.hasEnoughStamina(this.stats["staminaCost"])) {
		this.game.playerManager.playerController.changeStamina(-this.stats["staminaCost"]);
		this.state = "swing";
		this.swingTween.pendingDelete = false;
		this.swingTween.start();
	}
} 

PlayerAxe.prototype.changeDurability = function(){
	this.stats["durability"] -= 1;
	if(this.stats["durability"] == 0) {
		this.game.playerManager.playerController.renewAxe();
	}
}

PlayerAxe.prototype.hitEnemy = function(axeHeadSprite, enemySprite) {
	this.swingTween.stop(true);
	enemySprite.object.changeHealth(-this.stats["attackDamage"]);
	this.emitBloodParticles();
}

PlayerAxe.prototype.emitBloodParticles = function() {
	this.game.currentState.bloodEmitter.x = this.axeHead.world.x + this.axeHead.width / 2;
	this.game.currentState.bloodEmitter.y = this.axeHead.world.y + this.axeHead.height;
	this.game.currentState.bloodEmitter.start(true, 2000, null, 10);
}

PlayerAxe.prototype.getDurability = function() {
	return this.stats["durability"];
}

PlayerAxe.prototype.getMaxDurability = function() {
	return this.stats["maxDurability"];
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