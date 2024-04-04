function ZombieDef() {
    EntityDef.call(this);

    this.getDamage = function() { return 0; }
    this.getTarget = function() { return null; }

    this.getMovementSpeed = function() { return 0; }
    this.getMovementDamping = function() { return 1; }
    this.getMaxMovementDev = function() { return 3 * PI / 2; }
    this.getMovementSensitivity = function() { return 1; }
    this.getMeleeRange = function() { return 0; }
    this.getAttackRate = function() { return 1; }
    this.getAttackSuccessRate = function() { return 1; }
}

ZombieDef.prototype = Object.create(EntityDef.prototype);
Object.defineProperty(ZombieDef.prototype, "constructor", { value: ZombieDef, enumerable: false, writable: true });
