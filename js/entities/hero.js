define('Hero',[	
	'createjs',
	'Preloader'
], function(c, Preloader){
	var Hero;

	Hero = function(opts){
		var that = this;
		var bmp = new createjs.Bitmap(Preloader.queue.getResult('hero-flying'));
		bmp.scaleX = 0.7;
		bmp.scaleY = 0.7;
		bmp.x = -bmp.getTransformedBounds().width / 2;
		bmp.y = -bmp.getTransformedBounds().height / 2;

		createjs.Container.call(this);

		this.setBounds(-bmp.getTransformedBounds().width / 2, -bmp.getTransformedBounds().height / 2, bmp.getTransformedBounds().width, bmp.getTransformedBounds().height)
		this.heroBody = bmp;
		this.addChild( this.heroBody );
	
		this.movingUp		= false;
		this.movingDown 	= false;
		this.movingLeft 	= false;
		this.movingRight 	= false;

		this.movingUpAnimId;
		this.movingDownAnimId;
		this.movingLeftAnimId;
		this.movingRightAnimId;

		this.isRattling = false;
		this.rattleStage = getRandomInt(1, 4);
		this.rattleCounter = 0;
		var rattleLength = 0.5;
		var rattleMaxFrames = rattleLength * createjs.Ticker.getFPS();

		var attackTimer = null;
	};

	Hero.prototype = Object.create(createjs.Container.prototype);
	
	Hero.prototype.moveUp = function() {
			if (this.movingUp)
				return;

			window.cancelAnimationFrame(this.movingUpAnimId);
			this.movingDown = false;
			this.movingUp = true;
			this.movingLeftAnimId = window.requestAnimationFrame(tweenUp);

			function tweenUp() {
				createjs.Tween.get(that, {loop: false})
					.to({y: hero.y - 40}, 100)
					.call(function() { 
						if (that.movingUp)
							this.movingUpAnimId = window.requestAnimationFrame(tweenUp);
						else
							window.cancelAnimationFrame(this.movingUpAnimId);
					});
			}
		};
	Hero.prototype.moveDown = function() {
			if (this.movingDown)
				return;

			window.cancelAnimationFrame(this.movingDownAnimId);
			this.movingUp = false;
			this.movingDown = true;
			this.movingDownAnimId = window.requestAnimationFrame(tweenDown);

			function tweenDown() {
				createjs.Tween.get(that, {loop: false})
					.to({y: hero.y + 40}, 100)
					.call(function() { 
						if (that.movingDown)
							this.movingDownAnimId = window.requestAnimationFrame(tweenDown);
						else
							window.cancelAnimationFrame(this.movingDownAnimId);
					});
			}
		}
	Hero.prototype.moveLeft = function() {
			if (this.movingLeft)
				return;

			window.cancelAnimationFrame(this.movingRightAnimId);
			this.movingRight = false;
			this.movingLeft = true;
			this.movingLeftAnimId = window.requestAnimationFrame(tweenLeft);

			function tweenLeft() {
				createjs.Tween.get(that, {loop: false})
					.to({x: hero.x - 30, rotation: -25}, 100)
					.call(function() { 
						if (that.movingLeft)
							this.movingLeftAnimId = window.requestAnimationFrame(tweenLeft);
						else
							window.cancelAnimationFrame(this.movingLeftAnimId);
					});
			}
		}
	Hero.prototype.moveRight = function() {
			if (this.movingRight)
				return;

			window.cancelAnimationFrame(this.movingLeftAnimId);
			this.movingLeft = false;
			this.movingRight = true;
			this.movingRightAnimId = window.requestAnimationFrame(tweenRight);

			function tweenRight() {
				createjs.Tween.get(that, {loop: false})
					.to({x: hero.x + 30, rotation: 25}, 100)
					.call(function() { 
						if (that.movingRight)
							this.movingRightAnimId = window.requestAnimationFrame(tweenRight);
						else
							window.cancelAnimationFrame(this.movingRightAnimId);
					});
			}
		}
	Hero.prototype.rotateCenter = function() {
			if (!this.movingLeft && !this.movingRight) {
				createjs.Tween.get(that, {loop: false})
					.to({ rotation: 0}, 100);
			}
		}
	Hero.prototype.rattle = function() {
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
	Hero.prototype.standDown = function () {
			this.heroBody.image = Preloader.queue.getResult('hero-flying');
			this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2;
			this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2;
			if (attackTimer != null) clearTimeout(attackTimer);
		}
	Hero.prototype.attackUp = function() {
			this.heroBody.image = Preloader.queue.getResult('hero-up');
			this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2;
			this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2 - 20;
			if (attackTimer != null) clearTimeout(attackTimer);
			attackTimer = setTimeout(function() {
				that.standDown();
			}, 500);
		}
	Hero.prototype.attackDown = function() {
			this.heroBody.image = Preloader.queue.getResult('hero-down');
			this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2;
			this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2 + 20;
			if (attackTimer != null) clearTimeout(attackTimer);
			attackTimer = setTimeout(function() {
				that.standDown();
			}, 500);
		}
	Hero.prototype.attackLeft = function() {
			this.heroBody.image = Preloader.queue.getResult('hero-left');
			this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2 - 20;
			this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2;
			if (attackTimer != null) clearTimeout(attackTimer);
			attackTimer = setTimeout(function() {
				that.standDown();
			}, 500);
		}
	Hero.prototype.attackRight = function() {
			this.heroBody.image = Preloader.queue.getResult('hero-right');
			this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2 + 20;
			this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2;
			if (attackTimer != null) clearTimeout(attackTimer);
			attackTimer = setTimeout(function() {
				that.standDown();
			}, 500);
		}
	Hero.prototype.moveToLand = function(canvas) {
		createjs.Tween.get(this, {loop: false, override: true})
			.to({
				rotation: 0,
				x: canvas.width / 2,
				y: canvas.height - this.getBounds().height
			}, 2000, createjs.Ease.quadOut);
	}

	return Hero;
})