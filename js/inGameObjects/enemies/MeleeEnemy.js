function MeleeEnemy(game, startX, startY, cellMap) {
	Enemy.call(this, game, startX, startY, cellMap);
}

MeleeEnemy.prototype = Object.create(Enemy.prototype);
MeleeEnemy.prototype.constructor = MeleeEnemy;

MeleeEnemy.prototype.create = function() {
	Enemy.prototype.create.call(this);
	this.weapon = new Weapon(this.game);
	this.sprite.addChild(this.weapon.sprite);
}

MeleeEnemy.prototype.checkForPlayer = function() {
	if(Math.abs(this.sprite.body.x - this.playerSprite.body.x) <= this.xRange && Math.abs(this.sprite.body.y - this.playerSprite.body.y) <= this.yRange) {
		if(this.sprite.body.x - this.playerSprite.body.x > 0) {
			this.direction = -1;
			
		} else {
			this.direction = 1;
		}
	}
	if(Math.abs(this.sprite.body.x - this.playerSprite.body.x) <= 130 && Math.abs(this.sprite.body.y - this.playerSprite.body.y) <= this.yRange) {
		this.moving = false;
		this.weapon.attack();
	} else {
		if(!this.moving) {
			this.generateBounds(this.sprite.body.x);
			this.moving = true;
		}
	}
}

MeleeEnemy.prototype.update = function() {
	Enemy.prototype.update.call(this);
	this.weapon.update();
}