/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
import { Suspense, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree, invalidate } from '@react-three/fiber';
import { OrbitControls, useGLTF, useFBX, useProgress, Html, Environment, ContactShadows } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
const deg2rad = d => (d * Math.PI) / 180;
const DECIDE = 8;
const ROTATE_SPEED = 0.005;
const INERTIA = 0.925;
const PARALLAX_MAG = 0.05;
const PARALLAX_EASE = 0.12;
const HOVER_MAG = deg2rad(6);
const HOVER_EASE = 0.15;

const Loader = ({ placeholderSrc }) => {
  const { progress, active } = useProgress();
  if (!active && placeholderSrc) return null;
  return (
    <Html center>
      {placeholderSrc ? (
        <img src={placeholderSrc} width={128} height={128} style={{ filter: 'blur(8px)', borderRadius: 8 }} />
      ) : (
        <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
          {Math.round(progress)} %
        </div>
      )}
    </Html>
  );
};

const DesktopControls = ({ pivot, min, max, zoomEnabled }) => {
  const ref = useRef(null);
  useFrame(() => ref.current?.target.copy(pivot));
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableRotate={false}
      enableZoom={zoomEnabled}
      minDistance={min}
      maxDistance={max}
    />
  );
};

/* Custom Procedural Low-Poly 3D Statue of Thiruvalluvar */
const ThiruvalluvarStatue = ({
  autoRotate,
  autoRotateSpeed,
  onLoaded
}) => {
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += autoRotateSpeed * delta;
    }
    // Subtle breathing/floating motion
    if (groupRef.current) {
      groupRef.current.position.y = -1.25 + Math.sin(state.clock.getElapsedTime() * 0.6) * 0.05;
    }
  });

  useEffect(() => {
    if (onLoaded) {
      onLoaded();
    }
  }, [onLoaded]);

  // Slate-grey granite stone material with flatShading for a premium low-poly look
  const stoneMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#334155', // slate-700
    roughness: 0.9,
    metalness: 0.1,
    flatShading: true
  }), []);

  // Palm leaf scroll (Olai Chuvadi) material - warm yellow/parchment tone
  const scrollMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e2e8f0', // slate-200
    roughness: 0.8,
    metalness: 0.0,
    flatShading: true
  }), []);

  return (
    <group ref={groupRef} position={[0, -1.25, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* --- PEDESTAL (3-Tiered Platform representing 38 Chapters of Aram) --- */}
      {/* Base tier */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow material={stoneMaterial}>
        <boxGeometry args={[2.0, 0.4, 2.0]} />
      </mesh>
      {/* Middle tier */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow material={stoneMaterial}>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow material={stoneMaterial}>
        <boxGeometry args={[1.7, 0.2, 1.7]} />
      </mesh>

      {/* --- VALLUVAR FIGURE (Standing Majestic Statue representing 95 Chapters of Porul/Inbam) --- */}
      {/* Lower Garment Base */}
      <mesh position={[0, 1.3, 0]} castShadow receiveShadow material={stoneMaterial}>
        <cylinderGeometry args={[0.45, 0.55, 0.4, 8]} />
      </mesh>

      {/* Torso / Folds of Robe */}
      <mesh position={[0, 1.95, 0]} castShadow receiveShadow material={stoneMaterial}>
        <cylinderGeometry args={[0.32, 0.45, 0.9, 8]} />
      </mesh>

      {/* Chest / Shoulders */}
      <mesh position={[0, 2.55, 0]} castShadow receiveShadow material={stoneMaterial}>
        <cylinderGeometry args={[0.28, 0.32, 0.35, 8]} />
      </mesh>

      {/* Left Shoulder & Arm (Pointing downwards to indicate base values) */}
      <group position={[-0.38, 2.55, 0]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.15, 0]} rotation={[0, 0, 0.2]} castShadow material={stoneMaterial}>
          <cylinderGeometry args={[0.07, 0.06, 0.35, 6]} />
        </mesh>
        {/* Forearm pointing down */}
        <mesh position={[-0.03, -0.4, 0.08]} rotation={[0.4, 0, 0.15]} castShadow material={stoneMaterial}>
          <cylinderGeometry args={[0.06, 0.05, 0.35, 6]} />
        </mesh>
      </group>

      {/* Right Shoulder & Arm (Holding the palm leaf scroll) */}
      <group position={[0.38, 2.55, 0]}>
        {/* Upper Arm raised */}
        <mesh position={[0.08, 0.08, 0.08]} rotation={[-0.4, 0, -0.4]} castShadow material={stoneMaterial}>
          <cylinderGeometry args={[0.07, 0.06, 0.35, 6]} />
        </mesh>
        {/* Forearm bent forward holding scroll */}
        <mesh position={[0.18, 0.2, 0.25]} rotation={[0.7, -0.5, 0]} castShadow material={stoneMaterial}>
          <cylinderGeometry args={[0.06, 0.05, 0.35, 6]} />
        </mesh>
        {/* Palm Leaf Scroll (Olai Chuvadi) */}
        <mesh position={[0.18, 0.28, 0.45]} rotation={[0.2, 0.4, -0.1]} castShadow material={scrollMaterial}>
          <boxGeometry args={[0.4, 0.03, 0.08]} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 2.8, 0]} castShadow material={stoneMaterial}>
        <cylinderGeometry args={[0.12, 0.15, 0.15, 8]} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 3.02, 0.01]} castShadow material={stoneMaterial}>
        <sphereGeometry args={[0.18, 8, 8]} />
      </mesh>

      {/* Hair Bun (Kondai) on the side - Classic Thiruvalluvar feature */}
      <mesh position={[0.1, 3.12, -0.04]} castShadow material={stoneMaterial}>
        <sphereGeometry args={[0.08, 6, 6]} />
      </mesh>

      {/* Beard */}
      <mesh position={[0, 2.85, 0.12]} rotation={[0.3, 0, 0]} castShadow material={stoneMaterial}>
        <coneGeometry args={[0.08, 0.25, 6]} />
      </mesh>
    </group>
  );
};

