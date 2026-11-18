/**
 * The Tredrox hero object: an AI processor at work. A glossy chip package with
 * a glass lid sits on a circuit board; through the lid, a die of cores
 * computes, with the Tredrox T etched at its centre. Packets of light run
 * along the board's traces into the chip and results run back out.
 *
 * Interaction: the board leans toward the pointer and a small light follows
 * it across the traces; hovering the chip makes the cores work harder and
 * the data flow faster; a click sends a ripple across the board and a burst
 * of data in; scrolling lifts the lid. Loaded on demand; pauses off screen.
 *
 * Everything the glass lid shows is opaque (three.js refracts opaque objects
 * only); glows are transparent overlays outside the glass.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export type HeroSceneOptions = {
  canvas: HTMLCanvasElement;
  /** Element whose box the scene fills. */
  container: HTMLElement;
  /** Render one still frame, no idle motion or pointer response. */
  still: boolean;
  /** Lower resolution and cheaper glass for small screens. */
  lowPower: boolean;
  onFirstFrame?: () => void;
  /** Called when the pointer moves on or off the chip. */
  onHoverChange?: (hovering: boolean) => void;
  /**
   * Screen positions (px within the container) of the callout anchors, after
   * every rendered frame: [0] the top of the chip lid, [1] a via on a trace.
   */
  onAnchors?: (points: Array<{ x: number; y: number }>) => void;
};

export type HeroSceneHandle = {
  /** Pointer in normalised device coordinates (-1..1). */
  setPointer: (x: number, y: number, inside: boolean) => void;
  setScroll: (progress: number) => void;
  setActive: (active: boolean) => void;
  /** A click: ripple and a burst of data. */
  pulse: () => void;
  dispose: () => void;
};

const GROUND = "#05080d";
const BOARD = 10; // board size in world units
const TEX = 2048; // board texture size
const PKG = 2.4; // chip package size
const PINS = 11; // pins per side

function texture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function glowTexture(inner: string, outer: string): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.3, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return texture(canvas);
}

/* --------------------------------------------------------------------------
   Traces: from every pin outward, a short run, a fan-out bend, a long run.
   Coordinates are board-local (x, z); the chip sits at the origin.
   -------------------------------------------------------------------------- */

type Trace = { points: THREE.Vector3[]; lengths: number[]; total: number };

function buildTraces(): Trace[] {
  const traces: Trace[] = [];
  const half = PKG / 2;
  const sides = [
    { out: new THREE.Vector2(0, -1), lat: new THREE.Vector2(1, 0) },
    { out: new THREE.Vector2(1, 0), lat: new THREE.Vector2(0, 1) },
    { out: new THREE.Vector2(0, 1), lat: new THREE.Vector2(-1, 0) },
    { out: new THREE.Vector2(-1, 0), lat: new THREE.Vector2(0, -1) },
  ];
  // Deterministic jitter so every visitor sees the same board.
  let seed = 7;
  const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

  sides.forEach(({ out, lat }) => {
    for (let i = 0; i < PINS; i++) {
      const along = -0.95 + (i * 1.9) / (PINS - 1);
      const start = out.clone().multiplyScalar(half + 0.08).add(lat.clone().multiplyScalar(along));
      const run1 = 0.3 + (i % 3) * 0.22 + rand() * 0.15;
      const p1 = start.clone().add(out.clone().multiplyScalar(run1));
      const spread = along * (0.55 + rand() * 0.5);
      const p2 = p1.clone().add(out.clone().multiplyScalar(Math.abs(spread))).add(lat.clone().multiplyScalar(spread));
      const p3 = p2.clone().add(out.clone().multiplyScalar(1.4 + rand() * 1.6));
      const points = [start, p1, p2, p3].map((p) => new THREE.Vector3(p.x, 0.012, p.y));
      const lengths = [0];
      for (let k = 1; k < points.length; k++) lengths.push(lengths[k - 1] + points[k].distanceTo(points[k - 1]));
      traces.push({ points, lengths, total: lengths[lengths.length - 1] });
    }
  });
  return traces;
}

