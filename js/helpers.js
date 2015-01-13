(function (window) {
	/**
	 * Custom project-specific substitute for Modernizr. Tests pulled
	 * from: http://diveintohtml5.info/everything.html
	 * @type {Object}
	 */
	window.featureDetect = {
		audio: function() {
			return !!document.createElement('audio').canPlayType;
		},
		audioOgg: function() {
			var a = document.createElement('audio');
			return !!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
		},
		audioWav: function() {
			var a = document.createElement('audio');
			return !!(a.canPlayType && a.canPlayType('audio/wav; codecs="1"').replace(/no/, ''));
		},
		canvas: function() {
			return !!document.createElement('canvas').getContext;
		}
	};
	/**
	 * Returns the value of a randomly chosen property from a given object
	 * @param  [Object] obj Object that has properties to be randomly chosen form
	 * @return Value of chosen property
	 */
	window.pickRandomProperty = function (obj) {
	    var result;
	    var count = 0;
	    for (var prop in obj)
	        if (Math.random() < 1/++count)
	           result = prop;
	    return result;
	}

	/**
	 * Choose a random number between two given inputs
	 * @param  {Int} min Lower boundary
	 * @param  {Int} max Upper boundary
	 * @return {Int}     Random number between min and max
	 */
	window.getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	window.detectOverlap = function (rect1, rect2) {
		var a = {
				x: rect1.x,
				y: rect1.y,
				xOffset: rect1.getBounds().x,
				yOffset: rect1.getBounds().y,
				xReal: rect1.x + rect1.getBounds().x,
				yReal: rect1.y + rect1.getBounds().y,
				width: rect1.getBounds().width,
				height: rect1.getBounds().height
			};
		var b = {
				x: rect2.x,
				y: rect2.y,
				xOffset: rect2.getBounds().x,
				yOffset: rect2.getBounds().y,
				xReal: rect2.x + rect2.getBounds().x,
				yReal: rect2.y + rect2.getBounds().y,
				width: rect2.getBounds().width,
				height: rect2.getBounds().height
			};
		var details = {
			success: false,	// boolean
			xHit: null, 	// float
			xSide: null,	// string
			yHit: null,		// float
			ySide: null		// string
		}

		if ( a.xReal >= b.xReal + b.width || a.xReal + a.width <= b.xReal || a.yReal >= b.yReal + b.height || a.yReal + a.height <= b.yReal ) {
			return details;
		} else {
			details.success = true;
			
			if (b.xReal <= a.xReal && a.xReal <= b.xReal + b.width) {
				details.xHit = Math.round( a.xReal - b.xReal );
				details.xSide = 'right';
			} else {
				details.xHit = Math.round( a.xReal + a.width - b.xReal );
				details.xSide = 'left';
			}

			details.yHit = Math.round( a.yReal - b.yReal );

			return details;
		}
	}

	window.hexToRgb = function (hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	 
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	 
	// MIT license
	 
	var animationFramePolyfill = (function() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
	                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
	 
	    if (!window.requestAnimationFrame)
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
	              timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	 
	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	}());
})(window);