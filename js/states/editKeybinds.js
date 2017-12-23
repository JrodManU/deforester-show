function editKeybinds() {
    
}
editKeybinds.prototype = {
    create: function(){
        var goBackBtn = this.game.add.button(10,10,"button",this.goBack);
		this.game.add.text(10,10,"◄",this.game.fontStyle);
		goBackBtn.scale.setTo(.05,.25);
		
		var changeY = 0;
		for(var keyName in this.game.playerManager.keybindManager.getKeybinds()) {
		    this.game.add.text(60, 10 + changeY, keyName, this.game.fontStyleSmall);
		    var button = this.game.add.button(185, 10 + changeY, "button", this.getNewKey, this);
		    button.scale.setTo(.05, .1);
		    button.keyName = keyName;
		    var keyCode = this.game.playerManager.keybindManager.getKeybinds()[keyName];
		    button.keyText = this.game.add.text(185, 10 + changeY, this.game.playerManager.keybindManager.resolveActualName(keyCode), this.game.fontStyleSmall);
		    changeY += 26;
		}
		
		this.popup = this.game.add.graphics();
		this.popup.beginFill(0x000080);
		this.popup.lineStyle(4, 0xffd900, 1)
		this.popup.drawRect(0, 0, 1152, 648);
		this.popup.alpha = 0.5;
		this.popup.endFill();
		this.popup.inputEnabled = true;
		this.popup.input.priority = 1;
		this.popupText = this.game.add.text((this.camera.x + this.camera.width) / 2, (this.camera.y + this.camera.height) / 2 - 100, "Press a button (A-Z, 0-9, or arrow keys) to assign a new key", this.game.fontStyle);
		this.popupText.anchor.setTo(.5);
		this.popup.kill();
		this.popupText.kill();
    },
    goBack: function(){
       this.game.state.start("Ship"); 
    },
    getNewKey: function(button) {
    	this.popup.revive();
    	this.popupText.revive();
    	var that = this;
    	window.addEventListener("keydown", function keybindKeypress(event) {
    		var keyCode = event.keyCode;
    		//Converts to uppercase
    		if(keyCode >= 97 && keyCode <= 122) {
    			keyCode -= 32;
    		}
    		if(that.game.playerManager.keybindManager.isValid(keyCode)) {
	    		if(that.game.playerManager.keybindManager.keyCodeAlreadyInUse(keyCode)) {
	    			that.game.notifier.notify("That key is already in use");
	    		} else {
		    		that.game.playerManager.keybindManager.changeKeybind(button.keyName, keyCode);
				    button.keyText.text = that.game.playerManager.keybindManager.resolveActualName(keyCode);
	    		}
    		} else {
    			that.game.notifier.notify("That key is not valid");
    		}
    		that.popupText.kill();
    		that.popup.kill();
    		window.removeEventListener("keydown", keybindKeypress);
    	});
    }
    
}
