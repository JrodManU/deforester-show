function Tree(game, startX, startY, height){
	Damageable.call(this, game);
	this.game = game;
	this.startX = startX;
	this.startY = startY;
	this.height = height;
	this.healthBarMaxWidth = 70;

	this.create();
}

Tree.prototype = Object.create(Damageable.prototype);
Tree.prototype.constructor = Tree;

Tree.prototype.create = function(){
	this.setMaxHealth(this.height);
	this.setHealthToMax();

	this.sprite = this.game.add.sprite(this.startX, this.startY, "trunkTile");
	for(var i = 1; i < this.height; i++) {
		this.sprite.addChild(this.game.make.sprite(0, -this.game.tileSize * i, "trunkTile"));
	}
	this.treeTop = this.sprite.addChild(this.game.make.sprite(-70, this.game.tileSize * -(this.height + 1),"treeTop"));//I know this isnt right.. Can only hit the parent with the axe.
	//Not sure how to let collision between the axe and ee exend to the 
	//children... if we even want to do that...
	this.treeTop.width= 210;
	this.treeTop.height = 140;
	
	this.healthBar = this.sprite.addChild(this.game.make.sprite(-35, -70, "healthBar"));
	this.healthBar.kill();
	this.sprite.object = this;
	
	this.fallTween = this.game.add.tween(this.sprite).to( { rotation: 3.14 /2 }, 500, Phaser.Easing.Linear.None);

}

Tree.prototype.update = function(){
	this.healthBar.width = (this.getHealth()/this.getMaxHealth())*this.healthBarMaxWidth;
	
	if (this.healthBar.width < this.healthBarMaxWidth) {
		this.healthBar.revive();
	}
	
}

Tree.prototype.hasDied = function() {
	this.game.currentState.woodChunkEmitter.x = this.sprite.x + this.game.tileSize / 2;
	this.game.currentState.woodChunkEmitter.y = this.sprite.y - (this.height / 4 * this.game.tileSize);
	this.game.currentState.woodChunkEmitter.start(true, 2000, null, 20);
	
	var healthOrb = new HealthOrb(this.game, this.startX, this.startY - this.height * this.game.tileSize, this.height * 2);
	this.game.currentState.orbs.add(healthOrb.sprite);
	this.game.playerManager.changeMoney(this.height * 10 + 50);
	this.game.playerManager.planetSet.selectedPlanet.treeDied();
	this.fallTween.start()//falling animations
	this.fallTween.onComplete.add(function() {
		this.sprite.destroy();
	}, this);
}
