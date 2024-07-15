//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@v0.149.0/build/three.module.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.z = 5;
camera.position.y = 5;
camera.lookAt(0, 0, 0);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
var c = document.getElementById("main-window");
c.appendChild(renderer.domElement);
//document.getElementById("main-window").appendChild(renderer.domElement);

// Create a point light
const light = new THREE.AmbientLight(0xffffff, 1, 100);
// for rotation only
//const light = new THREE.PointLight(0xffffff, 0.8);
light.position.set(10, 10, 10);
scene.add(light);

// Main board
const boardWidth = 10;
const boardLength = 5;
const boardGeometry = new THREE.BoxGeometry(boardWidth, 0.2, boardLength, 10, 10, 10); // Width, height (depth), length
const boardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true }); // Brown color for the board
const board = new THREE.Mesh(boardGeometry, boardMaterial);
board.position.y = -0.1;
scene.add(board);

// Create paddles
const paddleWidth = 0.2;
const paddleHeight = 0.5;
const paddleDepth = 1;


// Left paddle
const leftPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth); // Width, height, depth
const leftPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Blue color for the paddles
const leftPaddle = new THREE.Mesh(leftPaddleGeometry, leftPaddleMaterial);
leftPaddle.position.set(-5, 0.15, 0); // Position it on the left edge of the board
scene.add(leftPaddle);

// Right paddle
const rightPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth); // Width, height, depth
const rightPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff }); // Blue color for the paddles
const rightPaddle = new THREE.Mesh(rightPaddleGeometry, rightPaddleMaterial);
rightPaddle.position.set(5, 0.15, 0); // Position it on the right edge of the board
scene.add(rightPaddle);

// Create a sphere geometry
const ballRadius = 0.3;
const sphereGeometry = new THREE.SphereGeometry(ballRadius, 32, 32); // Radius, width segments, height segments
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true }); // Red color for the sphere
const ball = new THREE.Mesh(sphereGeometry, sphereMaterial);

// Add the sphere to the scene
ball.position.set(0, 0.1, 0); // Position it at the center of the board
scene.add(ball);

// variable for ball movement
let ballDirX = 0.1;
let ballDirZ = 0.1;
var ballRotationSpd = { x: 0.2, y: 0, z: 0 }

// Score
let leftScore = 0
let rightScore = 0;
const scoreLimit = 7;

/////////////////// HTML Score Showing /////////////////////
//const leftScoreElement = document.createElement('div');
// const mainBottomWindow = document.getElementById('main-bottom-window')
// mainBottomWindow.style.position = 'absolute';
// mainBottomWindow.style.top = '10px';
// mainBottomWindow.style.left = '10px';
// mainBottomWindow.style.color = 'white';
// mainBottomWindow.style.fontSize = '24px';
// mainBottomWindow.innerHTML = 'Left: 0';
// document.body.appendChild(mainBottomWindow);

// // const rightScoreElement = document.createElement('div');
// rightScoreElement.style.position = 'absolute';
// rightScoreElement.style.top = '10px';
// rightScoreElement.style.right = '10px';
// rightScoreElement.style.color = 'white';
// rightScoreElement.style.fontSize = '24px';
// rightScoreElement.innerHTML = 'Right: 0';
// document.body.appendChild(rightScoreElement);

// const winnerElement = document.createElement('div');
// winnerElement.style.position = 'absolute';
// winnerElement.style.top = '20%';
// winnerElement.style.left = '50%';
// winnerElement.style.transform = 'translate(-50%, -50%)';
// winnerElement.style.color = 'white';
// winnerElement.style.fontSize = '48px';
// winnerElement.style.display = 'none';
// document.body.appendChild(winnerElement);



// Add event listener for resizing the window
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add mouse interaction
document.addEventListener('mousemove', onDocumentMouseMove);

let mouseX = 0;
let mouseY = 0;

function onDocumentMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();


// Key states for paddle movement
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  KeyW: false,
  KeyS: false
};

// Event listeners for keydown and keyup
document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowUp') {
    keys.ArrowUp = true;
  } else if (event.code === 'ArrowDown') {
    keys.ArrowDown = true;
  } else if (event.code === 'KeyW') {
    keys.KeyW = true;
  } else if (event.code === 'KeyS') {
    keys.KeyS = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowUp') {
    keys.ArrowUp = false;
  } else if (event.code === 'ArrowDown') {
    keys.ArrowDown = false;
  } else if (event.code === 'KeyW') {
    keys.KeyW = false;
  } else if (event.code === 'KeyS') {
    keys.KeyS = false;
  }
});

