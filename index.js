const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const mercator = require('projections/mercator');
const spawn = require('child_process').spawn

const mapDimentions = [3960, 2400]



var app = express();


app.use(express.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use('/', express.static('FrontEnd'));

app.get('/API/getTopology', function (req, res) {
    res.sendFile(path.join(__dirname, "topology.json"));
});

app.post('/API/getPlace', function (req, res) {
        
    let coords = req.body;
    var { x, y } = mercator({
        lon: coords.longitude,
        lat: coords.latitude
    });

    x = Math.round(x * mapDimentions[0]);
    y = Math.round(y * mapDimentions[1]);


    let py = spawn('python', ['compute_input.py']);
    let dataString = '';

    py.stdout.on('data', function (data) {
        dataString += data.toString();
    });
    py.stdout.on('end', function () {
        res.send(dataString);
    });

    py.stdin.write(JSON.stringify( {x: x, y: y} ));
    py.stdin.end();
});

app.listen(8080, function() {
    console.log("Server running on port 8080");
});