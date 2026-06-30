import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PROJECTS = [
  {
    id: 'mega-warm',
    name: 'МЕГА Теплый Стан',
    meta: 'Москва · 140 000 м² · с 2022 г.',
    desc: 'Торговый комплекс: обслуживание электрических и механических систем, подъёмных механизмов.',
    type: 'mega',
    accent: '#1a6bb5',
  },
  {
    id: 'mega-white',
    name: 'МЕГА Белая Дача',
    meta: 'Московская область · 300 000 м²',
    desc: 'Крупнейший объект сети: постоянное присутствие технического персонала на площадке.',
    type: 'mega',
    accent: '#0d4f8b',
    scale: 1.25,
  },
  {
    id: 'vkusvill',
    name: 'ВкусВилл',
    meta: 'Москва и МО · 200+ магазинов',
    desc: 'Сеть магазинов шаговой доступности — комплексное сервисное обслуживание.',
    type: 'retail',
    accent: '#2d8a4e',
  },
  {
    id: 'rosatom',
    name: 'РОСАТОМ',
    meta: 'Саратовская область · с 2025 г.',
    desc: 'Промышленный объект: сервисное обслуживание холодильного оборудования.',
    type: 'industrial',
    accent: '#3a7ca5',
  },
  {
    id: 'kuibyshev',
    name: 'Завод «Куйбышев Азот»',
    meta: 'Тольятти · 300 000 м²',
    desc: 'Химическое производство: обслуживание холодильных систем технологического процесса.',
    type: 'factory',
    accent: '#6b5b95',
  },
  {
    id: 'sibur',
    name: 'СИБУР',
    meta: 'Самарская область · 90 000 м²',
    desc: 'Нефтехимический комплекс: сервис холодильного оборудования.',
    type: 'factory',
    accent: '#c45c26',
  },
  {
    id: 'mcdonalds',
    name: 'Макдональдс',
    meta: 'Москва и МО · ~60 ресторанов',
    desc: 'Сеть ресторанов быстрого питания — комплексное обслуживание и ремонт.',
    type: 'restaurants',
    accent: '#d4a017',
  },
  {
    id: 'hollywood',
    name: 'ТРЦ «Голливуд»',
    meta: 'Санкт-Петербург',
    desc: 'Крупнейший торговый центр Санкт-Петербурга — полный цикл facility-услуг.',
    type: 'cinema',
    accent: '#b8860b',
  },
];

const listEl = document.getElementById('viewer3dList');
const canvas = document.getElementById('viewer3dCanvas');
const canvasWrap = document.getElementById('viewer3dCanvasWrap');
const loaderEl = document.getElementById('viewer3dLoader');
const titleEl = document.getElementById('viewer3dTitle');
const metaEl = document.getElementById('viewer3dMeta');
const descEl = document.getElementById('viewer3dDesc');
const section = document.getElementById('viewer3d');

let renderer;
let scene;
let camera;
let controls;
let modelGroup;
let animationId;
let isRunning = false;
let activeId = null;
let clock = new THREE.Clock();

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: opts.metalness ?? 0.15,
    roughness: opts.roughness ?? 0.65,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
  });
}

function box(w, h, d, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addGround(group, size = 30) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    mat(0x8aab7a, { roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  const grid = new THREE.GridHelper(size, 20, 0x4a6a8a, 0x6a8aaa);
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  grid.position.y = 0.02;
  group.add(grid);
}

function buildMega(accent, scale = 1) {
  const g = new THREE.Group();
  const s = scale;

  const main = box(14 * s, 4 * s, 9 * s, mat(0xdde4ee));
  main.position.y = 2 * s;
  g.add(main);

  const roof = box(14.4 * s, 0.4 * s, 9.4 * s, mat(accent, { metalness: 0.4 }));
  roof.position.y = 4.2 * s;
  g.add(roof);

  const glass = box(10 * s, 2.5 * s, 0.2 * s, mat(0x88ccee, { transparent: true, opacity: 0.55, metalness: 0.8, roughness: 0.1 }));
  glass.position.set(0, 1.8 * s, 4.6 * s);
  g.add(glass);

  const entrance = box(3 * s, 2.8 * s, 1.5 * s, mat(0xffffff));
  entrance.position.set(0, 1.4 * s, 5.2 * s);
  g.add(entrance);

  const parking = box(18 * s, 0.15 * s, 8 * s, mat(0x555555, { roughness: 0.95 }));
  parking.position.set(0, 0.08, -8 * s);
  g.add(parking);

  for (let i = -2; i <= 2; i++) {
    const car = box(1.2 * s, 0.6 * s, 2 * s, mat(i % 2 === 0 ? 0xcc3333 : 0x333333, { metalness: 0.5 }));
    car.position.set(i * 2.5 * s, 0.45 * s, -8 * s);
    g.add(car);
  }

  const sign = box(5 * s, 1 * s, 0.3 * s, mat(accent, { emissive: accent, emissiveIntensity: 0.3 }));
  sign.position.set(0, 5 * s, 4.5 * s);
  g.add(sign);

  addGround(g, 40 * s);
  return g;
}

function buildRetail(accent) {
  const g = new THREE.Group();

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const store = new THREE.Group();
      const body = box(2.2, 1.8, 2.2, mat(0xf5f5f5));
      body.position.y = 0.9;
      store.add(body);

      const roofPart = box(2.4, 0.2, 2.4, mat(accent));
      roofPart.position.y = 1.9;
      store.add(roofPart);

      const window = box(1.4, 0.9, 0.1, mat(0x88ccee, { transparent: true, opacity: 0.6 }));
      window.position.set(0, 0.9, 1.11);
      store.add(window);

      store.position.set((col - 1.5) * 3.2, 0, (row - 1) * 3.5);
      g.add(store);
    }
  }

  const road = box(14, 0.1, 2, mat(0x444444));
  road.position.set(0, 0.05, 6);
  g.add(road);

  addGround(g, 28);
  return g;
}