// reset ball
function resetBall() {
  ball.position.set(0, 0.1, 0);
  ballDirX = (Math.random() > 0.5 ? 0.1 : -0.1); // random direction
  ballDirZ = (Math.random() - 0.5) * 0.2;; // random direction
}

// reset game
function resetGame() {
  leftScore = 0;
  rightScore = 0;
  // leftScoreElement.innerHTML = `Left: ${leftScore}`;
  // rightScoreElement.innerHTML = `Right: ${rightScore}`;
  // winnerElement.style.display = 'none';
  // ball.position.set(0, 0.1, 0);
  resetBall();

}

// AI paddle movement speed
const aiPaddleSpeed = 0.05;


// Render the scene from the perspective of the camera
function animate() {
  console.log("insideAnimate");
  requestAnimationFrame(animate);

  // check winner
  // if (leftScore >= scoreLimit) {
  //   winnerElement.innerHTML = 'Left Player Wins!';
  //   winnerElement.style.display = 'block';
  //   //setTimeout(resetGame, 3000);
  //   //resetGame();
  //   return;
  // } else if (rightScore >= scoreLimit) {
  //   winnerElement.innerHTML = 'Right Player Wins!';
  //   winnerElement.style.display = 'block';
  //   //setTimeout(resetGame, 3000);
  //   //resetGame();
  //   return;
  // }


  // Paddle movement based on key states
  const paddleSpeed = 0.2;
  if (keys.ArrowUp) {
    leftPaddle.position.z -= paddleSpeed;
  }
  if (keys.ArrowDown) {
    leftPaddle.position.z += paddleSpeed;
  }
  // if (keys.KeyW) {
  //   leftPaddle.position.z -= paddleSpeed;
  // }
  // if (keys.KeyS) {
  //   leftPaddle.position.z += paddleSpeed;
  // }

  // AI paddle movement
  if (ball.position.z > rightPaddle.position.z) {
    rightPaddle.position.z += aiPaddleSpeed;
  } else if (ball.position.z < rightPaddle.position.z) {
    rightPaddle.position.z -= aiPaddleSpeed;
  }

  // Clamp paddle position within board boundaries
  const boardHeight = 5;
  const paddleLength = 1; // Half of the paddle's height for boundary calculation
  const paddleHalfDepth = paddleDepth / 2;
  rightPaddle.position.z = THREE.MathUtils.clamp(rightPaddle.position.z, -boardHeight + (boardHeight / 2 + paddleLength / 2), boardHeight - (boardHeight / 2 + paddleLength / 2));
  leftPaddle.position.z = THREE.MathUtils.clamp(leftPaddle.position.z, -boardHeight + (boardHeight / 2 + paddleLength / 2), boardHeight - (boardHeight / 2 + paddleLength / 2));

  // ball movement
  ball.position.x += ballDirX;
  ball.position.z += ballDirZ;

  // ball collision with top and bottom all
  if (ball.position.z > boardLength / 2 || ball.position.z < -boardLength / 2)
    ballDirZ = -ballDirZ;

  // ball collision with the paddle
  const onCollide = () => {
    if (ballRotationSpd.x) {
      ballRotationSpd.y = ballRotationSpd.x;
      ballRotationSpd.x = 0;
    } else if (ballRotationSpd.y) {
      ballRotationSpd.z = ballRotationSpd.y;
      ballRotationSpd.y = 0;
    } else if (ballRotationSpd.z) {
      ballRotationSpd.x = ballRotationSpd.z;
      ballRotationSpd.z = 0;
    }
  }
  // Right paddle
  if ((ball.position.x > rightPaddle.position.x - paddleWidth / 2 && ball.position.x < rightPaddle.position.x + paddleWidth / 2) &&
    ball.position.z > rightPaddle.position.z - paddleHalfDepth && ball.position.z < rightPaddle.position.z + paddleHalfDepth) {
    // onCollide();
    ballDirX = -ballDirX;
  }

  //Left Paddle
  if ((ball.position.x < leftPaddle.position.x + paddleWidth / 2 && ball.position.x > leftPaddle.position.x - paddleWidth / 2) &&
    ball.position.z > leftPaddle.position.z - paddleHalfDepth && ball.position.z < leftPaddle.position.z + paddleHalfDepth) {
    // onCollide();
    ballDirX = -ballDirX;
  }


  // if ball goes beyond letf or right edeg, score ++
  if (ball.position.x > (boardWidth / 2 + ballRadius)) {
    // Left player scores
    leftScore += 1;
    // leftScoreElement.innerHTML = `Left: ${leftScore}`;
    resetBall();

  } else if (ball.position.x < (-boardWidth / 2 - ballRadius)) {
    // Right player scores
    rightScore += 1;
    // rightScoreElement.innerHTML = `Right: ${rightScore}`;
    resetBall();
  }

  // ball self rotation
  ball.rotation.x += 0.01;
  ball.rotation.y += 0.01;

  // light rotation
  // light.position.x = 500 * Math.sin(Date.now() / 240);
  // light.position.z = 500 * Math.cos(Date.now() / 240);

  // ballDirX = (Math.random() > 0.5 ? 0.1 : -0.1); // random direction
  // ballDirZ = (Math.random() > 0.5 ? 0.1 : -0.1); // random direction

  renderer.render(scene, camera);
}




