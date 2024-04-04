function Weapon(weaponDef) {
    this.clipSize = weaponDef.getClipSize();
    this.currentClipSize = weaponDef.getCurrentClipSize();
    this.numBullets = weaponDef.getNumBullets();
    this.reloadTime = weaponDef.getReloadTime();
    this.fireRate = weaponDef.getFireRate();
    this.shootingFunction = weaponDef.shootingFunction;
    this.range = weaponDef.getRange();
    this.name = weaponDef.getName();

    this.type = weaponDef.getType();
    this.cost = weaponDef.getCost();
    this.ammoCost = weaponDef.getAmmoCost();
    this.bought = weaponDef.getBought();
    this.accuracy = weaponDef.getAccuracy();

    this.lastAttack = -Infinity;
    this.lastReload = -Infinity;
    this.reload = false;
    this.active = false;

    this.noiseOffset = Math.random() * MAX_NOISE_OFFSET;
}

Weapon.prototype.isReadyToAttack = function() {
    if (this.reload === true) return false;
    var t = time();
    if (t - this.lastAttack >= this.fireRate && this.active && this.currentClipSize > 0) {
        this.lastAttack = t;
        return true;
    }
    return false;
}

Weapon.prototype.checkForReload = function() {
    if (this.reload === true) {
        var t = time();
        if (t - this.lastReload >= this.reloadTime) {
            this.reload = false;
            this.lastReload = t;
            var delta = min(this.numBullets, this.clipSize - this.currentClipSize);
            this.currentClipSize += delta;
            this.numBullets -= delta;
        }
    } else if (this.currentClipSize === 0 && this.numBullets > 0) {
        this.beginReload();
    }
}

Weapon.prototype.beginReload = function() {
    if (this.numBullets > 0 && this.currentClipSize < this.clipSize) {
        this.reload = true;
        this.lastReload = time();
    }
}

Weapon.prototype.endReload = function() {
    this.reload = false;
    this.lastReload = -Infinity;
}

Weapon.prototype.setActive = function(active) {
    this.active = active;
}

Weapon.prototype.update = function(pt, angle) {
    if (this.bought) {
        var targetLocation = createVector(1, 0).rotate(map(noise(time() + this.noiseOffset), 0, 1, -this.accuracy, this.accuracy) + angle).mult(this.range).add(pt);
        if (this.isReadyToAttack()) {
            this.shootingFunction(pt, targetLocation);
            this.currentClipSize--;
            if (this.type == SEMIAUTOMATIC) this.active = false;
        }
        this.checkForReload();
    }
}

Weapon.prototype.draw = function() {

}

Weapon.prototype.getCost = function() {
    if (!this.bought)
        return this.cost;
    else
        return this.ammoCost;
}

Weapon.prototype.buy = function() {
    if (!this.bought) {
        this.bought = true;
        this.lastAttack = -Infinity;
        this.lastReload = -Infinity;
        this.reload = false;
        this.active = false;
    } else {
        this.numBullets += this.clipSize;
    }
}

function createWeapon(clipSize, numBullets, reloadTime, fireRate, shootingFunction, range, name, type, cost, ammoCost, bought, accuracy) {
    var weaponDef = new WeaponDef();

    weaponDef.getClipSize = function() { return clipSize; }
    weaponDef.getCurrentClipSize = function() { return clipSize; }
    weaponDef.getNumBullets = function() { return numBullets; }
    weaponDef.getReloadTime = function() { return reloadTime; }
    weaponDef.getFireRate = function() { return fireRate; }
    weaponDef.shootingFunction = shootingFunction
    weaponDef.getRange = function() { return range; }
    weaponDef.getName = function() { return name; }

    weaponDef.getType = function() { return type; }
    weaponDef.getCost = function() { return cost; }
    weaponDef.getAmmoCost = function() { return ammoCost; }
    weaponDef.getBought = function() { return bought; }
    weaponDef.getAccuracy = function() { return accuracy; }

    return new Weapon(weaponDef);
}