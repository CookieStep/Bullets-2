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
	game();
	requestAnimationFrame(update);
}
let keys = {};
addEventListener("keydown", function(e) {
	keys[e.key] = 1;
});
addEventListener("keyup", function(e) {
	delete keys[e.key];
});