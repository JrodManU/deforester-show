function TutorialBox(game) {
	this.game = game;
	this.create();
}

TutorialBox.prototype.create = function() {
	this.panel = this.game.add.sprite(10, 648 - 180, "tutorialPanel");
	this.title = this.game.add.text(20, 470, "", this.game.fontStyleLarge);
	this.body = this.game.add.text(20, 505, "", getFontWithWordWrap(this.game.fontStyleMedium, 480));
	this.continueText = this.game.add.text(20, 607, this.game.playerManager.keybindManager.resolveActualNameFromName("continueTutorial") + " to continue or " + this.game.playerManager.keybindManager.resolveActualNameFromName("exitTutorial") + " to close", this.game.fontStyleMedium);
	this.panel.fixedToCamera = true;
	this.title.fixedToCamera = true;
	this.body.fixedToCamera = true;
	this.continueText.fixedToCamera = true;
}

TutorialBox.prototype.loadPrompt = function(prompt) {
	this.title.text = prompt.title;
	this.body.text = prompt.body;
}

TutorialBox.prototype.destroy = function() {
	this.panel.destroy();
	this.title.destroy();
	this.body.destroy();
	this.continueText.destroy();
}
