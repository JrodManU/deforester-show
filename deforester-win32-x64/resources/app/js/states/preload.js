function preload() {}

preload.prototype = {
    preload: function() {
        electronLog("info","loading the rest of the assets");
        
        var wcjsSplash = this.game.add.sprite(0,0, "wcjsSplash");
        var ctmSplash = this.game.add.sprite(0,0, "ctmSplash");
        var loadingBar = this.game.add.sprite(276,630, "loadingBar");
        this.game.load.setPreloadSprite(loadingBar);
        
        this.game.load.onFileComplete.add(function() {
            if(this.game.load.progress > 70) {
                ctmSplash.destroy();
            }
        }, this);
        
        this.game.load.image("title", "assets/title1.jpg");
        this.game.load.spritesheet("blueButton", "assets/uiButtons/blueButton.png", 190, 49, 3);
        this.game.load.spritesheet("blueButtonSmall", "assets/uiButtons/blueButtonSmall.png", 49, 49, 3);
        this.game.load.image("planet", "assets/356Circle.png");
        this.game.load.image("healthBar", "assets/HUD/healthBar.png");
        this.game.load.image("expBar", "assets/HUD/expBar.png");
        this.game.load.image("staminaBar", "assets/HUD/staminaBar.png");
        this.game.load.image("hudBg","assets/HUD/hudBg.png");
        this.game.load.image("healthPickup", "assets/healthPickup.png");
        this.game.load.image("staminaPickup", "assets/staminaPickup.png");
        this.game.load.image("throwingAxe", "assets/throwingAxe.png");
        this.game.load.image("cooldownCover", "assets/coolDown.png");
        this.game.load.image("sRadius","assets/radiusOfSelf.png");
        this.game.load.image("block","assets/shield.png");
        this.game.load.image("bloodDot", "assets/particles/bloodDot.png");
        this.game.load.image("woodChunk", "assets/particles/woodChunk.png");
        this.game.load.image("fireParticle", "assets/particles/fireParticle.png");
        this.game.load.image("tree", "assets/tree.png");
        this.game.load.image("starField", "assets/background/starField.png");
        this.game.load.image("blueCircle", "assets/blue_circle.png");
        this.game.load.image("sliderBar", "assets/sliderBar.png");
        this.game.load.image("greyPanel", "assets/greyPanel.png");
        this.game.load.image("tutorialPanel", "assets/tutorialPanel.png");
        this.game.load.image("porcupineBullet", "assets/newAssets/porcupineBullet.png");
        this.game.load.image("buttonRight", "assets/uiButtons/buttonRight.png");
        this.game.load.image("buttonLeft", "assets/uiButtons/buttonLeft.png");
        this.game.load.image("hudOverlay", "assets/HUD/hudOverlay.png")
        
        this.game.load.image("dirt", "assets/blocks/dirt.jpg");
        this.game.load.image("groundLeft", "assets/blocks/groundLeft.jpg");
        this.game.load.image("groundRight", "assets/blocks/groundRight.jpg");
        this.game.load.image("platformBottom", "assets/blocks/platformBottom.jpg");
        this.game.load.image("platformLeft", "assets/blocks/platformLeft.jpg");
        this.game.load.image("platformRight", "assets/blocks/platformRight.jpg");
        this.game.load.image("platformSolo", "assets/blocks/platformSolo.jpg");
        this.game.load.image("groundRightDrop", "assets/blocks/groundRightDrop.jpg");
        this.game.load.image("groundLeftDrop", "assets/blocks/groundLeftDrop.jpg");
        this.game.load.image("groundTop", "assets/blocks/groundTop.jpg");
        this.game.load.image("groundPeak", "assets/blocks/groundPeak.jpg");
        this.game.load.image("groundMiddlePeak", "assets/blocks/groundMiddlePeak.jpg");
        
        this.game.load.image('spaceBackground', 'assets/background/spaceBackground.png');
        
        //audio files
        this.game.load.audio("death", "assets/soundEffects/DeathSound.wav");
        this.game.load.audio("teleportDown", "assets/soundEffects/teleportDown.ogg");
        this.game.load.audio("spaceBG", "assets/soundEffects/spaceMusic.mp3");
        this.game.load.audio("treeHit", "assets/soundEffects/hitTreeSound.ogg");
        this.game.load.audio("enemyHit", "assets/soundEffects/hitEnemySound.ogg");
        this.game.load.audio("buttonPress", "assets/soundEffects/buttonPressSound.ogg");
        this.game.load.audio("axeSwing", "assets/soundEffects/axeSwing.ogg");
        this.game.load.audio("playerHit", "assets/soundEffects/playerInjuredSound.ogg");
        this.game.load.audio("questComplete", "assets/soundEffects/AchieveSound.ogg");
        this.game.load.audio("switch", "assets/soundEffects/SwitchSound.ogg");
        
        this.game.load.spritesheet("player", "assets/spritesheets/player.png",200,100,19);
        this.game.load.spritesheet("playerWalk", "assets/spritesheets/playerWalk.png",200,100,4);
        this.game.load.spritesheet("porcupineEnemy", "assets/newAssets/porcupineEnemy.png",64,64,16);
        this.game.load.spritesheet("antEnemy", "assets/newAssets/antEnemy.png",64,64,11);
        
        this.game.cache.getJSON("axeUpgrades").forEach(function(upgrade) {
           this.game.load.image(upgrade.parameters.name, "assets/upgrades/" + upgrade.parameters.name + ".png"); 
        }, this);
        
        this.game.load.json("quests", "assets/quests/quests.json");
        this.game.load.json("tutorials", "assets/tutorials.json");
    },
    create: function() {
        this.game.axeUpgradeManager = new AxeUpgradeManager(this.game);
        
        this.game.planetManager = new PlanetManager(this.game);
        
        this.game.audioManager = new AudioManager(this.game);
        
        this.game.uiHelper = new UIHelper(this.game);
        
        this.game.upgradeButtonsEnum = {
			UNLOCKED: "unlocked",
			LOCKED: "locked",
			SELECTED: "selected"
		}
		
		this.game.fontStyleSmall = {font : "bold 18px courier", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle" };
        this.game.fontStyleMedium = {font: "bold 24px courier", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle" };
        this.game.fontStyleLarge = { font: "bold 32px courier", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle" };
		
		this.game.tileSize = 64;
		
		if(!window.localStorage.getItem("saveStates")) {
		    window.localStorage.setItem("saveStates", "[]");
		}
		
		this.game.notifier = new Notifier(this.game);
        
        this.game.state.start("GameTitle");
    }
}