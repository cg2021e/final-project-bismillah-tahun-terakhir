import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

var PLANE_WIDTH = 20;
var PLANE_LENGTH = 1000;
var PADDING = (PLANE_WIDTH / 5) * 2;

var camera;
var directionalLight;
var globalRenderID;
var hemisphereLight;
var renderer;
var scene;

var rocket;
var rocketActions;

var sun;
var sunActions;

var mixers = [];

var movingLeft = false;
var movingRight = false;
var movingDestinyX = null;

var game_running = true;

var clock = new THREE.Clock();

var cameraDegreesStart = -90;
var cameraDegreesEnd = 0;
var cameraPositionXStart = -45;
var cameraPositionXEnd = 0;
var cameraPositionZStart = 50;
var cameraPositionZEnd = 10;
var cameraIntroTime = 4000;
var cameraIntroDone = false;
var cameraInitialTimestamp = null;

var stars = [];

const text = "galaxy...";
var textMeshs = [];

var buttonMesh;
var boundingBoxButton = null;

function addStar(zPosition, scale = starAttrs.scale) {
  var geometry = new THREE.SphereGeometry(
    starAttrs.radius,
    starAttrs.widthSegnments,
    starAttrs.heightSegments
  );
  var material = new THREE.MeshBasicMaterial({
    color: starAttrs.color,
  });
  var sphere = new THREE.Mesh(geometry, material);

  sphere.scale.x = sphere.scale.y = scale;
  sphere.position.x = Math.random() * 1000 - 500;
  sphere.position.y = Math.random() * 1000 - 500;
  sphere.position.z = zPosition;

  scene.add(sphere);

  stars.push(sphere);
}

function loadModels() {
  const loader = new GLTFLoader();
  loader.load(rocketAttrs.src, function (gltf) {
    const model = gltf.scene;
    model.scale.set(rocketAttrs.scale, rocketAttrs.scale, rocketAttrs.scale);
    model.position.set(
      rocketAttrs.initialPosition.x,
      rocketAttrs.initialPosition.y,
      rocketAttrs.initialPosition.z
    );
    rocket = model;
    rocket.rotation.y = - Math.PI / 5;
    rocket.rotation.x = - Math.PI / 16;
    scene.add(rocket);

    rocketActions = new THREE.AnimationMixer(model);
    rocketActions.clipAction(gltf.animations[0]).play();
  });

  loader.load(sunAttrs.src, function (gltf) {
    const model = gltf.scene;
    model.scale.set(sunAttrs.scale, sunAttrs.scale, sunAttrs.scale);
    model.position.set(
      sunAttrs.initialPosition.x,
      sunAttrs.initialPosition.y,
      sunAttrs.initialPosition.z
    );
    sun = model;
    scene.add(sun);

    sunActions = new THREE.AnimationMixer(model);
    sunActions.clipAction(gltf.animations[0]).play();
  });

  var cubeTexture = new THREE.ImageUtils.loadTexture("./../../textures/start.png"); 

  const buttonGeometry = new THREE.BoxGeometry(4.5, 1.5, 1);
  const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: cubeTexture });
  buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
  buttonMesh.position.set(-1, 11.6, 600);
  
  boundingBoxButton = new THREE.BoxHelper( buttonMesh, 0x00FFBD59 );
  boundingBoxButton.update();

  scene.add(buttonMesh);
  scene.add( boundingBoxButton ); 
}

function inializeObjects() {
  for (
    var z = starAttrs.position.zMin;
    z < starAttrs.position.zMax;
    z += starAttrs.position.zGap
  ) {
    addStar(z);
  }
}

function initializeWorld() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    perspectiveAttrs.fov,
    window.innerWidth / window.innerHeight,
    perspectiveAttrs.near,
    perspectiveAttrs.far
  );
  camera.position.set(
    cameraPositionXStart,
    10.6,
    PLANE_LENGTH / 2 + PLANE_LENGTH / 25 - cameraPositionZStart
  );
  camera.rotation.y = (cameraDegreesStart * Math.PI) / 180;

  scene.add(camera);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  var spotLight;
  var target;
  var targetGeometry;
  var targetMaterial;
  for (var i = 0; i < 5; i += 1) {
    targetGeometry = new THREE.BoxGeometry(1, 1, 1);
    targetMaterial = new THREE.MeshNormalMaterial();
    target = new THREE.Mesh(targetGeometry, targetMaterial);
    target.position.set(0, 2, (i * PLANE_LENGTH) / 5 - PLANE_LENGTH / 2.5);
    target.visible = false;
    scene.add(target);

    spotLight = new THREE.SpotLight(0xffffff, 0.1);
    spotLight.position.set(
      150,
      (i * PLANE_LENGTH) / 5 - PLANE_LENGTH / 2.5,
      -350
    );
    spotLight.castShadow = true;
    spotLight.target = target;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
  }
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 99, 0);
  hemisphereLight = new THREE.HemisphereLight(0xfffbdb, 0x37474f, 1);
  hemisphereLight.position.y = 500;
  scene.add(directionalLight, hemisphereLight);

  loadModels();

  inializeObjects();
}

