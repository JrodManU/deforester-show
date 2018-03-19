function PlayerAxeCooldownManager(game) {
	this.game = game;
	this.cooldowns = [];
}

PlayerAxeCooldownManager.prototype.create = function() {
}

PlayerAxeCooldownManager.prototype.addCooldown = function(id, length, name) {
	this.cooldowns[id] = {"length": length, "finished": true, "startTime": null};
	this.cooldowns[id].sprite = this.game.add.sprite(0,0,name);
	this.cooldowns[id].sprite.fixedToCamera = true;
	this.cooldowns[id].coverSprite = this.game.add.sprite(0,0,"cooldownCover");
	this.cooldowns[id].coverSprite.alpha = .5;
	this.cooldowns[id].sprite.addChild(this.cooldowns[id].coverSprite);
}

PlayerAxeCooldownManager.prototype.startCooldown = function(id) {
	this.cooldowns[id]["finished"] = false;
	this.cooldowns[id]["startTime"] = Date.now();
	this.cooldowns[id]["sprite"].width = 64;
	this.cooldowns[id]["wipe"] = false;
	var that = this;
	setTimeout(function() {
		that.cooldowns[id]["finished"] = true;
	}, this.cooldowns[id]["length"]);
}

PlayerAxeCooldownManager.prototype.startCooldownWithWipe = function(id) {
	this.startCooldown(id);
	this.startCooldownWipe(id);
}

PlayerAxeCooldownManager.prototype.startCooldownWipe = function(id) {
	this.cooldowns[id]["wipe"] = true;
}

PlayerAxeCooldownManager.prototype.cooldownFinished = function(id) {
	return this.cooldowns[id]["finished"];
}

PlayerAxeCooldownManager.prototype.getCooldowns = function() {
	return this.cooldowns;
}

PlayerAxeCooldownManager.prototype.deleteCooldownSprites = function() {
	this.cooldowns.forEach(function(cooldown) {
		cooldown.coverSprite.destroy();
		cooldown.sprite.destroy();
	});
}