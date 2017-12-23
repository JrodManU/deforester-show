function gameSettings() {}

gameSettings.prototype = {
	create: function() {
		this.resolutionButtons = this.game.add.group();
		var resolutionMenuButton = this.game.add.button(this.game.world.centerX / 2, 100, "button", this.toggleMenu)
		resolutionMenuButton.anchor.setTo(.5);
		resolutionMenuButton.scale.setTo(.25);
		var resolutionMenuButtonText = this.game.add.text(this.game.world.centerX / 2.5, 100, "Resolution: ", this.game.fontStyle);
		resolutionMenuButtonText.anchor.setTo(.5);
		resolutionMenuButtonText.scale.setTo(.5);
		this.resolutionButtons.add(resolutionMenuButton);
		this.resolutionButtons.add(resolutionMenuButtonText);
		var goBackBtn = this.game.add.button(10,10,"button",this.goBack);
		var goBackTxt = this.game.add.text(10,10,"◄",this.game.fontStyle);
		goBackBtn.scale.setTo(.05,.25);
	},
	goBack: function(){
		this.game.state.start("GameTitle");
	}
}