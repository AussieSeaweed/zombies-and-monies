function ParticleDef() {
    this.getTimeLeft = function() { return 0; }
    this.getRadius = function() { return 0; }
    this.getFillColor = function() { return color(0); }
    this.getStrokeColor = function() { return color(0); };
    this.getStrokeWeightValue = function() { return 0; };

    this.getLocation = function() { return createVector(); }
    this.getVelocity = function() { return createVector(); }
    this.getAcceleration = function() { return createVector(); }

    this.getDamage = function() { return 0; }
}

ParticleDef.prototype.update = function() {
    this.velocity.add(p5.Vector.mult(this.acceleration, getTimeInterval()));
    this.location.add(p5.Vector.mult(this.velocity, getTimeInterval()));
    this.timeLeft = max(0, this.timeLeft - getTimeInterval());
}

ParticleDef.prototype.isMarkedForDeletion = function() {
    return this.timeLeft <= 0;
}

ParticleDef.prototype.draw = function() {
    push();
    translate(this.location.x, this.location.y);
    fill(color(red(this.fillColor), green(this.fillColor), blue(this.fillColor), map(this.timeLeft, 0, this.lifeTime, 0, 255)));
    stroke(color(red(this.strokeColor), green(this.strokeColor), blue(this.strokeColor), map(this.timeLeft, 0, this.lifeTime, 0, 255)));
    strokeWeight(this.strokeWeightValue);
    ellipse(0, 0, this.radius, this.radius);
    pop();
}