define('Planet',[	
	'createjs',
	'Environment'
], function(c, Env){
	var Planet;
	// init planet
	var scale = 1;
	var g = new createjs.Graphics();
	g.f("rgba(255,161,49,254)").p("EDP0ARMYjcgKBQg8kEhaYkEhaAyEOgyAUYgyAei+AomQgKYmQgKhaj6iggKYigAAl8CCjIgKYjIAAjciqhaAKYhaAKqKDIi+huYi+hui0AKAAAAYAAAAq8BQgyAeYgyAenMAyi+iWYi+iMnqCMAAAAIAAQuMBq4AAAIAArkYAAAAAKiMjcgU").cp().ef().f("rgba(232,150,42,254)").p("EDP0ARMYjcgKBQg8kEhaYkEhaAyEOgyAUYgyAei+AomQgKYmQgKhaj6iggKYigAAl8CCjIgKYjIAAjciqhaAKYhaAKqKDIi+huYi+hui0AKAAAAYAAAAq8BQgyAeYgyAenMAyi+iWYi+iMnqCMAAAAIAADwYDcAKE2AKGGAKYImAAKygoL4AyYH0AeH+BQISA8YH+A8H0AeH0BaYEiAyEsA8EYBQIAAnqYAAAAAKiMjcgU").cp().ef().f("rgba(255,161,49,254)").p("EC7CASwYlygehajmiggKYgUAAgoAAgoAKYC0FKJsAUhQha").cp().ef().f("rgba(255,161,49,254)").p("EDOuARCYiMgUAogyjmhQYg8gegyAKgeAKYBaE2F8g8AAha").cp().ef().f("rgba(255,161,49,254)").p("ECRKAP8YgygKgogKgegKYi+hui0AKAAAAYAAAAiqAUi0AUYFoCgIcAKg8hQ").cp().ef().f("rgba(255,161,49,254)").p("ECn+AQuYgKgKgKgKgKAAYgoAAgeAAgoAAYjIAAjciqhaAKYAAAAgKAAgKAAYCMD6EEhQEOAK").cp().ef().f("rgba(255,161,49,254)").p("EBsSANwYCgCWCqBQDwhkIgKgKYgygUgygUgogeYhkhGi0AAiMAU").cp().ef().f("rgba(198,120,42,254)").ss(10).s("rgba(198,120,42,254)").p("EB1MAV4YAAAehkAeiCAAYh4AAhugeAAgeYAAgeBugeB4AAYCCAABkAeAAAe").cp().ef().es().f("rgba(198,120,42,254)").ss(10).s("rgba(198,120,42,254)").p("EC+yAauYAAAejIAAj6gKYj6gUjIgeAKgUYAAgeDIAADwAKYD6AUDIAeAAAU").cp().ef().es().f("rgba(198,120,42,254)").ss(10).s("rgba(198,120,42,254)").p("EDMYAb+YAAAUgKAUgKAAYgKAAgKgUAAgUYAAgUAKgUAKAAYAKAAAKAUAAAU").cp().ef().es().f("rgba(198,120,42,254)").ss(6).s("rgba(198,120,42,254)").p("EB7cAWMYgoAKgogKgUgeYgKgoAUgoAegUYAogKAyAKAKAeYAUAogUAogoAU").cp().ef().es().f("rgba(198,120,42,254)").ss(10).s("rgba(198,120,42,254)").p("ECBEAZAYAAAUAoAKAoAAIGkAAYAoAAAegKAAgUIAAAAYAAgUgegKgoAAImkAAYgoAAgoAKAAAUIAAAA").cp().ef().es();
	var canvas = document.querySelector('.main-stage');

	Planet = function(opts){
		createjs.Shape.call(this, g);
		this.setBounds(0,0,681,113);

		var initWidth = this.getBounds().width;

		if (initWidth < canvas.width)
			scale = canvas.width / initWidth;
		else
			scale = initWidth / canvas.width;

		this.hackyOrigin = {
			x: -666,
			y: -84,
			transformedX: -666 * scale,
			transformedY: -84 * scale
		}

		this.x = this.hackyOrigin.transformedX;
		this.y = canvas.height;
		this.scaleX = scale;
		this.scaleY = scale;
	};
	
	Planet.prototype = Object.create(createjs.Shape.prototype);

	Planet.prototype.bringToView = function() {
		// move planet up into view
		createjs.Tween.get(this, {loop: false})
			.to({ y: canvas.height - this.getTransformedBounds().height + this.hackyOrigin.transformedY }, 2000)
			.call(function() { Env.starfield.changeStarSpeed('stop'); });
	}

	return Planet;
})