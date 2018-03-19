function loadSaveMenu(){
	
}
loadSaveMenu.prototype = {
	init: function(starFieldPos) {
		this.starFieldPos = starFieldPos;
	},
	create: function(){
		this.starField = new StarField(this.game, this.starFieldPos);
		this.game.uiHelper.createBackButton(this.goBack, this);
		
		this.saveStates = JSON.parse(localStorage.getItem("saveStates"));
		this.savesQueuedForDeletion = [];
		var changeY = 0;
		for(var i = 0; i < this.saveStates.length; i++) {
			var button = this.game.uiHelper.createButton(200, 50 + changeY, this.loadSaveState, this, this.saveStates[i].name, this.game.fontStyleLarge);
			button.saveStateIndex = i;
			
			var delButton = this.game.uiHelper.createSmallButton(450, 50 + changeY, this.queueSaveStateForDelete, this, "X", this.game.fontStyleLarge);
			delButton.otherButton = button;
			
			changeY += 70;
		}
	},
	update: function() {
		this.starField.update();	
	},
	goBack: function(){
		this.deleteQueuedSaves();
		this.game.state.start("GameTitle", true, false, this.starField.getPos());
	},
	loadSaveState: function(button) {
		var saveState = this.saveStates[button.saveStateIndex];
		this.game.playerManager = new PlayerManager(this.game);
		this.game.playerManager.loadSaveData(saveState.playerData);
		this.game.saveName = saveState.name;
		electronLog("info", "loaded save state: " + saveState.name);
		this.game.state.start("Ship", true, false, this.starField.getPos());
	},
	queueSaveStateForDelete: function(delButton) {
		this.savesQueuedForDeletion.push(delButton.otherButton.saveStateIndex);
		delButton.otherButton.text.destroy();
		delButton.otherButton.destroy();
		delButton.text.destroy();
		delButton.destroy();
	},
	deleteQueuedSaves: function() {
		var newSaveStates = [];
		for(var i = 0; i < this.saveStates.length; i++) {
			if(!this.savesQueuedForDeletion.includes(i)) {
				newSaveStates.push(this.saveStates[i]);
			}
		}
		localStorage.setItem("saveStates", JSON.stringify(newSaveStates));
		electronLog("info", "queued saves deleted")
	}
}