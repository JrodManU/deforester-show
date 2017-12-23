function Planet(game, planetDifficulty, planetWidth, planetHeight, numberOfEnemies, platformOccuranceRate,
	numberOfTrees, passiveDamageBase, passiveDamageMax, platformSizeMin, platformSizeMax,
	treeSizeMin, treeSizeMax) {
	this.game = game;
	this.difficulty = planetDifficulty;
	this.width = planetWidth;
	this.height = planetHeight;
	this.numberOfEnemies = numberOfEnemies;
	this.platformOccuranceRate = platformOccuranceRate;
	this.numberOfTrees = numberOfTrees;
	this.passiveDamageBase = passiveDamageBase;
	this.passiveDamageMax = passiveDamageMax;
	this.platformSizeMin = platformSizeMin;
	this.platformSizeMax = platformSizeMax;
	this.treeSizeMin = treeSizeMin;
	this.treeSizeMax = treeSizeMax;
	
	this.passiveDamage = this.passiveDamageBase;
	this.currentNumberOfTrees = this.numberOfTrees;
	
	this.create();
}

Planet.prototype.create = function() {
	
}

Planet.prototype.loadSaveData = function(saveData) {
	this.difficulty = saveData.planetDifficulty;
	this.width = saveData.width;
	this.height = saveData.height;
	this.numberOfEnemies = saveData.numberOfEnemies;
	this.platformOccuranceRate = saveData.platformOccuranceRate;
	this.numberOfTrees = saveData.numberOfTrees;
	this.passiveDamageBase = saveData.passiveDamageBase;
	this.passiveDamageMultiplier = saveData.passiveDamageMultiplier;
	this.platformSizeMin = saveData.platformSizeMin;
	this.platformSizeMax = saveData.platformSizeMax;
	this.treeSizeMin = saveData.treeSizeMin;
	this.treeSizeMax = saveData.treeSizeMax;
}

Planet.prototype.getSaveData = function() {
	return {
		"difficulty": this.difficulty,
		"width": this.width,
		"height": this.height,
		"numberOfEnemies": this.numberOfEnemies,
		"platformOccuranceRate": this.platformOccuranceRate,
		"numberOfTrees": this.numberOfTrees,
		"passiveDamageBase": this.passiveDamageBase,
		"passiveDamageMultiplier": this.passiveDamageMultiplier,
		"platformSizeMin": this.platformSizeMin,
		"platformSizeMax": this.platformSizeMax,
		"treeSizeMin": this.treeSizeMin,
		"treeSizeMax": this.treeSizeMax
	};
}