export function setupVsBot() {
  var mainWindow = document.getElementById("main-window");
  mainWindow.innerHTML = '<p>VS Bot Game Loaded</p>';

  animate();
}














//////////////////////////////////////////////////////////////////////////////////
// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@v0.149.0/build/three.module.js';
// // import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// // ------------------------------------- //
// // ------- GLOBAL VARIABLES ------------ //
// // ------------------------------------- //

// // scene object variables
// var renderer, scene, camera, pointLight, spotLight, ambiLight;

// // field variables
// var fieldWidth = 400, fieldHeight = 200;

// // paddle variables
// var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
// var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

// // ball variables
// var ball, paddle1, paddle2;
// var ballDirX = 1, ballDirY = 1, ballSpeed = 2;
// var ballRotationSpd = { x: 0.2, y: 0, z: 0 }

// // game-related variables
// var score1 = 0, score2 = 0;
// // you can change this to any positive whole number
// var maxScore = 5;

// // set opponent reflexes (0 - easiest, 1 - hardest)
// var difficulty = 0.2;

// // Key
// window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
// window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);

// var Key = {
//   _pressed: {},

//   A: 65,
//   W: 87,
//   D: 68,
//   S: 83,
//   SPACE: 32,

//   Left: 37,
//   Up: 38,
//   Right: 39,
//   Down: 40,

//   isDown: function (keyCode) {
//     return this._pressed[keyCode];
//   },

//   onKeydown: function (event) {
//     this._pressed[event.keyCode] = true;
//   },

//   onKeyup: function (event) {
//     delete this._pressed[event.keyCode];
//   }
// };


// function createScene() {
//   // set the scene size
//   var WIDTH = 600,
//     HEIGHT = 400;

//   // set some camera attributes
//   var VIEW_ANGLE = 75,
//     ASPECT = WIDTH / HEIGHT,
//     NEAR = 0.1,
//     FAR = 1000;

//   var c = document.getElementById("main-window");

//   // create a WebGL renderer, camera and a scene
//   renderer = new THREE.WebGLRenderer({ alpha: true });
//   camera =
//     new THREE.PerspectiveCamera(
//       VIEW_ANGLE,
//       ASPECT,
//       NEAR,
//       FAR);

//   scene = new THREE.Scene();

//   // add the camera to the scene
//   scene.add(camera);

//   // set a default position for the camera
//   camera.position.z = 320;




//   // start the renderer
//   renderer.setSize(WIDTH, HEIGHT);

//   // attach the render-supplied DOM element
//   c.appendChild(renderer.domElement);

//   // set up the playing surface plane 
//   var planeWidth = fieldWidth,
//     planeHeight = fieldHeight,
//     planeQuality = 10;

//   // create the paddle1's material
//   var paddle1Material =
//     new THREE.MeshLambertMaterial(
//       {
//         color: 0xffffff, // white

//       });


