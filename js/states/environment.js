define('Environment', [	
	'createjs',
	'Hero',
	'Starfield'
], function(c, Hero, Starfield){
	var Environment;

	Environment = {
		enter : function(canvas, stage){
			this.stage = stage;
			this.hero = new Hero();
			this.hero.x = canvas.width / 2;
			this.hero.y = canvas.height / 2;

			this.starfield = new Starfield();
			this.starfield.analyseMusic();

			createjs.Ticker.setFPS(60);
			createjs.Ticker.addEventListener('tick', this.updateStage.bind(this));
			for (var i = this.starfield.stars.length - 1; i >= 0; i--) {
				stage.addChild( this.starfield.stars[i] );
			};
			
			stage.addChildAt( this.hero, this.starfield.stars.length );

			this.exit();				
		},
		exit : function(){
			this.onExit();
		},
		updateStage: function() {
			this.starfield.updateStarField();
			this.starfield.updateVisualiser();
			this.stage.update();
		}
	}

	return Environment;
});