function preload() {}

preload.prototype = {
    preload: function() {
        var loadingBar = this.game.add.sprite(400,300, "loadingBar");
        loadingBar.anchor.setTo(.5);
        this.game.load.setPreloadSprite(loadingBar);
        this.game.load.image("sand", "../assets/sandCenter.png");
        this.game.load.image("stone", "../assets/castleCenter.png");
        this.game.load.image("box", "../assets/boxCoin.png")
        this.game.load.image("button", "../assets/button.png");
        this.game.load.image("enemy", "../assets/blockerMad.png");
        this.game.load.image("feet", "../assets/hud_x.png");
        this.game.load.image("axe", "../assets/axe.png");
        this.game.load.image("axeHead", "../assets/particleBrick2a.png");
        this.game.load.image("player", "../assets/p2_jump.png");
        this.game.load.image("tree", "../assets/cartoonTree2.png");
        this.game.load.image("trunkTile", "../assets/brickWall.png");
        this.game.load.image("treeTop", "../assets/bush.png");
        this.game.load.image("healthBar", "../assets/healthBar.png");
        this.game.load.image("expBar", "../assets/expBar.png");
        this.game.load.image("staminaBar", "../assets/staminaBar.png");
        this.game.load.image("hudBg","../assets/hudBg.png");
        this.game.load.image("hpOutline", "../assets/hpOutline.png");
        this.game.load.image("duraBar","../assets/duraBar.png");
        this.game.load.image("gemRed", "../assets/gemRed.png");
        this.game.load.image("gemYellow", "../assets/gemYellow.png");
        this.game.load.image("gemBlue","../assets/gemBlue.png");
        this.game.load.image("throwingAxe", "../assets/throwingAxe.png");
        this.game.load.image("cooldownCover", "../assets/coolDown.png");
        this.game.load.image("sRadius","../assets/radiusOfSelf.png");
        this.game.load.image("block","../assets/shield.png");
        this.game.load.image("upgradeButtonKeySquare", "../assets/upgradeButtonKeySquare.png");
        this.game.load.image("bloodDot", "../assets/particles/bloodDot.png");
        this.game.load.image("woodChunk", "../assets/particles/woodChunk.png");
        this.game.load.image("fireParticle", "../assets/particles/fireParticle.png");
        
        this.game.fontStyleSmall = {font : "bold 18px monospace", fill: "#8A8A8A", boundsAlignH: "center", boundsAlignV: "middle" };
        this.game.fontStyleMedium = {font: "bold 24px monospace", fill: "#8A8A8A", boundsAlignH: "center", boundsAlignV: "middle" };
        this.game.fontStyleLarge = { font: "bold 32px monospace", fill: "#8A8A8A", boundsAlignH: "center", boundsAlignV: "middle" };
        this.game.fontStyle = { font: "bold 32px monospace", fill: "#8A8A8A", boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: 450 };
        
        this.game.cache.getJSON("axeUpgrades").forEach(function(upgrade) {
           this.game.load.image(upgrade.parameters.name, "../assets/upgrades/" + upgrade.parameters.name + ".png"); 
        }, this);
    },
    create: function() {
        this.game.axeUpgradeManager = new AxeUpgradeManager(this.game);
        
        this.game.planetManager = new PlanetManager(this.game);
        
        this.game.upgradeButtonsEnum = {
			UNLOCKED: "unlocked",
			LOCKED: "locked",
			SELECTED: "selected"
		}
		
		this.game.tileSize = 70;
		
		if(!window.localStorage.getItem("saveStates")) {
		    window.localStorage.setItem("saveStates", "[]");
		}
		
		this.game.notifier = new Notifier(this.game);
        
        this.game.state.start("GameTitle");
    }
}