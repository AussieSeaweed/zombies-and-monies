function Env(game) {
    this.game = game;
    this.gameOver = false;

    this.deathScreenTransitionTime = 0.5;
    this.deathScreenBackgroundColor = color(255, 0, 0);
    this.deathScreenBackgroundTargetAlphaValue = 150;
    this.deathTime = -Infinity;

    this.fadingProjectiles = [];
    this.projectiles = [];
    this.moneyDrops = [];
    this.particleSystems = [];
    this.startTime = time();
    this.numZombies = 20;
    this.zombies = [];

    this.moneyDropDef = new MoneyDropDef();
    this.moneyDropDef.getMotionDamping = function() { return 0.0005; }
    this.moneyDropDef.getVelocity = function() { return createVector(500, 0).rotate(random(TWO_PI)); };
    this.moneyDropDef.getGeomObj = function() { return new RectObj(20, 10, color(18, 85, 43), color(0), 2); }
    this.moneyDropDef.getAmt = (function() {
        var difficulty = randomGaussian() * (time() - this.startTime);
        return ceil(map(difficulty, 0, 600, 50, 1000, true));
    }).bind(this);

    this.createPlayer();
    this.spawnZombies(this.numZombies);

    this.weaponStatusGUI = new WeaponStatusGUI(this.player, 200, 200, color(1, 100), color(0), 3, 50, color(255), color(0), 3, 15);
    this.playerStatusGUI = new PlayerStatusGUI(this.player, 200, 200, color(1, 100), color(0), 3, 50, color(255), color(0), 3, 25);

    this.backgroundCellWidth = 200;
    this.backgroundCellHeight = 200;
    this.backgroundFillColor = color(255);
    this.backgroundStrokeColor = color(100);
    this.backgroundStrokeWeightValue = 3;
}

Env.prototype.createPlayer = function() {
    this.playerDef = new PlayerDef();
    this.playerDef.getHealth = function() { return 100; }
    this.playerDef.getFullHealth = function() { return 100; }
    this.playerDef.getHealthBar = function(entity) { return new HealthBar(entity, createVector(0, 38), 60, 7, color(0, 255, 0), color(255, 0, 0), color(0), 2); }
    this.playerDef.getMovementSpeed = function() { return 2200; }
    this.playerDef.getMovementDamping = function() { return 0.001; }
    this.playerDef.getGeomObj = function() { return new RectObj(40, 40, color(255), color(0), 3); }
    this.playerDef.getMoneyCollectionRange = function() { return 50; }
    this.playerDef.getBloodSpeed = function() { return 10; }
    this.playerDef.getNumBloodParticles = function() { return 5; }

    this.playerDef.getWeapons = (function() {
        /*createWeapon(clipSize, numBullets, reloadTime, fireRate, shootingFunction,
                        range, name, symbolImage, type, cost, ammoCost, bought, accuracy)*/
        return [createWeapon(10, Infinity, 0.5, 0.1, (function(p1, p2) { this.projectiles.push(new Projectile(new Segment(p1, p2), 24, color(150, 75, 0), 2, 0.1)); }).bind(this), 
                800, "Pistol", SEMIAUTOMATIC, 0, 0, true, PI / 64), // brown
                createWeapon(30, 60, 1, 0.1, (function(p1, p2) { this.projectiles.push(new Projectile(new Segment(p1, p2), 30, color(255, 0, 0), 3, 0.05)); }).bind(this), 
                1000, "Assault Rifle", AUTOMATIC, 100, 10, false, PI / 128), // red
                createWeapon(100, 200, 2, 0.05, (function(p1, p2) { this.projectiles.push(new Projectile(new Segment(p1, p2), 30, color(255, 255, 0), 3, 0.2)); }).bind(this),
                1000, "Minigun", AUTOMATIC, 200, 20, false, PI / 48), // yellow
                createWeapon(8, 16, 2.5, 0.3, (function(p1, p2) {
                    var inaccuracy = 80, numShots = 8;

                    for (var i = 0; i < numShots; i++)
                        this.projectiles.push(new Projectile(new Segment(p1, p5.Vector.add(p2, createVector(map(randomGaussian(), -1, 1, -inaccuracy, inaccuracy),
                                                                                                            map(randomGaussian(), -1, 1, -inaccuracy, inaccuracy)))),
                                            80, color(0, 0, 255), 3, 0.2));
                }).bind(this),
                400, "Shotgun", SEMIAUTOMATIC, 200, 25, false, PI / 32), // blue
                createWeapon(20, 40, 2, 0.2, (function(p1, p2) {
                    var inaccuracy = 100, numShots = 5;

                    for (var i = 0; i < numShots; i++)
                        this.projectiles.push(new Projectile(new Segment(p1, p5.Vector.add(p2, createVector(map(randomGaussian(), -1, 1, -inaccuracy, inaccuracy),
                                                                                                            map(randomGaussian(), -1, 1, -inaccuracy, inaccuracy)))),
                                            70, color(75, 0, 130), 3, 0.2));
                }).bind(this),
                400, "Automatic Shotgun", AUTOMATIC, 300, 50, false, PI / 32), // purple
                createWeapon(10, 20, 1.5, 0.5, (function(p1, p2) { this.projectiles.push(new Projectile(new Segment(p1, p2), 1500, color(100), 5, 0.5)); }).bind(this),
                1000, "Sniper", SEMIAUTOMATIC, 500, 100, false, 0), // gray
                createWeapon(20, 40, 1.5, 0.3, (function(p1, p2) { this.projectiles.push(new Projectile(new Segment(p1, p2), 900, color(255, 127, 80), 5, 0.5)); }).bind(this),
                1000, "Automatic Sniper", AUTOMATIC, 1000, 200, false, 0), // orange
                ];
    }).bind(this);
    
    this.player = new Player(this.playerDef);
}

