let scale = 40;
let distance = (x, y, x2=0, y2=0) => Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
var tip = {}, time = 50, high = true;
var score = 0, lives = 3, added = 0, gameColor, pow = () => Math.ceil(Level / 10);
let game = function(update=true) {
	if(update) {
		if(keys.Esc == 1 || keys.Backspace == 1) {
			if(keys.Esc) keys.Esc = 2;
			if(keys.Backspace) keys.Backspace = 2;
			pause.active = true;
		}
		gameColor = impossible? "#555": hardcore? "#f50": practice? "#fff" : easy? "#5f5": insane? "#700": player.color;
		if(insane && player.alive) {
			if(time <= 0) {
				generateLevel();
				time = Level % 10 == 0? (impossible? 7500: 3750): 1500;
			}else time--;
		}else if(enemies.length == 0) if(time++ >= 50) generateLevel();
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
				var max = (easy? 50: 100) * added + (easy? 10: 25) * Math.pow(1.2, added);
				if(score + particle.xp > unlocked.highscore && !practice) {
					if(high) {
						if(unlocked.higscore > 0) {
							tip.text = "New Highscore: " + Math.round(score);
							tip.time = 100;
						}
						high = false;
					}
					unlocked.highscore = Math.round(score);
					saveData.highscore = Math.round(score);
				}
				while(score + particle.xp > max) {
					lives++; added++;
					max = (easy? 50: 100) * added + (easy? 10: 25) * Math.pow(1.2, added);
				} player.sk += (particle.px)/(pow() * pow()) + (particle.xp) / pow();
				score += particle.xp * (easy? 0.5: 1);
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
	}
	ctx.clear(`#0002`);
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
	ctx.fillStyle = gameColor;
	ctx.strokeStyle = gameColor;
	var fonts = [
		"Arial",
		"Courier New",
		"Comic Sans MS",
		"Sans",
		"Lucida Console",
		"Impact"
	];
	ctx.font = `${scale}px ${fonts[impossible? 5: insane? 4: hardcore? 3: easy? 1: practice? 2: 0]}`;
	var txt = insane? `Wave ${Level}`: `Level ${Level}`;
	if(Level % 10 == 0 && !insane) {
		txt = `Boss ${Level / 10}`;
	}
	if(Level == 21) txt = "Complete";
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
	if(insane) {
		var txt = Math.ceil(time / 150);
		ctx.fillText(txt, (canvas.width - ctx.measureText(txt).width)/2, canvas.height - scale/4);
	}
	ctx.stroke();
	if(tip.time && update) {
		tip.time--;
		ctx.fillText(tip.text, (canvas.width - ctx.measureText(tip.text).width)/2, (canvas.height - scale)/2);
	}
};
let Player = function() {
	Entity.call(this);
	if(easy) this.spd *= 2;
	Object.assign(this, {
		acl: this.acl * 2,
		r: Math.PI * 3 / 2,
		tick() {
			if(keys.d) this.velocity.x += this.acl;
			if(keys.a) this.velocity.x -= this.acl;
			if(keys.s) this.velocity.y += this.acl;
			if(keys.w) this.velocity.y -= this.acl;
			var x = 0, y = 0;
			if(keys.ArrowRight) x++;
			if(keys.ArrowLeft) x--;
			if(keys.ArrowDown) y++;
			if(keys.ArrowUp) y--;
			if((x || y) && this.sk >= (easy? 15: 25)) {
				if(player.sword) this.slice(Math.atan2(y, x));
				if(player.sniper) this.snipe(Math.atan2(y, x));
				else this.shoot(Math.atan2(y, x));
			}
			this.sk += easy? 0.25: 0.1;
			if(this.sk > (easy? 2500: 625)) this.sk = (easy? 2500: 625);
			if(this.sp > (easy? 13: 7)) this.sp = (easy? 13: 7);
		},
		die() {
			if(!this.inv && this.alive) {
				exp(this);
				if(((lives > 0 && !hardcore) || practice) || Level == 21) {
					this.x = game.width / 2;
					this.y = game.height / 2;
					this.sk = 50; this.sp = 1;
					this.inv = easy? 250: 100;
					--lives;
				}else{
					score += (easy? 50: 100) * lives + (easy? 10: 25) * Math.pow(1.2, lives);
					if(score > unlocked.highscore) {
						unlocked.highscore = Math.round(score);
						saveData.highscore = Math.round(score);
					}
					tip.time = Infinity;
					tip.text = `Final Score: ${Math.round(score)}`;
					this.alive = false;
				}
			}
		},
		inv: easy? 250: 100,
		color: "#0af",
		sk: 50,
		draw() {
			var {x, y, s} = this
			x *= scale; y *= scale; s *= scale;
			if(this.lastSwing) {
				var rad = this.swingRad + (Math.PI/2 * ((easy? 15: 25) - this.lastSwing - 1/2)/(easy? 15: 25))
				ctx.lineWidth = scale * this.s/4;
				ctx.strokeStyle = "#555";
				ctx.beginPath();
				ctx.moveTo(x + s/2, y + s/2);
				ctx.lineTo(x + s/2 + Math.cos(rad) * (2 + (this.sp - 1)/2) * scale, y + s/2 + Math.sin(rad) * (2 + (this.sp - 1)/2) * scale);
				ctx.stroke();
			} ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.square(x, y, s, s*2/5);
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = `hsl(${(this.sp - 1)/(easy? 13: 7) * 360}, 100%, 50%)`;
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
			ctx.strokeStyle = gameColor;
			var shots = Math.floor(this.sk / (easy? 15: 25));
			var shot = Math.sqrt(shots);
			ctx.beginPath();
			if(shots) for(var r = 0; r < Math.PI * 2; r += Math.PI * 2 / shots)
				if(player.sword) {
					ctx.moveTo(x + Math.cos(4 * this.r/shot + r) * this.s * scale * 0.7, y + Math.sin(4 * this.r/shot + r) * this.s * scale * 0.7)
					ctx.lineTo(x + Math.cos(4 * this.r/shot + r) * this.s * scale, y + Math.sin(4 * this.r/shot + r) * this.s * scale)
				}else if(player.sniper) {
					ctx.moveTo(x + Math.cos(4 * this.r/shot + r) * this.s * scale - s/2, y + Math.sin(4 * this.r/shot + r) * this.s * scale)
					ctx.lineTo(x + Math.cos(4 * this.r/shot + r) * this.s * scale + s/2, y + Math.sin(4 * this.r/shot + r) * this.s * scale)
				}else{
					ctx.square(x + Math.cos(4 * this.r/shot + r) * this.s * scale - s/2, y + Math.sin(4 * this.r/shot + r) * this.s * scale - s/2, s, s/4)
				}
			ctx.stroke();
		}
	});
};
let player = new Player;
let particles = [];