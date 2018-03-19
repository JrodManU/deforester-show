function Orb(game,startX,startY){
	this.game = game;
	this.startY = startY;
	this.startX = startX;
}
Orb.prototype.create = function(){
	this.sprite.object = this;
	this.sprite.anchor.setTo(.5);
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.body.gravity.y = 2000;
}
Orb.prototype.update = function(platforms){
	this.game.physics.arcade.collide(this.sprite, this.game.currentState.platforms);
}
//This allows a more open ended orb
Orb.prototype.applyEffect = function(playerController) {
	
}
