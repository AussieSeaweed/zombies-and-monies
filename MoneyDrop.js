function MoneyDrop(moneyDropDef) {
    this.amt = moneyDropDef.getAmt();

    this.location = moneyDropDef.getLocation();
    this.velocity = moneyDropDef.getVelocity();

    this.angle = moneyDropDef.getAngle();
    this.motionDamping = moneyDropDef.getMotionDamping();
    this.geomObj = moneyDropDef.getGeomObj();

    this.timeLeft = moneyDropDef.getTimeLeft();
    this.lifeTime = moneyDropDef.getTimeLeft();
}

MoneyDrop.prototype.update = function() {
    this.velocity.mult(this.motionDamping**getTimeInterval());
    this.location.add(p5.Vector.mult(this.velocity, getTimeInterval()));

    this.timeLeft = max(0, this.timeLeft - getTimeInterval());
}

MoneyDrop.prototype.isMarkedForDeletion = function() {
    return this.timeLeft <= 0;
}

MoneyDrop.prototype.draw = function() {
    push();
    translate(this.location.x, this.location.y);
    rotate(this.angle);
    this.geomObj.draw(map(this.timeLeft, 0, this.lifeTime, 0, 255, true));
    pop();
}