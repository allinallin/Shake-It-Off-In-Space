(function (window, document, c) {
	'use strict';

	var stage
	var queue;

	var hero;
	var hater;

	var song;
	var music;
	
	var haterInterval = null;
	var haterCounter;

	var stars;
	var starsLittle;
	var starsBig;
	var starsAlpha;
	var numStars;
	var planet;
	
	var canvas = document.querySelector('.main-stage');
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	
	var gameStarted;
	var gameState;
	var countdown = document.querySelector('.countdown');

	var gameOverMsg = document.querySelector('.game-over');
	var replayButton = document.querySelector('.replay-button');

	var shakeIt = {
		hitCounter: null,
		enemyCounter: null,
		modulusFactor: null,
		windows: [
			[0, 0.8],
			[1.1, 1.9],

			[3.0, 3.8],
			[4.1, 4.9],

			[6.0, 6.8],
			[7.1, 8.9],

			[9.0, 9.8],
			[10.1, 10.9]
		],
		windowHitLimit: 3,
		windowHitLimitTracker: []
	};

	/* DEBUG VARIABLES */
	var	debugMode = false;
	if (debugMode) {
		var buttonHate = document.querySelector('.hate-button');
		var textDecibals = document.querySelector('.decibals');
		var textFrequency = document.querySelector('.frequency');
		var textWaveform = document.querySelector('.waveform');

		buttonHate.addEventListener('click', hateSession);
	}
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	/* 					*\
		INITALIZATION
	\*					*/

	function init () {
		stage = new c.Stage(canvas);
		queue = new c.LoadQueue();
		queue.installPlugin(c.Sound);
		queue.addEventListener('complete', queueReady);
		c.Sound.alternateExtensions = ['wav'];
		queue.loadManifest(
			[
				{id:'bass', src:'/media/audio/XUXPSET3.mp3'},
				{id:'synth', src:'/media/audio/EFXE_1.mp3'},
				{id:'riff', src:'media/audio/riff.ogg'},

				{id:'leadin', src:'media/audio/leadin.ogg'},
				{id:'chorus1', src:'media/audio/chorus1.ogg'},
				{id:'chorus2', src:'media/audio/chorus2.ogg'},

				{id:'planet', src:'media/images/planet-surface.png'},

				{id:'hero', src:'media/images/player.png'},
				{id:'hero-flying', src:'media/images/player-flying.png'},
				{id:'hero-left', src:'media/images/player-left.png'},
				{id:'hero-right', src:'media/images/player-right.png'},
				{id:'hero-up', src:'media/images/player-up.png'},
				{id:'hero-down', src:'media/images/player-down.png'},

				{id:'monster1', src:'media/images/monster-mayer.png'},
				{id:'monster2', src:'media/images/monster-gyllenhaal.png'},
				{id:'monster3', src:'media/images/monster-lautner.png'},
				{id:'monster4', src:'media/images/monster-jonas.png'},
			]
		);

		c.MotionGuidePlugin.install();
	}

	function queueReady () {
		c.Ticker.setFPS(60);
		c.Ticker.addEventListener('tick', updateStage);

		numStars = 110;
		
		createStarField();
		analyseMusic();

		hero   = new Hero();
		hero.x = canvasWidth / 2;
		hero.y = canvasHeight / 2;

		stage.addChildAt( hero, numStars );

		setTimeout(function() {
			playMusic( 'riff' );
		}, 20);
	}

	/* 					*\
		INSTRUCTIONS
	\*					*/
	var title = document.querySelector('.title');
	var playButton = document.querySelector('.play-button');
	var launchButton = document.querySelector('.launch-button');
	var helpBox = document.querySelector('.help-box');

	playButton.addEventListener('click', function() {
		helpBox.style.display = 'table';
		canvas.focus();
	}, false);

	replayButton.addEventListener('click', startGame, false);
	launchButton.addEventListener('click', startGame, false);

	/* 			*\
		MUSIC
	\*			*/
	
	var analyserNode;       // the analyser node that allows us to visualize the audio
	var fftSize = 1024;
	var freqFloatData, freqByteData, timeByteData;  // arrays to retrieve data from analyserNode
	// global constants
    var FFTSIZE = 1024;      // number of samples for the analyser node FFT, min 32
   
	function analyseMusic() {
		// get the context.  NOTE to connect to existing nodes we need to work in the same context.
		var context = c.Sound.activePlugin.context;

		// create an analyser node
		analyserNode = context.createAnalyser(); 
		analyserNode.fftSize = fftSize; //The size of the FFT used for frequency-domain analysis. This must be a power of two
		analyserNode.smoothingTimeConstant = 0.85; //A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame
		analyserNode.connect(context.destination); // connect to the context.destination, which outputs the audio

		// attach visualizer node to our existing dynamicsCompressorNode, which was connected to context.destination
		var dynamicsNode = c.Sound.activePlugin.dynamicsCompressorNode;
		dynamicsNode.disconnect(); // disconnect from destination
		dynamicsNode.connect(analyserNode);

		// set up the arrays that we use to retreive the analyserNode data
		freqFloatData = new Float32Array(analyserNode.frequencyBinCount);
		freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
		timeByteData = new Uint8Array(analyserNode.frequencyBinCount);
	}
	

	var soundInstance;

	function playMusic ( sectionName ) {
		if (soundInstance)
			soundInstance.removeAllEventListeners();

		soundInstance = c.Sound.play( sectionName );

		if (debugMode) soundInstance.volume = 0;

		soundInstance.addEventListener('complete', function() {
			onCompleteMusic( sectionName );
		});
	}

	function loadLeadin () {
		var sectionOffset = 3000,
			hitThree, hitTwo, hitOne, hitYeah;

		countdown.style.display = 'block';
		countdown.textContent = 'Ready...';

		gameState = 'leadin';

		var intervalInstance = window.requestAnimationFrame(_getPosition);
		
		function _getPosition () {
			if (gameState != 'leadin')
				window.cancelAnimationFrame(intervalInstance);

			var position = soundInstance.getPosition();

			if (!hitOne && position > 5525 - sectionOffset) {
				hitOne = true;
				countdown.textContent = '1';
				colorStarsAlpha('randomize');
			}
			else if (!hitTwo && position > 5150 - sectionOffset){
				hitTwo = true;
				countdown.textContent = '2';
				colorStarsAlpha('randomize');
			}
			else if (!hitThree && position > 4775 - sectionOffset) {
				hitThree = true;
				countdown.textContent = '3';
				colorStarsAlpha('randomize');
			}
			else if (!hitYeah && position > 4313 - sectionOffset) {
				hitYeah = true;
				countdown.textContent = 'YEEAHH!';
			}
			
			if (gameState == 'leadin')
				intervalInstance = window.requestAnimationFrame(_getPosition);
		}

		//window.cancelAnimationFrame(intervalInstance);
	}

	function loadChorus1 () {
		gameState = 'chorus1';

		hateSession();
		countdown.style.display = 'none';
		changeStarSpeed( 'fast' );
		stretchStarHeight( 10 );

		var sectionOffset = 6000,
			hitLanding;

		var intervalInstance = window.requestAnimationFrame(_getPosition);
		
		function _getPosition () {
			if (gameState != 'chorus1')
				window.cancelAnimationFrame(intervalInstance);

			var position = soundInstance.getPosition();

			if (!hitLanding && position > 15000 - sectionOffset) {
				hitLanding = true;
				prepLandingScene();
			}
			
			if (gameState == 'chorus1')
				intervalInstance = window.requestAnimationFrame(_getPosition);
		}

		//window.cancelAnimationFrame(intervalInstance);
	}

	function prepLandingScene () {
		changeStarSpeed( 'slow' );

		stretchStarHeight( 'original' );
		planetInit();

		hero.rotation = 0;
		hero.movingUp = false;
		hero.movingDown = false;
		hero.movingLeft = false;
		hero.movingRight = false;

		gameState = 'landing';

		c.Tween.get(hero, {loop: false, override: true})
			.to({
				x: canvasWidth / 2,
				y: canvasHeight - hero.getBounds().height
			}, 2000, c.Ease.quadOut);
	}

	function loadChorus2 () {
		gameState = 'chorus2';
		shakeItInit();
	}

	function onCompleteMusic ( sectionName ) {
		switch ( sectionName ) {
			case 'riff':
				if (gameStarted) {
					playMusic( 'leadin' ); 
					loadLeadin();
					//loadChorus1();
				} else {
					playMusic( 'riff' );
				}
				break;
			case 'leadin':
				playMusic( 'chorus1' );
				loadChorus1();
				break;
			case 'chorus1':
				playMusic( 'chorus2' );
				loadChorus2();
				break;
			case 'chorus2':
				endGame();
				break;
		}
	}

	/* 				*\
		ENVIRONMENT
	\*				*/

	function createStarField() {
		var g;		
		stars 		= new Array();
		starsLittle = new Array();
		starsBig 	= new Array();
		starsAlpha 	= new Array();

		g = new c.Graphics();
		g.setStrokeStyle(1);
		g.beginStroke(c.Graphics.getRGB(255,255,255));
		g.beginFill(c.Graphics.getRGB(255,255,255));
		g.drawCircle(0,0, 1);
				
		for(var i = 0; i < numStars; ++i) {
	        var s = new c.Shape(g);
		    stars.push(s);
		    s.x = getRandomInt(10, canvasWidth - 10);
		    s.y = getRandomInt(-250, canvasHeight - 10);
		    s.speed = getRandomInt(3, 7);
		    
		    if (i < 100) {
		    	s.alpha = Math.random() + 0.2;

			    s.scaleX = getRandomInt(0.5, 2);
		        s.scaleY = s.scaleX;

		    	if (s.scaleX > 1)
					starsBig.push(s);
				else
					starsLittle.push(s);
			} else {
		    	s.alpha = 0.03;
				starsAlpha.push(s);
			}
		
			stage.addChild( s );
		}
	}

	function stretchStarHeight ( scaleFactor ) {
		var scaleValue = scaleFactor;

		for (var i = 0; i < 100; i++) {
			var star = stars[i];

			if (scaleFactor == 'original')
				scaleValue = star.scaleX;

			c.Tween.get(star, {loop: false})
				.to({scaleY: scaleValue}, 500);
		};
	}

	function changeStarSpeed (speed) {
		switch (speed) {
			case 'stop':
				for (var i = stars.length - 1; i >= 0; i--) {
					stars[i].speed = 0;
				}	
				break;
			case 'fast':
				for (var i = stars.length - 1; i >= 0; i--) {
					stars[i].speed = getRandomInt(10, 15);
				}	
				break;
			case 'slow':
				for (var i = stars.length - 1; i >= 0; i--) {
					stars[i].speed = getRandomInt(3, 7);
				}
				break;
		}
	}

	function updateStage () {

		updateStarField();
		updateVisualiser();
		stage.update();
	}
	function colorStarsAlpha(red, green, blue) {
		if (red != 'randomize') {
			var g = new c.Graphics();
			g.setStrokeStyle(1);
			g.beginStroke(c.Graphics.getRGB(red,green,blue));
			g.beginFill(c.Graphics.getRGB(red,green,blue));
			g.drawCircle(0,0,1);
		}

		for (var i = starsAlpha.length - 1; i >= 0; i--) {
			if (red == 'randomize') {
				var colorHex = colors[pickRandomProperty(colors)],
					color = hexToRgb( colorHex );

				var g = new c.Graphics();
				g.setStrokeStyle(1);
				g.beginStroke(c.Graphics.getRGB(color.r, color.g, color.b));
				g.beginFill(c.Graphics.getRGB(color.r, color.g, color.b));
				g.drawCircle(0,0,1);
			}

			starsAlpha[i].graphics = g;
		}
	}

	function updateVisualiser () {
		analyserNode.getFloatFrequencyData(freqFloatData); // get dBs
		analyserNode.getByteFrequencyData(freqByteData); // get frequency
		analyserNode.getByteTimeDomainData(timeByteData); // get waveform
		
		var freqValue = freqByteData[25],
			freqPercent = freqValue / 255;

		if (debugMode) {
			textDecibals.innerHTML = freqFloatData[0];
			textFrequency.innerHTML = freqValue;
			textWaveform.innerHTML = timeByteData[0];
		}

		var radiusRatioLarge = freqPercent * 100;
		var radiusRatioSmall = freqPercent * 50;

		for (var i = starsAlpha.length - 1; i >= 0; i--) {
			if (i < 5) {
				starsAlpha[i].scaleX = radiusRatioLarge;
				starsAlpha[i].scaleY = radiusRatioLarge;
			} else {
				starsAlpha[i].scaleX = radiusRatioSmall;
				starsAlpha[i].scaleY = radiusRatioSmall;
			}
		}
    }

	function updateStarField () {
	    var curStar;
	    var limit = stars.length;
	    for(var i = 0; i < limit; ++i) {
	        curStar = stars[i];
		    curStar.y += curStar.speed;
		    if(curStar.y > canvasHeight)
		    {
	            curStar.x = getRandomInt(10, canvasWidth - 10);
		        curStar.y = -getRandomInt(20, canvasHeight - 30);					
		    }
	    }
	}

	function planetInit() {
		// init planet
		var scale = 1;
		var g = new c.Graphics();
		g.f("rgba(255,161,49,254)").p("EDP0ARMYjcgKBQg8kEhaYkEhaAyEOgyAUYgyAei+AomQgKYmQgKhaj6iggKYigAAl8CCjIgKYjIAAjciqhaAKYhaAKqKDIi+huYi+hui0AKAAAAYAAAAq8BQgyAeYgyAenMAyi+iWYi+iMnqCMAAAAIAAQuMBq4AAAIAArkYAAAAAKiMjcgU").cp().ef().f("rgba(232,150,42,254)").p("EDP0ARMYjcgKBQg8kEhaYkEhaAyEOgyAUYgyAei+AomQgKYmQgKhaj6iggKYigAAl8CCjIgKYjIAAjciqhaAKYhaAKqKDIi+huYi+hui0AKAAAAYAAAAq8BQgyAeYgyAenMAyi+iWYi+iMnqCMAAAAIAADwYDcAKE2AKGGAKYImAAKygoL4AyYH0AeH+BQISA8YH+A8H0AeH0BaYEiAyEsA8EYBQIAAnqYAAAAAKiMjcgU").cp().ef().f("rgba(255,161,49,254)").p("EC7CASwYlygehajmiggKYgUAAgoAAgoAKYC0FKJsAUhQha").cp().ef().f("rgba(255,161,49,254)").p("EDOuARCYiMgUAogyjmhQYg8gegyAKgeAKYBaE2F8g8AAha").cp().ef().f("rgba(255,161,49,254)").p("ECRKAP8YgygKgogKgegKYi+hui0AKAAAAYAAAAiqAUi0AUYFoCgIcAKg8hQ").cp().ef().f("rgba(255,161,49,254)").p("ECn+AQuYgKgKgKgKgKAAYgoAAgeAAgoAAYjIAAjciqhaAKYAAAAgKAAgKAAYCMD6EEhQEOAK").cp().ef().f("rgba(255,161,49,254)").p("EBsSANwYCgCWCqBQDwhkIgKgKYgygUgygUgogeYhkhGi0AAiMAU").cp().ef().f("rgba(198,120,42,254)").ss(10).s("rgba(198,120,42,254)").p("EB1MAV4YAAAehkAeiCAAYh4AAhugeAAgeYAAgeBugeB4AAYCCAABkAeAAAe").cp().ef().es().f("rgba(198,120,42,254)").ss(10).s("rgba(198,120,42,254)").p("EC+yAauYAAAejIAAj6gKYj6gUjIgeAKgUYAAgeDIAADwAKYD6AUDIAeAAAU").cp().ef().es().f("rgba(198,120,42,254)").ss(10).s("rgba(198,120,42,254)").p("EDMYAb+YAAAUgKAUgKAAYgKAAgKgUAAgUYAAgUAKgUAKAAYAKAAAKAUAAAU").cp().ef().es().f("rgba(198,120,42,254)").ss(6).s("rgba(198,120,42,254)").p("EB7cAWMYgoAKgogKgUgeYgKgoAUgoAegUYAogKAyAKAKAeYAUAogUAogoAU").cp().ef().es().f("rgba(198,120,42,254)").ss(10).s("rgba(198,120,42,254)").p("ECBEAZAYAAAUAoAKAoAAIGkAAYAoAAAegKAAgUIAAAAYAAgUgegKgoAAImkAAYgoAAgoAKAAAUIAAAA").cp().ef().es();

		var s = new c.Shape(g);
		s.setBounds(0,0,681,113);

		var initWidth = s.getBounds().width;

		if (initWidth < canvasWidth)
			scale = canvasWidth / initWidth;
		else
			scale = initWidth / canvasWidth;

		var hackyOrigin = {
			x: -666,
			y: -84,
			transformedX: -666 * scale,
			transformedY: -84 * scale
		}

		s.x = hackyOrigin.transformedX;
		s.y = canvasHeight;
		s.scaleX = scale;
		s.scaleY = scale;

		// add planet to bottom of screen
		planet = s;
		stage.addChildAt( planet, numStars );
		// move planet up into view
		c.Tween.get(planet, {loop: false})
			.to({ y: canvasHeight - planet.getTransformedBounds().height + hackyOrigin.transformedY }, 2000)
			.call(function() { changeStarSpeed('stop')});
	}

	/* 			*\
		PLAYERS
	\*			*/

	/**
	 * Hero constructor
	 */
	function Hero () {
		var that = this;
		var bmp = new c.Bitmap(queue.getResult('hero-flying'));
		bmp.scaleX = 0.7;
		bmp.scaleY = 0.7;
		bmp.x = -bmp.getTransformedBounds().width / 2;
		bmp.y = -bmp.getTransformedBounds().height / 2;

		c.Container.call(this);
		this.setBounds(-bmp.getTransformedBounds().width / 2, -bmp.getTransformedBounds().height / 2, bmp.getTransformedBounds().width, bmp.getTransformedBounds().height)
		this.heroBody = bmp;
		this.addChild( this.heroBody );
	
		this.movingUpDown	= false;
		this.movingLeft 	= false;
		this.movingRight 	= false;

		var movingLeftInterval = null;

		this.moveUp = function() {
			if (!this.movingUpDown) {

				this.movingUpDown = true;

				c.Tween.get(this, {loop: false})
					.to({y: canvasHeight / 2 - 100}, 500, c.Ease.quadOut)
					.to({y: canvasHeight / 2}, 500, c.Ease.quadIn)
					.call(function () { that.movingUpDown = false; });

			}	
		};

		this.moveDown = function() {
			if (!this.movingUpDown) {

				this.movingUpDown = true;

				c.Tween.get(this, {loop: false})
					.to({y: canvasHeight / 2 + 100}, 500, c.Ease.quadOut)
					.to({y: canvasHeight / 2}, 500, c.Ease.quadIn)
					.call(function () { that.movingUpDown = false; });

			}
		}

		var movingLeftAnimId;
		var movingRightAnimId;

		this.moveLeft = function() {
			if (this.movingLeft)
				return;

			window.cancelAnimationFrame(movingRightAnimId);
			this.movingRight = false;
			this.movingLeft = true;
			movingLeftAnimId = window.requestAnimationFrame(tweenLeft);

			function tweenLeft() {
				c.Tween.get(that, {loop: false})
					.to({x: hero.x - 20, rotation: -25}, 100)
					.call(function() { 
						if (that.movingLeft)
							movingLeftAnimId = window.requestAnimationFrame(tweenLeft);
						else
							window.cancelAnimationFrame(movingLeftAnimId);
					});
			}
		}

		this.moveRight = function() {
			if (this.movingRight)
				return;

			window.cancelAnimationFrame(movingLeftAnimId);
			this.movingLeft = false;
			this.movingRight = true;
			movingRightAnimId = window.requestAnimationFrame(tweenRight);

			function tweenRight() {
				c.Tween.get(that, {loop: false})
					.to({x: hero.x + 20, rotation: 25}, 100)
					.call(function() { 
						if (that.movingRight)
							movingRightAnimId = window.requestAnimationFrame(tweenRight);
						else
							window.cancelAnimationFrame(movingRightAnimId);
					});
			}
		}

		this.rotateCenter = function() {
			if (!this.movingLeft && !this.movingRight) {
				c.Tween.get(that, {loop: false})
					.to({ rotation: 0}, 100);
			}
		}


		this.isRattling = false;
		this.rattleStage = getRandomInt(1, 4);
		this.rattleCounter = 0;
		var rattleLength = 0.5;
		var rattleMaxFrames = rattleLength * c.Ticker.getFPS();

		this.rattle = function() {
			this.isRattling = true;
			this.rattleCounter = 0;

			var intervalInstance = window.requestAnimationFrame( _moveIt );

			function _moveIt () {
				var offset = 3;
				var stage = that.rattleStage;

				switch ( stage ) {
					case 1:
				        that.heroBody.y = that.heroBody.y + offset;
				        break;
				    case 2:
				        that.heroBody.x = that.heroBody.x + offset;
				        break;
				    case 3:
				        that.heroBody.y = that.heroBody.y - offset;
				        break;
				    default:
				        that.heroBody.x = that.heroBody.x - offset;
				        break;
			    }

			    that.rattleStage = (stage < 4) ? stage + 1 : 1;

			    if (that.isRattling && that.rattleCounter < rattleMaxFrames) {
			    	that.rattleCounter++;
			    	intervalInstance = window.requestAnimationFrame( _moveIt );
			    } else {
			    	that.isRattling = false;
			    	window.cancelAnimationFrame(intervalInstance);
			    }
			}
		}

		this.standDown = function () {
			this.heroBody.image = queue.getResult('hero-flying');
			this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2;
			this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2;
		}

		this.attackUp = function() {
			this.heroBody.image = queue.getResult('hero-up');
			this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2;
			this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2 - 20;
		}

		this.attackDown = function() {
			this.heroBody.image = queue.getResult('hero-down');
			this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2;
			this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2 + 20;
		}

		this.attackLeft = function() {
			this.heroBody.image = queue.getResult('hero-left');
			this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2 - 20;
			this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2;
		}

		this.attackRight = function() {
			this.heroBody.image = queue.getResult('hero-right');
			this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2 + 20;
			this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2;
		}
	}

	/**
	 * Hater constructor
	 */
	function Hater () {
		var that = this;

		c.Container.call(this);

		var randomMonsterNum = Math.floor((Math.random() * 4) + 1);
		var bmp = new c.Bitmap(queue.getResult('monster' + randomMonsterNum));
		bmp.scaleX = 0.7;
		bmp.scaleY = 0.7;

		this.haterBody = bmp;
		this.addChild( this.haterBody );

		this.moveTo = function(xPos, yPos) {
			this.addEventListener('tick', this.detectOverlapWithPlayer, false);

			c.Tween.get(this, {loop: false})
				.to(this.getDropOutPoints(xPos, yPos), 1800, c.Ease.quadIn)
				.call(this.remove);
		}

		this.moveToPlayer = function() {
			this.addEventListener('tick', this.detectOverlapWithPlayer, false);

			c.Tween.get(this, {loop: false})
				.to(this.getDropOutPoints(hero.x, hero.y), 1800, c.Ease.quadIn)
				.call(this.remove);
		}

		this.remove = function() {
			this.removeEventListener('tick', this.detectOverlapWithPlayer, false);
			stage.removeChild( this );
		}

		this.getDropOutPoints = function(xIn, yIn) {
			var m = (yIn - that.y) / (xIn - that.x),
				x = that.x > 0 ? -100 : canvasWidth,
				b = getYIntercept(),
				y = m * x + b,
				dropOutPoints = {x: x, y: y};

			function getYIntercept () {
				//   that.y = m(that.x) + b
				// + yIn    = m(xIn)    + b
				// ------------------------
				// that.y + yIn = m(that.x+xIn) + 2b

				return ( (that.y + yIn) - m*(that.x + xIn) ) / 2;
			}

			// console.log('y = ' +m+ 'x + ' +b);
			return dropOutPoints;
		}

		this.detectOverlapWithPlayer = function() {
			var overlapDetails = detectOverlap( that, hero );
			if ( overlapDetails.success ) {
				// hero.rattle();
				stickHaterToHero( that.clone(true), overlapDetails );

				that.remove();
				
				var soundChoice = Math.round(Math.random());
				
				if (soundChoice)
					c.Sound.play('bass');
				else
					c.Sound.play('synth');
			}
		}
	}

	/**
	 * If the number of current haters
	 * on the board is less than 20,
	 * create a new Hater and drop it on the board
	 */
	function dropInHater () {
		if (haterCounter < 7) {
			var hater = new Hater();

			hater.x = Math.random() < 0.5 ? -100 : canvasWidth;
			hater.y = getRandomInt( 0, canvasHeight );

			if (hater.x > 0) {
				hater.haterBody.regX = hater.getTransformedBounds().width;
				hater.haterBody.scaleX = -0.7;
			}

			stage.addChild(hater);
			haterCounter++;
			hater.moveToPlayer();

		} else {
			clearInterval( haterInterval );
			haterInterval = null;
		}
	}
	var hatersRemoved = 0;
	function popOffHater ( hater ) {
		var xTarget = (hater.xSide == 'left') ? -canvasWidth / 2 - 100 : canvasWidth / 2;
		var yTarget = hater.y - Math.floor((Math.random() * 200) + 1) - 100;

		c.Tween.get(hater, {loop: false})
			.to({ x: xTarget, y: yTarget }, 500)
			.call(function() { hero.removeChild( hater ) });

		hatersRemoved++;
	}

	function stickHaterToHero ( haterObj, overlapDetails ) {
		if (overlapDetails.xSide == 'left') {
			haterObj.x = hero.heroBody.x + overlapDetails.xHit - haterObj.getBounds().width;
		} else {
			haterObj.x = hero.heroBody.x + overlapDetails.xHit;
		}

		haterObj.xSide = overlapDetails.xSide;
		haterObj.y = hero.heroBody.y + overlapDetails.yHit;

		addHaterRattle( haterObj );

		hero.addChildAt( haterObj, 0 );
	}

	function addHaterRattle( haterObj ) {	
		haterObj.isRattling = false;
		haterObj.rattleStage = getRandomInt(1, 4);
		haterObj.rattleCounter = 0;

		var rattleLength = 0.05;
		var rattleMaxFrames = rattleLength * c.Ticker.getFPS();
		
		var that = haterObj;

		haterObj.rattle = function() {
			that.isRattling = true;
			haterObj.rattleCounter = 0.2;

			var intervalInstance = window.requestAnimationFrame( _moveIt );

			function _moveIt () {
				var offset = 10;
				var stage = that.rattleStage;

				switch ( stage ) {
					case 1:
				        that.y = that.y + offset;
				        break;
				    case 2:
				        that.x = that.x + offset;
				        break;
				    case 3:
				        that.y = that.y - offset;
				        break;
				    default:
				        that.x = that.x - offset;
				        break;
			    }

			    that.rattleStage = (stage < 4) ? stage + 1 : 1;

			    if (that.isRattling && that.rattleCounter < rattleMaxFrames) {
			    	that.rattleCounter++;
			    	intervalInstance = window.requestAnimationFrame( _moveIt );
			    } else {
			    	that.isRattling = false;
			    	window.cancelAnimationFrame(intervalInstance);
			    }
			}
		}
	}

	function shakeItInit () {
		// Read time update
		// Enable listener
		// 
		// Be sure to disable listener
		// 
		var hasEnemies = hero.getNumChildren() > 1;

		if (hasEnemies) {
			var totalChancesToRemove = 24;
			shakeIt.enemyCounter = hero.getNumChildren() - 1;

			shakeIt.modulusFactor = Math.floor( totalChancesToRemove / shakeIt.enemyCounter );
			
			shakeIt.hitCounter = 0;
			shakeIt.windowHitLimitTracker = [];

			for (var i = shakeIt.windows.length - 1; i >= 0; i--) {
				shakeIt.windowHitLimitTracker.push(0);
			};
		}
		
		// console.log('enemies: ' + shakeIt.enemyCounter);
		// console.log('hits to remove 1 enemy: ' + shakeIt.modulusFactor);

		canvas.removeEventListener('keydown', keyDownListener, false);
		canvas.removeEventListener('keyup', keyUpListener, false);
		canvas.removeEventListener('keydown', shakeItKeyDownListener, false);
		canvas.removeEventListener('keyup', shakeItKeyUpListener, false);

		canvas.addEventListener('keydown', shakeItKeyDownListener, false);
		canvas.addEventListener('keyup', shakeItKeyUpListener, false);
	}

	function shakeItAttack (key) {
		var up 			= 87, // W
			down 		= 83, // S
			left 		= 65, // A
			right 		= 68; // D

		switch ( key ) {
			case up:
				hero.attackUp();
				break;
			case down:
				hero.attackDown();
				break;
			case left:
				hero.attackLeft();
				break;
			case right:
				hero.attackRight();
				break;
		}
	}

	function shakeItKeyUpListener (e) {
		hero.standDown();
	}

	function shakeItKeyDownListener (e) {
		var keyList = [87, 83, 65, 68];
		
		if (keyList.indexOf( e.keyCode ) == -1)
			return;

		shakeItAttack( e.keyCode );

		var position = soundInstance.getPosition();

		for (var i = shakeIt.windows.length - 1; i >= 0; i--) {
			var lowerLimit = shakeIt.windows[i][0] * 1000,
				upperLimit = shakeIt.windows[i][1] * 1000;

			if (isInBetween( position, lowerLimit, upperLimit ) && shakeIt.windowHitLimitTracker[i] < 3) {

				shakeIt.hitCounter++;
				shakeIt.windowHitLimitTracker[i]++;

				if (shakeIt.enemyCounter > 0) {
					console.log('rattle')
					for (var i = hero.getNumChildren() - 2; i >= 0; i--) {
						hero.getChildAt(i).rattle();
					}
				}		
				
				if (shakeIt.hitCounter % shakeIt.modulusFactor == 0 && shakeIt.enemyCounter > 0) {
					var hater = hero.getChildAt( shakeIt.enemyCounter - 1 );
					popOffHater( hater );
					shakeIt.enemyCounter--;
				}

				return;
			}
		};

		// console.log('nope');

		function isInBetween(val, min, max) {
			return min <= val && val <= max;
		}

		/*
		var xMovement = e.webkitMovementX,
			yMovement = e.webkitMovementY,
			distanceMoved = Math.sqrt( Math.pow(xMovement, 2) + Math.pow(yMovement, 2) );

		if (distanceMoved > 20) {
			var healthUnits = distanceMoved / 20;
		}
		*/

	}
	/* 					*\
		GLOBAL LISTENERS
	\*					*/

	function keyDownListener (e) {
		//	console.log('key: '+ e.keyCode);

		if (gameState == 'landing' || gameState == 'chorus2')
			return;

		var key 		= e.keyCode,
			up 			= 87, // W
			down 		= 83, // S
			left 		= 65, // A
			right 		= 68, // D
			spacebar	= 32, // spacebar
			isJumping 	= false,
			p 			= 80;

		switch ( key ) {
			case up:
				hero.moveUp();
				break;
			case down:
				hero.moveDown();
				break;
			case left:
				if (!hero.movingLeft)
					hero.moveLeft();
				break;
			case right:
				if (!hero.movingRight)
					hero.moveRight();
				break;
			case p:
				debugMode = !debugMode;
				if (soundInstance)
					soundInstance.volume = !debugMode;
				break;
		}
	}

	function keyUpListener (e) {
		var key 		= e.keyCode,
			up 			= 87, // W
			down 		= 83, // S
			left 		= 65, // A
			right 		= 68, // D
			spacebar	= 32, // spacebar
			isJumping 	= false;

		if (gameState == 'landing' || gameState == 'chorus2')
			return;

		switch ( key ) {
			case up:
				hero.rotateCenter();
				break;
			case down:
				hero.rotateCenter();
				break;
			case left:
				hero.movingLeft = false;
				hero.rotateCenter();
				break;
			case right:
				hero.movingRight = false;
				hero.rotateCenter();
				break;
		}
	}

	canvas.addEventListener('keydown', keyDownListener, false);

	canvas.addEventListener('keyup', keyUpListener, false);

	function startGame() {
		canvas.focus();

		gameStarted = true;

		title.style.display = 'none';
		playButton.style.display = 'none';
		helpBox.style.display = 'none';
		gameOverMsg.style.display = 'none';
		replayButton.style.display = 'none';

		hero.movingUp = false;
		hero.movingDown = false;

		colorStarsAlpha(255, 255, 255);

		if (soundInstance.playState == 'playFinished')
			playMusic( 'riff' );
	}

	function endGame() {
		soundInstance.stop();

		canvas.removeEventListener('keydown', shakeItKeyDownListener, false);
		canvas.removeEventListener('keyup', shakeItKeyUpListener, false);

		canvas.addEventListener('keydown', keyDownListener, false);
		canvas.addEventListener('keyup', keyUpListener, false);

		hero.standDown();
		hero.movingUpDown = false;

		gameStarted = false;
		gameState = 'riff';
		changeStarSpeed( 'slow' );
		clearInterval(haterInterval);
		haterInterval = null;

		gameOverMsg.style.display = 'block';
		replayButton.style.display = 'block';

		if (hero.getNumChildren() > 1) {
			for (var i = hero.getNumChildren() - 2; i >= 0; i--) {
				popOffHater( hero.getChildAt(i) );
			}
		}

		if (planet) {
			c.Tween.get( planet, {loop: false, override: true})
				.to({y: canvasHeight }, 2000)
				.call(function() { stage.removeChild( planet ) });

			c.Tween.get( hero, {loop: false, override: true})
				.to({
					x: canvasWidth / 2,
					y: canvasHeight / 2
				}, 2000, c.Ease.quadOut);
		}
	}

	function hateSession () {
		if (haterInterval == null) {
			haterCounter = 0;
			haterInterval = setInterval(dropInHater, 1000);
		}

		canvas.focus();
	}

	Hero.prototype = Object.create(c.Container.prototype);
	Hater.prototype = Object.create(c.Container.prototype);

	window.Hero = Hero;
	window.Hater = Hater;

	init();
})(window, document, createjs);