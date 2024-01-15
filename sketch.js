class Cloth {
  constructor(width, height, spacing, particleMass) {
    this.width = width;
    this.height = height;
    this.spacing = spacing;
    this.particleMass = particleMass;
    this.particles = [];
    this.sticks = [];
    this.numCols = Math.floor(width / spacing);
    this.numRows = Math.floor(height / spacing);
  }

  createCloth() {
    for (let i = 0; i < this.numCols; i++) {
      for (let j = 0; j < this.numRows; j++) {
        let particle = new Particle(
          i * this.spacing,
          j * this.spacing,
          this.particleMass
        );
        this.particles.push(particle);
      }
    }

    for (let i = 0; i < this.numCols; i++) {
      for (let j = 0; j < this.numRows; j++) {
        if (i < this.numCols - 1) {
          let stick = new Stick(
            this.particles[i * this.numCols + j],
            this.particles[(i + 1) * this.numCols + j],
            this.spacing
          );
          this.sticks.push(stick);
        }

        if (j < this.numRows - 1) {
          let stick = new Stick(
            this.particles[i * this.numCols + j],
            this.particles[i * this.numCols + j + 1],
            this.spacing
          );
          this.sticks.push(stick);
        }

        if (i < this.numCols - 1 && j < this.numRows - 1) {
          let stick = new Stick(
            this.particles[i * this.numCols + j],
            this.particles[(i + 1) * this.numCols + j + 1],
            this.spacing * Math.sqrt(2)
          );
          this.sticks.push(stick);
        }

        if (i < this.numCols - 1 && j < this.numRows - 1) {
          let stick = new Stick(
            this.particles[(i + 1) * this.numCols + j],
            this.particles[i * this.numCols + j + 1],
            this.spacing * Math.sqrt(2)
          );
          this.sticks.push(stick);
        }
      }
    }
  }
}

class Particle {
  constructor(x, y, mass) {
    this.x = x;
    this.y = y;
    this.prevx = x;
    this.prevy = y;
    this.mass = mass;
  }
}

class Stick {
  constructor(p1, p2, length) {
    this.p1 = p1;
    this.p2 = p2;
    this.length = length;
  }
}

function keepInsideView(particle) {
  if (particle.y >= height) particle.y = height;
  if (particle.x >= width) particle.x = width;
  if (particle.y < 0) particle.y = 0;
  if (particle.x < 0) particle.x = 0;
}

let particles = [];
let sticks = [];

function getDistance(p1, p2) {
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getDifference(p1, p2) {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  };
}

function getLength(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

let cloth;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // let middleX = windowWidth / 2;
  // let middleY = windowHeight / 2;
  // let offset = 50;

  // let pA = new Particle(middleX, middleY, 10000);
  // let pB = new Particle(middleX + offset, middleY, 10000);
  // let pC = new Particle(middleX, middleY + offset, 10000);
  // let pD = new Particle(middleX + offset, middleY + offset, 10000);
  // particles.push(pA, pB, pC, pD);

  // let stickAB = new Stick(pA, pB, getDistance(pA, pB));
  // let stickDC = new Stick(pD, pC, getDistance(pB, pD));
  // let stickCA = new Stick(pC, pA, getDistance(pC, pA));
  // let stickDB = new Stick(pD, pB, getDistance(pD, pB));
  // sticks.push(stickAB, stickDC, stickCA, stickDB);
  cloth = new Cloth(500, 500, 20, 10000);
  cloth.createCloth();
  particles = cloth.particles;
  sticks = cloth.sticks;
}

function update() {
  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];

    let force = { x: 0.0, y: 0.5 };

    let acceleration = {
      x: force.x / particle.mass,
      y: force.y / particle.mass,
    };

    let prevPosition = { x: particle.x, y: particle.y };

    particle.x =
      2 * particle.x -
      particle.prevx +
      acceleration.x * (deltaTime * deltaTime);
    particle.y =
      2 * particle.y -
      particle.prevy +
      acceleration.y * (deltaTime * deltaTime);

    particle.prevx = prevPosition.x;
    particle.prevy = prevPosition.y;

    keepInsideView(particle);
  }

  for (let i = 0; i < sticks.length; i++) {
    let stick = sticks[i];

    let diff = getDifference(stick.p1, stick.p2);
    let diffFactor = ((stick.length - getLength(diff)) / getLength(diff)) * 0.5;
    let offset = { x: diff.x * diffFactor, y: diff.y * diffFactor };

    stick.p1.x += offset.x;
    stick.p1.y += offset.y;
    stick.p2.x -= offset.x;
    stick.p2.y -= offset.y;
  }
}

function draw() {
  background(0);

  update();

  for (let i = 0; i < particles.length; i++) {
    circle(particles[i].x, particles[i].y, 1);
  }

  for (let i = 0; i < sticks.length; i++) {
    stroke("white");
    line(sticks[i].p1.x, sticks[i].p1.y, sticks[i].p2.x, sticks[i].p2.y);
  }
}