Planet.prototype.load = function() {
	this.game.world.setBounds(0, 0, this.game.tileSize * this.width, this.game.tileSize * this.height);
	
	var cells = new Array(this.width);
	//creating platforms
	var platforms = new Array();
	
	//creates base and full array
	for(var i = 0; i < this.width; i++) {
		cells[i] = new Array(this.height);
		cells[i].fill("none");
		cells[i][this.height - 1] = "platform";
	}
	
	//make a terrain
	//min terrain since the top is y = 0
	var minTerrainStartHeight = Math.floor(this.height / 3 * 2);
	var maxTerrainStartHeight = this.height - 4;
	var power = getRandomInt(Math.ceil(this.width / 40), Math.floor(Math.log(this.width / 3) / Math.log(2)));
	var numberOfPoints = 1 + Math.pow(2, power);
	var roughness = getRandomInt(5, 25);
	var roughnessDecrease = getRandom(.3, .4);
	var points = new Array(numberOfPoints);
	var centerPoint = Math.floor(numberOfPoints / 2)
	points[0] = getRandomInt(minTerrainStartHeight, maxTerrainStartHeight);
	points[centerPoint] = getRandomInt(minTerrainStartHeight, maxTerrainStartHeight);
	points[numberOfPoints - 1] = getRandomInt(minTerrainStartHeight, maxTerrainStartHeight);
	for(var i = power - 1; i >= 1; i--) {
		roughness *= 1 - roughnessDecrease;
		for(var j = Math.pow(2, i - 1); j <= Math.pow(2, i - 1) + Math.pow(2, i) * (Math.pow(2, power - i) - 1); j += Math.pow(2, i)) {
			points[j] = getRandomInt(points[j - Math.pow(2, i - 1)], points[j + Math.pow(2, i - 1)]) + getRandomInt(-roughness, roughness);
			if(points[j] >= this.height) {
				points[j] = this.height - 1;
			}
		}
	}
	var num = (this.width / (points.length - 1));
	for(var i = 0; i < points.length - 1; i++) {
		var slope = (points[i] - points[i + 1])/(i * (this.width / (points.length - 1)) - (i + 1) * (this.width / (points.length - 1)));
		var yInt = (-i * (this.width / (points.length - 1))) * slope + points[i];
		for(x = i * (this.width / (points.length - 1)); x < (i + 1) * (this.width / (points.length - 1)); x++) {
			for(var y = (slope * x + yInt); y < this.height; y++) {
				cells[Math.floor(x)][Math.floor(y)] = "platform";
			}
		}
	}
	//FROM SAM: NOT TOO SURE WHERE THIS IS IMPLEMENTED FOR THE PLAYER / HOW TO DO THE SAME FOR THE ENEMY
	var playerWidth = 66;
	var playerSpeed = 500;
	var playerJumpPower = -1000;
	var playerGravity = 2000;
	//quadratic formula, there is no -4ac since the c would be 0 so it simplifies down to this
	//there is no 2 infront of gravity due to the '2a' canceling with the 1/2 from the position equation
	var airTime = -2 * playerJumpPower / playerGravity;
	//parabolas are symmetric
	var peakTime = airTime / 2;
	//uses the position equation position = initialVelocity*time + 1/2(gravity)time^2
	//multiply by negative or else it will be negative
	var maxHeight = playerJumpPower * peakTime + 1/2 * playerGravity * peakTime * peakTime * -1;
	//the player gains distance from width by doing things like standing on the edge of a platform
	//Our player is not a robot though so we shorten it
	var maxDistance = playerSpeed * airTime + playerWidth * .9;
	//Flooring this one is obvious. You can't go higher than you jump
	var depthToCheck = Math.floor(maxHeight / this.game.tileSize);
	//We have to ceil this one because if the player is able to get an piece of himself onto the platform he can make it
	var distanceToCheck = Math.ceil(maxDistance / this.game.tileSize);
	
	
	//this.height -1 is the ground, -4 leaves two spaces
	// y > -3 leaves 4 blank spots on top
	for(var proposedY = (this.height - 4); proposedY > 3; proposedY--) {
		for(var proposedX = 0; proposedX < this.width - 1; proposedX++) {
			if(getRandom(0,1) < this.platformOccuranceRate) {
				var platformLength = getRandomInt(this.platformSizeMin, this.platformSizeMax);
				var valid = true;
				//I have to subtract one from platform length because the platform includes the current x
				if(proposedX + platformLength - 1 >= this.width) {
					valid = false;
					//We have an else so the for doesn't run if it doesn't need to
				} else {
					//The adjustments allow us to have platforms on the edges
					var leftAdjustment = 0;
					var rightAdjustment = 0;
					//Again, I have to subtract one from platform length because the platform includes the current x
					if(proposedX + platformLength - 1 >= this.width - 2) {
						rightAdjustment = -1;
						if(proposedX + platformLength - 1 == this.width - 1) {
							rightAdjustment = -2;
						}
					}
					if(proposedX <= 1) {
						leftAdjustment = 1;
						if(proposedX == 0) {
							leftAdjustment = 2;
						}
					}
					for(var i = -2 + leftAdjustment; i < platformLength + 2 + rightAdjustment; i++) {
						//checks in area one past on each side and two down of the platform
						//Figure it will be quicker than another for loop, it's only 3 things anyway
						if(cells[proposedX + i][proposedY] == "platform" || cells[proposedX + i][proposedY + 1] == "platform" || cells[proposedX + i][proposedY + 2] == "platform") {
							valid = false;
						}
					}
				}
				/**
				 * If you have been keeping track, with a four block platform it would check like so
				 * XXPPPPXX
				 * XXXXXXXX
				 * XXXXXXXX
				 */
				if(valid) {
					var platX1 = proposedX;
					var platY = proposedY;
					var platX2 = proposedX + platformLength - 1;
					var reachable = false;
					//these are inclusive
					var rightCheckBound = platX2 + distanceToCheck;
					var leftCheckBound = platX1 - distanceToCheck;
					var lowerCheckBound = 0;
					for(var x = leftCheckBound; x < platX1; x++) {
						//subtract one because the tile being checked is treated as a platform, not a gap
						var difX = (platX1 - x - 1) * this.game.tileSize;
						if(difX > maxDistance / 2) {
							lowerCheckBound = Math.abs(Math.floor(
								(playerJumpPower * ((difX - .9 * playerWidth) / playerSpeed) + .5 * playerGravity * Math.pow((difX - .9 * playerWidth) / playerSpeed, 2)) / this.game.tileSize
							)) + platY - 1;
						}
						//We cannot check to the right for platforms at the same height because they might not be accessible
						//We would have already checked platforms to the left though
						for(var y = platY + 1; y <= lowerCheckBound; y++) {
							if(x >= 0 && cells[x][y] == "platform") {
								reachable = true;
								x = platX1;
							}
						}
					}
					if(reachable) {
						for(var x = rightCheckBound; x > platX2; x--) {
							//subtract one because the tile being checked is treated as a platform, not a gap
							var difX = (x - platX2 - 1) * this.game.tileSize;
							if(difX > maxDistance / 2) {
								lowerCheckBound = Math.abs(Math.floor(
									(playerJumpPower * ((difX - .9 * playerWidth) / playerSpeed) + .5 * playerGravity * Math.pow((difX - .9 * playerWidth) / playerSpeed, 2)) / this.game.tileSize
								)) + platY;
							}	
							for(var y = platY + 1; y <= lowerCheckBound; y++) {
								if(x < this.width && cells[x][y] == "platform") {
									reachable = true;
									x = platX2;
								}
							}
						}
					}
				} 
						
				if(valid && reachable) {
					platforms.push([proposedX, proposedY, platformLength]);
					for(var i = 0; i < platformLength; i++) {
						cells[proposedX + i][proposedY] = "platform";
					}
					proposedX += platformLength + 1;
				}
			}
		}
	}
	
	//If the number of platforms suck, regenerate the world!
	if(platforms.length < this.numberOfTrees) {
		this.load();
		return;
	}
	
	//create enemies
	for(var i = 0; i < this.numberOfEnemies; i++) {
		var platform = platforms[getRandomInt(0, platforms.length - 1)];
		cells[getRandomInt(platform[0], platform[0] + platform[2] -1)][platform[1] - 1] = "enemy";
	}
	
	//create trees
	//Prevent trees on the same platform
	var tempPlatforms = platforms;
	for(var i = 0; i < this.numberOfTrees; i++) {
		var platform = tempPlatforms[getRandomInt(0, platforms.length - 1)];
		cells[getRandomInt(platform[0], platform[0] + platform[2] -1)][platform[1] - 1] = "tree";
		tempPlatforms.splice(tempPlatforms.indexOf(platform), 1);
	}
	
	//Add sprites
	//points is from above where we decide the points of the terrain to make it hilly
	this.game.playerManager.createPlayerController(this.game.tileSize / 2, points[0] * this.game.tileSize - this.game.tileSize);
	
	for(var x = 0; x < this.width; x++) {
		for(var y = 0; y < this.height; y++) {
			if(cells[x][y] == "platform") {
				var platform = this.game.currentState.platforms.create(x * this.game.tileSize, y * this.game.tileSize, "stone");
				if(x + 1 >= this.width || cells[x + 1][y] == "platform") {
					platform.body.checkCollision.right = false;
				}
				if(x - 1 < 0 || cells[x - 1][y] == "platform") {
					platform.body.checkCollision.left = false;
				}
				if(y + 1 >= this.height || cells[x][y + 1] == "platform") {
					platform.body.checkCollision.down = false;
				}
				if(y - 1 < 0 || cells[x][y - 1] == "platform") {
					platform.body.checkCollision.up = false;
				}
			} else if(cells[x][y] == "enemy") {
				var enemy = new MeleeEnemy(this.game, x * this.game.tileSize, y * this.game.tileSize, cells);
				this.game.currentState.enemies.add(enemy.sprite);
				var enemy2 = new RangedEnemy(this.game, x * this.game.tileSize, y * this.game.tileSize, cells);
				this.game.currentState.enemies.add(enemy2.sprite);
			} else if(cells[x][y] == "tree") {
				var tree = new Tree(this.game, x * this.game.tileSize, y * this.game.tileSize, getRandomInt(this.treeSizeMin, this.treeSizeMax));
				this.game.currentState.trees.add(tree.sprite);
			}
		}
	}
	
	this.game.playerManager.playerController.applyDOT("passivePlanetDamage", this.passiveDamage, "forever");
	
	this.game.currentState.platforms.setAll("body.immovable", true);
	
}

Planet.prototype.treeDied = function() {
	this.currentNumberOfTrees--;
	this.passiveDamage = (this.passiveDamageMax - this.passiveDamageBase) * (1 - this.currentNumberOfTrees / this.numberOfTrees) + this.passiveDamageBase;
	this.game.playerManager.playerController.applyDOT("passivePlanetDamage", this.passiveDamage, "forever");
}