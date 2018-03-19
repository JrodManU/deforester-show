function KeybindManager(game) {
	this.game = game;
	this.keybinds = {};
	this.create();
}

KeybindManager.prototype.create = function() {
	this.keybinds = {
		"continueTutorial": 86,
		"exitTutorial": 67,
		"moveLeft": 65,
		"moveRight": 68,
		"jump": 32,
		"recall": 66,
		"attack": 74,
		"chop": 76,
		"preset1": 49,
		"preset2": 50,
		"preset3": 51,
		"preset4": 52,
		"preset5": 53,
		"preset6": 54
	};
	
	this.game.cache.getJSON("axeUpgrades").forEach(function(upgrade) {
    	if(upgrade.parameters.originalActivationButton) {
    		this.keybinds[upgrade.parameters.name] = upgrade.parameters.originalActivationButton;
    	}
    }, this);
}

KeybindManager.prototype.keybindExists = function(keybindName) {
	return keybindName in this.keybinds;
}

KeybindManager.prototype.getKeybinds = function() {
	return this.keybinds;
}

//literally the same thing
KeybindManager.prototype.addKeybind = function(keybindName, keyCode) {
	this.changeKeybind(keybindName, keyCode);
}

KeybindManager.prototype.changeKeybind = function(keybindName, keyCode) {
	this.keybinds[keybindName] = keyCode;
}

KeybindManager.prototype.resolveActualNameFromCode = function(keyCode) {
	if((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (keyCode >= 48 && keyCode <= 57)) {
		return String.fromCharCode(keyCode);
	} else {
		switch(keyCode) {
			case 32:
				return "SpBr";
			case 37:
				return "left";
			case 38:
				return "up";
			case 39:
				return "rght";
			case 40:
				return "down";
		}
	}
}

KeybindManager.prototype.resolveActualNameFromName = function(keybindName) {
	return this.resolveActualNameFromCode(this.getKeybind(keybindName));
}

KeybindManager.prototype.keyCodeAlreadyInUse = function(keyCode) {
	for(var key in this.keybinds) {
		if(this.keybinds[key] == keyCode) {
			return true;
		}
	}
	return false;
}

KeybindManager.prototype.isValid = function(keyCode) {
	return (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (keyCode >= 48 && keyCode <= 57) || keyCode == 32 || (keyCode >= 37 && keyCode <= 40);
}

KeybindManager.prototype.getKeybind = function(keybindName) {
	return this.keybinds[keybindName];
}

KeybindManager.prototype.loadSaveData = function(saveData) {
	this.keybinds = saveData.keybinds;
}

KeybindManager.prototype.getSaveData = function() {
	return {
		"keybinds": this.keybinds
	};
}