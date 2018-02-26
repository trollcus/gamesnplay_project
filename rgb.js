'use strict';

const five = require('johnny-five');
var SerialPort = require("serialport");
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// require('events').EventEmitter.defaultMaxListeners = 100;
io.setMaxListeners(100);
let led = null;
const memwatch = require('memwatch-next');
let startTimerVar = new Date().getTime();


app.use(express.static(__dirname + '/public'))
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});

five.Board().on('ready', function() {
  console.log('Arduino is ready.');

//   var pin = new five.Pin(13);
// setInterval(function(){
//   pin.query(function(state) {
//     console.log(state);
//   });
// }, 500);


// Create a new `button` hardware instance.

const button = new five.Buttons([
    {
      pin: 13,
      isPullup: true,
      holdtime: 500
    },
    {
      pin: 12,
      isPullup: true,
      holdtime: 500
    },
    {
      pin: 11,
      isPullup: true,
      holdtime: 500
    }
    // {
    //   pin: 10,
    //   isPullup: true,
    //   holdtime: 500
    // },
    // {
    //   pin: 8,
    //   isPullup: true,
    //   holdtime: 500
    // }
  ]);



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
    client.on('LEDCorrectfeedback', function(buttonLED){
      // console.log(buttonLED); // The button id that is correct is being passed here as parameter buttonLED. With this we can send an LED pulse to the correct pad
      // console.log('success');
      // FEEDBACK TO LED HERE
    });

    button.on("press", function(button) {
      // console.log(button.pin);
      let elapsedGlobal = new Date().getTime() - startTimerVar;
      if(elapsedGlobal > 20) {
        startTimerVar = new Date().getTime();
        let buttonId = button.pin;
        // console.log(button.pin);
        client.emit('pushPad', buttonId);
      }
      // if(lastBtn !== button.pin && buttonTwice !== 1) {
      //   let buttonId = button.pin;
      //   buttonTwice = 2;
      //   console.log(button.pin);
      //   setTimeout(function(){
      //
      //     lastBtn = button.pin;
      //     client.emit('pushPad', buttonId);
      //   }, 500);
      //
      // } else {
      //   buttonTwice = 1;
      // }


      // if (button.length > 100) {
      //   console.log('asd');
      //
      // } else {
      //   // console.log( "Pad pushed" );
      //
      //   // client.broadcast.emit('pushPad', buttonId);
      // }


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
