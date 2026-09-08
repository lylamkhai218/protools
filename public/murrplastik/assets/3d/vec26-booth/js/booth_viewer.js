/**
 * booth_viewer.js — 3D WebGL Exhibition Booth Viewer (VEC 2026)
 * T&T Vina Industrial Co., Ltd × Murrplastik Systemtechnik GmbH (Germany)
 * Standard: 100% Offline / Zero-Build / Pure Vanilla WebGL Three.js (r128)
 */

(function () {
  'use strict';

  // --- BOOTH CONSTANTS ---
  const BOOTH_W = 3.0;
  const BOOTH_D = 3.0;
  const BOOTH_H = 2.5;
  const VALANCE_H = 0.4;

  // --- FIXED OFFICIAL CONCEPT POSITIONS (FROM USER JSON SPEC) ---
  const FIXED_EQUIPMENT_LAYOUT = {
    tvStand: { x: -1.16, y: 0.0, z: -0.17, rotY: Math.PI / 2 },
    demo1: { x: 0.99, y: 0.0, z: -0.56, rotY: Math.PI },
    demo2: { x: 0.95, y: 0.0, z: 1.27, rotY: Math.PI },
    pipeRack: { x: -0.81, y: 0.0, z: 1.26, rotY: 0 },
    roundTable: { x: -0.10, y: 0.0, z: 0.07, rotY: 0 }
  };

  // --- HOTSPOT SPECIFICATIONS ---
  const HOTSPOTS_DATA = [
    {
      id: 'laser',
      x: 0.99,
      y: 1.15,
      z: -0.56,
      title_vi: 'Trạm Khắc Laser mp-LM 1M (ACS)',
      title_en: 'mp-LM 1M Laser Marking Station (ACS)',
      desc_vi: 'Máy khắc laser công nghiệp tốc độ cao. Trực tiếp khắc tên & logo quà tặng VIP cho khách tham quan.',
      desc_en: 'High-speed industrial laser marking machine. Live customized VIP gift tag engraving for booth visitors.',
      tag: 'ACS Labelling'
    },
    {
      id: 'robot',
      x: 0.95,
      y: 1.15,
      z: 1.27,
      title_vi: 'Hệ Thu Hồi Cáp Robot R-Tec Box (AUR)',
      title_en: 'R-Tec Box Robot Retraction System (AUR)',
      desc_vi: 'Hệ thống lò xo hồi vị độc quyền Murrplastik, bảo vệ cáp tối đa trên cánh tay robot công nghiệp 6 trục.',
      desc_en: 'Murrplastik patented spring retraction system, maximizing cable protection on 6-axis industrial robot arms.',
      tag: 'AUR Robotics'
    },
    {
      id: 'rack',
      x: -0.81,
      y: 1.35,
      z: 1.26,
      title_vi: 'Kệ Trưng Bày 5 Hệ Sinh Thái (SUV/EFK/KDH)',
      title_en: '5 Ecosystems Display Rack (SUV/EFK/KDH)',
      desc_vi: 'Trưng bày mẫu ống ruột gà, máng xích nhựa dẫn cáp, tấm luồn cáp inox chuẩn FDA vệ sinh và linh kiện Đức.',
      desc_en: 'Showcase of conduit hoses, drag chains, hygienic FDA stainless steel cable entry plates and German components.',
      tag: 'Components Hub'
    },
    {
      id: 'lounge',
      x: -0.10,
      y: 1.05,
      z: 0.07,
      title_vi: 'Khu Vực Tiếp Khách & Tư Vấn Kỹ Thuật VIP',
      title_en: 'VIP Consultation & Lounge Area',
      desc_vi: 'Không gian trao đổi chuyên sâu cùng đội ngũ kỹ sư T&T Vina & chuyên gia giải pháp Murrplastik.',
      desc_en: 'Executive space for deep technical consultations with T&T Vina engineers & Murrplastik specialists.',
      tag: 'VIP Lounge'
    }
  ];

  // --- ENGINE STATE ---
  let container, canvasWrap;
  let scene, camera, renderer, controls;
  let boothGroup, frameGroup;
  let tvStandGroup, demoTable1Group, demoTable2Group, pipeRackGroup, roundTableGroup;
  let backwallMesh, sidewallMesh, valanceFrontMesh, valanceSideMesh;
  let isAutoRotating = false;
  let isAnimatingCamera = false;
  let cameraTween = null;
  let hotspotsGroup = null;
  let hotspotElements = [];
  let raycaster, mouse;

  // --- TEXTURE LOADER ---
  function getTextureSource(key) {
    if (window.TEXTURE_DATA && window.TEXTURE_DATA[key]) {
      return window.TEXTURE_DATA[key];
    }
    const basePath = (window.VEC26_BASE_PATH || 'assets/3d/vec26-booth/') + 'textures/';
    return basePath + key + '.png';
  }

  // --- 2D PROFILE GENERATOR: 50x50mm T-SLOT ALUMINUM ---
  function createTSlotGeometry(length, size = 0.05) {
    const s = size / 2;
    const shape = new THREE.Shape();
    const d1 = 0.0095;
    const hw1 = 0.0045;
    const hw2 = 0.0090;

    // Outer perimeter with 4 symmetrical T-Slots
    shape.moveTo(-s, s);
    shape.lineTo(-hw1, s);
    shape.lineTo(-hw1, s - d1);
    shape.lineTo(-hw2, s - d1);
    shape.lineTo(hw2, s - d1);
    shape.lineTo(hw1, s - d1);
    shape.lineTo(hw1, s);
    shape.lineTo(s, s);

    shape.lineTo(s, hw1);
    shape.lineTo(s - d1, hw1);
    shape.lineTo(s - d1, hw2);
    shape.lineTo(s - d1, -hw2);
    shape.lineTo(s - d1, -hw1);
    shape.lineTo(s, -hw1);
    shape.lineTo(s, -s);

    shape.lineTo(hw1, -s);
    shape.lineTo(hw1, -s + d1);
    shape.lineTo(hw2, -s + d1);
    shape.lineTo(-hw2, -s + d1);
    shape.lineTo(-hw1, -s + d1);
    shape.lineTo(-hw1, -s);
    shape.lineTo(-s, -s);

    shape.lineTo(-s, -hw1);
    shape.lineTo(-s + d1, -hw1);
    shape.lineTo(-s + d1, -hw2);
    shape.lineTo(-s + d1, hw2);
    shape.lineTo(-s + d1, hw1);
    shape.lineTo(-s, hw1);
    shape.lineTo(-s, s);

    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, 0.0055, 0, Math.PI * 2, true);
    shape.holes.push(centerHole);

    const chR = 0.003;
    const chOffset = s - 0.0075;
    [[chOffset, chOffset], [-chOffset, chOffset], [-chOffset, -chOffset], [chOffset, -chOffset]].forEach(([hx, hy]) => {
      const cornerHole = new THREE.Path();
      cornerHole.absarc(hx, hy, chR, 0, Math.PI * 2, true);
      shape.holes.push(cornerHole);
    });

    const extrudeSettings = { depth: length, bevelEnabled: false, steps: 1 };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }

  // --- BOOTH WALLS & VALANCE BOARDS (V4: 900x1800mm Panels Centered in 1.0m Bays, Aligned Top) ---
  function buildBoothWalls() {
    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    function loadWallTexture(source) {
      const tex = loader.load(source);
      tex.encoding = THREE.sRGBEncoding;
      tex.anisotropy = maxAniso;
      return tex;
    }

    const valFrontTex = loadWallTexture(getTextureSource('v3_valance_front'));
    const valSideTex = loadWallTexture(getTextureSource('v3_valance_side'));

    // Base Shell Scheme Partition Walls (3.0m x 2.5m White Matte Backing)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf3f5f8,
      roughness: 0.92,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    const baseBackMesh = new THREE.Mesh(new THREE.PlaneGeometry(BOOTH_W, BOOTH_H), baseMat);
    baseBackMesh.position.set(0, BOOTH_H / 2, -BOOTH_D / 2 + 0.005);
    baseBackMesh.receiveShadow = true;
    boothGroup.add(baseBackMesh);

    const baseSideMesh = new THREE.Mesh(new THREE.PlaneGeometry(BOOTH_D, BOOTH_H), baseMat);
    baseSideMesh.position.set(-BOOTH_W / 2 + 0.005, BOOTH_H / 2, 0);
    baseSideMesh.rotation.y = Math.PI / 2;
    baseSideMesh.receiveShadow = true;
    boothGroup.add(baseSideMesh);

    // V4 Graphic Panels: 900mm x 1800mm (0.9m x 1.8m)
    // Centered in each 1.0m bay (5cm margin left & right), Aligned Top to the Frame (Top = 2.50m, Center Y = 1.60m)
    const PANEL_W = 0.9;
    const PANEL_H = 1.8;
    const PANEL_Y = BOOTH_H - PANEL_H / 2; // 1.60m
    const panelGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);

    // Back Wall: 3 Bays centered at X = -1.0m, X = 0.0m, X = +1.0m
    const bwPanels = [
      { key: 'v4_bw_panel_1', x: -1.0 },
      { key: 'v4_bw_panel_2', x: 0.0 },
      { key: 'v4_bw_panel_3', x: 1.0 }
    ];
    bwPanels.forEach(({ key, x }) => {
      const tex = loadWallTexture(getTextureSource(key));
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.88,
        metalness: 0.05,
        side: THREE.DoubleSide
      });
      const pMesh = new THREE.Mesh(panelGeo, mat);
      pMesh.position.set(x, PANEL_Y, -BOOTH_D / 2 + 0.012);
      pMesh.receiveShadow = true;
      boothGroup.add(pMesh);
    });

    // Side Wall: 3 Bays centered at Z = -1.0m (Corner), Z = 0.0m (Mid), Z = +1.0m (Front Aisle)
    const swPanels = [
      { key: 'v4_sw_panel_3', z: -1.0 },
      { key: 'v4_sw_panel_2', z: 0.0 },
      { key: 'v4_sw_panel_1', z: 1.0 }
    ];
    swPanels.forEach(({ key, z }) => {
      const tex = loadWallTexture(getTextureSource(key));
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.88,
        metalness: 0.05,
        side: THREE.DoubleSide
      });
      const pMesh = new THREE.Mesh(panelGeo, mat);
      pMesh.position.set(-BOOTH_W / 2 + 0.012, PANEL_Y, z);
      pMesh.rotation.y = Math.PI / 2;
      pMesh.receiveShadow = true;
      boothGroup.add(pMesh);
    });

    // Valance Front (3m x 0.4m at Top Front Z = +1.5m) — KEPT UNCHANGED
    const valFrontGeo = new THREE.BoxGeometry(BOOTH_W - 0.05, VALANCE_H, 0.01);
    const valFrontMat = new THREE.MeshStandardMaterial({
      map: valFrontTex,
      roughness: 0.7,
      metalness: 0.1
    });
    valanceFrontMesh = new THREE.Mesh(valFrontGeo, valFrontMat);
    valanceFrontMesh.position.set(0, BOOTH_H - VALANCE_H / 2, BOOTH_D / 2 - 0.005);
    valanceFrontMesh.castShadow = true;
    boothGroup.add(valanceFrontMesh);

    // Valance Side (3m x 0.4m at Top Right X = +1.5m) — KEPT UNCHANGED
    const valSideGeo = new THREE.BoxGeometry(0.01, VALANCE_H, BOOTH_D - 0.05);
    const valSideMat = new THREE.MeshStandardMaterial({
      map: valSideTex,
      roughness: 0.7,
      metalness: 0.1
    });
    valanceSideMesh = new THREE.Mesh(valSideGeo, valSideMat);
    valanceSideMesh.position.set(BOOTH_W / 2 - 0.005, BOOTH_H - VALANCE_H / 2, 0);
    valanceSideMesh.castShadow = true;
    boothGroup.add(valanceSideMesh);
  }

  // --- ALUMINUM T-SLOT EXTRUSION FRAME ---
  function buildAluminumFrame() {
    const aluMat = new THREE.MeshStandardMaterial({
      color: 0xd2d6dc,
      metalness: 0.9,
      roughness: 0.2
    });

    const postGeo = createTSlotGeometry(BOOTH_H, 0.05);
    const postPositions = [
      // 4 Corner Posts (3.0m x 3.0m footprint)
      [-BOOTH_W / 2, BOOTH_H / 2, -BOOTH_D / 2],
      [BOOTH_W / 2, BOOTH_H / 2, -BOOTH_D / 2],
      [-BOOTH_W / 2, BOOTH_H / 2, BOOTH_D / 2],
      [BOOTH_W / 2, BOOTH_H / 2, BOOTH_D / 2],
      // Backwall intermediate vertical posts (1.0m bays)
      [-BOOTH_W / 2 + 1.0, BOOTH_H / 2, -BOOTH_D / 2],
      [-BOOTH_W / 2 + 2.0, BOOTH_H / 2, -BOOTH_D / 2],
      // Sidewall intermediate vertical posts (1.0m bays)
      [-BOOTH_W / 2, BOOTH_H / 2, -BOOTH_D / 2 + 1.0],
      [-BOOTH_W / 2, BOOTH_H / 2, -BOOTH_D / 2 + 2.0]
    ];

    postPositions.forEach(([px, py, pz]) => {
      const post = new THREE.Mesh(postGeo, aluMat);
      post.position.set(px, py, pz);
      post.rotation.x = Math.PI / 2;
      post.castShadow = true;
      post.receiveShadow = true;
      frameGroup.add(post);
    });

    const beamGeoX = createTSlotGeometry(BOOTH_W, 0.05);
    const beamGeoZ = createTSlotGeometry(BOOTH_D, 0.05);

    // Top Frame Beams
    const topFrontBeam = new THREE.Mesh(beamGeoX, aluMat);
    topFrontBeam.position.set(0, BOOTH_H, BOOTH_D / 2);
    topFrontBeam.rotation.y = Math.PI / 2;
    topFrontBeam.castShadow = true;
    frameGroup.add(topFrontBeam);

    const topRightBeam = new THREE.Mesh(beamGeoZ, aluMat);
    topRightBeam.position.set(BOOTH_W / 2, BOOTH_H, 0);
    topRightBeam.castShadow = true;
    frameGroup.add(topRightBeam);

    const topBackBeam = new THREE.Mesh(beamGeoX, aluMat);
    topBackBeam.position.set(0, BOOTH_H, -BOOTH_D / 2);
    topBackBeam.rotation.y = Math.PI / 2;
    topBackBeam.castShadow = true;
    frameGroup.add(topBackBeam);

    const topLeftBeam = new THREE.Mesh(beamGeoZ, aluMat);
    topLeftBeam.position.set(-BOOTH_W / 2, BOOTH_H, 0);
    topLeftBeam.castShadow = true;
    frameGroup.add(topLeftBeam);
  }

  // --- MODERN CHAIR BUILDER ---
  function createModernChair(seatColor = 0x1f2937) {
    const chair = new THREE.Group();
    const chairMat = new THREE.MeshStandardMaterial({ color: seatColor, roughness: 0.6 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.95, roughness: 0.1 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.38), chairMat);
    seat.position.y = 0.44;
    seat.castShadow = true;
    chair.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.36, 0.03), chairMat);
    back.position.set(0, 0.62, -0.17);
    back.castShadow = true;
    chair.add(back);

    const chLegGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.43);
    [[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(chLegGeo, chromeMat);
      leg.position.set(lx, 0.215, lz);
      leg.castShadow = true;
      chair.add(leg);
    });

    return chair;
  }

  // --- 1. TV STAND 65 INCH ---
  function buildTVStandAnd65TV() {
    tvStandGroup = new THREE.Group();
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, metalness: 0.85, roughness: 0.25 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.95, roughness: 0.1 });
    const plasticMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });

    const baseFrame = new THREE.Group();
    const baseBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.04, 0.06), steelMat);
    baseBar1.position.set(0, 0.05, 0.22);
    baseFrame.add(baseBar1);

    const baseBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.04, 0.06), steelMat);
    baseBar2.position.set(0, 0.05, -0.22);
    baseFrame.add(baseBar2);

    const centerConnect = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.50), steelMat);
    centerConnect.position.set(0, 0.05, 0);
    baseFrame.add(centerConnect);

    const wheelGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16);
    [[-0.32, 0.22], [0.32, 0.22], [-0.32, -0.22], [0.32, -0.22]].forEach(([wx, wz]) => {
      const wh = new THREE.Mesh(wheelGeo, plasticMat);
      wh.rotation.z = Math.PI / 2;
      wh.position.set(wx, 0.025, wz);
      baseFrame.add(wh);
    });
    tvStandGroup.add(baseFrame);

    const poleGeo = new THREE.CylinderGeometry(0.022, 0.022, 1.75, 20);
    [-0.14, 0.14].forEach((px) => {
      const pole = new THREE.Mesh(poleGeo, steelMat);
      pole.position.set(px, 0.92, 0);
      pole.castShadow = true;
      tvStandGroup.add(pole);
    });

    const avShelf = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.02, 0.30), steelMat);
    avShelf.position.set(0, 0.85, 0.10);
    avShelf.castShadow = true;
    tvStandGroup.add(avShelf);

    const mountBar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.03), chromeMat);
    mountBar.position.set(0, 1.40, 0.02);
    tvStandGroup.add(mountBar);

    const tvBody = new THREE.Group();
    tvBody.position.set(0, 1.40, 0.04);
    const backChassis = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.84, 0.035), plasticMat);
    backChassis.castShadow = true;
    tvBody.add(backChassis);

    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(1.452, 0.842, 0.005),
      new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.9, roughness: 0.1 })
    );
    bezel.position.z = 0.019;
    tvBody.add(bezel);

    // TV Brand Screen Graphic
    const tvCanvas = document.createElement('canvas');
    tvCanvas.width = 1024;
    tvCanvas.height = 576;
    const ctx = tvCanvas.getContext('2d');
    
    const grad = ctx.createLinearGradient(0, 0, 1024, 576);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(1, '#1E293B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 576);
    
    ctx.fillStyle = '#C8102E';
    ctx.fillRect(0, 0, 1024, 18);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Barlow", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MURRPLASTIK SYSTEMTECHNIK', 512, 190);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '32px "Barlow", sans-serif';
    ctx.fillText('ĐẠI DIỆN ỦY QUYỀN CHÍNH THỨC TẠI VIỆT NAM', 512, 255);

    ctx.fillStyle = '#C8102E';
    ctx.fillRect(362, 290, 300, 4);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 36px "Barlow", sans-serif';
    ctx.fillText('TRIỂN LÃM QUỐC TẾ VEC 2026', 512, 360);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '28px "Barlow", sans-serif';
    ctx.fillText('Gian Hàng H2-15a · Sảnh 2 · T&T Vina Industrial', 512, 420);

    const screenTex = new THREE.CanvasTexture(tvCanvas);
    screenTex.encoding = THREE.sRGBEncoding;
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.43, 0.82), screenMat);
    screenMesh.position.set(0, 0, 0.022);
    tvBody.add(screenMesh);

    tvStandGroup.add(tvBody);

    // Apply exact JSON position
    const pos = FIXED_EQUIPMENT_LAYOUT.tvStand;
    tvStandGroup.position.set(pos.x, pos.y, pos.z);
    tvStandGroup.rotation.y = pos.rotY;
    boothGroup.add(tvStandGroup);
  }

  // --- 2. DEMO TABLE 1 (LASER MARKER MP-LM 1M) ---
  function buildDemoTable1Laser() {
    demoTable1Group = new THREE.Group();
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.1 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.4, metalness: 0.8 });

    const topMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.04, 0.55), tableMat);
    topMesh.position.set(0, 0.73, 0);
    topMesh.castShadow = true;
    demoTable1Group.add(topMesh);

    const legGeo = new THREE.BoxGeometry(0.04, 0.71, 0.04);
    [[-0.45, -0.22], [0.45, -0.22], [-0.45, 0.22], [0.45, 0.22]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, 0.355, lz);
      leg.castShadow = true;
      demoTable1Group.add(leg);
    });

    // Laser mp-LM 1M
    const laserGroup = new THREE.Group();
    const laserBodyMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.3 });
    const laserRedMat = new THREE.MeshStandardMaterial({ color: 0xC8102E, roughness: 0.3 });
    const laserDarkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 });

    const laserChassis = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.52, 0.38), laserBodyMat);
    laserChassis.position.y = 0.26;
    laserChassis.castShadow = true;
    laserGroup.add(laserChassis);

    const laserFront = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.50, 0.02), laserRedMat);
    laserFront.position.set(0, 0.26, 0.191);
    laserGroup.add(laserFront);

    const laserScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.18), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    laserScreen.position.set(0, 0.34, 0.202);
    laserGroup.add(laserScreen);

    const laserTray = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.12), laserDarkMat);
    laserTray.position.set(0, 0.08, 0.22);
    laserGroup.add(laserTray);

    laserGroup.position.set(-0.25, 0.75, 0.02);
    demoTable1Group.add(laserGroup);

    // Laptop
    const laptop = new THREE.Group();
    const laptopMat = new THREE.MeshStandardMaterial({ color: 0xc8ccd2, metalness: 0.8, roughness: 0.2 });
    const baseLap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.012, 0.22), laptopMat);
    laptop.add(baseLap);

    const screenLap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.01), laptopMat);
    screenLap.position.set(0, 0.10, -0.10);
    screenLap.rotation.x = -Math.PI / 10;
    laptop.add(screenLap);

    const lapDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.19), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
    lapDisplay.position.set(0, 0.10, -0.094);
    lapDisplay.rotation.x = -Math.PI / 10;
    laptop.add(lapDisplay);

    laptop.position.set(0.22, 0.756, 0.05);
    demoTable1Group.add(laptop);

    // Specimen Gift Tray
    const specimenTrayGroup = new THREE.Group();
    const trayBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.012, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3, metalness: 0.5 })
    );
    trayBase.position.y = 0.006;
    trayBase.castShadow = true;
    specimenTrayGroup.add(trayBase);

    const aluMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });
    const aluTag1 = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.004, 0.04), aluMat);
    aluTag1.position.set(-0.085, 0.014, -0.04);
    aluTag1.castShadow = true;
    specimenTrayGroup.add(aluTag1);

    const plasticRedMat = new THREE.MeshStandardMaterial({ color: 0xC8102E, roughness: 0.3 });
    const pTag1 = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.003, 0.04), plasticRedMat);
    pTag1.position.set(0.00, 0.014, -0.04);
    pTag1.castShadow = true;
    specimenTrayGroup.add(pTag1);

    specimenTrayGroup.position.set(-0.02, 0.752, -0.15);
    demoTable1Group.add(specimenTrayGroup);

    // 2 Chairs
    const chair1 = createModernChair(0x1e293b);
    chair1.position.set(0.22, 0, 0.38);
    chair1.rotation.y = Math.PI;
    demoTable1Group.add(chair1);

    const chair2 = createModernChair(0x1e293b);
    chair2.position.set(-0.25, 0, 0.38);
    chair2.rotation.y = Math.PI;
    demoTable1Group.add(chair2);

    // Apply exact JSON position
    const pos = FIXED_EQUIPMENT_LAYOUT.demo1;
    demoTable1Group.position.set(pos.x, pos.y, pos.z);
    demoTable1Group.rotation.y = pos.rotY;
    boothGroup.add(demoTable1Group);
  }

  // --- 3. DEMO TABLE 2 (ROBOT R-TEC BOX) ---
  function buildDemoTable2RTec() {
    demoTable2Group = new THREE.Group();
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.1 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.4, metalness: 0.8 });

    const topMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.04, 0.55), tableMat);
    topMesh.position.set(0, 0.73, 0);
    topMesh.castShadow = true;
    demoTable2Group.add(topMesh);

    const legGeo = new THREE.BoxGeometry(0.04, 0.71, 0.04);
    [[-0.45, -0.22], [0.45, -0.22], [-0.45, 0.22], [0.45, 0.22]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, 0.355, lz);
      leg.castShadow = true;
      demoTable2Group.add(leg);
    });

    // R-Tec Box Model
    const rtecGroup = new THREE.Group();
    const rtecHousingMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.6 });
    const rtecRedMat = new THREE.MeshStandardMaterial({ color: 0xC8102E, roughness: 0.3 });

    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.16, 0.24), rtecHousingMat);
    housing.position.y = 0.08;
    housing.castShadow = true;
    rtecGroup.add(housing);

    const slider = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.08), rtecRedMat);
    slider.position.set(0, 0.16, 0.06);
    rtecGroup.add(slider);

    const tubeRing = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 16, 24), rtecHousingMat);
    tubeRing.position.set(0.24, 0.08, 0);
    tubeRing.rotation.y = Math.PI / 2;
    rtecGroup.add(tubeRing);

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0.24, 0.08, 0),
      new THREE.Vector3(0.40, 0.22, 0.10),
      new THREE.Vector3(0.48, 0.35, 0.05)
    );
    const hoseGeo = new THREE.TubeGeometry(curve, 20, 0.035, 12, false);
    const hoseMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
    const hose = new THREE.Mesh(hoseGeo, hoseMat);
    rtecGroup.add(hose);

    rtecGroup.position.set(-0.15, 0.75, 0);
    demoTable2Group.add(rtecGroup);

    // 2 Chairs
    const chair1 = createModernChair(0x1e293b);
    chair1.position.set(0.25, 0, 0.38);
    chair1.rotation.y = Math.PI;
    demoTable2Group.add(chair1);

    const chair2 = createModernChair(0x1e293b);
    chair2.position.set(-0.25, 0, 0.38);
    chair2.rotation.y = Math.PI;
    demoTable2Group.add(chair2);

    // Apply exact JSON position
    const pos = FIXED_EQUIPMENT_LAYOUT.demo2;
    demoTable2Group.position.set(pos.x, pos.y, pos.z);
    demoTable2Group.rotation.y = pos.rotY;
    boothGroup.add(demoTable2Group);
  }

  // --- 4. MODULAR PIPE RACK 3x3 (1.6M) ---
  function buildModularPipeRack() {
    pipeRackGroup = new THREE.Group();
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0xf5f0d8, roughness: 0.35, metalness: 0.1 });
    const jointMat = new THREE.MeshStandardMaterial({ color: 0xc4c8ce, metalness: 0.9, roughness: 0.15 });
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x272b33, roughness: 0.6 });

    const W = 1.15;
    const D = 0.42;
    const H = 1.60;

    const postGeo = new THREE.CylinderGeometry(0.014, 0.014, H, 16);
    const postOffsets = [
      [-W / 2, -D / 2], [W / 2, -D / 2], [-W / 2, D / 2], [W / 2, D / 2],
      [-W / 6, -D / 2], [W / 6, -D / 2], [-W / 6, D / 2], [W / 6, D / 2]
    ];

    postOffsets.forEach(([px, pz]) => {
      const post = new THREE.Mesh(postGeo, pipeMat);
      post.position.set(px, H / 2, pz);
      post.castShadow = true;
      pipeRackGroup.add(post);
    });

    const tierHeights = [0.15, 0.85, 1.55];
    tierHeights.forEach((th) => {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(W + 0.02, 0.015, D + 0.02), shelfMat);
      shelf.position.set(0, th, 0);
      shelf.castShadow = true;
      pipeRackGroup.add(shelf);

      postOffsets.forEach(([px, pz]) => {
        const joint = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.038, 0.038), jointMat);
        joint.position.set(px, th, pz);
        pipeRackGroup.add(joint);
      });
    });

    // 3 Murrplastik Boxes
    const boxCanvas = document.createElement('canvas');
    boxCanvas.width = 512;
    boxCanvas.height = 384;
    const bctx = boxCanvas.getContext('2d');
    bctx.fillStyle = '#c89d66';
    bctx.fillRect(0, 0, 512, 384);
    bctx.fillStyle = '#C8102E';
    bctx.fillRect(40, 60, 432, 80);
    bctx.fillStyle = '#ffffff';
    bctx.font = 'bold 36px Arial';
    bctx.fillText('murrplastik', 60, 116);
    bctx.fillStyle = '#1e293b';
    bctx.font = 'bold 20px Arial';
    bctx.fillText('MADE IN GERMANY • T&T VINA', 60, 200);

    const boxTex = new THREE.CanvasTexture(boxCanvas);
    boxTex.encoding = THREE.sRGBEncoding;
    const boxMat = new THREE.MeshStandardMaterial({ map: boxTex, roughness: 0.8 });
    const boxMatPlain = new THREE.MeshStandardMaterial({ color: 0xc89d66, roughness: 0.85 });

    const boxGeo = new THREE.BoxGeometry(0.36, 0.42, 0.38);
    const boxMaterials = [boxMatPlain, boxMatPlain, boxMatPlain, boxMatPlain, boxMat, boxMatPlain];

    [-0.36, 0.0, 0.36].forEach((bx) => {
      const box = new THREE.Mesh(boxGeo, boxMaterials);
      box.position.set(bx, 0.15 + 0.21, 0);
      box.castShadow = true;
      pipeRackGroup.add(box);
    });

    // Apply exact JSON position
    const pos = FIXED_EQUIPMENT_LAYOUT.pipeRack;
    pipeRackGroup.position.set(pos.x, pos.y, pos.z);
    pipeRackGroup.rotation.y = pos.rotY;
    boothGroup.add(pipeRackGroup);
  }

  // --- 5. ROUND GUEST TABLE & 4 CHAIRS ---
  function buildRoundTableCenter() {
    roundTableGroup = new THREE.Group();
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.15, metalness: 0.1 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.95, roughness: 0.1 });

    const topMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.325, 0.325, 0.03, 32), marbleMat);
    topMesh.position.y = 0.735;
    topMesh.castShadow = true;
    roundTableGroup.add(topMesh);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.71, 16), chromeMat);
    pole.position.y = 0.365;
    roundTableGroup.add(pole);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 32), chromeMat);
    base.position.y = 0.01;
    base.castShadow = true;
    roundTableGroup.add(base);

    // Fruit Bowl
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.85 });
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.06, 24), bowlMat);
    bowl.position.set(0, 0.78, 0);
    roundTableGroup.add(bowl);

    const appleMat = new THREE.MeshStandardMaterial({ color: 0xd91e18, roughness: 0.3 });
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.4 });
    const fruit1 = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), appleMat);
    fruit1.position.set(-0.03, 0.81, 0.02);
    roundTableGroup.add(fruit1);
    const fruit2 = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), orangeMat);
    fruit2.position.set(0.03, 0.81, -0.02);
    roundTableGroup.add(fruit2);

    // 4 Guest Chairs facing table center
    const chairAngles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
    const chairRadius = 0.50;
    chairAngles.forEach((angle) => {
      const chair = createModernChair(0x1f242d);
      chair.position.set(
        Math.sin(angle) * chairRadius,
        0,
        Math.cos(angle) * chairRadius
      );
      chair.rotation.y = angle + Math.PI;
      roundTableGroup.add(chair);
    });

    // Apply exact JSON position (x: -0.1, y: 0, z: 0.07, rotY: 0)
    const pos = FIXED_EQUIPMENT_LAYOUT.roundTable;
    roundTableGroup.position.set(pos.x, pos.y, pos.z);
    roundTableGroup.rotation.y = pos.rotY;
    boothGroup.add(roundTableGroup);
  }

  // --- CARPET FLOOR ---
  function buildFloor() {
    const floorGeo = new THREE.PlaneGeometry(BOOTH_W + 0.4, BOOTH_D + 0.4);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e242d,
      roughness: 0.85,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.005;
    floor.receiveShadow = true;
    scene.add(floor);

    // Outer subtle border
    const borderGeo = new THREE.EdgesGeometry(floorGeo);
    const borderMat = new THREE.LineBasicMaterial({ color: 0xC8102E, linewidth: 2 });
    const border = new THREE.LineSegments(borderGeo, borderMat);
    border.rotation.x = -Math.PI / 2;
    border.position.y = 0.001;
    scene.add(border);
  }

  // --- LIGHTING ---
  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.72);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 0.95);
    dirLight.position.set(4, 6, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0003;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.camera.left = -3;
    dirLight.shadow.camera.right = 3;
    dirLight.shadow.camera.top = 3;
    dirLight.shadow.camera.bottom = -3;
    scene.add(dirLight);

    // Subtle Spotlights on Demo Tables
    const spot1 = new THREE.SpotLight(0xffffff, 0.6, 6, Math.PI / 6, 0.3);
    spot1.position.set(0.99, 2.4, -0.56);
    spot1.target = demoTable1Group;
    scene.add(spot1);

    const spot2 = new THREE.SpotLight(0xffffff, 0.6, 6, Math.PI / 6, 0.3);
    spot2.position.set(0.95, 2.4, 1.27);
    spot2.target = demoTable2Group;
    scene.add(spot2);
  }

  // --- CAMERA PRESET ANGLES ---
  const CAMERA_VIEWS = {
    corner: { pos: [3.8, 2.4, 3.8], target: [0, 1.1, 0] },
    front: { pos: [0.1, 1.6, 4.4], target: [0, 1.2, -0.2] },
    side: { pos: [4.4, 1.6, 0.1], target: [-0.2, 1.2, 0] },
    eye: { pos: [2.1, 1.6, 2.1], target: [-0.1, 1.2, -0.1] },
    top: { pos: [0.01, 5.4, 0.01], target: [0, 0, 0] }
  };

  function setCameraView(viewKey) {
    const view = CAMERA_VIEWS[viewKey] || CAMERA_VIEWS.corner;
    if (!controls) return;

    isAutoRotating = false;
    updateAutoRotateButtonState(false);

    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(...view.pos);
    const startTarget = controls.target.clone();
    const endTarget = new THREE.Vector3(...view.target);

    const startTime = performance.now();
    const duration = 650;

    isAnimatingCamera = true;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);

      camera.position.lerpVectors(startPos, endPos, ease);
      controls.target.lerpVectors(startTarget, endTarget, ease);
      controls.update();

      if (progress < 1.0) {
        requestAnimationFrame(step);
      } else {
        isAnimatingCamera = false;
      }
    }
    requestAnimationFrame(step);

    document.querySelectorAll('.cam-chip').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === viewKey);
    });
  }

  // --- HOTSPOTS DOM OVERLAY ---
  function initHotspots() {
    const overlay = document.getElementById('booth3d-hotspots-overlay');
    if (!overlay) return;

    overlay.innerHTML = '';
    hotspotElements = [];

    HOTSPOTS_DATA.forEach((hs, idx) => {
      const el = document.createElement('button');
      el.className = 'booth-hotspot-pin';
      el.setAttribute('aria-label', hs.title_vi);
      el.innerHTML = `
        <span class="pin-ring"></span>
        <span class="pin-dot">${idx + 1}</span>
      `;
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        showHotspotModal(hs);
      });
      overlay.appendChild(el);
      hotspotElements.push({ el, data: hs });
    });
  }

  function updateHotspotsDOM() {
    if (!hotspotElements.length || !camera || !canvasWrap) return;

    const width = canvasWrap.clientWidth;
    const height = canvasWrap.clientHeight;
    const tempV = new THREE.Vector3();

    hotspotElements.forEach(({ el, data }) => {
      tempV.set(data.x, data.y, data.z);
      tempV.project(camera);

      if (tempV.z > 1.0) {
        el.style.display = 'none';
        return;
      }

      const screenX = (tempV.x * 0.5 + 0.5) * width;
      const screenY = (-(tempV.y * 0.5) + 0.5) * height;

      el.style.display = 'flex';
      el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0)`;
    });
  }

  function showHotspotModal(hs) {
    const isEn = (localStorage.getItem('mp_lang') === 'en');
    const modal = document.getElementById('booth3d-hotspot-modal');
    if (!modal) return;

    const tagEl = modal.querySelector('.modal-tag');
    const titleEl = modal.querySelector('.modal-title');
    const descEl = modal.querySelector('.modal-desc');

    if (tagEl) tagEl.textContent = hs.tag;
    if (titleEl) titleEl.textContent = isEn ? hs.title_en : hs.title_vi;
    if (descEl) descEl.textContent = isEn ? hs.desc_en : hs.desc_vi;

    modal.classList.add('active');
  }

  function hideHotspotModal() {
    const modal = document.getElementById('booth3d-hotspot-modal');
    if (modal) modal.classList.remove('active');
  }

  // --- AUTO-ROTATE & CONTROLS ---
  function toggleAutoRotate(forceState) {
    isAutoRotating = (typeof forceState === 'boolean') ? forceState : !isAutoRotating;
    updateAutoRotateButtonState(isAutoRotating);
  }

  function updateAutoRotateButtonState(active) {
    const btn = document.getElementById('btn-booth-autorotate');
    if (btn) {
      btn.classList.toggle('active', active);
    }
  }

  // --- FULLSCREEN CONTROLLER (NATIVE + PSEUDO FULLSCREEN DUAL ENGINE) ---
  let isPseudoFullscreen = false;

  function isFullscreenActive() {
    return isPseudoFullscreen || !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  function updateFullscreenUI(active) {
    const fsBtn = document.getElementById('btn-booth-fullscreen');
    if (fsBtn) {
      fsBtn.classList.toggle('active', active);
      fsBtn.title = active ? 'Thu nhỏ toàn màn hình' : 'Toàn màn hình';
      fsBtn.setAttribute('aria-label', active ? 'Exit Fullscreen' : 'Fullscreen');
      fsBtn.innerHTML = active
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>';
    }

    if (container) {
      container.classList.toggle('booth-pseudo-fullscreen', active);
    }
    document.body.classList.toggle('booth-fullscreen-locked', active);

    // Trigger canvas & camera resize
    requestAnimationFrame(() => {
      onWindowResize();
      setTimeout(onWindowResize, 60);
      setTimeout(onWindowResize, 220);
    });
  }

  function enterFullscreen() {
    if (!container) return;

    const ua = navigator.userAgent || '';
    const isIOSDevice = /iPhone|iPad|iPod/i.test(ua);
    const isInApp = /Zalo|FBAN|FBAV|Instagram|Line/i.test(ua);

    // On iOS devices & In-App WebViews, native requestFullscreen on div/canvas is either unsupported or blocked by Permissions Policy.
    // CSS Pseudo-Fullscreen is 100% reliable across all iOS devices, Android WebViews, Safari and Chrome.
    if (!isIOSDevice && !isInApp && (container.requestFullscreen || container.webkitRequestFullscreen)) {
      try {
        const fsPromise = container.requestFullscreen
          ? container.requestFullscreen()
          : container.webkitRequestFullscreen();

        if (fsPromise && fsPromise.catch) {
          fsPromise.catch(() => {
            isPseudoFullscreen = true;
            updateFullscreenUI(true);
          });
        }
      } catch (err) {
        isPseudoFullscreen = true;
        updateFullscreenUI(true);
      }
    } else {
      isPseudoFullscreen = true;
      updateFullscreenUI(true);
      try {
        window.history.pushState({ boothFullscreen: true }, '');
      } catch (e) {}
    }
  }

  function exitFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      try {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } catch (e) {}
    }
    isPseudoFullscreen = false;
    updateFullscreenUI(false);
  }

  function toggleFullscreen() {
    if (isFullscreenActive()) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }

  // --- INITIALIZATION ---
  function init() {
    container = document.getElementById('booth3d-container');
    canvasWrap = document.getElementById('booth3d-canvas-wrap');
    if (!container || !canvasWrap) return;

    // Remove old canvas if re-initializing
    const oldCanvas = canvasWrap.querySelector('canvas');
    if (oldCanvas) oldCanvas.remove();

    const width = canvasWrap.clientWidth || 800;
    const height = canvasWrap.clientHeight || 500;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Dark Luxury Slate

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.8, 2.4, 3.8);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvasWrap.appendChild(renderer.domElement);

    // OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.8;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.target.set(0, 1.1, 0);
    controls.update();

    // Groups
    boothGroup = new THREE.Group();
    frameGroup = new THREE.Group();
    scene.add(boothGroup);
    scene.add(frameGroup);

    // Build Booth & Equipment
    buildFloor();
    buildBoothWalls();
    buildAluminumFrame();
    // buildTVStandAnd65TV(); // Removed as requested: Bỏ model TV 3D
    buildDemoTable1Laser();
    buildDemoTable2RTec();
    buildModularPipeRack();
    buildRoundTableCenter();

    setupLighting();
    initHotspots();

    // Hide loader
    const loader = document.getElementById('booth3d-loader');
    if (loader) loader.classList.add('hidden');

    // Attach DOM Events
    setupDOMListeners();

    // Resize Handler
    window.addEventListener('resize', onWindowResize);
    const resizeObserver = new ResizeObserver(() => onWindowResize());
    resizeObserver.observe(canvasWrap);

    // Animation Loop
    animate();
  }

  function setupDOMListeners() {
    document.querySelectorAll('.cam-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        setCameraView(btn.dataset.view);
      });
    });

    const autoBtn = document.getElementById('btn-booth-autorotate');
    if (autoBtn) {
      autoBtn.addEventListener('click', () => toggleAutoRotate());
    }

    const resetBtn = document.getElementById('btn-booth-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => setCameraView('corner'));
    }

    const fsBtn = document.getElementById('btn-booth-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => toggleFullscreen());
    }

    const exitFsPill = document.getElementById('btn-booth-exit-fs');
    if (exitFsPill) {
      exitFsPill.addEventListener('click', () => exitFullscreen());
    }

    // Fullscreen native change listener
    document.addEventListener('fullscreenchange', () => {
      const isNativeFs = !!document.fullscreenElement;
      if (!isNativeFs && !isPseudoFullscreen) {
        updateFullscreenUI(false);
      } else if (isNativeFs) {
        updateFullscreenUI(true);
      }
    });
    document.addEventListener('webkitfullscreenchange', () => {
      const isNativeFs = !!document.webkitFullscreenElement;
      if (!isNativeFs && !isPseudoFullscreen) {
        updateFullscreenUI(false);
      } else if (isNativeFs) {
        updateFullscreenUI(true);
      }
    });

    // Handle mobile hardware back button / swipe back to exit fullscreen
    window.addEventListener('popstate', (e) => {
      if (isPseudoFullscreen) {
        isPseudoFullscreen = false;
        updateFullscreenUI(false);
      }
    });

    // Handle ESC key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isFullscreenActive()) {
        exitFullscreen();
      }
    });

    // Orientation change resize
    window.addEventListener('orientationchange', () => {
      setTimeout(onWindowResize, 150);
      setTimeout(onWindowResize, 350);
    });

    const modalClose = document.getElementById('booth3d-modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', () => hideHotspotModal());
    }

    window.addEventListener('click', (e) => {
      if (!e.target.closest('#booth3d-hotspot-modal') && !e.target.closest('.booth-hotspot-pin')) {
        hideHotspotModal();
      }
    });

    controls.addEventListener('start', () => {
      if (isAutoRotating) {
        isAutoRotating = false;
        updateAutoRotateButtonState(false);
      }
    });
  }

  function onWindowResize() {
    if (!canvasWrap || !renderer || !camera) return;
    const w = canvasWrap.clientWidth;
    const h = canvasWrap.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function animate() {
    requestAnimationFrame(animate);

    if (isAutoRotating && !isAnimatingCamera) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.2;
    } else {
      controls.autoRotate = false;
    }

    controls.update();
    updateHotspotsDOM();
    renderer.render(scene, camera);
  }

  // Export to global scope
  window.VEC26_BOOTH = {
    init,
    setCameraView,
    toggleAutoRotate,
    toggleFullscreen
  };

  // Auto-init on load if container exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('booth3d-container')) init();
    });
  } else {
    if (document.getElementById('booth3d-container')) init();
  }
})();