function buildIndustrial(accent) {
  const g = new THREE.Group();

  const main = box(10, 3.5, 7, mat(0xc8d0d8));
  main.position.y = 1.75;
  g.add(main);

  const tower1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 5, 16), mat(0xaaaaaa));
  tower1.position.set(-4, 2.5, 2);
  g.add(tower1);

  const tower2 = tower1.clone();
  tower2.position.set(4, 2.5, 2);
  g.add(tower2);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(accent, { metalness: 0.3 }));
  dome.position.set(0, 3.5, -1);
  g.add(dome);

  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 8, 8), mat(0x888888, { metalness: 0.6 }));
  pipe.rotation.z = Math.PI / 2;
  pipe.position.set(0, 4, 0);
  g.add(pipe);

  const unit = box(2, 1.5, 2, mat(0x6699bb));
  unit.position.set(5, 0.75, -2);
  g.add(unit);

  addGround(g, 30);
  return g;
}

function buildFactory(accent) {
  const g = new THREE.Group();

  const hall = box(12, 4, 8, mat(0xb0b8c0));
  hall.position.y = 2;
  g.add(hall);

  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 6, 12), mat(0x777777));
  chimney.position.set(-4, 5, 2);
  g.add(chimney);

  const chimney2 = chimney.clone();
  chimney2.position.set(3, 4.5, -2);
  g.add(chimney2);

  for (let i = 0; i < 3; i++) {
    const cooler = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1, 2.5, 12), mat(accent, { metalness: 0.35 }));
    cooler.position.set(-3 + i * 3, 1.25, 5);
    g.add(cooler);

    const fan = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.08, 8, 20), mat(0x333333, { metalness: 0.7 }));
    fan.rotation.x = Math.PI / 2;
    fan.position.set(-3 + i * 3, 2.6, 5);
    fan.userData.spin = true;
    g.add(fan);
  }

  const tank = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 12), mat(0xdddddd, { metalness: 0.5 }));
  tank.position.set(6, 1.5, 0);
  g.add(tank);

  addGround(g, 32);
  return g;
}

function buildRestaurants(accent) {
  const g = new THREE.Group();
  const positions = [
    [-5, -3], [0, -4], [5, -2], [-4, 2], [3, 3], [-1, 5],
  ];

  positions.forEach(([x, z], i) => {
    const r = new THREE.Group();
    const base = box(2, 1.2, 2, mat(0xf0f0f0));
    base.position.y = 0.6;
    r.add(base);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.2, 4), mat(i % 2 === 0 ? accent : 0xcc2222));
    roof.position.y = 1.8;
    roof.rotation.y = Math.PI / 4;
    r.add(roof);

    const sign = box(1.2, 0.3, 0.1, mat(accent, { emissive: accent, emissiveIntensity: 0.4 }));
    sign.position.set(0, 1.2, 1.05);
    r.add(sign);

    r.position.set(x, 0, z);
    g.add(r);
  });

  addGround(g, 26);
  return g;
}

