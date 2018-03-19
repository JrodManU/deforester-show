 function AudioManager(game){
 	this.game = game;
 	
  this.create();
 }
 AudioManager.prototype.create = function(){
  this.sounds = {};
  this.sounds["death"] = this.game.add.audio("death");
  this.sounds["death"].volume = .1;
  this.sounds["teleportDown"] = this.game.add.audio("teleportDown");
  this.sounds["treeHit"] = this.game.add.audio("treeHit"); 
  this.sounds["enemyHit"] = this.game.add.audio("enemyHit");
  this.sounds["enemyHit"].volume = .5;
  this.sounds["buttonPress"] = this.game.add.audio("buttonPress");
  this.sounds["buttonPress"].volume = .1;
  this.sounds["axeSwing"] = this.game.add.audio("axeSwing");
  this.sounds["playerHit"] = this.game.add.audio("playerHit");
  this.sounds["questComplete"] = this.game.add.audio("questComplete");
  this.sounds["questComplete"].volume = 1.5;
  this.sounds["switch"] = this.game.add.audio("switch");
  
  this.music = this.game.add.audio("spaceBG");
  this.music.loop = true;
  
  this.masterVol = 1;
  //its loud
  this.musicVol = .2;
  this.soundFxVol =1;
  
  if(localStorage.getItem("volumeSave") === null) {
   this.saveData();
  } else {
   this.loadSaveData();
  } 
 
  this.music.play("",0,this.masterVol * this.musicVol, true);
 }
 AudioManager.prototype.setMasterVol = function(volume){
  this.masterVol = volume;
 }
 AudioManager.prototype.setMusicVol = function(volume){
  this.musicVol = volume;
 }
 AudioManager.prototype.setSoundFxVol = function(volume){
  this.soundFxVol = volume;
 }
 AudioManager.prototype.getMasterVol = function(){
  return this.masterVol;
 }
 AudioManager.prototype.getMusicVol = function(){
  return this.musicVol;
 }
 AudioManager.prototype.getSoundFxVol = function(){
  return this.soundFxVol;
 }
 AudioManager.prototype.loadSaveData = function(){
  var saveData = JSON.parse(localStorage.getItem("volumeSave"));
  this.masterVol = saveData.masterVol;
  this.musicVol = saveData.musicVol;
  this.soundFxVol = saveData.soundFxVol;
 }
 AudioManager.prototype.saveData = function(){
  var saveData = {
   "masterVol": this.masterVol,
   "musicVol": this.musicVol,
   "soundFxVol": this.soundFxVol
  };
  localStorage.setItem("volumeSave", JSON.stringify(saveData));
 }
 AudioManager.prototype.playSoundFx = function(soundName){
  var sound = this.sounds[soundName];
  sound.play("", 0 , sound.volume * this.masterVol * this.soundFxVol);
 }
 AudioManager.prototype.stopMusic = function() {
  this.music.stop();
 }
 AudioManager.prototype.resumeMusic = function() {
  this.music.play("", this.music.stopTime, this.masterVol * this.musicVol, true, true);
 }