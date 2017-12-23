function gameTitle() {
    this.saveStateLimit = 6;
}

gameTitle.prototype = {
    preload: function() {
        
    },
    create: function() {
        var gameTitle = this.game.add.text((this.camera.x + this.camera.width) / 2, 100, "Deforester", this.game.fontStyle);
        gameTitle.anchor.setTo(.5);
        

        var startNewButton = this.game.add.button((this.camera.x + this.camera.width) / 2, 400, 'button', this.startNewGame, this);
        startNewButton.anchor.setTo(.5);
        startNewButton.scale.setTo(.25);
        var startNewButtonText = this.game.add.text((this.camera.x + this.camera.width) / 2, 400, "Start New!", this.game.fontStyle);
        startNewButtonText.anchor.setTo(.5);
        
        var loadButton = this.game.add.button((this.camera.x + this.camera.width) / 2, 475, 'button', this.loadGame, this);
        loadButton.anchor.setTo(.5);
        loadButton.scale.setTo(.25);
        var loadButtonText = this.game.add.text((this.camera.x + this.camera.width) / 2, 475, "Load", this.game.fontStyle);
        loadButtonText.anchor.setTo(.5);
        
        var settingsButton = this.game.add.button((this.camera.x + this.camera.width) / 2, 550, "button", this.startSettings, this);
        settingsButton.anchor.setTo(.5);
        settingsButton.scale.setTo(.25);
        var settingsButtonText = this.game.add.text((this.camera.x + this.camera.width) / 2, 550, "Settings", this.game.fontStyle);
        settingsButtonText.anchor.setTo(.5);
        
    },
    startNewGame: function() {
        var saveStates = JSON.parse(localStorage.getItem("saveStates"));
        if(saveStates.length == this.saveStateLimit) {
            alert("You can only have " + this.saveStateLimit + " saves");
            return;
        }
        var validName = false;
        var saveName;
        while(!validName) {
            saveName = prompt("Please enter the name for the new game (max length is 10, letters only)");
            if(saveName && saveName.length <= 10 && saveName.match(/^[A-Za-z]+$/)) {
                validName = true;
                for(var i = 0; i < saveStates.length; i++) {
                    if(saveStates[i].name == saveName) {
                        validName = false;
                        break;
                    }
                }
            }
        }
        this.game.saveName = saveName;
        this.game.playerManager = new PlayerManager(this.game);
    	this.game.state.start("Ship");
    },
    loadGame: function() {
        this.game.state.start("LoadSaveMenu");  
    },
    startSettings: function() {
        this.game.state.start("GameSettings");
    }
} 