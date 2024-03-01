// Data Source: https://www.cbsnews.com/chicago/news/best-places-to-survive-a-nuclear-apocalypse/
// Map Source: https://commons.wikimedia.org/wiki/File:Map_of_USA_without_state_names.svg

let increment = 0;

let cameraX = 0;
let cameraY = 0;
let cameraXLast = 0;
let cameraYLast = 0;
let cameraXStart = 0;
let cameraYStart = 0;
let cameraXDelta = 0;
let cameraYDelta = 0;
let cameraZoom = -1000;
let isMovingCamera = false;

let isZoomingIn = false;
let isZoomingOut = false;

let mapImage;
let font;
let dataArray;

let warheadTargetsArray = [];

let lastCoordinateX = 0;
let flagSide = false;

let showRadius = false;
let showLabels = true;

class warheadTarget {
  constructor(newCity, newState, newCoordinateX, newCoordinateY, newBigTargetScenario, newSmallTargetScenario, newClusterSize) {
    this.city = newCity;
    this.state = newState;
    this.coordinateX = newCoordinateX;
    this.coordinateY = newCoordinateY;
    this.bigTargetScenario = newBigTargetScenario;
    this.smallTargetScenario = newSmallTargetScenario;
    this.clusterSize = newClusterSize;
    
    this.size = newClusterSize * 10 + 22;
    this.flagSide = flagSide;
    
    flagSide = !flagSide;
  }
  
  displayText() {
    push();
    
    if (!showRadius) {
      if (this.flagSide) {
        translate(this.coordinateX - 49, this.coordinateY, this.size - 11);
        rotateX(-radians(90));
        textAlign(CENTER, CENTER);
        textSize(4);
        stroke(64, 64, 64, 255);
        strokeWeight(1);
        fill(32, 32, 32, 255);
        translate(0, 0, -1);
        box(94, 22, 0);
        noStroke();
        translate(0, -0.5, 1);
        fill(255, 64, 64, 255);
      } else {
        translate(this.coordinateX + 49, this.coordinateY, this.size - 11);
        rotateX(-radians(90));
        textAlign(CENTER, CENTER);
        textSize(4);
        stroke(64, 64, 64, 255);
        strokeWeight(1);
        fill(32, 32, 32, 255);
        translate(0, 0, -1);
        box(94, 22, 0);
        noStroke();
        translate(0, -0.5, 1);
        fill(255, 64, 64, 255);
      }
    } else {
      translate(this.coordinateX, this.coordinateY, 15 + (this.size / 20));
      rotateX(-radians(90));
      textAlign(CENTER, CENTER);
      textSize(4 + (this.size / 250));
      stroke(64, 64, 64, 255);
      strokeWeight(1);
      fill(32, 32, 32, 255);
      translate(0, 0, -1);
      box(94 + (this.size / 18), 22 + (this.size / 40), 0);
      noStroke();
      translate(0, -0.5, 1);
      fill(255, 64, 64, 255);
    }
    
    let priorityResult = "";
    let riskLevelResult = "";
    
    if (this.smallTargetScenario) {
      priorityResult += "500-warhead ";
      riskLevelResult = "Medium risk";
    }
    
    if (this.bigTargetScenario) {
      if (this.smallTargetScenario) {
        priorityResult += "& ";
      }
      priorityResult += "2000-warhead ";
      riskLevelResult = "High risk";
    }
    
    if (this.smallTargetScenario && this.bigTargetScenario) {
      riskLevelResult = "Extreme risk";
    }
    
    if (!this.smallTargetScenario && !this.bigTargetScenario) {
      priorityResult += "Negligible target in any possible ";
      riskLevelResult = "Low";
    }
    
    text(this.city + ", " + this.state + "\nScenario Categories: " + priorityResult + "scenario\nRisk Level: " + riskLevelResult + "\nCluster Size: ~" + this.clusterSize + " warheads", 0, 0);
    
    pop();
  }
  
  display() {
    push();
    
    if (!showRadius) {
      translate(this.coordinateX, this.coordinateY, this.size / 2);
      rotateX(-radians(90));
      if (this.smallTargetScenario) {
        stroke(255, 128, 0, 255);
        strokeWeight(1);
        fill(128, 128, 0, 255);
        box(1, this.size, 1);
      }
      if (this.bigTargetScenario) {
        stroke(255, 0, 0, 128);
        strokeWeight(2);
        fill(255, 0, 0, 128);
        box(2, this.size, 2);
      }
    } else {
      translate(this.coordinateX, this.coordinateY, 1);
      rotateX(-radians(90));
      if (this.smallTargetScenario) {
        stroke(255, 128, 0, 255);
        strokeWeight(1);
        fill(128, 128, 0, 255);
        box(this.size / 9, 1, this.size / 9);
      }
      if (this.bigTargetScenario) {
        stroke(255, 0, 0, 128);
        strokeWeight(2);
        fill(255, 0, 0, 128);
        box(this.size / 9 + 1, 2, this.size / 9 + 1);
      }
    }
    
    pop();
  }
}

