function loadSaveMenu(){
	
}
loadSaveMenu.prototype = {
	create: function(){
		var goBackBtn = this.game.add.button(10,10,"button",this.goBack);
		var goBackTxt = this.game.add.text(10,10,"◄",this.game.fontStyle);
		goBackBtn.scale.setTo(.05,.25);
		this.saveStates = JSON.parse(localStorage.getItem("saveStates"));
		var changeY = 0;
		for(var i = 0; i < this.saveStates.length; i++) {
			var button = this.game.add.button(200, 50 + changeY, "button", this.loadSaveState, this);
			button.scale.setTo(.25);
			button.saveStateIndex = i;
			var buttonTxt = this.game.add.text(200,50 + changeY, this.saveStates[i].name,this.game.fontStyle);
			
			var delButton = this.game.add.button(450, 50 + changeY, "button", this.deleteSaveState, this);
			delButton.scale.setTo(.05, .25);
			delButton.otherButton = button;
			delButton.otherButtonTxt = buttonTxt;
			
			changeY += 70;
		}
	},
	goBack: function(){
		this.game.state.start("GameTitle");
	},
	loadSaveState: function(button) {
		var saveState = this.saveStates[button.saveStateIndex];
		this.game.playerManager = new PlayerManager(this.game);
		this.game.playerManager.loadSaveData(saveState.playerData);
		this.game.saveName = saveState.name;
		this.game.state.start("Ship");
	},
	deleteSaveState: function(delButton) {
		var temp = this.saveStates;
		this.saveStates.splice(delButton.otherButton.saveStateIndex, 1);
		localStorage.setItem("saveStates", JSON.stringify(this.saveStates));
		this.saveStates = temp;
		delButton.otherButton.destroy();
		delButton.otherButtonTxt.destroy();
		delButton.destroy();
	}
}