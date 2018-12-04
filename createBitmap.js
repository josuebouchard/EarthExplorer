var topojson = require("topojson-client");
const mercator = require('projections/mercator');
const {createCanvas} = require('canvas');
const fs = require('fs');


//SETTINGS
const input = "topology.json";
const outputImage = "data.png";
const outputInfo = "data.json";
const timesDrawn = 1;
//END SETTINGS

//HELPER FUNCTIONS
var rgbToHex = function (rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};
var fullColorHex = function (r, g, b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return red + green + blue;
};
var generateColor = function (index) {
    var colors = []
    var temp = Math.floor(index / 255);

    if (index > 255 * 3 | index < 0) {
        throw "Index debe estar comprendido entre 0 y 765";
    }

    switch (temp) {
        case 0:
            return fullColorHex(0, 0, index);

        case 1:
            return fullColorHex(0, index - 255, 255);

        case 2:
            return fullColorHex(index - 255 - 255, 255, 255);

        default:
            return fullColorHex(255, 255, 255);
    }
}
//END HELP FUNCTIONS



//Create canvas and set it size
const canvas = createCanvas(3960, 2400);

//Get context
const ctx = canvas.getContext('2d')

//Disable antialiasing
ctx.antialias = 'none';

//Get features
let topology = JSON.parse(fs.readFileSync(input));
let features = topojson.feature(topology, topology.objects.all).features;

//Create variable to store information
let data = [];


let index = 0;
features.forEach(element => {
    let country = element.properties.name_long;
    let subunit = element.properties.subunit;
    let continent = element.properties.continent;
    let formalName = element.properties.formal_en;
    let geounit = element.properties.geounit;
    let isoa3 = element.properties.iso_a3;

    let mesh = topojson.mesh(topology, topology.objects.all.geometries[index]).coordinates;

    mesh.forEach(coordGroup => {
        
        //Encode the index value into the colour
        let colour = generateColor(index);
        
        //Set fill colour
        ctx.fillStyle = `#${colour}`;


        ctx.beginPath();

        for (let i = 0; i < coordGroup.length; i++) {
            const coords = coordGroup[i];

            var {
                x,
                y
            } = mercator({
                lon: coords[0],
                lat: coords[1]
            })

            x = x * canvas.width;
            y = y * canvas.height;

            if (i != 0) {
                ctx.lineTo(x, y);
            } else {
                ctx.moveTo(x, y);
            }

        };

        //Close path
        ctx.closePath();

        //Use fill
        ctx.fill();
        
    });

    data.push({
        name: country,
        subunit: subunit,
        geounit, geounit,
        formalName: formalName,
        isoa3: isoa3,
        continent: continent,
        index: index
    });

    index++;
});

//Get the map in data URI format
let dataURI = canvas.toDataURL("image/png");

//convert dataURI into base64Image
let base64 = dataURI.replace(/^data:image\/(png|jpg);base64,/, "");

fs.writeFile(outputImage, new Buffer(base64, 'base64'), function (err){
    if (err) {
        return console.log(err);
    }

    console.log("The image file was saved!");
});

fs.writeFile(outputInfo, JSON.stringify(data) , function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The data file was saved!");
})