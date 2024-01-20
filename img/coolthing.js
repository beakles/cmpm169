let treeSettings = {
  startCount: 5,
  levelsMax: 6,
  levelsCountIncrement: 1,
  rootLength: 50,
};
let treeRoots = [];
let waveIncrement = 0;

class Root {
  constructor(rootCoordinateXOrigin, rootCoordinateYOrigin, rootLevel, rootParent) {
    this.rootCoordinateXOrigin = rootCoordinateXOrigin;
    this.rootCoordinateYOrigin = rootCoordinateYOrigin;
    this.rootCoordinateXOffset = 0;
    this.rootCoordinateYOffset = 0;
    this.rootCoordinateXResult = 0;
    this.rootCoordinateYResult = 0;
    
    this.rootLevel = rootLevel;
    this.rootParent = rootParent;
    this.rootChildren = [];
    // this.rootIncrement = random(0, 100);
    
    treeRoots.push(this);
  }
  
  updateRoot() {
    this.rootCoordinateXOffset = 10 * sin(waveIncrement / 20 + (this.rootLevel * 5));
    this.rootCoordinateXResult = this.rootCoordinateXOrigin + this.rootCoordinateXOffset;
    this.rootCoordinateYOffset = 10 * sin(waveIncrement / 10 + (this.rootLevel * 5));
    this.rootCoordinateYResult = this.rootCoordinateYOrigin + this.rootCoordinateYOffset;
  }
  
  displayRoot() {
    stroke(255, 255, 255);
    strokeWeight(5);
    if (this.rootParent) {
      line(this.rootCoordinateXResult, this.rootCoordinateYResult, this.rootParent.rootCoordinateXResult, this.rootParent.rootCoordinateYResult);
    }
    noStroke();
    color(255, 255, 255);
    ellipse(this.rootCoordinateXResult, this.rootCoordinateYResult, 10, 10);
  }
}

function createRoot(rootParent) {
  let newRootLevel = rootParent.rootLevel + 1;
  if (newRootLevel >= treeSettings.levelsMax) {
    print('reached end of tree');
    return null;
  }
  
  let rootNew = new Root(rootParent.rootCoordinateXOrigin, rootParent.rootCoordinateYOrigin, rootParent.rootLevel + 1, rootParent);
  
  rootNew.rootChildren[0] = createRoot(rootNew);
  rootNew.rootChildren[1] = createRoot(rootNew);
  
  return rootNew;
}

function createTree(treeOriginX, treeOriginY) {
  let rootNew = new Root(treeOriginX, treeOriginY, 0, null);
  
  createRoot(rootNew);
  /*
  let newRootLevel = rootParent.rootLevel + 1;
  if (newRootLevel > treeSettings.levels) {
    return null;
  }
  let rootNew = new Root(rootParent.rootCoordinateXResult, rootParent.rootCoordinateYResult - treeSettings.rootLength, newRootLevel, rootParent);
  rootNew.rootChildren[0] = createChildren(rootNew);
  rootNew.rootChildren[1] = createChildren(rootNew);
  return rootNew.rootChildren[0] == null or 
  // return createChildren(rootNew);
  // let rootNew = new Root(width / 2 - (50 * newRootLevel), rootParent.rootCoordinateY - treeSettings.rootLength, newRootLevel, rootParent);
  // let rootNew2 = new Root(width / 2 + (50 * newRootLevel), rootParent.rootCoordinateY - treeSettings.rootLength, newRootLevel, rootParent);
  // return createChildren(rootNew);
  */
}

function setup() {
  createCanvas(800, 800); // 800px X 800px canvas size
  createTree(width / 2, height / 2);
  // treeRoots[0] = new Root(width / 2, height / 2, 0, null);
  // createChildren(treeRoots[0]);
}

function draw() {
  background(20, 20, 20);
  
  for (let index = 0; index < treeRoots.length; index += 1) {
    treeRoots[index].updateRoot();
    treeRoots[index].displayRoot();
  }
  
  waveIncrement += 1;
}