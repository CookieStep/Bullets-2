let scale = 40;
let distance = (x, y, x2=0, y2=0) => Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
var above = false;
var score = 0, lives = 3, added = 0;
let game = function() {
	if(enemies.length == 0 && particles.length == 0) generateLevel();
	ctx.clear(`#0002`);
	particles = particles.filter((particle) => particle.time > 0);
	bullets = bullets.filter((bullet) => bullet.time > 0);
	enemies = enemies.filter((enemy) => enemy.alive);
	for(let bullet of bullets) {
		bullet.update();
		for(let enemy of enemies) if(touch(bullet, enemy)) {
			enemy.die();
			bullet.die();
		};
	}
	for(let particle of particles) {
		particle.update();
		if(touch(player, particle) && player.alive) {
			particle.die();
			player.xp += particle.xp; player.px += particle.px;
			var max = 100 * Math.pow(2, added);
			while(score + particle.xp > max) {
				lives++; added++;
				max = 100 * Math.pow(2, added);
			} player.sk += particle.px + particle.xp; score += particle.xp;
		}
	}
	for(let enemy of enemies) {
		enemy.update();
		if(touch(enemy, player) && player.alive) {
			enemy.die();
			player.die();
		}
	}
	if(player.alive) player.update();
	for(let particle of particles) particle.draw();
	for(let enemy of enemies) enemy.draw();
	for(let bullet of bullets) bullet.draw();
	if(player.alive) player.draw();
	if(hitbox) {
		for(let particle of particles) particle.hitbox();
		for(let enemy of enemies) enemy.hitbox();
		player.hitbox();
		for(let bullet of bullets) bullet.hitbox();
	}
	ctx.fillStyle = hardcore? "#f50": practice? "#5f5" : player.color;
	ctx.strokeStyle = hardcore? "#f50": practice? "#5f5" : player.color;
	var fonts = [
		"Arial",
		"Comic Sans MS",
		"Sans"
	];
	ctx.font = `${scale}px ${fonts[hardcore? 2: practice? 1: 0]}`;
	var txt = `Level ${Level}`;
	ctx.fillText(txt, canvas.width - ctx.measureText(txt).width, scale);
	txt = Math.round(score);
	ctx.fillText(txt, 0, scale);
	var x = (canvas.width - scale * Math.abs(lives))/2;
	ctx.beginPath();
	for(var i = 0; i < lives && !hardcore; i++) {
		ctx.square(x + scale * i, 0, scale, scale/4);
	}
	for(var i = 0; (i < -lives) || (hardcore && i < lives); i++) {
		ctx.square(x + scale * i, 0, scale, scale/4);
		ctx.moveTo(x + scale * i, 0);
		ctx.lineTo(x + scale + scale * i, scale);
		ctx.moveTo(x + scale + scale * i, 0);
		ctx.lineTo(x + scale * i, scale);
	}
	ctx.stroke();
};
let Player = function() {
	Entity.call(this);
	Object.assign(this, {
		acl: this.acl * 2,
		r: Math.PI * 3 / 2,
		tick() {
			if(keys.d) this.velocity.x += this.acl;
			if(keys.a) this.velocity.x -= this.acl;
			if(keys.s) this.velocity.y += this.acl;
			if(keys.w) this.velocity.y -= this.acl;
			if(keys.D) this.velocity.x += this.acl;
			if(keys.A) this.velocity.x -= this.acl;
			if(keys.S) this.velocity.y += this.acl;
			if(keys.W) this.velocity.y -= this.acl;
			var x = 0, y = 0;
			if(keys.ArrowRight) x++;
			if(keys.ArrowLeft) x--;
			if(keys.ArrowDown) y++;
			if(keys.ArrowUp) y--;
			if((x || y) && this.sk >= 25) this.shoot(Math.atan2(y, x));
			this.sk += 0.1;
		},
		die() {
			if(!this.inv && this.alive) {
				exp(this);
				if((lives > 0 && !hardcore) || practice) {
					this.x = game.width / 2;
					this.y = game.height / 2;
					this.sk = 50;
					this.inv = 100;
					--lives;
				}else{
					this.alive = false;
				}
			}
		},
		inv: 100,
		color: "#0af",
		sk: 50,
		draw() {
			var {x, y, s} = this
			x *= scale; y *= scale; s *= scale;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.square(x, y, s, s*2/5);
			ctx.fill();
			ctx.beginPath();
			var tx = this.sk/2;
			ctx.fillStyle = `hsl(${tx}, 100%, 70%)`;
			ctx.square(x + s/4, y + s/4, s/2, s*1/5);
			ctx.fill();
			ctx.beginPath();
			ctx.lineWidth = s / 16;
			ctx.strokeStyle = "#fff";
			x += s/2;
			y += s/2;
			s *= 2;
			this.r += Math.PI / 128;
			if(this.inv) {
				for(var r = 0; r < Math.PI * 2; r += Math.PI/2) {
					ctx.moveTo(x + Math.cos(this.r + r) * s, y + Math.sin(this.r + r) * s);
					ctx.lineTo(x + Math.cos(this.r - Math.PI / 16 + r) * s * 1.5, y + Math.sin(this.r - Math.PI / 16 + r) * s * 1.5);
					ctx.lineTo(x + Math.cos(this.r + Math.PI / 16 + r) * s * 1.5, y + Math.sin(this.r + Math.PI / 16 + r) * s * 1.5);
					ctx.lineTo(x + Math.cos(this.r + r) * s, y + Math.sin(this.r + r) * s);
				} ctx.stroke();
			}
			s /= 8;
			x -= s/2;
			y -= s/2;
			ctx.strokeStyle = hardcore? "#f50": practice? "#5f5" : player.color;
			var shots = Math.floor(this.sk / 25);
			ctx.beginPath();
			if(shots) for(var r = 0; r < Math.PI * 2; r += Math.PI * 2 / shots) ctx.square(x + Math.cos(4 * this.r/shots + r) * this.s * scale, y + Math.sin(4 * this.r/shots + r) * this.s * scale, s, s/4)
			ctx.stroke();
		}
	});
};
let player = new Player;
let particles = [];