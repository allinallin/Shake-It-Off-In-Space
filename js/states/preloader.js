define('Preloader', [	
	'createjs'
], function(c){
	var Preloader;

	//list of assets to load
	var assetManifest = [
		{id:'bass', src:'/media/audio/XUXPSET3.mp3'},
		{id:'synth', src:'/media/audio/EFXE_1.mp3'},
		{id:'riff', src:'/media/audio/riff.ogg'},

		{id:'leadin', src:'/media/audio/leadin.ogg'},
		{id:'chorus1', src:'/media/audio/chorus1.ogg'},
		{id:'chorus2', src:'/media/audio/chorus2.ogg'},

		{id:'planet', src:'/media/images/planet-surface.png'},

		{id:'hero', src:'/media/images/player.png'},
		{id:'hero-flying', src:'/media/images/player-flying.png'},
		{id:'hero-left', src:'/media/images/player-left.png'},
		{id:'hero-right', src:'/media/images/player-right.png'},
		{id:'hero-up', src:'/media/images/player-up.png'},
		{id:'hero-down', src:'/media/images/player-down.png'},

		{id:'monster1', src:'/media/images/monster-mayer.png'},
		{id:'monster2', src:'/media/images/monster-gyllenhaal.png'},
		{id:'monster3', src:'/media/images/monster-lautner.png'},
		{id:'monster4', src:'/media/images/monster-jonas.png'},
	];

	Preloader = {
		enter : function(canvas, stage){
			this.queue = new createjs.LoadQueue();
			this.queue.installPlugin(createjs.Sound);
			this.queue.loadManifest(assetManifest);
			this.queue.addEventListener('complete', this.exit.bind(this));						
		},
		exit : function(){
			this.onExit();
		}
	}

	return Preloader;

});