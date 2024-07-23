import * as THREE from 'https://cdn.jsdelivr.net/npm/three@v0.149.0/build/three.module.js';

// import { SpriteText2D, textAlign } from 'https://cdn.jsdelivr.net/npm/three-text2d@0.6.0/lib/index.min.js '

function loadFrontPage() {
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
// zoom out 
camera.position.z = 300;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

var canvas = document.getElementById('canvas');





 canvas.innerHTML = ''; // Clear any existing content
 canvas.appendChild(renderer.domElement);


const geometry = new THREE.SphereGeometry(100, 32, 16);


var materialMoon = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("../img/moon.jpg"),
});

const sphere = new THREE.Mesh(geometry, materialMoon); // smoke by deflaut
// distortion fisheye effect -> change camera persective
sphere.position.x = 0;
sphere.position.y = 0;
//sphere.position.y = -50;
scene.add(sphere);


  function animate() {
    
    requestAnimationFrame(animate);

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
    
  };
  animate();

// Call resizeRenderer to set initial size
  var resizeRenderer = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  resizeRenderer();

  window.addEventListener('resize', resizeRenderer);
  

  canvas.addEventListener("DOMContentLoaded", loadFrontPage);
}



function loadFP (){
  loadFrontPage();
  console.log("loadFP")
}

loadFP();

