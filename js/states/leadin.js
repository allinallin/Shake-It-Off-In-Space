define('LeadIn', [	
	'createjs',
	'Environment'
], function(c, Env){
	var LeadIn;

	var sectionOffset = 3000;
	var hitThree;
	var hitTwo;
	var hitOne;
	var hitYeah;
	var intervalInstance;

	LeadIn = {
		enter : function(canvas, stage){
			Env.playMusic('leadin', this.exit.bind(this));

			Env.html.countdown.style.display = 'block';
			Env.html.countdown.textContent = 'Ready...';

			Env.gameState = 'leadin';

			intervalInstance = window.requestAnimationFrame(this._getPosition);
		},
		exit : function(){
			this.onExit();
		},
		_getPosition : function() {
			tick();

			function tick() { 
				if (Env.gameState != 'leadin')
					window.cancelAnimationFrame(intervalInstance);

				var position = Env.soundInstance.getPosition();

				if (!hitOne && position > 5525 - sectionOffset) {
					hitOne = true;
					Env.html.countdown.textContent = '1';
					Env.starfield.colorStarsAlpha('randomize');
				}
				else if (!hitTwo && position > 5150 - sectionOffset){
					hitTwo = true;
					Env.html.countdown.textContent = '2';
					Env.starfield.colorStarsAlpha('randomize');
				}
				else if (!hitThree && position > 4775 - sectionOffset) {
					hitThree = true;
					Env.html.countdown.textContent = '3';
					Env.starfield.colorStarsAlpha('randomize');
				}
				else if (!hitYeah && position > 4313 - sectionOffset) {
					hitYeah = true;
					Env.html.countdown.textContent = 'YEEAHH!';
				}
				
				if (Env.gameState == 'leadin')
					intervalInstance = window.requestAnimationFrame(tick);
			}
		}
	}

	return LeadIn;
});