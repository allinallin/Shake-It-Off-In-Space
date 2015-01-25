define('HateSession', [	
	'Hater',
	'Helpers'
], function(Hater, Helpers){
	var HateSession;

	var keyDefs = {
		up: [38, 87],
		down: [40, 83],
		left: [37, 65],
		right: [39, 68]
	};
	var keyWhitelist = keyDefs.up.concat(keyDefs.down, keyDefs.left, keyDefs.right);
	
	HateSession = {
		init: function(canvas, stage, hero) {
			this.canvas = canvas;
			this.stage = stage;
			this.hero = hero;

			this.resetProps();

			this.haterInterval = setInterval(this.deployHater.bind(this, this.hero), 1000);

			this.canvas.focus();
		},
		resetProps: function() {
			this.haterInterval = null;
			this.haterCounter = 0;
			this.hatersRemoved = 0;
		},
		terminate: function() {
			this.haterInterval = null;
			this.unbindDodgeControls();
		},
		deployHater: function() {
			if (this.haterCounter < 7) {
				var hater = new Hater({
					x: Math.random() < 0.5 ? -100 : this.canvas.width,
					y: Helpers.getRandomInt( 0, this.canvas.height )
				});

				if (hater.x > 0) {
					hater.haterBody.regX = hater.getTransformedBounds().width;
					hater.haterBody.scaleX = -hater.haterBody.scaleX;
				}

				this.stage.addChild(hater);

				this.haterCounter++;

				hater.moveToTarget( this.hero, this.canvas, this.stage );
				hater.addEventListener('tick', this.detectOverlapWithHero.bind(this, hater), false);
			} else {
				clearInterval( this.haterInterval );
				this.haterInterval = null;
			}
		},
		detectOverlapWithHero: function(hater) {
			var overlapDetails = Helpers.detectOverlap( hater, this.hero );
			if ( overlapDetails.success ) {
				// hero.rattle();
				this.addHaterToHero( hater.clone(true), overlapDetails );
				hater.remove(this.stage);
			}
		},
		addHaterToHero: function(hater, overlapDetails) {
			if (overlapDetails.xSide == 'left') {
				hater.x = this.hero.heroBody.x + overlapDetails.xHit - hater.getBounds().width;
			} else {
				hater.x = this.hero.heroBody.x + overlapDetails.xHit;
			}

			hater.xSide = overlapDetails.xSide;
			hater.y = this.hero.heroBody.y + overlapDetails.yHit;

			hater.rattle = Hater.prototype.rattle;

			this.hero.addChildAt( hater, 0 );
		},
		popOffAllHaters: function() {
			if (this.hero.getNumChildren() > 1) {
				for (var i = this.hero.getNumChildren() - 2; i >= 0; i--) {
					this.popOffHater( this.hero.getChildAt(i) );
				}
			}
		},
		popOffHater: function(hater) {
			var xTarget = (hater.xSide == 'left') ? -this.canvas.width / 2 - 100 : this.canvas.width / 2;
			var yTarget = hater.y - Math.floor((Math.random() * 200) + 1) - 100;
			var hero = this.hero;

			createjs.Tween.get(hater, {loop: false})
				.to({ x: xTarget, y: yTarget }, 500)
				.call(function() { hero.removeChild( hater ) });

			this.hatersRemoved++;
		},
		bindDodgeControls: function(canvas, hero) {
			if (canvas) this.canvas = canvas;
			if (hero) this.hero = hero;

			this.dodgeKeyUpBinded = this.dodgeKeyUpListener.bind(this);
			this.dodgeKeyDownBinded = this.dodgeKeyDownListener.bind(this);

			this.canvas.addEventListener('keyup', this.dodgeKeyUpBinded, false);
			this.canvas.addEventListener('keydown', this.dodgeKeyDownBinded, false);

			this.canvas.focus();
		},
		unbindDodgeControls: function() {
			if (!this.canvas) return;
			
			this.canvas.removeEventListener('keyup', this.dodgeKeyUpBinded, false);
			this.canvas.removeEventListener('keydown', this.dodgeKeyDownBinded, false);			
		},
		dodgeKeyUpListener: function(e) {
			var key = e.keyCode;

			if (keyDefs.up.indexOf(key) !== -1) {
				this.hero.movingUp = false;
				this.hero.rotateCenter();
			} else if (keyDefs.down.indexOf(key) !== -1) {
				this.hero.movingDown = false;
				this.hero.rotateCenter();
			} else if (keyDefs.left.indexOf(key) !== -1) {
				this.hero.movingLeft = false;
				this.hero.rotateCenter();
			} else if (keyDefs.right.indexOf(key) !== -1) {
				this.hero.movingRight = false;
				this.hero.rotateCenter();
			}
		},
		dodgeKeyDownListener: function(e) {
			var key	= e.keyCode;

			if (keyDefs.up.indexOf(key) !== -1) {
				if (!this.hero.movingUp)
					this.hero.moveUp();
			} else if (keyDefs.down.indexOf(key) !== -1) {
				if (!this.hero.movingDown)
					this.hero.moveDown();
			} else if (keyDefs.left.indexOf(key) !== -1) {
				if (!this.hero.movingLeft)
					this.hero.moveLeft();
			} else if (keyDefs.right.indexOf(key) !== -1) {
				if (!this.hero.movingRight)
					this.hero.moveRight();
			}
		}
	}

	return HateSession;

});