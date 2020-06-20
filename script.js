const canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
let saveData = localStorage;
let unlocked = {
	sword: saveData.sword
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
	if(saveData.autosave) {
		menu.active = false;
		enemies = saveData.save.enemies
		particles = saveData.save.particles
		player = saveData.save.player
		bullets = saveData.save.bullets
	}
	update();
});
function update() {
	if(menu.active) menu();
	else game();
	requestAnimationFrame(update);
}
function menu() {
	switch(menu.active) {
		case 1:
			var options = [
				"Bullets 2",
				"Normal",
				"Practice",
				"Hardcore",
				[
					,"Hit space to play!",
					"No fear, no skills.",
					"Your 100% not allowed to die."
				]
			];
			var colors = [
				"#fff",
				player.color,
				"#5f5",
				"#f50",
				"#fff"
			];
			var fonts = [
				"Georgia",
				"Arial",
				"Comic Sans MS",
				"Sans"
			];
		break;
		case 2:
			var options = [
				"Weapon Select",
				"Gun",
				"Sword",
				[
					,"The default weapon",
					"Slice through your enemies"
				]
			];
			var colors = [
				"#fff",
				player.color,
				"#555",
				"#fff"
			];
			var fonts = [
				"Georgia",
				"Arial",
				"Sans"
			];
		break;
	}
	options[options.length - 1] = options[options.length - 1][menu.selected]
	fonts.push(fonts[menu.selected]);
	var h = canvas.height / options.length;
	ctx.clear("#000");
	for(var opt = 1; opt < options.length - 1; opt++) {
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
	if(menu.selected < 1) menu.selected += options.length - 2;
	menu.selected = ((menu.selected - 1) % (options.length - 2)) + 1;
	if(keys.Backspace) {
		if(menu.active == 2) menu.active = 1;
	}
	if(keys[" "] == 1 || keys.Enter == 1) {
		if(keys[" "]) keys[" "] = 2;
		if(keys.Enter) keys.Enter = 2;
		switch(menu.active) {
			case 1:
				if(menu.selected == 2) practice = true;
				if(menu.selected == 3) hardcore = true;
				if(unlocked.sword) menu.active = 2;
				else menu.active = false;
			break;
			case 2:
				if(menu.selected == 2) player.sword = true;
				menu.active = false;
			break;
		}
	}
}
menu.active = 1;
menu.selected = 1;
let keys = {};
addEventListener("keydown", function(e) {
	keys[e.key] = 1;
});
addEventListener("keyup", function(e) {
	delete keys[e.key];
});
