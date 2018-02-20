(function() {
    var socket = io.connect(window.location.hostname + ':' + 3000);
    var red = document.getElementById('red');
    var green = document.getElementById('green');
    var blue = document.getElementById('blue');



    function emitValue(color, e) {
        socket.emit('rgb', {
            color: color,
            value: e.target.value
        });
        socket.emit('pushPad', {
            // dataPad: asd
        });
        socket.emit('releasePad', {
            // dataPad: asd
        });
    }


    socket.on('connect', function(data) {
        socket.emit('join', 'Client is connected!');
    });

    socket.on('rgb', function(data) {
        var color = data.color;
        document.getElementById(color).value = data.value;
    });
    socket.on('pushPad', function(button) {
        let padPin = button;

        let correctPad = compareNumber(padPin);
        if(correctPad === true) {
          // Emit pin to turn on LED, event name is LEDCorrectfeedback which can be handled on the rgb.js side. Button is the pin number and should be directed to its LED lights.
          socket.emit('LEDCorrectfeedback', button);
        }

    });
    socket.on('releasePad', function(data) {
        // console.log('release');
        // sound.pause();
        // sound.play();
        // if(state == 'pause'){
        //   sound.pause();
        // }
    });
    socket.on('holdPad', function(button) {
        let padPin = button;
        console.log('hold');
        holdPad();
        let correctPad = compareCheck(padPin);
        if(correctPad === true) {
          holdPad();

        }
        // sound.pause();
        // sound.play();
        // if(state == 'pause'){
        //   sound.pause();
        // }
    });

}());


// -------------------
// TOdo
// -------------------
/*

1. Timer that's resets after each sound and a global Timer
2. Play around with "holding" the pad and distorting the sounds
3. Success sound when hitting correct pad


*/
//

// Soundeffects used on sounds


let dubDelay = new Pizzicato.Effects.DubDelay({
    feedback: 0.6,
    time: 0.7,
    mix: 0.5,
    cutoff: 700
});

let distortion = new Pizzicato.Effects.Delay({
  gain: 0.1
});

let ringModulator = new Pizzicato.Effects.RingModulator({
    speed: 585,
    distortion: 33,
    mix: 1
});

let flanger = new Pizzicato.Effects.Flanger({
    time: 0.41,
    speed: 0.74,
    depth: 0.79,
    feedback: 0.88,
    mix: 0.77
});



// Each sound should be created as a object like this. Just change the var name and source and you should be good to go. Don't forget to add the var name to the two arrays below called "group" and "soundArray".

var accordion = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../sadaccordion.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var torture = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../phased_torture.wav',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var central = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../central.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});



// --- Variables used throughout document

let group = new Pizzicato.Group([accordion, torture, central]); // Add sounds to this group in order to control and to the array below in order to store additional values
let soundArray = [accordion, torture, central];
let soundChecker = null; // init a variable to check which sound is playing
let historyToAnalyze = []; // Create a history to store values.
let wrongPad = 0; // Init the counting with a number
let startTimerVar = 0; // Init the startTimer with a number
let globalTimer = 0;
let elapsedGlobal = 0;
let executedHold = false; // See if a function holdPad() has been executed.

// ---

// arrayInitializer() is the one that starts the process/game. This should be executed when wanting to play/test the game, if not initialized in a document.ready function it can be written in the web console.
function arrayInitializer() {
  shuffle(soundArray); // Shuffles the array using helper function which can be located at the bottom of this doc
  let numb = 13; // Start the variable with the PIN on the arduino board. Always start on 13 and downwards
  for(i = 0; i < soundArray.length; i++) {
    soundArray[i]['pin'] = numb; // Add a pin number to each array entry
    numb--; // Starting the number from 13 (pin) and going down
  }
  updateSong();
  startGlobalTimer(); // Start the global timer, call endGlobalTimer() to return global timer value.
}

function updateSong() {
  startTimer(); // Start the timer
  if(soundChecker != null){
      soundChecker.removeEffect(flanger); // Removes effect if it has been applied
  }
  group.stop(); // Stopping sound eachtime
  let randNum = Math.floor(Math.random() * (soundArray.length - 0) + 0);
  // console.log(randNum);
  soundArray[randNum].play(); // Plays random song within the array of sounds
  soundChecker = soundArray[randNum]; // Check which sound is playing in order to access it everywhere

}

function checker() {
  // var context = Pizzicato.context;
  return soundChecker; // Check which song is playing by returning the soundchecker variable which is being updated in updateSong()
}


// Compare if the current sound matches the current pin
function compareCheck(padPin) {
  let pinPlayed = soundChecker.pin;
  if(padPin == pinPlayed) {
    return true;
  }
}

// Function for holding the pad
function holdPad(){
  let effectCheck = false;
  // soundChecker.addEffect(distortion);
  if(executedHold === false){
    soundChecker.removeEffect(flanger); // Remove any effects
    executedHold = true;
    group.stop();
    soundChecker.addEffect(flanger); // Add effects if any pin is being held
    soundChecker.play();
  }
  setTimeout(function(){
    executedHold = false; // Set a timeout on a function so it does not immediately change the variable
  }, 500);

}

function compareNumber(padPin){
  // console.log(soundChecker.pin);
  let pinPlayed = soundChecker.pin; // Check the current sounds Pin number
  if(padPin == pinPlayed) { // If the current pad which is being pressed is the same as the current sound Pin  is true
    endTimer(); // End timer and input the new data
    updateSong(); // Re-run the function of a new song
    return true; // Return a true value if called upon from elsewhere in document
  } else {
    wrongPad++;
  }
}


// Helper functions


// Shuffle function for mixing the order of an array
// --
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
// --

// In-game timer to track time going to the correct pad

function startTimer() {
  startTimerVar = new Date().getTime();
}

function endTimer() {
  let elapsed = new Date().getTime() - startTimerVar;
  let historyItem = soundChecker; // Take the current played sound
  historyItem['timeElapsed'] = elapsed; // Time elapsed is being pushed in as data
  historyItem['timesWrongInput'] = wrongPad; // How many times the player gets it wrong
  historyToAnalyze.push(historyItem); // Push the data into a new array
  //console.log(historyToAnalyze);
  wrongPad = 0; // Resets the pad
  console.log(elapsed);
  startTimerVar = new Date().getTime(); // Resets the timestamp
}
// ---

// Global timer to track the whole gameplay time

function startGlobalTimer() {
  globalTimer = new Date().getTime();
}

function endGlobalTimer() {
  elapsedGlobal = new Date().getTime() - startTimerVar;
  return (elapsedGlobal / 1000); // Return to seconds
}

function resetGlobalTimer() {
  globalTimer = 0;
  elapsedGlobal = 0;
  startGlobalTimer();
}

// ---
