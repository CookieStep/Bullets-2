let Chase = function() {
	Entity.call(this);
	var rad = Math.PI * 2 * Math.random();
	Object.assign(this, {
		color: "#f00",
		velocity: {x: Math.cos(rad) * this.acl, y: Math.sin(rad) * this.acl},
        xp: 50,
        acl: this.acl * 0.75,
		draw() {
            rad = Math.atan2(this.velocity.y, this.velocity.x);
			var {x, y, s} = this;
            x *= scale; y *= scale; s *= scale;
            x += s/2;
            y += s/2;
			ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(x, y, s/2, rad + Math.PI/4, rad + Math.PI * 7/4)
            ctx.lineTo(x, y);
			ctx.fill();
		},
		tick() {
			if(player.alive && distanceBetween(this, player) < 7.5) {
                rad = radianTo(this, player);
				this.velocity.x += Math.cos(rad) * this.acl;
                this.velocity.y += Math.sin(rad) * this.acl;
                this.last = 1;
			}else{
				rad = Math.atan2(this.velocity.y, this.velocity.x);
				this.velocity.x += Math.cos(rad) * this.acl;
                this.velocity.y += Math.sin(rad) * this.acl;
                this.last = 0;
			}
			this.color = `rgb(${170 + 85 * this.last}, 0, 0)`
		}
	});
};
let Shoot = function() {
	Entity.call(this);
	var rad = Math.PI * 2 * Math.random();
	Object.assign(this, {
		color: "#faa",
		velocity: {x: Math.cos(rad) * this.acl, y: Math.sin(rad) * this.acl},
        xp: 60,
		draw() {
			var s = this.s/2; x = this.x + s; y = this.y + s;
			var rad = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI/4;
			s *= scale; x *= scale; y *= scale;
			ctx.beginPath();
			s /= Math.sin(Math.PI / 4);
			var a = Math.cos(rad) * s, b = Math.sin(rad) * s;
			var c = Math.cos(rad + Math.PI/8) * s, d = Math.sin(rad + Math.PI/8) * s;
			var e = Math.cos(rad - Math.PI/8) * s, f = Math.sin(rad - Math.PI/8) * s;
			var n = 3/2;
			ctx.fillStyle = this.color;
			ctx.moveTo(x + e/n, y + f/n);
			ctx.lineTo(x + d/n, y - c/n);
			ctx.lineTo(x - a, y - b);
			ctx.lineTo(x - b, y + a);
            ctx.fill();
		},
		tick() {
			if(player.alive && distanceBetween(this, player) < 7.5) {
				if(distanceBetween(this, player) > 5) {
					rad = radianTo(this, player);
					this.velocity.x += Math.cos(rad) * this.acl;
					this.velocity.y += Math.sin(rad) * this.acl;
					rad = Math.atan2(this.velocity.y, this.velocity.x);
					this.shoot(rad)
				}else if(distanceBetween(this, player) < 2.5) {
					rad = radianTo(player, this);
					this.velocity.x += Math.cos(rad) * this.acl;
					this.velocity.y += Math.sin(rad) * this.acl;
				}else{
					this.shoot(rad)
				}
			}else{
				rad = Math.atan2(this.velocity.y, this.velocity.x);
				this.velocity.x += Math.cos(rad) * this.acl;
                this.velocity.y += Math.sin(rad) * this.acl;
			}
		}
	});
};
let Boost = function() {
	Entity.call(this);
	var rad = Math.PI * 2 * Math.random();
	Object.assign(this, {
		color: "#afa",
		velocity: {x: Math.cos(rad) * this.acl, y: Math.sin(rad) * this.acl},
		xp: 75,
		draw() {
			var {x, y, s} = this;
			x *= scale; y *= scale; s *= scale;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.square(x, y, s, s/2);
			ctx.fill();
		},
		last : 0,
		tick() {
			if(player.alive && distanceBetween(this, player) < 7.5 && !this.last) {
				rad = radianTo(this, player)
                Object.assign(this.velocity, {x: Math.cos(rad) * this.spd, y: Math.sin(rad) * this.spd});
                for(var i = 0; i < 10; i++) {
                    var particle = new Particle;
                    particle.x = this.x + (this.s - particle.s)/2;
                    particle.y = this.y + (this.s - particle.s)/2;
                    particles.push(particle);
                }
				this.last = 100;
			}else{
				rad = Math.atan2(this.velocity.y, this.velocity.x);
				this.velocity.x += Math.cos(rad) * this.acl;
				this.velocity.y += Math.sin(rad) * this.acl;
				if(this.last) --this.last;
			}
            this.color = `rgb(${170 + 0.85 * this.last}, 255, ${170 + 0.85 * this.last})`;
            this.spd = 0.1 + (this.last / 1000);
            this.spd /= easy? 2: 1
		}
	});
};
let TPatrol = function() {
	Entity.call(this);
	Object.assign(this, {
		color: "#aaa",
		xp: 50,
		goal: 0,
		tick() {
			if(this.goal) {
				--this.goal;
				this.color = `rgb(${127.5 + (100 - this.goal)/8 * 2.55}, ${127.5 + (100 - this.goal)/8 * 2.55}, ${127.5 + (100 - this.goal)/8 * 2.55})`
			}else{
				this.goal = 50 + Math.floor(Math.random() * 51);
				this.goal *= 2;
				var dis = 5;
				do{
					this.x = Math.random() * (game.width - this.s);
					this.y = Math.random() * (game.height - this.s);
				}while(distanceBetween(player, this) < dis)
			}
		},
		draw() {
			var {x, y, s} = this
			x *= scale; y *= scale; s *= scale;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.square(x, y, s, s*2/5);
			ctx.fill();
		}
	});
};
let BulletBomb = function() {
	
}