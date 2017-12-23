function ship() {
    
}
ship.prototype = {
    create: function(){
        var viewMainBtn = this.game.add.button(10,10,"button",this.goToMain);
        var viewMainTxt = this.game.add.text(viewMainBtn.x,viewMainBtn.y,"Main Menu",this.game.fontStyle);
        
        var viewAxesBtn = this.game.add.button(250,10,"button",this.viewAxes);
        var viewAxesTxt = this.game.add.text(viewAxesBtn.x,viewAxesBtn.y,"View Axes",this.game.fontStyle);
        
        var saveGameBtn = this.game.add.button(490,10,"button",this.saveGame, this);
        var saveGameTxt = this.game.add.text(saveGameBtn.x,saveGameBtn.y,"Save Game",this.game.fontStyle);
        
        var keyBindBtn = this.game.add.button(730,10,"button",this.goToKeyBinds);
        var keyBindTxt = this.game.add.text(keyBindBtn.x,keyBindBtn.y,"Key Binds",this.game.fontStyle);
        for(var i = 0; i < 3; i++) {
            var button = this.add.button(50 + i * 250,100,"button",this.beamToPlanet);
            button.planetIndex = i;
            button.scale.setTo(.25,1.5);
            this.game.add.text(50 + i * 250,150,"enemies: " + this.game.playerManager.planetSet.planets[i].numberOfEnemies + " \ntrees: " + this.game.playerManager.planetSet.planets[i].numberOfTrees,this.game.fontStyle);
            
        }
        viewMainBtn.scale.setTo(.25);
        viewAxesBtn.scale.setTo(.25);
        saveGameBtn.scale.setTo(.25);
        keyBindBtn.scale.setTo(.25);
    },// functions that the buttons will be using
    beamToPlanet: function(button){
        this.game.state.start("TheGame", true, false, button.planetIndex);
    },
    viewAxes: function(){
        this.game.state.start("AxeMenu");
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
       this.game.state.start("GameTitle"); 
    },
    goToKeyBinds: function(){
        this.game.state.start("EditKeybinds");
    }
    
}
