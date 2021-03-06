const canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
let saveData = localStorage;
if(!saveData.highscore) saveData.highscore = 0;
let unlocked = {
	sword: saveData.sword == "true",
	sniper: saveData.sniper == "true",
	reversed: saveData.reversed == "true",
	checkpoint: Number(saveData.checkpoint),
	highscore: Number(saveData.highscore),
	sworp: saveData.sworp == "true",
	snipep: saveData.snipep == "true"
};
addEventListener("load", function() {
	var {body, documentElement} = document;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	body.appendChild(canvas);
	Object.assign(game, {
		width: canvas.width / scale,
		height: canvas.height / scale
	})
	player.x = (game.width - player.s)/2;
	player.y = (game.height - player.s)/2;
	document.title = "Bullets 2";
	if(unlocked.reversed) reversed = true;
	update();
});
function update() {
	if(menu.active) menu();
	else if(pause.active) pause();
	else game();
	requestAnimationFrame(update);
}
function menu() {
	switch(menu.active) {
		case 1:
			var options = [
				"Bullets 2",
				"Normal",
				"Easy",
				"Practice",
				"Hardcore",
				"Insane",
				"Impossible",
				[
					,"Hit space to play!",
					"Just can't take the heat.",
					"No fear, no rewards.",
					"Death is not allowed.",
					"No breaks, no rests.",
					"Don't waste your time."
				]
			];
			var colors = [
				"#fff",
				player.color,
				"#5f5",
				"#fff",
				"#f50",
				"#700",
				"#555",
				"#fff",
				"#ff5"
			];
			var fonts = [
				"Georgia",
				"Arial",
				"Courier New",
				"Comic Sans MS",
				"Sans",
				"Lucida Console",
				"Impact"
			];
		break;
		case 2:
			var options = [
				"Weapon Select",
				"Gun",
				"Sword",
				[
					,"The default weapon",
					"Slice through your enemies",
					"Good distance, keep at range"
				]
			];
			if(unlocked.sniper) options.push("Sniper", options.pop());
			var colors = [
				"#fff",
				player.color,
				"#555",
				"#fff"
			];
			if(unlocked.sniper) colors.push("#00d", colors.pop());
			var fonts = [
				"Georgia",
				"Arial",
				"Sans"
			];
			if(unlocked.sniper) fonts.push("Courier New")
		break;
		case 3:
			var options = [
			"Stage Select",
			"Stage 1",
			"Stage 2",
			[
				,"The easiest and most basic stage",
				"Weird movement all throughout",
				"And... they all wanna kill you"
			]
		];
		if(unlocked.checkpoint > 1) options.push("Stage 3", options.pop());
		var colors = [
			"#fff",
			"#ff0",
			"#f00"
		];
		if(unlocked.checkpoint > 1) colors.push("#0f0");
		var fonts = [
			"Georgia",
			"Comic Sans MS",
			"Arial"
		];
		if(unlocked.checkpoint > 1) fonts.push("Courier New")
		break;
	} options[options.length - 1] = options[options.length - 1][menu.selected];
	var highscore = unlocked.highscore && menu.active == 1
	if(highscore) options.push(`Highscore: ${unlocked.highscore}`);
	fonts.push(fonts[menu.selected]);
	colors.push(colors[menu.selected]);
	var h = canvas.height / options.length;
	ctx.clear("#000");
	for(var opt = 1; opt < options.length - (highscore? 2: 1); opt++) {
		ctx.beginPath();
		ctx.rect(canvas.width / 4, h * opt, canvas.width/2, h, canvas.height/16);
		ctx.strokeStyle = colors[opt];
		ctx.stroke();
	}
	for(var opt = 0; opt < options.length; opt++) {
		ctx.font = `${h/2}px ${fonts[opt]}`;
		ctx.fillStyle = colors[opt];
		ctx.fillText(options[opt], (canvas.width - ctx.measureText(options[opt]).width)/2, h * opt + h * 3/5);
		if(menu.selected == opt) {
			ctx.beginPath();
			ctx.square((canvas.width - ctx.measureText(options[opt]).width - scale * 4)/2, h * opt + h * 3/10, scale, scale/4);
			ctx.fill();
		}
	}
	if(keys.ArrowDown == 1) {
		keys.ArrowDown = 2;
		menu.selected++;
	}
	if(keys.ArrowUp == 1) {
		keys.ArrowUp = 2;
		menu.selected--;
	}
	if(menu.selected < 1) menu.selected += options.length - (highscore? 3: 2);
	menu.selected = ((menu.selected - 1) % (options.length - (highscore? 3: 2))) + 1;
	if(keys.Backspace == 1 || keys.Escape == 1) {
		if(keys.Backspace) keys.Backspace = 2;
		if(keys.Escape) keys.Escape = 2;
		if(menu.active == 2) {
			menu.active = 1;
			insane = false;
			hardcore = false;
			easy = false;
			practice = false;
			time = 500;
		}
		if(menu.active == 3) {
			menu.active = 2;
			delete player.sword;
			delete player.sniper;
		}
		menu.selected = 1;
	}
	if(keys[" "] == 1 || keys.Enter == 1) {
		if(keys[" "]) keys[" "] = 2;
		if(keys.Enter) keys.Enter = 2;
		switch(menu.active) {
			case 1:
				if(menu.selected == 2) easy = true;
				if(menu.selected == 3) practice = true;
				if(menu.selected == 4) hardcore = true;
				if(menu.selected == 5) {
					insane = true;
					time = 0;
				}
				if(menu.selected == 6) {
					insane = true;
					hardcore = true;
					impossible = true;
					time = 0;
				}
				player.sk = 50;
				if(unlocked.sword) menu.active = 2;
				else menu.active = false;
				menu.selected = 1;
			break;
			case 2:
				if(menu.selected == 2) player.sword = true;
				if(menu.selected == 3) player.sniper = true;
				if(unlocked.checkpoint) menu.active = 3;
				else menu.active = false;
				menu.selected = 1;
			break;
			case 3:
				Level = menu.selected * 10 - 10;
				menu.active = false;
				menu.selected = 1;
			break;
		}
	}
}
menu.active = 1;
menu.selected = 1;
let keys = {};
let bind = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"];
addEventListener("keydown", function(e) {
	if(bind.includes(e.key)) {
		var up = ["W", "A", "S", "D"];
		var down = ["w", "a", "s", "d"];
		var arrows = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
		var key = e.key;
		if(up.includes(key)) {
			key = down[up.indexOf(key)];
		} if(reversed) {
			if(arrows.includes(key)) key = down[arrows.indexOf(key)];
			else key = arrows[down.indexOf(key)];
		}
		keys[key] = 1;
	}else{
		keys[e.key] = 1;
	}
});
addEventListener("keyup", function(e) {
	if(bind.includes(e.key)) {
		var up = ["W", "A", "S", "D"];
		var down = ["w", "a", "s", "d"];
		var arrows = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
		var key = e.key;
		if(up.includes(key)) {
			key = down[up.indexOf(key)];
		} if(reversed) {
			if(arrows.includes(key)) key = down[arrows.indexOf(key)];
			else key = arrows[down.indexOf(key)];
		}
		delete keys[key];
	}else{
		delete keys[e.key];
	}
});