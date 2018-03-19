function CooldownAddon(parameters) {
	this.cooldown = parameters.cooldown;
}

CooldownAddon.prototype.applyUpgrade = function(axePreset) {
	
}

CooldownAddon.prototype.applyUpgradeAtRuntime = function(playerAxe) {
	playerAxe.cooldownManager.addCooldown(this.id, this.cooldown, this.name);
}