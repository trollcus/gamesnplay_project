(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function() {
    var socket = io.connect(window.location.hostname + ':' + 3000);
    // require('events').socket.defaultMaxListeners = 100;
    // socket.setMaxListeners(0);

    socket.on('connect', function(data) {
        socket.emit('join', 'Client is connected!');
    });

    socket.on('pushPad', function(button) {

        let padPin = button;
        console.log(padPin);
        let correctPad = compareNumber(padPin);
        console.log('pressed');
        if(correctPad === true) {
          // Emit pin to turn on LED, event name is LEDCorrectfeedback which can be handled on the rgb.js side. Button is the pin number and should be directed to its LED lights.
          // socket.emit('LEDCorrectfeedback', button);
          console.log('correct');
        }

    });
    // socket.on('releasePad', function(data) {
        // console.log('release');
        // sound.pause();
        // sound.play();
        // if(state == 'pause'){
        //   sound.pause();
        // }
    // });
    socket.on('holdPad', function(button) {
        // let padPin = button;
        // console.log('hold');
        holdPad();
        // let correctPad = compareCheck(padPin);
        // if(correctPad === true) {
        //   holdPad();
        //
        // }
        // sound.pause();
        // sound.play();
        // if(state == 'pause'){
        //   sound.pause();
        // }
    });

}());


// -------------------
// Todo
// -------------------
/*

1. Success sound when hitting correct pad
2. Create a json file for each session, should be executed when the game is finished.
3. Change firmata main loop interval and fine tune it so it does not clog up our communication channel via socket.


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

$( document ).ready(function() {
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
  var rockstar = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../rockstar.wav',
      loop: true
    }, function() {
    // accordion.play();
    }
  });
  var candy = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../candy.mp3',
      loop: true
    }, function() {
    // accordion.play();
    }
  });
    console.log( "ready!" );
});

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
var rockstar = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../rockstar.wav',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var candy = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../candy.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});



// --- Variables used throughout document
const fs = require('fs');
let group = new Pizzicato.Group([accordion, torture, central, rockstar, candy]); // Add sounds to this group in order to control and to the array below in order to store additional values
let soundArray = [accordion, torture, central, rockstar, candy];
let soundChecker = null; // init a variable to check which sound is playing
let historyToAnalyze = []; // Create a history to store values.
let wrongPad = 0; // Init the counting with a number
let startTimerVar = 0; // Init the startTimer with a number
let globalTimer = 0;
let elapsedGlobal = 0;
let executedHold = false; // See if a function holdPad() has been executed.
let session = { // For the local storage located under helper functions
  'gameRound': [],
  'state': true
}

// ---

// arrayInitializer() is the one that starts the process/game. This should be executed when wanting to play/test the game, if not initialized in a document.ready function it can be written in the web console.
function arrayInitializer(returner) {
  if(returner == true){
    console.log('exited');
    return;
  } else {
    shuffle(soundArray); // Shuffles the array using helper function which can be located at the bottom of this doc
    let numb = 13; // Start the variable with the PIN on the arduino board. Always start on 13 and downwards
    for(i = 0; i < soundArray.length; i++) {
      soundArray[i]['pin'] = numb; // Add a pin number to each array entry
      // if(numb === 9){
      //   soundArray[i]['pin'] = 8; // Add a pin number to each array entry
      // } else {
      //   soundArray[i]['pin'] = numb; // Add a pin number to each array entry
      // }
      numb--; // Starting the number from 13 (pin) and going down
    }
    updateSong();
    startGlobalTimer(); // Start the global timer, call endGlobalTimer() to return global timer value.
  }
}

function updateSong() {
  startTimer(); // Start the timer

  // if(soundChecker != null){
  if(soundChecker != null && soundChecker['ifEffect'] == true){ // Check to see if there is any effect on the currently playing sound.
      // console.log(soundChecker['ifEffect']);
      soundChecker.removeEffect(flanger); // Removes effect if it has been applied
      soundChecker['ifEffect'] = false;
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
    group.stop(); // Stop the group sound
    soundChecker['ifEffect'] = true; // Set the soundChecker object to true in order to turn it off later.
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
    color();
    endTimer(); // End timer and input the new data
    updateSong(); // Re-run the function of a new song
    return true; // Return a true value if called upon from elsewhere in document
  } else {
    wrongPad++;

  }
}




// Helper functions

function color(){
  document.body.style.backgroundColor = 'green';
  setTimeout(function(){
    document.body.style.backgroundColor = 'red';
  }, 1500);
}


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
  // let historyItem = new Object(); // Take the current played sound
  historyItem['timeElapsed'] = elapsed; // Time elapsed is being pushed in as data
  historyItem['timesWrongInput'] = wrongPad; // How many times the player gets it wrong
  historyToAnalyze.push(historyItem); // Push the data into a new array
  //console.log(historyToAnalyze);
  wrongPad = 0; // Resets the pad
  // console.log(elapsed);
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

function startGame(howMany){
  arrayInitializer();
  startGlobalTimer();
  setInterval(function(){
    let currentTime = endGlobalTimer();
    if(currentTime > howMany) {
      endGame();
    }
  }, 500);
}


function endGame(){
  arrayInitializer(true);
  localStore();
}


// Use localstorage for the games for window

function localStore() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    session.gameRound.push({historyToAnalyze}); // Push the object to session
    fs.writeFile(today + "-" + dd + "-" + mm + ".json", session);
    localStorage.setItem('session', JSON.stringify(session)); // Store the object to localStorage
}

// Use this function to fetch the localStorage if necessery when in need to analyze

function fetchLocalStore() {
  let restoredSession = JSON.parse(localStorage.getItem('session')); // Fetch the localstorage
  console.log(restoredSession); // Log the session
}

// ---

},{"fs":1}]},{},[2]);
