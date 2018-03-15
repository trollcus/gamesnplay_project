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
          // console.log('fail at top function');
          // gameSpeed = gameSpeed + 0.05;
          // wrongPad++;
          // console.log('Wrong inputs = ' + wrongPad);
        } else {
          // Emit pin to turn on LED, event name is LEDCorrectfeedback which can be handled on the rgb.js side. Button is the pin number and should be directed to its LED lights.
          // socket.emit('LEDCorrectfeedback', button);
          // console.log('correct');

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
let gamePadsTemp = [];
let timeChecker;
let gameInterval = 4000 / gameSpeed;
let failingSong;
let successSong;
let pushSong;

// ---


// -------------------
// Todo
// -------------------
/*


Set intervall när det går snabbare, se till att det fungerar, straffa om maskinen går "sönder" med mindre tid

Ta tillbaka maskinen i spel och den går för lång tid

Så att det inte blir samma ljud flera gången om

Escape kanppen - Hur ska vi göra med den? Bygga upp? När det är kritiskt?



1. Rewrite function for the game to end after several seconds between interactions instead
2. Keep the seconds between interactons dynamic depending of how well the player are doing?
3. Add sound support for Feedback if bad/good > Point system to track



*/
//



// Each sound should be created as a object like this. Just change the var name and source and you should be good to go. Don't forget to add the var name to the two arrays below called "group" and "soundArray".

$( document ).ready(function() {
  // var minimunWage = new Pizzicato.Sound({
  //   source: 'file',
  //   options: {
  //     path: '../gamesounds/minimumWage.mp3',
  //     loop: true
  //   }, function() {
  //   // accordion.play();
  //   }
  // });
    setTimeout(function(){
      gameStart.play();
    }, 2000);

    console.log( "ready!" );
});


// To create Juicy feedback array
let juicyFeedback = [];


// let leverPad = new Pizzicato.Group([accordion, torture, central]); // If we decide to add support for multiple sounds playing at once arrays like this can come in handy when controlling specific groups of sounds.
let leverArray = {
  pin: 13,
  timer: 12000 / gameSpeed,
  failure: leverFail,
  success: AllFeedback,
  general: leverGeneral,
  canBeFailed: true
};
let bouncyPadArray = {
  pin: 9,
  timer: 12000 / gameSpeed,
  failure: bouncyFail,
  success: AllFeedback,
  general: bouncyGeneral,
  canBeFailed: true
};
let wiresArray = {
  pin: 10,
  timer: 12000 / gameSpeed,
  failure: electricityFail,
  success: AllFeedback,
  general: electricityGeneral,
  canBeFailed: true
};
let valveArray = {
  pin: 12,
  timer: 12000 / gameSpeed,
  failure: gasFail,
  success: AllFeedback,
  general: gasGeneral,
  canBeFailed: true
};
let pedalArray = {
  pin: 11,
  timer: 12000 / gameSpeed,
  failure: pedalFail,
  success: AllFeedback,
  general: pedalGeneral,
  canBeFailed: true
};
let padArray = {
  pin: 3,
  timer: 12000 / gameSpeed,
  failure: padFail,
  success: AllFeedback,
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


let group = new Pizzicato.Group([accordion, torture, central, rockstar, candy, leverFail, leverSuccess, leverGeneral, electricityFail, electricitySuccess, electricityGeneral, gasFail, gasSuccess, gasGeneral, bouncyFail, bouncySuccess, bouncyGeneral, padFail, padSuccess, padGeneral, pedalFail, pedalSuccess, pedalGeneral, AllFeedback]); // Add sounds to this group in order to control and to the array below in order to store additional values
let soundArray = [accordion, torture, central, rockstar, candy];
let gamePads = [leverArray, wiresArray, valveArray, pedalArray, bouncyPadArray];
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
      // console.log(gameSpeed);
      updateSong(false);
    }, 4000 / gameSpeed);

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
    // console.log('new Song');

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
      console.log('Game is running at speed ' + gameSpeed + 'X');
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
    failingSong = setTimeout(function(){
      if(songPlaying.canBeFailed == true) {
        songPlaying.general.stop();
        songPlaying.failure.play();
        console.log('failing');
        console.log(songPlaying.canBeFailed);
      }
    }, time - 1500);
    successSong = setTimeout(function(){
      if(gamePads.indexOf(songPlaying) == -1) {
        songPlaying.failure.stop();
      } else {
        console.log('success, the song can be found in the array again');
      }
    }, time);
    pushSong = setTimeout(function(){
      console.log('Pushed ' +  songPlaying + ' to gamePads array');
      gamePads.push(songPlaying);
    }, gameInterval + 1000);

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
      song.canBeFailed = false;
      clearTimeout(failingSong);
      song.general.stop(); // Stop the song playing
      song.failure.stop(); // Stop the song playing
      song.success.stop(); // Stop the song playing
      song.success.play();
      soundChecker = soundChecker.filter(item => item !== song); // Might have to change this OBS
      amountCorrect++;
      $('#Bigscore').text(amountCorrect);
      if(amountCorrect > 2 && amountCorrect % 3 == 0) {
        let randomNumberPositive = Math.floor(Math.random() * PositiveFeedback.length) + 0;
        setTimeout(function(){
          PositiveFeedback[randomNumberPositive].play();
        }, 1000);

      }

      endTimer(song); // End timer and input the new data
      return true; // Return a true value if called upon from elsewhere in document
    } else {
      wrongPad++;
      if(wrongPad > 2 && wrongPad % 5 == 0) {
        let randomNumberNegative = Math.floor(Math.random() * NegativeFeedback.length) + 0;
        setTimeout(function(){
          NegativeFeedback[randomNumberNegative].play();
        }, 200);
      }
      gameSpeed = gameSpeed + 0.015;
      // console.log('Game speed: ' + gameSpeed);
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

function introduction(){
  gameStart.play();
  intro1.play();
  setTimeout(function(){
    intro2.play();
    console.log('intro2');
  }, 6000);
  setTimeout(function(){
    intro3.play();
    console.log('intro3');
  }, 15000);
  setTimeout(function(){
    intro4.play();
    console.log('intro4');
  }, 6000 + 15000 + 5000);
  setTimeout(function(){
    intro5.play();
    console.log('intro5');
  }, 6000 + 15000 + 5000 + 5000);
  setTimeout(function(){
    intro6.play();
    console.log('intro6');
  }, 6000 + 15000 + 5000 + 5000 + 3000);
  setTimeout(function(){
    gasGeneral.play();
    console.log('gasstart');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000);
  setTimeout(function(){
    gasGeneral.stop();
    console.log('gasstop');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 3000);
  setTimeout(function(){
    intro7.play();
    console.log('intro7');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4000);
  setTimeout(function(){
    leverGeneral.play();
    console.log('intro7');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500);
  setTimeout(function(){
    leverGeneral.stop();
    console.log('intro7');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 3000);
  setTimeout(function(){
    intro8.play();
    console.log('intro8');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 4000);
  setTimeout(function(){
    bouncyGeneral.play();
    console.log('bouncyGeneralstart');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000);
  setTimeout(function(){
    bouncyGeneral.stop();
    console.log('bouncyGeneralstop');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000);
  setTimeout(function(){
    intro9.play();
    console.log('intro9');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 1000);
  setTimeout(function(){
    electricityGeneral.play();
    console.log('electricityGeneralstart');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000);
  setTimeout(function(){
    electricityGeneral.stop();
    console.log('electricityGeneralstop');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000);
  setTimeout(function(){
    intro10.play();
    console.log('intro10');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000 + 500);
  setTimeout(function(){
    pedalGeneral.play();
    console.log('pedalstart');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000 + 1500);
  setTimeout(function(){
    pedalGeneral.stop();
    console.log('pedalstop');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000 + 1500 + 3000);
  setTimeout(function(){
    intro11.play();
    console.log('intro11');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000 + 1500 + 3500);
  setTimeout(function(){
    padGeneral.play();
    console.log('padGeneralstart');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000 + 1500 + 13500);
  setTimeout(function(){
    padGeneral.stop();
    console.log('padGeneralstop');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000 + 1500 + 13500 + 3000);
  setTimeout(function(){
    intro12.play();
    console.log('intro12');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000 + 1500 + 13500 + 4000);
  setTimeout(function(){
    intro13.play();
    console.log('intro13');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000 + 1500 + 13500 + 8000);
  setTimeout(function(){
    intro14.play();
    console.log('intro14');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000 + 1500 + 13500 + 8000 + 8000);
  setTimeout(function(){
    intro15.play();
    console.log('intro15');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000 + 1500 + 13500 + 8000 + 10000);
  setTimeout(function(){
    startGame();
    console.log('startGame');
  }, 6000 + 15000 + 5000 + 5000 + 3000 + 1000 + 4500 + 5000 + 3000 + 2000 + 3000 + 1500 + 13500 + 8000 + 10000 + 3000);

}



function startGame(name){
  $('#playerNameDynamic').text(gameName);
  // gameName = prompt('What is the subjects name?');
  timesDownloaded = 0;
  // gameName = name;
  arrayInitializer(false);
  startGlobalTimer();
  let arrayChecker = setInterval(function(){
    $('#statusMessage').text('OK');
    $('#statusMessage').css('background-color', 'green');
    if(soundChecker.length < 2) {
      $('#statusMessage').text('OK');
      $('#statusMessage').css('background-color', 'green');
    }
    if(soundChecker.length == 2) {
      $('#statusMessage').text('CRITICAL');
      $('#statusMessage').css('background-color', 'red');
    }
    if(soundChecker.length >= 3){
      console.log('Ended');
      endGame(gameName);
      clearInterval(arrayChecker);
    }
  }, 500);
  let timeStamp = Math.round(endGlobalTimer());
  let alarmPad = Math.floor(Math.random() * (timeStamp + 45)) + (timeStamp + 20);
  console.log(alarmPad);


  timeChecker = setInterval(function(){
    // console.log('The alarm is going of at: ' + alarmPad);
    // console.log('Current sounds: ' + gamePads);
    // console.log('Currently Playing: ' + soundChecker);
    let timer = endGlobalTimer();
    let elapsedTime = Math.round(timer);
    $('#timeDynamic').text(elapsedTime);
    switch (elapsedTime) {
      case 20:
        feedbackNegative11.play();
        gameSpeed = gameSpeed + 0.15;
        gameInterval = 4000 / gameSpeed;
        clearInterval(songUpdater);
        songUpdater = setInterval(function(){
          console.log(gameSpeed);
          updateSong(false);
        }, 4000 / gameSpeed);
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
      case alarmPad:
        timeStamp = Math.round(endGlobalTimer());
        alarmPad = Math.floor(Math.random() * (timeStamp + 75)) + (timeStamp + 55);
        console.log(alarmPad);
        gameChanger();
        gameSave = true;
        gameReset.play();
        break;
      case 50:
        feedbackNegative11.play();
        gameSpeed = gameSpeed + 0.15;
        gameInterval = 4000 / gameSpeed;
        clearInterval(songUpdater);
        songUpdater = setInterval(function(){
          console.log(gameSpeed);
          updateSong(false);
        }, 4000 / gameSpeed);
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
      case 90:
        feedbackNegative11.play();
        gameSpeed = gameSpeed + 0.2;
        gameInterval = 4000 / gameSpeed;
        clearInterval(songUpdater);
        songUpdater = setInterval(function(){
          console.log(gameSpeed);
          updateSong(false);
        }, 4000 / gameSpeed);
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
      case 140:
        feedbackNegative11.play();
        gameSpeed = gameSpeed + 0.25;
        gameInterval = 4000 / gameSpeed;
        clearInterval(songUpdater);
        songUpdater = setInterval(function(){
          console.log(gameSpeed);
          updateSong(false);
        }, 4000 / gameSpeed);
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
      case 180:
        feedbackNegative11.play();
        gameSpeed = gameSpeed + 0.2;
        gameInterval = 4000 / gameSpeed;
        clearInterval(songUpdater);
        songUpdater = setInterval(function(){
          console.log(gameSpeed);
          updateSong(false);
        }, 4000 / gameSpeed);
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
      case 210:
        feedbackNegative11.play();
        gameSpeed = gameSpeed + 0.2;
        gameInterval = 4000 / gameSpeed;
        clearInterval(songUpdater);
        songUpdater = setInterval(function(){
          console.log(gameSpeed);
          updateSong(false);
        }, 4000 / gameSpeed);
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
      case 230:
        feedbackNegative11.play();
        gameSpeed = gameSpeed + 0.13;
        gameInterval = 4000 / gameSpeed;
        clearInterval(songUpdater);
        songUpdater = setInterval(function(){
          console.log(gameSpeed);
          updateSong(false);
        }, 4000 / gameSpeed);
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
      case 250:
        feedbackNegative11.play();
        gameSpeed = gameSpeed + 0.1;
        gameInterval = 4000 / gameSpeed;
        clearInterval(songUpdater);
        songUpdater = setInterval(function(){
          console.log(gameSpeed);
          updateSong(false);
        }, 4000 / gameSpeed);
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
      case 250:
        feedbackNegative11.play();
        gameSpeed = gameSpeed + 0.2;
        gameInterval = 4000 / gameSpeed;
        clearInterval(songUpdater);
        songUpdater = setInterval(function(){
          console.log(gameSpeed);
          updateSong(false);
        }, 4000 / gameSpeed);
        console.log('Game is running at speed ' + gameSpeed + 'X');
        break;
    }

  }, 1000);

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


    // If you make it it will reset the game
    group.stop();
    gameReset.stop();
    if(gameSave == true) {
      console.log('Normal start');
      systemNormal.play();
      setTimeout(function(){
        gameSave = false;
      }, 12000 / gameSpeed);
      setTimeout(function(){
        console.log('Normal stop');
        systemNormal.stop();
      }, 3000);
    clearTimeout(failingSong);
    clearTimeout(successSong);
    clearTimeout(pushSong);
    soundChecker = [];
    gamePads = [leverArray, wiresArray, valveArray, padArray, bouncyPadArray];

    for(var i = 0; i < gamePads.length; i++){
      gamePads[i].canBeFailed = true;
      // console.log('Number: ' + gamePads[i] + ' canBeFailed is set to true');
    }
    clearInterval(songUpdater);
    gameSpeed = gameSpeed - 0.22;
    setTimeout(function(){
      group.stop();
      soundChecker = [];
      gamePads = [leverArray, wiresArray, valveArray, padArray, bouncyPadArray];
      for(var i = 0; i < gamePads.length; i++){
        gamePads[i].canBeFailed = true;
        console.log('Number: ' + gamePads[i] + ' canBeFailed is set to true');
      }
      clearTimeout(failingSong);
      clearTimeout(successSong);
      clearTimeout(pushSong);
      console.log('stop all the sounds');
    }, 4000 / gameSpeed);
    songUpdater = setInterval(function(){
      console.log(gameSpeed);
      updateSong(false);
    }, 4000 / gameSpeed);
  } else {
    return;
  }
}


function endGame(name){
  switchToScreen('endscreen');
  gameStart.stop();
  gameReset.stop();
  updateSong(true);
  arrayInitializer(true);
  clearInterval(timeChecker);
  gameOver.play();
  localStore(name);
  minimunWage.play();
  soundChecker.forEach(function(song) {
    song.canBeFailed = false;

    // LJUD FÖR SPRÄNIGNG AV FABRIK
  });
}


// Use localstorage for the games for window
let globalTimer1;
function localStore(name) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    globalTimer1 = endGlobalTimer();
    session.gameRound.push({globalTimer1, name, amountCorrect, wrongPad, gameSpeed}); // Push the object to session
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

function startGameInit(){
  minimunWage.stop();
  gameName = $('#input').val();
  console.log(gameName);
  switchToScreen('gamescreen');
  startGame();
}

function startIntroduction() {
  minimunWage.stop();
  gameName = $('#input').val();
  console.log(gameName);
  switchToScreen('gamescreen');
  introduction();
}

function switchToScreen(screen){
  switch (screen) {
    case 'gamescreen':
      var firstScreen = document.querySelectorAll('.firstScreen');
      var secondScreen = document.querySelectorAll('.secondScreen');
      anime({
        targets: firstScreen,
        translateX: 1000,
        opacity: 0,
        duration: 500,
        easing: 'easeInOutQuad'
        });
        setTimeout(function(){
          $('.firstScreen').remove();
          $(secondScreen).show();
          $('.displayTop').css('display', 'flex');
        }, 300);
      anime({
        targets: secondScreen,
        opacity: 100,
        // translateX: 300,
        translateX: [300, 0],
        duration: 800,
        delay: 500

        });


      break;
    case 'endscreen':

      var secondScreen = document.querySelectorAll('.secondScreen');
      $(secondScreen).hide();
      var thirdScreen = document.querySelectorAll('.thirdScreen');
      $(thirdScreen).show();
      var score = $('#score')
      anime({
        targets: secondScreen,
        opacity: 0,
        // translateX: 300,
        translateX: 1000,
        duration: 500

        });
        anime({
          targets: thirdScreen,
          opacity: 100,
          // translateX: 300,
          translateX: [300, 0],
          duration: 500,
          delay: 500

          });
          anime({
            targets: thirdScreen,
            opacity: 100,
            // translateX: 300,
            translateX: [300, 0],
            duration: 300,
            delay: 500

            });

            setTimeout(function(){
              var obj = { charged: 0 };
              let scoreTimer = Math.round(globalTimer1) / 10;
              scoreTimer = scoreTimer * (amountCorrect / 25)
              var JSobject = anime({
                targets: obj,
                charged: scoreTimer,
                round: 1,
                easing: 'linear',
                delay: 3400,
                update: function() {
                  var el = document.querySelector('#score');
                  el.innerHTML = JSON.stringify(obj.charged);
                }
              });
              JSobject.play;
            }, 1000);
            setTimeout(function(){
              var objTime = { charged: 0 + " seconds" };
              let scoreTimer = Math.round(globalTimer1) / 10;
              var JSobjectTime = anime({
                targets: objTime,
                charged: globalTimer1 + " seconds",
                round: 1,
                easing: 'linear',
                delay: 5000,
                update: function() {
                  var el = document.querySelector('#time');
                  el.innerHTML = objTime.charged;
                }
              });
              JSobjectTime.play;
            }, 1000);
            // var domAttributes = anime({
            //   targets: '#score',
            //   value: 1000,
            //   round: 1,
            //   easing: 'easeInOutExpo',
            //   delay: 1000
            // });
            // domAttributes.play;
      break;
  }
}
