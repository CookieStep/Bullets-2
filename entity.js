let Entity = function() {
	Object.assign(this, {
		x: 0,
		y: 0,
		s: 1,
		color: "#777",
		friction : 0.9,
		velocity: {x: 0, y: 0},
		acl: 0.01,
		spd: easy? 0.05: 0.1,
		draw() {
			var {x, y, s} = this
			x *= scale; y *= scale; s *= scale;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.square(x, y, s, s*2/5);
			ctx.fill();
		},
		tick() {},
		lastShot : 0,
		sp: 1,
		shoot(rad) {
			if(!this.lastShot) {
				if(this instanceof Player) this.lastShot = easy? 10: 15;
				else this.lastShot = easy? 150: 100;
				for(let i = 0; i < this.sp; i++) {
					//Math.PI
					//rad
					//rad - Math.PI/4
					//rad + Math.PI/4
					if(this instanceof Player) var bullet = new Bullet(rad + (i - (this.sp - 1)/2) * Math.PI/(this.sp + 1)/2, this);
					else var bullet = new EBullet(rad, this);
					var x = this.x + (this.s - bullet.s)/2,
						y = this.y + (this.s - bullet.s)/2;
					x += Math.cos(rad); y += Math.sin(rad);
					bullet.time /= Math.sqrt(this.sp);
					Object.assign(bullet, {x, y});
				}
				this.sk -= (easy? 15: 25);
			}
		},
		lastSwing: 0,
		swingRad: 0,
		slice(rad) {
			if(!this.lastSwing) {
				this.swingRad = rad - Math.PI/4;
				this.lastSwing = (easy? 15: 25);
				this.sk -= (easy? 15: 25);
			}
		},
		slash() {
			if(this instanceof Player) {
				var rad = this.swingRad + (Math.PI/2 * ((easy? 15: 25) - this.lastSwing)/(easy? 15: 25))
				for(var i = 3/4; i < 2 + (this.sp - 1)/2;i += 1/4) {
					var tip = {x: this.x + this.s * 3/8, y: this.y + this.s * 3/8, s: this.s/4}
					tip.x += Math.cos(rad) * i;
					tip.y += Math.sin(rad) * i;
					for(var enemy of enemies) {
						if(touch(tip, enemy)) enemy.die()
					}
				}
				this.lastSwing--;
			}
		},
		alive: true,
		exp: true,
		inv: 0,
		die() {
			if(this.alive && !this.inv) {
				this.alive = false;
				if(this.exp) exp(this);
				else this.time = -1;
			}
		},
		xp: 0,
		px: 0,
		forces() {
			var {spd} = this;
			var dis = distance(this.velocity.x, this.velocity.y),
				rad = Math.atan2(this.velocity.y, this.velocity.x);
			if(dis > this.spd) dis = this.spd;
			Object.assign(this.velocity, {x: Math.cos(rad) * dis, y: Math.sin(rad) * dis});
			this.x += this.velocity.x;
			this.y += this.velocity.y;
			this.velocity.x *= Math.sqrt(this.friction);
			this.velocity.y *= Math.sqrt(this.friction);
			if(this.x < 0) {
				this.x = 0;
				this.velocity.x *= -1;
				if(this.s >= 1) for(let i = 0; i < 5; i++) {
					let particle = new Particle;
					Object.assign(particle, {x: 0, y: this.y + (this.s - particle.s)/2});
					particles.push(particle);
				}
			} if(this.x > game.width - this.s) {
				this.x = game.width - this.s;
				this.velocity.x *= -1;
				if(this.s >= 1) for(let i = 0; i < 5; i++) {
					let particle = new Particle;
					Object.assign(particle, {x: game.width - particle.s, y: this.y + (this.s - particle.s)/2});
					particles.push(particle);
				}
			} if(this.y < 0) {
				this.y = 0;
				this.velocity.y *= -1;
				if(this.s >= 1) for(let i = 0; i < 5; i++) {
					let particle = new Particle;
					Object.assign(particle, {y: 0, x: this.x + (this.s - particle.s)/2});
					particles.push(particle);
				}
			} if(this.y > game.height - this.s) {
				this.y = game.height - this.s;
				this.velocity.y *= -1;
				if(this.s >= 1) for(let i = 0; i < 5; i++) {
					let particle = new Particle;
					Object.assign(particle, {y: game.height - particle.s, x: this.x + (this.s - particle.s)/2});
					particles.push(particle);
				}
			}
		},
		hitbox() {
			var {x, y, s} = this;
			x *= scale; y *= scale; s *= scale;
			ctx.lineWidth = 1;
			ctx.strokeStyle = "#faa";
			ctx.strokeRect(x, y, s ,s);
			var rad = this.swingRad + (Math.PI/2 * (25 - this.lastSwing)/25)
			for(var i = 3/4; i < 3 && this.lastSwing; i += 1/4) {
				var tip = {x: this.x + this.s * 3/8, y: this.y + this.s * 3/8, s: this.s/4}
				tip.x += Math.cos(rad) * i;
				tip.y += Math.sin(rad) * i;
				ctx.strokeRect(tip.x * scale, tip.y * scale, tip.s * scale, tip.s * scale);
			}
		},
		update() {
			if(this.lastSwing) this.slash();
			this.tick();
			this.forces();
			if(this.lastShot) this.lastShot--;
			if(this.inv) this.inv--;
		}
	});
};