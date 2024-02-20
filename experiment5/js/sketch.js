// Global variables
let puzzlePieceArray = [];
let puzzlePieceSelected = null;
let puzzlePieceSelectedChildren = [];
let puzzlePieceSelectedChildrenPositionOffsetX = [];
let puzzlePieceSelectedChildrenPositionOffsetY = [];
let puzzlePieceFonts = ['Arial', 'Helvetica', 'Courier New', 'Times New Roman'];
let animationIncrement = 0;

let isWord = false;

let selectedOffsetX = 0;
let selectedOffsetY = 0;

// Puzzle Piece class
class PuzzlePiece {
  constructor(newLetter, newX, newY) {
    this.letter = newLetter;
    this.letterFont = puzzlePieceFonts[int(random(0, puzzlePieceFonts.length))];
    
    this.letterColor = color(random(40, 255), random(40, 255), random(40, 255));
    this.letterSize = random(30, 100);
    
    this.letterSizeOffset = this.letterSize;
    
    this.puzzlePiecePrevious = null;
    this.puzzlePieceNext = null;
    
    this.puzzlePieceLocationX = newX;
    this.puzzlePieceLocationY = newY;
    
    this.animationOffset = random(-1e6, 1e6);
    this.animationMultiplier = 0;
    
    this.puzzlePieceID = random(-1e6, 1e6);
    
    this.isSelected = false;
    this.isChild = false;
    this.disableAnimation = false;
  }
  
  displayPuzzlePiece() {
    fill(this.letterColor);
    textFont(this.letterFont);
    textSize(this.letterSize + this.letterSizeOffset);
    textAlign(CENTER, CENTER);
    if (!this.disableAnimation) {
      text(this.letter, this.puzzlePieceLocationX + this.animationMultiplier * sin((animationIncrement + this.animationOffset) / 2), this.puzzlePieceLocationY + this.animationMultiplier * cos(animationIncrement + this.animationOffset));
    } else {
      text(this.letter, this.puzzlePieceLocationX, this.puzzlePieceLocationY);
    }
  }
  
  updatePuzzlePiece() {
    if (this.isSelected) {
      if (this.animationMultiplier > 0) {
        this.animationMultiplier -= 1 / 1;
      } else {
        this.animationMultiplier = 0;
      }
    } else {
      if (this.animationMultiplier < 10) {
        this.animationMultiplier += 1 / 10;
      } else {
        this.animationMultiplier = 10;
      }
    }
    
    if (this.letterSizeOffset > 0) {
      this.letterSizeOffset -= 1 * 10;
    } else {
      this.letterSizeOffset = 0;
    }
  }
}

// Track mouse clicks
function mousePressed() {
  for (let puzzlePieceArrayIndex = puzzlePieceArray.length - 1; puzzlePieceArrayIndex >= 0; puzzlePieceArrayIndex -= 1) {
    let puzzlePieceCurrent = puzzlePieceArray[puzzlePieceArrayIndex];
    if (dist(mouseX, mouseY, puzzlePieceCurrent.puzzlePieceLocationX, puzzlePieceCurrent.puzzlePieceLocationY) < puzzlePieceCurrent.letterSize / 2) {
      
      selectedOffsetX = mouseX - puzzlePieceCurrent.puzzlePieceLocationX;
      selectedOffsetY = mouseY - puzzlePieceCurrent.puzzlePieceLocationY;

      puzzlePieceSelected = puzzlePieceCurrent;
      puzzlePieceSelected.puzzlePieceLocationX = mouseX - selectedOffsetX;
      puzzlePieceSelected.puzzlePieceLocationY = mouseY - selectedOffsetY;
      puzzlePieceSelected.isSelected = true;
      
      if (!puzzlePieceSelected.puzzlePiecePrevious) {
        if (puzzlePieceSelected.puzzlePieceNext) {
          print('this is a word');
          isWord = true;
        } else {
          print('this is a single letter');
        }
        
        let puzzlePieceChild = puzzlePieceSelected.puzzlePieceNext;
        while (puzzlePieceChild) {
          puzzlePieceSelectedChildren.push(puzzlePieceChild);
          puzzlePieceSelectedChildrenPositionOffsetX.push(puzzlePieceChild.puzzlePieceLocationX - puzzlePieceSelected.puzzlePieceLocationX);
          puzzlePieceSelectedChildrenPositionOffsetY.push(puzzlePieceChild.puzzlePieceLocationY - puzzlePieceSelected.puzzlePieceLocationY);
          
          puzzlePieceChild = puzzlePieceChild.puzzlePieceNext;
        }
      } else {
        print('this is a letter that is part of a word');
      }
      
      puzzlePieceArray.splice(puzzlePieceArrayIndex, 1);
      puzzlePieceArray.push(puzzlePieceSelected);
      
      break;
    }
  }
}

