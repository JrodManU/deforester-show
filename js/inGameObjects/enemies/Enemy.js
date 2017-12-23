function Enemy(game, startX, startY, cellMap){
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
	this.yRange = 100; 
	this.maxWidth = 70;
	
	this.speed;
	this.jumpSpeed = -550;
	
	this.moving = true;
	
	this.create();
}

Enemy.prototype = Object.create(Damageable.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.generateBehavior = function(){
	this.speed = getRandom(50,200);
	this.generateBounds(this.startX);
	this.choose = getRandomInt(0,1);
	if(this.choose = 0){
		this.direction = 1;
	}
	else{
		this.direction = -1;
	}
}
Enemy.prototype.generateBounds = function(x){
	this.rightBound = getRandom(x + 100, x  + 1000);
	this.leftBound = getRandom(x - 100,x  - 1000);
}

Enemy.prototype.create = function(){
	this.setMaxHealth(20);
	this.setHealthToMax();
	this.generateBehavior();
	this.sprite = this.game.add.sprite(this.startX, this.startY, "enemy");
	this.sprite.object = this;
	this.sprite.anchor.setTo(.5);
	
	this.playerSprite = this.game.playerManager.playerController.sprite;
	
	this.sensors = this.game.add.group();
    this.sensors.enableBody = true;
	this.rightHand = this.sensors.add(this.game.make.sprite(this.sprite.width / 2 + 5,0));
	this.leftHand = this.sensors.add(this.game.make.sprite(-this.sprite.width / 2 - 5,0));
	this.rightFoot = this.sensors.add(this.game.make.sprite(this.sprite.width/2 +5, this.sprite.height + 5));
	this.leftFoot = this.sensors.add(this.game.make.sprite(-this.sprite.width/2 - 5, this.sprite.height + 5));
	
	this.healthBar = this.sprite.addChild(this.game.make.sprite(-36, -43, "healthBar"));
	
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
	
	 
}

Enemy.prototype.update = function(){
	this.game.physics.arcade.collide(this.sprite, this.game.currentState.platforms);
	this.healthBar.width = (this.getHealth()/this.getMaxHealth())*this.maxWidth;
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
	if(this.sprite.scale.x != this.direction) {
		this.sprite.scale.x = this.direction;
		var temp = this.rightFoot;
		this.rightFoot = this.leftFoot;
		this.leftFoot = temp;
		temp = this.rightHand;
		this.rightHand = this.leftHand;
		this.leftHand = temp;
	}
}
Enemy.prototype.hasDied = function(){
	var staminaOrb = new StaminaOrb(this.game, this.sprite.body.x, this.sprite.body.y, 20);
	this.game.currentState.orbs.add(staminaOrb.sprite);
	this.game.playerManager.changeExperience(5);
	this.sprite.destroy();
}


Enemy.prototype.checkForPlayer = function() {
	console.log("Any object derived from enemy should implement and override this function")
}