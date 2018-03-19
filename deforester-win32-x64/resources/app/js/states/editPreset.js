function editPreset() {
	this.buttonState = "enabled";
	this.isSaved = true;
}

editPreset.prototype = {
	init: function(presetIndex, starFieldPos) {
		this.presetIndex = presetIndex;
		this.starFieldPos = starFieldPos;
	},
	create: function() {
		this.starField = new StarField(this.game, this.starFieldPos);
		this.game.currentState = this;
		this.game.uiHelper.createBackButton(this.goBack, this);
		
		this.game.add.text(10,70, this.game.playerManager.axeManager.presets[this.presetIndex].name ,this.game.fontStyleLarge);
		this.lockedBtn = this.game.uiHelper.createButton(10, 110, this.sortByLocked, this, "Locked", this.game.fontStyleLarge);
		this.unlockedBtn = this.game.uiHelper.createButton(10, 169, this.sortByUnlocked, this, "Unlocked", this.game.fontStyleLarge);
		this.selectedBtn = this.game.uiHelper.createButton(10, 228, this.sortBySelected, this, "Selected", this.game.fontStyleLarge);
		this.game.uiHelper.createButton(10, 287, this.savePreset, this, "Save preset", this.game.fontStyleMedium);
		
		this.skillPointsText = this.game.add.text(10, 380, "Skill Points: ", this.game.fontStyleSmall);
		
		this.game.add.sprite(210, 10, "greyPanel");
		
		var fontWithWrap = getFontWithWordWrap(this.game.fontStyleLarge, 356);
		this.upgradeNameText = this.game.add.text(786, 10, "", fontWithWrap);
		this.upgradePriceText = this.game.add.text(786, 450, "", fontWithWrap);
		this.upgradeSkillPointsNeededText = this.game.add.text(786, 500, "", fontWithWrap);
		this.upgradeDescriptionText = this.game.add.text(786, 60, "", fontWithWrap);
		this.upgradeButtonPressText = this.game.add.text(786, 400, "", fontWithWrap);
		
		this.game.playerManager.tutorialManager.tryToCreateNewTutorial("Upgrades");
		
		this.upgradeButtons = [];
		this.game.axeUpgradeManager.upgrades.forEach(function(upgrade) {
			this.upgradeButtons.push(new UpgradeButton(this.game, this.presetIndex, upgrade));
		}, this);
		this.lastSortType;
		this.sortBySelected();
	},
	update: function() {
		this.skillPointsText.setText("Skill Points: " + this.game.playerManager.skillPoints);
		for (var i = 0; i < this.upgradeButtons.length; i++) {
			this.upgradeButtons[i].update();
		}
		this.starField.update();
	},
	goBack: function(){
		if (!this.isSaved) {
			var that = this;
			vex.dialog.open({
			    message: 'Do you want to save before you leave?',
			    buttons: [
			        $.extend({}, vex.dialog.buttons.YES, { text: 'Save' }),
			        $.extend({}, vex.dialog.buttons.NO, { text: "Don't Save" })
			    ],
			    callback: function (value) {
			        if (value) {
			        	that.savePreset.call(that);
			            that.game.state.start("AxeMenu"); 
			        } else {
						that.game.state.start("AxeMenu");
			        }
			    }
			});
		} else {
			this.game.state.start("AxeMenu", true, false, this.starField.getPos());
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
		this.lockedBtn.text.addColor("#ff0000", 0);
		this.unlockedBtn.text.addColor("#fffff", 0);
		this.selectedBtn.text.addColor("#fffff", 0);
	},
	sortBySelected: function() {
		this.sortUpgradeButtons(this.game.upgradeButtonsEnum.SELECTED);
		this.selectedBtn.text.addColor("#ff0000", 0);
		this.unlockedBtn.text.addColor("#fffff", 0);
		this.lockedBtn.text.addColor("#fffff", 0);
	},
	sortByUnlocked: function() {
		this.sortUpgradeButtons(this.game.upgradeButtonsEnum.UNLOCKED);
		this.unlockedBtn.text.addColor("#ff0000", 0);
		this.selectedBtn.text.addColor("#fffff", 0);
		this.lockedBtn.text.addColor("#fffff", 0);
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
				upgradeButton.button.x = 216 + buttonXChange;
				upgradeButton.button.y = 16 + buttonYChange;
				if (buttonXChange >= 490) {
					buttonXChange = 0;
					if (buttonYChange >= 490) {
						// Some sort of scroll feature, or a new tab starts with the rest of the skills
					} else {
						buttonYChange += 70;
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
			this.upgradeNameText.text = upgrade.name;
			this.upgradeDescriptionText.text = upgrade.info;
			if(this.lastSortType == this.game.upgradeButtonsEnum.LOCKED) {
				this.upgradeSkillPointsNeededText.text = "Skill points needed: " + upgrade.skillPointCost;
			} else {
				this.upgradeSkillPointsNeededText.text = "";
			}
			this.upgradePriceText.text = "Price: " + upgrade.price;
			if(upgrade.buttonActivated){
				this.upgradeButtonPressText.text = "Button: " + this.game.playerManager.keybindManager.resolveActualNameFromName(upgrade.name);
			}else{
				this.upgradeButtonPressText.text = "";
			}
		}
	}
}