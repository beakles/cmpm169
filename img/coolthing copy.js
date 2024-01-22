let waveIncrement = 0;
let shapesArray = [];

class ShapePoint {
  constructor(name, shapePointX, shapePointY) {
    this.pointPrevious = null;
    this.pointNext = null;
    
    this.XOrigin = shapePointX;
    this.YOrigin = shapePointY;
    
    this.XOffset = 0;
    this.YOffset = 0;
    
    this.XResult = 0;
    this.YResult = 0;
  }
}

class Shape {
  constructor(name, sides, size, rotation, rotationChange, warpSpeed, warpScale, warpDirection, shapeOriginX, shapeOriginY) {
    this.name = name;
    this.sides = sides;
    this.size = size;
    this.sizeOffset = 20;
    this.rotation = rotation;
    this.rotationChange = rotationChange;
    this.shapeOrigin = new ShapePoint("origin", shapeOriginX, shapeOriginY);
    this.shapePoints = [];
    this.warpSpeed = warpSpeed;
    this.warpScale = warpScale;
    this.warpDirection = warpDirection;
    
    this.shapeColor = color(random(0, 255), random(0, 255), random(0, 255));
    this.specialShape = true;
    
    let lastShapePoint = null;
    
    for (let pointIndex = 0; pointIndex < sides; pointIndex += 1) {
      let newShapePoint = new ShapePoint(`${pointIndex}`, shapeOriginX, shapeOriginY);
      this.shapePoints.push(newShapePoint);
      
      if (lastShapePoint != null) {
        newShapePoint.pointPrevious = lastShapePoint;
        newShapePoint.pointPrevious.pointNext = newShapePoint;
      }
      
      lastShapePoint = newShapePoint;
    }
  }
  
  updateShape() {
    let pointCurrent = this.shapePoints[0];
    let pointNum = 0;
    while (pointCurrent) {
      
      // let v0 = createVector(this.shapeOrigin.XOrigin, this.shapeOrigin.YOrigin);
      
      // noStroke();
      let vectorAngle = p5.Vector.fromAngle(2 * PI / this.sides * pointNum + radians(this.rotation), this.size + this.sizeOffset);
      
      if (this.sizeOffset > 0) {
        this.sizeOffset -= 1;
      } else {
        this.sizeOffset = 0;
      }
      
      pointCurrent.XOffset = this.warpScale * sin(this.warpDirection * this.warpSpeed * (waveIncrement / 10) + pointNum);
      pointCurrent.YOffset = this.warpScale * sin(this.warpDirection * this.warpSpeed * (waveIncrement / 10) + pointNum);
      
      pointCurrent.XResult = this.shapeOrigin.XOrigin + vectorAngle.x + pointCurrent.XOffset;
      pointCurrent.YResult = this.shapeOrigin.YOrigin + vectorAngle.y + pointCurrent.YOffset;
      pointCurrent = pointCurrent.pointNext;
      if (pointNum < this.shapePoints.length) {
        pointNum += 1;
      } else {
        pointNum -= 1;
      }
      
      this.rotation += this.rotationChange;
    }
  }
  
  displayShape() {
    let pointCurrent = this.shapePoints[0];
    let pointLast = null;
    while (pointCurrent) {
      if (pointLast) {
        stroke(this.shapeColor);
        strokeWeight(this.size / 5);
        line(pointLast.XResult, pointLast.YResult, pointCurrent.XResult, pointCurrent.YResult);
      }
      stroke(this.shapeColor);
      strokeWeight(this.size / 5);
      if (this.specialShape) {
        circle(pointCurrent.XResult, pointCurrent.YResult, this.size / 5);
      }
      pointLast = pointCurrent;
      pointCurrent = pointCurrent.pointNext;
    }
    stroke(this.shapeColor);
    strokeWeight(this.size / 5);
    line(this.shapePoints[0].XResult, this.shapePoints[0].YResult, this.shapePoints[this.shapePoints.length - 1].XResult, this.shapePoints[this.shapePoints.length - 1].YResult);
  }
}

function setup() {
  createCanvas(800, 800); // 800px X 800px canvas size
  
  let possibleShapeProperties = {
    sides: floor(random(3, 9)),
    size: random(1000, 5000) / 100,
    rotation: random(-360, 361),
    rotationChange: random(-500, 500) / 1000,
    warpSpeed: random(100, 200) / 100,
    warpScale: random(200, 300) / 100,
    warpDirection: random(-100, 100) / 100,
    shapeOriginX: floor(random(0 + 50, width - 100)),
    shapeOriginY: floor(random(0 + 50, height - 100))
  }
  
  for (let increment = 0; increment < 3; increment += 1) {
    let shapeNew = new Shape("geometry", possibleShapeProperties.sides, possibleShapeProperties.size, possibleShapeProperties.rotation, possibleShapeProperties.rotationChange, possibleShapeProperties.warpSpeed, possibleShapeProperties.warpScale, possibleShapeProperties.warpDirection, possibleShapeProperties.shapeOriginX, possibleShapeProperties.shapeOriginY);
    shapesArray.push(shapeNew);
    
    possibleShapeProperties.sides = floor(random(3, 9));
    possibleShapeProperties.size = random(1000, 5000) / 100;
    possibleShapeProperties.rotation = random(-360, 361);
    possibleShapeProperties.rotationChange = random(-500, 500) / 1000;
    possibleShapeProperties.warpSpeed = random(100, 200) / 100;
    possibleShapeProperties.warpScale = random(200, 300) / 100;
    possibleShapeProperties.warpDirection = random(-100, 100) / 100,
    possibleShapeProperties.shapeOriginX = floor(random(0 + 50, width - 100));
    possibleShapeProperties.shapeOriginY = floor(random(0 + 50, height - 100));
  }
}

function draw() {
  background(20, 20, 20);
  
  /*
  rectMode(CENTER);
  textSize(32);
  text('Vector germs', width / 2 - 64, height / 2);
  describe("Vector germs");
  */
  
  for (let increment = 0; increment < shapesArray.length; increment += 1) {
    shapesArray[increment].updateShape();
    shapesArray[increment].displayShape();
  }
  
  
  
  waveIncrement += 1;
}

function mouseClicked() {

let possibleShapeProperties = {
  sides: floor(random(3, 9)),
  size: random(1000, 5000) / 100,
  rotation: random(-360, 361),
  rotationChange: random(-500, 500) / 1000,
  warpSpeed: random(100, 200) / 100,
  warpScale: random(200, 300) / 100,
  warpDirection: random(-100, 100) / 100,
  shapeOriginX: floor(random(0 + 50, width - 100)),
  shapeOriginY: floor(random(0 + 50, height - 100))
}
  
  let shapeNew = new Shape("geometry", possibleShapeProperties.sides, possibleShapeProperties.size, possibleShapeProperties.rotation, possibleShapeProperties.rotationChange, possibleShapeProperties.warpSpeed, possibleShapeProperties.warpScale, possibleShapeProperties.warpDirection, possibleShapeProperties.shapeOriginX, possibleShapeProperties.shapeOriginY);
  shapesArray.push(shapeNew);
}