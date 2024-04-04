function Game() {
    this.env = null;
    this.inGame = false;

    this.textHeading1Size = 90;
    this.textHeading2Size = 25;
    this.textHeading3Size = 20;
    this.textHeading1StrokeWeightValue = 7;
    this.textHeading2StrokeWeightValue = 4;
    this.textHeading3StrokeWeightValue = 3;

    this.textFillColor = color(255);
    this.textStrokeColor = color(0);

    this.transitionState = -1;
    this.transitionBeginTime = -Infinity;
    this.transitionColor = color(255);
    this.transitioningHalfTime = 0.5;
}

Game.prototype.transition = function() {
    if (this.transitionState == -1) {
        this.transitionState = 0;
        this.transitionBeginTime = time();
    }
}

Game.prototype.update = function() {
    if (this.transitionState == 0) {
        if (time() - this.transitionBeginTime >= this.transitioningHalfTime) {
            if (this.inGame)
                this.env = null;
            else
                this.env = new Env(this);

            this.inGame = !this.inGame;

            this.transitionState++;
            this.transitionBeginTime = time();
        }
    } else if (this.transitionState == 1) {
        if (time() - this.transitionBeginTime >= this.transitioningHalfTime) {
            this.transitionState = -1;
            this.transitionBeginTime = -Infinity;
        }
    } else if (this.inGame) {
        this.env.update();
    }
}

Game.prototype.draw = function() {
    if (this.inGame) {
        this.env.draw();
    } else {
        fill(this.textFillColor);
        stroke(this.textStrokeColor);

        strokeWeight(this.textHeading1StrokeWeightValue);
        textSize(this.textHeading1Size);
        
        text("Zombies and Monies", width / 2, height / 4);

        strokeWeight(this.textHeading2StrokeWeightValue);
        textSize(this.textHeading2Size);
        text("Click anywhere to start the game...", width / 2, 3 * height / 4);
    }

    if (this.transitionState == 0) {
        var transitionBackgroundColor = changeAlpha(this.transitionColor, map(time() - this.transitionBeginTime, 0, this.transitioningHalfTime, 0, 255, true));
        fill(transitionBackgroundColor);
        stroke(transitionBackgroundColor);
        strokeWeight(0);
        rect(width / 2, height / 2, width, height);
    } else if (this.transitionState == 1) {
        var transitionBackgroundColor = changeAlpha(this.transitionColor, map(time() - this.transitionBeginTime, 0, this.transitioningHalfTime, 255, 0, true));
        fill(transitionBackgroundColor);
        stroke(transitionBackgroundColor);
        strokeWeight(0);
        rect(width / 2, height / 2, width, height);
    }
}

Game.prototype.keyPressed = function() {
    if (this.inGame)
        this.env.keyPressed();
}

Game.prototype.keyReleased = function() {
    if (this.inGame)
        this.env.keyReleased();
}

Game.prototype.mousePressed = function() {
    if (this.inGame)
        this.env.mousePressed();
    else
        this.transition();
}

Game.prototype.mouseReleased = function() {
    if (this.inGame)
        this.env.mouseReleased();
}

Game.prototype.mouseWheel = function(event) {
    if (this.inGame)
        this.env.mouseWheel(event);
}