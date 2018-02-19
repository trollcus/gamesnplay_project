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
let soundChecker; // init a variable to check which sound is playing
let historyToAnalyze = []; // Create a history to store values.
let wrongPad = 0; // Init the counting with a number
let startTimer = 0; // Init the startTimer with a number

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
}

function updateSong() {
  startTimer(); // Start the timer
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
// Lägg variablen uppe bland dem andra


function startTimer() {
  startTimer = new Date().getTime();
}

function endTimer() {
  let elapsed = new Date().getTime() - startTimer;
  let historyItem = soundChecker; // Take the current played sound
  historyItem['timeElapsed'] = elapsed; // Time elapsed is being pushed in as data
  historyItem['timesWrongInput'] = wrongPad; // How many times the player gets it wrong
  historyToAnalyze.push(historyItem); // Push the data into a new array
  wrongPad = 0; // Resets the pad
  startTimer = new Date().getTime(); // Resets the timestamp
  // return elapsed;
}
