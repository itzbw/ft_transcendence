import dat from "https://cdn.skypack.dev/dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const url = new URL(window.location.href);
const playersRaw = url.searchParams.get("players");
let players = JSON.parse(playersRaw);
const leftScoreElement = document.createElement("div");
const rightScoreElement = document.createElement("div");
const instructionElement = document.createElement("div");
const winnerElement = document.createElement("div");
let scene = null;
let animFrameId = null;
let leftScore = 0;
let rightScore = 0;
const scoreLimit = 1;
let leftPlayer = null;
let rightPlayer = null;

function loadGameTournament() {
    // console.log(url.toString(), "->", playersRaw, "->", players)
    // console.log(playersRaw);
    console.log("leftplayer:" + leftPlayer);
    console.log("rightplayer:" + rightPlayer);
    // Create the scene
    scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(
        60, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    camera.position.z = 8;
    camera.position.y = 8;
    camera.lookAt(0, 0, 0);

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    var canvasman = document.getElementById("canvastournament");
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);
    canvasman.innerHTML = ""; // Clear any existing content
    canvasman.appendChild(renderer.domElement);

    // Create a point light
    const light = new THREE.AmbientLight(0xffffff, 3);
    // for rotation only
    //const light = new THREE.PointLight(0xffffff, 0.8);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Main board
    const boardWidth = 10;
    const boardLength = 5;
    const boardGeometry = new THREE.BoxGeometry(
        boardWidth,
        0.2,
        boardLength,
        10,
        10,
        10
    ); // Width, height (depth), length
    const boardMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        wireframe: true,
    }); // Brown color for the board
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = -0.1;
    scene.add(board);

    // Create paddles
    const paddleWidth = 0.2;
    const paddleHeight = 0.5;
    const paddleDepth = 1;

    // Left paddle
    const leftPaddleGeometry = new THREE.BoxGeometry(
        paddleWidth,
        paddleHeight,
        paddleDepth
    ); // Width, height, depth
    const leftPaddleMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
    }); // Blue color for the paddles
    const leftPaddle = new THREE.Mesh(leftPaddleGeometry, leftPaddleMaterial);
    leftPaddle.position.set(-5, 0.15, 0); // Position it on the left edge of the board
    // scene.add(leftPaddle);

    // Right paddle
    const rightPaddleGeometry = new THREE.BoxGeometry(
        paddleWidth,
        paddleHeight,
        paddleDepth
    ); // Width, height, depth
    const rightPaddleMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
    }); // Blue color for the paddles
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
        heightSegments: 32,
    };
    const sphereGeometry = new THREE.SphereGeometry(sphereData.radius); // Radius, width segments, height segments
    const sphereMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load("../img/moon.jpg"),
        color: 0xffaaff,
    }); // Red color for the sphere

    const ball = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // Add the sphere to the scene
    ball.position.set(0, 0.1, 0); // Position it at the center of the board
    scene.add(ball);

    // variable for ball movement
    let ballDirX = 0.1;
    let ballDirZ = 0.1;
    var ballRotationSpd = { x: 0.2, y: 0, z: 0 };

    // Score

    /////////////////// HTML Score Showing /////////////////////

    instructionElement.style.position = "absolute";
    instructionElement.style.top = "80%";
    instructionElement.style.left = "40%";
    instructionElement.style.color = "white";
    instructionElement.style.fontSize = "18px";
    instructionElement.innerHTML = "use W & S | ⬆ & ⬇ to control";
    document.body.appendChild(instructionElement);

    leftScoreElement.style.position = "absolute";
    leftScoreElement.style.top = "50%";
    leftScoreElement.style.left = "10px";
    leftScoreElement.style.color = "white";
    leftScoreElement.style.fontSize = "24px";
    leftScoreElement.innerHTML = `${leftPlayer} : ${leftScore}`;
    document.body.appendChild(leftScoreElement);

    rightScoreElement.style.position = "absolute";
    rightScoreElement.style.top = "50%";
    rightScoreElement.style.right = "10px";
    rightScoreElement.style.color = "white";
    rightScoreElement.style.fontSize = "24px";
    rightScoreElement.innerHTML = `${rightPlayer} : ${rightScore}`;
    document.body.appendChild(rightScoreElement);

    winnerElement.style.position = "absolute";
    winnerElement.style.top = "50%";
    winnerElement.style.left = "50%";
    winnerElement.style.transform = "translate(-50%, -50%)";
    winnerElement.style.color = "white";
    winnerElement.style.fontSize = "24px";
    winnerElement.style.display = "none";
    document.body.appendChild(winnerElement);

    /// GUI Panel ///
    const gui = new dat.GUI({ autoPlace: false });
    gui.close();
    gui.domElement.id = "gui";
    gui_container.appendChild(gui.domElement);

    ///Paddle Size Change//
    gui.add(groupPaddle.scale, "z", 0.2, 0.75).name("Paddle Size");

    // Ball Size chnage
    gui
        .add(sphereData, "radius", 0.3, 1)
        .name("Ball size")
        .onChange(redraw)
        .onFinishChange(() => console.dir(ball.geometry));

    // Board wireframe
    gui.add(board.material, "wireframe").name("Board Wireframe");

    //Paddle Color Change //
    const materialLeftPaddle = {
        leftPaddleColor: leftPaddle.material.color.getHex(),
    };
    const materialRightPaddle = {
        rightPaddleColor: rightPaddle.material.color.getHex(),
    };
    gui
        .addColor(materialLeftPaddle, "leftPaddleColor")
        .onChange((value) => leftPaddle.material.color.set(value));
    gui
        .addColor(materialRightPaddle, "rightPaddleColor")
        .onChange((value) => rightPaddle.material.color.set(value));

    // Ball Color Change //
    const materialBall = {
        ballColor: ball.material.color.getHex(),
    };
    gui
        .addColor(materialBall, "ballColor")
        .onChange((value) => ball.material.color.set(value));

    // Board color
    const materialBoard = {
        boardColor: board.material.color.getHex(),
    };
    gui
        .addColor(materialBoard, "boardColor")
        .onChange((value) => board.material.color.set(value));

    function redraw() {
        let newGeometry = new THREE.SphereGeometry(sphereData.radius);
        ball.geometry.dispose();
        ball.geometry = newGeometry;
    }

    var resizeRenderer = () => {
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    resizeRenderer();

    window.addEventListener("resize", resizeRenderer);

    // Add mouse interaction
    document.addEventListener("mousemove", onDocumentMouseMove);

    let mouseX = 0;
    let mouseY = 0;

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    const controls = new OrbitControls(camera, renderer.domElement);

    // Key states for paddle movement
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        KeyW: false,
        KeyS: false,
    };

    // Event listeners for keydown and keyup
    document.addEventListener("keydown", (event) => {
        if (event.code === "ArrowUp") {
            keys.ArrowUp = true;
        } else if (event.code === "ArrowDown") {
            keys.ArrowDown = true;
        } else if (event.code === "KeyW") {
            keys.KeyW = true;
        } else if (event.code === "KeyS") {
            keys.KeyS = true;
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.code === "ArrowUp") {
            keys.ArrowUp = false;
        } else if (event.code === "ArrowDown") {
            keys.ArrowDown = false;
        } else if (event.code === "KeyW") {
            keys.KeyW = false;
        } else if (event.code === "KeyS") {
            keys.KeyS = false;
        }
    });

    // reset ball
    function resetBall() {
        ball.position.set(0, 0.1, 0);
        ballDirX = Math.random() > 0.5 ? 0.1 : -0.1; // random direction
        ballDirZ = (Math.random() - 0.5) * 0.2; // random direction
    }

    function resetGame() {
        leftScore = 0;
        rightScore = 0;
        leftScoreElement.innerHTML = `${leftPlayer} ${leftScore}`;
        rightScoreElement.innerHTML = `${rightPlayer}: ${rightScore}`;
        winnerElement.style.display = "none";
    }

    const clock = new THREE.Clock();

    // Render the scene from the perspective of the camera
    function animate() {
        animFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();

        function showNextMatch() {
            return `<br/> <button onmousedown='loadNextMatch(); '> Next Match: ${leftPlayer} vs ${rightPlayer}</button >`;
        }

        // Paddle movement based on key states
        const paddleSpeed = 10;
        if (keys.ArrowUp) {
            rightPaddle.position.z -= paddleSpeed * delta;
        }
        if (keys.ArrowDown) {
            rightPaddle.position.z += paddleSpeed * delta;
        }
        if (keys.KeyW) {
            leftPaddle.position.z -= paddleSpeed * delta;
        }
        if (keys.KeyS) {
            leftPaddle.position.z += paddleSpeed * delta;
        }

        // Clamp paddle position within board boundaries
        const boardHeight = 5;
        const paddleLength = 1; // Half of the paddle's height for boundary calculation
        const paddleHalfDepth = paddleDepth / 2;
        rightPaddle.position.z = THREE.MathUtils.clamp(
            rightPaddle.position.z,
            -boardHeight + (boardHeight / 2 + paddleLength / 2),
            boardHeight - (boardHeight / 2 + paddleLength / 2)
        );
        leftPaddle.position.z = THREE.MathUtils.clamp(
            leftPaddle.position.z,
            -boardHeight + (boardHeight / 2 + paddleLength / 2),
            boardHeight - (boardHeight / 2 + paddleLength / 2)
        );

        const ballSpeed = 20;
        // ball movement
        ball.position.x += ballDirX * ballSpeed * delta;
        ball.position.z += ballDirZ * ballSpeed * delta;
        // ball self rotation
        ball.rotation.x += 1 * delta;
        ball.rotation.y += 1 * delta;

        // ball collision with top and bottom all
        if (ball.position.z > boardLength / 2 || ball.position.z < -boardLength / 2)
            ballDirZ = -ballDirZ;

        // ball collision with the paddle
        const onCollide = () => {
            if (ballRotationSpd.x) {
                ballRotationSpd.y = ballRotationSpd.x;
                ballRotationSpd.x = 0;
                ballDirX *= 1.2;
            } else if (ballRotationSpd.y) {
                ballRotationSpd.z = ballRotationSpd.y;
                ballRotationSpd.y = 0;
            } else if (ballRotationSpd.z) {
                ballRotationSpd.x = ballRotationSpd.z;
                ballRotationSpd.z = 0;
                ballDirZ *= 1.2;
            }
        };

        // Right paddle
        if (
            ball.position.x + sphereData.radius >
            rightPaddle.position.x - paddleWidth / 2 &&
            ball.position.z + sphereData.radius >
            rightPaddle.position.z - paddleDepth / 2 &&
            ball.position.z - sphereData.radius <
            rightPaddle.position.z + paddleDepth / 2
        ) {
            onCollide();
            ballDirX = -ballDirX;
        }

        //Left Paddle
        if (
            ball.position.x - sphereData.radius <
            leftPaddle.position.x + paddleWidth / 2 &&
            ball.position.z + sphereData.radius >
            leftPaddle.position.z - paddleHalfDepth &&
            ball.position.z - sphereData.radius <
            leftPaddle.position.z + paddleHalfDepth
        ) {
            onCollide();
            ballDirX = -ballDirX;
        }

        function onGoal() {
            const leftWon = leftScore >= scoreLimit;
            const rightWon = rightScore >= scoreLimit;
            if (leftWon || rightWon) {
                destroy();

                const winner = leftWon ? leftPlayer : rightPlayer;
                makeMatchmaking();
                winnerElement.innerHTML = `${winner}  Wins!`;
                winnerElement.innerHTML += showNextMatch();
                winnerElement.style.display = "block";

                if (players.length === 1) {
                    winnerElement.innerHTML = `${winner} won the tournament! 😱👏`;
                }
            }
        }

        // if ball goes beyond letf or right edeg, score ++
        if (ball.position.x + sphereData.radius > boardWidth / 2) {
            // Left player scores
            leftScore += 1;
            leftScoreElement.innerHTML = `${leftPlayer}: ${leftScore}`;
            resetBall();
            onGoal();
        } else if (ball.position.x - sphereData.radius < -boardWidth / 2) {
            // Right player scores
            rightScore += 1;
            rightScoreElement.innerHTML = `${rightPlayer}: ${rightScore}`;
            resetBall();
            onGoal();
        }

        renderer.render(scene, camera);
    }

    animate();
}

