function boot() {}

boot.prototype = {
    preload: function() {
        electronLog("info","loading initial assets");
        //splashscreens and loading bar needed for preload
        this.game.load.image("loadingBar", "assets/loadingBar.png");
        this.game.load.image("ctmSplash", "assets/ctmSplash.png");
        this.game.load.image("wcjsSplash", "assets/wcjsSplash.png");
        //we have to load this JSON first because it tells which images to load
        this.game.load.json("axeUpgrades", "assets/upgrades/AxeUpgrades.json");
    },
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start("Preload");
    }
}