function pointOnTrace(trace: Trace, t: number, target: THREE.Vector3): THREE.Vector3 {
  const d = THREE.MathUtils.clamp(t, 0, 1) * trace.total;
  for (let k = 1; k < trace.points.length; k++) {
    if (d <= trace.lengths[k]) {
      const segT = (d - trace.lengths[k - 1]) / (trace.lengths[k] - trace.lengths[k - 1] || 1);
      return target.lerpVectors(trace.points[k - 1], trace.points[k], segT);
    }
  }
  return target.copy(trace.points[trace.points.length - 1]);
}

function boardTexture(traces: Trace[]): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = TEX;
  const ctx = canvas.getContext("2d")!;
  const px = (v: number) => ((v + BOARD / 2) / BOARD) * TEX;

  ctx.fillStyle = "#070c16";
  ctx.fillRect(0, 0, TEX, TEX);

  // Faint substrate grid.
  ctx.strokeStyle = "rgba(120,150,210,0.05)";
  ctx.lineWidth = 2;
  for (let p = 0; p <= TEX; p += TEX / 40) {
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, TEX);
    ctx.moveTo(0, p);
    ctx.lineTo(TEX, p);
    ctx.stroke();
  }

  // Traces and vias.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const trace of traces) {
    ctx.strokeStyle = "rgba(78,118,210,0.55)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    trace.points.forEach((p, k) => (k === 0 ? ctx.moveTo(px(p.x), px(p.z)) : ctx.lineTo(px(p.x), px(p.z))));
    ctx.stroke();
    const end = trace.points[trace.points.length - 1];
    ctx.fillStyle = "#070c16";
    ctx.strokeStyle = "rgba(110,150,235,0.7)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(px(end.x), px(end.z), 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Pad ring under the package.
  ctx.strokeStyle = "rgba(110,150,235,0.35)";
  ctx.lineWidth = 3;
  const pad = px(PKG / 2 + 0.16) - px(0);
  ctx.strokeRect(px(0) - pad, px(0) - pad, pad * 2, pad * 2);

  // Dissolve the board into the page ground.
  const fade = ctx.createRadialGradient(TEX / 2, TEX / 2, TEX * 0.2, TEX / 2, TEX / 2, TEX * 0.5);
  fade.addColorStop(0, "rgba(5,8,13,0)");
  fade.addColorStop(1, GROUND);
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, TEX, TEX);

  return texture(canvas);
}

/* --------------------------------------------------------------------------
   The die: a grid of cores that light as they compute, the T at the centre.
   -------------------------------------------------------------------------- */

const CORES = 10;

