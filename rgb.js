'use strict';

const five = require('johnny-five');
var SerialPort = require("serialport");
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let led = null;

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
      holdtime: 2000
    },
    {
      pin: 12,
      isPullup: true,
      holdtime: 2000
    },
    {
      pin: 11,
      isPullup: true,
      holdtime: 2000
    }
  ]);

  button.on("hold", function(button) {
    // console.log(button.pin);
    // console.log('Pin number ' + button.pin + ' is being held');
    // console.log( "Pad 13 Standing on plate" );
  });

  // button.on("press", function(button) {
  //   // console.log( "Pad 13 Pad pushed" );
  //   // console.log(button.pin);
  //   console.log('Pin number ' + button.pin + ' is being pressed');
  //   // console.log(button);
  // });

  button.on("release", function(button) {
    // console.log( "Pad 13 Pad released" );
    // console.log(button.pin);
    // console.log('Pin number ' + button.pin + ' is being released');
  });

// var button = new five.Button({
//   pin: 13,
//   isPullup: true,
//   holdtime: 2000
// });
// var button1 = new five.Button({
//   pin: 12,
//   isPullup: true,
//   holdtime: 2000
// });
// var button2 = new five.Button({
//   pin: 11,
//   isPullup: true,
//   holdtime: 2000
// });

// button.on("hold", function() {
//   console.log( "Button held" );
// });
// let setStateColor = function(state) {
//   led.color({
//     red: state.red,
//     blue: state.blue,
//     green: state.green
//   });
// };
//
//
// client.on('rgb', function(data) {
//       state.red = data.color === 'red' ? data.value : state.red;
//       state.green = data.color === 'green' ? data.value : state.green;
//       state.blue = data.color === 'blue' ? data.value : state.blue;
//
//       // Set the new colors
//       setStateColor(state);
//
//       client.emit('rgb', data);
//       client.broadcast.emit('rgb', data);
// });



// ------------------------------

// button.on("hold", function() {
//   console.log( "Pad 13 Standing on plate" );
// });
//
// button.on("press", function() {
//   console.log( "Pad 13 Pad pushed" );
//
// });
//
// button.on("release", function() {
//   console.log( "Pad 13 Pad released" );
// });
//
//
// button1.on("hold", function() {
//   console.log( "Pin 12 Standing on plate" );
// });
//
// button1.on("press", function() {
//   console.log( "Pin 12 Pad pushed" );
//
// });
//
// button1.on("release", function() {
//   console.log( "Pin 12 Pad released" );
// });
//
//
// button2.on("hold", function() {
//   console.log( "Pin 11 Standing on plate" );
// });
//
// button2.on("press", function() {
//   console.log( "Pin 11 Pad pushed" );
//
// });
//
// button2.on("release", function() {
//   console.log( "Pin 11 Pad released" );
// });

// var pin = new five.Pin({
//   pin: 13,
//   mode: 1
// });

// pin.query(function(state) {
//   console.log(state);
// });

// five.Pin.read(pin, function(error, value) {
//   console.log(value);
// });

// pin.high();
// this.digitalRead(13, function(value) {
//     console.log(value);
//   });



// setInterval(function(){
//   pin.query(function(state) {
//     console.log(state);
//     console.log('----------');
//   });
// }, 1000);


// five.Pin.read(pin, function(error, value) {
//   console.log(value);
// });




  io.on('connection', function(client) {
    client.on('join', function(handshake) {
      console.log(handshake);
    });
    client.on('LEDCorrectfeedback', function(buttonLED){
      console.log(buttonLED);
      console.log('success');
      // FEEDBACK TO LED HERE
    });
    // client.on('pushPad', function(data) {
    //
    //       data = 'pause';
    //       client.emit('pushPad', data);
    //       client.broadcast.emit('pushPad', data);
    // });
    button.on("press", function(button) {
      // console.log( "Pad pushed" );
      let buttonId = button.pin;
      // console.log(button.pin);

      // client.emit('pushPad', buttonId);
      // client.broadcast.emit('pushPad', buttonId);
      client.emit('pushPad', buttonId);
      client.broadcast.emit('pushPad', buttonId);
    });
    button.on("release", function(data) {
      // console.log( "Pad 13 Pad released" );
      // console.log(button.pin);
      data = 'pause';
      console.log('Pin number ' + button.pin + ' is being released');
      client.emit('releasePad', 'asd');
      client.broadcast.emit('releasePad', 'asd');
    });



    // CLIENT HERE AND UPDATE STATE IN ORDER FOR IT TO WORK

  });
});

const port = process.env.PORT || 3000;

server.listen(port);
console.log(`Server listening on http://localhost:${port}`);