const ModelInner = ({
  url,
  xOff,
  yOff,
  pivot,
  initYaw,
  initPitch,
  minZoom,
  maxZoom,
  enableMouseParallax,
  enableManualRotation,
  enableHoverRotation,
  enableManualZoom,
  autoFrame,
  fadeIn,
  autoRotate,
  autoRotateSpeed,
  onLoaded
}) => {
  const outer = useRef(null);
  const inner = useRef(null);
  const { camera, gl } = useThree();

  const vel = useRef({ x: 0, y: 0 });
  const tPar = useRef({ x: 0, y: 0 });
  const cPar = useRef({ x: 0, y: 0 });
  const tHov = useRef({ x: 0, y: 0 });
  const cHov = useRef({ x: 0, y: 0 });

  const ext = useMemo(() => url.split('.').pop().toLowerCase(), [url]);
  const content = useMemo(() => {
    if (ext === 'glb' || ext === 'gltf') return useGLTF(url).scene.clone();
    if (ext === 'fbx') return useFBX(url).clone();
    if (ext === 'obj') return useLoader(OBJLoader, url).clone();
    console.error('Unsupported format:', ext);
    return null;
  }, [url, ext]);

  const pivotW = useRef(new THREE.Vector3());
  useLayoutEffect(() => {
    if (!content) return;
    const g = inner.current;
    g.updateWorldMatrix(true, true);

    const sphere = new THREE.Box3().setFromObject(g).getBoundingSphere(new THREE.Sphere());
    const s = 1 / (sphere.radius * 2);
    g.position.set(-sphere.center.x, -sphere.center.y, -sphere.center.z);
    g.scale.setScalar(s);

    g.traverse(o => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (fadeIn) {
          o.material.transparent = true;
          o.material.opacity = 0;
        }
      }
    });

    g.getWorldPosition(pivotW.current);
    pivot.copy(pivotW.current);
    outer.current.rotation.set(initPitch, initYaw, 0);

    if (autoFrame && camera.isPerspectiveCamera) {
      const persp = camera;
      const fitR = sphere.radius * s;
      const d = (fitR * 1.2) / Math.sin((persp.fov * Math.PI) / 180 / 2);
      persp.position.set(pivotW.current.x, pivotW.current.y, pivotW.current.z + d);
      persp.near = d / 10;
      persp.far = d * 10;
      persp.updateProjectionMatrix();
    }

    if (fadeIn) {
      let t = 0;
      const id = setInterval(() => {
        t += 0.05;
        const v = Math.min(t, 1);
        g.traverse(o => {
          if (o.isMesh) o.material.opacity = v;
        });
        invalidate();
        if (v === 1) {
          clearInterval(id);
          onLoaded?.();
        }
      }, 16);
      return () => clearInterval(id);
    } else onLoaded?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    if (!enableManualRotation || isTouch) return;
    const el = gl.domElement;
    let drag = false;
    let lx = 0,
      ly = 0;
    const down = e => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      drag = true;
      lx = e.clientX;
      ly = e.clientY;
      window.addEventListener('pointerup', up);
    };
    const move = e => {
      if (!drag) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      outer.current.rotation.y += dx * ROTATE_SPEED;
      outer.current.rotation.x += dy * ROTATE_SPEED;
      vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED };
      invalidate();
    };
    const up = () => (drag = false);
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl, enableManualRotation]);

  useEffect(() => {
    if (!isTouch) return;
    const el = gl.domElement;
    const pts = new Map();

    let mode = 'idle';
    let sx = 0,
      sy = 0,
      lx = 0,
      ly = 0,
      startDist = 0,
      startZ = 0;

    const down = e => {
      if (e.pointerType !== 'touch') return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) {
        mode = 'decide';
        sx = lx = e.clientX;
        sy = ly = e.clientY;
      } else if (pts.size === 2 && enableManualZoom) {
        mode = 'pinch';
        const [p1, p2] = [...pts.values()];
        startDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        startZ = camera.position.z;
        e.preventDefault();
      }
      invalidate();
    };

    const move = e => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      p.x = e.clientX;
      p.y = e.clientY;

      if (mode === 'decide') {
        const dx = e.clientX - sx;
        const dy = e.clientY - sy;
        if (Math.abs(dx) > DECIDE || Math.abs(dy) > DECIDE) {
          if (enableManualRotation && Math.abs(dx) > Math.abs(dy)) {
            mode = 'rotate';
            el.setPointerCapture(e.pointerId);
          } else {
            mode = 'idle';
            pts.clear();
          }
        }
      }

      if (mode === 'rotate') {
        e.preventDefault();
        const dx = e.clientX - lx;
        const dy = e.clientY - ly;
        lx = e.clientX;
        ly = e.clientY;
        outer.current.rotation.y += dx * ROTATE_SPEED;
        outer.current.rotation.x += dy * ROTATE_SPEED;
        vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED };
        invalidate();
      } else if (mode === 'pinch' && pts.size === 2) {
        e.preventDefault();
        const [p1, p2] = [...pts.values()];
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        const ratio = startDist / d;
        camera.position.z = THREE.MathUtils.clamp(startZ * ratio, minZoom, maxZoom);
        invalidate();
      }
    };

    const up = e => {
      pts.delete(e.pointerId);
      if (mode === 'rotate' && pts.size === 0) mode = 'idle';
      if (mode === 'pinch' && pts.size < 2) mode = 'idle';
    };

    el.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', up, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, enableManualRotation, enableManualZoom, minZoom, maxZoom]);

  useEffect(() => {
    if (isTouch) return;
    const mm = e => {
      if (e.pointerType !== 'mouse') return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (enableMouseParallax) tPar.current = { x: -nx * PARALLAX_MAG, y: -ny * PARALLAX_MAG };
      if (enableHoverRotation) tHov.current = { x: ny * HOVER_MAG, y: nx * HOVER_MAG };
      invalidate();
    };
    window.addEventListener('pointermove', mm);
    return () => window.removeEventListener('pointermove', mm);
  }, [enableMouseParallax, enableHoverRotation]);

  useFrame((_, dt) => {
    let need = false;
    cPar.current.x += (tPar.current.x - cPar.current.x) * PARALLAX_EASE;
    cPar.current.y += (tPar.current.y - cPar.current.y) * PARALLAX_EASE;
    const phx = cHov.current.x,
      phy = cHov.current.y;
    cHov.current.x += (tHov.current.x - cHov.current.x) * HOVER_EASE;
    cHov.current.y += (tHov.current.y - cHov.current.y) * HOVER_EASE;

    const ndc = pivotW.current.clone().project(camera);
    ndc.x += xOff + cPar.current.x;
    ndc.y += yOff + cPar.current.y;
    outer.current.position.copy(ndc.unproject(camera));

    outer.current.rotation.x += cHov.current.x - phx;
    outer.current.rotation.y += cHov.current.y - phy;

    if (autoRotate) {
      outer.current.rotation.y += autoRotateSpeed * dt;
      need = true;
    }

    outer.current.rotation.y += vel.current.x;
    outer.current.rotation.x += vel.current.y;
    vel.current.x *= INERTIA;
    vel.current.y *= INERTIA;
    if (Math.abs(vel.current.x) > 1e-4 || Math.abs(vel.current.y) > 1e-4) need = true;

    if (
      Math.abs(cPar.current.x - tPar.current.x) > 1e-4 ||
      Math.abs(cPar.current.y - tPar.current.y) > 1e-4 ||
      Math.abs(cHov.current.x - tHov.current.x) > 1e-4 ||
      Math.abs(cHov.current.y - tHov.current.y) > 1e-4
    )
      need = true;

    if (need) invalidate();
  });

  if (!content) return null;
  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={content} />
      </group>
    </group>
  );
};

