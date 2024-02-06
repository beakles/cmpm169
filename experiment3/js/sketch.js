let videoFeed;
let microphone;
let microphoneLevelMap;

let settings = {
  videoUpdateFrequency: 1 / 24,
  videoUpdateFrequencyMicActive: 2,
  microphoneLevelAmplifier: 1,
  microphoneLevelThreshold: 20,
  distortionSizeCap: 200,
}

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

function preload() {
    sound1 = new p5.SoundFile("assets/cameraRestart.wav");
    sound2 = new p5.SoundFile("assets/cameraShutdown.wav");
    sound3 = new p5.SoundFile("assets/click.wav");
    sound4 = new p5.SoundFile("assets/staticSpawn.wav");
}

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
  sound2.play();
  sound3.play();
  sound4.play();
}

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

function draw() {
  if (videoUpdateDebounce >= currentVideoUpdateFrequency) {
    if (currentVideoUpdateFrequency >= settings.videoUpdateFrequencyMicActive) {
      fill(255, 0, 0, 255);
      stroke(0, 0, 0, 0);
      rect(0, 0, width, height)
      currentVideoUpdateFrequency = settings.videoUpdateFrequency;
    } else {
      videoUpdateDebounce = 0;
      currentVideoUpdateFrequency = settings.videoUpdateFrequency;
      image(videoFeed, 0, 0, width, height);
        
      drawCrosshair();
      
      filter(GRAY);
      
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
      
      glitchedBloomDebounce = random(0, 100);
      if (glitchedBloomDebounce <= 10) {
        let randomEffect = random(0, 100);
        if (randomEffect <= 50) {
          filter(DILATE);
        } else {
          filter(THRESHOLD);
        }
      }
      scatterScreen(10, 10);
    }

  } else {
    videoUpdateDebounce += 1 / 60;
  }
  
  if (textEnabledDebounce >= textEnabledTime) {
    textEnabledDebounce = 0;
    textEnabledBool = !textEnabledBool;
  } else {
    textEnabledDebounce += 1 / 60;
  }
  
  let microphoneLevel = microphone.getLevel() * settings.microphoneLevelAmplifier;
  microphoneLevelMap = map(microphoneLevel, 0, 1, 0, settings.distortionSizeCap);
  microphoneLevelMap = floor(microphoneLevelMap);
  
  print(microphoneLevelMap);
  
  if (microphoneLevelMap >= settings.microphoneLevelThreshold) {
    videoUpdateDebounce = 0;
    currentVideoUpdateFrequency = settings.videoUpdateFrequencyMicActive;
  }
  
  if (currentVideoUpdateFrequency >= settings.videoUpdateFrequencyMicActive && microphoneLevelMap < settings.microphoneLevelThreshold) {
    scatterScreen(7, (width / 3) * (videoUpdateDebounce / currentVideoUpdateFrequency));
  }
  
  scatterScreen(microphoneLevelMap, microphoneLevelMap);
}