// Track mouse releases
function mouseReleased() {
  let puzzlePieceCombining = false;
  
  if (puzzlePieceSelected) {
    for (let puzzlePieceArrayIndex = puzzlePieceArray.length - 1; puzzlePieceArrayIndex >= 0; puzzlePieceArrayIndex -= 1) {
      let puzzlePiecesIDCheck = puzzlePieceSelected.puzzlePieceID != puzzlePieceArray[puzzlePieceArrayIndex].puzzlePieceID;
      let puzzlePiecesDistanceCheck = dist(puzzlePieceSelected.puzzlePieceLocationX, puzzlePieceSelected.puzzlePieceLocationY, puzzlePieceArray[puzzlePieceArrayIndex].puzzlePieceLocationX, puzzlePieceArray[puzzlePieceArrayIndex].puzzlePieceLocationY) < puzzlePieceSelected.letterSize / 1.5;
      if (!puzzlePieceSelected.isChild && !isWord && puzzlePiecesIDCheck && puzzlePiecesDistanceCheck) {
        if (puzzlePieceArray[puzzlePieceArrayIndex].puzzlePieceNext) {
          print('bridging the gap between two letters');
          puzzlePieceArray[puzzlePieceArrayIndex].puzzlePieceNext.puzzlePiecePrevious = puzzlePieceSelected;
          puzzlePieceSelected.puzzlePieceNext = puzzlePieceArray[puzzlePieceArrayIndex].puzzlePieceNext;
        }
        
        puzzlePieceArray[puzzlePieceArrayIndex].puzzlePieceNext = puzzlePieceSelected;
        puzzlePieceSelected.puzzlePiecePrevious = puzzlePieceArray[puzzlePieceArrayIndex];
        
        puzzlePieceSelected.animationOffset = puzzlePieceArray[puzzlePieceArrayIndex].animationOffset;
        
        puzzlePieceCombining = true;
        
        puzzlePieceSelected.isChild = true;
        
        print("this letter is on top of another letter; combining into a word");
        
        puzzlePieceSelected.letterSizeOffset = puzzlePieceSelected.letterSize;
        puzzlePieceArray[puzzlePieceArrayIndex].letterSizeOffset = puzzlePieceArray[puzzlePieceArrayIndex].letterSize;
        
        // puzzlePieceSelected.disableAnimation = true;
        // puzzlePieceArray[puzzlePieceArrayIndex].disableAnimation = true;
        break;
      }
    }
    
    if (!isWord && !puzzlePieceCombining) {
      
      if (!puzzlePieceSelected.puzzlePieceNext && !puzzlePieceSelected.puzzlePiecePrevious) {
        print("this letter is isolated");
        // puzzlePieceSelected.disableAnimation = false;
      } else {
        print("this letter is part of a word; breaking up from the word");
        
        puzzlePieceSelected.isChild = false;
        // puzzlePieceSelected.disableAnimation = false;
      }
      
      puzzlePieceSelected.animationOffset = random(-1e6, 1e6);
      if (puzzlePieceSelected.puzzlePiecePrevious) {
        puzzlePieceSelected.puzzlePiecePrevious.puzzlePieceNext = puzzlePieceSelected.puzzlePieceNext;
      }
      if (puzzlePieceSelected.puzzlePieceNext) {
        puzzlePieceSelected.puzzlePieceNext.puzzlePiecePrevious = puzzlePieceSelected.puzzlePiecePrevious;
      }
      puzzlePieceSelected.puzzlePiecePrevious = null;
      puzzlePieceSelected.puzzlePieceNext = null;
    }
    
    puzzlePieceSelected.isSelected = false;
  }
  
  while (puzzlePieceSelectedChildren.length > 0) {
    puzzlePieceSelectedChildren[puzzlePieceSelectedChildren.length - 1].isSelected = false;
    puzzlePieceSelectedChildren.pop();
  }
  while (puzzlePieceSelectedChildrenPositionOffsetX.length > 0) {
    puzzlePieceSelectedChildrenPositionOffsetX.pop();
  }
  while (puzzlePieceSelectedChildrenPositionOffsetY.length > 0) {
    puzzlePieceSelectedChildrenPositionOffsetY.pop();
  }
  isWord = false;
  puzzlePieceSelected = null;
}

