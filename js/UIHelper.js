function UIHelper(game) {
	this.game = game;
}

UIHelper.prototype.createBackButton = function(callback, context) {
	this.createSmallButton(10, 10, callback, context, "◄", this.game.fontStyleLarge);
}

UIHelper.prototype.createButton = function(x, y, callback, context, text, font, buttonKey = "blueButton") {
	var btn = this.game.add.button(x, y, buttonKey, callback, context, 0, 1, 2);
	var txt = this.game.add.text((x + btn.width / 2), (y + btn.height / 2), text, font);
	btn.text = txt;
	txt.x -= txt.width / 2;
	txt.y -= txt.height / 2;
	
	//no half pixels
	txt.x = Math.floor(txt.x);
	txt.y = Math.floor(txt.y);
	var that = this;
	btn.onInputDown.add(function() {
		that.game.audioManager.playSoundFx("buttonPress");
		//computer died and i gtg anyway. Will work more tomorrow 
		txt.y += 4;
	});
	btn.onInputUp.add(function() {
		txt.y -= 4;
	});
	return btn;
}

UIHelper.prototype.createSmallButton = function(x, y, callback, context, text, font) {
	return this.createButton(x, y, callback, context, text, font, "blueButtonSmall");
}

