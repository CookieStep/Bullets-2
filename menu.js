let pause = function() {
	game(false);
	var options = [
		"Main menu",
		`Reverse keys: ${reversed? "yes": "no"}`
	]
	var h = canvas.height / (options.length + 2)
	ctx.beginPath();
	ctx.fillStyle = gameColor;
	ctx.rect(canvas.width/4, h, canvas.width/2, h * options.length, (h * options.length) / 4);
	ctx.fill();
	for(var opt = 0; opt < options.length; opt++) {
		ctx.fillStyle = "#555";
		ctx.fillText(options[opt], (canvas.width - ctx.measureText(options[opt]).width)/2, h * opt + h * 8/5);
	}
	ctx.beginPath();
	ctx.rect(canvas.width / 4, h * (pause.selected + 1), canvas.width/2, h, h/8);
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
		pause.active = false;
	}
	if(keys[" "] == 1 || keys.Enter == 1) {
		if(keys[" "]) keys[" "] = 2;
		if(keys.Enter) keys.Enter = 2;
		if(pause.selected == 0) {
			player = new Player
			Level = 0;
			score = 0;
			hardcore = false;
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
	}
};
pause.selected = 0;