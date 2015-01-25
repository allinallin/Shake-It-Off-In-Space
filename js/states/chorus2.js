define('Chorus2', [	
	'createjs',
	'Environment',
	'ShakeItSession',
	'Helpers'
], function(c, Env, ShakeItSession, Helpers){
	var Chorus2;
	var sectionOffset = 6000;
	var intervalInstance;

	Chorus2 = {
		enter : function(canvas, stage){
			this.canvas = canvas;
			this.stage = stage;
			Env.playMusic('chorus2', this.exit.bind(this));
			Env.gameState = 'chorus2';
			Env.html.shakeItIndicator.style.display = 'block';

			ShakeItSession.init(canvas, stage, Env.hero, Env.soundInstance);
			this.shakeItWindows = ShakeItSession.windows;

			intervalInstance = window.requestAnimationFrame(this._getPosition.bind(this));
		},
		exit : function(){
			Env.html.shakeItIndicator.style.display = 'none';
			ShakeItSession.terminate();
			this.onExit();
		},
		_getPosition : function() {
			tick.call(this);

			function tick() {
				if (Env.gameState != 'chorus2')
					window.cancelAnimationFrame(intervalInstance);

				var position = Env.soundInstance.getPosition();
				var enableFlag;

				for (var i = this.shakeItWindows.length - 1; i >= 0; i--) {
					var lowerLimit = this.shakeItWindows[i][0] * 1000,
						upperLimit = this.shakeItWindows[i][1] * 1000;
					if (Helpers.numIsInBetween( position, lowerLimit, upperLimit )) {
						Env.html.shakeItIndicator.setAttribute('data-mode', 'on');
						enableFlag = true;
						break;
					}

				};

				if (!enableFlag)
					Env.html.shakeItIndicator.setAttribute('data-mode', 'off');
				
				if (Env.gameState == 'chorus2')
					intervalInstance = window.requestAnimationFrame(tick.bind(this));
			}
		}
	}

	return Chorus2;
});