requirejs.config({
	paths : {
		colors : '/bower_components/colors/js/colors',
		createjs : '//code.createjs.com/createjs-2014.12.12.min',
		//LOAD OUR OWN MODULES
		App : '/js/app',
		Preloader : '/js/states/preloader',
		Environment : '/js/states/environment',
		LeadIn : '/js/states/leadin',
		Chorus1 : '/js/states/chorus1',
		Chorus2 : '/js/states/chorus2',
		//	Background : '/js/entities/background',
		Hero : '/js/entities/hero',
		Hater : '/js/entities/hater',
		HaterManager: '/js/entities/hatermanager',
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