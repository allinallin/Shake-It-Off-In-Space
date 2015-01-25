requirejs.config({
    baseUrl: '.',
	paths : {
		colors : '../bower_components/colors/js/colors',
		createjs : '//code.createjs.com/createjs-2014.12.12.min',
		//LOAD OUR OWN MODULES
		Helpers : 'util/helpers',
		App : 'app',
		Preloader : 'states/preloader',
		Environment : 'states/environment',
		LeadIn : 'states/leadin',
		Chorus1 : 'states/chorus1',
		HateSession: 'states/hatesession',
		Chorus2 : 'states/chorus2',
		ShakeItSession: 'states/shakeitsession',
		GameOver: 'states/gameover',
		//	Background : 'entities/background',
		Hero : 'entities/hero',
		Hater : 'entities/hater',
		Starfield : 'entities/starfield',
		Planet : 'entities/planet'
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