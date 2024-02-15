// Settings
let shapesArray = [];
let shapesArrayRows = 10;
let shapesArrayColumns = 10;
let shapeSize = 300;
let gridSpacing = 400;

// Global variables
let increment = 0;

let viewpointRotationX = 45;
let viewpointRotationY = 45;

let viewpointPositionX = 0;
let viewpointPositionY = 0;
let viewpointElevation = 0;

let viewpointMovementSpeed = gridSpacing / 10;

let viewpointRotationAccelerationX = 0;
let viewpointRotationAccelerationY = 0;

let viewpointMovementAccelerationX = 0;
let viewpointMovementAccelerationY = 0;
let viewpointMovementAccelerationZ = 0;

let keyUpPressed = false;
let keyDownPressed = false;
let keyLeftPressed = false;
let keyRightPressed = false;

let movementKeyUpPressed = false;
let movementKeyDownPressed = false;
let movementKeyLeftPressed = false;
let movementKeyRightPressed = false;

let elevationKeyUpPressed = false;
let elevationKeyDownPressed = false;

let frameUpdateSpeed = 1 / 60;
let frameUpdateCount = frameUpdateSpeed;

let shapeWavePos = 0;

let randomBackgroundColor = 0;

// Shape class
class Shape {
  constructor(x, y, wavePos) {
    this.position = createVector(x, y, 0);
    this.rotation = random(-360, 360);
    this.outlineColor = color(255, 255, 255);
    this.shapeColor = color(255, 255, 255);
    this.wavePos = wavePos;
    
    let randomColorR = random(0, 255);
    let randomColorG = random(0, 255);
    let randomColorB = random(0, 255);
    
    this.outlineColor = color(randomColorR, randomColorG, randomColorB);
    this.shadowColor = color(randomColorR / 1.5, randomColorG / 1.5, randomColorB / 1.5);
    this.shapeColor = color(randomColorR * 1.5, randomColorG * 1.5, randomColorB * 1.5);
    
    this.randomPositionMovementX = random(-100, 100) / 500;
    this.randomPositionMovementY = random(-100, 100) / 500;
    this.randomPositionMovementZ = random(-100, 100) / 500;
    
    this.positionOffsetX = 0;
    this.positionOffsetY = 0;
    this.positionOffsetZ = 0;
    
    this.originX = x;
    this.originY = y;
  }
  
  // Update the shape's data
  update() {
    this.positionOffsetX += this.randomPositionMovementX;
    this.positionOffsetY += this.randomPositionMovementY;
    this.positionOffsetZ += this.randomPositionMovementZ;
    this.position.x = this.originX + this.positionOffsetX;
    this.position.y = this.originY + this.positionOffsetY;
    this.position.z = this.positionOffsetZ + sin(increment + this.wavePos) * (shapeSize / 10);
  }
  
  // Display the shape to the canvas
  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    
    noStroke();
    fill(this.shapeColor);
    
    // Base
    beginShape();
    vertex(-shapeSize / 2, -shapeSize / 2, 0);
    vertex(shapeSize / 2, -shapeSize / 2, 0);
    vertex(shapeSize / 2, shapeSize / 2, 0);
    vertex(-shapeSize / 2, shapeSize / 2, 0);
    endShape(CLOSE);
    
    stroke(this.outlineColor);
    strokeWeight(shapeSize / 10);
    
    // Triangle side 1
    beginShape();
    vertex(-shapeSize / 2, -shapeSize / 2, 0);
    vertex(shapeSize / 2, -shapeSize / 2, 0);
    vertex(0, 0, -shapeSize);
    endShape(CLOSE);
    
    // Triangle side 2
    beginShape();
    vertex(shapeSize / 2, -shapeSize / 2, 0);
    vertex(shapeSize / 2, shapeSize / 2, 0);
    vertex(0, 0, -shapeSize);
    endShape(CLOSE);
    
    fill(this.shadowColor);
    
