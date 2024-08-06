import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import dat from 'https://cdn.skypack.dev/dat.gui';

function loadPongvsMan() {
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
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  var canvasman = document.getElementById('canvasvsman');
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);
  canvasman.innerHTML = ''; // Clear any existing content
  canvasman.appendChild(renderer.domElement);

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
  // scene.add(leftPaddle);

  // Right paddle
  const rightPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth); // Width, height, depth
  const rightPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff }); // Blue color for the paddles
  const rightPaddle = new THREE.Mesh(rightPaddleGeometry, rightPaddleMaterial);
  rightPaddle.position.set(5, 0.15, 0); // Position it on the right edge of the board
  // scene.add(rightPaddle);

  // GROUP PADDLE //
  const groupPaddle = new THREE.Group();
  groupPaddle.add(leftPaddle);
  groupPaddle.add(rightPaddle);
  scene.add(groupPaddle);

  // Create a sphere geometry
  const sphereData = {
    radius: 0.3,
    widthSegments: 32,
    heightSegments: 32
  }
  const sphereGeometry = new THREE.SphereGeometry(sphereData.radius, sphereData.widthSegments, sphereData.heightSegments); // Radius, width segments, height segments
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
  const leftScoreElement = document.createElement('div');
  leftScoreElement.style.position = 'absolute';
  leftScoreElement.style.top = '50%';
  leftScoreElement.style.left = '10px';
  leftScoreElement.style.color = 'white';
  leftScoreElement.style.fontSize = '24px';
  leftScoreElement.innerHTML = 'Left: 0';
  document.body.appendChild(leftScoreElement);

  const rightScoreElement = document.createElement('div');
  rightScoreElement.style.position = 'absolute';
  rightScoreElement.style.top = '50%';
  rightScoreElement.style.right = '10px';
  rightScoreElement.style.color = 'white';
  rightScoreElement.style.fontSize = '24px';
  rightScoreElement.innerHTML = 'Right: 0';
  document.body.appendChild(rightScoreElement);

  const winnerElement = document.createElement('div');
  winnerElement.style.position = 'absolute';
  winnerElement.style.top = '35%';
  winnerElement.style.left = '50%';
  winnerElement.style.transform = 'translate(-50%, -50%)';
  winnerElement.style.color = 'white';
  winnerElement.style.fontSize = '24px';
  winnerElement.style.display = 'none';
  document.body.appendChild(winnerElement);

  /// GUI Panel ///
  const gui = new dat.GUI({ autoPlace: false });
  gui.close();
  gui.domElement.id = 'gui';
  gui_container.appendChild(gui.domElement);

  ///Paddle Size Change//
  gui.add(groupPaddle.scale, 'z', 0.2, 0.75).name('Paddle Size');

  //Paddle Color Change //
  const materialLeftPaddle = {
    leftPaddleColor: leftPaddle.material.color.getHex(),
  };
  const materialRightPaddle = {
    rightPaddleColor: rightPaddle.material.color.getHex(),
  };
  gui
    .addColor(materialLeftPaddle, 'leftPaddleColor')
    .onChange((value) => leftPaddle.material.color.set(value));
  gui
    .addColor(materialRightPaddle, 'rightPaddleColor')
    .onChange((value) => rightPaddle.material.color.set(value));

  // Ball Color Change //
  const materialBall = {
    ballColor: ball.material.color.getHex(),
  }
  gui
    .addColor(materialBall, 'ballColor')
    .onChange((value) => ball.material.color.set(value));

  // Board color
  const materialBoard = {
    boardColor: board.material.color.getHex(),
  }
  gui.add(board.material, 'wireframe').name('Board Wireframe');
  gui
    .addColor(materialBoard, 'boardColor')
    .onChange((value) => board.material.color.set(value));




  // Add event listener for resizing the window
  // window.addEventListener('resize', () => {
  //   camera.aspect = window.innerWidth / window.innerHeight;
  //   camera.updateProjectionMatrix();
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  // });
  // var resizeRenderer = () => {
  //   camera.aspect = window.innerWidth / window.innerHeight;

  //   camera.updateProjectionMatrix();
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  // };
  // resizeRenderer();

  var resizeRenderer = () => {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  resizeRenderer();

  window.addEventListener('resize', resizeRenderer);

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
    leftScoreElement.innerHTML = `Left: ${leftScore}`;
    rightScoreElement.innerHTML = `Right: ${rightScore}`;
    winnerElement.style.display = 'none';
    // ball.position.set(0, 0.1, 0);
    //resetBall();

  }

  // Render the scene from the perspective of the camera
  function animate() {
    requestAnimationFrame(animate);

    // check winner
    if (leftScore >= scoreLimit) {
      winnerElement.innerHTML = 'Left Player Wins!';
      winnerElement.style.display = 'block';
      //setTimeout(resetGame, 3000);
      return;
    } else if (rightScore >= scoreLimit) {
      winnerElement.innerHTML = 'Right Player Wins!';
      winnerElement.style.display = 'block';
      //setTimeout(resetGame, 3000);
      return;
    }


    // Paddle movement based on key states
    const paddleSpeed = 0.2;
    if (keys.ArrowUp) {
      rightPaddle.position.z -= paddleSpeed;
    }
    if (keys.ArrowDown) {
      rightPaddle.position.z += paddleSpeed;
    }
    if (keys.KeyW) {
      leftPaddle.position.z -= paddleSpeed;
    }
    if (keys.KeyS) {
      leftPaddle.position.z += paddleSpeed;
    }

    // Clamp paddle position within board boundaries
    const boardHeight = 5;
    const paddleLength = 1; // Half of the paddle's height for boundary calculation
    const paddleHalfDepth = paddleDepth / 2;
    rightPaddle.position.z = THREE.MathUtils.clamp(rightPaddle.position.z, -boardHeight + (boardHeight / 2 + paddleLength / 2), boardHeight - (boardHeight / 2 + paddleLength / 2));
    leftPaddle.position.z = THREE.MathUtils.clamp(leftPaddle.position.z, -boardHeight + (boardHeight / 2 + paddleLength / 2), boardHeight - (boardHeight / 2 + paddleLength / 2));

    // ball movement
    ball.position.x += ballDirX * 0.5;
    ball.position.z += ballDirZ * 0.5;

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
    if (ball.position.x > (boardWidth / 2 + sphereData.radius)) {
      // Left player scores
      leftScore += 1;
      leftScoreElement.innerHTML = `Left: ${leftScore}`;
      resetBall();

    } else if (ball.position.x < (-boardWidth / 2 - sphereData.radius)) {
      // Right player scores
      rightScore += 1;
      rightScoreElement.innerHTML = `Right: ${rightScore}`;
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

  animate();
}

window.loadMan = function () {
  loadPongvsMan();
  console.log("load Pong vs man");
}

loadMan();