function Notifier(game) {
	this.game = game;
	this.timeoutId = null;
	this.create();
}

Notifier.prototype.create = function() {
	this.notificationBox = this.game.add.sprite(this.game.width,this.game.height, "healthBar");
	this.notificationText = this.game.add.text(this.game.width-5,this.game.height, "notification", this.game.fontStyle);
	this.notificationText.anchor.setTo(1,1);
	this.notificationBox.anchor.setTo(1,1);
	this.notificationBox.height = this.notificationText.height;
	this.game.stage.addChild(this.notificationBox);
	this.game.stage.addChild(this.notificationText);
	
	this.notificationText.kill();
	this.notificationBox.kill();
}

Notifier.prototype.notify = function(message) {
	this.notificationBox.revive();
	this.notificationText.revive();
	if(this.timeoutId) {
		clearTimeout(this.timeoutId);
	}
	this.notificationText.text = message;
	this.notificationBox.width = this.notificationText.width + 10;
	var that = this;
	this.timeoutId = setTimeout(function() {
		that.endNotification();
	}, 1200);
}

Notifier.prototype.endNotification = function() {
	this.timeoutId = null;
	this.notificationText.kill();
	this.notificationBox.kill();
}