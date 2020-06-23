let pause = function() {
	game(false);
	var options = [
		"Main menu",
		reversed? "Keys reversed": "Reverse keys",
		`Highscore: ${Math.round(unlocked.highscore)}`,
		"Unlockables"
	]
	if(pause.active == 2) {
		options = [
			`Checkpoints: ${unlocked.checkpoint}`,
			`Sword: ${unlocked.sword? "yes": "no"}`,
			`Sword Powerup: ${unlocked.sworp? "yes": "no"}`,
		];
		if(unlocked.sword) options.push(`Sniper: ${unlocked.sniper? "yes": "no"}`, `Sniper Powerup: ${unlocked.snipep? "yes": "no"}`)
	} 
	var h = canvas.height / (options.length + 2)
	ctx.beginPath();
	ctx.fillStyle = gameColor;
	ctx.rect(canvas.width/4, h, canvas.width/2, h * options.length, h/2);
	ctx.fill();
	for(var opt = 0; opt < options.length; opt++) {
		ctx.fillStyle = "#000";
		ctx.fillText(options[opt], (canvas.width - ctx.measureText(options[opt]).width)/2, h * opt + h * 8/5);
	}
	ctx.beginPath();
	ctx.rect(canvas.width / 4, h * (pause.selected + 1), canvas.width/2, h, h/2);
	ctx.strokeStyle = "#000";
	ctx.stroke();
	if(keys.ArrowDown == 1) {
		keys.ArrowDown = 2;
		pause.selected++;
	} if(keys.ArrowUp == 1) {
		keys.ArrowUp = 2;
		pause.selected--;
	}
	pause.selected += options.length;
	pause.selected %= options.length;
	if(keys.Backspace == 1 || keys.Escape == 1) {
		if(keys.Backspace) keys.Backspace = 2;
		if(keys.Escape) keys.Escape = 2;
		if(pause.active == 2) pause.active = true;
		else pause.active = false;
	}
	if(keys[" "] == 1 || keys.Enter == 1) {
		if(keys[" "]) keys[" "] = 2;
		if(keys.Enter) keys.Enter = 2;
		if(pause.active == true) {
			if(pause.selected == 0) {
				player = new Player;
				Level = 0;
				tip = {};
				score = 0;
				high = true;
				enemies = [];
				particles = [];
				hardcore = false;
				impossible = false;
				easy = false;
				practice = false;
				insane = false;
				menu.active = 1;
				pause.active = false;
				player.x = (game.width - player.s)/2;
				player.y = (game.height - player.s)/2;
				time = 50;
				lives = 3;
				added = 0;
			}
			if(pause.selected == 1) {
				reversed = !reversed;
				saveData.reversed = reversed;
				unlocked.reversed = reversed;
			}
			if(pause.selected == 3) {
				pause.active = 2;
			}
		}else{
			pause.active = true;
		}
	}
};
pause.selected = 0;