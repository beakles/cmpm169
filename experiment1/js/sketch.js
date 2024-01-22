// sketch.js - A canvas of geometrically-shaped germs made of vectors.
// Author: Brannon Eakles
// Date: 01/22/2024

// Global variables
let waveIncrement = 0; // Increment for animations
let shapesArray = []; // Container for the shapes
let connectionLineSizeMax = 10;
let connectionLineSizeCurrent = 0;
let shapeLast = null; // Previous shape generated
let shapeCurrent = null; // Newest shape generated
let canvasContainer; // Container for the canvas
let possibleShapeProperties = { // Randomized properties for generated shapes
  sides: 0,
  size: 0,
  rotation: 0,
  rotationChange: 0,
  warpSpeed: 0,
  warpScale: 0,
  warpDirection: 0,
  shapeOriginX: 0,
  shapeOriginY: 0,
}

// Shape point class
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

// Shape class (built from shape point objects)
class Shape {
  constructor(name, sides, size, rotation, rotationChange, warpSpeed, warpScale, warpDirection, shapeOriginX, shapeOriginY, trail) {
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
    
    this.shapeColor = color(random(40, 255), random(40, 255), random(40, 255));
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
    
    shapeLast = shapeCurrent;
    shapeCurrent = this;
    
    if (trail) {
      connectionLineSizeCurrent = connectionLineSizeMax;
    }
  }
  
  // Called every frame to update the current properties of a shape object
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
  
  // Draw the shape to the canvas
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
        ellipse(pointCurrent.XResult, pointCurrent.YResult, this.size / 5, this.size / 5);
      }
      pointLast = pointCurrent;
      pointCurrent = pointCurrent.pointNext;
    }
    stroke(this.shapeColor);
    strokeWeight(this.size / 5);
    line(this.shapePoints[0].XResult, this.shapePoints[0].YResult, this.shapePoints[this.shapePoints.length - 1].XResult, this.shapePoints[this.shapePoints.length - 1].YResult);
  }
}


// Randomize the properties for the shape
function randomizeShapeProperties() {
  possibleShapeProperties.sides = floor(random(3, 9));
  possibleShapeProperties.size = random(1000, 5000) / 100;
  possibleShapeProperties.rotation = random(-360, 361);
  possibleShapeProperties.rotationChange = random(-500, 500) / 1000;
  possibleShapeProperties.warpSpeed = random(100, 200) / 100;
  possibleShapeProperties.warpScale = random(200, 300) / 100;
  possibleShapeProperties.warpDirection = random(-100, 100) / 100;
  possibleShapeProperties.shapeOriginX = floor(random(mouseX - 50, mouseX + 51));
  possibleShapeProperties.shapeOriginY = floor(random(mouseY - 50, mouseY + 51));
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvasNew = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvasNew.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function() {
      console.log("Resizing...");
      resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });
  
  // Randomized shape properties
  randomizeShapeProperties();
  
  // Spawn a few sample shapes
  for (let increment = 0; increment < 1; increment += 1) {
    let shapeNew = new Shape("geometry", possibleShapeProperties.sides, possibleShapeProperties.size, possibleShapeProperties.rotation, possibleShapeProperties.rotationChange, possibleShapeProperties.warpSpeed, possibleShapeProperties.warpScale, possibleShapeProperties.warpDirection, floor(random(0 + 50, width - 49)), floor(random(0 + 50, height - 49)), false);
    shapesArray.push(shapeNew);
    randomizeShapeProperties();
  }
}

// Update the shapes on screen every frame
function draw() {
  background(20, 20, 20);
  
  for (let increment = 0; increment < shapesArray.length; increment += 1) {
    shapesArray[increment].updateShape();
    shapesArray[increment].displayShape();
  }
  
  if (shapeLast) {
    stroke(255, 255, 255);
    strokeWeight(connectionLineSizeCurrent);
    line(shapeLast.shapeOrigin.XOrigin, shapeLast.shapeOrigin.YOrigin, shapeCurrent.shapeOrigin.XOrigin, shapeCurrent.shapeOrigin.YOrigin);
    ellipse(shapeLast.shapeOrigin.XOrigin, shapeLast.shapeOrigin.YOrigin, connectionLineSizeCurrent, connectionLineSizeCurrent);
    ellipse(shapeCurrent.shapeOrigin.XOrigin, shapeCurrent.shapeOrigin.YOrigin, connectionLineSizeCurrent, connectionLineSizeCurrent);
  }
  
  waveIncrement += 1;
  if (connectionLineSizeCurrent > 0) {
    connectionLineSizeCurrent -= 1;
  } else {
    connectionLineSizeCurrent = 0;
  }
}

// Spawn a new shape on mouse click
function mouseClicked() {
  if (mouseX > width || mouseX < 0 || mouseY > height || mouseY < 0) {
    return;
  }

  randomizeShapeProperties();
  let shapeNew = new Shape("geometry", possibleShapeProperties.sides, possibleShapeProperties.size, possibleShapeProperties.rotation, possibleShapeProperties.rotationChange, possibleShapeProperties.warpSpeed, possibleShapeProperties.warpScale, possibleShapeProperties.warpDirection, possibleShapeProperties.shapeOriginX, possibleShapeProperties.shapeOriginY, true);
  shapesArray.push(shapeNew);
}
