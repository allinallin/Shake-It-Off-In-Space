requirejs.config({
	shim : {		
		'App' : { 
			//make sure these modules are loaded before starting the app
			deps : ['createjs', 'colors']			
		} 	
	},
	paths : {
		'colors' : '/bower_components/colors/js/colors',
		'createjs' : '//code.createjs.com/createjs-2014.12.12.min',
		// LOAD OUR OWN MODULES
		'App' : '/js/app',
		'Preloader' : '/js/states/preloader',
	//	'Play' : '/js/states/play',
		'Environment' : '/js/states/environment',
	//	'GameOver' : '/js/states/gameover',	
	//	'Background' : '/js/entities/background',
		'Hero' : '/js/entities/hero',
		'Starfield' : '/js/entities/starfield'
	//	'Hater' : '/js/entities/hater'
	},
	urlArgs : "bust="+(new Date()).getTime()
});

require(['App'], function(App){	
	App.initialize();		
});