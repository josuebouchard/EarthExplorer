import { Vector3, Geometry, LineSegments, Material } from "three";
import { pairs } from "d3";
import * as $ from "jquery";

interface geojsonMultistring {
    coordinates: Array<Array<Array<number>>>
}



export function clamp (num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
};

export function pointToLongLat(vector: Vector3, radius: number) {
    let lon: number, lat: number;
    lat = Math.asin(vector.y / radius);
    lon = Math.asin(vector.x / (radius * Math.cos(lat)));

    return {
        longitude: (lon * 180) / Math.PI,
        latitude: (lat * 180) / Math.PI
    };
};

export function longLatToPoint(point: Array<number>, radius: number) {

    let lambda = point[0] * Math.PI / 180,
        phi = point[1] * Math.PI / 180,
        cosPhi = Math.cos(phi);

    return new Vector3(
        radius * cosPhi * Math.sin(lambda),
        radius * Math.sin(phi),
        radius * cosPhi * Math.cos(lambda),
    );
}

// Converts a GeoJSON MultiLineString in spherical coordinates to a THREE.LineSegments.
export function wireframe(multilinestring: geojsonMultistring, material: Material, radius: number): LineSegments {
    let geometry = new Geometry();
    console.log(multilinestring);
    multilinestring.coordinates.forEach(line => {
        pairs(
            line.map((p: Array<number>)=>{return longLatToPoint(p, radius)}),
            function (a: Vector3, b: Vector3) {
                geometry.vertices.push(a, b);
            }
        )
    });

    return new LineSegments(geometry, material);
}

export function getPlace(coordinates: {longitude:number, latitude: number}):void {
    
    $.post("/API/getPlace", coordinates, function (data){
        console.log(data)
    });
}