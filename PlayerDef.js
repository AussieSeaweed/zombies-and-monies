function PlayerDef() {
    EntityDef.call(this);

    this.getMoneyCount = function() { return 0; }
    this.getMovementSpeed = function() { return 0; }
    this.getMovementDamping = function() { return 0; }

    this.getForward = function() { return false; }
    this.getBackward = function() { return false; }
    this.getLeftward = function() { return false; }
    this.getRightward = function() { return false; }

    this.getForwardDir = function() { return createVector(0, 1); }
    this.getBackwardDir = function() { return createVector(0, -1); }
    this.getLeftwardDir = function() { return createVector(-1, 0); }
    this.getRightwardDir = function() { return createVector(1, 0); }

    this.getWeapons = function() { return []; }
    this.getWeaponIndex = function() { return 0; }
    this.getMoneyCollectionRange = function() { return 0; }
}

PlayerDef.prototype = Object.create(EntityDef.prototype);
Object.defineProperty(PlayerDef.prototype, "constructor", { value: PlayerDef, enumerable: false, writable: true });
