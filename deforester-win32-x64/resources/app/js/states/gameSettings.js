function gameSettings() {}

gameSettings.prototype = {
	init: function(starFieldPos) {
		this.starFieldPos = starFieldPos;
	},
	create: function() {
		//we have to stop the music because we cant change the volume live
		this.game.audioManager.stopMusic();
		
		this.starField = new StarField(this.game, this.starFieldPos);
		
		this.game.uiHelper.createBackButton(this.goBack, this);
		
		var maxVolume = this.game.add.text(288,100,"Master Volume",this.game.fontStyleMedium);
		this.masterBar = this.game.add.sprite(288,150,"sliderBar");
		this.masterSlider = this.game.add.sprite(288,150,"blueCircle");
		this.masterSlider.x += (this.masterBar.width - this.masterSlider.width) * this.game.audioManager.getMasterVol();
		
		this.masterSlider.inputEnabled = true;
		this.masterSlider.input.allowVerticalDrag = false;
		this.masterSlider.input.enableDrag();
		this.masterSlider.input.boundsSprite = this.masterBar;
		
		var soundFx = this.game.add.text(288, 250, "Sound Effects", this.game.fontStyleMedium);
		this.soundFxBar = this.game.add.sprite(288,300,"sliderBar");
		this.soundFxSlider = this.game.add.sprite(288,300,"blueCircle");
		this.soundFxSlider.x += (this.soundFxBar.width - this.soundFxSlider.width) * this.game.audioManager.getSoundFxVol();
		
		this.soundFxSlider.inputEnabled = true;
		this.soundFxSlider.input.allowVerticalDrag = false;
		this.soundFxSlider.input.enableDrag();
		this.soundFxSlider.input.boundsSprite = this.soundFxBar;
		
		var bgMusic = this.game.add.text(288,400,"Background Music",this.game.fontStyleMedium);
		this.bgMusicBar = this.game.add.sprite(288,450,"sliderBar");
		this.bgMusicSlider = this.game.add.sprite(288,450,"blueCircle");
		this.bgMusicSlider.x += (this.bgMusicBar.width - this.bgMusicSlider.width) * this.game.audioManager.getMusicVol();
		
		this.bgMusicSlider.inputEnabled = true;
		this.bgMusicSlider.input.allowVerticalDrag = false;
		this.bgMusicSlider.input.enableDrag();
		this.bgMusicSlider.input.boundsSprite = this.bgMusicBar;
	},
	update: function() {
		this.starField.update();
		this.game.audioManager.setMasterVol((this.masterSlider.x - this.masterBar.x) / (this.masterBar.width - this.masterSlider.width));
		this.game.audioManager.setSoundFxVol((this.soundFxSlider.x - this.soundFxBar.x) / (this.soundFxBar.width - this.soundFxSlider.width));
		this.game.audioManager.setMusicVol((this.bgMusicSlider.x - this.bgMusicBar.x) / (this.bgMusicBar.width - this.bgMusicSlider.width));
	},
	goBack: function(){
		this.game.audioManager.saveData();
		this.game.audioManager.resumeMusic();
		this.game.state.start("GameTitle", true, false, this.starField.getPos());
	}
}