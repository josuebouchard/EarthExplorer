var camera, globe;
window.onload = function () {
    var scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, .1, 100);

    var renderer = new THREE.WebGLRenderer();

    var geometry = new THREE.SphereGeometry(1, 64, 64);
    var texture = THREE.ImageUtils.loadTexture('earth.jpg');
    var depthMap = THREE.ImageUtils.loadTexture('high-bump.jpg');
    var material = new THREE.MeshStandardMaterial({
        map: texture,
        displacementMap: depthMap,
        displacementScale: .08
    });
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    var light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
    light.intensity = 2;
    scene.add( light );

    camera.position.z = 5;

    renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);

    //Draw Scene
    var Logic = function () {
        //TODO: improve this with an algorithm that take into account, size of the sphere, distance of the camera, displacement, etc.
        //Rotate globe
        if(InputState.isDragging) {
            var displacement = InputState.displacement.get();
            globe.rotation.y += displacement.x/100 * (1/globe.scale.x);
            globe.rotation.x += displacement.y/100 * (1/globe.scale.y);
        }

        if(InputState.isScrolling) {
            var scroll = InputState.scrolling.get();
            globe.scale.addScalar(-scroll.y / 1000);
        }
    };

    //Run loop (logic, render, repeat)
    var Render = function () {
        requestAnimationFrame(Render);
        Logic();
        renderer.render(scene, camera);
    };

    Render();


    //---------------------------------------------------------------
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(innerWidth, innerHeight);
    }
}