    // Triangle side 3
    beginShape();
    vertex(shapeSize / 2, shapeSize / 2, 0);
    vertex(-shapeSize / 2, shapeSize / 2, 0);
    vertex(0, 0, -shapeSize);
    endShape(CLOSE);
    
    // Triangle side 4
    beginShape();
    vertex(-shapeSize / 2, shapeSize / 2, 0);
    vertex(-shapeSize / 2, -shapeSize / 2, 0);
    vertex(0, 0, -shapeSize);
    endShape(CLOSE);
    
    fill(this.shapeColor);
    
    /*
    // Triangle side 1
    beginShape();
    vertex(-shapeSize / 2, -shapeSize / 2, 0);
    vertex(shapeSize / 2, -shapeSize / 2, 0);
    vertex(0, 0, -shapeSize);
    endShape(CLOSE);
    
    // Triangle side 2
    beginShape();
    vertex(shapeSize / 2, -shapeSize / 2, 0);
    vertex(shapeSize / 2, shapeSize / 2, 0);
    vertex(0, 0, -shapeSize);
    endShape(CLOSE);
    
    // Triangle side 3
    beginShape();
    vertex(shapeSize / 2, shapeSize / 2, 0);
    vertex(-shapeSize / 2, shapeSize / 2, 0);
    vertex(0, 0, -shapeSize);
    endShape(CLOSE);
    
    // Triangle side 4
    beginShape();
    vertex(-shapeSize / 2, shapeSize / 2, 0);
    vertex(-shapeSize / 2, -shapeSize / 2, 0);
    vertex(0, 0, -shapeSize);
    endShape(CLOSE);
    */
    
    pop();
  }
}

// Track keys being pressed
function keyPressed() {
  if (key == "w") {
    movementKeyUpPressed = true;
  }
  if (key == "a") {
    movementKeyLeftPressed = true;
  }
  if (key == "s") {
    movementKeyDownPressed = true;
  }
  if (key == "d") {
    movementKeyRightPressed = true;
  }
  if (key == "q") {
    elevationKeyUpPressed = true;
  }
  if (key == "e") {
    elevationKeyDownPressed = true;
  }
  
  if (keyCode == UP_ARROW) {
    keyUpPressed = true;
  }
  if (keyCode == LEFT_ARROW) {
    keyLeftPressed = true;
  }
  if (keyCode == DOWN_ARROW) {
    keyDownPressed = true;
  }
  if (keyCode == RIGHT_ARROW) {
    keyRightPressed = true;
  }
}

// Track keys being released
function keyReleased() {
  if (key == "w") {
    movementKeyUpPressed = false;
  }
  if (key == "a") {
    movementKeyLeftPressed = false;
  }
  if (key == "s") {
    movementKeyDownPressed = false;
  }
  if (key == "d") {
    movementKeyRightPressed = false;
  }
  if (key == "q") {
    elevationKeyUpPressed = false;
  }
  if (key == "e") {
    elevationKeyDownPressed = false;
  }
  
  if (keyCode == UP_ARROW) {
    keyUpPressed = false;
  }
  if (keyCode == LEFT_ARROW) {
    keyLeftPressed = false;
  }
  if (keyCode == DOWN_ARROW) {
    keyDownPressed = false;
  }
  if (keyCode == RIGHT_ARROW) {
    keyRightPressed = false;
  }
}

// Create the canvas and the array of shapes
function setup() {
  canvasContainer = $("#canvas-container");
  let canvasNew = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvasNew.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function() {
      console.log("Resizing...");
      resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });
  
  for (let shapesArrayRow = 0; shapesArrayRow < shapesArrayRows; shapesArrayRow += 1) {
    for (let shapesArrayColumn = 0; shapesArrayColumn < shapesArrayColumns; shapesArrayColumn += 1) {
      let shapeCoordinateX = (shapesArrayColumn - shapesArrayColumns) * gridSpacing + (shapesArrayRows * gridSpacing / 2);
      let shapeCoordinateY = (shapesArrayRow - shapesArrayRows) * gridSpacing + (shapesArrayColumns * gridSpacing / 2);
      
      shapesArray.push(new Shape(shapeCoordinateX, shapeCoordinateY, shapeWavePos));
      shapeWavePos += 1;
    }
  }

  // Random background color
  randomBackgroundColor = color(255 / 2, 255 / 2, 255);
  if (random(0, 100) <= 50) {
    randomBackgroundColor = color(255 / 2, 255, 255 / 2);
  }
  if (random(0, 100) <= 50) {
    randomBackgroundColor = color(255, 255 / 2, 255 / 2);
  }
}

