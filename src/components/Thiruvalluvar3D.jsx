/* eslint-disable react/no-unknown-property */
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Lotus Petals on Pedestal
const LotusPetalRing = ({ count = 16, radius = 1.15, yPos = -1.2, color = "#92400e" }) => {
  const petals = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      items.push({ x, z, rotationY: -angle + Math.PI / 2 });
    }
    return items;
  }, [count, radius]);

  const petalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.35,
    metalness: 0.25,
    flatShading: false
  }), [color]);

  return (
    <group position={[0, yPos, 0]}>
      {petals.map((p, idx) => (
        <mesh 
          key={idx} 
          position={[p.x, 0, p.z]} 
          rotation={[-0.35, p.rotationY, 0]} 
          material={petalMaterial}
          castShadow 
          receiveShadow
        >
          <coneGeometry args={[0.16, 0.42, 5]} />
        </mesh>
      ))}
    </group>
  );
};

// Divine Rotating Halo with Sacred Radiance
const GoldenHalo = ({ radius = 1.35, position = [0, 1.45, -0.28] }) => {
  const haloRef = useRef();
  const innerHaloRef = useRef();

  useFrame((state, delta) => {
    if (haloRef.current) haloRef.current.rotation.z += delta * 0.2;
    if (innerHaloRef.current) innerHaloRef.current.rotation.z -= delta * 0.35;
  });

  const goldHaloMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    emissive: '#d97706',
    emissiveIntensity: 0.85,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: false
  }), []);

  const innerRaysMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#fef08a',
    wireframe: true,
    transparent: true,
    opacity: 0.45
  }), []);

  return (
    <group position={position}>
      {/* Outer Halo Ring */}
      <mesh ref={haloRef} material={goldHaloMaterial}>
        <torusGeometry args={[radius, 0.045, 16, 64]} />
      </mesh>
      {/* Sacred Sun Rays */}
      <mesh ref={innerHaloRef} material={innerRaysMaterial}>
        <ringGeometry args={[radius * 0.6, radius * 0.95, 24, 2]} />
      </mesh>
      {/* Central Radiance Glow Point */}
      <pointLight color="#fde047" intensity={1.5} distance={3.5} />
    </group>
  );
};

// Palm-Leaf Manuscript (Olai Chuvadi) with Sacred Stylus (Ezhuthani)
const OlaiChuvadi = ({ position = [0.42, 0.28, 0.48], rotation = [0.2, 0.5, -0.15] }) => {
  const manuscriptTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Background parchment tone
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 0, 512, 128);
    
    // Wood grain lines
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 11 + 5);
      ctx.lineTo(512, i * 11 + 5);
      ctx.stroke();
    }
    
    // Inscribed Tamil verse
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 16px serif';
    ctx.fillText('அகர முதல எழுத்தெல்லாம் ஆதி', 24, 45);
    ctx.fillText('பகவன் முதற்றே உலகு.', 24, 85);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  const manuscriptMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: manuscriptTexture,
    roughness: 0.4,
    metalness: 0.1
  }), [manuscriptTexture]);

  const stylusMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#b45309',
    metalness: 0.9,
    roughness: 0.2
  }), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Palm leaf strips tied together */}
      <mesh castShadow material={manuscriptMat}>
        <boxGeometry args={[0.55, 0.04, 0.12]} />
      </mesh>
      {/* Binding cords */}
      <mesh position={[-0.18, 0, 0]}>
        <torusGeometry args={[0.045, 0.008, 8, 16]} />
        <meshBasicMaterial color="#b91c1c" />
      </mesh>
      <mesh position={[0.18, 0, 0]}>
        <torusGeometry args={[0.045, 0.008, 8, 16]} />
        <meshBasicMaterial color="#b91c1c" />
      </mesh>
      {/* Iron / Brass Stylus (Ezhuthani) */}
      <mesh position={[0.05, 0.08, 0.02]} rotation={[0.4, 0.2, 0.8]} material={stylusMat}>
        <cylinderGeometry args={[0.012, 0.003, 0.3, 8]} />
      </mesh>
    </group>
  );
};

