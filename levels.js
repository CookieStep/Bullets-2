var Level = 0;
let generateLevel = function() {
	switch(Level) {
		case 0:
			for(var i = 0; i < 10; i++) {
				spawn(new Enemy);
			}
		break;
		case 1:
			for(var i = 0; i < 5; i++) {
				spawn(new Enemy);
				spawn(new Curve);
			}
		break;
		case 2:
			for(var i = 0; i < 10; i++) {
				spawn(new Enemy(0));
			}
		break;
		case 3:
			for(var i = 0; i < 10; i++) {
				spawn(new Curve(0, 0));
			}
		break;
		case 4:
			for(var i = 0; i < 10; i++) {
				spawn(new Enemy(Math.PI * i / 2));
			}
		break;
		case 5:
			for(var i = 0; i < 5; i++) {
				spawn(new Enemy);
				spawn(new Patrol);
			}
		break;
		case 6:
			for(var i = 0; i < 5; i++) {
				spawn(new Patrol);
				spawn(new Patrol(true));
			}
		break;
		case 7:
			for(var i = 0; i < 4; i++) {
				spawn(new Patrol(true));
				if(i > 2) continue;
				spawn(new Enemy);
				spawn(new Curve);
			}
		break;
		case 8: 
			for(var i = 0; i < 2; i++) {
				spawn(new Enemy(Math.PI * i));
				spawn(new Enemy(Math.PI * (i + 1/2)));
				spawn(new Patrol);
				spawn(new Patrol(true));
				spawn(new Curve(0));
			}
		break;
		case 9:
			spawn(new PatrolBoss);
		break;
		case 10:
			for(var a = 0; a < 5; a++) {
				spawn(new Swerve);
				spawn(new Patrol(true));
			}
		break;
		case 11:
			for(var a = 0; a < 4; a++) {
				spawn(new Swerve);
				if(a > 2) continue;
				spawn(new Patrol(true));
				spawn(new Enemy);
			}
		break;
		case 12:
			for(var a = 0; a < 5; a++) {
				spawn(new Swerve);
				spawn(new Switch);
			}
		break;
		case 13:
			for(var a = 0; a < 5; a++) {
				spawn(new Switch);
				spawn(new Enemy);
			}
		break;
		case 14:
			let s = new Switch;
			spawn(s);
			for(var a = 0; a < 9; a++) {
				spawn(new Switch(s));
			}
		break;
		case 15:
			for(var a = 0; a < 5; a++) {
				spawn(new Switch);
				spawn(new Dash);
			}
		break;
		case 16:
			for(var a = 0; a < 10; a++) {
				spawn(new Dash);
			}
		break;
		case 17:
			for(var a = 0; a < 5; a++) {
				spawn(new Scout);
				spawn(new Dash);
			}
		break;
		case 18:
			for(var i = 0; i < 2; i++) {
				spawn(new Enemy);
				spawn(new Scout);
				spawn(new Switch);
				spawn(new Dash);
				spawn(new Swerve);
			}
		break;
		case 19:
			var l;
			for(var a = 0; a < 20; a++) {
				l = new SnakeBoss(l);
				spawn(l);
			}
		break;
		default:
			--Level;
		break;
	} ++Level;
	time = 0;
}