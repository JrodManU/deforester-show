function Tutorial(game, tutorialData) {
	this.game = game;
	this.id = tutorialData.id;
	this.name = tutorialData.name;
	this.tutorialPrompts = tutorialData.tutorialPrompts;
	//so that the first one is 0
	this.currentPrompt = -1;

	this.create();
}

Tutorial.prototype.create = function() {
	this.tutorialBox = new TutorialBox(this.game);
	this.addBindings();
	this.nextPrompt();
}

Tutorial.prototype.nextPrompt = function() {
	this.currentPrompt++;
	if(this.currentPrompt == this.tutorialPrompts.length) {
		this.exit();
	} else {
		this.tutorialBox.loadPrompt(this.tutorialPrompts[this.currentPrompt]);
	}
}

Tutorial.prototype.exit = function() {
	this.game.playerManager.tutorialManager.markAsComplete(this.id);
	this.tutorialBox.destroy();
	this.removeBindings();
}

Tutorial.prototype.addBindings = function() {
	var continueKey = this.game.input.keyboard.addKey(this.game.playerManager.keybindManager.getKeybind("continueTutorial"));
    this.continueBinding = continueKey.onDown.add(this.nextPrompt, this);
    var exitKey = this.game.input.keyboard.addKey(this.game.playerManager.keybindManager.getKeybind("exitTutorial"));
    this.exitBinding = exitKey.onDown.add(this.exit, this);
}

Tutorial.prototype.removeBindings = function() {
	this.continueBinding.detach();
	this.exitBinding.detach();
}