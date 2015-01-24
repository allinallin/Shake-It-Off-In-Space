define('ShakeItSession', [
	'HateSession'
], function(HateSession){
	var ShakeItSession;
	
	var totalChancesToRemove = 24;
	var handicap = -8;
	var	windows = [
		[0, 0.8],
		[1.1, 1.9],

		[3.0, 3.8],
		[4.1, 4.9],

		[6.0, 6.8],
		[7.1, 8.9],

		[9.0, 9.8],
		[10.1, 10.9]
	];
	var blankWindowHitLimits = [];
	for (var winLen = windows.length - 1; winLen >= 0; winLen--) {
		blankWindowHitLimits.push(0);
	}
	var keyDefs = {
		up: [38, 87],
		down: [40, 83],
		left: [37, 65],
		right: [39, 68]
	};
	var keyWhitelist = keyDefs.up.concat(keyDefs.down, keyDefs.left, keyDefs.right);
	var	windowHitLimit = 3;
	
	ShakeItSession = {
		init: function(canvas, stage, hero, soundInstance) {
			this.canvas = canvas;
			this.stage = stage;
			this.hero = hero;
			this.windows = windows;
			this.soundInstance = soundInstance;

			var hasEnemies = hero.getNumChildren() > 1;

			if (hasEnemies)	this.resetProps();

			this.shakeItKeyDownBinded = this.shakeItKeyDownListener.bind(this);
			this.bindAttackControls();
			
			console.log('enemies: ' + this.enemyCounter);
			console.log('hits to remove 1 enemy: ' + this.modulusFactor);
		},
		resetProps: function() {
			this.enemyCounter = this.hero.getNumChildren() - 1;
			this.modulusFactor = Math.floor( (totalChancesToRemove + handicap) / this.enemyCounter );
			this.hitCounter = 0;
			this.windowHitLimitTracker = blankWindowHitLimits;
		},
		terminate: function() {
			this.unbindAttackControls();
		},
		bindAttackControls: function() {
			this.canvas.addEventListener('keydown', this.shakeItKeyDownBinded, false);
		},
		unbindAttackControls: function() {
			this.canvas.removeEventListener('keydown', this.shakeItKeyDownBinded, false);
		},
		shakeItAttack: function(key) {
			if (keyDefs.up.indexOf(key) !== -1) {
				this.hero.attackUp();
			} else if (keyDefs.down.indexOf(key) !== -1) {
				this.hero.attackDown();
			} else if (keyDefs.left.indexOf(key) !== -1) {
				this.hero.attackLeft();
			} else if (keyDefs.right.indexOf(key) !== -1) {
				this.hero.attackRight();
			}
		},
		shakeItKeyDownListener: function(e) {
			if (keyWhitelist.indexOf( e.keyCode ) == -1)
				return;

			var position = this.soundInstance.getPosition();

			for (var i = windows.length - 1; i >= 0; i--) {
				var lowerLimit = windows[i][0] * 1000,
					upperLimit = windows[i][1] * 1000;

				if (numIsInBetween( position, lowerLimit, upperLimit ) && this.windowHitLimitTracker[i] < 3) {

					++this.hitCounter;
					++this.windowHitLimitTracker[i];

					if (this.enemyCounter > 0) {
						for (var j = this.hero.getNumChildren() - 2; j >= 0; j--) {
							this.hero.getChildAt(j).rattle();
						}
					}		
					
					if (this.hitCounter % this.modulusFactor == 0 && this.enemyCounter > 0) {
						var hater = this.hero.getChildAt( this.enemyCounter - 1 );
						HateSession.popOffHater( hater );
						--this.enemyCounter;
					}

					this.shakeItAttack( e.keyCode );
					
					return;
				}
			}
		}
	}

	return ShakeItSession;

});