const ModelViewer = ({
  url,
  width = 400,
  height = 400,
  modelXOffset = 0,
  modelYOffset = 0,
  defaultRotationX = -50,
  defaultRotationY = 20,
  defaultZoom = 0.5,
  minZoomDistance = 0.5,
  maxZoomDistance = 10,
  enableMouseParallax = true,
  enableManualRotation = true,
  enableHoverRotation = true,
  enableManualZoom = true,
  ambientIntensity = 0.3,
  keyLightIntensity = 1,
  fillLightIntensity = 0.5,
  rimLightIntensity = 0.8,
  environmentPreset = 'forest',
  autoFrame = false,
  placeholderSrc,
  showScreenshotButton = true,
  fadeIn = false,
  autoRotate = false,
  autoRotateSpeed = 0.35,
  onModelLoaded
}) => {
  const isThiruvalluvar = url === 'thiruvalluvar' || !url;

  // Preload only if loading external GLB files
  useEffect(() => {
    if (!isThiruvalluvar && url) {
      try {
        useGLTF.preload(url);
      } catch (err) {
        console.warn('Could not preload GLTF:', err);
      }
    }
  }, [url, isThiruvalluvar]);

  const pivot = useRef(new THREE.Vector3()).current;
  const contactRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  const initYaw = deg2rad(defaultRotationX);
  const initPitch = deg2rad(defaultRotationY);
  const camZ = Math.min(Math.max(defaultZoom, minZoomDistance), maxZoomDistance);

  const capture = () => {
    const g = rendererRef.current,
      s = sceneRef.current,
      c = cameraRef.current;
    if (!g || !s || !c) return;
    g.shadowMap.enabled = false;
    const tmp = [];
    s.traverse(o => {
      if (o.isLight && 'castShadow' in o) {
        tmp.push({ l: o, cast: o.castShadow });
        o.castShadow = false;
      }
    });
    if (contactRef.current) contactRef.current.visible = false;
    g.render(s, c);
    const urlPNG = g.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = 'model.png';
    a.href = urlPNG;
    a.click();
    g.shadowMap.enabled = true;
    tmp.forEach(({ l, cast }) => (l.castShadow = cast));
    if (contactRef.current) contactRef.current.visible = true;
    invalidate();
  };

  return (
    <div
      className="model-viewer-container"
      style={{
        width,
        height,
        touchAction: 'pan-y pinch-zoom',
        position: 'relative'
      }}
    >
      {showScreenshotButton && (
        <button
          onClick={capture}
          style={{
            position: 'absolute',
            border: '1px solid var(--primary)',
            background: 'var(--background)',
            color: 'var(--primary)',
            right: 16,
            top: 16,
            zIndex: 10,
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          Take Screenshot
        </button>
      )}

      <Canvas
        shadows
        frameloop="always"
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl, scene, camera }) => {
          rendererRef.current = gl;
          sceneRef.current = scene;
          cameraRef.current = camera;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        camera={{ fov: 45, position: [0, 0, camZ], near: 0.01, far: 100 }}
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        {environmentPreset !== 'none' && <Environment preset={environmentPreset} background={false} />}

        <ambientLight intensity={ambientIntensity} />
        {/* Soft, warm key light */}
        <directionalLight position={[5, 8, 5]} intensity={keyLightIntensity} castShadow />
        {/* Cool blue fill light for high contrast modern look */}
        <directionalLight position={[-5, 4, 3]} intensity={fillLightIntensity} color="#90cdf4" />
        {/* Soft back/rim light */}
        <directionalLight position={[0, 6, -5]} intensity={rimLightIntensity} color="#fbd38d" />

        <ContactShadows ref={contactRef} position={[0, -1.25, 0]} opacity={0.4} scale={6} blur={2} />

        <Suspense fallback={<Loader placeholderSrc={placeholderSrc} />}>
          {isThiruvalluvar ? (
            <ThiruvalluvarStatue
              autoRotate={autoRotate}
              autoRotateSpeed={autoRotateSpeed}
              onLoaded={onModelLoaded}
            />
          ) : (
            <ModelInner
              url={url}
              xOff={modelXOffset}
              yOff={modelYOffset}
              pivot={pivot}
              initYaw={initYaw}
              initPitch={initPitch}
              minZoom={minZoomDistance}
              maxZoom={maxZoomDistance}
              enableMouseParallax={enableMouseParallax}
              enableManualRotation={enableManualRotation}
              enableHoverRotation={enableHoverRotation}
              enableManualZoom={enableManualZoom}
              autoFrame={autoFrame}
              fadeIn={fadeIn}
              autoRotate={autoRotate}
              autoRotateSpeed={autoRotateSpeed}
              onLoaded={onModelLoaded}
            />
          )}
        </Suspense>

        {!isTouch && (
          <DesktopControls
            pivot={isThiruvalluvar ? new THREE.Vector3(0, 1.0, 0) : pivot}
            min={minZoomDistance}
            max={maxZoomDistance}
            zoomEnabled={enableManualZoom}
          />
        )}
      </Canvas>
    </div>
  );
};

export default ModelViewer;
