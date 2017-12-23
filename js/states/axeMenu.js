function axeMenu(){
	
}
axeMenu.prototype = {
	create: function(){
		var goBackBtn = this.game.add.button(10,10,"button",this.goBack);
		var goBackTxt = this.game.add.text(10,10,"◄",this.game.fontStyle);
		
		var axePresets = this.game.playerManager.axeManager.presets;
		for(var i = 0; i < axePresets.length; i++) {
			var button = this.game.add.button(10, 60 * (i + 1), "button", this.editPreset);
			button.presetIndex = i;
			var text = this.game.add.text(10, 60 * (i + 1), axePresets[i].name, this.game.fontStyle);
			button.scale.setTo(.25,.25);
		}
		
		this.skillPointTxt = this.game.add.text(80, 10, "", this.game.fontStyle);
		
		//allows us to set properties for items
		goBackBtn.scale.setTo(.05,.25);
	},//functions that we are using for buttons
	update: function() {
		this.skillPointTxt.text = "Skill Points: " + this.game.playerManager.skillPoints;	
	},
	goBack: function(){
		this.game.state.start("Ship");
	},
	editPreset: function(button) {
		this.game.state.start("EditPreset", true, false, button.presetIndex);
	}
}