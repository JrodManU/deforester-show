function StaminaOrb(game,startX,startY, staminaRestoreAmount){
	this.game = game;
	Orb.call(this, game, startX, startY);
	this.staminaRestoreAmount = staminaRestoreAmount;
	this.create();
}

StaminaOrb.prototype = Object.create(Orb.prototype);
StaminaOrb.prototype.constructor = StaminaOrb;

StaminaOrb.prototype.create = function(){
	this.sprite = this.game.add.sprite(this.startX,this.startY,"staminaPickup");
	Orb.prototype.create.call(this);
}
StaminaOrb.prototype.applyEffect = function(playerController) {
	playerController.changeStamina(this.staminaRestoreAmount);
	this.game.playerManager.questManager.broadcastUpdate("staminaOrbs", 1);
}
