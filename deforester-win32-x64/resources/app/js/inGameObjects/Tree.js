function Tree(game, startX, startY){
	Damageable.call(this, game);
	this.game = game;
	this.startX = startX;
	this.startY = startY;
	this.healthBarMaxWidth = this.game.tileSize;

	this.create();
}

Tree.prototype = Object.create(Damageable.prototype);
Tree.prototype.constructor = Tree;

Tree.prototype.create = function(){
	this.setMaxHealth(5);
	this.setHealthToMax();

	this.sprite = this.game.add.sprite(this.startX + 38, this.startY + this.game.tileSize + 10, "tree");
	this.sprite.anchor.setTo(.5);
	this.sprite.y -= this.sprite.height / 2;
	
	this.healthBar = this.sprite.addChild(this.game.make.sprite(-35, -70, "healthBar"));
	this.healthBar.kill();
	this.sprite.object = this;
}

Tree.prototype.update = function(){
	this.healthBar.width = (this.getHealth()/this.getMaxHealth())*this.healthBarMaxWidth;
	
	if (this.healthBar.width < this.healthBarMaxWidth) {
		this.healthBar.revive();
	}
	
}

Tree.prototype.hasDied = function() {
	this.game.currentState.woodChunkEmitter.x = this.sprite.x;
	this.game.currentState.woodChunkEmitter.y = this.sprite.y + 60;
	this.game.currentState.woodChunkEmitter.start(true, 2000, null, 20);
	
	var healthOrb = new HealthOrb(this.game, this.sprite.x, this.sprite.y - 60, 5 * 2);
	this.game.currentState.orbs.add(healthOrb.sprite);
	this.game.playerManager.changeMoney(5 * 10 + 50);
	this.game.playerManager.planetSet.selectedPlanet.treeDied();
	this.sprite.destroy();
	this.game.playerManager.questManager.broadcastUpdate("trees", 1);
}
