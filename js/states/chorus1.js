define('Chorus1', [	
	'createjs',
	'Environment',
	'Planet',
	'HateSession'
], function(c, Env, Planet, HateSession){
	var Chorus1;

	var sectionOffset = 6000;
	var intervalInstance;

	Chorus1 = {
		enter : function(canvas, stage){
			this.canvas = canvas;
			this.stage = stage;
			this.hitLanding = false;

			Env.playMusic('chorus1', this.exit.bind(this));
			
			Env.gameState = 'chorus1';

			HateSession.init(canvas, stage, Env.hero);

			Env.html.countdown.style.display = 'none';
			Env.starfield.changeStarSpeed( 'fast' );
			Env.starfield.stretchStarHeight( 10 );

			intervalInstance = window.requestAnimationFrame(this._getPosition.bind(this));
		},
		exit : function(){
			this.onExit();
		},
		_getPosition : function() {
			tick.call(this);

			function tick() {
				if (Env.gameState != 'chorus1')
					window.cancelAnimationFrame(intervalInstance);

				var position = Env.soundInstance.getPosition();

				if (!this.hitLanding && position > 15000 - sectionOffset) {
					this.hitLanding = true;
					Env.gameState = 'landing';

					HateSession.terminate();

					Env.starfield.changeStarSpeed('slow');
					Env.starfield.stretchStarHeight('original');

					Env.hero.movingUp = false;
					Env.hero.movingDown = false;
					Env.hero.movingLeft = false;
					Env.hero.movingRight = false;
					Env.hero.rotation = 0;

					Env.planet = new Planet();
					this.stage.addChildAt( Env.planet, 110 );
					Env.planet.addToView();
					Env.hero.moveToLand(this.canvas);
				}
				
				if (Env.gameState == 'chorus1')
					intervalInstance = window.requestAnimationFrame(tick.bind(this));
			}
		}
	}

	return Chorus1;
});