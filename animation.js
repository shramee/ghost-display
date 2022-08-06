let
	img, song, canvas,
	particles = [],
	$subs, _subs, subs, startTime, setupSub,
	play, jump, reset,
	volhistory = [],
	amp;

function preload() {
	img = loadImage( '../lib/bg.jpg' );
	song = loadSound( 'ghost.m4v' );

	trackStartTime = new Date( 1970, 1, 1, 0, 0, 0, 0 );

	const {lines} = new Srt( document.getElementById( 'srt_text' ).innerText );
	_subs = lines.map( ( {subtitle, start, end} ) => ({
		start   : (start.time - trackStartTime) / 1000,
		duration: (end.time - start.time) / 1000,
		subtitle,
	}) );

	subs = [..._subs]
}

function setup() {
	$subs = document.getElementById( 'subtitles' );
	canvas = createCanvas( 1920, 1080 );
	amp = new p5.Amplitude();

	let playing = false;
	noLoop();
	frameRate( 60 );

	reset = () => {
		subs = [..._subs];
		$subs.innerHTML = '';
		jump( 0 );
	};

	start = () => {
		jump( 0 );
	}

	jump = ( seconds ) => {
		startTime = new Date();
		if ( !playing ) {
			play();
		}

		setTimeout( () => {
			loop();
			song.jump( seconds );
			loop();
		}, 100 )
	}

	play = () => {
		if ( playing ) {
			noLoop();
			song.pause();
		} else {
			loop();
			song.play();
		}
		playing = !playing;
	}

	setupSub = ( {subtitle, duration, start} ) => {
		let html = '<div class="word">';
//		const els = subtitle.split( /[ \n]+/g );
		const els = subtitle.split( '' );

		const dur = duration * .5;
		const del = (duration * .3) / els.length;
		let delay = 0;

		$subs.style.animationDuration = duration

		els.forEach( ( txt, i ) => {
			if ( txt === ' ' ) {
				html += '</div> <div class="word">';
				return;
			}

			delay += 2 * del * Math.random();
//			const adur = Math.max( dur - ( .1 * Math.random() ), 1 );
			const adur = Math.min( dur, .7 ) - (.1 * Math.random());
//			adur
			html += `<span style="top:${Math.random() * .1}em;animation-duration: ${adur}s;animation-delay: ${delay}s;">${txt}</span>`;
		} );

		$subs.innerHTML = html + '</div>';

		for ( let i = 0; i < subtitle.length; i ++ ) {
			const l = subtitle[i];

		}

		console.log( subtitle );
	}

//	setupSub( subs[0] );

	amp.smooth( .9 );
	noStroke();
}

function draw() {
	volhistory.push( amp.getLevel() );
	var vol = volhistory.;
	document.body.style.setProperty('--vol', vol);
	const songTime = song.currentTime();
	const rotation = Math.max( map( vol, .4, 1, 0, 0.1 ), 0 );
	noiseVal = noise( songTime/16, 255 );
//	const scaling = Math.max( map( vol, 0, 1, 1.15, 1.2 ), 1.15 );
	const scaling = Math.max( map( noiseVal, 0, 1, 1.2, 1.6 ), 1.15 );

	if ( subs[0] && songTime > subs[0].start ) {
		setupSub( subs.splice( 0, 1 )[0] );
	}

	push();
	translate( width / 2, height / 2 );
	rotate( rotation );
	scale( scaling );
	image( img, - width / 2, - height / 2, 1920, 1080, 0, 1000, img.width, img.width * 1080 / 1920 );
	pop();

	if ( particles.length < 16 || vol > .5 ) {
		for ( let i = 0; i < vol / .3; i ++ ) {
			particles.push( new Particle( Math.random() * width, Math.random() * height ) );
		}
	}

	for ( let particle of particles ) {
		let gravity = p5.Vector.random2D().mult( vol );;
		particle.applyForce( gravity );
		particle.update();
		particle.show();
	}

	for ( let i = particles.length - 1; i >= 0; i -- ) {
		if ( particles[i].finished() ) {
			particles.splice( i, 1 );
		}
	}
//	console.log( vol, rotation, scaling );
}