function buildCinema(accent) {
  const g = new THREE.Group();

  const base = box(8, 6, 6, mat(0x2a2a3a));
  base.position.y = 3;
  g.add(base);

  const marquee = box(7, 1.2, 0.5, mat(accent, { emissive: accent, emissiveIntensity: 0.6 }));
  marquee.position.set(0, 2, 3.3);
  g.add(marquee);

  for (let i = -2; i <= 2; i++) {
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), mat(0xffffaa, { emissive: 0xffffaa, emissiveIntensity: 1 }));
    bulb.position.set(i * 1.2, 2, 3.55);
    bulb.userData.pulse = true;
    bulb.userData.phase = i;
    g.add(bulb);
  }

  const tower = box(3, 10, 3, mat(0x1a1a2e));
  tower.position.set(5, 5, -1);
  g.add(tower);

  const spire = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3, 4), mat(accent, { metalness: 0.5 }));
  spire.position.set(5, 11.5, -1);
  g.add(spire);

  const annex = box(5, 3, 4, mat(0x3a3a4a));
  annex.position.set(-5, 1.5, 0);
  g.add(annex);

  addGround(g, 30);
  return g;
}

function buildModel(project) {
  const scale = project.scale ?? 1;
  switch (project.type) {
    case 'mega': return buildMega(project.accent, scale);
    case 'retail': return buildRetail(project.accent);
    case 'industrial': return buildIndustrial(project.accent);
    case 'factory': return buildFactory(project.accent);
    case 'restaurants': return buildRestaurants(project.accent);
    case 'cinema': return buildCinema(project.accent);
    default: return buildMega(project.accent);
  }
}

function updateInfo(project) {
  titleEl.textContent = project.name;
  metaEl.textContent = project.meta;
  descEl.textContent = project.desc;
  titleEl.style.color = project.accent;
}

function setActiveButton(id) {
  listEl.querySelectorAll('.viewer3d__item').forEach((btn) => {
    btn.classList.toggle('viewer3d__item--active', btn.dataset.id === id);
  });
}

function loadProject(project) {
  if (!scene) return;
  activeId = project.id;
  setActiveButton(project.id);
  updateInfo(project);

  if (modelGroup) {
    scene.remove(modelGroup);
    modelGroup.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    });
  }

  modelGroup = buildModel(project);
  scene.add(modelGroup);

  const box3 = new THREE.Box3().setFromObject(modelGroup);
  const center = box3.getCenter(new THREE.Vector3());
  const size = box3.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  modelGroup.position.sub(center);
  modelGroup.position.y += size.y / 2 - center.y;

  camera.position.set(maxDim * 0.9, maxDim * 0.55, maxDim * 0.9);
  controls.target.set(0, size.y * 0.3, 0);
  controls.update();
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe8eef5);
  scene.fog = new THREE.Fog(0xe8eef5, 30, 80);

  const w = canvasWrap.clientWidth;
  const h = canvasWrap.clientHeight;

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
  camera.position.set(18, 12, 18);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minDistance = 8;
  controls.maxDistance = 50;

  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff5e6, 1.1);
  sun.position.set(15, 25, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 60;
  sun.shadow.camera.left = -20;
  sun.shadow.camera.right = 20;
  sun.shadow.camera.top = 20;
  sun.shadow.camera.bottom = -20;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0xb8d4f0, 0.35);
  fill.position.set(-10, 8, -8);
  scene.add(fill);
}

function animate() {
  animationId = requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  if (modelGroup) {
    modelGroup.traverse((child) => {
      if (child.userData.spin) child.rotation.z += 0.03;
      if (child.userData.pulse) {
        const s = 1 + Math.sin(t * 3 + child.userData.phase) * 0.15;
        child.scale.setScalar(s);
      }
    });
  }

  controls.update();
  renderer.render(scene, camera);
}

function startViewer() {
  if (isRunning) return;
  isRunning = true;
  loaderEl.classList.add('viewer3d__loader--hide');

  initScene();
  loadProject(PROJECTS[0]);
  animate();

  window.addEventListener('resize', onResize);
}

function onResize() {
  if (!renderer) return;
  const w = canvasWrap.clientWidth;
  const h = canvasWrap.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function renderList() {
  PROJECTS.forEach((project) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'viewer3d__item';
    btn.dataset.id = project.id;
    btn.innerHTML = `
      <span class="viewer3d__item-dot" style="background:${project.accent}"></span>
      <span class="viewer3d__item-text">
        <strong>${project.name}</strong>
        <small>${project.meta}</small>
      </span>
    `;
    btn.addEventListener('click', () => {
      if (!isRunning) startViewer();
      loadProject(project);
    });
    listEl.appendChild(btn);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isRunning) {
        startViewer();
        observer.disconnect();
      }
    });
  },
  { rootMargin: '100px', threshold: 0.1 }
);

renderList();
updateInfo(PROJECTS[0]);
observer.observe(section);

section.addEventListener('click', () => {
  if (!isRunning) startViewer();
});
