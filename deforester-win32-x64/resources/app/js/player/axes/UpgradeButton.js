function UpgradeButton(game, presetIndex, upgrade) {
	this.game = game;
	
	this.presetIndex = presetIndex;
	this.upgrade = upgrade;
	this.upgradeStatus;
	this.upgradeToolTip;
	this.updateStatus();
	this.create();
}

UpgradeButton.prototype.create = function() {
	this.button = this.game.add.button(0,0,this.upgrade.name, this.clicked, this);
}

UpgradeButton.prototype.update = function() {
	if (this.button.input.justOver()) {
		this.game.currentState.changeToolTipInfo(this.upgrade);
	}
}

UpgradeButton.prototype.updateStatus = function() {
	if(this.game.playerManager.hasUnlockedUpgrade(this.upgrade.id)) {
		if(this.game.playerManager.axeManager.presets[this.presetIndex].axeUpgrades.indexOf(this.upgrade.id) != -1) {
			this.upgradeStatus = this.game.upgradeButtonsEnum.SELECTED;
		} else {
			this.upgradeStatus = this.game.upgradeButtonsEnum.UNLOCKED;
		}
	} else {
		this.upgradeStatus = this.game.upgradeButtonsEnum.LOCKED;
	}
}

UpgradeButton.prototype.clicked = function() {
	this.active = false;
	this.game.audioManager.playSoundFx("switch");
	switch(this.upgradeStatus) {
		case this.game.upgradeButtonsEnum.LOCKED:
			if(this.game.playerManager.tryToUnlockUpgrade(this.upgrade)) {
				this.upgradeStatus = this.game.upgradeButtonsEnum.UNLOCKED;
				this.game.currentState.reSort.call(this.game.currentState);
			}
			break;
		case this.game.upgradeButtonsEnum.SELECTED:
			this.upgradeStatus = this.game.upgradeButtonsEnum.UNLOCKED;
			this.game.currentState.madeChange.call(this.game.currentState);
			this.game.currentState.reSort.call(this.game.currentState);
			break;
		case this.game.upgradeButtonsEnum.UNLOCKED:
			this.upgradeStatus = this.game.upgradeButtonsEnum.SELECTED;
			this.game.currentState.madeChange.call(this.game.currentState);
			this.game.currentState.reSort.call(this.game.currentState);
			break;
	}
}