function WeaponDef() {
    this.getClipSize = function() { return 0; }
    this.getCurrentClipSize = function() { return 0; }
    this.getNumBullets = function() { return 0; }
    this.getReloadTime = function() { return 0; }
    this.getFireRate = function() { return 0; }
    this.shootingFunction = function(p1, p2) {}
    this.getRange = function() { return 0; }
    this.getName = function() { return ""; }

    this.getType = function() { return AUTOMATIC; }
    this.getCost = function() { return 0; }
    this.getAmmoCost = function() { return 0; }
    this.getBought = function() { return false; }
    this.getAccuracy = function() { return 0; }
}