function mousePressed() {
  isMovingCamera = true;
  
  cameraXStart = mouseX;
  cameraYStart = mouseY;
}

function mouseReleased() {
  isMovingCamera = false;
  
  cameraXLast = cameraX;
  cameraYLast = cameraY;
}

function mouseWheel(mouseWheelInput) {
  /*
  cameraZoom -= mouseWheelInput.delta / 5;
  
  if (cameraZoom >= 300) {
    cameraZoom = 300;
  }
  
  if (cameraZoom <= -4000) {
    cameraZoom = -4000;
  }
  */
}

function keyPressed() {
  if (key == "r") {
    showRadius = !showRadius;
  }
  if (key == "h") {
    showLabels = !showLabels;
  }
  if (key == "q") {
    isZoomingIn = true;
  }
  if (key == "e") {
    isZoomingOut = true;
  }
}

function keyReleased() {
  if (key == "q") {
    isZoomingIn = false;
  }
  if (key == "e") {
    isZoomingOut = false;
  }
}

function preload() {
  mapImage = loadImage('data/worldMapNoWater.png');
  font = loadFont('data/Staatliches-Regular.ttf');
  dataArray = loadTable('data/worldMapData.csv', 'csv', 'header');
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
  textFont(font);
  
  for (let i = 0; i < dataArray.getRowCount(); i++) {
    let city = dataArray.getString(i, 'city');
    let state = dataArray.getString(i, 'state');
    let coordinateX = dataArray.getNum(i, 'coordinateX');
    let coordinateY = dataArray.getNum(i, 'coordinateY');
    let bigTargetScenario = dataArray.getNum(i, 'bigTargetScenario');
    let smallTargetScenario = dataArray.getNum(i, 'smallTargetScenario');
    let clusterSize = dataArray.getNum(i, 'clusterSize');
    
    let newWarheadTarget = new warheadTarget(city, state, coordinateX, coordinateY, bigTargetScenario, smallTargetScenario, clusterSize);
    warheadTargetsArray.push(newWarheadTarget);
    
    // print(city + ", " + state + ": (" + coordinateX + ", " + coordinateY + "), Warheads: " + numWarheads);
  }
}

function draw() {
  background(20, 20, 20);
  
  noStroke();
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  textSize(canvasContainer.width() / 100);
  text("List of potential Nuclear warhead targets (Natural Resources Defense Council, FEMA and Medicine and Global Survival, 2015)\nUse the mouse (click and hold to drag) and keyboard (Q/E to zoom in/out) to navigate around the map\nPress R to swap between visualizations (1 warhead = ~3 miles of destructive power)\nPress H to show/hide labels", 0, -canvasContainer.height() / 2 + (canvasContainer.width() / 30) + 5 * sin(increment / 50));
  
  increment += 1;
  
  let mouseOffsetX = (-canvasContainer.width() / 2) + mouseX;
  let mouseOffsetY = (canvasContainer.height() / 2) + mouseY;
  
  // Set up the camera
  rotateX(radians(75 - 15 * (cameraZoom / 4000) - mouseOffsetY / 200 + 1 * sin(increment / 100)))
  rotateY(radians(mouseOffsetX / 200 + 1 * cos(increment / 100)));
  
  if (isZoomingIn) {
    cameraZoom -= 50;
  }
  if (isZoomingOut) {
    cameraZoom += 50;
  }
  
  if (cameraZoom >= 300) {
    cameraZoom = 300;
  }
  
  if (cameraZoom <= -4000) {
    cameraZoom = -4000;
  }
  
  if (isMovingCamera) {
    cameraXDelta = cameraXStart - mouseX + cameraXLast;
    cameraYDelta = cameraYStart - mouseY + cameraYLast;
    
    cameraX = cameraXDelta;
    cameraY = cameraYDelta;
    
    if (cameraX <= -4000) {
      cameraX = -4000;
    }
    if (cameraX >= 4000) {
      cameraX = 4000;
    }
    if (cameraY <= -4000) {
      cameraY = -4000;
    }
    if (cameraY >= 4000) {
      cameraY = 4000;
    }
  }
  
  translate(-cameraX, -cameraY + cameraZoom, cameraZoom / 2);
  
  noStroke();
  texture(mapImage);
  plane(1000, 1000);
  
  for (let warheadTargetsArrayIndex = 0; warheadTargetsArrayIndex < warheadTargetsArray.length; warheadTargetsArrayIndex += 1) {
    warheadTargetsArray[warheadTargetsArrayIndex].display();
    if (showLabels) {
      warheadTargetsArray[warheadTargetsArrayIndex].displayText();
    }
    
    lastCoordinateX = warheadTargetsArray[warheadTargetsArrayIndex].coordinateX;
  }
}
