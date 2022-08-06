// Particle System Simulation
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/syR0klfncCk
// https://thecodingtrain.com/learning/nature-of-code/4.1-particle-system-simulation.html
// https://editor.p5js.org/codingtrain/sketches/QRzgzQLnQ

class Particle {
	constructor( x, y, life, burn ) {
		this.pos = createVector( x, y );
		this.vel = p5.Vector.random2D();
		this.vel.mult( random( 0.5, 2 ) );
		this.acc = createVector( 0, 0 );
		this.r = 1 + Math.random() * 3;
		this.lifetime = life || 120 + Math.random() * 130;
		this.burn = burn || 1 + Math.random() * 4;
	}

	finished() {
		return this.lifetime < 0;
	}

	applyForce( force ) {
		this.acc.add( force );
	}

	edges() {
		if ( this.pos.y >= height - this.r ) {
			this.pos.y = height - this.r;
			this.vel.y *= - 1;
		}

		if ( this.pos.x >= width - this.r ) {
			this.pos.x = width - this.r;
			this.vel.x *= - 1;
		} else if ( this.pos.x <= this.r ) {
			this.pos.x = this.r;
			this.vel.x *= - 1;
		}
	}

	update( burn ) {

		burn = burn || this.burn;

		this.vel.add( this.acc );
		this.pos.add( this.vel );
		this.acc.set( 0, 0 );

		fill( 255, this.lifetime + burn );
		this.lifetime -= burn;
	}

	show() {
		ellipse( this.pos.x, this.pos.y, this.r * 2 );
	}
}