let Entity = function() {
	Object.assign(this, {
		x: 0,
		y: 0,
		s: 1,
		color: "#777",
		friction : 0.9,
		velocity: {x: 0, y: 0},
		acl: 0.01,
		spd: 0.1,
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
		shoot(rad) {
			if(!this.lastShot) {
				this.lastShot = 10 + Math.floor(Math.random() * 16);
				rad = Math.floor(rad * 4/Math.PI) * Math.PI/4
				var bullet = new Bullet(rad, this)
				var x = this.x + (this.s - bullet.s)/2,
					y = this.y + (this.s - bullet.s)/2;
				x += Math.cos(rad); y += Math.sin(rad);
				Object.assign(bullet, {x, y});
				this.sk -= 25;
			}
		},
		alive: true,
		exp: true,
		inv: 0,
		die() {
			if(this.alive) {
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
		},
		update() {
			this.tick();
			this.forces();
			if(this.lastShot) this.lastShot--;
			if(this.inv) this.inv--;
		}
	});
};