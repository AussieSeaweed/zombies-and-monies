function GeomObj(width, height) { this.width = width; this.height = height; }
GeomObj.prototype.update = function() {}
GeomObj.prototype.draw = function(alpha=255) {}
GeomObj.prototype.getEdges = function() { return []; }

function RectObj(width, height, fillColor, strokeColor, strokeWeightValue) {
    GeomObj.call(this, width, height);

    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWeightValue = strokeWeightValue;
}

RectObj.prototype = Object.create(GeomObj.prototype);
Object.defineProperty(RectObj.prototype, "constructor", { value: RectObj, enumerable: false, writable: true });

RectObj.prototype.draw = function(alpha=255) {
    push();
    fill(changeAlpha(this.fillColor, alpha));
    stroke(changeAlpha(this.strokeColor, alpha));
    strokeWeight(this.strokeWeightValue);
    rect(0, 0, this.width, this.height);
    pop();
}

RectObj.prototype.getEdges = function() {
    return [new Segment(createVector(this.width / 2, this.height / 2), createVector(-this.width / 2, this.height / 2)),
            new Segment(createVector(-this.width / 2, this.height / 2), createVector(-this.width / 2, -this.height / 2)),
            new Segment(createVector(-this.width / 2, -this.height / 2), createVector(this.width / 2, -this.height / 2)),
            new Segment(createVector(this.width / 2, -this.height / 2), createVector(this.width / 2, this.height / 2))];
}



function EllipseObj(width, height, fillColor, strokeColor, strokeWeightValue) {
    GeomObj.call(this, width, height);

    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWeightValue = strokeWeightValue;
}

EllipseObj.prototype = Object.create(GeomObj.prototype);
Object.defineProperty(EllipseObj.prototype, "constructor", { value: EllipseObj, enumerable: false, writable: true });

EllipseObj.prototype.draw = function(alpha=255) {
    push();
    fill(changeAlpha(this.fillColor, alpha));
    stroke(changeAlpha(this.strokeColor, alpha));
    strokeWeight(this.strokeWeightValue);
    ellipse(0, 0, this.width, this.height);
    pop();
}

EllipseObj.prototype.getEdges = function() {
    return [new Segment(createVector(this.width / 2, this.height / 2), createVector(-this.width / 2, this.height / 2)),
            new Segment(createVector(-this.width / 2, this.height / 2), createVector(-this.width / 2, -this.height / 2)),
            new Segment(createVector(-this.width / 2, -this.height / 2), createVector(this.width / 2, -this.height / 2)),
            new Segment(createVector(this.width / 2, -this.height / 2), createVector(this.width / 2, this.height / 2))];
}



function ImageObj(img, width, height) {
    GeomObj.call(this, width, height);

    this.img = img;
}

ImageObj.prototype = Object.create(GeomObj.prototype);
Object.defineProperty(ImageObj.prototype, "constructor", { value: ImageObj, enumerable: false, writable: true });

ImageObj.prototype.draw = function(alpha=255) {
    push();
    tint(255, alpha);
    image(this.img, this.width, this.height);
    pop();
}

ImageObj.prototype.getEdges = function() {
    return [new Segment(createVector(this.width / 2, this.height / 2), createVector(-this.width / 2, this.height / 2)),
            new Segment(createVector(-this.width / 2, this.height / 2), createVector(-this.width / 2, -this.height / 2)),
            new Segment(createVector(-this.width / 2, -this.height / 2), createVector(this.width / 2, -this.height / 2)),
            new Segment(createVector(this.width / 2, -this.height / 2), createVector(this.width / 2, this.height / 2))];
}