function theGame() {};

theGame.prototype = {
	init: function(planetIndex) {
		this.game.playerManager.planetSet.selectPlanet(planetIndex);
	},
	preload: function() {

	},
	create: function() {
		this.game.currentState = this;
		//I think creating all groups created here and having them available for the update is a good idea'
		this.orbs = this.game.add.group();
		//this.updateable.add(this.orbs);
		this.orbs.enableBody = true;
		this.platforms = this.game.add.group();
		//this.updateable.add(this.platforms);
    	this.platforms.enableBody = true;
    	this.enemies = this.game.add.group();
    	//this.updateable.add(this.enemies);
    	this.enemies.enableBody = true;
    	this.trees = this.game.add.group();
    	//this.updateable.add(this.trees);
    	this.trees.enableBody = true;
    	this.projectiles = this.game.add.group();
    	//this.updateable.add(this.projectiles);
    	this.projectiles.enableBody = true;

		this.hud = new HUD(this.game);
		
		this.game.playerManager.planetSet.selectedPlanet.load(this);
		
		this.createMultiUseEmitters();
	},
	update: function() {
		this.game.physics.arcade.collide(this.bloodEmitter, this.platforms);
		this.game.physics.arcade.collide(this.woodChunkEmitter, this.platforms);
		
		this.game.playerManager.playerController.update();
		
		this.hud.update();
		
		this.enemies.callAll("object.update", "object");
		
		this.trees.callAll("object.update", "object");
		
		this.orbs.callAll("object.update", "object");
		
		this.projectiles.callAll("object.update", "object");
	},
	createMultiUseEmitters: function() {
		this.woodChunkEmitter = this.game.add.emitter(0,0, 100);
		this.woodChunkEmitter.makeParticles("woodChunk", 0, 40, true, false);
		this.woodChunkEmitter.gravity = 800;
		this.woodChunkEmitter.particleDrag.setTo(70,70);
		this.woodChunkEmitter.angularDrag = 300;
		this.woodChunkEmitter.minParticleScale = .5;
		this.woodChunkEmitter.maxParticleScale = 2;
		this.woodChunkEmitter.minParticleSpeed.setTo(-300, -300);
		this.woodChunkEmitter.maxParticleSpeed.setTo(300, 100);
		
		this.bloodEmitter = this.game.add.emitter(0,0,100);
		this.bloodEmitter.makeParticles("bloodDot", 0, 80, true, false);
		this.bloodEmitter.gravity = 1000;
		this.bloodEmitter.minParticleAlpha = .5;
		this.bloodEmitter.particleDrag.setTo(50,50);
		this.bloodEmitter.angularDrag = 80;
		this.bloodEmitter.minParticleSpeed.setTo(-100, -400);
		this.bloodEmitter.maxParticleSpeed.setTo(100, -100);
	}
}