function createDie() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const heat = new Float32Array(CORES * CORES).map(() => Math.random() * 0.4);
  const tex = texture(canvas);

  const draw = (boost: number) => {
    ctx.fillStyle = "#081226";
    ctx.fillRect(0, 0, size, size);
    const pad = 34;
    const cell = (size - pad * 2) / CORES;
    for (let r = 0; r < CORES; r++) {
      for (let c = 0; c < CORES; c++) {
        // The T sits over the centre cores; leave them dark beneath it.
        const inT = (r >= 2 && r <= 3 && c >= 2 && c <= 7) || (r >= 4 && r <= 7 && c >= 4 && c <= 5);
        const h = inT ? 0.06 : Math.min(1, heat[r * CORES + c] * (0.8 + boost));
        ctx.fillStyle = `rgba(${Math.round(40 + 120 * h)},${Math.round(80 + 110 * h)},255,${0.18 + 0.75 * h})`;
        ctx.fillRect(pad + c * cell + 3, pad + r * cell + 3, cell - 6, cell - 6);
      }
    }
    // The etched T: a wide bar and a stem, like the Tredrox mark.
    const x0 = pad + 2 * cell;
    ctx.fillStyle = "rgba(225,236,255,1)";
    ctx.fillRect(x0 + 3, pad + 2 * cell + 3, cell * 6 - 6, cell * 2 - 6);
    ctx.fillStyle = "rgba(190,212,255,0.95)";
    ctx.fillRect(pad + 4 * cell + 3, pad + 4 * cell + 3, cell * 2 - 6, cell * 4 - 6);
    // Die border.
    ctx.strokeStyle = "rgba(150,185,255,0.8)";
    ctx.lineWidth = 4;
    ctx.strokeRect(pad - 12, pad - 12, size - pad * 2 + 24, size - pad * 2 + 24);
    tex.needsUpdate = true;
  };

  const step = (activity: number) => {
    for (let k = 0; k < 6 + activity * 14; k++) {
      const i = Math.floor(Math.random() * heat.length);
      heat[i] = Math.random() < 0.35 + activity * 0.3 ? 0.65 + Math.random() * 0.35 : Math.random() * 0.3;
    }
    for (let i = 0; i < heat.length; i++) heat[i] *= 0.94;
  };

  draw(0);
  return { tex, draw, step };
}

/* --------------------------------------------------------------------------
   Scene
   -------------------------------------------------------------------------- */

