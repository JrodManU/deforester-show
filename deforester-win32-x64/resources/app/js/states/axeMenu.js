function axeMenu(){
	
}
axeMenu.prototype = {
	init: function(starFieldPos) {
		this.starFieldPos = starFieldPos;	
	},
	create: function(){
		this.starField = new StarField(this.game, this.starFieldPos);
		
		this.game.uiHelper.createBackButton(this.goBack, this);
		var presetButtons = [];
		
		var axePresets = this.game.playerManager.axeManager.presets;
		for(var i = 0; i < axePresets.length; i++) {
			var button = this.game.uiHelper.createButton(576 - 95, 80 + 59 * i, this.editPreset, this, axePresets[i].name, this.game.fontStyleLarge);
			var renameButton = this.game.uiHelper.createSmallButton(576 + 120, 80 + 59 * i, this.changeName, this, "✎", this.game.fontStyleLarge);
			button.presetIndex = i;
			renameButton.presetIndex = i;
			renameButton.presetText = button.text;
		}
		
	},
	update: function() {
		this.starField.update();
	},
	goBack: function(){
		this.game.state.start("Ship", true, false, this.starField.getPos());
	},
	editPreset: function(button) {
		this.game.state.start("EditPreset", true, false, button.presetIndex, this.starField.getPos());
	},
	changeName: function(button){
		var that = this;
		vex.dialog.open({
            message: 'Please enter a name for the preset (max length is 10):',
            input: [
                '<input name="presetName" type="text" required />',
            ].join(''),
            buttons: [
                $.extend({}, vex.dialog.buttons.OK, { text: 'Submit' }),
                $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
            ],
            callback: function (data) {
                if(data && data.presetName.length <= 10) {
                	button.presetText.text = data.presetName;
                	that.game.playerManager.axeManager.presets[button.presetIndex].name = data.presetName;
                }
            }
        });
	}
}