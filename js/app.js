define('App', [
	'createjs',
	'Preloader',
	'Environment',
	'LeadIn',
	'Chorus1',
	'Chorus2',
	'GameOver'
], function(c, Preloader, Env, LeadIn, Chorus1, Chorus2, GameOver){
	var App;

	App = {
		initialize : function(){
			//initialize canvas and stage
			this.canvas = document.querySelector('.main-stage');
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;

			this.stage = new createjs.Stage(this.canvas);
			
			createjs.Sound.alternateExtensions = ['wav'];
			createjs.MotionGuidePlugin.install();

			function _onExit() {
				console.log('Preloader done!');
				this.setUpEnvironment();
			}

			Preloader.onExit = _onExit.bind(this);
			Preloader.enter(this.canvas, this.stage);
		},
		setUpEnvironment : function() {
			function _onExit() {
				console.log('Environment done!');

				Env.html.playButton.addEventListener('click', function() {
					Env.html.helpBox.style.display = 'table';
					this.blur();
				}, false);

				Env.html.replayButton.addEventListener('click', this.startGame.bind(this), false);
				Env.html.launchButton.addEventListener('click', this.startGame.bind(this), false);
			
				Env.playRiff(this.goToLeadIn.bind(this));
			}

			Env.onExit = _onExit.bind(this);
			Env.enter(this.canvas, this.stage);
		},
		startGame : function() {
			Env.gameStarted = true;

			Env.html.title.style.display = 'none';
			Env.html.playButton.style.display = 'none';
			Env.html.helpBox.style.display = 'none';

			Env.html.gameOverMsg.style.display = 'none';
			Env.html.replayButton.style.display = 'none';

			Env.starfield.colorStarsAlpha(255, 255, 255);

			if (Env.soundInstance.playState == 'playFinished')
				Env.playRiff(this.goToLeadIn.bind(this));
		},
		goToLeadIn : function() {	
			function _onExit() {
				console.log('LeadIn done!');
				this.goToChorus1();
			}

			LeadIn.onExit = _onExit.bind(this);
			LeadIn.enter(this.canvas, this.stage);
		},
		goToChorus1 : function() {
			function _onExit() {
				console.log('Chorus1 done!');
				this.goToChorus2();
			}

			Chorus1.onExit = _onExit.bind(this);
			Chorus1.enter(this.canvas, this.stage);
		},
		goToChorus2 : function(){
			function _onExit() {
				console.log('Chorus2 done!');
				this.gotoGameOver();
			}

			Chorus2.onExit = _onExit.bind(this);
			Chorus2.enter(this.canvas, this.stage);
		},
		gotoGameOver : function(){
			GameOver.enter(this.canvas, this.stage);
		}
	}

	return App;
});


//$(document).ready(function(){
	//dido.world.init('#game_canvas');
//});