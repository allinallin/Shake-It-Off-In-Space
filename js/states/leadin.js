define('LeadIn', [	
	'createjs',
	'Environment'
], function(c, Env, HateSession){
	var LeadIn;

	var sectionOffset = 3000;
	var intervalInstance;

	LeadIn = {
		enter : function(canvas, stage){
			Env.playMusic('leadin', this.exit.bind(this));

			Env.html.countdown.style.display = 'block';
			Env.html.countdown.textContent = 'Ready...';

			Env.gameState = 'leadin';

			this.hitThree = false;
			this.hitTwo = false;
			this.hitOne = false;
			this.hitYeah = false;

			intervalInstance = window.requestAnimationFrame(this._getPosition.bind(this));
		},
		exit : function(){
			this.onExit();
		},
		_getPosition : function() {
			tick.call(this);

			function tick() { 
				if (Env.gameState != 'leadin')
					window.cancelAnimationFrame(intervalInstance);

				var position = Env.soundInstance.getPosition();

				if (!this.hitOne && position > 5525 - sectionOffset) {
					this.hitOne = true;
					Env.html.countdown.textContent = '1';
					Env.starfield.colorStarsAlpha('randomize');
				}
				else if (!this.hitTwo && position > 5150 - sectionOffset){
					this.hitTwo = true;
					Env.html.countdown.textContent = '2';
					Env.starfield.colorStarsAlpha('randomize');
				}
				else if (!this.hitThree && position > 4775 - sectionOffset) {
					this.hitThree = true;
					Env.html.countdown.textContent = '3';
					Env.starfield.colorStarsAlpha('randomize');
				}
				else if (!this.hitYeah && position > 4313 - sectionOffset) {
					this.hitYeah = true;
					Env.html.countdown.textContent = 'YEEAHH!';
				}
				
				if (Env.gameState == 'leadin')
					intervalInstance = window.requestAnimationFrame(tick.bind(this));
			}
		}
	}

	return LeadIn;
});