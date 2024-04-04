function EntityDef() {
    this.getHealth = function() { return 0; }
    this.getFullHealth = function() { return 0; }
    this.getHealthBar = function(entity) { return null; }
    this.getMass = function() { return 1; }

    this.getLocation = function() { return createVector(); }
    this.getVelocity = function() { return createVector(); }
    this.getAcceleration = function() { return createVector(); }
    this.getMaxSpeed = function() { return Infinity; };

    this.getAngle = function() { return 0; };
    this.getAngularVelocity = function() { return 0; }
    this.getAngularAcceleration = function() { return 0; }
    this.getMaxAngularSpeed = function() { return Infinity; }
    this.bloodSpeedFunction = function() { return 0; }
    this.getNumBloodParticles = function() { return 0; }
    this.getFadeOutTime = function() { return 0.5; }

    this.getGeomObj = function() { return new GeomObj(); }
}