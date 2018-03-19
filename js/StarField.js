function StarField(game, startPos = 0) {
	this.game = game;
	this.startPos = startPos;
	this.create();
}

StarField.prototype.create = function() {
    this.speed = .25;
	this.stars1 = this.game.add.sprite(this.startPos,0,"starField");
    this.stars2 = this.game.add.sprite(this.startPos + this.stars1.width,0,"starField");
}

StarField.prototype.update = function() {
    this.stars1.x -= this.speed;
    this.stars2.x -= this.speed;
    if(this.stars2.x <= 0 && this.stars2.x > this.stars1.x) {
        this.stars1.x = this.stars2.width;
    }
    if(this.stars1.x <= 0 && this.stars1.x > this.stars2.x) {
        this.stars2.x = this.stars1.width;
    }
}

StarField.prototype.getPos = function() {
	if(this.stars1.x < this.stars2.x) {
        return this.stars1.x;
    } else {
    	return this.stars2.x;
    }
}