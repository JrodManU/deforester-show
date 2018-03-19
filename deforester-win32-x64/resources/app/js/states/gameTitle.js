function gameTitle() {
    this.saveStateLimit = 6;
}

gameTitle.prototype = {
    init: function(starFieldPos = 0) {
        this.starFieldPos = starFieldPos;
        electronLog("info", "done loading assets");
    },
    create: function() {
        this.starField = new StarField(this.game, this.starFieldPos);
        
        //just add some planets for the aesthetic
        for(var i = 0; i < getRandomInt(1,8); i++) {
            var planet = this.add.sprite(getRandom(0, 1152),getRandom(0, 1152),"planet");
            planet.tint = Math.random() * 0xffffff;
            planet.scale.setTo(getRandom(.1, 1));
            planet.anchor.setTo(.5);
            planet.x -= planet.width;
            planet.y -= planet.height;
        }
        
        var gameTitle = this.game.add.sprite((this.camera.x + this.camera.width) / 2, 100, "title");
        gameTitle.anchor.setTo(.5);
        gameTitle.scale.setTo(.5);
        
        this.game.uiHelper.createButton(481, 375, this.startNewGame, this, "New game", this.game.fontStyleLarge);
        this.game.uiHelper.createButton(481, 434, this.loadGame, this, "Load game", this.game.fontStyleLarge);
        this.game.uiHelper.createButton(481, 493, this.startSettings, this, "Settings", this.game.fontStyleLarge);
        this.game.uiHelper.createButton(481, 552, this.exitGame, this, "Exit Game", this.game.fontStyleLarge);
        
    },
    update: function() {
        this.starField.update();
    },
    startNewGame: function() {
        var saveStates = JSON.parse(localStorage.getItem("saveStates"));
        if(saveStates.length == this.saveStateLimit) {
            this.game.notifier.notify("You can only have " + this.saveStateLimit + " saves");
            return;
        }

        var that = this;
        vex.dialog.open({
            message: 'Please enter a name for the save (max length is 10, letters only):',
            input: [
                '<input name="saveName" type="text" required />',
            ].join(''),
            buttons: [
                $.extend({}, vex.dialog.buttons.OK, { text: 'Submit' }),
                $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
            ],
            callback: function (data) {
                if(data) {
                    if(!(data.saveName.length <= 10 && data.saveName.match(/^[A-Za-z]+$/))) {
                        that.game.notifier.notify("Invalid save name");
                        return;
                    }
                    for(var i = 0; i < saveStates.length; i++) {
                        if(saveStates[i].name == data.saveName) {
                            that.game.notifier.notify("Save name is taken");
                            return;
                        }
                    }
                    that.game.saveName = data.saveName;
                    that.game.playerManager = new PlayerManager(that.game);
                	that.game.state.start("Ship", true, false, that.starField.getPos());
                }
            }
        });
    },
    loadGame: function() {
        this.game.state.start("LoadSaveMenu", true, false, this.starField.getPos());  
    },
    startSettings: function() {
        this.game.state.start("GameSettings", true, false, this.starField.getPos());
    },
    exitGame: function(){
        require('electron').remote.app.quit();
    }
} 