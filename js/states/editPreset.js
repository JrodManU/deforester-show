function editPreset() {
	this.buttonState = "enabled";
	this.isSaved = true;
	
	this.upgradeToolTipContainer;
	
	this.viewLockedBtnText;
	this.viewSelectedBtnText;
	this.viewUnlockedBtnText;
}

editPreset.prototype = {
	init: function(presetIndex) {
		this.presetIndex = presetIndex;
	},
	create: function() {
		this.game.currentState = this;
		this.menuButtons = [];
		var goBackBtn = this.game.add.button(10,10,"button",this.goBack, this);
		goBackBtn.scale.setTo(.05,.25);
		this.menuButtons.push(goBackBtn);
		var goBackTxt = this.game.add.text(10,10,"◄",this.game.fontStyle);
		this.game.add.text(10,60, this.game.playerManager.axeManager.presets[this.presetIndex].name ,this.game.fontStyle);
		var viewLockedBtn = this.game.add.button(10,100,"button", this.sortByLocked, this);
		viewLockedBtn.scale.setTo(.3,.25);
		this.menuButtons.push(viewLockedBtn);
		this.viewLockedBtnText = this.game.add.text(10,100,"Locked",this.game.fontStyle);
		var viewSelectedBtn = this.game.add.button(10,200,"button", this.sortBySelected, this);
		viewSelectedBtn.scale.setTo(.3,.25);
		this.menuButtons.push(viewSelectedBtn);
		this.viewSelectedBtnText = this.game.add.text(10,200,"Selected",this.game.fontStyle);
		var viewUnlockedBtn = this.game.add.button(10,300,"button", this.sortByUnlocked, this);
		viewUnlockedBtn.scale.setTo(.3,.25);
		this.menuButtons.push(viewUnlockedBtn);
		this.viewUnlockedBtnText = this.game.add.text(10,300,"Unlocked",this.game.fontStyle);
		var saveBtn = this.game.add.button(10,400,"button", this.savePreset, this);
		saveBtn.scale.setTo(.3,.25);
		this.menuButtons.push(saveBtn);
		this.game.add.text(10,400,"Save Preset",this.game.fontStyle);
		
		var graphics = this.game.add.graphics();
		graphics.beginFill(0x000080);
		graphics.lineStyle(4, 0xffd900, 1)
		var skillsContainer = graphics.drawRect(250, 50, 554, 484);
		this.upgradeToolTipContainer = graphics.drawRect(850, 50, 250, 484);
		graphics.endFill();
		
		this.upgradeNameText = this.game.add.text(855, 50, "Name: ", this.game.fontStyle);
		this.upgradeNameText.scale.setTo(.5);
		this.upgradePriceText = this.game.add.text(855, 150, "Price: ", this.game.fontStyle);
		this.upgradePriceText.scale.setTo(.5);
		this.upgradeSkillPointsNeededText = this.game.add.text(855, 100, "Skill Points Needed: ", this.game.fontStyle);
		this.upgradeSkillPointsNeededText.scale.setTo(.5);
		this.upgradeDescriptionText = this.game.add.text(855, 200, "Info: ", this.game.fontStyle);
		this.upgradeDescriptionText.scale.setTo(.5);
		this.upgradeButtonPressText = this.game.add.text(855, 300, "Button: ", this.game.fontStyle);
		this.upgradeButtonPressText.scale.setTo(.5);
		
		
		
		this.upgradeButtons = [];
		this.game.axeUpgradeManager.upgrades.forEach(function(upgrade) {
			this.upgradeButtons.push(new UpgradeButton(this.game, this.presetIndex, upgrade));
		}, this);
		this.lastSortType;
		this.sortBySelected();
	},
	update: function() {
		for (var i = 0; i < this.upgradeButtons.length; i++) {
			this.upgradeButtons[i].update();
		}
	},
	goBack: function(){
		if (!this.isSaved) {
			var graphics = this.game.add.graphics();
			graphics.beginFill(0x000080);
			graphics.lineStyle(4, 0xffd900, 1)
			var goBackPopup = graphics.drawRect(0, 0, 1152, 648);
			graphics.alpha = 0.5;
			graphics.endFill();
			graphics.inputEnabled = true;
			graphics.input.priority = 1;
			
			var goBackPopupText = this.game.add.text((this.camera.x + this.camera.width) / 2, (this.camera.y + this.camera.height) / 2 - 100, "Would you like to save before leaving?", this.game.fontStyle);
			goBackPopupText.anchor.setTo(.5); 
			
			var leaveBtn = this.game.add.button((this.camera.x + this.camera.width) / 2 - 200, (this.camera.y + this.camera.height) / 2, "button", function() {
				this.game.state.start("AxeMenu"); 
			}, this);
			leaveBtn.input.priority = 2;
			leaveBtn.scale.setTo(.3,.25);
			leaveBtn.anchor.setTo(.5);
			var leaveBtnText = this.game.add.text((this.camera.x + this.camera.width) / 2 - 200, (this.camera.y + this.camera.height) / 2, "No", this.game.fontStyle);
			leaveBtnText.anchor.setTo(.5);
			var saveAndLeaveBtn = this.game.add.button((this.camera.x + this.camera.width) / 2 + 200, (this.camera.y + this.camera.height) / 2, "button", function() {
				this.savePreset.call(this);
				this.game.state.start("AxeMenu");
			}, this);
			saveAndLeaveBtn.input.priority = 2;
			saveAndLeaveBtn.scale.setTo(.3, .25);
			saveAndLeaveBtn.anchor.setTo(.5);
			var saveAndLeaveBtnText = this.game.add.text((this.camera.x + this.camera.width) / 2 + 200, (this.camera.y + this.camera.height) / 2, "Yes", this.game.fontStyle);
			saveAndLeaveBtnText.anchor.setTo(.5);
		} else {
			this.game.state.start("AxeMenu");
		}
	},
	savePreset: function() {
		this.game.notifier.notify("Preset saved");
		this.isSaved = true;
		var upgradeIds = [];
		this.upgradeButtons.forEach(function(upgradeButton) {
			if(upgradeButton.upgradeStatus == this.game.upgradeButtonsEnum.SELECTED) {
				upgradeIds.push(upgradeButton.upgrade.id);	
			}
		}, this);
		this.game.playerManager.axeManager.presets[this.presetIndex].updateUpgrades(upgradeIds); 
	},
	sortByLocked: function() {
		this.sortUpgradeButtons(this.game.upgradeButtonsEnum.LOCKED);
		
		this.viewLockedBtnText.addColor('#228B22', 0);
		this.viewSelectedBtnText.addColor("#FF69B4", 0);
		this.viewUnlockedBtnText.addColor("#FF69B4", 0);
	},
	sortBySelected: function() {
		this.sortUpgradeButtons(this.game.upgradeButtonsEnum.SELECTED);
		
		this.viewSelectedBtnText.addColor('#228B22', 0);
		this.viewLockedBtnText.addColor("#FF69B4", 0);
		this.viewUnlockedBtnText.addColor("#FF69B4", 0);
	},
	sortByUnlocked: function() {
		this.sortUpgradeButtons(this.game.upgradeButtonsEnum.UNLOCKED);
		
		this.viewUnlockedBtnText.addColor('#228B22', 0);
		this.viewLockedBtnText.addColor("#FF69B4", 0);
		this.viewSelectedBtnText.addColor("#FF69B4", 0);
	},
	reSort: function() {
		this.sortUpgradeButtons(this.lastSortType);
	},
	sortUpgradeButtons: function(type) {
		this.lastSortType = type;
		var buttonXChange = 0;
		var buttonYChange = 0;
		this.upgradeButtons.forEach(function(upgradeButton) {
			if(upgradeButton.upgradeStatus == type) {
				upgradeButton.button.revive();
				upgradeButton.button.x = /*skillsContainer.centerX*/250 + buttonXChange;
				upgradeButton.button.y = /*skillsContainer.centerY*/50 + buttonYChange;
				if (buttonXChange >= 490) {
					buttonXChange = 0;
					buttonYChange += 70;
					if (buttonYChange >= 420) {
						// Some sort of scroll feature, or a new tab starts with the rest of the skills
					}
				} else {
					buttonXChange += 70
				}
			} else {
				upgradeButton.button.kill();
			}
		}, this);
	},
	madeChange: function() {
		this.isSaved = false;
	},
	changeToolTipInfo: function(upgrade) {
		if(this.currentToolTip != upgrade) {
			this.currentToolTip = upgrade;
			this.upgradeNameText.text = "Name: " + upgrade.name;
			this.upgradeDescriptionText.text = "Info: " + upgrade.info;
			this.upgradeSkillPointsNeededText.text = "Skill Points Needed: " + upgrade.skillPointCost;
			this.upgradePriceText.text = "Price: " + upgrade.price;
			if(upgrade.buttonActivated){
				this.upgradeButtonPressText.text = "Button: " + this.game.playerManager.keybindManager.resolveActualName(this.game.playerManager.keybindManager.getKeybind(upgrade.name));
			}else{
				this.upgradeButtonPressText.text = "Button: ";
			}
		}
	}
}