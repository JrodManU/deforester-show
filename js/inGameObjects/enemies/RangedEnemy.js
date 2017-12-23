function RangedEnemy(game, startX, startY, cellMap) {
	Enemy.call(this, game, startX, startY, cellMap);
	this.rangeRadius = 700;
}

RangedEnemy.prototype = Object.create(Enemy.prototype);
RangedEnemy.prototype.constructor = RangedEnemy;

RangedEnemy.prototype.create = function(){
	Enemy.prototype.create.call(this);
	this.gun = new EnemyGun(this.game);
	this.sprite.addChild(this.gun.sprite);
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
