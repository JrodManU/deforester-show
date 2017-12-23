function boot() {}

boot.prototype = {
    preload: function() {
        this.game.load.image("loadingBar", "../assets/loadingBar.png");
        this.game.load.json("axeUpgrades", "assets/upgrades/AxeUpgrades.json");
    },
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start("Preload");
    }
}