import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ORGANS_DATA } from '../../data/digestiveData';
import { ActiveTabType, OrganInfo } from '../../types/digestive';
import { soundFx } from '../../utils/audio';

interface DigestiveCanvasProps {
  activeTab: ActiveTabType;
  selectedOrganId: string | null;
  onSelectOrgan: (organ: OrganInfo) => void;
  isJourneyRunning: boolean;
  journeyStepIndex: number;
}

export const DigestiveCanvas: React.FC<DigestiveCanvasProps> = ({
  activeTab,
  selectedOrganId,
  onSelectOrgan,
  isJourneyRunning,
  journeyStepIndex,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredOrgan, setHoveredOrgan] = useState<OrganInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // References to keep WebGL state alive across React re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshesMapRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const abqoorMeshRef = useRef<THREE.Group | null>(null);
  const pathCurveRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  // Target camera state for smooth exponential damping transitions
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.8, 6.0));
  const cameraTargetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.8, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene & Camera Setup ---
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0.8, 6.0);
    cameraRef.current = camera;

    // --- 2. Renderer Setup ---
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 3. Studio Environment Reflection ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // --- 4. Controls Setup ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.minPolarAngle = Math.PI / 6;
    controls.minDistance = 2.0;
    controls.maxDistance = 10.0;
    controls.target.set(0, 0.8, 0);

    // --- 5. Studio Lighting Rig ---
    const ambientLight = new THREE.AmbientLight('#1e293b', 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.2);
    keyLight.position.set(4, 8, 6);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight('#38bdf8', '#0284c7', 1.0);
    fillLight.position.set(-4, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#f43f5e', 1.2);
    rimLight.position.set(0, -2, -5);
    scene.add(rimLight);

    // Ground Contact Shadow Plane
    const groundGeo = new THREE.PlaneGeometry(12, 12);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.8,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -2.5;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // --- 6. Torso Silhouette Glassy Outline ---
    const createTorsoOutline = () => {
      const group = new THREE.Group();

      // Head sphere
      const headGeo = new THREE.SphereGeometry(0.7, 32, 32);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: '#334155',
        transparent: true,
        opacity: 0.12,
        roughness: 0.2,
        transmission: 0.8,
        thickness: 0.5,
        wireframe: false,
      });
      const head = new THREE.Mesh(headGeo, glassMat);
      head.position.set(0, 3.8, 0);
      group.add(head);

      // Neck cylinder
      const neckGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.7, 24);
      const neck = new THREE.Mesh(neckGeo, glassMat);
      neck.position.set(0, 3.0, 0);
      group.add(neck);

      // Main Torso body
      const torsoShape = new THREE.Shape();
      torsoShape.moveTo(-1.2, 2.6);
      torsoShape.quadraticCurveTo(-1.4, 1.2, -1.0, -2.0);
      torsoShape.lineTo(1.0, -2.0);
      torsoShape.quadraticCurveTo(1.4, 1.2, 1.2, 2.6);
      torsoShape.closePath();

      const extrudeSettings = {
        depth: 0.8,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 2,
        bevelSize: 0.2,
        bevelThickness: 0.2,
      };

      const torsoGeo = new THREE.ExtrudeGeometry(torsoShape, extrudeSettings);
      torsoGeo.center();
      const torsoMesh = new THREE.Mesh(torsoGeo, glassMat);
      torsoMesh.position.set(0, 0.7, -0.2);
      group.add(torsoMesh);

      // Wireframe outline accent
      const wireMat = new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      });
      const torsoWire = new THREE.Mesh(torsoGeo, wireMat);
      torsoWire.position.copy(torsoMesh.position);
      group.add(torsoWire);

      scene.add(group);
    };
    createTorsoOutline();

    // --- 7. Procedural 12 Organ Assemblies ---
    const meshesMap = new Map<string, THREE.Object3D>();

    ORGANS_DATA.forEach((organ) => {
      const group = new THREE.Group();
      group.userData = { organ };

      const baseMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(organ.colorHex),
        roughness: 0.35,
        metalness: 0.2,
        emissive: new THREE.Color('#000000'),
      });

      if (organ.id === 'mouth') {
        // Mouth Cavity & Jaw Arch
        const mouthGeo = new THREE.TorusGeometry(0.32, 0.12, 16, 32, Math.PI * 1.2);
        const mouthMesh = new THREE.Mesh(mouthGeo, baseMat);
        mouthMesh.rotation.x = Math.PI / 2;
        group.add(mouthMesh);

        // Tongue
        const tongueGeo = new THREE.SphereGeometry(0.2, 16, 16);
        tongueGeo.scale(1.2, 0.5, 1.5);
        const tongueMat = new THREE.MeshStandardMaterial({ color: '#f43f5e', roughness: 0.4 });
        const tongue = new THREE.Mesh(tongueGeo, tongueMat);
        tongue.position.set(0, -0.05, 0.08);
        group.add(tongue);
      } else if (organ.id === 'pharynx') {
        // Pharynx Funnel
        const pharynxGeo = new THREE.CylinderGeometry(0.25, 0.18, 0.5, 24);
        const pharynxMesh = new THREE.Mesh(pharynxGeo, baseMat);
        group.add(pharynxMesh);
      } else if (organ.id === 'esophagus') {
        // Esophagus Tube
        const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0.6, 0), new THREE.Vector3(0, -0.6, 0));
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.12, 16, false);
        const esophagusMesh = new THREE.Mesh(tubeGeo, baseMat);
        group.add(esophagusMesh);
      } else if (organ.id === 'stomach') {
        // Stomach J-shape
        const stomachPath = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.1, 0.4, 0),
          new THREE.Vector3(-0.25, 0.2, 0.1),
          new THREE.Vector3(-0.35, -0.2, 0.1),
          new THREE.Vector3(0.05, -0.35, 0),
        ]);
        const stomachGeo = new THREE.TubeGeometry(stomachPath, 32, 0.28, 20, false);
        const stomachMesh = new THREE.Mesh(stomachGeo, baseMat);
        group.add(stomachMesh);
      } else if (organ.id === 'small_intestine') {
        // Small Intestine convoluted looping tube cluster
        const points: THREE.Vector3[] = [];
        for (let i = 0; i < 80; i++) {
          const t = i / 80;
          const angle = t * Math.PI * 14;
          const radius = 0.35 * Math.sin(t * Math.PI);
          const x = Math.cos(angle) * radius;
          const y = (t - 0.5) * 0.9;
          const z = Math.sin(angle) * radius * 0.8;
          points.push(new THREE.Vector3(x, y, z));
        }
        const intestinePath = new THREE.CatmullRomCurve3(points);
        const intestineGeo = new THREE.TubeGeometry(intestinePath, 100, 0.07, 12, false);
        const intestineMesh = new THREE.Mesh(intestineGeo, baseMat);
        group.add(intestineMesh);
      } else if (organ.id === 'large_intestine') {
        // Large Intestine framing colon
        const colonPoints = [
          new THREE.Vector3(0.65, -0.6, 0), // Cecum
          new THREE.Vector3(0.65, 0.45, 0), // Ascending
          new THREE.Vector3(0.0, 0.55, 0), // Transverse center
          new THREE.Vector3(-0.65, 0.45, 0), // Descending top
          new THREE.Vector3(-0.65, -0.6, 0), // Descending bottom
          new THREE.Vector3(-0.2, -0.85, 0), // Sigmoid
        ];
        const colonPath = new THREE.CatmullRomCurve3(colonPoints);
        const colonGeo = new THREE.TubeGeometry(colonPath, 50, 0.15, 16, false);
        const colonMesh = new THREE.Mesh(colonGeo, baseMat);
        group.add(colonMesh);
      } else if (organ.id === 'rectum') {
        // Rectum cylinder
        const rectumGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.45, 20);
        const rectumMesh = new THREE.Mesh(rectumGeo, baseMat);
        group.add(rectumMesh);
      } else if (organ.id === 'anus') {
        // Anus Ring Sphincter
        const anusGeo = new THREE.TorusGeometry(0.12, 0.06, 16, 24);
        const anusMesh = new THREE.Mesh(anusGeo, baseMat);
        anusMesh.rotation.x = Math.PI / 2;
        group.add(anusMesh);
      } else if (organ.id === 'salivary_glands') {
        // Salivary Glands 3 paired lobes
        const glandMat = new THREE.MeshStandardMaterial({
          color: organ.colorHex,
          roughness: 0.25,
          metalness: 0.1,
        });

        const l1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), glandMat);
        l1.position.set(0, 0.1, 0);
        const l2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), glandMat);
        l2.position.set(-0.15, -0.08, 0.05);
        const l3 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), glandMat);
        l3.position.set(0.12, -0.12, -0.05);

        group.add(l1, l2, l3);
      } else if (organ.id === 'liver') {
        // Liver large anatomical wedge
        const liverShape = new THREE.Shape();
        liverShape.moveTo(0, 0.6);
        liverShape.quadraticCurveTo(0.7, 0.5, 0.8, -0.2);
        liverShape.quadraticCurveTo(0.3, -0.5, -0.4, -0.2);
        liverShape.quadraticCurveTo(-0.2, 0.3, 0, 0.6);

        const liverGeo = new THREE.ExtrudeGeometry(liverShape, {
          depth: 0.4,
          bevelEnabled: true,
          bevelSegments: 6,
          bevelSize: 0.1,
          bevelThickness: 0.1,
        });
        liverGeo.center();
        const liverMesh = new THREE.Mesh(liverGeo, baseMat);
        group.add(liverMesh);
      } else if (organ.id === 'gallbladder') {
        // Gallbladder pear sac
        const gallGeo = new THREE.SphereGeometry(0.12, 20, 20);
        gallGeo.scale(0.8, 1.4, 0.8);
        const gallMat = new THREE.MeshStandardMaterial({
          color: organ.colorHex,
          roughness: 0.2,
          metalness: 0.1,
        });
        const gallMesh = new THREE.Mesh(gallGeo, gallMat);
        group.add(gallMesh);
      } else if (organ.id === 'pancreas') {
        // Pancreas elongated gland
        const pPoints = [
          new THREE.Vector3(-0.35, 0, 0),
          new THREE.Vector3(0, 0.05, 0),
          new THREE.Vector3(0.35, -0.05, 0),
        ];
        const pPath = new THREE.CatmullRomCurve3(pPoints);
        const pGeo = new THREE.TubeGeometry(pPath, 20, 0.11, 16, false);
        const pMesh = new THREE.Mesh(pGeo, baseMat);
        group.add(pMesh);
      }

      group.position.set(organ.threeCoordinates.x, organ.threeCoordinates.y, organ.threeCoordinates.z);

      // Add clickable target metadata
      group.traverse((child) => {
        child.userData = { organ };
        if (child instanceof THREE.Mesh) {
          child.castShadow = !isHeadless;
          child.receiveShadow = !isHeadless;
        }
      });

      scene.add(group);
      meshesMap.set(organ.id, group);
    });

    meshesMapRef.current = meshesMap;

    // --- 8. Create Abqoor 3D Hero Capsule & Path ---
    const createAbqoorActor = () => {
      const abqoor = new THREE.Group();

      // Main Submarine Capsule
      const bodyGeo = new THREE.CapsuleGeometry(0.12, 0.2, 16, 16);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        metalness: 0.8,
        roughness: 0.2,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.z = Math.PI / 2;
      abqoor.add(body);

      // Glowing Glass Visor
      const visorGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const visorMat = new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: new THREE.Color('#0284c7'),
        emissiveIntensity: 0.8,
        roughness: 0.1,
      });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0.1, 0, 0.05);
      abqoor.add(visor);

      // Light Beam / Aura
      const light = new THREE.PointLight('#f59e0b', 2.0, 1.5);
      light.position.set(0, 0, 0);
      abqoor.add(light);

      abqoor.visible = false;
      scene.add(abqoor);
      abqoorMeshRef.current = abqoor;

      // CatmullRom Path down the GI Tract
      const routePoints = ORGANS_DATA.filter((o) => o.category === 'canal')
        .sort((a, b) => (a.orderInCanal || 0) - (b.orderInCanal || 0))
        .map((o) => new THREE.Vector3(o.threeCoordinates.x, o.threeCoordinates.y, o.threeCoordinates.z + 0.15));

      pathCurveRef.current = new THREE.CatmullRomCurve3(routePoints);
    };
    createAbqoorActor();

    // --- 9. Raycasting for Mouse Hover & Click ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (event: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current || isJourneyRunning) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let foundOrgan: OrganInfo | null = null;
      for (const hit of intersects) {
        if (hit.object.userData?.organ) {
          foundOrgan = hit.object.userData.organ as OrganInfo;
          break;
        }
      }

      if (foundOrgan) {
        setHoveredOrgan(foundOrgan);
        setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        container.style.cursor = 'pointer';
      } else {
        setHoveredOrgan(null);
        setTooltipPos(null);
        container.style.cursor = 'grab';
      }
    };

    const handlePointerClick = () => {
      if (hoveredOrgan && !isJourneyRunning) {
        soundFx.playSelectOrgan();
        onSelectOrgan(hoveredOrgan);
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousemove', handlePointerMove);
    domEl.addEventListener('click', handlePointerClick);

    // --- 10. Window Resize Handler ---
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- 11. Animation Loop with Exponential Damping ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      // Smooth camera interpolation
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.x = THREE.MathUtils.damp(cameraRef.current.position.x, cameraTargetPos.current.x, 3.5, delta);
        cameraRef.current.position.y = THREE.MathUtils.damp(cameraRef.current.position.y, cameraTargetPos.current.y, 3.5, delta);
        cameraRef.current.position.z = THREE.MathUtils.damp(cameraRef.current.position.z, cameraTargetPos.current.z, 3.5, delta);

        controlsRef.current.target.x = THREE.MathUtils.damp(controlsRef.current.target.x, cameraTargetLookAt.current.x, 3.5, delta);
        controlsRef.current.target.y = THREE.MathUtils.damp(controlsRef.current.target.y, cameraTargetLookAt.current.y, 3.5, delta);
        controlsRef.current.target.z = THREE.MathUtils.damp(controlsRef.current.target.z, cameraTargetLookAt.current.z, 3.5, delta);

        controlsRef.current.update();
      }

      // Gently breathe/float organs
      meshesMapRef.current.forEach((group, organId) => {
        const organ = group.userData.organ as OrganInfo;
        const isHovered = hoveredOrgan?.id === organId;
        const isSelected = selectedOrganId === organId;

        // Scale pulse on hover/selection
        const targetScale = isSelected ? 1.25 : isHovered ? 1.15 : 1.0;
        group.scale.x = THREE.MathUtils.damp(group.scale.x, targetScale, 6, delta);
        group.scale.y = THREE.MathUtils.damp(group.scale.y, targetScale, 6, delta);
        group.scale.z = THREE.MathUtils.damp(group.scale.z, targetScale, 6, delta);

        // Gentle floating wobble
        group.position.y = organ.threeCoordinates.y + Math.sin(time * 2 + organ.threeCoordinates.y) * 0.02;

        // Apply tab filtering (dimming unselected tab)
        let opacityTarget = 1.0;
        if (activeTab === 'canal' && organ.category !== 'canal') {
          opacityTarget = 0.25;
        } else if (activeTab === 'accessories' && organ.category !== 'accessories') {
          opacityTarget = 0.25;
        }

        group.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshStandardMaterial;
            mat.transparent = opacityTarget < 1.0 || isSelected;
            mat.opacity = THREE.MathUtils.damp(mat.opacity ?? 1, opacityTarget, 6, delta);

            if (isSelected) {
              mat.emissive = new THREE.Color(organ.highlightHex);
              mat.emissiveIntensity = 0.4 + Math.sin(time * 4) * 0.2;
            } else if (isHovered) {
              mat.emissive = new THREE.Color(organ.highlightHex);
              mat.emissiveIntensity = 0.25;
            } else {
              mat.emissive = new THREE.Color('#000000');
              mat.emissiveIntensity = 0;
            }
          }
        });
      });

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Clean up WebGL on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousemove', handlePointerMove);
      domEl.removeEventListener('click', handlePointerClick);

      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  // Update Camera Target based on selection
  useEffect(() => {
    if (selectedOrganId) {
      const organ = ORGANS_DATA.find((o) => o.id === selectedOrganId);
      if (organ) {
        cameraTargetPos.current.set(organ.cameraPosition.x, organ.cameraPosition.y, organ.cameraPosition.z);
        cameraTargetLookAt.current.set(organ.cameraTarget.x, organ.cameraTarget.y, organ.cameraTarget.z);
      }
    } else if (!isJourneyRunning) {
      // Default view
      cameraTargetPos.current.set(0, 0.8, 6.0);
      cameraTargetLookAt.current.set(0, 0.8, 0);
    }
  }, [selectedOrganId, isJourneyRunning]);

  // Handle Abqoor Journey Path Animation
  useEffect(() => {
    if (!abqoorMeshRef.current || !pathCurveRef.current) return;

    if (isJourneyRunning) {
      abqoorMeshRef.current.visible = true;
      const canalOrgans = ORGANS_DATA.filter((o) => o.category === 'canal').sort(
        (a, b) => (a.orderInCanal || 0) - (b.orderInCanal || 0)
      );

      const targetOrgan = canalOrgans[journeyStepIndex];
      if (targetOrgan) {
        const fraction = journeyStepIndex / Math.max(1, canalOrgans.length - 1);
        const point = pathCurveRef.current.getPointAt(fraction);
        const tangent = pathCurveRef.current.getTangentAt(fraction);

        abqoorMeshRef.current.position.copy(point);
        abqoorMeshRef.current.lookAt(point.clone().add(tangent));

        cameraTargetPos.current.set(targetOrgan.cameraPosition.x, targetOrgan.cameraPosition.y, targetOrgan.cameraPosition.z + 0.5);
        cameraTargetLookAt.current.set(targetOrgan.cameraTarget.x, targetOrgan.cameraTarget.y, targetOrgan.cameraTarget.z);
      }
    } else {
      abqoorMeshRef.current.visible = false;
    }
  }, [isJourneyRunning, journeyStepIndex]);

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
      {/* 3D Canvas mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Hover Tooltip in 3D scene */}
      {hoveredOrgan && tooltipPos && !isJourneyRunning && (
        <div
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 45}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="pointer-events-none absolute z-30 px-3 py-1.5 rounded-lg bg-slate-900/95 border border-emerald-500/50 text-white text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2 animate-fadeIn"
        >
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: hoveredOrgan.colorHex }}
          />
          <span>{hoveredOrgan.name}</span>
          <span className="text-[10px] text-emerald-400 font-normal">({hoveredOrgan.categoryLabel})</span>
        </div>
      )}

      {/* Floating View Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => {
            cameraTargetPos.current.set(0, 0.8, 6.0);
            cameraTargetLookAt.current.set(0, 0.8, 0);
            onSelectOrgan({} as OrganInfo); // reset selection
          }}
          className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-all shadow-md backdrop-blur-md flex items-center gap-1.5"
          title="إعادة ضبط زاوية الرؤية"
        >
          <span>🔄</span>
          <span>إعادة الرؤية الرئيسية</span>
        </button>
      </div>

      {/* 360 Hint Banner */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-slate-900/70 border border-slate-800 text-slate-300 text-xs text-center backdrop-blur-md pointer-events-none flex items-center gap-2">
        <span>🌐</span>
        <span>نموذج ثلاثي الأبعاد: انقر واسحب للتدوير 360° | استخدم العجلة للتكبير | انقر على أي عضو للاستكشاف</span>
      </div>
    </div>
  );
};