Env.prototype.spawnZombies = function(numEnemies) {
    this.zombieDef = new ZombieDef();

    var difficulty = randomGaussian() * (time() - this.startTime);
    var diameter = map(difficulty, 0, 180, 50, 300, true), health = map(difficulty, 0, 180, 100, 2000, true), spawnDistance = sqrt(width * width + height * height) / 2 + diameter / 2;
    var meleeRange = diameter / 2 + min(this.player.geomObj.width, this.player.geomObj.height) / 2;

    this.zombieDef.getHealth = function() { return health; }
    this.zombieDef.getFullHealth = function() { return health; }

    this.zombieDef.getDamage = function() { return map(difficulty, 0, 180, 20, 90, true); }
    this.zombieDef.getMovementSpeed = function() { return map(difficulty, 0, 180, 600, 2000, true); }

    this.zombieDef.getGeomObj = function() { return new EllipseObj(diameter, diameter, color(random(50), random(80), random(50)), color(0), 3); }
    this.zombieDef.getLocation = (function() { return p5.Vector.add(this.player.location, createVector(spawnDistance, 0).rotate(random(TWO_PI))); }).bind(this);

    this.zombieDef.getTarget = (function() { return this.player; }).bind(this);
    this.zombieDef.getHealthBar = function(entity) { return new HealthBar(entity, createVector(0, 5 * diameter / 7), 60, 7, color(0, 255, 0), color(255, 0, 0), color(0), 2); }
    this.zombieDef.getMovementDamping = function() { return 0.005; }
    this.zombieDef.getMaxMovementDev = function() { return PI / 2; }
    this.zombieDef.getMovementSensitivity = function() { return 0.1; }
    this.zombieDef.bloodSpeedFunction = function() { return random(50, 100); }
    this.zombieDef.getNumBloodParticles = function() { return 10; }
    this.zombieDef.getMeleeRange = function() { return meleeRange; }
    this.zombieDef.getAttackRate = function() { return 1; }
    this.zombieDef.getAttackSuccessRate = function() { return 0.8; }

    for (var i = 0; i < numEnemies; i++) {
        this.zombies.push(new Zombie(this.zombieDef));
    }
}

Env.prototype.update = function() {
    if (!this.gameOver) {
        for (var i = 0; i < this.projectiles.length; i++) {
            for (var j = 0; j < this.zombies.length; j++) {
                if (this.zombies[j].intersectsProjectile(this.projectiles[i])) {
                    this.particleSystems.push(this.zombies[j].applyDamage(this.projectiles[i].damage));
                }
            }

            this.fadingProjectiles.push(this.projectiles[i]);
        }

        this.projectiles = [];

        var i = 0;
        while (i < this.fadingProjectiles.length) {
            this.fadingProjectiles[i].update();

            if (this.fadingProjectiles[i].isMarkedForDeletion())
                this.fadingProjectiles.splice(i, 1);
            else
                i++;
        }

        i = 0;
        while (i < this.zombies.length) {
            this.zombies[i].update();

            if (this.zombies[i].isMarkedForDeletion()) {
                this.moneyDropDef.getLocation = (function() { return this.zombies[i].location.copy(); }).bind(this);
                this.moneyDrops.push(new MoneyDrop(this.moneyDropDef));
                this.zombies.splice(i, 1);
                this.player.score++;
            } else {
                this.zombies[i].tryToAttackTarget();
                i++;
            }
        }

        if (this.zombies.length < this.numZombies) this.spawnZombies(this.numZombies - this.zombies.length);

        i = 0;
        while (i < this.moneyDrops.length) {
            this.moneyDrops[i].update();

            if (this.player.canCollectMoney(this.moneyDrops[i])) {
                this.player.moneyCount += this.moneyDrops[i].amt;
                this.moneyDrops.splice(i, 1);
            } else if (this.moneyDrops[i].isMarkedForDeletion()) {
                this.moneyDrops.splice(i, 1);
            } else
                i++;
        }

        i = 0;
        while (i < this.particleSystems.length) {
            this.particleSystems[i].update();

            if (this.particleSystems[i].isMarkedForDeletion())
                this.particleSystems.splice(i, 1);
            else
                i++;
        }

        this.player.update(createVector(mouseX - width / 2 + this.player.location.x, -mouseY + height / 2 + this.player.location.y));

        this.weaponStatusGUI.update();
        this.playerStatusGUI.update();

        if (this.player.isMarkedForDeletion()) {
            this.gameOver = true;
            this.deathTime = time();
        }
    }
}

