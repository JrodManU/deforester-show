function HealthOrb(game,startX,startY, healAmount){
	this.game = game;
	Orb.call(this, game, startX, startY);
	this.healAmount = healAmount;
	this.create();
}

HealthOrb.prototype = Object.create(Orb.prototype);
HealthOrb.prototype.constructor = HealthOrb;

HealthOrb.prototype.create = function(){
	this.sprite = this.game.add.sprite(this.startX,this.startY,"healthPickup");
	//The orbs function uses the sprite created here
	Orb.prototype.create.call(this);
}
HealthOrb.prototype.applyEffect = function(playerController) {
	playerController.changeHealth(this.healAmount);
	this.game.playerManager.questManager.broadcastUpdate("healthOrbs", 1);
}
