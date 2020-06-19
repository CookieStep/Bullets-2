const canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
addEventListener("load", function() {
	var {body, documentElement} = document;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	body.appendChild(canvas);
	Object.assign(game, {
		width: canvas.width / scale,
		height: canvas.height / scale
	})
	player.x = game.width / 2;
	player.y = game.height / 2;
	update();
});
function update() {
	if(menu.active) menu();
	else game();
	requestAnimationFrame(update);
}
function menu() {
	var options = [
		"Bullets",
		"Normal",
		"Hardcore",
		[
			,"Hit space to play!",
			"Play the game with no lives..."
		]
	];
	options[options.length - 1] = options[options.length - 1][menu.selected]
	var colors = [
		"#fff",
		player.color,
		"#f50",
		"#fff"
	];
	var fonts = [
		"Georgia",
		"Arial",
		"Sans"
	];
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
	if(keys[" "]) {
		menu.active = false;
		if(menu.selected == 2) hardcore = true;
	}
}
menu.active = true;
menu.selected = 1;
let keys = {};
addEventListener("keydown", function(e) {
	keys[e.key] = 1;
});
addEventListener("keyup", function(e) {
	delete keys[e.key];
});