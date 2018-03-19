function TutorialManager(game) {
	this.game = game;
	this.create();
	this.currentTutorial = null;
}

TutorialManager.prototype.create = function() {
	this.completedTutorials = [];
	this.tutorialsJSON = this.game.cache.getJSON("tutorials");
	
	
}

TutorialManager.prototype.createNewTutorial = function(name) {
	this.tutorialsJSON.forEach(function(tutorialData) {
		if(name == tutorialData.name) {
			this.currentTutorial = new Tutorial(this.game, tutorialData);
		}
	}, this);
}

TutorialManager.prototype.checkIfComplete = function(id) {
	return this.completedTutorials.indexOf(id) != -1;
}

TutorialManager.prototype.tryToCreateNewTutorial = function(name) {
	if(!this.checkIfComplete(this.resolveIdFromName(name))) {
		this.createNewTutorial(name);
	}
}

TutorialManager.prototype.resolveIdFromName = function(name) {
	for(var i = 0; i < this.tutorialsJSON.length; i++) {
		if(name == this.tutorialsJSON[i].name) {
			return this.tutorialsJSON[i].id;
		}
	}
}

TutorialManager.prototype.markAsComplete = function(id) {
	this.completedTutorials.push(id);
	//since this means we finished it we no longer need a reference to it
	this.currentTutorial = null;
}

TutorialManager.prototype.loadSaveData = function(saveData) {
	this.completedTutorials = saveData.completedTutorials;
}

TutorialManager.prototype.getSaveData = function() {

	return {"completedTutorials": this.completedTutorials};
}