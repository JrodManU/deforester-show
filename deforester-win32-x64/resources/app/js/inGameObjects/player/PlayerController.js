function PlayerController(game, startX, startY) {
	Damageable.call(this, game);
	this.game = game;
	this.startX = startX;
	this.startY = startY;
	this.movementEnabled = true;
	
	Object.assign(this.stats, {
		"speed": 400,
		"jumpPower": -1000,
		"maxStamina": 100,
		"stamina": 100,
		//per second
		"staminaRegen": 3
	});
	
	this.currentPresetIndex = 0;
	this.create();
}

PlayerController.prototype = Object.create(Damageable.prototype);
PlayerController.prototype.constructor = PlayerController;

PlayerController.prototype.create = function() {
	//we need this assigned before we create the axe
	this.game.playerManager.playerController = this;
	this.functionOverrides = [];
	
	this.startStaminaRegen();
	
	this.sprite = this.game.add.sprite(this.startX, this.startY, "player");
	
	//animations
	this.chopAnimation = this.sprite.animations.add("chop", [0,1,2,3,4,5,6,7,8,9,0], true);
	this.chopAnimation.speed = 30;
	this.attackAnimation = this.sprite.animations.add("attack", [10,11,12,13,14,15,16,17,18,0]);
	this.attackAnimation.speed = 40;
	
	this.sprite.object = this;
	this.sprite.anchor.setTo(.3,.5);
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.body.gravity.y = 2000;
	this.sprite.body.collideWorldBounds = true;
	this.sprite.body.setSize(45, 60, 35, 20);
	this.sprite.object = this;
	this.axe = this.game.playerManager.axeManager.newAxe(this.currentPresetIndex);
	this.sprite.addChild(this.axe.axeHead);
	
	this.tracksSprite = this.game.add.sprite(0, 0, "playerWalk");
	this.tracksSprite.anchor.setTo(.3,.5);
	this.sprite.addChild(this.tracksSprite);
	this.tracksWalkAnimation = this.tracksSprite.animations.add("walk", [0,1,2,3]);
	this.tracksWalkAnimation.speed = 10;
	this.tracksWalkAnimation.loop = true;
	
	this.treeIsNearbySprite = this.sprite.addChild(this.game.make.sprite(10, -60, "throwingAxe"));
	this.treeIsNearbySprite.scale.setTo(.5);
	
	this.movementKeys = this.game.input.keyboard.addKeys( { 
		"jump": this.game.playerManager.keybindManager.getKeybind("jump"),
		"left": this.game.playerManager.keybindManager.getKeybind("moveLeft"),
		"right": this.game.playerManager.keybindManager.getKeybind("moveRight")
	});
	
	var recallKey = this.game.input.keyboard.addKey(this.game.playerManager.keybindManager.getKeybind("recall"));
    recallKey.onDown.add(this.startRecall, this);
    
    for(var i = 0; i < this.game.playerManager.axeManager.numberOfPresets; i++) {
		var presetKey = this.game.input.keyboard.addKey(i + 49);
    	presetKey.onDown.add(this.switchAxeKeyCallback, this);
	}
	
	this.game.camera.follow(this.sprite); 
}

PlayerController.prototype.update = function() {
	this.game.physics.arcade.collide(this.sprite, this.game.currentState.platforms);
	if(this.axe) {
		this.axe.update();
	}
	
	this.game.physics.arcade.overlap(this.sprite, this.game.currentState.orbs, this.pickedUpOrb, null, this);
	
	this.sprite.body.velocity.x = 0;
	if(this.movementEnabled) {
		if(this.movementKeys['right'].isDown && !this.sprite.body.touching.right) {
			this.sprite.body.velocity.x = this.stats["speed"];
			this.sprite.scale.x = 1;
		}
		if(this.movementKeys['left'].isDown && !this.sprite.body.touching.left) {
			this.sprite.body.velocity.x = -this.stats["speed"];
			this.sprite.scale.x = -1;
		}
		if(this.movementKeys['jump'].isDown && this.sprite.body.touching.down) {
			this.sprite.body.velocity.y = this.stats["jumpPower"];
		}
		if(this.sprite.body.velocity.x != 0 && !this.tracksWalkAnimation.isPlaying) {
			this.tracksSprite.animations.play("walk");
		} else if(this.sprite.body.velocity.x == 0 && this.tracksWalkAnimation.isPlaying) {
			this.tracksSprite.animations.stop();
		}
	}
}

