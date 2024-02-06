// Settings
let settings = {
    videoUpdateFrequency: 1 / 24,
    videoUpdateFrequencyMicActive: 2,
    microphoneLevelAmplifier: 1,
    microphoneLevelThreshold: 20,
    distortionSizeCap: 200,
}

// Global variables
let videoFeed;
let microphone;
let microphoneLevelMap;

let textEnabledTime = 1;
let textEnabledDebounce = 0;
let textEnabledBool = false;
let glitchedBloomDebounce = 0;

let videoUpdateDebounce = 0;
let currentVideoUpdateFrequency = settings.videoUpdateFrequency;

let sound1;
let sound2;
let sound3;
let sound4;

// Load the sounds
function preload() {
    sound1 = loadSound("assets/cameraRestart.wav");
    sound2 = loadSound("assets/cameraShutdown.wav");
    // sound2.volume(0.7);
    // sound2.rate(0.5);
    sound3 = loadSound("assets/click.wav");
    sound4 = loadSound("assets/staticSpawn.wav");
}

// Set up the video and microphone feeds
function setup() {
  createCanvas(600, 600);
  
  background(0, 0, 0);
  
  videoFeed = createCapture(VIDEO);
  videoFeed.size(width, height);
  videoFeed.hide();
  
  microphone = new p5.AudioIn();
  microphone.start();

  let audioContext = getAudioContext();
  sound1.play();
}

// Glitch effect
function scatterScreen(times, size) {
  if (size <= 1) {
    size = 1;
  }
  
  for (let increment = 0; increment < times; increment += 1) {
    let subImageDistortionX = random(width);
    let subImageDistortionY = random(height);

    let subImageDistortionXNew = round(subImageDistortionX + random(-size, size));
    let subImageDistortionYNew = round(subImageDistortionY + random(-size, size));

    set(subImageDistortionXNew, subImageDistortionYNew, get(subImageDistortionX, subImageDistortionY, size, size));
  }
}

// Camera lens
function drawCrosshair() {
  fill(255, 255, 255, 255);
  stroke(0, 0, 0, 0);
  rect(width - 110, height - 20, 100, 10);
  rect(width - 20, height - 110, 10, 100);

  rect(0 + 10, height - 20, 100, 10);
  rect(0 + 10, height - 110, 10, 100);

  rect(width - 110, 0 + 10, 100, 10);
  rect(width - 20, 0 + 10, 10, 100);

  rect(0 + 10, 0 + 10, 100, 10);
  rect(0 + 10, 0 + 10, 10, 100);

  rect(width / 2 - 18, height / 2, 40, 5);
  rect(width / 2, height / 2 - 18, 5, 40);
}

// 
function draw() {
  if (videoUpdateDebounce >= currentVideoUpdateFrequency) {
    if (currentVideoUpdateFrequency >= settings.videoUpdateFrequencyMicActive) {
      fill(255, 0, 0, 255);
      stroke(0, 0, 0, 0);
      rect(0, 0, width, height)
      currentVideoUpdateFrequency = settings.videoUpdateFrequency;
      if (!sound1.isPlaying()) {
        sound1.play();
      }
    } else {
      videoUpdateDebounce = 0;
      currentVideoUpdateFrequency = settings.videoUpdateFrequency;
      image(videoFeed, 0, 0, width, height);
        
      drawCrosshair();
      
      filter(GRAY);
      
      // Flash the "recording" text periodically
      if (textEnabledBool) {
        fill(255, 0, 0, 170);
        stroke(0, 0, 0, 0);
        textFont("Courier New");
        textSize(24);
        textStyle(BOLD);
        textAlign(CENTER);
        text("Recording", 130, 35 + (24 / 2));
        fill(255, 0, 0, 170);
        ellipse(40, 40, 20, 20);
      } else {
        fill(255, 0, 0, 170);
        ellipse(40, 40, 20, 20);
      }
      
      // Randomly make harder glitches
      glitchedBloomDebounce = random(0, 100);
      if (glitchedBloomDebounce <= 10) {
        let randomEffect = random(0, 100);
        if (randomEffect <= 50) {
          filter(DILATE);
          sound3.setVolume(1);
          sound3.play();
        } else {
          filter(THRESHOLD);
          sound4.play();
        }
      }
      scatterScreen(10, 10);
    }

  } else {
    videoUpdateDebounce += 1 / 60;
  }
  
  // Debounce between text flashes
  if (textEnabledDebounce >= textEnabledTime) {
    textEnabledDebounce = 0;
    textEnabledBool = !textEnabledBool;
  } else {
    textEnabledDebounce += 1 / 60;
  }
  
  // Get the microphone volume
  let microphoneLevel = microphone.getLevel() * settings.microphoneLevelAmplifier;
  microphoneLevelMap = map(microphoneLevel, 0, 1, 0, settings.distortionSizeCap);
  microphoneLevelMap = floor(microphoneLevelMap);
  
  // print(microphoneLevelMap);
  
  if (microphoneLevelMap >= settings.microphoneLevelThreshold) {
    videoUpdateDebounce = 0;
    currentVideoUpdateFrequency = settings.videoUpdateFrequencyMicActive;
  }
  
  // Crash the camera
  if (currentVideoUpdateFrequency >= settings.videoUpdateFrequencyMicActive && microphoneLevelMap < settings.microphoneLevelThreshold) {
    sound3.setVolume(0.5);
    sound3.play();
    scatterScreen(7, (width / 3) * (videoUpdateDebounce / currentVideoUpdateFrequency));
  }
  
  // Minor glitches throughout the art
  scatterScreen(microphoneLevelMap, microphoneLevelMap);
}