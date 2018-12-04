define(["require", "exports", "three", "d3", "jquery"], function (require, exports, three_1, d3_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
    exports.clamp = clamp;
    ;
    function pointToLongLat(vector, radius) {
        let lon, lat;
        lat = Math.asin(vector.y / radius);
        lon = Math.asin(vector.x / (radius * Math.cos(lat)));
        return {
            longitude: (lon * 180) / Math.PI,
            latitude: (lat * 180) / Math.PI
        };
    }
    exports.pointToLongLat = pointToLongLat;
    ;
    function longLatToPoint(point, radius) {
        let lambda = point[0] * Math.PI / 180, phi = point[1] * Math.PI / 180, cosPhi = Math.cos(phi);
        return new three_1.Vector3(radius * cosPhi * Math.sin(lambda), radius * Math.sin(phi), radius * cosPhi * Math.cos(lambda));
    }
    exports.longLatToPoint = longLatToPoint;
    // Converts a GeoJSON MultiLineString in spherical coordinates to a THREE.LineSegments.
    function wireframe(multilinestring, material, radius) {
        let geometry = new three_1.Geometry();
        console.log(multilinestring);
        multilinestring.coordinates.forEach(line => {
            d3_1.pairs(line.map((p) => { return longLatToPoint(p, radius); }), function (a, b) {
                geometry.vertices.push(a, b);
            });
        });
        return new three_1.LineSegments(geometry, material);
    }
    exports.wireframe = wireframe;
    function getPlace(coordinates) {
        $.post("/API/getPlace", coordinates, function (data) {
            console.log(data);
        });
    }
    exports.getPlace = getPlace;
});
