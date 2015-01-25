define('Hater',[	
	'createjs',
	'Preloader',
	'Helpers'
], function(c, Preloader, Helpers){
	var Hater;
	var haterMethods;

	Hater = function(opts){
		var bmp = new createjs.Bitmap(Preloader.queue.getResult('monster' + Helpers.getRandomInt(1,5)));
		bmp.scaleX = 0.9;
		bmp.scaleY = 0.9;
		
		createjs.Container.call(this);

		this.haterBody = bmp;
		this.addChild( this.haterBody );

		for (var prop in opts) {
			this[prop] = opts[prop];
		}
	};

	haterMethods = {
		moveToTarget: function(target, canvas, stage) {
			createjs.Tween.get(this, {loop: false})
				.to(this.getDropOutPoints(target.x, target.y, canvas), 2000, createjs.Ease.quadIn)
				.call(this.remove.bind(this, stage));
		},
		remove: function(stage) {
			createjs.Tween.removeTweens(this);
			this.removeAllEventListeners();
			this.stage.removeChild( this );
		},
		getDropOutPoints: function(xIn, yIn, canvas) {
			var m = (yIn - this.y) / (xIn - this.x),
				x = this.x > 0 ? -100 : canvas.width,
				b = getYIntercept.call(this),
				y = m * x + b,
				dropOutPoints = {x: x, y: y};

			function getYIntercept () {
				//   this.y = m(this.x) + b
				// + yIn    = m(xIn)    + b
				// ------------------------
				// this.y + yIn = m(this.x+xIn) + 2b

				return ( (this.y + yIn) - m*(this.x + xIn) ) / 2;
			}

			return dropOutPoints;
		},
		rattle: function() {
			this.rattleStage = Helpers.getRandomInt(1, 4);
			this.rattleCounter = 0;
			this.isRattling = true;

			var rattleLength = 0.05;
			var rattleMaxFrames = rattleLength * createjs.Ticker.getFPS();

			var intervalInstance = window.requestAnimationFrame( _moveIt.bind(this) );

			function _moveIt () {
				var offset = 10;
				var stage = this.rattleStage;

				switch ( stage ) {
					case 1:
				        this.y = this.y + offset;
				        break;
				    case 2:
				        this.x = this.x + offset;
				        break;
				    case 3:
				        this.y = this.y - offset;
				        break;
				    default:
				        this.x = this.x - offset;
				        break;
			    }

			    this.rattleStage = (stage < 4) ? stage + 1 : 1;

			    if (this.isRattling && this.rattleCounter < rattleMaxFrames) {
			    	this.rattleCounter++;
			    	intervalInstance = window.requestAnimationFrame( _moveIt.bind(this) );
			    } else {
			    	this.isRattling = false;
			    	window.cancelAnimationFrame(intervalInstance);
			    }
			}
		}
	};

	Hater.prototype = Object.create(createjs.Container.prototype);
	Helpers.extendObject(Hater.prototype, haterMethods);

	return Hater;
})