//   // create the paddle2's material
//   var paddle2Material =
//     new THREE.MeshLambertMaterial(
//       {
//         color: 0xFF4045, // red
//       });

//   // create the table's material	
//   var planeMaterial =
//     new THREE.MeshLambertMaterial(
//       {
//         // color: 0x4BD121, //green
//         //color: 0x00BFFF, // blue
//         color: 0xA020F0, // purple
//         wireframe: true // the gridline
//       });
//   // create the plane's material
//   var tableMaterial =
//     new THREE.MeshLambertMaterial(
//       {
//         color: 0x111111,
//         opacity: 0.1,
//         transparent: true
//       });

//   var groundMaterial =
//     new THREE.MeshLambertMaterial(
//       {
//         //color: 0x888888,
//         transparent: true,
//         opacity: 0
//       });

//   // create the playing surface plane
//   var plane = new THREE.Mesh(

//     new THREE.PlaneGeometry(
//       planeWidth * 0.95,	// 95% of table width, since we want to show where the ball goes out-of-bounds
//       planeHeight,
//       planeQuality,
//       planeQuality),

//     planeMaterial);

//   scene.add(plane);
//   plane.receiveShadow = true;

//   var table = new THREE.Mesh(

//     new THREE.BoxGeometry(
//       planeWidth * 1.05,	// this creates the feel of a billiards table, with a lining
//       planeHeight * 1.03,
//       100,				// an arbitrary depth, the camera can't see much of it anyway
//       planeQuality,
//       planeQuality,
//       1),

//     tableMaterial);
//   table.position.z = -51;	// we sink the table into the ground by 50 units. The extra 1 is so the plane can be seen
//   scene.add(table);
//   table.receiveShadow = true;

//   // // set up the sphere vars
//   // increase 'segment' and 'ring' values will increase graphic quality
//   var radius = 10,
//     segments = 32,
//     rings = 16;

//   // // create the sphere's material
//   var sphereMaterial =
//     new THREE.MeshBasicMaterial(
//       {
//         map: new THREE.TextureLoader().load('./img/moon.jpg'),
//         transparent: true,
//         // opacity: 0.75
//       });

//   // Create a ball with sphere geometry
//   ball = new THREE.Mesh(

//     new THREE.SphereGeometry(
//       radius,
//       segments,
//       rings),

//     sphereMaterial);

//   // // add the sphere to the scene
//   scene.add(ball);

//   ball.position.x = 0;
//   ball.position.y = 0;
//   // set ball above the table surface
//   ball.position.z = radius;
//   ball.receiveShadow = true;
//   ball.castShadow = true;

//   // // set up the paddle vars
//   paddleWidth = 10;
//   paddleHeight = 30;
//   paddleDepth = 10;
//   paddleQuality = 1;

//   paddle1 = new THREE.Mesh(

//     new THREE.BoxGeometry(
//       paddleWidth,
//       paddleHeight,
//       paddleDepth,
//       paddleQuality,
//       paddleQuality,
//       paddleQuality),

//     paddle1Material);

//   // add the paddle to the scene


//   scene.add(paddle1);
//   paddle1.receiveShadow = true;
//   paddle1.castShadow = true;

//   paddle2 = new THREE.Mesh(

//     new THREE.BoxGeometry(
//       paddleWidth,
//       paddleHeight,
//       paddleDepth,
//       paddleQuality,
//       paddleQuality,
//       paddleQuality),

//     paddle2Material);

//   // // add the sphere to the scene
//   scene.add(paddle2);
//   paddle2.receiveShadow = true;
//   paddle2.castShadow = true;

//   // set paddles on each side of the table
//   paddle1.position.x = -fieldWidth / 2 + paddleWidth;
//   paddle2.position.x = fieldWidth / 2 - paddleWidth;

//   // lift paddles over playing surface
//   paddle1.position.z = paddleDepth;
//   paddle2.position.z = paddleDepth;

//   // finally we finish by adding a ground plane
//   // to show off pretty shadows
//   var ground = new THREE.Mesh(

//     new THREE.BoxGeometry(
//       1000,
//       1000,
//       3,
//       1,
//       1,
//       1),

//     groundMaterial);
//   // set ground to arbitrary z position to best show off shadowing
//   ground.position.z = -132;

//   ground.receiveShadow = true;
//   scene.add(ground);

