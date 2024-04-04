function ParticleSystem() {
    this.particles = []
}

ParticleSystem.prototype.update = function() {
    var i = 0;
    while (i < this.particles.length) {
        this.particles[i].update();

        if (this.particles[i].isMarkedForDeletion())
            this.particles.splice(i, 1);
        else
            i++;
    }
}

ParticleSystem.prototype.draw = function() {
    for (var i = 0; i < this.particles.length; i++)
        this.particles[i].draw();
}

ParticleSystem.prototype.isMarkedForDeletion = function() {
    return this.particles.length == 0;
}

ParticleSystem.prototype.add = function(particle) {
    this.particles.push(particle);
}