(function() {
    var socket = io.connect(window.location.hostname + ':' + 3000);
    var red = document.getElementById('red');
    var green = document.getElementById('green');
    var blue = document.getElementById('blue');
    var asd = 'hej';

    function emitValue(color, e) {
        socket.emit('rgb', {
            color: color,
            value: e.target.value
        });
        socket.emit('pushPad', {
            dataPad: asd
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
        var state = data;
        console.log(data);
        sound.pause();
        // if(state == 'pause'){
        //   sound.pause();
        // }
    });

    var sound = new Howl({
      src: ['../sadaccordion.mp3']
    });

    sound.play();

}());
