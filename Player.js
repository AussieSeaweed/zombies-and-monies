function Player(playerDef) {
    Entity.call(this, playerDef);

    this.moneyCount = playerDef.getMoneyCount();
    this.movementSpeed = playerDef.getMovementSpeed();
    this.movementDamping = playerDef.getMovementDamping();

    this.forward = playerDef.getForward();
    this.backward = playerDef.getBackward();
    this.leftward = playerDef.getLeftward();
    this.rightward = playerDef.getRightward();

    this.forwardDir = playerDef.getForwardDir();
    this.backwardDir = playerDef.getBackwardDir();
    this.leftwardDir = playerDef.getLeftwardDir();
    this.rightwardDir = playerDef.getRightwardDir();

    this.weapons = playerDef.getWeapons();
    this.weaponIndex = playerDef.getWeaponIndex();
    this.moneyCollectionRange = playerDef.getMoneyCollectionRange();

    this.score = 0;
}

Player.prototype = Object.create(Entity.prototype);
Object.defineProperty(Player.prototype, "constructor", { value: Player, enumerable: false, writable: true });

Player.prototype.update = function(mouseLocation) {
    Entity.prototype.update.call(this);
    this.angle = getAngle(p5.Vector.sub(mouseLocation, this.location));
    this.updateMovement();
    if (this.weapons.length > 0) this.weapons[this.weaponIndex].update(this.location, this.angle);
}

Player.prototype.draw = function() {
    Entity.prototype.draw.call(this);
    if (this.weapons.length > 0) this.weapons[this.weaponIndex].draw();
}

Player.prototype.updateMovement = function() {
    var movement = createVector();

    if (this.forward) movement.add(this.forwardDir);
    if (this.backward) movement.add(this.backwardDir);
    if (this.leftward) movement.add(this.leftwardDir);
    if (this.rightward) movement.add(this.rightwardDir);

    movement.normalize().mult(this.movementSpeed * this.mass);

    this.applyForce(movement);
    this.velocity.mult(this.movementDamping**getTimeInterval());
}

Player.prototype.setActive = function(active) {
    if (this.weaponIndex < this.weapons.length)
        this.weapons[this.weaponIndex].setActive(active);
}

Player.prototype.beginReload = function() {
    if (this.weaponIndex < this.weapons.length)
        this.weapons[this.weaponIndex].beginReload();
}

Player.prototype.getNextWeapon = function() {
    if (this.weapons.length > 0) {
        this.weapons[this.weaponIndex].setActive(false);
        this.weapons[this.weaponIndex].endReload();
        this.weaponIndex = (this.weaponIndex + 1) % this.weapons.length;
    }
}

Player.prototype.getPrevWeapon = function() {
    if (this.weapons.length > 0) {
        this.weapons[this.weaponIndex].setActive(false);
        this.weapons[this.weaponIndex].endReload();
        this.weaponIndex = (this.weaponIndex - 1 + this.weapons.length) % this.weapons.length;
    }
}

Player.prototype.canCollectMoney = function(money) {
    return dist(this.location.x, this.location.y, money.location.x, money.location.y) <= this.moneyCollectionRange;
}

Player.prototype.buyCurrentWeapon = function() {
    if (this.weaponIndex < this.weapons.length) {
        var cost = this.weapons[this.weaponIndex].getCost();
        
        if (cost <= this.moneyCount) {
            this.moneyCount -= cost;
            this.weapons[this.weaponIndex].buy();
        }
    }
}