//   // create a point light
//   pointLight =
//     new THREE.PointLight(0xF8D898);

//   // set its position
//   pointLight.position.x = -1000;
//   pointLight.position.y = 0;
//   pointLight.position.z = 1000;
//   pointLight.intensity = 2.9;
//   pointLight.distance = 10000;
//   // add to the scene
//   scene.add(pointLight);

//   ambiLight = new THREE.AmbientLight(0xffffff, 4);
//   scene.add(ambiLight);


//   // add a spot light
//   // this is important for casting shadows
//   spotLight = new THREE.SpotLight(0xffffff);
//   spotLight.position.set(0, 0, 460);
//   spotLight.intensity = 1.5;
//   spotLight.castShadow = true;
//   scene.add(spotLight);

//   // MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
//   renderer.shadowMap.enabled = true;

//   // const controls = new OrbitControls(camera, renderer.domElement);
//   // controls.update();


// }

// function drawVsHuman() {
//   // draw THREE.JS scene
//   renderer.render(scene, camera);
//   // loop draw function call
//   requestAnimationFrame(drawVsHuman);

//   ballPhysics();
//   paddlePhysics();
//   cameraPhysics();
//   playerPaddleMovement();
//   player2PaddleMovement(); // Vs Human

// }

// function drawVsBot() {
//   // draw THREE.JS scene
//   renderer.render(scene, camera);
//   // loop draw function call
//   requestAnimationFrame(drawVsBot);

//   ballPhysics();
//   paddlePhysics();
//   cameraPhysics();
//   playerPaddleMovement();
//   opponentPaddleMovement(); // vs Bot

// }

// function ballPhysics() {
//   // if ball goes off the 'left' side (Player's side)
//   if (ball.position.x <= -fieldWidth / 2) {
//     // CPU scores
//     score2++;
//     // update scoreboard HTML
//     // document.getElementById("scores").innerHTML = score1 + "-" + score2;
//     // reset ball to center
//     resetBall(2);
//     matchScoreCheck();
//   }

//   // if ball goes off the 'right' side (CPU's side)
//   if (ball.position.x >= fieldWidth / 2) {
//     // Player scores
//     score1++;
//     // update scoreboard HTML
//     // document.getElementById("scores").innerHTML = score1 + "-" + score2;
//     // reset ball to center
//     resetBall(1);
//     matchScoreCheck();
//   }

//   // if ball goes off the top side (side of table)
//   if (ball.position.y <= -fieldHeight / 2) {
//     ballDirY = -ballDirY;
//   }
//   // if ball goes off the bottom side (side of table)
//   if (ball.position.y >= fieldHeight / 2) {
//     ballDirY = -ballDirY;
//   }

//   // update ball position over time
//   ball.position.x += ballDirX * ballSpeed;
//   ball.position.y += ballDirY * ballSpeed;

//   // limit ball's y-speed to 2x the x-speed
//   // this is so the ball doesn't speed from left to right super fast

//   if (ballDirY > ballSpeed * 2) {
//     ballDirY = ballSpeed * 2;
//   }
//   else if (ballDirY < -ballSpeed * 2) {
//     ballDirY = -ballSpeed * 2;
//   }
// }

// // Handles CPU paddle movement and logic
// function opponentPaddleMovement() {
//   // Lerp towards the ball on the y plane
//   paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;

//   // in case the Lerp function produces a value above max paddle speed, we clamp it
//   if (Math.abs(paddle2DirY) <= paddleSpeed) {
//     paddle2.position.y += paddle2DirY;
//   }
//   // if the lerp value is too high, we have to limit speed to paddleSpeed
//   else {
//     // if paddle is lerping in +ve direction
//     if (paddle2DirY > paddleSpeed) {
//       paddle2.position.y += paddleSpeed;
//     }
//     // if paddle is lerping in -ve direction
//     else if (paddle2DirY < -paddleSpeed) {
//       paddle2.position.y -= paddleSpeed;
//     }
//   }
// }



