function RangedEnemy(game, startX, startY, cellMap){
	Damageable.call(this, game);
	this.game = game;
	this.startX = startX;
	this.startY = startY;
	this.cellMap = cellMap;
	this.direction;
	this.choose;
	this.rightBound;
	this.leftBound; 
	this.xRange = 300;
	this.yRange = 200; 
	this.maxWidth = 70;
	
	this.speed;
	this.jumpSpeed = -550;
	
	this.moving = true;
	
	this.rangeRadius = 700;
	
	this.create();
}

RangedEnemy.prototype = Object.create(Damageable.prototype);
RangedEnemy.prototype.constructor = RangedEnemy;

RangedEnemy.prototype.generateBehavior = function(){
	this.speed = getRandom(40,100);
	this.generateBounds(this.startX);
	this.choose = getRandomInt(0,1);
	if(this.choose = 0){
		this.direction = 1;
	}
	else{
		this.direction = -1;
	}
}
RangedEnemy.prototype.generateBounds = function(x){
	this.rightBound = getRandom(x + 100, x  + 1000);
	this.leftBound = getRandom(x - 100,x  - 1000);
}

RangedEnemy.prototype.create = function(){
	this.setMaxHealth(20);
	this.setHealthToMax();
	this.generateBehavior();
	this.sprite = this.game.add.sprite(this.startX + 32, this.startY + 32, "porcupineEnemy");
	this.sprite.object = this;
	this.sprite.anchor.setTo(.5);
	
	this.walkAnimation = this.sprite.animations.add("walk", [12,13,14,15]);
	this.walkAnimation.speed = 4;
	this.walkAnimation.loop = true;
	
	this.attackAnimation = this.sprite.animations.add("attack", [0,1,2,3,4,5,6,7,8,9]);
	this.attackAnimation.speed = 30;
	this.attackAnimation.onComplete.add(function() {
		this.sprite.animations.play("walk");
	}, this);
	this.sprite.animations.play("walk");
	
	this.playerSprite = this.game.playerManager.playerController.sprite;
	
	this.sensors = this.game.add.group();
    this.sensors.enableBody = true;
	this.rightHand = this.sensors.add(this.game.make.sprite(41 / 2 + 5,0));
	this.leftHand = this.sensors.add(this.game.make.sprite(-41 / 2 - 5,0));
	this.rightFoot = this.sensors.add(this.game.make.sprite(41/2 +5, this.sprite.height + 5));
	this.leftFoot = this.sensors.add(this.game.make.sprite(-41/2 - 5, this.sprite.height + 5));
	
	this.healthBar = this.sprite.addChild(this.game.make.sprite(-36, -43, "healthBar"));
	this.healthBar.kill();
	
	// I think it is the bodies rotation
	this.sensors.getAll().forEach(function(sensor) {
		this.sprite.addChild(sensor);
		sensor.anchor.setTo(.5);
		sensor.width = 10;
		sensor.height = 10;
	}, this);
    
    
    this.healthBar.height = 10;
    this.healthBar.anchor.setTo(0);
	
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.body.gravity.y = 2000;
	this.sprite.body.velocity.x = this.speed;
	this.sprite.body.setSize(41,30, 10, 28);
	
	this.gun = new EnemyGun(this.game, this);
	this.sprite.addChild(this.gun.sprite);
}

