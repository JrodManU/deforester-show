function EnemyGun(game, enemy) {
	this.game = game;
	this.enemy = enemy;
	this.shootingPower = 800;
	this.ready = true;
	this.xDif = 0;
	this.yDif = 0;
	this.checkAccuracy = 5; //smaller = more accurate
	this.create();
}

EnemyGun.prototype.create = function() {
	// so that the projectile matches to the animation
	this.sprite = this.game.add.sprite(-4,-13);
}

EnemyGun.prototype.shoot = function() {
	if(this.ready) {
		this.enemy.sprite.animations.play("attack");
		//no point in doing it twice, xDif and yDif are already calculated for checking for a clear shot
		this.enemy.attackAnimation.onComplete.add(this.actuallyShoot, this);
		this.ready = false;
		this.game.time.events.add(1000, this.reload, this);
	}
}

EnemyGun.prototype.actuallyShoot = function() {
	var velocityX = this.xDif * Math.sqrt(Math.pow(this.shootingPower, 2) / (Math.pow(this.xDif, 2) + Math.pow(this.yDif, 2)));
	var velocityY = this.yDif * Math.sqrt(Math.pow(this.shootingPower, 2) / (Math.pow(this.xDif, 2) + Math.pow(this.yDif, 2)));
	var projectile = new Projectile(this.game, "porcupineBullet", this.game.playerManager.playerController.sprite, 2, 2000, this.sprite.world.x, this.sprite.world.y, velocityX, velocityY, 0);
	// right direction
	projectile.sprite.scale.x = this.enemy.sprite.scale.x;
	//width of bullet
	projectile.sprite.x += this.enemy.sprite.scale.x * 7.5;
}

EnemyGun.prototype.reload = function() {
	this.ready = true;
}

EnemyGun.prototype.hasClearShot = function(cellMap) {
	this.xDif = this.game.playerManager.playerController.sprite.x - this.sprite.world.x;
	this.yDif = this.game.playerManager.playerController.sprite.y - this.sprite.world.y;
	if(Math.abs(this.xDif) > Math.abs(this.yDif)) {
		var timesToCheck = Math.abs(Math.floor(this.xDif / this.checkAccuracy));
		if(this.xDif >= 0) {
			for(var i = 1; i <= timesToCheck; i++) {
				var pointX = Math.floor((this.checkAccuracy * i + this.sprite.world.x) / this.game.tileSize);
				var pointY = Math.floor((this.yDif / timesToCheck * i + this.sprite.world.y) / this.game.tileSize);
				if(cellMap[pointX][pointY] == "platform") {
					return false;
				}
			}
		} else {
			for(var i = 1; i <= timesToCheck; i++) {
				var pointX = Math.floor((this.checkAccuracy * -i + this.sprite.world.x) / this.game.tileSize);
				var pointY = Math.floor((this.yDif / timesToCheck * i + this.sprite.world.y) / this.game.tileSize);
				if(cellMap[pointX][pointY] == "platform") {
					return false;
				}
			}
		}
	} else {
		var timesToCheck = Math.abs(Math.floor(this.yDif / this.checkAccuracy));
		if(this.yDif >= 0) {
			for(var i = 1; i <= timesToCheck; i++) {
				var pointY = Math.floor((this.checkAccuracy * i + this.sprite.world.y) / this.game.tileSize);
				var pointX = Math.floor((this.xDif / timesToCheck * i + this.sprite.world.x) / this.game.tileSize);
				if(cellMap[pointX][pointY] == "platform") {
					return false;
				}
			}
		} else {
			for(var i = 1; i <= timesToCheck; i++) {
				var pointY = Math.floor((this.checkAccuracy * -i + this.sprite.world.y) / this.game.tileSize);
				var pointX = Math.floor((this.xDif / timesToCheck * i + this.sprite.world.x) / this.game.tileSize);
				if(cellMap[pointX][pointY] == "platform") {
					return false;
				}
			}
		}
	}
	return true;
}