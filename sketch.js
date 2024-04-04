var game;

function setup() {
    var canvas = createCanvas(1280, 720, P2D);
    canvas.style('display', 'block');

    textFont('Georgia');
    frameRate(1000);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(15);
    ellipseMode(CENTER);
    imageMode(CENTER);

    game = new Game();
}

function draw() {
    game.update();
    game.draw();
}

function keyPressed() {
    game.keyPressed();
}

function keyReleased() {
    game.keyReleased();
}

function mousePressed() {
    game.mousePressed();
}

function mouseReleased() {
    game.mouseReleased();
}

function mouseWheel(event) {
    game.mouseWheel(event);
}