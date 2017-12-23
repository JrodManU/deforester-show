function ButtonActivatedAddon(parameters) {
    this.buttonActivated = true;
}

ButtonActivatedAddon.prototype.applyUpgrade = function(axePreset) {
	
}

ButtonActivatedAddon.prototype.applyUpgradeAtRuntime = function(playerAxe, callback) {
	var activationKey = playerAxe.game.input.keyboard.addKey(playerAxe.game.playerManager.keybindManager.getKeybind(this.name));
    playerAxe.registerSignalBinding(activationKey.onDown.add(callback, playerAxe));
}