// Enable smooth camera movement and update the shapes each frame
function draw() {
  increment += 1 / 5;
  
  if (keyLeftPressed) {
    if (viewpointRotationAccelerationX >= 2) {
      viewpointRotationAccelerationX = 2;
    } else {
      viewpointRotationAccelerationX += 1 / 30;
    }
  } else if (keyRightPressed) {
    if (viewpointRotationAccelerationX <= -2) {
      viewpointRotationAccelerationX = -2;
    } else {
      viewpointRotationAccelerationX -= 1 / 30;
    }
  } else {
    if (viewpointRotationAccelerationX > 0) {
      viewpointRotationAccelerationX -= 1 / 15;
    } else if (viewpointRotationAccelerationX < 0) {
      viewpointRotationAccelerationX += 1 / 15;
    }
  }
  
  if (keyUpPressed) {
    if (viewpointRotationAccelerationY >= 2) {
      viewpointRotationAccelerationY = 2;
    } else {
      viewpointRotationAccelerationY += 1 / 30;
    }
  } else if (keyDownPressed) {
    if (viewpointRotationAccelerationY <= -2) {
      viewpointRotationAccelerationY = -2;
    } else {
      viewpointRotationAccelerationY -= 1 / 30;
    }
  } else {
    if (viewpointRotationAccelerationY > 0) {
      viewpointRotationAccelerationY -= 1 / 15;
    } else if (viewpointRotationAccelerationY < 0) {
      viewpointRotationAccelerationY += 1 / 15;
    }
  }
  
  if (movementKeyUpPressed) {
    if (viewpointMovementAccelerationY >= gridSpacing) {
      viewpointMovementAccelerationY = gridSpacing;
    } else {
      viewpointMovementAccelerationY += 1 / 2;
    }
  } else if (movementKeyDownPressed) {
    if (viewpointMovementAccelerationY <= -gridSpacing) {
      viewpointMovementAccelerationY = -gridSpacing;
    } else {
      viewpointMovementAccelerationY -= 1 / 2;
    }
  } else {
    if (viewpointMovementAccelerationY > 0) {
      viewpointMovementAccelerationY -= 1;
    } else if (viewpointMovementAccelerationY < 0) {
      viewpointMovementAccelerationY += 1;
    }
  }
  
  if (movementKeyLeftPressed) {
    if (viewpointMovementAccelerationX >= gridSpacing) {
      viewpointMovementAccelerationX = gridSpacing;
    } else {
      viewpointMovementAccelerationX += 1 / 2;
    }
  } else if (movementKeyRightPressed) {
    if (viewpointMovementAccelerationX <= -gridSpacing) {
      viewpointMovementAccelerationX = -gridSpacing;
    } else {
      viewpointMovementAccelerationX -= 1 / 2;
    }
  } else {
    if (viewpointMovementAccelerationX > 0) {
      viewpointMovementAccelerationX -= 1;
    } else if (viewpointMovementAccelerationX < 0) {
      viewpointMovementAccelerationX += 1;
    }
  }
  
  if (elevationKeyUpPressed) {
    if (viewpointMovementAccelerationZ >= gridSpacing) {
      viewpointMovementAccelerationZ = gridSpacing;
    } else {
      viewpointMovementAccelerationZ += 1 / 2;
    }
  } else if (elevationKeyDownPressed) {
    if (viewpointMovementAccelerationZ <= -gridSpacing) {
      viewpointMovementAccelerationZ = -gridSpacing;
    } else {
      viewpointMovementAccelerationZ -= 1 / 2;
    }
  } else {
    if (viewpointMovementAccelerationZ > 0) {
      viewpointMovementAccelerationZ -= 1;
    } else if (viewpointMovementAccelerationZ < 0) {
      viewpointMovementAccelerationZ += 1;
    }
  }
  
  /*
  if (movementKeyUpPressed) {
    viewpointPositionX += viewpointMovementSpeed;
  }
  if (movementKeyLeftPressed) {
    viewpointPositionY -= viewpointMovementSpeed;
  }
  if (movementKeyDownPressed) {
    viewpointPositionX -= viewpointMovementSpeed;
  }
  if (movementKeyRightPressed) {
    viewpointPositionY += viewpointMovementSpeed;
  }
  
  if (elevationKeyUpPressed) {
    viewpointElevation += viewpointMovementSpeed;
  }
  if (elevationKeyDownPressed) {
    viewpointElevation -= viewpointMovementSpeed;
  }
  */
  
  viewpointRotationX += viewpointRotationAccelerationX;
  viewpointRotationY += viewpointRotationAccelerationY;
  
  viewpointPositionX += viewpointMovementAccelerationX;
  viewpointPositionY += viewpointMovementAccelerationY;
  viewpointElevation += viewpointMovementAccelerationZ;
  
  /*
  if (keyUpPressed) {
    viewpointRotationY -= viewpointRotationAcceleration;
  }
  if (keyLeftPressed) {
    viewpointRotationX += viewpointRotationAcceleration;
  }
  if (keyDownPressed) {
    viewpointRotationY += viewpointRotationAcceleration;
  }
  if (keyRightPressed) {
    viewpointRotationX -= viewpointRotationAcceleration;
  }
  */
  
  if (frameUpdateCount >= frameUpdateSpeed) {
    frameUpdateCount = 0;
    
    if (viewpointPositionX >= shapesArrayColumns * gridSpacing) {
      viewpointPositionX = shapesArrayColumns * gridSpacing;
      viewpointRotationAccelerationX = 0;
    }
    if (viewpointPositionY >= shapesArrayColumns * gridSpacing) {
      viewpointPositionY = shapesArrayColumns * gridSpacing;
      viewpointRotationAccelerationY = 0;
    }
    if (viewpointPositionX <= -shapesArrayColumns * gridSpacing) {
      viewpointPositionX = -shapesArrayColumns * gridSpacing;
      viewpointRotationAccelerationX = 0;
    }
    if (viewpointPositionY <= -shapesArrayColumns * gridSpacing) {
      viewpointPositionY = -shapesArrayColumns * gridSpacing;
      viewpointRotationAccelerationY = 0;
    }
    if (viewpointElevation >= shapeSize * 2) {
      viewpointElevation = shapeSize * 2;
      viewpointMovementAccelerationZ = 0;
    }
    if (viewpointElevation <= -shapeSize * 2) {
      viewpointElevation = -shapeSize * 2;
      viewpointMovementAccelerationZ = 0;
    }
    
    /*
    if (viewpointRotationX >= 90) {
      viewpointRotationX = 90;
    }
    */
    if (viewpointRotationY >= 180) {
      viewpointRotationY = 180;
      viewpointRotationAccelerationY = 0;
    }
    /*
    if (viewpointRotationX <= -90) {
      viewpointRotationX = 30;
    }
    */
    if (viewpointRotationY <= 0) {
      viewpointRotationY = 0;
      viewpointRotationAccelerationY = 0;
    }

    background(randomBackgroundColor);

    rotateX(radians(viewpointRotationY));
    rotateZ(radians(viewpointRotationX));

    translate((viewpointPositionX), viewpointPositionY, viewpointElevation);

    // translate(gridSpacing * shapesArrayRows / 2, gridSpacing * shapesArrayColumns / 2, 0);

    // rotateY(radians(mouseY));

    for (let shapeCount = 0; shapeCount < shapesArray.length; shapeCount += 1) {
      shapesArray[shapeCount].update();
      shapesArray[shapeCount].display();
    }
  } else {
    frameUpdateCount += 1 / 60;
  }
}