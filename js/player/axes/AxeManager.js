function AxeManager(game) {
	this.game = game;
	this.presets;
	this.numberOfPresets = 6;
	this.create();
}

AxeManager.prototype.create = function() {
	this.presets = new Array(this.numberOfPresets);
	for(var i = 0; i < this.numberOfPresets; i++) {
		this.presets[i] = new AxePreset(this.game, "Preset " + (i + 1));
	}
}

AxeManager.prototype.newAxe = function(presetIndex) {
	return this.presets[presetIndex].createPlayerAxe();
}

AxeManager.prototype.loadSaveData = function(saveData) {
	for(var i = 0; i < saveData.presetsData.length; i++) {
		this.presets[i].loadSaveData(saveData.presetsData[i]);
	}
}

AxeManager.prototype.getSaveData = function() {
	var dataList = [];
	this.presets.forEach(function(preset) {
		dataList.push(preset.getSaveData());
	}, this);
	return {"presetsData": dataList};
}