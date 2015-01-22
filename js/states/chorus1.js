define('Chorus1', [	
	'createjs',
	'Environment'
], function(c, Env){
	var Chorus1;

	var sectionOffset = 6000;
	var hitLanding;
	var intervalInstance;

	Chorus1 = {
		enter : function(canvas, stage){
			Env.playMusic('chorus1', this.exit.bind(this));
			
			Env.gameState = 'chorus1';

			//hateSession();
			Env.html.countdown.style.display = 'none';
			Env.starfield.changeStarSpeed( 'fast' );
			Env.starfield.stretchStarHeight( 10 );

			intervalInstance = window.requestAnimationFrame(this._getPosition);
		},
		exit : function(){
			this.onExit();
		},
		_getPosition : function() {
			tick();

			function tick() {
				if (gameState != 'chorus1')
					window.cancelAnimationFrame(intervalInstance);

				var position = soundInstance.getPosition();

				if (!hitLanding && position > 15000 - sectionOffset) {
					hitLanding = true;
				//	prepLandingScene();
				}
				
				if (gameState == 'chorus1')
					intervalInstance = window.requestAnimationFrame(tick);
			}
		}
	}

	return Chorus1;
});