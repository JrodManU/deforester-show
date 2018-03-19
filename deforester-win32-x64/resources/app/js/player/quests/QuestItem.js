function QuestItem(quest, itemName, itemGoalAmount) {
	this.quest = quest;
	this.status = "incomplete";
	this.itemName = itemName;
	this.itemGoalAmount = itemGoalAmount;
	this.itemCurrentAmount = 0;
}

QuestItem.prototype.update = function(itemAmount) {
	this.itemCurrentAmount += itemAmount;
	if(this.itemCurrentAmount >= this.itemGoalAmount) {
		this.status = "complete";
	} else {
		this.status = "in progress";
	}
}

QuestItem.prototype.isItem = function(itemName) {
	return itemName == this.itemName;
}

QuestItem.prototype.loadSaveData = function(saveData) {
	this.status = saveData.status;
	this.itemCurrentAmount = saveData.itemCurrentAmount;
}

QuestItem.prototype.getSaveData = function() {
		return {
		"status": this.status,
		"itemCurrentAmount": this.itemCurrentAmount
	}
}