// // Handles player's paddle movement
// function playerPaddleMovement() {
//   // move left
//   if (Key.isDown(Key.A)) {
//     // if paddle is not touching the side of table
//     // we move
//     if (paddle1.position.y < fieldHeight * 0.45) {
//       paddle1DirY = paddleSpeed * 0.5;
//     }
//     // else we don't move and stretch the paddle
//     // to indicate we can't move
//     else {
//       paddle1DirY = 0;
//       paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
//     }
//   }
//   // move right
//   else if (Key.isDown(Key.D)) {
//     // if paddle is not touching the side of table
//     // we move
//     if (paddle1.position.y > -fieldHeight * 0.45) {
//       paddle1DirY = -paddleSpeed * 0.5;
//     }
//     // else we don't move and stretch the paddle
//     // to indicate we can't move
//     else {
//       paddle1DirY = 0;
//       paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
//     }
//   }
//   // else don't move paddle
//   else {
//     // stop the paddle
//     paddle1DirY = 0;
//   }

//   paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
//   paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
//   paddle1.position.y += paddle1DirY;
// }


// // Handles player's paddle movement
// function player2PaddleMovement() {
//   // move left
//   if (Key.isDown(Key.Left)) {
//     // if paddle is not touching the side of table
//     // we move
//     if (paddle2.position.y < fieldHeight * 0.45) {
//       paddle2DirY = paddleSpeed * 0.5;
//     }
//     // else we don't move and stretch the paddle
//     // to indicate we can't move
//     else {
//       paddle2DirY = 0;
//       paddle2.scale.z += (10 - paddle2.scale.z) * 0.2;
//     }
//   }
//   // move right
//   else if (Key.isDown(Key.Right)) {
//     // if paddle is not touching the side of table
//     // we move
//     if (paddle2.position.y > -fieldHeight * 0.45) {
//       paddle2DirY = -paddleSpeed * 0.5;
//     }
//     // else we don't move and stretch the paddle
//     // to indicate we can't move
//     else {
//       paddle2DirY = 0;
//       paddle2.scale.z += (10 - paddle1.scale.z) * 0.2;
//     }
//   }
//   // else don't move paddle
//   else {
//     // stop the paddle
//     paddle2DirY = 0;
//   }

//   paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
//   paddle2.scale.z += (1 - paddle2.scale.z) * 0.2;
//   paddle2.position.y += paddle2DirY;
// }



// // Handles camera and lighting logic
// function cameraPhysics() {
//   // we can easily notice shadows if we dynamically move lights during the game
//   spotLight.position.x = ball.position.x * 2;
//   //spotLight.position.y = ball.position.y * 2;

//   // move to behind the player's paddle
//   //camera.position.x = paddle1.position.x - 100;
//   // camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
//   // camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x);
//   camera.position.x = paddle2.position.x - 500;
//   camera.position.y += (paddle2.position.y - camera.position.y) * 0.05;
//   camera.position.z = paddle2.position.z + 100 + 0.04 * (-ball.position.x + paddle2.position.x);

//   // rotate to face towards the opponent
//   camera.rotation.x = -0.01 * (ball.position.y) * Math.PI / 180;
//   camera.rotation.y = -60 * Math.PI / 180;


//   // perpenticulr or horizontal
//   camera.rotation.z = -90 * Math.PI / 180;

//   // ball rotation
//   ball.rotation.x += ballRotationSpd.x;
//   ball.rotation.y += ballRotationSpd.y;
//   ball.rotation.z += ballRotationSpd.z;
// }

// // Handles paddle collision logic
// function paddlePhysics() {
//   // ball rotation once hit the paddle

//   const onCollide = () => {
//     if (ballRotationSpd.x) {
//       ballRotationSpd.y = ballRotationSpd.x;
//       ballRotationSpd.x = 0;
//     } else if (ballRotationSpd.y) {
//       ballRotationSpd.z = ballRotationSpd.y;
//       ballRotationSpd.y = 0;
//     } else if (ballRotationSpd.z) {
//       ballRotationSpd.x = ballRotationSpd.z;
//       ballRotationSpd.z = 0;
//     }

//     ballSpeed += 0.1;
//   }

//   // PLAYER PADDLE LOGIC

//   // if ball is aligned with paddle1 on x plane
//   // remember the position is the CENTER of the object
//   // we only check between the front and the middle of the paddle (one-way collision)
//   if (ball.position.x <= paddle1.position.x + paddleWidth
//     && ball.position.x >= paddle1.position.x) {
//     // and if ball is aligned with paddle1 on y plane
//     if (ball.position.y <= paddle1.position.y + paddleHeight / 2
//       && ball.position.y >= paddle1.position.y - paddleHeight / 2) {
//       // and if ball is travelling towards player (-ve direction)
//       if (ballDirX < 0) {
//         onCollide()

