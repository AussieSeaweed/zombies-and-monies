function Particle(particleDef) {
    this.timeLeft = particleDef.getTimeLeft();
    this.lifeTime = particleDef.getTimeLeft();
    this.radius = particleDef.getRadius();
    this.fillColor = particleDef.getFillColor();
    this.strokeColor = particleDef.getStrokeColor();
    this.strokeWeightValue = particleDef.getStrokeWeightValue();

    this.location = particleDef.getLocation();
    this.velocity = particleDef.getVelocity();
    this.acceleration = particleDef.getAcceleration();

    this.damage = particleDef.getDamage();
    this.isMarkedForDeletion = particleDef.isMarkedForDeletion;
    this.update = particleDef.update;
    this.draw = particleDef.draw;
    this.startTime = time();
}

function createBloodParticle(location, speed) {
    var particleDef = new ParticleDef();
    particleDef.getLocation = function() { return location; }
    particleDef.getVelocity = function() { return createVector(1, 0).mult(speed).rotate(random(TWO_PI)); }
    particleDef.getTimeLeft = function() { return randfloat(0, 0.5); }

    particleDef.getRadius = function() { return randfloat(5, 30); }
    particleDef.getFillColor = function() { return color(randfloat(150, 255), randfloat(0, 70), randfloat(0, 70)); }
    particleDef.getStrokeWeightValue = function() { return 0; }
    particleDef.getDamage = function() { return 0; }

    return new Particle(particleDef);
}