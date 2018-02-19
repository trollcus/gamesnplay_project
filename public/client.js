(function() {
    var socket = io.connect(window.location.hostname + ':' + 3000);
    var red = document.getElementById('red');
    var green = document.getElementById('green');
    var blue = document.getElementById('blue');
    var asd = 'hej';
    const pinNum = [13, 12, 11];


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



    red.addEventListener('change', emitValue.bind(null, 'red'));
    blue.addEventListener('change', emitValue.bind(null, 'blue'));
    green.addEventListener('change', emitValue.bind(null, 'green'));

    socket.on('connect', function(data) {
        socket.emit('join', 'Client is connected!');
    });

    socket.on('rgb', function(data) {
        var color = data.color;
        document.getElementById(color).value = data.value;
    });
    socket.on('pushPad', function(data) {
        let padPin = data;
        let correctPad = compareNumber(padPin);
        if(correctPad == true) {
          // Emit pin to turn on LED, eventnamn is LEDCorrectfeedback
          socket.emit('LEDCorrectfeedback', data);
        }
        // console.log(data);

        // sound.pause();
        // if(state == 'pause'){
        //   sound.pause();
        // }
    });
    socket.on('releasePad', function(data) {
        var state = data;
        console.log('release');
        // sound.pause();
        // sound.play();
        // if(state == 'pause'){
        //   sound.pause();
        // }
    });





    // sound.play();

}());


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

let group = new Pizzicato.Group([accordion, torture, central]); // Add sounds to this group in order to control and to the array below in order to store additional values
let soundArray = [accordion, torture, central];
let soundChecker; // init a variable to check which sound is playing

function arrayInitializer() {
  shuffle(soundArray); // Shuffles the array using helper function which can be located at the bottom of this doc
  let numb = 13;
  for(i = 0; i < soundArray.length; i++) {
    soundArray[i]['pin'] = numb; // Add a pin number to each array entry
    numb--; // Starting the number from 13 (pin) and going down
  }
  updateSong();
}

function updateSong() {
  group.stop(); // Stopping sound eachtime
  let randNum = Math.floor(Math.random() * (soundArray.length - 0) + 0);
  // console.log(randNum);
  soundArray[randNum].play(); // Plays random song within the array of sounds
  soundChecker = soundArray[randNum]; // Check which sound is playing in order to access it everywhere

}

function checker() {
  // var context = Pizzicato.context;
  return soundChecker; // Check which song is playing
}

function compareNumber(padPin){
  let pinPlayed = soundChecker.pin;
  if(padPin == pinPlayed) {
    updateSong();
    return true;
  }
}


function tester(){


  // var sound = new Howl({
  //   src: ['../sadaccordion.mp3', '../phased_torture.wav', 'central.mp3'],
  //   loop: true,
  // });

//   var accordion = new Pizzicato.Sound({
//     source: 'file',
//     options: {
//       path: '../sadaccordion.mp3',
//       loop: true
//     }, function() {
//     // accordion.play();
//   }
// });
let soundArray = [
  accordion, torture, central];
// soundArray[1].play();
console.log(soundArray);

shuffle(soundArray);
// soundArray.forEach(function(item){
//   console.log(item);
//   // item.push('asd');
//   item = "asdasd";
// });
let numb = 13;
for(i = 0; i < soundArray.length; i++) {
  soundArray[i]['pin'] = numb;
  numb--;
}
// soundArray[0] = "value1";

// soundArray.from({length: 13}, () => Math.floor(Math.random() * (14 - 11) + 11));
console.log(soundArray);


  // sound.play();
  // var torture = new Pizzicato.Sound('../phased_torture.wav');
  // var central = new Pizzicato.Sound('../central.mp3');

  // let group = new Pizzicato.Group([accordion, torture, central]);


  // if(sound.playing()) {
  //     sound.stop();
  // }
  // Math.random() * (13 - 11) + 11;
  let randNum = Math.floor(Math.random() * (14 - 11) + 11);
  // console.log(randNum);
  // let id13 = sound.play();
  // let id12 = sound.play();
  // let id11 = sound.play();
  // var id1 = sound.play();
  // var id2 = sound.play();
  let playNumber = 'id' + randNum;
  console.log(playNumber);
  // sound.play(playNumber);
  // id11;

}



// Helpers

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
