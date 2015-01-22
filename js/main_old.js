(function (window, document, c) {
	'use strict';

	(function supportCheck() {
		var warningBox = document.querySelector('.browser-warning-box');
		var warningList = document.querySelector('.browser-warning-box ul');
		var closeButton = document.querySelector('.close-warning-button');
		var missingFeatures = [];
		
		if (!featureDetect.audioOgg && !featureDetect.audioWav) {
			missingFeatures.push('Missing support for Ogg or WAVE audio formats');
		}

		if (!featureDetect.canvas) {
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
	})();

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

	var shakeItIndicator = document.querySelector('.shake-it-indicator');

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
		// var buttonHate = document.querySelector('.hate-button');
		// var textDecibals = document.querySelector('.decibals');
		// var textFrequency = document.querySelector('.frequency');
		// var textWaveform = document.querySelector('.waveform');

		// buttonHate.addEventListener('click', hateSession);
	}
	/* 					*\
		INITALIZATION
	\*					*/

	function init () {
		
	}

	function queueReady () {

		setTimeout(function() {
			playMusic( 'riff' );
		}, 20);
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

		hero.movingUp = false;
		hero.movingDown = false;
		hero.movingLeft = false;
		hero.movingRight = false;
		hero.rotation = 0;

		gameState = 'landing';

		c.Tween.get(hero, {loop: false, override: true})
			.to({
				rotation: 0,
				x: canvasWidth / 2,
				y: canvasHeight - hero.getBounds().height
			}, 2000, c.Ease.quadOut);
	}

	function loadChorus2 () {
		gameState = 'chorus2';
		shakeItInit();
		shakeItIndicatorDisplay();
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
	}

	/**
	 * Hater constructor
	 */
	function Hater () {
		var that = this;

		c.Container.call(this);

		var randomMonsterNum = Math.floor((Math.random() * 4) + 1);
		var bmp = new c.Bitmap(queue.getResult('monster' + randomMonsterNum));
		bmp.scaleX = 0.9;
		bmp.scaleY = 0.9;

		this.haterBody = bmp;
		this.addChild( this.haterBody );

		this.moveTo = function(xPos, yPos) {
			this.addEventListener('tick', this.detectOverlapWithPlayer, false);

			c.Tween.get(this, {loop: false})
				.to(this.getDropOutPoints(xPos, yPos), 2000, c.Ease.quadIn)
				.call(this.remove);
		}

		this.moveToPlayer = function() {
			this.addEventListener('tick', this.detectOverlapWithPlayer, false);

			c.Tween.get(this, {loop: false})
				.to(this.getDropOutPoints(hero.x, hero.y), 2000, c.Ease.quadIn)
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
				hater.haterBody.scaleX = -hater.haterBody.scaleX;
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
			var handicap = -8;
			shakeIt.enemyCounter = hero.getNumChildren() - 1;

			shakeIt.modulusFactor = Math.floor( (totalChancesToRemove + handicap) / shakeIt.enemyCounter );
			
			shakeIt.hitCounter = 0;
			shakeIt.windowHitLimitTracker = [];

			for (var i = shakeIt.windows.length - 1; i >= 0; i--) {
				shakeIt.windowHitLimitTracker.push(0);
			};
		}
		
		console.log('enemies: ' + shakeIt.enemyCounter);
		console.log('hits to remove 1 enemy: ' + shakeIt.modulusFactor);

		canvas.removeEventListener('keydown', keyDownListener, false);
		canvas.removeEventListener('keyup', keyUpListener, false);
		canvas.removeEventListener('keydown', shakeItKeyDownListener, false);
		//canvas.removeEventListener('keyup', shakeItKeyUpListener, false);

		canvas.addEventListener('keydown', shakeItKeyDownListener, false);
		//canvas.addEventListener('keyup', shakeItKeyUpListener, false);
	}

	function shakeItAttack (key) {
		var up 			= 38, // W
			down 		= 40, // S
			left 		= 37, // A
			right 		= 39; // D

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

	function shakeItIndicatorDisplay() {
		var intervalInstance = window.requestAnimationFrame(_getPosition);
		var sectionOffset = 6000;

		shakeItIndicator.style.display = 'block';
		
		function _getPosition () {
			if (gameState != 'chorus2')
				window.cancelAnimationFrame(intervalInstance);

			var position = soundInstance.getPosition();
			var enableFlag;

			for (var i = shakeIt.windows.length - 1; i >= 0; i--) {
				var lowerLimit = shakeIt.windows[i][0] * 1000,
					upperLimit = shakeIt.windows[i][1] * 1000;

				if (isInBetween( position, lowerLimit, upperLimit )) {
					shakeItIndicator.setAttribute('data-mode', 'on');
					enableFlag = true;
					break;
				}

			};
						
			if (!enableFlag)
				shakeItIndicator.setAttribute('data-mode', 'off');
			
			if (gameState == 'chorus2')
				intervalInstance = window.requestAnimationFrame(_getPosition);
		}

		function isInBetween(val, min, max) {
			return min <= val && val <= max;
		}
	}

	function shakeItKeyUpListener (e) {
		hero.standDown();
	}

	function shakeItKeyDownListener (e) {
		var keyList = [38, 40, 37, 39];
		
		if (keyList.indexOf( e.keyCode ) == -1)
			return;

		shakeItAttack( e.keyCode );

		var position = soundInstance.getPosition();

		for (var i = shakeIt.windows.length - 1; i >= 0; i--) {
			var lowerLimit = shakeIt.windows[i][0] * 1000,
				upperLimit = shakeIt.windows[i][1] * 1000;

			if (isInBetween( position, lowerLimit, upperLimit ) && shakeIt.windowHitLimitTracker[i] < 3) {

				++shakeIt.hitCounter;
				++shakeIt.windowHitLimitTracker[i];

				if (shakeIt.enemyCounter > 0) {
					console.log('rattle')
					for (var j = hero.getNumChildren() - 2; j >= 0; j--) {
						hero.getChildAt(j).rattle();
					}
				}		
				
				if (shakeIt.hitCounter % shakeIt.modulusFactor == 0 && shakeIt.enemyCounter > 0) {
					var hater = hero.getChildAt( shakeIt.enemyCounter - 1 );
					popOffHater( hater );
					--shakeIt.enemyCounter;
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
			up 			= 38, // W
			down 		= 40, // S
			left 		= 37, // A
			right 		= 39, // D
			spacebar	= 32, // spacebar
			isJumping 	= false,
			p 			= 80;

		switch ( key ) {
			case up:
				if (!hero.movingUp)
					hero.moveUp();
				break;
			case down:
				if (!hero.movingDown)
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
			up 			= 38, // W
			down 		= 40, // S
			left 		= 37, // A
			right 		= 39, // D
			spacebar	= 32, // spacebar
			isJumping 	= false;

		if (gameState == 'landing' || gameState == 'chorus2')
			return;

		switch ( key ) {
			case up:
				hero.movingUp = false;
				hero.rotateCenter();
				break;
			case down:
				hero.movingDown = false;
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
		shakeItIndicator.style.display = 'none';
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

		shakeItIndicator.style.display = 'none';
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
