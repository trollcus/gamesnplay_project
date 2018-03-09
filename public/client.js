let wrongPad = 0; // Init the counting with a number

(function() {
    var socket = io.connect(window.location.hostname + ':' + 3000);
    // socket.setNoDelay(true);
    // require('events').socket.defaultMaxListeners = 100;
    // socket.setMaxListeners(0);

    socket.on('connect', function(data) {
        socket.emit('join', 'Client is connected!');
    });

    socket.on('pushPad', function(button) {

        let padPin = button;

        // console.log(padPin + ' pressed');
        let correctPad = compareNumber(padPin);
        if(padPin == 3) {
          gameChanger();
        } else {
          // socket.emit('LEDCorrectfeedback', pinPlayed); // Emit to the correct LED to stop/whatever we want
        // socket.emit('LEDfeedback', button); // Emit to the correct LED to stop/whatever we want
        if(correctPad == false) {

          // console.log('false');
          console.log('fail');
          // wrongPad++;
          // console.log('Wrong inputs = ' + wrongPad);
        } else {
          // Emit pin to turn on LED, event name is LEDCorrectfeedback which can be handled on the rgb.js side. Button is the pin number and should be directed to its LED lights.
          // socket.emit('LEDCorrectfeedback', button);
          console.log('correct');

          // successSound.play();
        }

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


// --- Variables used throughout document
// const fs = require('fs');
let gameSpeed = 1;
let totalTime = 0;
let currentTime = 0;
let timeInterval;
let gameName = "";
let amountCorrect = 0;
let timesDownloaded = 0;
let soundChecker = []; // init a variable to check which sound is playing
let historyToAnalyze = []; // Create a history to store values.
let startTimerVar = 0; // Init the startTimer with a number
let globalTimer = 0;
let elapsedGlobal = 0;
let executedHold = false; // See if a function holdPad() has been executed.
let session = { // For the local storage located under helper functions
  'gameRound': [],
  'state': true
}
let gameSave = false;

// ---


// -------------------
// Todo
// -------------------
/*

Gå ur funktionen ifall dem är correct från början

DONE. Array of current sound, -> Multiple sounds at the same time
DONE. Dynamic timer with different pads have different timers
More success sound / More juicy feedback

1. Rewrite function for the game to end after several seconds between interactions instead
2. Keep the seconds between interactons dynamic depending of how well the player are doing?
3. Add sound support for Feedback if bad/good > Point system to track



Update song true == cancels the game.
DONE. One certain pad has a certain timer to stick to

Global timer establishes different levels == Game functions needs to be wrapped in these levels

DONE. Different Feedback sounds depending on pad

DONE. Different sounds depending on pad





Test
LED, connect second board
Success sound when hitting correct pad

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

var gameOver = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../gamesounds/explosionGameOver.mp3',
    loop: false
  }, function() {
  // accordion.play();
  }
});

var gameStart = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../gamesounds/factoryBackground.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var gameReset = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../gamesounds/alarmSiren.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});

// Each sound should be created as a object like this. Just change the var name and source and you should be good to go. Don't forget to add the var name to the two arrays below called "group" and "soundArray".

$( document ).ready(function() {
  var leverGeneral = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../leverSounds/leverGeneral.mp3',
      loop: true
    }, function() {
    // accordion.play();
    }
  });
  var leverSuccess = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../leverSounds/leverSuccess.mp3',
      loop: false
    }, function() {
    // accordion.play();
    }
  });
  var leverFail = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../leverSounds/leverFail.mp3',
      loop: true
    }, function() {
    // accordion.play();
    }
  });
  var electricityGeneral = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../electricity/electricityGeneral.wav',
      loop: true
    }, function() {
    // accordion.play();
    }
  });
  var electricitySuccess = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../electricity/electricitySuccess.wav',
      loop: false
    }, function() {
    // accordion.play();
    }
  });
  var electricityFail = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../electricity/electricityFailure.wav',
      loop: true
    }, function() {
    // accordion.play();
    }
  });
  var gasGeneral = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../gasleak/gasleakGeneral.mp3',
      loop: true
    }, function() {
    // accordion.play();
    }
  });
  var gasSuccess = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../gasleak/gasleakSuccess.mp3',
      loop: false
    }, function() {
    // accordion.play();
    }
  });
  var gasFail = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../gasleak/gasleakFailure.mp3',
      loop: true
    }, function() {
    // accordion.play();
    }
  });

  var bouncyGeneral = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../saw/sawGeneral.mp3',
      loop: true
    }, function() {
    // accordion.play();
    }
  });
  var bouncySuccess = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../saw/sawSuccess.mp3',
      loop: false
    }, function() {
    // accordion.play();
    }
  });
  var bouncyFail = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../saw/sawFailure.mp3',
      loop: true
    }, function() {
    // accordion.play();
    }
  });
  var padGeneral = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../gamesounds/alarmSiren.mp3',
      loop: true
    }, function() {
    // accordion.play();
    }
  });
  var padSuccess = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../machineSound1/machineSuccess.mp3',
      loop: false
    }, function() {
    // accordion.play();
    }
  });
  var padFail = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../machineSound1/machineFailure.mp3',
      loop: true
    }, function() {
    // accordion.play();
    }
  });


  var accordion = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../sadaccordion.mp3',
      loop: true,
      attack: 0.9,
      volume: 0.7
    }, function() {
    // accordion.play();
    }
  });
  var torture = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../phased_torture.wav',
      loop: true,
      attack: 0.9,
      volume: 0.7
    }, function() {
    // accordion.play();
    }
  });
  var central = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../central.mp3',
      loop: true,
      attack: 0.9,
      volume: 0.7
    }, function() {
    // accordion.play();
    }
  });
  var rockstar = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../rockstar.wav',
      loop: true,
      attack: 0.9,
      volume: 0.7
    }, function() {
    // accordion.play();
    }
  });
  var candy = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../candy.mp3',
      loop: false,
      attack: 0.9,
      volume: 0.4
    }, function() {
    // accordion.play();
    }
  });
  var successSound = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../success1.mp3',
      loop: false
    }, function() {
    // accordion.play();
    }
  });
  var gameOver = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../gamesounds/explosionGameOver.mp3',
      loop: false
    }, function() {
    // accordion.play();
    }
  });
  var gameStart = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../gamesounds/factoryBackground.mp3',
      loop: true
    }, function() {
    // accordion.play();
    }
  });
  var gameReset = new Pizzicato.Sound({
    source: 'file',
    options: {
      path: '../gamesounds/alarmSiren.mp3',
      loop: true
    }, function() {
    // accordion.play();
    }
  });

  // let leverArray = {
  //   pin: 13,
  //   timer: 6000 / gameSpeed,
  //   failure: leverFail,
  //   success: leverSuccess,
  //   general: leverGeneral,
  //   canBeActivated: true
  // };
  // let bouncyPadArray = {
  //   pin: 9,
  //   timer: 4500 / gameSpeed,
  //   failure: rockstar,
  //   success: candy,
  //   general: central,
  //   canBeActivated: true
  // };
  // let wiresArray = {
  //   pin: 11,
  //   timer: 6000 / gameSpeed,
  //   failure: electricityFail,
  //   success: electricitySuccess,
  //   general: electricityGeneral,
  //   canBeFailed: true
  // };
  // let valveArray = {
  //   pin: 12,
  //   timer: 6000 / gameSpeed,
  //   failure: gasFail,
  //   success: gasSuccess,
  //   general: gasGeneral,
  //   canBeFailed: true
  // };
  // let padArray = {
  //   pin: 10,
  //   timer: 4500 / gameSpeed,
  //   failure: padFail,
  //   success: padSuccess,
  //   general: padGeneral,
  //   canBeFailed: true
  // };

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
    loop: false
  }, function() {
  // accordion.play();
  }
});
var leverGeneral = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../leverSounds/leverGeneral.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var leverSuccess = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../leverSounds/leverSuccess.mp3',
    loop: false
  }, function() {
  // accordion.play();
  }
});
var leverFail = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../leverSounds/leverFail.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var electricityGeneral = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../electricity/electricityGeneral.wav',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var electricitySuccess = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../electricity/electricitySuccess.wav',
    loop: false
  }, function() {
  // accordion.play();
  }
});
var electricityFail = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../electricity/electricityFailure.wav',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var gasGeneral = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../gasleak/gasleakGeneral.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var gasSuccess = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../gasleak/gasleakSuccess.mp3',
    loop: false
  }, function() {
  // accordion.play();
  }
});
var gasFail = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../gasleak/gasleakFailure.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});

var bouncyGeneral = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../saw/sawGeneral.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var bouncySuccess = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../saw/sawSuccess.mp3',
    loop: false
  }, function() {
  // accordion.play();
  }
});
var bouncyFail = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../saw/sawFailure.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var padGeneral = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../gamesounds/alarmSiren.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});
var padSuccess = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../machineSound1/machineSuccess.mp3',
    loop: false
  }, function() {
  // accordion.play();
  }
});
var padFail = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: '../machineSound1/machineFailure.mp3',
    loop: true
  }, function() {
  // accordion.play();
  }
});


// To create Juicy feedback array
let juicyFeedback = [];


// let leverPad = new Pizzicato.Group([accordion, torture, central]); // If we decide to add support for multiple sounds playing at once arrays like this can come in handy when controlling specific groups of sounds.
let leverArray = {
  pin: 13,
  timer: 8000 / gameSpeed,
  failure: leverFail,
  success: leverSuccess,
  general: leverGeneral,
  canBeFailed: true
};
let bouncyPadArray = {
  pin: 9,
  timer: 8000 / gameSpeed,
  failure: bouncyFail,
  success: bouncySuccess,
  general: bouncyGeneral,
  canBeFailed: true
};
let wiresArray = {
  pin: 10,
  timer: 8000 / gameSpeed,
  failure: electricityFail,
  success: electricitySuccess,
  general: electricityGeneral,
  canBeFailed: true
};
let valveArray = {
  pin: 12,
  timer: 8000 / gameSpeed,
  failure: gasFail,
  success: gasSuccess,
  general: gasGeneral,
  canBeFailed: true
};
let padArray = {
  pin: 11,
  timer: 8000 / gameSpeed,
  failure: padFail,
  success: padSuccess,
  general: padGeneral,
  canBeFailed: true
};






// To reset game
// let resetArray = {
//   pin: 2,
//   timer: 5000 / gameSpeed,
//   failure: resetFail,
//   success: resetSuccess,
//   general: resetGeneral,
//   canBeActivated: true
// };


let group = new Pizzicato.Group([accordion, torture, central, rockstar, candy, leverFail, leverSuccess, leverGeneral, electricityFail, electricitySuccess, electricityGeneral, gasFail, gasSuccess, gasGeneral, bouncyFail, bouncySuccess, bouncyGeneral, padFail, padSuccess, padGeneral]); // Add sounds to this group in order to control and to the array below in order to store additional values
let soundArray = [accordion, torture, central, rockstar, candy];
let gamePads = [leverArray, wiresArray, valveArray, padArray, bouncyPadArray];
let songUpdater;

// arrayInitializer() is the one that starts the process/game. This should be executed when wanting to play/test the game, if not initialized in a document.ready function it can be written in the web console.
function arrayInitializer(returner) {
  if(returner == true){
    clearInterval(songUpdater);
    console.log('exited');
    updateSong(true);
    group.stop(); // Stop the group sound
    return;
  } else {

    songUpdater = setInterval(function(){
      console.log(gameSpeed);
      updateSong(false);
    }, 3500 / gameSpeed);

    // shuffle(soundArray); // Shuffles the array using helper function which can be located at the bottom of this doc
    // let numb = 13; // Start the variable with the PIN on the arduino board. Always start on 13 and downwards
    // for(i = 0; i < soundArray.length; i++) {
    //   soundArray[i]['pin'] = numb; // Add a pin number to each array entry
    //   console.log('Object ' + soundArray[i] + ' has been assigned number ' + numb);
    //   // if(numb === 9){
    //   //   soundArray[i]['pin'] = 8; // Add a pin number to each array entry
    //   // } else {
    //   //   soundArray[i]['pin'] = numb; // Add a pin number to each array entry
    //   // }
    //   numb--; // Starting the number from 13 (pin) and going down

    }
    // updateSong();

  }




function updateSong(returner) {
  if(returner == true) {
    return;
  } else {

    // if(soundChecker != null && soundChecker['ifEffect'] == true){ // Check to see if there is any effect on the currently playing sound.
    //     // console.log(soundChecker['ifEffect']);
    //     soundChecker.removeEffect(flanger); // Removes effect if it has been applied
    //     soundChecker['ifEffect'] = false;
    // }
    // group.stop(); // Stopping sound eachtime
    let randNum = Math.floor(Math.random() * (gamePads.length - 0) + 0);
    // console.log(randNum);
    if(gamePads.length == 0) {
      endGame(gameName);
    }
    console.log(gamePads[randNum]);
    gamePads[randNum].general.play(); // Plays random song within the array of sounds
    gamePads[randNum].canBeFailed = true; // Plays random song within the array of sounds
    soundChecker.push(gamePads[randNum]); // Check which sound is playing in order to access it everywhere
    let time = gamePads[randNum].timer;
    let songPlaying = gamePads[randNum];
    console.log(time);
    // let itemSong = gamePads[randNum];
    // console.log(gamePads);
    gamePads = gamePads.filter(item => item !== gamePads[randNum]); // Might have to change this OBS
    setTimeout(function(){
      if(songPlaying.canBeFailed == true) {
        songPlaying.general.stop();
        songPlaying.failure.play();
        console.log('failing');
        console.log(songPlaying.canBeFailed);
      }
    }, time - 1500);
    setTimeout(function(){
      if(gamePads.indexOf(songPlaying) == -1) {
        songPlaying.failure.stop();
      } else {
        console.log('success, the song can be found in the array again');
      }
    }, time);

    // socket.emit('LEDfeedback', soundArray[randNum].pin); // Emit to the LEDs the current pad
    // console.log(gamePads[randNum].timer);
    startTimer(); // Start the timer
  }


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
  soundChecker.forEach(function(song) {
    // console.log(song);
    let pinPlayed = song.pin; // Check the current sounds Pin number
    // console.log(entry);
    if(padPin == pinPlayed) { // If the current pad which is being pressed is the same as the current sound Pin  is true
      color();
      song.canBeFailed = false;
      song.general.stop(); // Stop the song playing
      song.failure.stop(); // Stop the song playing
      song.success.stop(); // Stop the song playing
      song.success.play();
      soundChecker = soundChecker.filter(item => item !== song); // Might have to change this OBS
      gamePads.push(song);
      amountCorrect++;
      endTimer(song); // End timer and input the new data
      return true; // Return a true value if called upon from elsewhere in document
    } else {
      //  console.log('wrong');
      return false;
    }
  });

  // console.log('current ' +currentTime);
  // //  console.log('totalTime ' +totalTime);
  // if(currentTime <= totalTime) {
  //   if(padPin == pinPlayed) { // If the current pad which is being pressed is the same as the current sound Pin  is true
  //     color();
  //     amountCorrect++;
  //
  //     endTimer(); // End timer and input the new data
  //     updateSong(false); // Re-run the function of a new song
  //     return true; // Return a true value if called upon from elsewhere in document
  //   } else {
  //     //  console.log('wrong');
  //     return false;
  //   }
  // } else {
  //   endGame(gameName);
  //   window.clearInterval(timeInterval);
  // }


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

function endTimer(song) {
  let elapsed = new Date().getTime() - startTimerVar;
  let historyItem = song; // Take the current played sound
  // let historyItem = new Object(); // Take the current played sound
  historyItem['timeElapsed'] = elapsed; // Time elapsed is being pushed in as data
  // historyItem['timesWrongInput'] = wrongPad; // How many times the player gets it wrong
  historyToAnalyze.push(historyItem); // Push the data into a new array
  //console.log(historyToAnalyze);
  // wrongPad = 0; // Resets the pad
  // console.log(elapsed);
  startTimerVar = new Date().getTime(); // Resets the timestamp
}
// ---

// Global timer to track the whole gameplay time

function startGlobalTimer() {
  globalTimer = new Date().getTime();
}

function endGlobalTimer() {
  elapsedGlobal = new Date().getTime() - globalTimer;
  return (elapsedGlobal / 1000); // Return to seconds
}

function resetGlobalTimer() {
  globalTimer = 0;
  elapsedGlobal = 0;
  startGlobalTimer();
}



function startGame(name){
  gameStart.play();
  timesDownloaded = 0;
  gameName = name;
  arrayInitializer(false);
  startGlobalTimer();
  let arrayChecker = setInterval(function(){
    if(soundChecker.length > 3){
      console.log('Ended');
      endGame(name);
      clearInterval(arrayChecker);
    }
  }, 500);


  let timeChecker = setInterval(function(){
    // console.log('Current sounds: ' + gamePads);
    // console.log('Currently Playing: ' + soundChecker);
    let timer = endGlobalTimer();
    let elapsedTime = Math.round(timer);
    switch (elapsedTime) {
      case 30:
        gameSpeed = 1.15;
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
      // case 40:
      //   gameChanger();
      //   gameSave = true;
      //   gameReset.play();
      //   break;
      case 60:
        gameSpeed = 1.3;
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
      case 90:
        gameSpeed = 1.5;
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
    }

  }, 2000);

  // timeInterval = setInterval(function(){
  //   currentTime = endGlobalTimer();
  //
  //   // console.log(currentTime);
  //   if(currentTime > howMany) {
  //     endGame(name);
  //     window.clearInterval(timeInterval);
  //     return;
  //   }
  // }, 500);
}

function gameChanger(state){


  if(gameSave == true) {
    setTimeout(function(){
      gameSave = false;
    }, 7000 / gameSpeed);
    // If you make it it will reset the game
    gameReset.stop();
    group.stop();
    soundChecker = [];
    gamePads = [leverArray, wiresArray, valveArray, padArray];
  } else {
    return;
  }
}


function endGame(name){
  gameStart.stop();
  updateSong(true);
  arrayInitializer(true);
  gameOver.play();
  localStore(name);
  soundChecker.forEach(function(song) {
    song.canBeFailed = false;

    // LJUD FÖR SPRÄNIGNG AV FABRIK
  });
}


// Use localstorage for the games for window

function localStore(name) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    let globalTimer1 = endGlobalTimer();
    session.gameRound.push({globalTimer1, name, amountCorrect}); // Push the object to session
    session.gameRound.push({historyToAnalyze}); // Push the object to session
    let sessionJSON = JSON.stringify(session, null, "\t");
    if(timesDownloaded == 0){
      download(sessionJSON, name + "-" + today +  "-" + dd + "-" + mm + ".json", 'text/json');
      timesDownloaded = 1;
    }

    // fs.writeFile(today + "-" + dd + "-" + mm + ".json", session);
    // localStorage.setItem('session', JSON.stringify(session)); // Store the object to localStorage
}

// Use this function to fetch the localStorage if necessery when in need to analyze

function fetchLocalStore() {
  let restoredSession = JSON.parse(localStorage.getItem('session')); // Fetch the localstorage
  console.log(restoredSession); // Log the session
}


function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

function clearLocalStorage(){
  localStorage.clear();
}

// ---
