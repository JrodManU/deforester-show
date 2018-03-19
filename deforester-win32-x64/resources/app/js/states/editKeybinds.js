function editKeybinds() {
    
}
editKeybinds.prototype = {
	init: function(starFieldPos) {
		this.starFieldPos = starFieldPos;
	},
    create: function(){
    	this.starField = new StarField(this.game, this.starFieldPos);
        this.game.uiHelper.createBackButton(this.goBack, this);
		
		var changeY = 0;
		var changeX = 0;
		for(var keyName in this.game.playerManager.keybindManager.getKeybinds()) {
		    this.game.add.text(70 + changeX, 27 + changeY, keyName, this.game.fontStyleSmall);
		    var button = this.game.uiHelper.createSmallButton(220 + changeX, 10 + changeY, this.getNewKey, this, this.game.playerManager.keybindManager.resolveActualNameFromName(keyName), this.game.fontStyleSmall);
		    button.keyName = keyName;
		    changeY += 59;
		    if(changeY == 59 * 10) {
		    	changeY = 0;
		    	changeX += 210;
		    }
		}
    },
    update: function() {
    	this.starField.update();	
    },
    goBack: function(){
       this.game.state.start("Ship", true, false, this.starField.getPos()); 
    },
    getNewKey: function(button) {
    	var that = this;
    	var vexWindow;
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
				    button.text.text = that.game.playerManager.keybindManager.resolveActualNameFromCode(keyCode);
	    		}
    		} else {
    			that.game.notifier.notify("That key is not valid");
    		}
    		//yes, we are using this before vex window is assigned a value in theory, but the line 65 will be called before this callback 
    		vex.close(vexWindow);
    		window.removeEventListener("keydown", keybindKeypress);
    	});
    	vexWindow = vex.dialog.alert({
		    message: 'Press a button (A-Z, 0-9, or arrow keys) to assign a new key',
		    buttons: []
		});
    }
    
}
