function UpdateAddon(parameters) {
}

UpdateAddon.prototype.applyUpgrade = function(axePreset) {

}

UpdateAddon.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	var oldAxeUpdate = playerAxe.update;
	var that = this;
	playerAxe.update = function() {
		oldAxeUpdate.call(this);
		that.axeUpdateAddition.call(that);
	}
}