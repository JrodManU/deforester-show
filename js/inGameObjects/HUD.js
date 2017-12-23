function HUD(game) {
	this.game = game;
	this.maxWidth = 200;
	this.hudWidth = 200;
	this.maxHeight = 150;
	this.create();
}

HUD.prototype.create = function() {
	var hudBackground = this.game.add.sprite(0,0,"hudBg");
	var hpOutline = this.game.add.sprite(0,27,"hpOutline");
	var level = this.game.add.text(this.hudWidth - 70,100,"lvl: ",this.game.fontStyleSmall);
	var skillPtTxt = this.game.add.text(5,level.y,"Points:",this.game.fontStyleSmall);
	this.hpBar = this.game.add.sprite(0,30,"healthBar");
	this.duraBar = this.game.add.sprite(0,90,"duraBar");
	this.xpBar = this.game.add.sprite(0,this.maxHeight-10,"expBar");
	this.staminaBar = this.game.add.sprite(0,this.maxHeight-90,"staminaBar");
	this.levelTxt = this.game.add.text(level.x + 40,level.y,this.game.playerManager.playerLevel,this.game.fontStyleSmall);
	this.moneyTxt = this.game.add.text(20,0,"$" + this.game.playerManager.money,this.game.fontStyleSmall);
	this.skillPt = this.game.add.text(skillPtTxt.x + 70,level.y,this.game.playerManager.skillPoints,this.game.fontStyleSmall);
	// properties of variables
	level.fixedToCamera = true;
	hudBackground.width= this.hudWidth;
	hudBackground.height = this.maxHeight;
	hudBackground.fixedToCamera = true;
	hpOutline.fixedToCamera = true;
	hpOutline.width = this.maxWidth;
	hpOutline.height = 66;
	skillPtTxt.fixedToCamera = true;
	this.xpBar.fixedToCamera = true;
	this.levelTxt.fixedToCamera = true;
	this.duraBar.fixedToCamera = true;
	this.moneyTxt.fixedToCamera = true;
	this.hpBar.fixedToCamera = true;
	this.hpBar.height = 30;
	this.staminaBar.height = 30;
	this.staminaBar.fixedToCamera = true;
	this.skillPt.fixedToCamera = true;
}

HUD.prototype.update = function() {
	if(this.game.playerManager.playerController.axe) {
		this.duraBar.width = this.maxWidth * (this.game.playerManager.playerController.axe.getDurability()/this.game.playerManager.playerController.axe.getMaxDurability());
		this.duraBar.revive();
	} else {
		this.duraBar.kill();
	}
	this.skillPt.text = this.game.playerManager.skillPoints;
	this.hpBar.width = (this.maxWidth-3) * (this.game.playerManager.playerController.getHealth()/this.game.playerManager.playerController.getMaxHealth());
	this.xpBar.width = this.maxWidth *(this.game.playerManager.playerExperience/this.game.playerManager.playerExperienceCap);
	this.staminaBar.width = (this.maxWidth-3) * (this.game.playerManager.playerController.getStamina()/ this.game.playerManager.playerController.getMaxStamina())
	this.levelTxt.text = this.game.playerManager.playerLevel;
	this.moneyTxt.text = "$" + this.game.playerManager.money;
	var changeX = -10;
	var changeY = 10;
	//If someone can figure out the magical reason why this doesn't work in the other if statement above thatd be great
	if(this.game.playerManager.playerController.axe) {
		this.game.playerManager.playerController.axe.cooldownManager.getCooldowns().forEach(function(cooldown) {
			if(cooldown.finished) {
				cooldown.sprite.kill();
			} else {
				cooldown.sprite.revive();
				if(cooldown.wipe) {
					cooldown.coverSprite.width = 64 * (1 - (Date.now() - cooldown.startTime) / cooldown.length);
					cooldown.coverSprite.revive();
				} else {
					cooldown.coverSprite.kill();
				}
				cooldown.sprite.cameraOffset.x = this.game.width + changeX - 64;
				cooldown.sprite.cameraOffset.y = changeY;
				changeX -= 74;
			}
		}, this);
	}
} 