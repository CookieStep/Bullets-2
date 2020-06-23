let SnakeBoss = function(parent) {
    if(!parent) parent = {};
    var rad = Math.random() * 2 * Math.PI;
    Entity.call(this);
    var bias = Math.random() * 10;
    Object.assign(this, {
        velocity: {x: Math.cos(rad) * this.acl, y: Math.sin(rad) * this.acl},
        color: "#0ff",
        draw() {
            if(parent.alive) {
                var s = this.s/2; x = this.x + s; y = this.y + s;
                var rad = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI/4;
                s *= scale; x *= scale; y *= scale;
                ctx.beginPath();
                s /= Math.sin(Math.PI / 4);
                var a = Math.cos(rad) * s, b = Math.sin(rad) * s;
                ctx.fillStyle = parent.color;
                ctx.moveTo(x + a, y + b);
                ctx.lineTo(x + b, y - a);
                if(this.behind) {
                    ctx.lineTo(x - a, y - b);
                    ctx.lineTo(x - b, y + a);
                }else{
                    s /= Math.sin(Math.PI/4) * 2;
                    this.r = rad + Math.PI * 3/4;
                    var a = Math.cos(this.r) * s, b = Math.sin(this.r) * s;
                    ctx.lineTo(x + a, y + b);
                }
                ctx.fill();
            }else{
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
                if(this.behind) {
                    ctx.beginPath();
                    s /= Math.sin(Math.PI/4) * 2;
                    this.r = rad + Math.PI/4;
                    var a = Math.cos(this.r) * s, b = Math.sin(this.r) * s;
                    s *= Math.sin(Math.PI/4) * 2;
                    ctx.moveTo(x - a, y - b);
                    ctx.lineTo(x + Math.cos(rad - Math.PI/2) * s/2, y + Math.sin(rad - Math.PI/2) * s/2);
                    ctx.lineTo(x - Math.cos(rad - Math.PI/2) * s/2, y - Math.sin(rad - Math.PI/2) * s/2);
                    ctx.lineTo(x - b, y + a);
                    ctx.fill();
                }
            }
        },
        behind: false,
        tick() {
            this.behind = false;
            if(parent.alive) {
                var {x, y, s, r} = parent;
                this.goal = parent.goal;
                this.color = parent.color;
                parent.behind = true;
                rad = -Math.atan2(parent.velocity.y, parent.velocity.x);
                var dis = distance(parent.velocity.y, parent.velocity.x);
                x += parent.velocity.x;
                y += parent.velocity.y;
                x = x + Math.cos(rad) * dis;
                y = y + Math.sin(rad) * dis;
                this.loc = {x, y, s};
                rad = radianTo(this, this.loc);
                var dis = distanceBetween(this, this.loc);
                if(dis > this.acl) dis = this.acl;
                this.velocity.x += Math.cos(rad) * dis;
                this.velocity.y += Math.sin(rad) * dis;
            }else{
                rad = Math.atan2(this.velocity.y, this.velocity.x);
                rad += (Math.random() + bias/5) * Math.PI / 6 / (this.goal + 1);
                bias += Math.random() * 2 - 1;
                if(bias > 2) bias = 2;
                if(bias < -2) bias = -2;
                if(distanceBetween(this, player) < 7.5 && player.alive && !this.goal) {
                    rad = radianTo(this, player);
                    this.spd = 0.2;
                    Object.assign(this.velocity, {x: Math.cos(rad) * this.spd, y: Math.sin(rad) * this.spd});
                    this.goal = 100
                }
                if(this.goal) this.goal--;
                this.velocity.x += Math.cos(rad) * this.acl;
                this.velocity.y += Math.sin(rad) * this.acl;
            }
            this.spd = 0.1 + (this.goal / 1000);
        },
        die() {
            if(this.alive) {
                this.alive = false;
                exp(this);
                if(enemies.length == 1) {
                    var unlocks = [];
                    if(!practice && !unlocked.sniper) {
                        unlocks.push("Skill");
                        unlocked.sniper = true;
                        saveData.sniper = true;
                    } if(hardcore && unlocked.checkpoint < 2) {
                        unlocks.push("Checkpoint");
                        unlocked.checkpoint = 2;
                        saveData.checkpoint = 2;
                    } if(insane && !unlocked.sworp) {
                        unlocks.push("Powerup")
                        unlocked.snipep = true;
                        saveData.snipep = true;
                    }
                    if(unlocks.length) {
                        tip.time = 100;
                        tip.text = `New ${unlocks} Unlocked`
                    }
                }
			}
        },
        xp: 100,
        goal: 0
    })
}