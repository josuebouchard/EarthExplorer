const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const mercator = require('projections/mercator');
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
    console.log("hola");
    
    let coords = req.body;
    var { x, y } = mercator({
        lon: coords.longitude,
        lat: coords.latitude
    });

    x = Math.round(x);
    y = Math.round(y);

    res.send(x,y);
});

app.listen(8080, function() {
    console.log("Server running on port 8080");
});