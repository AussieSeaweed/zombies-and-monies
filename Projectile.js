function Projectile(segment, damage, strokeColor, strokeWeightValue, totalTimeLeft) {
    this.segment = segment;
    this.damage = damage;

    this.strokeColor = strokeColor;
    this.strokeWeightValue = strokeWeightValue;

    this.totalTimeLeft = totalTimeLeft;
    this.timeLeft = totalTimeLeft;
}

Projectile.prototype.isMarkedForDeletion = function() {
    return this.timeLeft <= 0;
}

Projectile.prototype.update = function() {
    this.timeLeft = max(0, this.timeLeft - getTimeInterval());
}

Projectile.prototype.draw = function() {
    push();
    stroke(changeAlpha(this.strokeColor, map(this.timeLeft, 0, this.totalTimeLeft, 0, 255)));
    strokeWeight(this.strokeWeightValue);
    line(this.segment.p1.x, this.segment.p1.y, this.segment.p2.x, this.segment.p2.y);
    pop();
}