requirejs.config({
	paths : {
		colors : '/bower_components/colors/js/colors',
		createjs : '//code.createjs.com/createjs-2014.12.12.min',
		//LOAD OUR OWN MODULES
		Helpers : '/js/util/helpers',
		App : '/js/app',
		Preloader : '/js/states/preloader',
		Environment : '/js/states/environment',
		LeadIn : '/js/states/leadin',
		Chorus1 : '/js/states/chorus1',
		HateSession: '/js/states/hatesession',
		Chorus2 : '/js/states/chorus2',
		ShakeItSession: '/js/states/shakeitsession',
		GameOver: '/js/states/gameover',
		//	Background : '/js/entities/background',
		Hero : '/js/entities/hero',
		Hater : '/js/entities/hater',
		Starfield : '/js/entities/starfield',
		Planet : '/js/entities/planet'
	},
	shim : {
		createjs: {exports: 'createjs'},
		colors: {exports: 'colors'},
		App : { 
			//make sure these modules are loaded before starting the app
			deps : ['createjs']			
		} 	
	},
	urlArgs : "bust="+(new Date()).getTime()
});

require(['App'], function(App){	
	App.initialize();		
});