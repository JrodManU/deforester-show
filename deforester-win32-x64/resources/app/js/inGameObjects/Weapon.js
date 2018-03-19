/**
 * THIS WHOLE OBJECT IS TEMPORARY
 *
 */
function Weapon(game) {
	this.game = game;
	this.swingSpeed = 150;
	this.returnSpeed = 45;
	this.state;
	this.attackDamage = 1;
	
	this.create();
}

Weapon.prototype.create = function() {
	this.state = "rest";
	this.sprite = this.game.add.sprite(30,15, "axe");
	this.sprite.object = this;
	this.sprite.anchor.setTo(.5, 1);
	
	this.weaponHead = this.sprite.addChild(this.game.make.sprite(5, -100, "axeHead")); //the entire weapon will be exactly the same as the player's FOR NOW
	this.weaponHead.height = 30;
	this.weaponHead.width = 40;
	
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.rotation = 0;
	
	this.returnTween = this.game.add.tween(this.sprite).to( { rotation: 0}, 100, Phaser.Easing.Linear.None); 
	this.swingTween = this.game.add.tween(this.sprite).to( { rotation: 3.14 / 2 }, 100, Phaser.Easing.Linear.None);
	
	this.swingTween.onComplete.add(function() {
	this.state = "return";
	this.returnTween.start();
	}, this);
	this.returnTween.onComplete.add(function() {
		this.state = "rest";	
	}, this);
} ;

Weapon.prototype.update = function() {
	if(this.state == "swing"){
		this.game.physics.arcade.overlap(this.weaponHead, this.game.playerManager.playerController.sprite, this.hitPlayer, null, this);
	}
};
Weapon.prototype.attack = function() {
	if(this.state == "rest"){
		this.state = "swing";
		this.swingTween.pendingDelete = false;
		this.swingTween.start();
	}
} ;

Weapon.prototype.hitPlayer = function(weaponHeadSprite, playerSpriteHit) {
	this.swingTween.stop(true);
	playerSpriteHit.object.changeHealth(-this.attackDamage);
};