// Detailed 3D Valluvar Sculpt with Real Texture Mapping & Depth
const SculptedValluvar = ({ textureUrl, mouseParallax = true }) => {
  const groupRef = useRef();
  const portraitMeshRef = useRef();

  // Load portrait texture
  const portraitTexture = useMemo(() => {
    const rawBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || './';
    const cleanBase = rawBase.endsWith('/') ? rawBase : (rawBase + '/');
    const finalUrl = textureUrl || `${cleanBase}valluvar_hero.jpg`;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(finalUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, [textureUrl]);

  // Premium Classical Granite & Bronze Materials
  const graniteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#78350f', // warm terracotta sandstone
    roughness: 0.45,
    metalness: 0.25
  }), []);

  const goldTrimMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    metalness: 0.85,
    roughness: 0.2,
    emissive: '#b45309',
    emissiveIntensity: 0.25
  }), []);

  const skinToneMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d97706',
    roughness: 0.5,
    metalness: 0.1
  }), []);

  const beardMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    roughness: 0.3,
    metalness: 0.1,
    flatShading: false
  }), []);

  const robeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#fefce8',
    roughness: 0.6,
    metalness: 0.05
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Gentle meditative breathing animation
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.035;

    // Mouse parallax reaction
    if (mouseParallax) {
      const targetRotY = (state.mouse.x * 0.35);
      const targetRotX = (-state.mouse.y * 0.15);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* 1. THREE-TIERED SACRED DRAVIDIAN PEDESTAL */}
      <group position={[0, -1.5, 0]}>
        {/* Tier 1: Base Octagonal Foundation */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow material={graniteMaterial}>
          <cylinderGeometry args={[1.5, 1.65, 0.3, 8]} />
        </mesh>
        {/* Gold Border Trim */}
        <mesh position={[0, 0.32, 0]} material={goldTrimMaterial}>
          <torusGeometry args={[1.48, 0.025, 8, 32]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>

        {/* Tier 2: Mid Carved Layer */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow material={graniteMaterial}>
          <cylinderGeometry args={[1.25, 1.4, 0.35, 12]} />
        </mesh>

        {/* Tier 3: Lotus Capital Base */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow material={graniteMaterial}>
          <cylinderGeometry args={[1.1, 1.2, 0.22, 16]} />
        </mesh>
        <LotusPetalRing count={18} radius={1.12} yPos={0.88} color="#b45309" />
      </group>

      {/* 2. MEDITATIVE SEATED POSE (Padmasana Base & Flowing Dhoti) */}
      <group position={[0, -0.6, 0]}>
        {/* Folded Legs Cross Base */}
        <mesh position={[0, 0, 0.05]} castShadow receiveShadow material={robeMaterial}>
          <boxGeometry args={[1.65, 0.38, 0.95]} />
        </mesh>
        {/* Left Knee Curve */}
        <mesh position={[-0.75, 0.02, 0.1]} rotation={[0, 0.3, 0]} castShadow material={robeMaterial}>
          <cylinderGeometry args={[0.22, 0.28, 0.5, 8]} />
        </mesh>
        {/* Right Knee Curve */}
        <mesh position={[0.75, 0.02, 0.1]} rotation={[0, -0.3, 0]} castShadow material={robeMaterial}>
          <cylinderGeometry args={[0.22, 0.28, 0.5, 8]} />
        </mesh>
        {/* Golden Border on Lower Dhoti */}
        <mesh position={[0, -0.15, 0.52]} material={goldTrimMaterial}>
          <boxGeometry args={[1.4, 0.04, 0.04]} />
        </mesh>
      </group>

      {/* 3. TORSO & DRAPED CLOTH (Angavastram) */}
      <group position={[0, 0, 0]}>
        {/* Main Torso */}
        <mesh position={[0, -0.05, 0]} castShadow material={robeMaterial}>
          <cylinderGeometry args={[0.42, 0.58, 0.85, 12]} />
        </mesh>
        {/* Angavastram Robe Swathe (Diagonal draped across left shoulder) */}
        <mesh position={[-0.12, 0.08, 0.12]} rotation={[0.2, 0.1, -0.45]} castShadow material={goldTrimMaterial}>
          <boxGeometry args={[0.3, 0.9, 0.18]} />
        </mesh>
        {/* Sacred Poonool Thread */}
        <mesh position={[0.02, 0.05, 0.26]} rotation={[0.2, 0, -0.65]} material={goldTrimMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
        </mesh>
      </group>

      {/* 4. SHOULDERS & ARMS */}
      {/* Left Arm: Resting in Gyana Mudra */}
      <group position={[-0.55, 0.22, 0]}>
        <mesh castShadow material={robeMaterial}>
          <sphereGeometry args={[0.18, 12, 12]} />
        </mesh>
        <mesh position={[-0.08, -0.28, 0.06]} rotation={[0.3, 0, 0.35]} castShadow material={skinToneMaterial}>
          <cylinderGeometry args={[0.11, 0.09, 0.45, 8]} />
        </mesh>
        <mesh position={[0.02, -0.55, 0.26]} rotation={[-0.5, 0.4, 0.2]} castShadow material={skinToneMaterial}>
          <cylinderGeometry args={[0.09, 0.07, 0.42, 8]} />
        </mesh>
        <mesh position={[0.1, -0.68, 0.42]} castShadow material={skinToneMaterial}>
          <sphereGeometry args={[0.09, 8, 8]} />
        </mesh>
      </group>

      {/* Right Arm: Raised Gracefully Holding Olai Chuvadi */}
      <group position={[0.55, 0.22, 0]}>
        <mesh castShadow material={skinToneMaterial}>
          <sphereGeometry args={[0.18, 12, 12]} />
        </mesh>
        <mesh position={[0.08, -0.22, 0.12]} rotation={[-0.4, 0, -0.3]} castShadow material={skinToneMaterial}>
          <cylinderGeometry args={[0.11, 0.09, 0.42, 8]} />
        </mesh>
        <mesh position={[0.02, -0.15, 0.35]} rotation={[0.8, -0.2, 0.1]} castShadow material={skinToneMaterial}>
          <cylinderGeometry args={[0.09, 0.07, 0.42, 8]} />
        </mesh>
      </group>

      {/* Palm Leaf Manuscript (Olai Chuvadi) */}
      <OlaiChuvadi position={[0.45, 0.08, 0.52]} rotation={[0.25, 0.4, -0.15]} />

      {/* 5. NECK & HEAD SCULPT */}
      <group position={[0, 0.55, 0]}>
        <mesh position={[0, -0.05, 0]} castShadow material={skinToneMaterial}>
          <cylinderGeometry args={[0.16, 0.2, 0.22, 10]} />
        </mesh>

        <mesh position={[0, 0.22, 0.04]} castShadow material={skinToneMaterial}>
          <sphereGeometry args={[0.26, 16, 16]} />
        </mesh>

        {/* Forehead Vibhuthi */}
        <mesh position={[0, 0.33, 0.28]} material={goldTrimMaterial}>
          <boxGeometry args={[0.18, 0.035, 0.02]} />
        </mesh>

        {/* Serene Flowing Beard */}
        <group position={[0, 0.08, 0.22]}>
          <mesh rotation={[0.25, 0, 0]} castShadow material={beardMaterial}>
            <coneGeometry args={[0.22, 0.65, 12]} />
          </mesh>
          <mesh position={[-0.08, 0.02, -0.02]} rotation={[0.3, 0.15, 0.1]} material={beardMaterial}>
            <coneGeometry args={[0.14, 0.48, 8]} />
          </mesh>
          <mesh position={[0.08, 0.02, -0.02]} rotation={[0.3, -0.15, -0.1]} material={beardMaterial}>
            <coneGeometry args={[0.14, 0.48, 8]} />
          </mesh>
          <mesh position={[0, 0.14, 0.08]} rotation={[0, 0, Math.PI]} material={beardMaterial}>
            <torusGeometry args={[0.09, 0.025, 8, 16, Math.PI]} />
          </mesh>
        </group>

        {/* Kondai Topknot Hair Bun */}
        <group position={[0.06, 0.48, -0.05]}>
          <mesh castShadow material={beardMaterial}>
            <sphereGeometry args={[0.14, 12, 12]} />
          </mesh>
          <mesh position={[0, 0.02, 0]} material={goldTrimMaterial}>
            <torusGeometry args={[0.11, 0.02, 8, 24]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
        </group>
      </group>

      {/* 6. DIVINE LUMINOUS GOLDEN HALO */}
      <GoldenHalo radius={1.25} position={[0, 0.85, -0.32]} />

      {/* 7. HIGH-RESOLUTION PORTRAIT RELIEF BACKING */}
      <mesh ref={portraitMeshRef} position={[0, 0.35, -0.35]} castShadow>
        <planeGeometry args={[2.4, 2.8, 32, 32]} />
        <meshStandardMaterial 
          map={portraitTexture} 
          roughness={0.5} 
          metalness={0.15}
          transparent={true}
          opacity={0.92}
        />
      </mesh>
    </group>
  );
};

// Main Exported 3D Thiruvalluvar Studio Canvas
export default function Thiruvalluvar3D({
  width = "100%",
  height = "100%",
  enableControls = true,
  autoRotate = false,
  mouseParallax = true,
  onLoaded
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (onLoaded) onLoaded();
    }, 300);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#b45309',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          zIndex: 10
        }}>
          ✨ 3D திருவள்ளுவர் காட்சி தயாராகிறது...
        </div>
      )}

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.3, 3.8], fov: 42, near: 0.1, far: 50 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.75} color="#fffbeb" />
        <directionalLight 
          position={[4, 6, 4]} 
          intensity={1.6} 
          color="#fef08a" 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        <directionalLight position={[-4, 3, -3]} intensity={1.2} color="#f59e0b" />
        <pointLight position={[0, -2, 2]} intensity={0.6} color="#93c5fd" />

        <Sparkles 
          count={75} 
          scale={5.5} 
          size={3.5} 
          speed={0.4} 
          color="#fbbf24" 
          opacity={0.7} 
        />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <SculptedValluvar textureUrl="valluvar_hero.jpg" mouseParallax={mouseParallax} />
        </Float>

        {enableControls && (
          <OrbitControls 
            enableZoom={true} 
            minDistance={2.2} 
            maxDistance={6.0} 
            maxPolarAngle={Math.PI / 1.75} 
            minPolarAngle={Math.PI / 3.5} 
            autoRotate={autoRotate}
            autoRotateSpeed={0.6}
            enablePan={false}
            dampingFactor={0.08}
          />
        )}
      </Canvas>
    </div>
  );
}
