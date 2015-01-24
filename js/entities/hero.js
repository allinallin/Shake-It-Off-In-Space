define('Hero',[	
	'createjs',
	'Preloader'
], function(c, Preloader){
	var Hero;

	Hero = function(opts){
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
		this.attackTimer = null;

		var rattleLength = 0.5;
		var rattleMaxFrames = rattleLength * createjs.Ticker.getFPS();

	};

	Hero.prototype = Object.create(createjs.Container.prototype);
	
	Hero.prototype.moveUp = function() {
		if (this.movingUp)
			return;

		window.cancelAnimationFrame(this.movingUpAnimId);
		this.movingDown = false;
		this.movingUp = true;
		this.movingUpAnimId = window.requestAnimationFrame(tweenUp.bind(this));

		function tweenUp() {
			createjs.Tween.get(this, {loop: false})
				.to({y: this.y - 40}, 100)
				.call(function() { 
					if (this.movingUp)
						this.movingUpAnimId = window.requestAnimationFrame(tweenUp.bind(this));
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
		this.movingDownAnimId = window.requestAnimationFrame(tweenDown.bind(this));

		function tweenDown() {
			createjs.Tween.get(this, {loop: false})
				.to({y: this.y + 40}, 100)
				.call(function() { 
					if (this.movingDown)
						this.movingDownAnimId = window.requestAnimationFrame(tweenDown.bind(this));
					else
						window.cancelAnimationFrame(this.movingDownAnimId);
				});
		}
	};
	Hero.prototype.moveLeft = function() {
		if (this.movingLeft)
			return;

		window.cancelAnimationFrame(this.movingRightAnimId);
		this.movingRight = false;
		this.movingLeft = true;
		this.movingLeftAnimId = window.requestAnimationFrame(tweenLeft.bind(this));

		function tweenLeft() {
			createjs.Tween.get(this, {loop: false})
				.to({x: this.x - 30, rotation: -25}, 100)
				.call(function() { 
					if (this.movingLeft)
						this.movingLeftAnimId = window.requestAnimationFrame(tweenLeft.bind(this));
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
		this.movingRightAnimId = window.requestAnimationFrame(tweenRight.bind(this));

		function tweenRight() {
			createjs.Tween.get(this, {loop: false})
				.to({x: this.x + 30, rotation: 25}, 100)
				.call(function() { 
					if (this.movingRight)
						this.movingRightAnimId = window.requestAnimationFrame(tweenRight.bind(this));
					else
						window.cancelAnimationFrame(this.movingRightAnimId);
				});
		}
	};
	Hero.prototype.rotateCenter = function() {
		if (!this.movingLeft && !this.movingRight) {
			createjs.Tween.get(this, {loop: false})
				.to({ rotation: 0}, 100);
		}
	};
	Hero.prototype.rattle = function() {
		this.isRattling = true;
		this.rattleCounter = 0;

		var intervalInstance = window.requestAnimationFrame( _moveIt.bind(this) );

		function _moveIt () {
			var offset = 3;
			var stage = this.rattleStage;

			switch ( stage ) {
				case 1:
			        this.heroBody.y = this.heroBody.y + offset;
			        break;
			    case 2:
			        this.heroBody.x = this.heroBody.x + offset;
			        break;
			    case 3:
			        this.heroBody.y = this.heroBody.y - offset;
			        break;
			    default:
			        this.heroBody.x = this.heroBody.x - offset;
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
	};
	Hero.prototype.standDown = function () {
		this.heroBody.image = Preloader.queue.getResult('hero-flying');
		this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2;
		this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2;
		if (this.attackTimer != null) clearTimeout(this.attackTimer);
	};
	Hero.prototype.attackUp = function() {
		this.heroBody.image = Preloader.queue.getResult('hero-up');
		this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2;
		this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2 - 20;
		if (this.attackTimer != null) clearTimeout(this.attackTimer);
		this.attackTimer = setTimeout(this.standDown.bind(this), 500);
	};
	Hero.prototype.attackDown = function() {
		this.heroBody.image = Preloader.queue.getResult('hero-down');
		this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2;
		this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2 + 20;
		if (this.attackTimer != null) clearTimeout(this.attackTimer);
		this.attackTimer = setTimeout(this.standDown.bind(this), 500);
	};
	Hero.prototype.attackLeft = function() {
		this.heroBody.image = Preloader.queue.getResult('hero-left');
		this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2 - 20;
		this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2;
		if (this.attackTimer != null) clearTimeout(this.attackTimer);
		this.attackTimer = setTimeout(this.standDown.bind(this), 500);
	};
	Hero.prototype.attackRight = function() {
		this.heroBody.image = Preloader.queue.getResult('hero-right');
		this.heroBody.x = -this.heroBody.getTransformedBounds().width / 2 + 20;
		this.heroBody.y = -this.heroBody.getTransformedBounds().height / 2;
		if (this.attackTimer != null) clearTimeout(this.attackTimer);
		this.attackTimer = setTimeout(this.standDown.bind(this), 500);
	};
	Hero.prototype.moveToLand = function(canvas) {
		createjs.Tween.get(this, {loop: false, override: true})
			.to({
				rotation: 0,
				x: canvas.width / 2,
				y: canvas.height - this.getBounds().height
			}, 2000, createjs.Ease.quadOut);
	}
	Hero.prototype.moveToCenter = function(canvas) {
		createjs.Tween.get( this, {loop: false, override: true})
			.to({
				x: canvas.width / 2,
				y: canvas.height / 2
			}, 2000, createjs.Ease.quadOut);
	}

	return Hero;
})