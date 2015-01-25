define('Environment', [	
	'createjs',
	'Hero',
	'Hater',
	'Starfield',
	'Helpers'
], function(c, Hero, Hater, Starfield, Helpers){
	var Environment;

	Environment = {
		enter : function(canvas, stage){
			this.canvas = canvas;
			this.stage = stage;
			this.debugMode = false;
			
			this.supportCheck();
			
			this.hero = new Hero({
				x: canvas.width / 2,
				y: canvas.height / 2
			});

			this.starfield = new Starfield();
			this.starfield.analyseMusic();
			
			this.gameStarted = false;

			createjs.Ticker.addEventListener('tick', this.updateStage.bind(this));
			for (var i = this.starfield.stars.length - 1; i >= 0; i--) {
				stage.addChild( this.starfield.stars[i] );
			};
			
			stage.addChildAt( this.hero, this.starfield.stars.length );

			this.exit();				
		},
		resetBehavior: function() {
			this.soundInstance.stop();
			this.hero.standDown();
			this.hero.moveToCenter(this.canvas);
			this.hero.movingUp = false;
			this.hero.movingDown = false;
			this.hero.movingLeft = false;
			this.hero.movingRight = false;
			this.starfield.changeStarSpeed('slow');
			this.starfield.stretchStarHeight('original');
			this.gameStarted = false;
			this.gameState = 'riff';
			this.planet.removeFromView(this.stage);
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

			this.soundInstance.addEventListener('complete', function(e) {
				if (callback && typeof(callback) == 'function')
					callback(e);
			}, false);

			if (this.debugMode) this.soundInstance.volume = 0;
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
		},
		supportCheck: function() {
			var warningBox = document.querySelector('.browser-warning-box');
			var warningList = document.querySelector('.browser-warning-box ul');
			var closeButton = document.querySelector('.close-warning-button');
			var missingFeatures = [];
			
			if (!Helpers.featureDetect.audioOgg && !Helpers.featureDetect.audioWav) {
				missingFeatures.push('Missing support for Ogg or WAVE audio formats');
			}

			if (!Helpers.featureDetect.canvas) {
				missingFeatures.push('Missing support for Canvas');
			}

			if (missingFeatures.length) {

				for (var i = 0; i < missingFeatures.length; i++) {
					var feature = missingFeatures[i];
					var listElm = document.createElement('li');

					listElm.textContent = feature;
					warningList.appendChild(listElm);
				};

				closeButton.addEventListener('click', function() {
					warningBox.style.display = 'none';
				});

				warningBox.style.display = 'table';
			}
		}
	}

	return Environment;
});