RangedEnemy.prototype.update = function(){
	this.game.physics.arcade.collide(this.sprite, this.game.currentState.platforms);
	this.healthBar.width = (this.getHealth()/this.getMaxHealth())*this.maxWidth;
	if(this.hasTakenDamage()) {
		this.healthBar.revive();
	}
	//Check if at right bound of patrol
	if(this.sprite.body.x > this.rightBound) {
		this.direction = -1;
	}
	//Check if at left bound of patrol
	if(this.sprite.body.x < this.leftBound) {
		this.direction = 1;
	}
	//If at edge of world
	if(this.leftHand.body.x <= 0) {
		this.direction = 1;
	}
	//Other edge of world
	if(this.rightHand.body.x >= this.game.world.width) {
		this.direction = -1;
	}
	//Detect if jumping left is a good idea
	if(this.game.physics.arcade.overlap(this.leftHand, this.game.currentState.platforms) && this.sprite.body.touching.down) { 
		var checkX = Math.floor(this.sprite.x / this.game.tileSize) - 1;
		var checkY = Math.floor(this.sprite.y / this.game.tileSize) - 1;
	 	if(checkX >= 0 && checkY < this.cellMap[0].length && this.cellMap[checkX][checkY] != "platform") {
			this.sprite.body.velocity.y = this.jumpSpeed;
		} else {
			this.direction = 1;
		}
	}
	//Detect if jumping right is a good idea
	if(this.game.physics.arcade.overlap(this.rightHand, this.game.currentState.platforms) && this.sprite.body.touching.down) {
		var checkX = Math.floor(this.sprite.x / this.game.tileSize) + 1;
		var checkY = Math.floor(this.sprite.y / this.game.tileSize) - 1;
		if(checkX < this.cellMap.length && checkY < this.cellMap[0].length && this.cellMap[checkX][checkY] != "platform") {
			this.sprite.body.velocity.y = this.jumpSpeed;
		} else {
			this.direction = -1;
		}
	}
	var rightFootOverlap = this.game.physics.arcade.overlap(this.rightFoot, this.game.currentState.platforms);
	var leftFootOverlap = this.game.physics.arcade.overlap(this.leftFoot, this.game.currentState.platforms);
	//At right edge of a platform
	if(!rightFootOverlap && leftFootOverlap){
		//This will check if it is safe to jump down
		var checkX = Math.floor(this.sprite.x / this.game.tileSize) + 1;
		var checkY = Math.floor(this.sprite.y / this.game.tileSize) + 2;
		if(!(checkX < this.cellMap.length && checkY < this.cellMap[0].length && this.cellMap[checkX][checkY] == "platform")) {
			this.direction = -1;
		}
	}
	//At the left edge of a platform
	if(!leftFootOverlap && rightFootOverlap){
		//this will check if its safe to jump down
		var checkX = Math.floor(this.sprite.x / this.game.tileSize) - 1;
		var checkY = Math.floor(this.sprite.y / this.game.tileSize) + 2;
		if(!(checkX >= 0 && checkY < this.cellMap[0].length && this.cellMap[checkX][checkY] == "platform")) {
			this.direction = 1;
		}
	}
	this.checkForPlayer();
	if(this.moving){
		this.sprite.body.velocity.x = this.direction * this.speed;
	} else {
		this.sprite.body.velocity.x = 0;
	}
	if(this.sprite.scale.x == this.direction) {
		this.sprite.scale.x = -this.direction;
		var temp = this.rightFoot;
		this.rightFoot = this.leftFoot;
		this.leftFoot = temp;
		temp = this.rightHand;
		this.rightHand = this.leftHand;
		this.leftHand = temp;
	}
}
RangedEnemy.prototype.hasDied = function(){
	var staminaOrb = new StaminaOrb(this.game, this.sprite.body.x, this.sprite.body.y, 20);
	this.game.currentState.orbs.add(staminaOrb.sprite);
	this.game.playerManager.changeExperience(5);
	this.game.playerManager.questManager.broadcastUpdate("kills", 1);
	this.game.playerManager.planetSet.selectedPlanet.enemyDied();
	this.sprite.destroy();
}

RangedEnemy.prototype.checkForPlayer = function(){
	if(Math.abs(this.sprite.body.x - this.playerSprite.body.x) <= this.rangeRadius && Math.abs(this.sprite.body.y - this.playerSprite.body.y) <= this.rangeRadius && this.gun.hasClearShot(this.cellMap)) {
		this.gun.shoot();
		this.moving = false;
		if(this.sprite.body.x - this.playerSprite.body.x > 0) {
			this.direction = -1;
			
		} else {
			this.direction = 1;
		}
	} else {
		if(!this.moving) {
			this.generateBounds(this.sprite.body.x);
			this.moving = true;
		}
	}
}