function questMenu(){
	
}
questMenu.prototype = {
	init: function(starFieldPos) {
		this.starFieldPos = starFieldPos;
	},
	create: function(){
		this.starField = new StarField(this.game, this.starFieldPos);
		this.game.uiHelper.createBackButton(this.goBack, this);
		
		var unlockedQuestsTxt = this.add.text(110,10,"Unlocked", this.game.fontStyleLarge);
		var lockedQuestTxt = this.add.text(410,10,"Locked",this.game.fontStyleLarge);
		var completedQuestsTxt = this.add.text(710,10,"Completed",this.game.fontStyleLarge);
		
		var unlockedQuestsList = new QuestButtonList(this.game, this.game.playerManager.questManager.getUnlockedQuests(), 110);
		var lockedQuestsList = new QuestButtonList(this.game, this.game.playerManager.questManager.getLockedQuests(), 410);
		var completedQuestsList = new QuestButtonList(this.game, this.game.playerManager.questManager.getCompletedQuests(), 710);
		
		this.game.playerManager.tutorialManager.tryToCreateNewTutorial("Quests");
	},
	update: function() {
		this.starField.update();	
	},
	goBack: function(){
		this.game.state.start("Ship", true, false, this.starField.getPos());
	},
	goToQuestInfo: function(button){
		this.game.state.start("QuestInfo", true, false, button.questId, this.starField.getPos());
	}
}