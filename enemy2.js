let Chase = function() {
	Entity.call(this);
	var rad = Math.PI * 2 * Math.random();
	Object.assign(this, {
		color: "#f00",
		velocity: {x: Math.cos(rad) * this.acl, y: Math.sin(rad) * this.acl},
        xp: 50,
        acl: this.acl * 0.75,
		draw() {
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