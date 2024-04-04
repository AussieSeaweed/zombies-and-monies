function Entity(entityDef) {
    this.entityDef = entityDef;

    this.health = entityDef.getHealth();
    this.fullHealth = entityDef.getFullHealth();
    this.healthBar = entityDef.getHealthBar(this);
    this.mass = entityDef.getMass();

    this.location = entityDef.getLocation();
    this.velocity = entityDef.getVelocity();
    this.acceleration = entityDef.getAcceleration();
    this.maxSpeed = entityDef.getMaxSpeed();

    this.angle = entityDef.getAngle();
    this.angularVelocity = entityDef.getAngularVelocity();
    this.angularAcceleration = entityDef.getAngularAcceleration();
    this.maxAngularSpeed = entityDef.getMaxAngularSpeed();
    this.numBloodParticles = entityDef.getNumBloodParticles();
    this.bloodSpeedFunction = entityDef.bloodSpeedFunction;
    this.fadeOutTime = entityDef.getFadeOutTime();
    this.fadeOutTimeLeft = entityDef.getFadeOutTime();

    this.geomObj = entityDef.getGeomObj();

    this.noiseOffset = Math.random() * MAX_NOISE_OFFSET;
    this.dead = false;
    this.deathTime = -1;
}

Entity.prototype.update = function() {
    this.updatePhysics();
    this.geomObj.update();

    if (this.healthBar != null) this.healthBar.update();
    if (this.health <= 0 && !this.dead) { this.dead = true; this.deathTime = time(); }
    if (this.dead) { this.fadeOutTimeLeft = max(0, this.fadeOutTimeLeft - getTimeInterval()); }
}

Entity.prototype.updatePhysics = function() {
    this.velocity.add(p5.Vector.mult(this.acceleration, getTimeInterval()));
    this.acceleration.mult(0);
    this.velocity.limit(this.maxSpeed);
    this.location.add(p5.Vector.mult(this.velocity, getTimeInterval()));
    
    this.angularVelocity += this.angularAcceleration * getTimeInterval();
    this.angularAcceleration = 0;
    this.angularVelocity = sign(this.angularVelocity) * min(abs(this.angularVelocity), this.maxAngularSpeed);
    this.angle += this.angularVelocity * getTimeInterval();
}

Entity.prototype.applyForce = function(force) {
    this.acceleration.add(p5.Vector.div(force, this.mass));
}

Entity.prototype.applyAngularImpulse = function(angularImpulse) {
    this.angularAcceleration = angularImpulse / mass;
}

Entity.prototype.applyDamage = function(damage) {
    this.health = max(0, this.health - damage);

    var particleSystem = new ParticleSystem();

    for (var i = 0; i < this.numBloodParticles; i++)
        particleSystem.add(createBloodParticle(p5.Vector.add(this.location,
                            createVector(random(this.geomObj.width) - this.geomObj.width / 2,
                                        random(this.geomObj.height) - this.geomObj.height / 2)), this.bloodSpeedFunction()));

    return particleSystem;
}

Entity.prototype.draw = function() {
    push();
    translate(this.location.x, this.location.y);
    rotate(this.angle);
    this.geomObj.draw(this.dead ? map(this.fadeOutTimeLeft, 0, this.fadeOutTime, 0, 255, true) : 255);
    pop();

    if (this.healthBar != null) this.healthBar.draw(this.dead ? map(this.fadeOutTimeLeft, 0, this.fadeOutTime, 0, 255, true) : 255);
}

Entity.prototype.isMarkedForDeletion = function() {
    return this.dead && this.fadeOutTimeLeft <= 0;
}

Entity.prototype.getGeomObjEdges = function() {
    var edges = this.geomObj.getEdges();

    for (var i = 0; i < edges.length; i++) {
        edges[i].p1.rotate(this.angle);
        edges[i].p2.rotate(this.angle);

        edges[i].p1.x += this.location.x;
        edges[i].p1.y += this.location.y;
        edges[i].p2.x += this.location.x;
        edges[i].p2.y += this.location.y;
    }

    return edges;
}
                
Entity.prototype.intersectsProjectile = function(projectile) {
    if (this.dead) return false;
    var edges = this.getGeomObjEdges();

    for (var i = 0; i < edges.length; i++) {
        if (intersects(edges[i], projectile.segment)) {
            return true;
        }
    }

    return false;
}