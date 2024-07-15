// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@v0.149.0/build/three.module.js';

// import { SpriteText2D, textAlign } from 'https://cdn.jsdelivr.net/npm/three-text2d@0.6.0/lib/index.min.js '

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
// zoom out 
camera.position.z = 200;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

const mainWindow = document.getElementById('gameCanvas');


const resizeRenderer = () => {
  const width = mainWindow.clientWidth;
  const height = mainWindow.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

// Call resizeRenderer to set initial size
resizeRenderer();

mainWindow.innerHTML = ''; // Clear any existing content
mainWindow.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(15, 32, 16);


var materialMoon = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("./img/moon.jpg"),
});

const sphere = new THREE.Mesh(geometry, materialMoon); // smoke by deflaut
// distortion fisheye effect -> change camera persective
sphere.position.x = 0;
sphere.position.y = 0;
//sphere.position.y = -50;
scene.add(sphere);

// var sprite = new SpriteText2D("SPRITE", { align: textAlign.center, font: '40px Arial', fillStyle: '#000000', antialias: false })
// scene.add(sprite)

// let sprite = new SpriteText2D({
//   text: '3D PONG',
//   alignment: 'center',
//   fontFamily: 'Arial, Helvetica, sans-serif',
//   fontSize: 28,
//   color: '#ffffff'
// });

// scene.add(sprite);

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  renderer.render(scene, camera);
};

function loadFrontPage() {
  console.log("Front page loaded");

  animate();

}

window.addEventListener('resize', resizeRenderer);

document.addEventListener("DOMContentLoaded", loadFrontPage);


