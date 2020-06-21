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
			for(var a = 0; a < 4; a++) {
				spawn(new Dash);
				if(a > 1) continue;
				spawn(new Wall);
			}
		break;
		case 8:
			spawn(new Dash);
			spawn(new Enemy);
			spawn(new Curve);
			spawn(new Dash);
			spawn(new Enemy);
			spawn(new Curve);
			spawn(new Patrol);
			spawn(new Wall);
		break;
		case 9:
			spawn(new PatrolBoss);
		break;
		case 10:
			for(var a = 0; a < 3; a++) {
				spawn(new Chase);
				spawn(new Dash);
				spawn(new Boost);
			} spawn(new Patrol);
		break;
		case 11:
			for(var a = 0; a < 2; a++) {
				spawn(new Chase);
				spawn(new Boost);
				spawn(new Boost)
				spawn(new Shoot);
				spawn(new Shoot);
			}
		break;
		case 12:
			for(var a = 0; a < 2; a++) {
				spawn(new Shoot);
				spawn(new Boost);
				spawn(new Chase);
				spawn(new Patrol);
				spawn(new TPatrol);
			}
		break;
		case 13:
			for(var a = 0; a < 3; a++) {
				spawn(new Boost);
				spawn(new Dash);
				spawn(new Boost);
			} spawn(new TPatrol);
		break;
		case 14:
			for(var a = 0; a < 10; a++) {
				spawn(new TPatrol);
			}
		break;
		default:
			--Level;
		break;
	}
	++Level;
}