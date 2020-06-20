var Level = 0, color = "000";
let generateLevel = function() {
	switch(Level) {
		case 0:
		for(var a = 0; a < 5; a++) {
			spawn(new Enemy);
			spawn(new Curve);
		} break;
		case 1:
		for(var a = 0; a < 10; a++) {
			spawn(new Enemy);
		} break;
		case 2:
		for(var a = 0; a < 4; a++) {
			spawn(new Patrol);
			if(a > 3) continue;
			spawn(new Curve);
			spawn(new Enemy);
		} break;
		case 3:
			for(var a = 0; a < 5; a++) {
				spawn(new Patrol);
				spawn(new Enemy);
			}
		break;
		case 4:
			for(var a = 0; a < 10; a++) {
				spawn(new Curve);
				enemies[enemies.length - 1].time = 0;
			}
		break;
		case 5:
			for(var a = 0; a < 3; a++) {
				spawn(new Wall);
			} spawn(new Enemy);
		break;
		case 6: 
		for(var a = 0; a < 5; a++) {
			spawn(new Dash);
			spawn(new Enemy);
		}
		break;
		case 7: 
		for(var a = 0; a < 7; a++) {
			spawn(new Dash);
		} spawn(new Wall);
		default:
			--Level;
		break;
	}
	++Level;
}