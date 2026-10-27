// Robot 3D en estilo plano técnico: brazo articulado sobre una base swerve de FRC.
// Se carga solo cuando el elemento está cerca de la pantalla y se pausa fuera de ella.

const C = {
  neon: 0x3df5e1,
  amber: 0xffb547,
  hot: 0xff6b66,
  frame: 0xc4dadd,
  deep: 0x00181c,
};

export function initRobot(root) {
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return; // se queda el SVG de respaldo

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        build(root).catch(() => {});
      }
    },
    { rootMargin: '200px' },
  );
  io.observe(root);
}

async function build(root) {
  const THREE = await import('three');
  const { LineSegments2 } = await import('three/examples/jsm/lines/LineSegments2.js');
  const { LineSegmentsGeometry } = await import('three/examples/jsm/lines/LineSegmentsGeometry.js');
  const { LineMaterial } = await import('three/examples/jsm/lines/LineMaterial.js');

  const canvas = root.querySelector('canvas');
  const overlay = root.querySelector('[data-overlay]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);

  // ---------- materiales ----------
  const lineMats = [];
  const line = (color, width, opacity = 1) => {
    const m = new LineMaterial({ color, linewidth: width, transparent: opacity < 1, opacity, worldUnits: false });
    lineMats.push(m);
    return m;
  };
  const fill = new THREE.MeshBasicMaterial({
    color: C.deep,
    transparent: true,
    opacity: 0.92,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });

  const M = {
    arm: line(C.neon, 1.7),
    joint: line(C.neon, 2),
    module: line(C.amber, 1.5),
    bumper: line(C.hot, 1.7),
    piece: line(C.hot, 1.6),
    frame: line(C.frame, 1.3, 0.8),
    wheel: line(C.neon, 1.4, 0.9),
    faint: line(C.frame, 1, 0.35),
    dim: line(C.frame, 1, 0.55),
  };

  // Pieza: relleno oscuro + aristas, para que se lea como dibujo de línea oculta.
  const part = (geo, mat, { solid = true, threshold = 15 } = {}) => {
    const g = new THREE.Group();
    if (solid) g.add(new THREE.Mesh(geo, fill));
    const edges = new THREE.EdgesGeometry(geo, threshold);
    g.add(new LineSegments2(new LineSegmentsGeometry().fromEdgesGeometry(edges), mat));
    return g;
  };
  const segs = (points, mat) => {
    const geo = new LineSegmentsGeometry().setPositions(points.flat());
    return new LineSegments2(geo, mat);
  };
  const at = (obj, x, y, z) => (obj.position.set(x, y, z), obj);

  // ---------- piso ----------
  const grid = new THREE.GridHelper(4, 20, C.neon, C.neon);
  grid.material.transparent = true;
  grid.material.opacity = 0.07;
  scene.add(grid);

  const robot = new THREE.Group();
  scene.add(robot);

  // ---------- chasis ----------
  const W = 1.0;
  const railH = 0.07;
  const railT = 0.05;
  const railY = 0.15;

  const chassis = new THREE.Group();
  robot.add(chassis);
  for (const s of [-1, 1]) {
    chassis.add(at(part(new THREE.BoxGeometry(W, railH, railT), M.frame), 0, railY, s * (W / 2 - railT / 2)));
    chassis.add(at(part(new THREE.BoxGeometry(railT, railH, W - 2 * railT), M.frame), s * (W / 2 - railT / 2), railY, 0));
  }
  chassis.add(at(part(new THREE.BoxGeometry(W - 2 * railT, railH * 0.8, railT), M.frame), 0, railY, 0));
  chassis.add(at(part(new THREE.BoxGeometry(W - 0.06, 0.01, W - 0.06), M.faint, { solid: false }), 0, railY - railH / 2, 0));

  // Bumpers (en FRC van en rojo o azul)
  const bT = 0.08;
  const bH = 0.12;
  const bY = 0.12;
  for (const s of [-1, 1]) {
    chassis.add(at(part(new THREE.BoxGeometry(W + 2 * bT, bH, bT), M.bumper, { solid: false }), 0, bY, s * (W / 2 + bT / 2)));
    chassis.add(at(part(new THREE.BoxGeometry(bT, bH, W), M.bumper, { solid: false }), s * (W / 2 + bT / 2), bY, 0));
  }

  // ---------- módulos swerve ----------
  const modules = [];
  const inset = W / 2 - 0.11;
  for (const [sx, sz] of [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ]) {
    const mg = at(new THREE.Group(), sx * inset, 0, sz * inset);
    chassis.add(mg);
    const plateY = railY + railH / 2 + 0.008;
    mg.add(at(part(new THREE.BoxGeometry(0.17, 0.016, 0.17), M.module, { solid: false }), 0, plateY, 0));
    mg.add(at(part(new THREE.CylinderGeometry(0.03, 0.03, 0.1, 14), M.module), 0.045, plateY + 0.058, 0));
    mg.add(at(part(new THREE.CylinderGeometry(0.03, 0.03, 0.1, 14), M.module), -0.045, plateY + 0.058, 0));

    const az = new THREE.Group();
    mg.add(az);
    az.add(at(part(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 24), M.module, { solid: false }), 0, plateY - 0.02, 0));
    for (const fx of [-1, 1]) az.add(at(part(new THREE.BoxGeometry(0.012, 0.1, 0.075), M.module), fx * 0.036, 0.085, 0));

    const axle = at(new THREE.Group(), 0, 0.056, 0);
    axle.rotation.z = Math.PI / 2;
    az.add(axle);
    const wheel = part(new THREE.CylinderGeometry(0.056, 0.056, 0.045, 16), M.wheel, { threshold: 10 });
    axle.add(wheel);
    modules.push({ az, wheel, group: mg });
  }

  // ---------- brazo ----------
  const turret = at(new THREE.Group(), 0, railY + railH / 2, 0);
  robot.add(turret);
  turret.add(at(part(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 28), M.arm), 0, 0.025, 0));
  for (const s of [-1, 1]) turret.add(at(part(new THREE.BoxGeometry(0.12, 0.36, 0.02), M.arm), 0, 0.23, s * 0.07));

  const jointGeo = (r, len) => {
    const g = new THREE.CylinderGeometry(r, r, len, 22);
    g.rotateX(Math.PI / 2);
    return g;
  };

  const shoulder = at(new THREE.Group(), 0, 0.4, 0);
  turret.add(shoulder);
  shoulder.add(part(jointGeo(0.055, 0.18), M.joint));

  const upper = new THREE.Group();
  shoulder.add(upper);
  upper.add(at(part(new THREE.BoxGeometry(0.06, 0.55, 0.06), M.arm), 0, 0.275, 0));

  const elbow = at(new THREE.Group(), 0, 0.55, 0);
  upper.add(elbow);
  elbow.add(part(jointGeo(0.045, 0.13), M.joint));

  const fore = new THREE.Group();
  elbow.add(fore);
  fore.add(at(part(new THREE.BoxGeometry(0.05, 0.45, 0.05), M.arm), 0, 0.225, 0));

  const wristPivot = at(new THREE.Group(), 0, 0.45, 0);
  fore.add(wristPivot);
  wristPivot.add(part(jointGeo(0.035, 0.1), M.joint));

  const wrist = new THREE.Group();
  wristPivot.add(wrist);
  wrist.add(at(part(new THREE.BoxGeometry(0.14, 0.03, 0.1), M.arm), 0, 0.035, 0));
  const fingers = [-1, 1].map((s) => {
    const f = at(part(new THREE.BoxGeometry(0.018, 0.12, 0.07), M.arm), s * 0.07, 0.11, 0);
    wrist.add(f);
    return f;
  });
  const piece = at(part(new THREE.IcosahedronGeometry(0.052, 1), M.piece, { threshold: 1 }), 0, 0.12, 0);
  wrist.add(piece);

  // ---------- cota de plano ----------
  const dz = W / 2 + bT + 0.16;
  const half = W / 2 + bT;
  const dim = segs(
    [
      [-half, 0.005, dz, half, 0.005, dz],
      [-half, 0.005, dz - 0.05, -half, 0.005, dz + 0.04],
      [half, 0.005, dz - 0.05, half, 0.005, dz + 0.04],
      [-half, 0.005, W / 2 + bT, -half, 0.005, dz - 0.05],
      [half, 0.005, W / 2 + bT, half, 0.005, dz - 0.05],
    ],
    M.dim,
  );
  robot.add(dim);
  const dimAnchor = at(new THREE.Object3D(), 0, 0.005, dz);
  robot.add(dimAnchor);

  // ---------- etiquetas ----------
  const label = (anchor, dx, dy, color) => {
    const el = document.createElement('span');
    el.style.cssText = `position:absolute;left:0;top:0;white-space:nowrap;color:${color}`;
    overlay.appendChild(el);
    return { el, anchor, dx, dy };
  };
  const css = { neon: '#3df5e1', amber: '#ffb547', hot: '#ff6b66', muted: '#a9bfc1' };
  const L = {
    j1: label(shoulder, -86, -8, css.neon),
    j2: label(elbow, -88, -8, css.neon),
    j3: label(wristPivot, 16, -36, css.neon),
    grip: label(piece, 20, 16, css.hot),
    az: label(modules[0].group, 14, 18, css.amber),
    dim: label(dimAnchor, -38, 10, css.muted),
  };
  L.dim.el.textContent = 'BASE SWERVE · 28 in';

  // ---------- tamaño ----------
  const size = { w: 1, h: 1 };
  const resize = () => {
    const r = root.getBoundingClientRect();
    size.w = Math.max(1, r.width);
    size.h = Math.max(1, r.height);
    renderer.setSize(size.w, size.h, false);
    camera.aspect = size.w / size.h;
    camera.updateProjectionMatrix();
    for (const m of lineMats) m.resolution.set(size.w, size.h);
  };
  new ResizeObserver(() => {
    resize();
    if (reduce) frame(1.4);
  }).observe(root);
  resize();

  // ---------- animación ----------
  const v = new THREE.Vector3();
  const deg = THREE.MathUtils.degToRad;
  const fmt = (n) => (n >= 0 ? '+' : '') + n.toFixed(1) + '°';

  function frame(t) {
    const j1 = 28 + 22 * Math.sin(t * 0.55);
    const j2 = 72 + 30 * Math.sin(t * 0.55 + 1.1);
    const j3 = 112 - j1 - j2 + 10 * Math.sin(t * 0.9);
    const yaw = 32 * Math.sin(t * 0.3);
    const azDeg = 45 + 50 * Math.sin(t * 0.22);
    const grip = 0.5 + 0.5 * Math.sin(t * 1.1);

    turret.rotation.y = deg(yaw);
    upper.rotation.z = -deg(j1);
    fore.rotation.z = -deg(j2);
    wrist.rotation.z = -deg(j3);
    const gap = 0.066 + 0.024 * grip;
    fingers[0].position.x = -gap;
    fingers[1].position.x = gap;
    piece.rotation.y = t * 0.4;

    for (const m of modules) {
      m.az.rotation.y = deg(azDeg);
      m.wheel.rotation.y -= 0.06 * Math.cos(t * 0.22);
    }

    const a = 0.72 + 0.28 * Math.sin(t * 0.12);
    const r = 3.7;
    camera.position.set(r * Math.sin(a), 1.6, r * Math.cos(a));
    camera.lookAt(0.1, 0.6, 0);

    renderer.render(scene, camera);

    L.j1.el.textContent = `J1 ${fmt(j1)}`;
    L.j2.el.textContent = `J2 ${fmt(-j2)}`;
    L.j3.el.textContent = `J3 ${fmt(j3)}`;
    L.grip.el.textContent = grip < 0.35 ? 'GRIP CERRADO' : 'GRIP ABIERTO';
    L.az.el.textContent = `AZ ${String(Math.round(((azDeg % 360) + 360) % 360)).padStart(3, '0')}°`;

    for (const l of Object.values(L)) {
      l.anchor.getWorldPosition(v).project(camera);
      const x = Math.min(Math.max((v.x * 0.5 + 0.5) * size.w + l.dx, 4), size.w - 110);
      const y = Math.min(Math.max((-v.y * 0.5 + 0.5) * size.h + l.dy, 4), size.h - 16);
      l.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
  }

  root.classList.add('is-3d');

  if (reduce) {
    frame(1.4);
    return;
  }

  let visible = true;
  new IntersectionObserver((e) => (visible = e.some((x) => x.isIntersecting))).observe(root);
  const t0 = performance.now();
  const loop = (now) => {
    if (visible && !document.hidden) frame((now - t0) / 1000);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
