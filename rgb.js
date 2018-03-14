'use strict';
'use warnings';

const five = require('johnny-five');
var SerialPort = require("serialport");
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('events').EventEmitter.defaultMaxListeners = 100;
io.setMaxListeners(100);
// io.setNoDelay(true);

let led = null;
const memwatch = require('memwatch-next');
let startTimerVar = new Date().getTime();
// const board = new five.Board({
//   port: new SerialPort("dev/cu.usbmodem171", {
//     baudrate: 9600,
//     buffersize: 1
//   })
// });

// var board1 = new Board();
// var board = new five.Board();
// let boards = new five.Boards([{
//     id: "MEGA",
//     port: "/dev/cu.usbmodem****"
//   },
//   {
//     id: "LED",
//     port: "/dev/cu.usbmserial-A********"
//   }
// ]);
var ports = [
  {
    id: "MEGA",
    port: "/dev/cu.usbmodem1411"
  },
  // {
  //   id: "LED",
  //   port: "/dev/cu.usbserial-A505M5P6",
  //   baudrate: 9600,
  //   buffersize: 1
  // }
 ];

let lastLED;

app.use(express.static(__dirname + '/public'))
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});

// new five.Boards(ports).on('ready', function() {
new five.Boards(ports).on('ready', function() {
  console.log('Arduino is ready.');



// Create a new `button` hardware instance.

const button = new five.Buttons([
    {
      // board: this.byId("MEGA"),
      pin: 13,
      isPullup: true,
      holdtime: 5000
    },
    {
      // board: this.byId("MEGA"),
      pin: 12,
      isPullup: true,
      holdtime: 5000
    },
    {
      // board: this.byId("MEGA"),
      pin: 11,
      isPullup: true,
      holdtime: 5000
    },
    {
      // board: this.byId("MEGA"),
      pin: 10,
      isPullup: true,
      holdtime: 5000
    },
    {
      // board: this.byId("MEGA"),
      pin: 9,
      isPullup: true,
      holdtime: 5000
    },
    {
      // board: this.byId("MEGA"),
      pin: 3,
      isPullup: true,
      holdtime: 5000
    }
  ]);


// New instance of Ledlights on the LED board.

// const ledLights = new five.Pins([
//     {
//       pin: 2,
//       board: this.byId("LED"),
//     },
//     {
//       pin: 3,
//       board: this.byId("LED")
//     },
//     {
//       pin: 4,
//       board: this.byId("LED")
//     },
//     {
//       pin: 5,
//       board: this.byId("LED")
//     },
//     {
//       pin: 6,
//       board: this.byId("LED")
//     },
//     {
//       pin: 7,
//       board: this.byId("LED")
//     },
//     {
//       pin: 8,
//       board: this.byId("LED")
//     },
//     {
//       pin: 9,
//       board: this.byId("LED")
//     },
//   ]);
  // setTimeout(function(){
  //   ledLights[0].high();
  //   ledLights[1].high();
  //   ledLights[2].high();
  //   ledLights[3].high();
  //   ledLights[4].high();
  //   ledLights[5].high();
  //   ledLights[6].high();
  //   ledLights[7].high();
  // }, 1000);
  //
  // setTimeout(function(){
  //   ledLights[0].low();
  //   ledLights[1].low();
  //   ledLights[2].low();
  //   ledLights[3].low();
  //   ledLights[4].low();
  //   ledLights[5].low();
  //   ledLights[6].low();
  //   ledLights[7].low();
  //   console.log('low');
  // }, 5000);

  // let intervalfunc = setInterval(function(){
  //         setTimeout(function(){
  //           ledLights[0].high();
  //           console.log('on');
  //         }, 0);
  //         setTimeout(function(){
  //           ledLights[0].low();
  //           console.log('off');
  //         }, 50);
  //           // ledLights[3].high();
  //           // console.log('on');
  //             console.log('----');
  //       }, 100);

  //
  // setTimeout(function(){
  //     ledLights[0].high();
  // }, 500);
  //
  // setTimeout(function(){
  //   ledLights[0].low();
  // }, 10000);

  // led[0].high();
  // led[1].high();
  // led[2].high();
  // led[3].high();
  // led[4].high();
  // led[5].high();
  // led[6].high();
  // led[7].high();
  // led[nr].strobe(); // Strobes a light with 100ms interval


  // ----- To do here -----
  /*

  1. Change sounds
  2. Holdpad function? Do something with the LEDs and sound?


  Done.

  When playing a sound should emit a event to the server(rgb) and emit the correct LED light

  */
  // ------


  // button.on("hold", function(button) {
  //   // console.log(button.pin);
  //   console.log('Pin number ' + button.pin + ' is being held');
  //   // console.log( "Pad 13 Standing on plate" );
  // });
  //
  // button.on("press", function(button) {
  //   // console.log( "Pad 13 Pad pushed" );
  //   // console.log(button.pin);
  //   console.log('Pin number ' + button.pin + ' is being pressed');
  //
  //   // console.log(button);
  // });
  //
  // button.on("release", function(button) {
  //   // console.log( "Pad 13 Pad released" );
  //   // console.log(button.pin);
  //   console.log('Pin number ' + button.pin + ' is being released');
  // });

  memwatch.on('leak', (info) => {
    console.error('Memory leak detected:\n', info);
  });

  // client.on handles all client events that is being sent from the web page versus client.emit where it is sending data to the page.
  io.on('connection', function(client) {
    client.on('join', function(handshake) {
      console.log(handshake);
    });
    client.on('LEDCorrectfeedback', function(pinNumber){
      // console.log(buttonLED); // The button id that is correct is being passed here as parameter buttonLED. With this we can send an LED pulse to the correct pad
      // console.log('success');
      // FEEDBACK TO LED HERE
      if(lastLED != null) {
        ledLights[lastLED].blink(200); // strobe the current blinking LED faster
        setTimeout(function(){
          ledLights[lastLED].low(); // Turn off the current blinking LED after 400ms
        }, 1600);
      }
    });

    // client.on('LEDfeedback', function(pinNumber){
    //   // FEEDBACK TO LED HERE
    //   // let pinNumber = pin;
    //   switch(pinNumber) { // Switchig between the pins assigning pin number 13 to number 8 on the sparkfun
    //     case 13:
    //       setInterval(function(){
    //           ledLights[7].high();
    //       }, 200);
    //       setInterval(function(){
    //         ledLights[7].high();
    //       }, 400);
    //       // ledLights[7].blink(400);
    //       console.log('Pin ' + pinNumber + ' is pressed, Led on pin number ' + ledLights[7].pin + ' should blink.');
    //       break;
    //     case 12:
    //       ledLights[6].blink(400);
    //       console.log('Pin ' + pinNumber + ' is pressed, Led on pin number ' + ledLights[6].pin + ' should blink.');
    //       break;
    //     case 11:
    //       ledLights[5].blink(400);
    //       console.log('Pin ' + pinNumber + ' is pressed, Led on pin number ' + ledLights[5].pin + ' should blink.');
    //       break;
    //     case 10:
    //       ledLights[4].blink(400);
    //       console.log('Pin ' + pinNumber + ' is pressed, Led on pin number ' + ledLights[4].pin + ' should blink.');
    //       break;
    //     case 9:
    //     let intervalfunc = setInterval(function(){
    //         setTimeout(function(){
    //           ledLights[2].high();
    //           console.log('on');
    //         }, 0);
    //         setTimeout(function(){
    //           ledLights[2].low();
    //           console.log('off');
    //         }, 25);
    //           // ledLights[3].high();
    //           // console.log('on');
    //             console.log('----');
    //       }, 50);
    //       setTimeout(function(){
    //         clearInterval(intervalfunc);
    //       }, 1000);
    //       // setInterval(function(){
    //       //   ledLights[3].low();
    //       //   console.log('off');
    //       // }, 1200);
    //       // ledLights[3].blink(400);
    //       console.log('Pin ' + pinNumber + ' is pressed, Led on pin number ' + ledLights[3].pin + ' should blink.');
    //       break;
    //     case 8:
    //       setInterval(function(){
    //           ledLights[2].high();
    //       }, 200);
    //       setInterval(function(){
    //         ledLights[2].high();
    //       }, 400);
    //       // ledLights[2].blink(400);
    //       console.log('Pin ' + pinNumber + ' is pressed, Led on pin number ' + ledLights[2].pin + ' should blink.');
    //       break;
    //     case 7:
    //       ledLights[1].blink(400);
    //       console.log('Pin ' + pinNumber + ' is pressed, Led on pin number ' + ledLights[1].pin + ' should blink.');
    //       break;
    //     case 6:
    //       ledLights[0].blink(400);
    //       console.log('Pin ' + pinNumber + ' is pressed, Led on pin number ' + ledLights[0].pin + ' should blink.');
    //       break;
    //   }
    //   lastLED = pinNumber;
    //   // led[].high();
    // });

    button.on("press", function(button) {
      console.log(button.pin);
      let elapsedGlobal = new Date().getTime() - startTimerVar;
      if(elapsedGlobal > 500) {
        startTimerVar = new Date().getTime();
        let buttonId = button.pin;
        // console.log(button.pin);
        client.emit('pushPad', buttonId);

      }
    });
    // button.on("release", function(data) {
    //   // console.log( "Pad 13 Pad released" );
    //   // console.log(button.pin);
    //   data = 'pause';
    //   // console.log('Pin number ' + button.pin + ' is being released');
    //   client.emit('releasePad', 'asd');
    //   client.broadcast.emit('releasePad', 'asd');
    // });
    // button.on("hold", function(button) {
    //   // console.log(button.pin);
    //   let buttonId = button.pin;
    //   // console.log('Pin number ' + button.pin + ' is being held');
    //   client.emit('holdPad', buttonId);
    //   // client.broadcast.emit('holdPad', buttonId);
    //   // console.log( "Pad 13 Standing on plate" );
    // });



    // CLIENT HERE AND UPDATE STATE IN ORDER FOR IT TO WORK

  });
});

const port = process.env.PORT || 3000;

server.listen(port);
console.log(`Server listening on http://localhost:${port}`);