let playCount = 0;

window.reloadHash = function () {
    (function () {
        if (window.localStorage) {
            if (!localStorage.getItem("firstLoad")) {
                localStorage["firstLoad"] = true;
                window.location.reload();
            } else localStorage.removeItem("firstLoad");
        }
    })();
};

window.loadTournament = function () {
    leftPlayer = players[0];
    rightPlayer = players[1];
    loadGameTournament();

    console.log("player length: " + players.length);
};

window.destroy = function () {
    rightScoreElement.parentElement.removeChild(rightScoreElement);
    leftScoreElement.parentElement.removeChild(leftScoreElement);
    instructionElement.parentElement.removeChild(instructionElement);
    scene.remove.apply(scene, scene.children);
    cancelAnimationFrame(animFrameId);
    gui.parentElement.removeChild(gui);
    console.log("destroy");
};

function findLoser() {
    const leftWon = leftScore >= scoreLimit;
    const rightWon = rightScore >= scoreLimit;

    return leftWon ? rightPlayer : rightWon ? leftPlayer : null;
}

function makeMatchmaking() {
    let loser = findLoser();

    console.log(loser);
    console.log(players);

    players = players.filter(function (item) {
        return item !== loser;
    });

    console.log("promoted players:", players);

    playCount += 1;
    leftPlayer = players[(playCount + 0) % players.length];
    rightPlayer = players[(playCount + 1) % players.length];
    leftScore = 0;
    rightScore = 0;
}

window.loadNextMatch = function () {
    console.log("loser:", findLoser());

    if (players.length > 1) {
        loadGameTournament();
    } else if (players.length === 1) {
        alert(`${players} is the Champion of this tournament!`);
    }

    console.log("load Next Match");
};

loadTournament();
