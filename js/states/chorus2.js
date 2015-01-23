define('Chorus2', [	
	'createjs',
	'Environment'
], function(c, Env){
	var Chorus2;

	Chorus2 = {
		enter : function(canvas, stage){
			this.canvas = canvas;
			this.stage = stage;
			Env.playMusic('chorus2', this.exit.bind(this));
			Env.gameState = 'chorus2';
		},
		exit : function(){
			this.onExit();
		}
	}

	return Chorus2;
});