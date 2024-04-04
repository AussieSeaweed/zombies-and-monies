function MoneyDropDef() {
    this.getAmt = function() { return 0; };

    this.getLocation = function() { return createVector(); };
    this.getVelocity = function() { return createVector(1, 0).rotate(random(TWO_PI)); };

    this.getAngle = function() { return random(TWO_PI); };
    this.getMotionDamping = function() { return 1; };
    this.getGeomObj = function() { return new GeomObj(); };

    this.getTimeLeft = function() { return 20; };
}