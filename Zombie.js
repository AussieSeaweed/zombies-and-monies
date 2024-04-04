function Zombie(zombieDef) {
    Entity.call(this, zombieDef);

    this.damage = zombieDef.getDamage();
    this.target = zombieDef.getTarget();

    this.movementSpeed = zombieDef.getMovementSpeed();
    this.movementDamping = zombieDef.getMovementDamping();
    this.maxMovementDev = zombieDef.getMaxMovementDev();
    this.movementSensitivity = zombieDef.getMovementSensitivity();
    this.meleeRange = zombieDef.getMeleeRange();
    this.attackRate = zombieDef.getAttackRate();
    this.attackSuccessRate = zombieDef.getAttackSuccessRate();

    this.lastAttack = -Infinity;
}

Zombie.prototype = Object.create(Entity.prototype);
Object.defineProperty(Zombie.prototype, "constructor", { value: Zombie, enumerable: false, writable: true });

Zombie.prototype.update = function() {
    Entity.prototype.update.call(this);
    this.updateMovement();
}

Zombie.prototype.updateMovement = function() {
    if (this.target != null) {
        var movement = p5.Vector.sub(this.target.location, this.location);

        movement.normalize().mult(this.movementSpeed * this.mass);
        movement.rotate(map(noise(time() * this.movementSensitivity + this.noiseOffset), 0, 1, -this.maxMovementDev, this.maxMovementDev));

        this.applyForce(movement);
        this.velocity.mult(this.movementDamping**getTimeInterval());
    }
}

Zombie.prototype.tryToAttackTarget = function() {
    if (!this.dead && this.target != null && dist(this.target.location.x, this.target.location.y, this.location.x, this.location.y) <= this.meleeRange && time() - this.lastAttack >= this.attackRate) {
        this.lastAttack = time();

        if (random() <= this.attackSuccessRate)
            this.target.applyDamage(this.damage);
    }
}