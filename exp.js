let Particle = function() {
    Entity.call(this);
    var rad = Math.random() * Math.PI * 2;
    Object.assign(this, {
        s: 0.25,
        color: "#fff",
        velocity: {x: Math.cos(rad) * this.spd, y: Math.sin(rad) * this.spd},
        tick() {
            this.time--
        },
        time: 10 + Math.random() * 10
    })
}
let Exp = function(xp, px) {
    Entity.call(this);
    var rad = Math.random() * Math.PI * 2;
    var tx = xp + px;
    var spd = this.spd * (Math.random() * 1/4 + 1/4)
    var rs = Math.random() * Math.PI / 16;
    Object.assign(this, {
        s: 0.25,
        r: Math.random() * Math.PI * 2,
        xp, px,
        color: `hsl(${tx * 25}, 100%, 70%)`,
        velocity: {x: Math.cos(rad) * spd, y: Math.sin(rad) * spd},
        tick() {
            this.time--;
            this.r += rs;
            if(distanceBetween(player, this) < (easy? 4: 2) && player.alive) {
                var rad = radianTo(this, player);
                this.velocity.x += Math.cos(rad) * this.acl / 2;
                this.velocity.y += Math.sin(rad) * this.acl / 2;
            }
        },
        exp: false,
        draw() {
            var s = this.s/2, x = this.x + s, y = this.y + s
            s *= scale; x *= scale; y *= scale;
            ctx.beginPath();
            var a = Math.cos(this.r) * s, b = Math.sin(this.r) * s;
            ctx.fillStyle = this.color;
            ctx.moveTo(x + a, y + b);
            ctx.lineTo(x + b, y - a);
            ctx.lineTo(x - a, y - b);
            ctx.lineTo(x - b, y + a);
            ctx.fill();
        },
        time: 5000
    })
}
let exp = function(what) {
    if(what instanceof Player) {
        what.px /= 2;
        what.px += what.xp * 0.75;
        what.xp = 0;
    } if(what.xp || what.px) for(var i = 0; i < 25; i++) {
        var xp = new Exp(what.xp / 25, what.px / 25);
        xp.x = what.x + (what.s - xp.s) / 2;
        xp.y = what.y + (what.s - xp.s) / 2;
        particles.push(xp);
    } what.xp = 0; what.px = 0;
}