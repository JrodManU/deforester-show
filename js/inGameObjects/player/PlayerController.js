function PlayerController(game, startX, startY) {
	Damageable.call(this, game);
	this.game = game;
	this.startX = startX;
	this.startY = startY;
	this.movementEnabled = true;
	
	Object.assign(this.stats, {
		"speed": 500,
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
	
	this.setMaxHealth(20);
	this.setHealthToMax();
	
	this.startStaminaRegen();
	
	this.sprite = this.game.add.sprite(this.startX, this.startY, "player");
	this.sprite.object = this;
	this.sprite.anchor.setTo(.5);
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.body.gravity.y = 2000;
	this.sprite.body.collideWorldBounds = true;
	this.sprite.object = this;
	this.axe = this.game.playerManager.axeManager.newAxe(this.currentPresetIndex);
	this.sprite.addChild(this.axe.sprite);
	
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
	}
}

PlayerController.prototype.hasDied = function() {
	this.game.state.start("GameOver");
}

PlayerController.prototype.startRecall = function() {
	this.game.state.start("Ship");
}

PlayerController.prototype.renewAxe = function() {
	if(this.game.playerManager.hasMoneyToPay(this.game.playerManager.axeManager.presets[this.currentPresetIndex].price)) {
		this.switchAxe(this.currentPresetIndex);
	} else {
		this.deleteCurrentAxe();
	}
}

PlayerController.prototype.switchAxeKeyCallback = function(key) {
	this.switchAxe(key.keyCode - 49);
}

PlayerController.prototype.switchAxe = function(presetIndex) {
	if(this.game.playerManager.changeMoney(-this.game.playerManager.axeManager.presets[presetIndex].price)) {
		this.currentPresetIndex = presetIndex;
		this.deleteCurrentAxe();
		this.axe = this.game.playerManager.axeManager.newAxe(this.currentPresetIndex);
		this.sprite.addChild(this.axe.sprite);
	}
}

PlayerController.prototype.deleteCurrentAxe = function() {
	this.removeFunctionOverrides();
	this.axe.removeRegisteredSignalBindings();
	this.axe.sprite.destroy(true);
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

PlayerController.prototype.registerFunctionOverride = function(functionName, oldFunction) {
	this.functionOverrides.push({"functionName": functionName, "oldFunction": oldFunction});
}

PlayerController.prototype.removeFunctionOverrides = function() {
	this.functionOverrides.forEach(function(functionOverride) {
		this[functionOverride.functionName] = functionOverride.oldFunction;
	}, this);
	this.functionOverrides = [];
}