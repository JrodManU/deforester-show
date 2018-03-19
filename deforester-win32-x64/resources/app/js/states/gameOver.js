function gameOver() {}

gameOver.prototype = {
	preload: function() {
		
	},
	create: function() {
		var text = this.game.add.text((this.camera.x + this.camera.width) / 2, 100, "Game Over Loser... Press space to play again", this.game.fontStyleLarge);
		text.anchor.setTo(.5);
		var playAgainKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		playAgainKey.onDown.add(this.goToTitle, this);
		
		var saveStates = JSON.parse(localStorage.getItem("saveStates"));
		for(var i = 0; i < saveStates.length; i++) {
			if(saveStates[i].name == this.game.saveName) {
				saveStates.splice(i, 1);
				break;
			}
		}
		localStorage.setItem("saveStates", JSON.stringify(saveStates));
		electronLog("info", "deleted save " + this.game.saveName);
	},
	goToTitle: function() {
		this.game.state.start("GameTitle");
	}
}