// Track key presses
function keyPressed() {
  if (/^[a-zA-Z]$/.test(key)) {
    let puzzlePieceNew = new PuzzlePiece(key, random(0 + 100, canvasContainer.width() - 100), random(0 + 100, canvasContainer.height() - 100));
    puzzlePieceArray.push(puzzlePieceNew);
  }
}

// Setup the canvas
function setup() {
    canvasContainer = $("#canvas-container");
    let canvasNew = createCanvas(canvasContainer.width(), canvasContainer.height());
    canvasNew.parent("canvas-container");
    // resize canvas is the page is resized
    $(window).resize(function() {
        console.log("Resizing...");
        resizeCanvas(canvasContainer.width(), canvasContainer.height());
    });

  for (let puzzlePieceCount = 0; puzzlePieceCount < 10; puzzlePieceCount += 1) {
    let newPuzzlePiece = new PuzzlePiece(String.fromCharCode(97 + floor(random() * 26)), random(0, canvasContainer.width()), random(0, canvasContainer.height()));
    puzzlePieceArray.push(newPuzzlePiece);
  }
}

// Draw the puzzle pieces
function draw() {
  background(20, 20, 20);
  
  animationIncrement += 1 / 60;
  
  if (puzzlePieceSelected) {
    puzzlePieceSelected.puzzlePieceLocationX = mouseX - selectedOffsetX;
    puzzlePieceSelected.puzzlePieceLocationY = mouseY - selectedOffsetY;
    
    if (puzzlePieceSelectedChildren.length > 0) {
      for (let puzzlePieceSelectedChildrenIndex = 0; puzzlePieceSelectedChildrenIndex < puzzlePieceSelectedChildren.length; puzzlePieceSelectedChildrenIndex += 1) {
        let puzzlePieceSelectedChild = puzzlePieceSelectedChildren[puzzlePieceSelectedChildrenIndex];
        let puzzlePieceSelectedChildOffsetX = puzzlePieceSelectedChildrenPositionOffsetX[puzzlePieceSelectedChildrenIndex];
        let puzzlePieceSelectedChildOffsetY = puzzlePieceSelectedChildrenPositionOffsetY[puzzlePieceSelectedChildrenIndex];
        
        puzzlePieceSelectedChild.isSelected = true;
        
        puzzlePieceSelectedChild.puzzlePieceLocationX = puzzlePieceSelected.puzzlePieceLocationX + puzzlePieceSelectedChildOffsetX;
        puzzlePieceSelectedChild.puzzlePieceLocationY = puzzlePieceSelected.puzzlePieceLocationY + puzzlePieceSelectedChildOffsetY;
      }
    }
  }
  
  for (let puzzlePieceArrayIndex = 0; puzzlePieceArrayIndex < puzzlePieceArray.length; puzzlePieceArrayIndex += 1) {
    puzzlePieceArray[puzzlePieceArrayIndex].updatePuzzlePiece();
    puzzlePieceArray[puzzlePieceArrayIndex].displayPuzzlePiece();
  }
  // if (animationIncrement < 5) {
  fill(255, 255, 255, 255);
  textFont("Times New Roman");
  textSize(15);
  textAlign(CENTER, TOP);
  text("Type letters to create more letters.\nCombine letters into words by dragging and dropping onto letters.\nRemove letters from words by clicking and dragging them away.\nDrag the first letter in a word to move the entire word.", canvasContainer.width() / 2, 0 + 10);
  // }
}