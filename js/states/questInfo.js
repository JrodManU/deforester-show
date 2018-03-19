function questInfo(){
	
}
questInfo.prototype = {
    init:function(questId, starFieldPos){
        this.quest = this.game.playerManager.questManager.quests[questId];
        this.starFieldPos = starFieldPos;
    },
	create: function(){
		this.starField = new StarField(this.game, this.starFieldPos);
		this.game.uiHelper.createBackButton(this.goBack, this);
		var questTitle = this.game.add.text(400,10,this.quest.name,this.game.fontStyleLarge);
		var questStatus = this.game.add.text(200,200,"Status: " + this.quest.status,this.game.fontStyleMedium);
		
		this.quest.questItems.forEach(function(questItem){
			this.game.add.text(200,300, questItem.itemName+ ": " + questItem.itemCurrentAmount + "/" + questItem.itemGoalAmount,this.game.fontStyleMedium);	
		},this);
		
		var temp = [];
		for(var i = 0; i < this.quest.requiredQuests.length; i++ ){
			temp[i] = this.game.playerManager.questManager.quests[this.quest.requiredQuests[i]].name;
		}
		var previousQuest = this.game.add.text(200,400, (temp.length > 1 ? "Required Quests: " : "Required Quest: ") + temp.join(", "),this.game.fontStyleMedium);
		temp = [];
		var questsThatRequire = this.game.playerManager.questManager.getQuestsThatRequire(this.quest.id);
		for(var i = 0; i< questsThatRequire.length; i++){
			temp[i] = questsThatRequire[i].name;
		}
		var questUnlock = this.game.add.text(200, 500, "This quest unlocks: " + temp.join(", "),this.game.fontStyleMedium);
	},
	update: function() {
		this.starField.update();	
	},
	goBack: function(){
		this.game.state.start("QuestMenu", true, false, this.starField.getPos());
	}
	
}