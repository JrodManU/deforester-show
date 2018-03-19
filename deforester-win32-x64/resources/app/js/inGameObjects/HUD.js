function HUD(game) {
	this.game = game;
	this.create();
}

HUD.prototype.create = function() {
	var offsetX = -40;
	var offsetY = -4;
	var hudBackground = this.game.add.sprite(0 + offsetX,0 + offsetY,"hudBg");
	//var level = this.game.add.text(0,100,"lvl: ",this.game.fontStyleSmall);
	this.hpBar = this.game.add.sprite(102 + offsetX,36 + offsetY,"healthBar");
	this.xpBar = this.game.add.sprite(102 + offsetX,108 + offsetY,"expBar");
	this.staminaBar = this.game.add.sprite(102 + offsetX,72 + offsetY,"staminaBar");
	this.duraText = this.game.add.text(248 + offsetX,160 + offsetY,"", this.game.fontStyleSmall);
	this.levelTxt = this.game.add.text(332 + offsetX,102 + offsetY,"",this.game.fontStyleSmall);
	this.moneyTxt = this.game.add.text(75 + offsetX,158 + offsetY,"",this.game.fontStyleSmall);
	var hudOverlay = this.game.add.sprite(0 + offsetX,0 + offsetY,"hudOverlay");
	// properties of variables
	hudBackground.fixedToCamera = true;
	this.xpBar.fixedToCamera = true;
	this.hpBar.fixedToCamera = true;
	this.staminaBar.fixedToCamera = true;
	this.duraText.fixedToCamera =true;
	hudOverlay.fixedToCamera = true;
	this.moneyTxt.fixedToCamera = true;
	this.levelTxt.fixedToCamera = true;
}

HUD.prototype.update = function() {
	if(this.game.playerManager.playerController.axe) {
		this.duraText.text = this.game.playerManager.playerController.axe.getDurability();
	} else {
		this.duraText.text = "0";
	}
	this.hpBar.width = 222 * (this.game.playerManager.playerController.getHealth()/this.game.playerManager.playerController.getMaxHealth());
	this.xpBar.width = 222 * (this.game.playerManager.playerExperience/this.game.playerManager.playerExperienceCap);
	this.staminaBar.width = 222 * (this.game.playerManager.playerController.getStamina()/ this.game.playerManager.playerController.getMaxStamina())
	this.levelTxt.text = this.game.playerManager.playerLevel;
	this.moneyTxt.text = this.game.playerManager.money;
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