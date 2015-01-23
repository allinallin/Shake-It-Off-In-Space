define('HaterManager', [	
	'Hater',
	'Environment'
], function(Hater, Env){
	var HaterManager;
	var canvas = document.querySelector('.main-stage');

	HaterManager = function(opts){		
		this.collidables = [];
		this.x = 0;
		this.y = 0;

		this.haterInterval = null;
		this.haterCounter = 0;
		this.hatersRemoved = 0;

		for (var prop in opts) {
			this[prop] = opts[prop];
		}
	};

	HaterManager.prototype = {
		hateSession: function( hero ) {
			var that = this;
			if (this.haterInterval === null) {
				this.haterCounter = 0;
				this.haterInterval = setInterval(this.dropInHater.bind(this, hero), 1000);
			}
			canvas.focus();
		},
		dropInHater: function( hero ) {
			if (this.haterCounter < 7) {
				var hater = new Hater();

				hater.x = Math.random() < 0.5 ? -100 : canvas.width;
				hater.y = getRandomInt( 0, canvas.height );

				if (hater.x > 0) {
					hater.haterBody.regX = hater.getTransformedBounds().width;
					hater.haterBody.scaleX = -hater.haterBody.scaleX;
				}
				this.stage.addChild(hater);

				this.haterCounter++;
				hater.moveToTarget( hero, this.canvas, this.stage );
				hater.addEventListener('tick', this.detectOverlapWithHero.bind(this, hater), false);
			} else {
				clearInterval( this.haterInterval );
				this.haterInterval = null;
			}
		},
		detectOverlapWithHero: function(hater) {
			var overlapDetails = detectOverlap( hater, Env.hero );
			if ( overlapDetails.success ) {
				// hero.rattle();
				this.addHaterToHero( hater.clone(true), overlapDetails );
				hater.remove(this.stage);
			}
		},
		addHaterToHero: function(hater, overlapDetails) {
			if (overlapDetails.xSide == 'left') {
				hater.x = Env.hero.heroBody.x + overlapDetails.xHit - hater.getBounds().width;
			} else {
				hater.x = Env.hero.heroBody.x + overlapDetails.xHit;
			}

			hater.xSide = overlapDetails.xSide;
			hater.y = Env.hero.heroBody.y + overlapDetails.yHit;

			hater.rattle = Hater.prototype.rattle;

			Env.hero.addChildAt( hater, 0 );
		},
		popOffHater: function(hater) {
			var xTarget = (hater.xSide == 'left') ? -canvas.width / 2 - 100 : canvas.width / 2;
			var yTarget = hater.y - Math.floor((Math.random() * 200) + 1) - 100;

			createjs.Tween.get(hater, {loop: false})
				.to({ x: xTarget, y: yTarget }, 500)
				.call(function() { Env.hero.removeChild( hater ) });

			hatersRemoved++;
		}
	}

	return HaterManager;

});