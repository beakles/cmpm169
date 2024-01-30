// sketch.js - A circular, randomly-generated labyrinth that revolves around.
// Author: Brannon Eakles
// Date: 01/29/2024

// Global variables
let labyrinthWallArray = []; // Array of labyrinth walls

// Point/pillar in the labyrinth wall
class LabyrinthWallPoint {
  constructor(newX, newY, newPartOfWall) {
    this.pointPrevious = null;
    this.pointNext = null;
    
    this.x = newX;
    this.y = newY;
    
    this.partOfWall = newPartOfWall;
  }
}

// Labyrinth wall class
class LabyrinthWall {
  constructor(newPoints, newScale, newOriginX, newOriginY, newRotation, closedChance) {
    this.points = newPoints;
    this.scale = newScale;
    this.rotation = newRotation;
    this.rotationOffset = 0;
    this.rotationIncrement = random(-50, 50) / 100;

    this.pointOrigin = new LabyrinthWallPoint(newOriginX, newOriginY, false);
    this.pointsArray = [];
    
    let labyrinthWallPointLast = null;
  
    for (let pointsArrayIndex = 0; pointsArrayIndex < newPoints; pointsArrayIndex += 1) {
      let labyrinthWallPointNew = new LabyrinthWallPoint(newOriginX, newOriginY, false);
      let randomChance = random(0, 100);
      if (randomChance <= closedChance) {
        labyrinthWallPointNew.partOfWall = true;
      }
      this.pointsArray.push(labyrinthWallPointNew);
      
      if (labyrinthWallPointLast) {
        labyrinthWallPointNew.pointPrevious = labyrinthWallPointLast;
        labyrinthWallPointNew.pointPrevious.pointNext = labyrinthWallPointNew;
      }
      
      labyrinthWallPointLast = labyrinthWallPointNew;
    }
  }
  
  // Called every frame to update the current properties of the labyrinth wall
  updateLabyrinthWall() {
    let pointCurrent = this.pointsArray[0];
    let pointNum = 0;
    this.rotationOffset += this.rotationIncrement;
    while (pointCurrent) {
      let vectorAngle = p5.Vector.fromAngle(2 * (PI / this.points) * pointNum + radians(this.rotation + this.rotationOffset), this.scale);

      pointCurrent.x = this.pointOrigin.x + vectorAngle.x;
      pointCurrent.y = this.pointOrigin.y + vectorAngle.y;
      
      if (pointNum < this.pointsArray.length) {
        pointNum += 1;
      } else {
        pointNum -= 1;
      }

      pointCurrent = pointCurrent.pointNext;
    }
  }
  
  // Draw the wall to the canvas
  drawLabyrinthWall() {
    let pointCurrent = this.pointsArray[0];
    let pointLast = null;
    
    stroke(235, 20, 20);
    strokeWeight(5);
    ellipse(this.pointOrigin.x, this.pointOrigin.y, 1, 1);
    stroke(235, 235, 235);
    while (pointCurrent) {
      if (!pointCurrent.partOfWall) {
        pointLast = pointCurrent;
        pointCurrent = pointCurrent.pointNext;
        continue;
      }
      if (pointLast) {
        line(pointLast.x, pointLast.y, pointCurrent.x, pointCurrent.y);
      }
      ellipse(pointCurrent.x, pointCurrent.y, 1, 1);
      
      pointLast = pointCurrent;
      pointCurrent = pointCurrent.pointNext;
    }
    if (this.pointsArray[this.pointsArray.length - 1].partOfWall) {
      // line(this.pointsArray[0].x, this.pointsArray[0].y, this.pointsArray[this.pointsArray.length - 1].x, this.pointsArray[this.pointsArray.length - 1].y);
    }
  }
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
  
  // Number of walls to generate for the labyrinth
  let numWalls = 29;

  // Start chance for walls to be closed off
  let wallSegmentClosedChance = 100;

  // Create the walls of the labyrinth, increasing the likelihood of having openings for each iteration
  for (let labyrinthWallCount = 1; labyrinthWallCount < numWalls; labyrinthWallCount += 1) {
    let labyrinthWallNew = new LabyrinthWall(3 * labyrinthWallCount + 1, 15 * labyrinthWallCount, width / 2, height / 2, random(-360, 360), wallSegmentClosedChance);
    labyrinthWallArray.push(labyrinthWallNew);
    
    wallSegmentClosedChance = 100 - (labyrinthWallCount * 2);
  }
}

// Update and draw the walls each frame
function draw() {
  background(20, 20, 20);

  for (let labyrinthWallArrayIndex = 0; labyrinthWallArrayIndex < labyrinthWallArray.length; labyrinthWallArrayIndex += 1) {
    labyrinthWallArray[labyrinthWallArrayIndex].updateLabyrinthWall();
    labyrinthWallArray[labyrinthWallArrayIndex].drawLabyrinthWall();
  }
}