function Quest(game, questManager, id, name, requiredQuests, questItemsParams) {
	this.game = game;
	this.questManager = questManager;
	this.id = id;
	this.name = name;
	this.requiredQuests = requiredQuests;
	
	this.unlocked = false;
	this.status = "not started";
	this.questItems = [];
	
	this.create(questItemsParams);
}

Quest.prototype.create = function(questItemsParams) {
	for(var i = 0; i < questItemsParams.length; i++) {
		this.questItems[i] = new QuestItem(this, questItemsParams[i].itemName, questItemsParams[i].itemGoalAmount);
	}
	this.tryToUnlock();
}

Quest.prototype.update = function(itemName, itemAmount) {
	var hasAny = false;
	for(var i = 0; i < this.questItems.length; i++) {
		if(this.questItems[i].isItem(itemName)) {
			hasAny = true;
		}
	}
	if(!hasAny) {
		return false;
	}
	
	this.status = "queued for completion";
	for(var i = 0; i < this.questItems.length; i++) {
		if(this.questItems[i].isItem(itemName)) {
			this.questItems[i].update(itemAmount);
			if(this.questItems[i].status == "in progress")	 {
				this.status = "in progress";
			} else if(this.questItems.status == "not started" && this.status != "in progress") {
				this.status = "not started";
			}
		}
	}
	if(this.status == "queued for completion") {
		this.questManager.queueForCompletion(this.id);
	}
}

Quest.prototype.tryToUnlock = function() {
	this.unlocked = this.questManager.questsCompleted(this.requiredQuests);
}

Quest.prototype.requiresQuest = function(questId) {
	return this.requiredQuests.includes(questId);
}

Quest.prototype.complete = function() {
	this.status = "completed";
	this.game.notifier.notify("Completed quest: " + this.name);
	this.game.audioManager.playSoundFx("questComplete");
}

Quest.prototype.isCompleted = function() {
	return this.status == "completed";
}

Quest.prototype.isUnlocked = function() {
	return this.unlocked;
}

Quest.prototype.loadSaveData = function(saveData) {
	this.status = saveData.status;
	this.unlocked = saveData.unlocked;
	for(var i = 0; i < saveData.questItemsData.length; i++) {
		this.questItems[i].loadSaveData(saveData.questItemsData[i]);
	}
}

Quest.prototype.getSaveData = function() {
	var dataList = [];
	this.questItems.forEach(function(questItem) {
		dataList.push(questItem.getSaveData());
	}, this);
	return {
		"status": this.status,
		"unlocked": this.unlocked,
		"questItemsData": dataList
	};
}