var change = [];
var speed = [];
var doneDrawText = false;
function drawText()
{
  const fontLoader = new THREE.FontLoader();

  for (let i = 0; i <= text.length; i++)
  {
    fontLoader.load("./../../assets/fonts/poppins-semibold.json", function (font) {
      var textGeo = new THREE.TextGeometry(text.charAt(i), {
        font: font,
        size: 2,
        height: 0.1,
        bevelEnabled: false,
      });
  
      var textMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 100,
      });
      textMeshs[i] = new THREE.Mesh(textGeo, textMaterial);
      var addition = 2;
      if (i == 3 || i == 7 || i == 8 || i == 9)
        addition -= 1.0
        
      if (i > 0)
        textMeshs[i].position.set(textMeshs[i-1].position.x + addition, 13.6, 550);
      else
        textMeshs[i].position.set(-6.4, 13.6, 550);
      textMeshs[i].rotation.set(0, -0.2, 0);
      scene.add(textMeshs[i]);
    });
    
    if (i % 2 == 0)
    {
      change[i] = -0.05;
      speed[i] = -1/500;
    }
    else
    {
      change[i] = 0.05;
      speed[i] = 1/500;
    }
  }
}

function updateText()
{
  if (doneDrawText == false)
  {
    if (textMeshs.length >= text.length)
    {
      for (let i = 0; i < textMeshs.length; i++)
      {
        textMeshs[i].position.z = 500;
      }
      
      doneDrawText = true;
    }
    if (buttonMesh != undefined)
    {
      buttonMesh.position.z = 500;
    }
  }
  if (textMeshs.length >= text.length)
  {
    for (let i = 0; i < textMeshs.length; i++)
    {
      if (Math.abs(change[i]) >= 0.25)
      {
        change[i] = 0;
        speed[i] = -speed[i];
      }
      
      textMeshs[i].position.y += speed[i];
      change[i] += speed[i];
    }
  }
}

function animateObjects() {
  for (var i = 0; i < stars.length; i++) {
    var star = stars[i];

    star.position.z += i / 100;

    if (star.position.z > 1000) {
      star.position.z -= 2000;
    }
  }
}

var childWindow = "";
var newTabUrl = "./../main/index.html";
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var time = 0;

function onMouseDown(event) {
  var posRender = new THREE.Vector2();
  posRender = renderer.getSize();
  var x = ( event.clientX /  windowWidth) * 4.2 - 1;
  var y = - ( event.clientY / windowHeight ) * 10 + 16;
  var boxPos = boundingBoxButton.geometry.attributes.position.array;
  if (
      boxPos[0] >= x &&
      boxPos[3] <= x &&
      boxPos[1] >= y &&
      boxPos[7] <= y 
  ) {
    childWindow = window.open(newTabUrl, "_self");
  }
  console.log(x, y);
  console.log( boxPos[0], boxPos[3], boxPos[1], boxPos[7] );
}
document.addEventListener("mousedown", onMouseDown, false);

function render() {
  animateObjects();

  renderer.render(scene, camera);

  setTimeout(function () {
    globalRenderID = requestAnimationFrame(render);
  }, 1000 / 90);

  if (game_running == true) {
    if (cameraIntroDone == false) {
      if (cameraInitialTimestamp == null) {
        cameraInitialTimestamp = Date.now();
      }

      if (Date.now() > cameraInitialTimestamp + cameraIntroTime) {
        if (cameraPositionXStart != cameraPositionXEnd) {
          cameraPositionXStart = cameraPositionXStart + 1;

          camera.position.x = camera.position.x + 1;
        }

        if (cameraDegreesStart != cameraDegreesEnd) {
          cameraDegreesStart = cameraDegreesStart + 2;

          camera.rotation.y = (cameraDegreesStart * Math.PI) / 180;
        }

        if (cameraPositionZStart != cameraPositionZEnd) {
          cameraPositionZStart = cameraPositionZStart - 1;

          camera.position.z =
            PLANE_LENGTH / 2 + PLANE_LENGTH / 25 - cameraPositionZStart;
        }

        if (
          cameraDegreesStart == cameraDegreesEnd &&
          cameraPositionXStart == cameraPositionXEnd &&
          cameraPositionZStart == cameraPositionZEnd
        ) {
          cameraIntroDone = true;
        }
      }
    }
    else
    {
      updateText();
    }

    var clockDelta = clock.getDelta();
    time += clockDelta;
    if (rocketActions != undefined) rocketActions.update(clockDelta);
    if (sunActions != undefined) sunActions.update(clockDelta);

    if (Date.now() > cameraInitialTimestamp + cameraIntroTime + 4000)
      childWindow = window.open(newTabUrl, "_self");

    if (movingDestinyX != null) {
      if (rocket.position.x != movingDestinyX) {
        if (movingLeft == true) {
          rocket.position.x = rocket.position.x - 0.5;
        } else if (movingRight == true) {
          rocket.position.x = rocket.position.x + 0.5;
        }
      } else {
        movingDestinyX = null;
        movingLeft = false;
        movingRight = false;
      }
    }
  }
}

initializeWorld();
drawText();
render();