//         // stretch the paddle to indicate a hit
//         //paddle1.scale.y = 15;
//         // switch direction of ball travel to create bounce
//         ballDirX = -ballDirX;
//         // we impact ball angle when hitting it
//         // this is not realistic physics, just spices up the gameplay
//         // allows you to 'slice' the ball to beat the opponent
//         ballDirY -= paddle1DirY * 0.7;
//       }
//     }
//   }

//   // OPPONENT PADDLE LOGIC	

//   // if ball is aligned with paddle2 on x plane
//   // remember the position is the CENTER of the object
//   // we only check between the front and the middle of the paddle (one-way collision)
//   if (ball.position.x <= paddle2.position.x + paddleWidth
//     && ball.position.x >= paddle2.position.x) {
//     // and if ball is aligned with paddle2 on y plane
//     if (ball.position.y <= paddle2.position.y + paddleHeight / 2
//       && ball.position.y >= paddle2.position.y - paddleHeight / 2) {
//       // and if ball is travelling towards opponent (+ve direction)
//       if (ballDirX > 0) {
//         onCollide()

//         // stretch the paddle to indicate a hit
//         //paddle2.scale.y = 15;
//         // switch direction of ball travel to create bounce
//         ballDirX = -ballDirX;
//         // we impact ball angle when hitting it
//         // this is not realistic physics, just spices up the gameplay
//         // allows you to 'slice' the ball to beat the opponent
//         ballDirY -= paddle2DirY * 0.7;
//       }
//     }
//   }
// }

// function resetBall(loser) {
//   // position the ball in the center of the table
//   ball.position.x = 0;
//   ball.position.y = 0;

//   // if player lost the last point, we send the ball to opponent
//   if (loser == 1) {
//     ballDirX = -1;
//   }
//   // else if opponent lost, we send ball to player
//   else {
//     ballDirX = 1;
//   }

//   // set the ball to move +ve in y plane (towards left from the camera)
//   ballDirY = 1;
// }

// var bounceTime = 0;
// // checks if either player or opponent has reached 5 points
// function matchScoreCheck() {
//   // if player has 5 points
//   if (score1 >= maxScore) {
//     // stop the ball
//     ballSpeed = 0;
//     // write to the banner
//     // document.getElementById("scores").innerHTML = "Player wins!";
//     // document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
//     // make paddle bounce up and down
//     // bounceTime++;
//     //paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;
//     // enlarge and squish paddle to emulate joy
//     // paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
//     // paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
//   }
//   // else if opponent has 5 points
//   else if (score2 >= maxScore) {
//     // stop the ball
//     ballSpeed = 0;
//     // write to the banner
//     // document.getElementById("scores").innerHTML = "CPU wins!";
//     // document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
//     // make paddle bounce up and down
//     bounceTime++;
//     paddle2.position.z = Math.sin(bounceTime * 0.1) * 10;
//     // // enlarge and squish paddle to emulate joy
//     paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
//     paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
//   }
// }


// /////////////////////////

// function setupVsHuman() {
//   renderer.dispose();
//   var mainWindow = document.getElementById('main-window');
//   mainWindow.innerHTML = '<p>VS Human Game Loaded</p>';
//   // update the board to reflect the max score for match win
//   //document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";

//   // now reset player and opponent scores
//   score1 = 0;
//   score2 = 0;

//   // set up all the 3D objects in the scene	
//   createScene();

//   // and let's get cracking!
//   drawVsHuman();

// }
// window.setupVsHuman = setupVsHuman; // globalizeing function method 1



// window.setupVsBot = () => {

//   // update the board to reflect the max score for match win
//   // document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";
//   var mainWindow = document.getElementById('main-window');
//   mainWindow.innerHTML = '<p>VS Bot Game Loaded</p>';
//   // now reset player and opponent scores
//   score1 = 0;
//   score2 = 0;

//   // set up all the 3D objects in the scene	
//   createScene();

//   // and let's get cracking!
//   drawVsBot();

// }
