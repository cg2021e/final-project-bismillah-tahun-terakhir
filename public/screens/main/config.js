const perspectiveAttrs = {
  fov: 50,
  near: 0.1,
  far: 5000,
  initailPosition: {
    x: 0,
    y: 0,
    z: 5,
  },
  followRocket: {
    enabled: true,
    subtraction: 0.002,
    additionalY: 0.5,
  },
};

const lightAttrs = {
  point: {
    color: 0xffffff,
    intensity: 2,
    initailPosition: {
      x: 2,
      y: 2,
      z: 5,
    },
  },
  ambient: {
    color: 0xffffff,
    intensity: 0.4,
    initailPosition: {
      x: 2,
      y: 2,
      z: 5,
    },
  }
};

const starAttrs = {
  radius: 0.5,
  widthSegnments: 32,
  heightSegments: 32,
  color: 0xffffff,
  scale: 0.5,
  position: {
    zMin: -2000,
    zMax: 2000,
    zGap: 20,
  },
  speed: 100,
};

const pathLineAttrs = {
  divisions: 70,
  color: 0xffffaa,
  pathPoints: [
    [-8, 0.1, 12],
    [-9, 0.2, 7],
    [-9.5, 0.3, 3.4],
    [-18, 0.3, -2],
    [-19.5, 0.3, -3],
    [-24, 0.2, -8],
    [-21, 0.1, -13],
    [-18, 0.02, -18],
    [-8, 0, -23],
    [-2, 0, -20],
    [4, -0.02, -17],
    [9, -0.05, -13],
    [13, -0.1, -8],
    [17, -0.15, -3],
    [24, -0.2, 8],
    [12, -0.1, 17],
    [4, 0, 23],
    [-7, 0.02, 18],
  ],
  isDrawLines: true,
};

const rocketSpeed = 0.00005;
const rocketAttrs = {
  src: "./../../assets/models/rocket-astro/scene.gltf",
  scale: 0.001,
  initailPosition: {
    x: 0,
    y: 0,
    z: 0,
  },
  path: {
    num: 5,
    scale: 2.5,
    scaleAddition: 0.003,
  },
  movement: {
    speed: rocketSpeed,
    delta: rocketSpeed * (100 + (1000 * (0.0005 - rocketSpeed))),
  },
};

const planetBaseScale = 1;
const planetsAttrs = {
  mercury: {
    name: "mercury",
    src: "./../../assets/models/mercury/scene.gltf",
    scale: planetBaseScale / 15,
    pathScale: rocketAttrs.path.scale + rocketAttrs.path.scaleAddition * 7.5,
    pathFraction: 0.04,
    speed: 0,
  },
  venus: {
    name: "venus",
    src: "./../../assets/models/venus/scene.gltf",
    scale: planetBaseScale / 27,
    pathScale: rocketAttrs.path.scale - rocketAttrs.path.scaleAddition * 22,
    pathFraction: 0.1,
    speed: 0,
  },
  earth: {
    name: "earth",
    src: "./../../assets/models/earth/scene.gltf",
    scale: planetBaseScale / 27,
    pathScale: rocketAttrs.path.scale + rocketAttrs.path.scaleAddition * 22,
    pathFraction: 0.2,
    speed: 0,
  },
  mars: {
    name: "mars",
    src: "./../../assets/models/mars/scene.gltf",
    scale: planetBaseScale / 25,
    pathScale: rocketAttrs.path.scale - rocketAttrs.path.scaleAddition * 16,
    pathFraction: 0.28,
    speed: 0,
  },
  jupiter: {
    name: "jupiter",
    src: "./../../assets/models/jupiter/scene.gltf",
    scale: planetBaseScale / 50,
    pathScale: rocketAttrs.path.scale + rocketAttrs.path.scaleAddition * 120,
    pathFraction: 0.45,
    speed: 0,
  },
  saturn: {
    name: "saturn",
    src: "./../../assets/models/saturn/scene.gltf",
    scale: planetBaseScale / 40,
    pathScale: rocketAttrs.path.scale + rocketAttrs.path.scaleAddition * 85,
    pathFraction: 0.75,
    speed: 0,
  },
  uranus: {
    name: "uranus",
    src: "./../../assets/models/uranus/scene.gltf",
    scale: planetBaseScale / 130,
    pathScale: rocketAttrs.path.scale + rocketAttrs.path.scaleAddition * 22,
    pathFraction: 0.85,
    speed: 0,
  },
  neptune: {
    name: "neptune",
    src: "./../../assets/models/neptune/scene.gltf",
    scale: planetBaseScale / 140,
    pathScale: rocketAttrs.path.scale - rocketAttrs.path.scaleAddition * 22,
    pathFraction: 0.94,
    speed: 0,
  },
};

const pointAttrs = {
  name: "star",
  src: "./../../assets/models/star/scene.gltf",
  scale: 0.005,
  offset: {
    y: -0.02,
  }
};

const asteroidsAttrs = [
  {
    name: "asteroid",
    src: "./../../assets/models/asteroid/scene.gltf",
    scale: 0.16,
    offset: {
      y: 0.12,
    }
  },
  {
    name: "metal-asteroid",
    src: "./../../assets/models/metal-asteroid/scene.gltf",
    scale: 0.004,
    offset: {
      y: 0.13,
    }
  },
];

const gameAttrs = {
  pointFraction: 0.15,
  additionalPointFraction: 0.15,
  asteroidMux: 1.5,
};
