let Bullet = function(rad, parent) {
	Entity.call(this);
	this.spd *= easy? 5: 1.5;
	Object.assign(this, {
		s: 0.25,
		velocity: {x: Math.cos(rad) * this.spd, y: Math.sin(rad) * this.spd},
		tick() {
			--this.time;
			rad = Math.atan2(this.velocity.y, this.velocity.x);
		},
		draw() {
			var {x, y, s} = this;
			x *= scale; y *= scale; s *= scale/2;
			x += s; y += s;
			s /= Math.sin(Math.PI / 4);
			var a = Math.cos(rad) * s, b = Math.sin(rad) * s;
			ctx.beginPath();
			ctx.lineWidth = s/2;
			ctx.lineCap = "round";
			ctx.strokeStyle = this.color;
			ctx.moveTo(x + a, y + b);
			ctx.lineTo(x - a, y - b);
			ctx.stroke();
		},
		exp: false,
		color: parent.color,
		friction: 1,
		time: 100
	});
	bullets.push(this);
};
let EBullet = function(rad, parent) {
	Entity.call(this);
	Object.assign(this, {
		s: 0.25,
		velocity: {x: Math.cos(rad) * this.spd, y: Math.sin(rad) * this.spd},
		tick() {
			--this.alive;
			rad = Math.atan2(this.velocity.y, this.velocity.x);
		},
		die() {
			this.alive = 1;
		},
		draw() {
			var {x, y, s} = this;
			x *= scale; y *= scale; s *= scale/2;
			x += s; y += s;
			s /= Math.sin(Math.PI / 4);
			var a = Math.cos(rad) * s, b = Math.sin(rad) * s;
			ctx.beginPath();
			ctx.lineWidth = s/2;
			ctx.lineCap = "round";
			ctx.strokeStyle = this.color;
			ctx.moveTo(x + a, y + b);
			ctx.lineTo(x - a, y - b);
			ctx.stroke();
		},
		exp: false,
		color: parent.color,
		friction: 1,
		alive: 100
	});
	enemies.push(this);
};
let bullets = [];