Env.prototype.draw = function() {
    push();
    translate(width / 2, height / 2);
    scale(1, -1);
    translate(-this.player.location.x, -this.player.location.y);
    this.drawBackground();

    for (var i = 0; i < this.moneyDrops.length; i++)
        this.moneyDrops[i].draw();

    for (var i = 0; i < this.zombies.length; i++)
        this.zombies[i].draw();

    for (var i = 0; i < this.fadingProjectiles.length; i++)
        this.fadingProjectiles[i].draw();

    this.player.draw();

    for (var i = 0; i < this.particleSystems.length; i++)
        this.particleSystems[i].draw();

    pop();

    this.weaponStatusGUI.draw();
    this.playerStatusGUI.draw();

    fill(this.game.textFillColor);
    stroke(this.game.textStrokeColor);        
    strokeWeight(this.game.textHeading3StrokeWeightValue);
    textSize(this.game.textHeading3Size);

    text("WASD: move up, left, down, right\nMouse scroll: change weapons\nR: reload", width / 2, 7 * height / 8);

    if (this.gameOver) {
        var deathScreenBackgroundColor = changeAlpha(this.deathScreenBackgroundColor, map(time() - this.deathTime, 0, this.deathScreenTransitionTime, 0, this.deathScreenBackgroundTargetAlphaValue, true));
        fill(deathScreenBackgroundColor);
        stroke(deathScreenBackgroundColor);
        strokeWeight(0);
        rect(width / 2, height / 2, width, height);

        fill(this.game.textFillColor);
        stroke(this.game.textStrokeColor);

        strokeWeight(this.game.textHeading1StrokeWeightValue);
        textSize(this.game.textHeading1Size);
        
        text("Game Over", width / 2, height / 4);

        strokeWeight(this.game.textHeading2StrokeWeightValue);
        textSize(this.game.textHeading2Size);
        text("Click anywhere to continue...", width / 2, 3 * height / 4);
    }
}

Env.prototype.drawBackground = function() {
    push();
    background(this.backgroundFillColor);
    stroke(this.backgroundStrokeColor);
    strokeWeight(this.backgroundStrokeWeightValue);

    var leftx = this.player.location.x - width / 2, rightx = this.player.location.x + width / 2,
        topy = this.player.location.y + height / 2, bottomy = this.player.location.y - height / 2;

    // drawing vertical lines

    for (var x = leftx - (leftx % this.backgroundCellWidth + this.backgroundCellWidth) % this.backgroundCellWidth; x <= rightx; x += this.backgroundCellWidth)
        line(x, topy, x, bottomy);

    // drawing horizontal lines

    for (var y = bottomy - (bottomy % this.backgroundCellHeight + this.backgroundCellHeight) % this.backgroundCellHeight; y <= topy; y += this.backgroundCellHeight)
        line(leftx, y, rightx, y);

    pop();
}

Env.prototype.keyPressed = function() {
    if (!this.gameOver) {
        if (key == "W") {
            this.player.forward = true;
        } else if (key == "S") {
            this.player.backward = true;
        } else if (key == "A") {
            this.player.leftward = true;
        } else if (key == "D") {
            this.player.rightward = true;
        } else if (key == "R") {
            this.player.beginReload();
        } else if (key == "E") {
            this.player.buyCurrentWeapon();
        }
    }
}

Env.prototype.keyReleased = function() {
    if (!this.gameOver) {
        if (key == "W") {
            this.player.forward = false;
        } else if (key == "S") {
            this.player.backward = false;
        } else if (key == "A") {
            this.player.leftward = false;
        } else if (key == "D") {
            this.player.rightward = false;
        }
    }
}

Env.prototype.mousePressed = function() {
    if (!this.gameOver) {
        this.player.setActive(true);
    } else if (time() > this.deathTime + this.deathScreenTransitionTime) {
        this.game.transition();
    }
}

Env.prototype.mouseReleased = function() {
    if (!this.gameOver) {
        this.player.setActive(false);
    }
}

Env.prototype.mouseWheel = function(event) {
    if (!this.gameOver) {
        if (event.delta > 0)
            this.player.getPrevWeapon();
        else
            this.player.getNextWeapon();
    }
}