function QuestButtonList(game, quests, xPos) {
	this.game = game;
	this.quests = quests;
	this.xPos = xPos
	
	this.pageSize = 8;
	this.currentPage = 0;
	this.lastPage;
	this.buttons = [];
	this.create();
}

QuestButtonList.prototype.create = function() {
	//This is based on 0 being the first page
	this.lastPage = Math.ceil(this.quests.length / this.pageSize) - 1;
	
	var pos = 0;
	for(var i = 0; i < this.quests.length; i++) {
		var button = this.game.uiHelper.createButton(this.xPos, 60 * (pos + 1) + 10, this.goToQuestInfo, this, this.quests[i].name, this.game.fontStyleSmall);
		button.questId = this.quests[i].id
		this.buttons.push(button);
		button.kill();
		button.text.kill();
		pos++;
		if(pos == this.pageSize) {
			pos = 0;
		}
	}
	
	this.pageText = this.game.add.text(this.xPos + 88, 60 * (this.pageSize + 1) + 10, "1", this.game.fontStyleMedium);
	if(this.quests.length <= this.pageSize) {
		this.pageText.kill();
	}
	this.nextPageButton = this.game.add.button(this.xPos + 141, 60 * (this.pageSize + 1) + 10, "buttonRight", function() {
		this.changePage(1);
	}, this);
	this.prevPageButton = this.game.add.button(this.xPos + 10, 60 * (this.pageSize + 1) + 10, "buttonLeft", function() {
		this.changePage(-1);
	}, this);
	
	this.showCurrentPage();
}

QuestButtonList.prototype.changePage = function(num) {
	this.hideCurrentPage();
	this.currentPage += num;
	this.showCurrentPage();
	
	this.pageText.text = this.currentPage;
}

QuestButtonList.prototype.showCurrentPage = function() {
	var lastIndexOfPage = this.currentPage * this.pageSize + this.pageSize;
	var endIndex = this.buttons.length > lastIndexOfPage ? lastIndexOfPage : this.buttons.length;
	for(var i = this.currentPage * this.pageSize; i < endIndex; i++) {
		this.buttons[i].revive();
		this.buttons[i].text.revive();
	}
	if(this.currentPage == 0) {
		this.prevPageButton.kill();
	} else {
		this.prevPageButton.revive();
	}
	if(this.currentPage == this.lastPage) {
		this.nextPageButton.kill();
	} else {
		this.nextPageButton.revive();
	}
}

QuestButtonList.prototype.hideCurrentPage = function() {
	var lastIndexOfPage = this.currentPage * this.pageSize + this.pageSize;
	var endIndex = this.buttons.length > lastIndexOfPage ? lastIndexOfPage : this.buttons.length;
	for(var i = this.currentPage * this.pageSize; i < endIndex; i++) {
		this.buttons[i].kill();
		this.buttons[i].text.kill();
	}
}