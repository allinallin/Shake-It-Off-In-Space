define('GameOver', [	
	'createjs',
	'Environment',
	'HateSession',
	'ShakeItSession'
], function(c, Env, HateSession, ShakeItSession){
	var GameOver;
	// Entry points are after Chorus1 and Chorus2
	GameOver = {
		enter : function(canvas, stage){
			Env.html.shakeItIndicator.style.display = 'none';
			Env.html.gameOverMsg.style.display = 'block';
			Env.html.replayButton.style.display = 'block';

			Env.resetBehavior();
			
			HateSession.popOffAllHaters();
			HateSession.terminate();
			
			ShakeItSession.terminate();
		}
	}

	return GameOver;
});