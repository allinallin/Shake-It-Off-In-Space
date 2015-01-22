define('App', [
	'createjs',
	'Preloader',
	'Environment',
	'LeadIn',
	'Chorus1'
//	'Play',
//	'GameOver'
], function(c, Preloader, Env, LeadIn, Chorus1){
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

			Env.hero.movingUp = false;
			Env.hero.movingDown = false;

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
			// var that = this;
			// //start Menu state			
			// Menu.enter(this.canvas, this.stage);
			// Menu.onExit = function(data){				
			// //	that.gotoPlay();
			// }
		},
		gotoGameOver : function(){
			// var that = this;
			// //start Play state
			// Play.enter(this.canvas, this.stage, this.assets);
			// Play.onExit = function(data){
			// 	console.log('Game Over');
			// }
		}
	}

	return App;
});


//$(document).ready(function(){
	//dido.world.init('#game_canvas');
//});