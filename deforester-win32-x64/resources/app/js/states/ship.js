function ship() {
}
ship.prototype = {
    init: function(starFieldPos = 0) {
        this.starFieldPos = starFieldPos;
    },
    create: function(){
        this.starField = new StarField(this.game, this.starFieldPos);
        
        this.game.uiHelper.createButton(72, 10, this.goToMain, this, "Main Menu", this.game.fontStyleLarge);
        this.game.uiHelper.createButton(272, 10, this.viewAxes, this, "View axes", this.game.fontStyleLarge);
        this.game.uiHelper.createButton(472, 10, this.saveGame, this, "Save game", this.game.fontStyleLarge);
        this.game.uiHelper.createButton(672, 10, this.goToKeyBinds, this, "Keybinds", this.game.fontStyleLarge);
        this.game.uiHelper.createButton(872, 10, this.goToQuests, this, "Quests", this.game.fontStyleLarge);
        
        for(var i = 0; i < 3; i++) {
            var button = this.add.button(21 + i * (21 + 356) + 356/2,100 + 356/2,"planet",this.beamToPlanet);
            button.planetIndex = i;
            button.tint = Math.random() * 0xffffff;
            button.scale.setTo(getRandom(.1, 1));
            button.anchor.setTo(.5);
            this.game.add.text(21 + i * (21 + 356) + 70,500,"enemies: " + this.game.playerManager.planetSet.planets[i].numberOfEnemies + " \ntrees: " + this.game.playerManager.planetSet.planets[i].numberOfTrees,this.game.fontStyleLarge);
        }
        
        this.game.playerManager.tutorialManager.tryToCreateNewTutorial("Ship");
    },
    update: function() {
        this.starField.update();
    },// functions that the buttons will be using
    beamToPlanet: function(button){
        this.game.audioManager.playSoundFx("teleportDown");
        var blowUpTween = this.game.add.tween(button.scale).to( { x: 3.5, y: 3.5 }, 1000, Phaser.Easing.Exponential.In, true);
        var that = this;
        blowUpTween.onComplete.add(function() {
           that.game.state.start("TheGame", true, false, button.planetIndex); 
        });
    },
    viewAxes: function(){
        this.game.state.start("AxeMenu", true, false, this.starField.getPos());
    },
    saveGame : function(){
        this.game.notifier.notify("Saved");
        var saveStates = JSON.parse(localStorage.getItem("saveStates"));
        for(var i = 0; i < saveStates.length; i++) {
            if(saveStates[i].name == this.game.saveName) {
                saveStates.splice(i, 1);
                break;
            }
        }
        saveStates.unshift({
                "name": this.game.saveName,
                "playerData": this.game.playerManager.getSaveData()
        });
        localStorage.setItem("saveStates", JSON.stringify(saveStates));
    },
    goToMain: function(){
       this.game.state.start("GameTitle", true, false, this.starField.getPos()); 
    },
    goToKeyBinds: function(){
        this.game.state.start("EditKeybinds", true, false, this.starField.getPos());
    },
    goToQuests: function(){
        this.game.state.start("QuestMenu", true, false, this.starField.getPos());
    }
    
}
