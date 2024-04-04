var MAX_NOISE_OFFSET = 1000000;
var SEMIAUTOMATIC = true;
var AUTOMATIC = false;

function randint(lo, hi) {
    return Math.floor(Math.random() * (hi - lo)) + lo;
}

function randfloat(lo, hi) {
    return Math.random() * (hi - lo) + lo;
}

function sign(scalar) {
    return scalar === 0 ? 0 : (scalar < 0 ? -1 : 1);
}

function getTimeInterval() {
    var ret = 1 / frameRate();
    return ret === Infinity ? 0 : ret;
}

function Segment(p1, p2) {
    this.p1 = p1.copy();
    this.p2 = p2.copy();
}

function orientation(a, b, c) {
    var o = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    return o == 0 ? 0 : (o < 0 ? -1 : 1);
}

function getDistanceSq(a, b) {
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

function inOrder(a, b, c) {
    return getDistanceSq(a, b) + getDistanceSq(b, c) == getDistanceSq(a, c);
}

function getAngle(vec) {
    return atan2(vec.y, vec.x);
}

function intersects(a, b) {
    var o1, o2, o3, o4;

    o1 = orientation(a.p1, a.p2, b.p1);
    o2 = orientation(a.p1, a.p2, b.p2);
    o3 = orientation(b.p1, b.p2, a.p1);
    o4 = orientation(b.p1, b.p2, a.p2);

    if (o1 != o2 && o3 != o4)
        return true;

    if (!o1 && inOrder(a.p1, b.p1, a.p2))
        return true;
    if (!o2 && inOrder(a.p1, b.p2, a.p2))
        return true;
    if (!o3 && inOrder(b.p1, a.p1, b.p2))
        return true;
    if (!o4 && inOrder(b.p1, a.p2, b.p2))
        return true;

    return false;
}

function time() {
    return millis() / 1000;
}

function changeAlpha(c, a) {
    return color(red(c), green(c), blue(c), a);
}