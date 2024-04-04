function Widget() {}

Widget.prototype.update = function() {}
Widget.prototype.draw = function() {}


function HealthBar(entity, offset, width, height, healthColor, noHealthColor, strokeColor, strokeWeightValue) {
    this.entity = entity;
    this.offset = offset;
    this.width = width;
    this.height = height;
    this.healthColor = healthColor;
    this.noHealthColor = noHealthColor;
    this.strokeColor = strokeColor;
    this.strokeWeightValue = strokeWeightValue;
}

HealthBar.prototype = Object.create(Widget.prototype);
Object.defineProperty(HealthBar.prototype, "constructor", { value: HealthBar, enumerable: false, writable: true });

HealthBar.prototype.draw = function(alpha=255) {
    push();
    translate(this.entity.location.x + this.offset.x, this.entity.location.y + this.offset.y);
    noFill();
    stroke(changeAlpha(this.strokeColor, alpha));
    strokeWeight(this.strokeWeightValue);
    rect(0, 0, this.width, this.height);

    strokeWeight(0);

    fill(changeAlpha(this.noHealthColor, alpha));
    stroke(changeAlpha(this.noHealthColor, alpha));
    rect(0, 0, this.width, this.height);

    var ratio = this.entity.health / this.entity.fullHealth * this.width, centerx = ratio / 2 - this.width / 2;

    fill(changeAlpha(this.healthColor, alpha));
    stroke(changeAlpha(this.healthColor, alpha));
    rect(centerx, 0, ratio, this.height);
    pop();
}


function WeaponStatusGUI(player, width, height, fillColor, strokeColor, strokeWeightValue, extraSpace, textFill, textStroke, textStrokeWeight, textSize) {
    this.player = player;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWeightValue = strokeWeightValue;
    this.extraSpace = extraSpace;

    this.textFill = textFill;
    this.textStroke = textStroke;
    this.textStrokeWeight = textStrokeWeight;
    this.textSize = textSize;
}

WeaponStatusGUI.prototype = Object.create(Widget.prototype);
Object.defineProperty(WeaponStatusGUI.prototype, "constructor", { value: WeaponStatusGUI, enumerable: false, writable: true });

WeaponStatusGUI.prototype.draw = function() {
    push();
    translate(width - this.width / 2 - this.extraSpace, height - this.height / 2 - this.extraSpace);
    fill(this.fillColor);
    stroke(this.strokeColor);
    strokeWeight(this.strokeWeightValue);
    rect(0, 0, this.width, this.height);

    fill(this.textFill);
    stroke(this.textStroke);
    strokeWeight(this.textStrokeWeight);
    textSize(this.textSize);

    var message;

    if (this.player.weaponIndex >= this.player.weapons.length)
        message = "No Weapons Selected";
    else {
        var weapon = this.player.weapons[this.player.weaponIndex];

        if (weapon.bought && weapon.numBullets != Infinity)
            message = "Weapon: " + weapon.name + 
                        "\nAmmo: " + (weapon.reload ? "reloading..." : weapon.currentClipSize) + "/" + weapon.numBullets + "\nPress 'E' to buy more ammo\n(Cost: " 
                        + weapon.getCost() + ")";
        else if (weapon.bought)
            message = "Weapon: " + weapon.name + 
                        "\nAmmo: " + (weapon.reload ? "reloading..." : weapon.currentClipSize) + "/" + "∞";
        else
            message = "Press 'E' to buy " + weapon.name + "\n(Cost: " + weapon.getCost() + ")"
    }

    text(message, 0, -this.height / 5, this.width, this.height);
    pop();
}



function PlayerStatusGUI(player, width, height, fillColor, strokeColor, strokeWeightValue, extraSpace, textFill, textStroke, textStrokeWeight, textSize) {
    this.player = player;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWeightValue = strokeWeightValue;
    this.extraSpace = extraSpace;

    this.textFill = textFill;
    this.textStroke = textStroke;
    this.textStrokeWeight = textStrokeWeight;
    this.textSize = textSize;
}

PlayerStatusGUI.prototype = Object.create(Widget.prototype);
Object.defineProperty(PlayerStatusGUI.prototype, "constructor", { value: PlayerStatusGUI, enumerable: false, writable: true });

PlayerStatusGUI.prototype.draw = function() {
    push();
    translate(this.width / 2 + this.extraSpace, height - this.height / 2 - this.extraSpace);
    fill(this.fillColor);
    stroke(this.strokeColor);
    strokeWeight(this.strokeWeightValue);
    rect(0, 0, this.width, this.height);

    fill(this.textFill);
    stroke(this.textStroke);
    strokeWeight(this.textStrokeWeight);
    textSize(this.textSize);

    var message = "Health: " + Math.ceil(this.player.health) + "\nMoney: " + this.player.moneyCount + "\nScore: " + this.player.score;

    text(message, 0, -this.height / 5, this.width, this.height);
    pop();
}