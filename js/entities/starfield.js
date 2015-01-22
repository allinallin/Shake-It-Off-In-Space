define('Starfield',[	
	'createjs',
	'colors'
], function(c){
	var Starfield;
	
	var numStars = 110;
	var canvas = document.querySelector('.main-stage');
	var fftSize = 1024;

	Starfield = function(opts){
		this.stars 			= [];
		this.starsLittle 	= [];
		this.starsBig		= [];
		this.starsAlpha 	= [];

		var g;		
		g = new createjs.Graphics();
		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(255,255,255));
		g.beginFill(createjs.Graphics.getRGB(255,255,255));
		g.drawCircle(0,0, 1);
				
		for(var i = 0; i < numStars; ++i) {
	        var s = new createjs.Shape(g);
		    s.x = getRandomInt(10, canvas.width - 10);
		    s.y = getRandomInt(-250, canvas.height - 10);
		    s.speed = getRandomInt(3, 7);
		    
		    if (i < 100) {
		    	s.alpha = Math.random() + 0.2;

			    s.scaleX = getRandomInt(0.5, 2);
		        s.scaleY = s.scaleX;

		    	if (s.scaleX > 1)
					this.starsBig.push(s);
				else
					this.starsLittle.push(s);
			} else {
		    	s.alpha = 0.03;
				this.starsAlpha.push(s);
			}

		    this.stars.push(s);
		}
	};

	Starfield.prototype = {
		updateStarField: function () {
		    var curStar;
		    var limit = this.stars.length;
		    for(var i = 0; i < limit; ++i) {
		        curStar = this.stars[i];
			    curStar.y += curStar.speed;
			    if(curStar.y > canvas.height)
			    {
		            curStar.x = getRandomInt(10, canvas.width - 10);
			        curStar.y = -getRandomInt(20, canvas.height - 30);					
			    }
		    }
		},
		stretchStarHeight: function(scaleFactor) {	
			var scaleValue = scaleFactor;

			for (var i = 0; i < 100; i++) {
				var star = this.stars[i];

				if (scaleFactor == 'original')
					scaleValue = star.scaleX;

				createjs.Tween.get(star, {loop: false})
					.to({scaleY: scaleValue}, 500);
			};
		},
		changeStarSpeed: function(speed) {
			switch (speed) {
				case 'stop':
					for (var i = stars.length - 1; i >= 0; i--) {
						this.stars[i].speed = 0;
					}	
					break;
				case 'fast':
					for (var i = stars.length - 1; i >= 0; i--) {
						this.stars[i].speed = getRandomInt(10, 15);
					}	
					break;
				case 'slow':
					for (var i = stars.length - 1; i >= 0; i--) {
						this.stars[i].speed = getRandomInt(3, 7);
					}
					break;
			}
		},
		colorStarsAlpha: function(red, green, blue) {
			if (red != 'randomize') {
				var g = new createjs.Graphics();
				g.setStrokeStyle(1);
				g.beginStroke(createjs.Graphics.getRGB(red,green,blue));
				g.beginFill(createjs.Graphics.getRGB(red,green,blue));
				g.drawCircle(0,0,1);
			}

			for (var i = starsAlpha.length - 1; i >= 0; i--) {
				if (red == 'randomize') {
					var colorHex = colors[pickRandomProperty(colors)],
						color = hexToRgb( colorHex );

					var g = new createjs.Graphics();
					g.setStrokeStyle(1);
					g.beginStroke(createjs.Graphics.getRGB(color.r, color.g, color.b));
					g.beginFill(createjs.Graphics.getRGB(color.r, color.g, color.b));
					g.drawCircle(0,0,1);
				}

				this.starsAlpha[i].graphics = g;
			}
		},
		analyseMusic: function() {
			// get the context.  NOTE to connect to existing nodes we need to work in the same context.
			var context = createjs.Sound.activePlugin.context;

			// create an analyser node
			this.analyserNode = context.createAnalyser(); 
			this.analyserNode.fftSize = fftSize; //The size of the FFT used for frequency-domain analysis. This must be a power of two
			this.analyserNode.smoothingTimeConstant = 0.85; //A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame
			this.analyserNode.connect(context.destination); // connect to the context.destination, which outputs the audio

			// attach visualizer node to our existing dynamicsCompressorNode, which was connected to context.destination
			var dynamicsNode = createjs.Sound.activePlugin.dynamicsCompressorNode;
			dynamicsNode.disconnect(); // disconnect from destination
			dynamicsNode.connect(this.analyserNode);

			// set up the arrays that we use to retreive the analyserNode data
			this.freqFloatData = new Float32Array(this.analyserNode.frequencyBinCount);
			this.freqByteData = new Uint8Array(this.analyserNode.frequencyBinCount);
			this.timeByteData = new Uint8Array(this.analyserNode.frequencyBinCount);
		},
		updateVisualiser: function() {
			this.analyserNode.getFloatFrequencyData(this.freqFloatData); // get dBs
			this.analyserNode.getByteFrequencyData(this.freqByteData); // get frequency
			this.analyserNode.getByteTimeDomainData(this.timeByteData); // get waveform
			
			var freqValue = this.freqByteData[25],
				freqPercent = freqValue / 255;

			var radiusRatioLarge = freqPercent * 100;
			var radiusRatioSmall = freqPercent * 50;

			for (var i = this.starsAlpha.length - 1; i >= 0; i--) {
				if (i < 5) {
					this.starsAlpha[i].scaleX = radiusRatioLarge;
					this.starsAlpha[i].scaleY = radiusRatioLarge;
				} else {
					this.starsAlpha[i].scaleX = radiusRatioSmall;
					this.starsAlpha[i].scaleY = radiusRatioSmall;
				}
			}
	    }
	}	

	return Starfield;
})