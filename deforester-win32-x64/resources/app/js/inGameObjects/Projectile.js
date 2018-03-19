function Projectile(game, imageKey, target, damage, lifespan, startX, startY, velocityX, velocityY, gravity) {
	this.game = game;
	this.imageKey = imageKey;
	this.target = target;
	this.damage = damage;
	this.lifespan = lifespan;
	this.startX = startX;
	this.startY = startY;
	this.velocityX = velocityX;
	this.velocityY = velocityY;
	this.gravity = gravity;
	this.sprite;
	this.markedForDeletion = false;
	this.launch();
}

Projectile.prototype.launch = function() {
	this.sprite = this.game.add.sprite(this.startX, this.startY, this.imageKey);
	this.game.physics.arcade.enableBody(this.sprite);
	this.sprite.object = this;
	this.sprite.body.velocity.x = this.velocityX;
	this.sprite.body.velocity.y = this.velocityY;
	this.sprite.body.gravity.y = this.gravity;
	this.sprite.anchor.setTo(.5);
	
	this.game.currentState.projectiles.add(this.sprite);
	
	var that = this;
	setTimeout(function() {
		that.markedForDeletion = true;	
	}, this.lifespan);
}

Projectile.prototype.update = function() {
	if(this.markedForDeletion) {
		this.sprite.destroy();
	}
	this.game.physics.arcade.overlap(this.sprite, this.game.currentState.platforms, this.hitPlatform, null, this);
	this.game.physics.arcade.overlap(this.sprite, this.target, this.hitTarget, null, this);
}

Projectile.prototype.hitPlatform = function(projectileSprite, platformSprite) {
	this.markedForDeletion = true;
}

Projectile.prototype.hitTarget = function(projectileSprite, targetSprite) {
	targetSprite.object.changeHealth(-this.damage);
	this.markedForDeletion = true;
}