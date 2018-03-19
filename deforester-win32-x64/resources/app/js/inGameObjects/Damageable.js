function Damageable(game) {
	this.game = game;
	this.stats = {
		"health": 20,
		"maxHealth": 20
	}
	this.dots = [];
	this.startDOTLoop();
}

Damageable.prototype.setMaxHealth = function(num) {
	this.stats["maxHealth"] = num;
}

Damageable.prototype.setHealthToMax = function() {
	this.stats["health"] = this.stats["maxHealth"];
}

Damageable.prototype.getHealth = function() {
	return this.stats["health"];
}

Damageable.prototype.getMaxHealth = function() {
	return this.stats["maxHealth"];
}
//will return true if dead
Damageable.prototype.changeHealth = function(change, actor) {
	if(this.stats["health"] == 0) {
		return false;
	}
	if(this.stats["health"] + change > this.stats["maxHealth"]) {
		this.stats["health"] = this.stats["maxHealth"];
	} else if(this.stats["health"] + change < 0) {
		this.stats["health"] = 0;
	} else {
		this.stats["health"] += change;
	}
	if(this.stats["health"] == 0) {
		this.hasDied();
		return true;
	}
	return false;
}

Damageable.prototype.applyDOT = function(id, damagePerSecond, length) {
	this.dots.forEach(function(dot) {
		if(dot.id == id) {
			dot.damagePerSecond = damagePerSecond;
			dot.length = length;
			return;
		}	
	}, this);
	this.dots.push({"id": id, "damagePerSecond": damagePerSecond, "length": length});
}

Damageable.prototype.startDOTLoop = function() {
	var timer = this.game.time.create(false);

    timer.loop(200, function() {
		for(var i = 0; i < this.dots.length; i++) {
			this.changeHealth(-this.dots[i].damagePerSecond / 5);
			if(this.dots[i].length != "forever") {
				this.dots[i].length -= 200;
				if(this.dots[i].length <= 0) {
					this.dots.splice(i--, 1);
				}
			}
		}
	}, this);
	
	timer.start();
}

Damageable.prototype.hasTakenDamage = function() {
	return this.getHealth() < this.getMaxHealth();
}

//this need to be implemented by the object
Damageable.prototype.hasDied = function() {
	
}