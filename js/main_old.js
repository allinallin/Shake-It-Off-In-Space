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

	

	var song;
	var music;
	

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
	}

	

	function playMusic ( sectionName ) {
	}

	function loadLeadin () {
	}

	function loadChorus1 () {
	}

	function prepLandingScene () {
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

	

	function planetInit() {}

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
	}

	/**
	 * If the number of current haters
	 * on the board is less than 20,
	 * create a new Hater and drop it on the board
	 */
	function dropInHater () {
	}
	function popOffHater ( hater ) {
	}

	function stickHaterToHero ( haterObj, overlapDetails ) {
	}

	function addHaterRattle( haterObj ) {	}

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
	}

	Hero.prototype = Object.create(c.Container.prototype);
	Hater.prototype = Object.create(c.Container.prototype);

	window.Hero = Hero;
	window.Hater = Hater;

	init();
})(window, document, createjs);
