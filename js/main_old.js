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

	function loadChorus2 () {}

	function onCompleteMusic ( sectionName ) {}

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

	function shakeItInit () {}

	function shakeItAttack (key) {}

	function shakeItIndicatorDisplay() {}

	function shakeItKeyUpListener (e) {}

	function shakeItKeyDownListener (e) {}
	/* 					*\
		GLOBAL LISTENERS
	\*					*/

	function keyDownListener (e) {}

	function keyUpListener (e) {}

	function startGame() {
	}

	function endGame() {}

	function hateSession () {
	}

	init();
})(window, document, createjs);
