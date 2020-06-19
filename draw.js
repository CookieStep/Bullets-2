CanvasRenderingContext2D.prototype.rect = function(x, y, w, h, r=0) {
	var v = x + w, b = y + h;
	ctx.moveTo(x+r, y);
	ctx.lineTo(v-r, y);
	ctx.quadraticCurveTo(v, y, v, y+r);
	ctx.lineTo(v, b-r);
	ctx.quadraticCurveTo(v, b, v-r, b);
	ctx.lineTo(x+r, b);
	ctx.quadraticCurveTo(x, b, x, b-r);
	ctx.lineTo(x, y+r);
	ctx.quadraticCurveTo(x, y, x+r, y);
};
CanvasRenderingContext2D.prototype.square = function(x, y, s, r) {this.rect(x, y, s, s, r)};
CanvasRenderingContext2D.prototype.clear = function(color) {
	var {width, height} = this.canvas;
	if(color) {
		this.fillStyle = color;
		this.fillRect(0, 0, width, height);
	}else this.clearRect(0, 0, width, height);
};