import { clamp, pointToLongLat, getPlace } from "helpers";
import * as THREE from "three";
import { InputState } from "input";

let raycaster = new THREE.Raycaster();

var displacementCamera = { x: 0, y: Math.PI / 2 };
var cameraRadius = 5;
var radius = 1.000000000000000001;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);

let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

//Create and add globe to the scene
let geometry = new THREE.SphereGeometry(1, 64, 64);
let texture = new THREE.TextureLoader().load("texture.png");
let material = new THREE.MeshStandardMaterial({ map: texture });
let globe = new THREE.Mesh(geometry, material);
scene.add(globe);

//Create and add ambient light to the scene
let light = new THREE.AmbientLight(0xFFFFFF);
light.intensity = 2;
scene.add(light);

//Create and add countries to the scene
/*let mesh = wireframe(
    topojson.mesh(topology, topology.objects.all),
    new THREE.LineBasicMaterial({color: 0xff0000}),
    radius
);
scene.add(mesh);*/

//Rotate globe so as to match the countries
globe.rotation.setFromVector3(new THREE.Vector3(0, -Math.PI / 2, 0));



function logic() {
    //Handle rotation
    if (InputState.isDragging) {
        let displacement = InputState.displacement.get();
        displacementCamera.x += displacement.x / 500;
        displacementCamera.y -= displacement.y / 500;

    }

    //Handle zoom
    if (InputState.isScrolling) {
        let scroll = InputState.scrolling.get();
        cameraRadius += scroll.y / 1000;
    }

    //Putting limits
    displacementCamera.y = clamp(displacementCamera.y, 0.000001, Math.PI);
    cameraRadius = clamp(cameraRadius, 1.2, 4)

    //Vectors should be (X, Z, Y)
    camera.position.x = cameraRadius * Math.cos(displacementCamera.x) * Math.sin(displacementCamera.y);
    camera.position.z = cameraRadius * Math.sin(displacementCamera.x) * Math.sin(displacementCamera.y);
    camera.position.y = cameraRadius * Math.cos(displacementCamera.y);

    //Make the camera always look at the center
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function render() {
    requestAnimationFrame(render);
    logic();
    renderer.render(scene, camera);
}

render();


//-------------------------------------------------------
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(innerWidth, innerHeight);
}

function click() {
    //Normalize screen cursor position
    var mouse = new THREE.Vector2();
    mouse.x = (InputState.position.x / window.innerWidth) * 2 - 1;
    mouse.y = -(InputState.position.y / window.innerHeight) * 2 + 1;

    //Set raycaster
    raycaster.setFromCamera(mouse, camera);

    //Raycast globe
    var intersects = raycaster.intersectObject(globe);

    console.log(intersects[0].point);

    let coords = pointToLongLat(intersects[0].point, radius);
    console.log(coords);

    //DEBUG
    //console.log(`https://www.google.com/maps/@${coords.latitude},${coords.longitude},6.17z`);



    $.post("/API/getPlace", coords, function (data) {
        console.log(data);
    });
}

document.addEventListener('onClick', click, false);