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
			this.debugMode = false;
			this.gameStarted = false;

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
		},
		playMusic: function(sectionName, callback) {
			if (this.soundInstance)
				this.soundInstance.removeAllEventListeners();

			this.soundInstance = createjs.Sound.play( sectionName );

			if (this.debugMode) soundInstance.volume = 0;

			this.soundInstance.addEventListener('complete', function(e) {
				if (callback && typeof(callback) == 'function')
					callback(e);
			}, false);
		},
		playRiff: function(callback) {
			function riffRecursion() {
				if (this.gameStarted && callback && typeof(callback) == 'function') {
					callback();
				} else {
					this.playRiff(callback);
				}
			}

			this.playMusic('riff', riffRecursion.bind(this));
		},
		html: {
			title: document.querySelector('.title'),
			playButton: document.querySelector('.play-button'),
			replayButton: document.querySelector('.replay-button'),
			launchButton: document.querySelector('.launch-button'),
			helpBox: document.querySelector('.help-box'),
			countdown: document.querySelector('.countdown'),
			shakeItIndicator: document.querySelector('.shake-it-indicator'),
			gameOverMsg: document.querySelector('.game-over')
		}
	}

	return Environment;
});