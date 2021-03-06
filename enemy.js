let touch = (obp, obj) => Math.abs(obp.x - obj.x + (obp.s - obj.s) / 2) < (obp.s + obj.s) / 2 && Math.abs(obp.y - obj.y + (obp.s - obj.s) / 2) < (obp.s + obj.s) / 2;
let distanceBetween = (obp, obj) => distance(obp.x + obp.s/2, obp.y + obp.s/2, obj.x + obj.s/2, obj.y + obj.s/2);
let radianTo = (obj, obp) => Math.atan2(obp.y - obj.y + (obp.s - obj.s) / 2, obp.x - obj.x + (obp.s - obj.s) / 2)
let enemies = [];
let Enemy = function(rad=(Math.PI * 2 * Math.random())) {
	Entity.call(this);
	Object.assign(this, {
		color: "#770",
		velocity: {x: Math.cos(rad) * this.acl, y: Math.sin(rad) * this.acl},
		xp: 10,
		draw() {
			var {x, y, s} = this;
			x *= scale; y *= scale; s *= scale;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.square(x, y, s, s/2);
			ctx.fill();
		},
		tick() {
			rad = Math.atan2(this.velocity.y, this.velocity.x);
			this.velocity.x += Math.cos(rad) * this.acl;
			this.velocity.y += Math.sin(rad) * this.acl;
		}
	});
};
let Curve = function(time=(Math.random() * 180), rad=(Math.PI * 2 * Math.random())) {
	Entity.call(this);
	Object.assign(this, {
		color: "#fa5",
		velocity: {x: Math.cos(rad) * this.acl, y: Math.sin(rad) * this.acl},
		time, xp: 15,
		tick() {
			rad = Math.atan2(this.velocity.y, this.velocity.x);
			rad += this.time++ * Math.PI / 180;
			this.velocity.x += Math.cos(rad) * this.acl;
			this.velocity.y += Math.sin(rad) * this.acl;
		},
		draw() {
			var s = this.s/2; x = this.x + s; y = this.y + s;
			this.r = rad + this.time * Math.PI / 180;
			s *= scale; x *= scale; y *= scale;
			ctx.beginPath();
			s /= Math.sin(Math.PI / 4);
			var a = Math.cos(this.r) * s, b = Math.sin(this.r) * s;
			ctx.fillStyle = this.color;
			ctx.moveTo(x + a, y + b);
			ctx.lineTo(x + b, y - a);
			ctx.lineTo(x - a, y - b);
			ctx.lineTo(x - b, y + a);
			ctx.fill();
		}
	});
};
let spawn = function(what) {
	var dis = 10 / Math.sin(Math.PI/2);
	do{
		what.x = Math.random() * (game.width - what.s);
		what.y = Math.random() * (game.height - what.s);
	}while(distanceBetween(player, what) < dis)
	enemies.push(what);
	if(what instanceof Wall) for(let a = 0; a < 2; a++) {
		let child = new WallFollow;
		child.parent = what;
		child.x = what.x;
		child.y = what.y;
		child.num = a;
		enemies.push(child);
	}
	if(what instanceof PatrolBoss) for(let a = 0; a < 4; a++) {
		let child = new Enemy(Math.PI * a/2);
		child.parent = what;
		child.color = "#faa";
		what.children.push(child);
		child.x = what.x + (what.s - child.s)/2;
		child.y = what.y + (what.s - child.s)/2;
		child.num = a;
		enemies.push(child);
	}
};
let Patrol = function(spaz) {
	Entity.call(this);
	Object.assign(this, {
		color: "#aaa",
		xp: 25,
		goal: 0,
		tick() {
			if(this.goal) {
				var rad = radianTo(this, this.loc);
				var {x, y, s} = this;
				x += this.velocity.x; y += this.velocity.y;
				var acl = distanceBetween({x, y, s}, this.loc);
				if(acl > this.acl) acl = this.acl;
				this.velocity.x += Math.cos(rad) * this.acl;
				this.velocity.y += Math.sin(rad) * this.acl;
				--this.goal;
			}else{
				this.goal = 75 + Math.floor(Math.random() * 26);
				if(spaz) this.goal -= 75
				do{
					var {x, y, s} = this;
					x += Math.random() * 10 - 5;
					y += Math.random() * 10 - 5;
				}while(x < 0 || y < 0 || x > game.width - this.s || y > game.height - this.s)
				this.loc = {x, y, s};
			}
		},
		draw() {
			var {x, y, s} = this
			x *= scale; y *= scale; s *= scale;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.square(x, y, s, s*2/5);
			ctx.fill();
			ctx.beginPath()
			var rad = radianTo(this, this.loc);
			var acl = distanceBetween(this, this.loc) / distance(4, 4);
			ctx.fillStyle = `#777`;
			x += Math.cos(rad) * s/5 * acl;
			y += Math.sin(rad) * s/5 * acl;
			ctx.square(x + s/4, y + s/4, s/2, s*1/5);
			ctx.fill();
		}
	});
};
let Wall = function() {
	Enemy.call(this);
	Object.assign(this, {
		draw() {
			var s = this.s/2; x = this.x + s; y = this.y + s;
			var rad = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI/4;
			s *= scale; x *= scale; y *= scale;
			ctx.beginPath();
			s /= Math.sin(Math.PI / 4);
			var a = Math.cos(rad) * s, b = Math.sin(rad) * s;
			ctx.fillStyle = this.color;
			ctx.moveTo(x + a, y + b);
			ctx.lineTo(x + b, y - a);
			ctx.lineTo(x - a, y - b);
			ctx.lineTo(x - b, y + a);
			ctx.fill();
		},
		xp: 40,
		color: "#559"
	});
};
let WallFollow = function() {
	Enemy.call(this);
	Object.assign(this, {
		tick() {
			var {x, y, s, r} = this.parent;
			var rad = Math.atan2(this.parent.velocity.y, this.parent.velocity.x);
			rad += Math.sign(Math.round(this.num) - 1/2) * Math.PI/2;
			var dis = 2;
			x = x + Math.cos(rad) * dis;
			y = y + Math.sin(rad) * dis;
			this.loc = {x, y, s};
			var rad = radianTo(this, this.loc);
			this.velocity.x += Math.cos(rad) * this.acl;
			this.velocity.y += Math.sin(rad) * this.acl;
		},
		xp: 20,
		draw() {
			var s = this.s/2; x = this.x + s; y = this.y + s;
			var rad = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI/4;
			s *= scale; x *= scale; y *= scale;
			ctx.beginPath();
			s /= Math.sin(Math.PI / 4);
			var a = Math.cos(rad) * s, b = Math.sin(rad) * s;
			ctx.fillStyle = this.color;
			ctx.moveTo(x + a, y + b);
			ctx.lineTo(x + b, y - a);
			ctx.lineTo(x - a, y - b);
			ctx.lineTo(x - b, y + a);
			ctx.fill();
		},
		color: "#595"
	})
};
let Dash = function() {
	Entity.call(this);
	var rad = Math.PI * 2 * Math.random();
	Object.assign(this, {
		color: "#ffa",
		velocity: {x: Math.cos(rad) * this.acl, y: Math.sin(rad) * this.acl},
		xp: 30,
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
				Object.assign(this.velocity, {x: Math.cos(rad) * this.spd, y: Math.sin(rad) * this.spd})
				this.last = 100;
			}else{
				rad = Math.atan2(this.velocity.y, this.velocity.x);
				this.velocity.x += Math.cos(rad) * this.acl;
				this.velocity.y += Math.sin(rad) * this.acl;
				if(this.last) --this.last;
			}
			this.color = `rgb(255, 255, ${1.7 * this.last})`
		}
	});
};
let PatrolBoss = function() {
	Entity.call(this);
	tip.text = "Patrol Boss";
	tip.time = 100;
	Object.assign(this, {
		color: "#f55",
		xp: 1000,
		s: 2,
		goal: 0,
		children: [],
		tele: false,
		die() {
			if(this.alive && !this.inv) {
				this.alive = false;
				if(this.exp) exp(this);
				else this.time = -1;
				var unlocks = [];
				if(!practice && !unlocked.sword) {
					unlocks.push("Skill");
					unlocked.sword = true;
					saveData.sword = true;
				} if(!easy && !unlocked.checkpoint) {
					unlocks.push("Checkpoint");
					unlocked.checkpoint = 1;
					saveData.checkpoint = 1;
				} if(insane && !unlocked.sworp) {
					unlocks.push("Powerup")
					unlocked.sworp = true;
					saveData.sworp = true;
				}
				if(unlocks.length) {
					tip.time = 100;
					tip.text = `New ${unlocks} Unlocked`
				}
			}
		},
		phase: 0,
		tick() {
			var alive = false;
			this.children.forEach((child) => {
				if(child.alive) alive = true;
			})
			if(alive) {
				this.inv = 10;
				if(this.goal) {
					var rad = radianTo(this, this.loc);
					var {x, y, s} = this;
					x += this.velocity.x; y += this.velocity.y;
					var acl = distanceBetween({x, y, s}, this.loc);
					if(acl > this.acl) acl = this.acl;
					this.velocity.x += Math.cos(rad) * this.acl;
					this.velocity.y += Math.sin(rad) * this.acl;
					--this.goal;
				}else{
					this.goal = 75 + Math.floor(Math.random() * 26) - (25 * this.phase);
					this.goal *= 4 - (this.phase);
					do{
						var {x, y, s} = this;
						x += Math.random() * 20 - 10;
						y += Math.random() * 20 - 10;
					}while(x < 0 || y < 0 || x > game.width - this.s || y > game.height - this.s)
					this.loc = {x, y, s};
				}
			}else if(!this.tele) {
				this.tele = true;
				this.goal = 0;
				this.phase = 1;
				var dis = 10 / Math.sin(Math.PI/2);
				do{
					this.x = Math.random() * (game.width - this.s);
					this.y = Math.random() * (game.height - this.s);
				}while(distanceBetween(player, this) < dis)
			}else if(this.phase == 1){
				for(let a = 1; a <= 4; a++) {
					let child = new Enemy(Math.PI * a / 2);
					child.color = "#faa"
					this.children.push(child);
					child.x = this.x + (this.s - child.s)/2;
					child.y = this.y + (this.s - child.s)/2;
					enemies.push(child);
				} this.phase++;
			}else if(this.phase == 2) {
				for(let a = 0; a < 4; a++) {
					let child = new Curve;
					child.time = 0;
					child.color = `#f55`;
					this.children.push(child);
					child.x = this.x + (this.s - child.s)/2;
					child.y = this.y + (this.s - child.s)/2;
					enemies.push(child);
				} this.phase++;
				this.tele = true;
				this.goal = 0;
				var dis = 10 / Math.sin(Math.PI/2);
				do{
					this.x = Math.random() * (game.width - this.s);
					this.y = Math.random() * (game.height - this.s);
				}while(distanceBetween(player, this) < dis)
			}else if(this.phase == 3) {
				for(let a = 1; a <= 8; a++) {
					let child = new Enemy(Math.PI / 4 * a);
					child.color = `#f55`;
					this.children.push(child);
					child.x = this.x + (this.s - child.s)/2;
					child.y = this.y + (this.s - child.s)/2;
					enemies.push(child);
				} this.phase++;
				this.tele = true;
				this.goal = 0;
				var dis = 10 / Math.sin(Math.PI/2);
				do{
					this.x = Math.random() * (game.width - this.s);
					this.y = Math.random() * (game.height - this.s);
				}while(distanceBetween(player, this) < dis)
				this.time = 0;
			}else{
				if(player.alive) {
					var rad = radianTo(player, this);
					this.velocity.x += Math.cos(rad) * this.acl;
					this.velocity.y += Math.sin(rad) * this.acl;
				}
				this.time++
				if(this.time % 500 == 0) {
					let child = new Enemy(-rad);
					child.color = `#f55`;
					child.x = this.x + (this.s - child.s)/2;
					child.y = this.y + (this.s - child.s)/2;
					enemies.push(child);
				}
				if(this.time % 500 == 250) {
					let child = new Curve;
					child.color = `#f55`;
					child.x = this.x + (this.s - child.s)/2;
					child.y = this.y + (this.s - child.s)/2;
					enemies.push(child);
				}
			}
		},
		r: 0,
		draw() {
			var {x, y, s} = this
			x *= scale; y *= scale; s *= scale;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.square(x, y, s, s*2/5);
			ctx.fill();
			ctx.beginPath();
			ctx.lineWidth = s / 16;
			ctx.strokeStyle = "#fff";
			x += s/2;
			y += s/2;
			this.r += Math.PI / 128;
			if(this.inv) {
				for(var r = 0; r < Math.PI * 2; r += Math.PI/2) {
					ctx.moveTo(x + Math.cos(this.r + r) * s, y + Math.sin(this.r + r) * s);
					ctx.lineTo(x + Math.cos(this.r - Math.PI / 16 + r) * s * 1.5, y + Math.sin(this.r - Math.PI / 16 + r) * s * 1.5);
					ctx.lineTo(x + Math.cos(this.r + Math.PI / 16 + r) * s * 1.5, y + Math.sin(this.r + Math.PI / 16 + r) * s * 1.5);
					ctx.lineTo(x + Math.cos(this.r + r) * s, y + Math.sin(this.r + r) * s);
				} ctx.stroke();
			}
			x -= s/2;
			y -= s/2;
			ctx.beginPath();
			var rad = radianTo(this, this.loc);
			var acl = distance(this.velocity.x / this.spd, this.velocity.y / this.spd);
			ctx.fillStyle = `#faa`;
			x += Math.cos(rad) * s/5 * acl;
			y += Math.sin(rad) * s/5 * acl;
			ctx.square(x + s/4, y + s/4, s/2, s*1/5);
			ctx.fill();
		}
	});
};
let Switch = function(parent) {
	Entity.call(this);
	var rad = Math.random() * 2 * Math.PI
	Object.assign(this, {
		color: "#770",
		velocity: {x: Math.cos(rad) * this.acl, y: Math.sin(rad) * this.acl},
		time: 0,
		xp: 30,
		draw() {
			var {x, y, s} = this;
			x *= scale; y *= scale; s *= scale;
			ctx.fillStyle = `rgb(170, ${(100 - this.time)/100 * 255}, 170)`;
			ctx.beginPath();
			ctx.square(x, y, s, s/2);
			ctx.fill();
		},
		tick() {
			if(parent) if(!parent.alive) parent.tick();
			if(this.time) this.time--;
			else{
				rad = Math.PI * 2 * Math.random()
				if(parent) this.time = parent.time;
				else this.time = 50 + Math.floor(Math.random() * 51)
				Object.assign(this.velocity, {x: Math.cos(rad) * this.acl, y: Math.sin(rad) * this.acl})
			}
			rad = Math.atan2(this.velocity.y, this.velocity.x);
			this.velocity.x += Math.cos(rad) * this.acl;
			this.velocity.y += Math.sin(rad) * this.acl;
		}
	});
};