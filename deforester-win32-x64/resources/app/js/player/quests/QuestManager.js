function QuestManager(game) {
	this.game = game;
	this.quests = [];
	this.questsQueuedForCompletion = [];
	this.permittedBroadcasts = ["kills", "gold", "levels", "experience", "healthOrbs", "staminaOrbs", "completedPlanets", "visitedPlanets", "upgradesUnlocked", "trees"];
	
	this.create();
}

QuestManager.prototype.create = function() {
	var questsJSON = this.game.cache.getJSON("quests");
	questsJSON.forEach(function(quest) {
		this.quests[quest.id] = new Quest(this.game, this, quest.id, quest.name, quest.requiredQuests, quest.questItemsParams);
	}, this);
}

QuestManager.prototype.broadcastUpdate = function(itemName, amount) {
	if(this.permittedBroadcasts.includes(itemName)) {
		this.quests.forEach(function(quest) {
			if(!quest.isCompleted() && quest.isUnlocked()) {
				quest.update(itemName, amount);
			}
		}, this);
		this.processQueuedQuests();
	} else {
		console.log(itemName + " is an invalid broadcast");
	}
}

QuestManager.prototype.queueForCompletion = function(id) {
	this.questsQueuedForCompletion.push(id);
}

QuestManager.prototype.processQueuedQuests = function() {
	for(var i = 0; i < this.questsQueuedForCompletion.length; i++) {
		this.completeQuest(this.quests[this.questsQueuedForCompletion[i]].id);
	}
	this.questsQueuedForCompletion = [];
}

QuestManager.prototype.completeQuest = function(id) {
	this.quests[id].complete();
	this.game.audioManager.playSoundFx("questComplete");
	this.quests.forEach(function(quest) {
		if(quest.requiresQuest(id)) {
			quest.tryToUnlock();
		}
	}, this);
}

QuestManager.prototype.questsCompleted = function(questIds) {
	for(var i = 0; i < questIds.length; i++) {
		if(!this.quests[questIds[i]].isCompleted()) {
			return false;
		}
	}
	return true;
}
QuestManager.prototype.getCompletedQuests = function(){
	var temp = [];
	this.quests.forEach(function(quest) {
	    if(quest.isCompleted()){
	    	temp.push(quest);
	    }
	},this);
	return temp;
}
QuestManager.prototype.getUnlockedQuests = function(){
	var temp = [];
	
	this.quests.forEach(function(quest) {
		if(quest.isUnlocked() && !quest.isCompleted()){
			temp.push(quest);
		}
	},this);
	return temp;
}
QuestManager.prototype.getLockedQuests = function(){
	var temp = [];
	this.quests.forEach(function(quest) {
	    if(!quest.isUnlocked()){
	    	temp.push(quest);
	    }
	},this);
	return temp;
}
QuestManager.prototype.getQuestsThatRequire = function(questId){
	var temp = [];
	this.quests.forEach(function(quest){
		quest.requiredQuests.forEach(function(requiredQuestId){
			if(questId == requiredQuestId){
				temp.push(quest)
			}
		},this);
	},this);
	return temp;
}


QuestManager.prototype.loadSaveData = function(saveData) {
	this.quests.forEach(function(quest) {
		quest.loadSaveData(saveData.questsData[quest.id]);
	}, this);
}

QuestManager.prototype.getSaveData = function() {
	var dataList = [];
	this.quests.forEach(function(quest) {
		dataList[quest.id] = quest.getSaveData();
	}, this);
	return {
		"questsData": dataList
	};
}