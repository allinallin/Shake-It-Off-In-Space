define('App', [
	'createjs',
	'Preloader',
	'Environment'
//	'Play',
//	'GameOver'
], function(c, Preloader, Environment){
	var App;

	App = {
		initialize : function(){			
			var that = this;

			//initialize canvas and stage
			this.canvas = document.querySelector('.main-stage');
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;

			this.stage = new createjs.Stage(this.canvas);
			
			createjs.Sound.alternateExtensions = ['wav'];
			createjs.MotionGuidePlugin.install();

			//start preloader
			Preloader.onExit = function(){
				console.log('Preloader done!');
				that.setUpEnvironment();
			}

			Preloader.enter(this.canvas, this.stage);
		},
		setUpEnvironment : function() {
			var that = this;

			var title = document.querySelector('.title');
			var playButton = document.querySelector('.play-button');
			var launchButton = document.querySelector('.launch-button');
			var helpBox = document.querySelector('.help-box');

			playButton.addEventListener('click', function() {
				helpBox.style.display = 'table';
				canvas.focus();
			}, false);

			replayButton.addEventListener('click', this.goToLeadIn.bind(this), false);
			launchButton.addEventListener('click', this.goToLeadIn.bind(this), false);

			Environment.onExit = function() {
				console.log('Environment done!');
			}

			Environment.enter(this.canvas, this.stage);
		},
		goToLeadIn : function() {

		},
		goToRiff : function() {

		},
		gotoMenu : function(){
			// var that = this;
			// //start Menu state			
			// Menu.enter(this.canvas, this.stage);
			// Menu.onExit = function(data){				
			// //	that.gotoPlay();
			// }
		},
		gotoPlay : function(){
			// var that = this;
			// //start Play state
			// Play.enter(this.canvas, this.stage, this.assets);
			// Play.onExit = function(data){
			// 	console.log('Game Over');
			// }
		},
		gotoGameOver : function(){

		}

	}

	return App;
});


//$(document).ready(function(){
	//dido.world.init('#game_canvas');
//});