export function createHeroScene(options: HeroSceneOptions): HeroSceneHandle {
  const { canvas, container, still, lowPower, onFirstFrame, onHoverChange, onAnchors } = options;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !lowPower, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.transmissionResolutionScale = lowPower ? 0.5 : 1;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const cameraDir = new THREE.Vector3(0, 1, 1.12).normalize();

  // Everything on the board leans together.
  const rig = new THREE.Group();
  rig.rotation.y = -Math.PI / 4 + 0.08;
  scene.add(rig);

  // ---- Board ------------------------------------------------------------------
  const traces = buildTraces();
  const boardTex = boardTexture(traces);
  // The board shows its texture exactly (unlit, not tone-mapped), so its
  // faded edges match the page ground with no visible outline.
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(BOARD, BOARD),
    new THREE.MeshBasicMaterial({ map: boardTex, toneMapped: false }),
  );
  board.rotation.x = -Math.PI / 2;
  rig.add(board);

  // The pointer's light, as a soft pool lying on the traces.
  const pointerGlowTex = glowTexture("rgba(150,185,255,0.55)", "rgba(77,134,255,0.18)");
  const pointerGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 2.6),
    new THREE.MeshBasicMaterial({
      map: pointerGlowTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
      toneMapped: false,
    }),
  );
  pointerGlow.rotation.x = -Math.PI / 2;
  pointerGlow.position.y = 0.016;
  rig.add(pointerGlow);

  // ---- Chip package -----------------------------------------------------------
  const pkgHeight = 0.32;
  const pkg = new THREE.Mesh(
    new RoundedBoxGeometry(PKG, pkgHeight, PKG, lowPower ? 2 : 4, 0.08),
    new THREE.MeshPhysicalMaterial({ color: "#0c1424", roughness: 0.32, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.12 }),
  );
  pkg.position.y = pkgHeight / 2;
  rig.add(pkg);

  // Pins, instanced: a row along every edge.
  const pinGeo = new THREE.BoxGeometry(0.07, 0.05, 0.2);
  const pins = new THREE.InstancedMesh(
    pinGeo,
    new THREE.MeshStandardMaterial({ color: "#9fb4d8", metalness: 0.9, roughness: 0.25 }),
    PINS * 4,
  );
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  let pinIndex = 0;
  for (let s = 0; s < 4; s++) {
    const angle = (s * Math.PI) / 2;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    for (let i = 0; i < PINS; i++) {
      const along = -0.95 + (i * 1.9) / (PINS - 1);
      const local = new THREE.Vector3(along, 0.03, -(PKG / 2 + 0.06)).applyQuaternion(q);
      m.compose(local, q, new THREE.Vector3(1, 1, 1));
      pins.setMatrixAt(pinIndex++, m);
    }
  }
  rig.add(pins);

  // Die (opaque, so the lid refracts it).
  const die = createDie();
  const dieMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(PKG * 0.72, PKG * 0.72),
    new THREE.MeshBasicMaterial({ map: die.tex, toneMapped: false }),
  );
  dieMesh.rotation.x = -Math.PI / 2;
  dieMesh.position.y = pkgHeight + 0.004;
  rig.add(dieMesh);

  // Glass lid over the die.
  const lidHeight = 0.16;
  const lid = new THREE.Mesh(
    new RoundedBoxGeometry(PKG * 0.84, lidHeight, PKG * 0.84, lowPower ? 2 : 4, 0.06),
    new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.05,
      transmission: 1,
      thickness: 0.6,
      ior: 1.5,
      attenuationColor: new THREE.Color("#2f6bff"),
      attenuationDistance: 1.6,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.2,
      dispersion: lowPower ? 0 : 0.18,
    }),
  );
  const lidRest = pkgHeight + lidHeight / 2 + 0.02;
  lid.position.y = lidRest;
  rig.add(lid);

  // Glow over the die, seen through and above the lid.
  const glowTex = glowTexture("rgba(170,198,255,0.9)", "rgba(43,99,245,0.35)");
  const dieGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.45, toneMapped: false }),
  );
  dieGlow.scale.set(3.6, 3.6, 1);
  dieGlow.position.y = 0.9;
  rig.add(dieGlow);

  // ---- Data packets -----------------------------------------------------------
  const blueTex = glowTexture("rgba(215,228,255,1)", "rgba(77,134,255,0.6)");
  const mintTex = glowTexture("rgba(220,255,240,1)", "rgba(94,242,192,0.55)");
  type Packet = { sprite: THREE.Sprite; trace: Trace; offset: number; dur: number; inbound: boolean };
  const packets: Packet[] = [];
  const packetCount = lowPower ? 14 : 24;
  for (let i = 0; i < packetCount; i++) {
    const inbound = i % 5 !== 0;
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: inbound ? blueTex : mintTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        opacity: 0,
      }),
    );
    sprite.scale.set(0.34, 0.34, 1);
    rig.add(sprite);
    packets.push({
      sprite,
      trace: traces[(i * 7) % traces.length],
      offset: Math.random(),
      dur: 1.8 + Math.random() * 1.6,
      inbound,
    });
  }

  // Click ripple across the board.
  const ripple = new THREE.Mesh(
    new THREE.RingGeometry(0.96, 1, 96),
    new THREE.MeshBasicMaterial({ color: "#6f9dff", transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
  );
  ripple.rotation.x = -Math.PI / 2;
  ripple.position.y = 0.02;
  rig.add(ripple);

  // ---- Lights -----------------------------------------------------------------
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(-4, 8, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(new THREE.Color("#4d86ff"), 2.2);
  rim.position.set(5, 3, -6);
  scene.add(rim);
  const coreLight = new THREE.PointLight(new THREE.Color("#6f9dff"), 5, 6, 1.6);
  coreLight.position.set(0, 1.2, 0);
  rig.add(coreLight);
  // The pointer's own light, travelling over the traces.
  const pointerLight = new THREE.PointLight(new THREE.Color("#8fb2ff"), 0, 3.2, 1.8);
  pointerLight.position.set(0, 0.7, 0);
  rig.add(pointerLight);

  // ---- State ------------------------------------------------------------------
  let frame = 0;
  let running = false;
  let active = true;
  let firstFrameSent = false;
  let disposed = false;
  let hovering = false;
  let scrollProgress = 0;
  let rippleStart = -10;
  let burstUntil = -10;
  let dieClock = 0;

  const pointer = { x: 0, y: 0, inside: false };
  const smooth = { x: 0, y: 0, activity: 0, lift: 0, light: 0 };
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const boardPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const timer = new THREE.Timer();

  // Callout anchors, in board space: the far corner of the lid (reads as the
  // top of the chip) and the first bend of a trace on the near-left side,
  // close to the pins so its label stays clear of the page below.
  const viaTrace = traces[2 * PINS + 3];
  const anchorsLocal = [
    new THREE.Vector3(-PKG * 0.4, pkgHeight + lidHeight + 0.04, -PKG * 0.4),
    viaTrace.points[2].clone(),
  ];
  const projected = anchorsLocal.map(() => new THREE.Vector3());
  let viewW = 1;
  let viewH = 1;

  function reportAnchors() {
    if (!onAnchors) return;
    rig.updateMatrixWorld();
    const points = anchorsLocal.map((local, i) => {
      const p = projected[i].copy(local);
      if (i === 0) p.y = lid.position.y + lidHeight / 2 + 0.02;
      p.applyMatrix4(rig.matrixWorld).project(camera);
      return { x: ((p.x + 1) / 2) * viewW, y: ((1 - p.y) / 2) * viewH };
    });
    onAnchors(points);
  }

  function placeCamera(width: number, height: number) {
    camera.aspect = width / height;
    const shift = parseFloat(getComputedStyle(container).getPropertyValue("--object-shift")) || 0;
    // Desktop: size the chip by the box's width; phones: keep it in frame.
    const distance = shift > 0 ? Math.max(12.5 / camera.aspect, 9.5) : camera.aspect < 1 ? 10 / Math.max(camera.aspect, 0.66) : 10;
    camera.position.copy(cameraDir).multiplyScalar(distance);
    camera.lookAt(0, 0.2, 0);
    if (shift > 0) camera.setViewOffset(width, height, -shift * width, 0, width, height);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 1.75));
    renderer.setSize(width, height, false);
    viewW = width;
    viewH = height;
    placeCamera(width, height);
    if (!running) render(0);
  }

  function updateHover() {
    if (!pointer.inside) {
      if (hovering) {
        hovering = false;
        onHoverChange?.(false);
      }
      return;
    }
    ndc.set(pointer.x, -pointer.y);
    raycaster.setFromCamera(ndc, camera);
    const over = raycaster.intersectObjects([pkg, lid], false).length > 0;
    if (over !== hovering) {
      hovering = over;
      onHoverChange?.(over);
    }
    // Where the pointer meets the board, in board space, for the pointer light.
    if (raycaster.ray.intersectPlane(boardPlane, hit)) {
      rig.worldToLocal(hit);
      pointerLight.position.x += (hit.x - pointerLight.position.x) * 0.25;
      pointerLight.position.z += (hit.z - pointerLight.position.z) * 0.25;
    }
  }

  function render(delta: number) {
    const t = timer.getElapsed();
    const follow = 1 - Math.pow(0.002, delta);

    if (!still) {
      smooth.x += (pointer.x - smooth.x) * follow;
      smooth.y += (pointer.y - smooth.y) * follow;
      updateHover();

      const burst = t < burstUntil ? 1 : 0;
      const targetActivity = Math.max(hovering ? 1 : 0, burst);
      smooth.activity += (targetActivity - smooth.activity) * (1 - Math.pow(0.05, delta));
      smooth.lift += (scrollProgress - smooth.lift) * (1 - Math.pow(0.01, delta));
      smooth.light += ((pointer.inside ? 1 : 0) - smooth.light) * (1 - Math.pow(0.02, delta));

      // The board leans toward the pointer and breathes a little on its own.
      rig.rotation.x = smooth.y * 0.07 + Math.sin(t * 0.4) * 0.012;
      rig.rotation.z = -smooth.x * 0.05;
      rig.rotation.y = -Math.PI / 4 + 0.08 + smooth.x * 0.12 + Math.sin(t * 0.18) * 0.03;

      // Scroll lifts the lid off the die.
      lid.position.y = lidRest + smooth.lift * 0.9;
      lid.rotation.x = smooth.lift * -0.12;

      pointerLight.intensity = smooth.light * 3.5;
      pointerGlow.position.x = pointerLight.position.x;
      pointerGlow.position.z = pointerLight.position.z;
      (pointerGlow.material as THREE.MeshBasicMaterial).opacity = smooth.light * 0.9;
      coreLight.intensity = 4 + smooth.activity * 5 + Math.sin(t * 1.6) * 0.4;
      (dieGlow.material as THREE.SpriteMaterial).opacity = 0.35 + smooth.activity * 0.35 + Math.sin(t * 1.6) * 0.04;

      // Cores compute: faster and brighter while the chip is busy.
      dieClock += delta;
      if (dieClock > 0.11 - smooth.activity * 0.05) {
        dieClock = 0;
        die.step(smooth.activity);
        die.draw(smooth.activity);
      }

      // Packets run along their traces.
      const speed = 1 + smooth.activity * 1.4;
      for (const p of packets) {
        p.offset = (p.offset + (delta * speed) / p.dur) % 1;
        const along = p.inbound ? 1 - p.offset : p.offset;
        pointOnTrace(p.trace, along, tmp);
        p.sprite.position.set(tmp.x, 0.06, tmp.z);
        const edge = Math.min(p.offset / 0.12, (1 - p.offset) / 0.12, 1);
        (p.sprite.material as THREE.SpriteMaterial).opacity = edge * (0.75 + smooth.activity * 0.25);
      }

      // Ripple from a click.
      const age = t - rippleStart;
      const rippleMat = ripple.material as THREE.MeshBasicMaterial;
      if (age >= 0 && age < 1.4) {
        const k = age / 1.4;
        const s = 1.4 + k * 4.2;
        ripple.scale.set(s, s, s);
        rippleMat.opacity = (1 - k) * 0.7;
      } else {
        rippleMat.opacity = 0;
      }
    } else {
      // A still, representative frame.
      for (const p of packets) {
        pointOnTrace(p.trace, p.inbound ? 1 - p.offset : p.offset, tmp);
        p.sprite.position.set(tmp.x, 0.06, tmp.z);
        (p.sprite.material as THREE.SpriteMaterial).opacity = 0.8;
      }
    }

    renderer.render(scene, camera);
    reportAnchors();
    if (!firstFrameSent) {
      firstFrameSent = true;
      onFirstFrame?.();
    }
  }

  function loop(timestamp: number) {
    if (!running || disposed) return;
    timer.update(timestamp);
    render(Math.min(timer.getDelta(), 0.05));
    frame = requestAnimationFrame(loop);
  }

  function start() {
    if (still || running || disposed) return;
    running = true;
    timer.reset();
    frame = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
  }

  function syncRunning() {
    if (active && document.visibilityState === "visible") start();
    else stop();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  document.addEventListener("visibilitychange", syncRunning);
  resize();
  render(0);
  syncRunning();

  return {
    setPointer(x, y, inside) {
      pointer.x = x;
      pointer.y = y;
      pointer.inside = inside;
    },
    setScroll(progress) {
      scrollProgress = Math.min(1, Math.max(0, progress));
    },
    setActive(value) {
      active = value;
      syncRunning();
    },
    pulse() {
      if (still) return;
      const t = timer.getElapsed();
      rippleStart = t;
      burstUntil = t + 1.6;
    },
    dispose() {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", syncRunning);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Sprite || object instanceof THREE.InstancedMesh) {
          object.geometry?.dispose();
          const material = object.material as THREE.Material | THREE.Material[];
          (Array.isArray(material) ? material : [material]).forEach((mat) => mat.dispose());
        }
      });
      [boardTex, pointerGlowTex, die.tex, glowTex, blueTex, mintTex, envTexture].forEach((tx) => tx.dispose());
      timer.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