PlayerController.prototype.hasDied = function() {
	this.game.audioManager.playSoundFx("death");
	this.game.state.start("GameOver");
}

PlayerController.prototype.startRecall = function() {
	this.game.state.start("Ship");
}

PlayerController.prototype.renewAxe = function() {
	if(this.game.playerManager.hasMoneyToPay(this.game.playerManager.axeManager.presets[this.currentPresetIndex].price)) {
		this.game.notifier.notify("Renewed preset " + this.currentPresetIndex);
		this.switchAxe(this.currentPresetIndex);
	} else {
		this.game.notifier.notify("You have no money to renew your axe");
		this.deleteCurrentAxe();
	}
}

PlayerController.prototype.switchAxeKeyCallback = function(key) {
	var presetIndex = key.keyCode - 49;
	this.switchAxe(presetIndex);
	this.game.notifier.notify("Switched to preset " + (presetIndex + 1));
}

PlayerController.prototype.switchAxe = function(presetIndex) {
	if(this.game.playerManager.changeMoney(-this.game.playerManager.axeManager.presets[presetIndex].price)) {
		this.deleteCurrentAxe();
		this.currentPresetIndex = presetIndex;
		this.axe = this.game.playerManager.axeManager.newAxe(this.currentPresetIndex);
		this.sprite.addChild(this.axe.axeHead);
	}
}

PlayerController.prototype.deleteCurrentAxe = function() {
	this.removeFunctionOverrides();
	this.axe.cooldownManager.deleteCooldownSprites();
	this.axe.removeRegisteredSignalBindings();
	this.axe.axeHead.destroy(true);
	this.game.playerManager.axeManager.presets[this.currentPresetIndex].unapplyUpgrades();
	delete this.axe;
}

PlayerController.prototype.startStaminaRegen = function() {
	var that = this;
	setInterval(function() {
		that.changeStamina((that.stats["staminaRegen"] / 5));
	}, 200)
}

PlayerController.prototype.changeStamina = function(change) {
		if(this.stats["stamina"] + change > this.stats["maxStamina"]) {
			this.stats["stamina"] = this.stats["maxStamina"];
		} else if(this.stats["stamina"] + change < 0) {
			this.stats["stamina"] = 0;
		} else {
			this.stats["stamina"] += change;
		}
}

PlayerController.prototype.hasEnoughStamina = function(amount) {
	return this.stats["stamina"] >= amount;
}
PlayerController.prototype.pickedUpOrb = function(playerControllerSprite, orbSprite){
	orbSprite.object.applyEffect(this);
	orbSprite.destroy();
}

PlayerController.prototype.enablePlayerMovement = function() {
	this.movementEnabled = true;
}

PlayerController.prototype.disablePlayerMovement = function() {
	this.movementEnabled = false;
}

PlayerController.prototype.getStamina = function() {
	return this.stats["stamina"];
}

PlayerController.prototype.getMaxStamina = function() {
	return this.stats["maxStamina"];
}

//this is being extended from Damageable
//We need to overide it because we want to play a sound when the player takes damage
PlayerController.prototype.changeHealth = function(change, actor) {
	if(change < -0.1) { 
		this.game.audioManager.playSoundFx("playerHit");
	}
	Damageable.prototype.changeHealth.call(this,change,actor);
}

PlayerController.prototype.registerFunctionOverride = function(functionName, oldFunction) {
	this.functionOverrides.push({"functionName": functionName, "oldFunction": oldFunction});
}

PlayerController.prototype.removeFunctionOverrides = function() {
	this.functionOverrides.forEach(function(functionOverride) {
		this[functionOverride.functionName] = functionOverride.oldFunction;
	}, this);
	this.functionOverrides = [];
}