import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Text, 
  Box, 
  Plane, 
  useTexture, 
  Environment,
  Html,
  PositionalAudio,
  useGLTF,
  Detailed,
  Preload
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  DepthOfField, 
  Vignette,
  SSAO
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { 
  X, 
  Info, 
  Navigation, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Map,
  Compass,
  Radio,
  Glasses,
  Play
} from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================
interface Artifact {
  id: number;
  name: string;
  category: string;
  period: string;
  description: string;
  position: [number, number, number];
  imageUrl?: string;
  model3dUrl?: string;
  audioUrl?: string;
}

interface TeleportPoint {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: number;
}

interface TourStop {
  artifactId: number;
  duration: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  narration?: string;
}

interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
}

interface CameraState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: { pitch: number; yaw: number };
  headBobPhase: number;
}

interface VisitorPresence {
  id: string;
  position: [number, number, number];
  rotation: number;
  name: string;
  color: string;
}

// ==================== CUSTOM HOOKS ====================
function useKeyboardControls() {
  const [movement, setMovement] = useState<MovementState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'w':
        case 'arrowup':
          setMovement(m => ({ ...m, forward: true }));
          break;
        case 's':
        case 'arrowdown':
          setMovement(m => ({ ...m, backward: true }));
          break;
        case 'a':
        case 'arrowleft':
          setMovement(m => ({ ...m, left: true }));
          break;
        case 'd':
        case 'arrowright':
          setMovement(m => ({ ...m, right: true }));
          break;
        case 'shift':
          setMovement(m => ({ ...m, sprint: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'w':
        case 'arrowup':
          setMovement(m => ({ ...m, forward: false }));
          break;
        case 's':
        case 'arrowdown':
          setMovement(m => ({ ...m, backward: false }));
          break;
        case 'a':
        case 'arrowleft':
          setMovement(m => ({ ...m, left: false }));
          break;
        case 'd':
        case 'arrowright':
          setMovement(m => ({ ...m, right: false }));
          break;
        case 'shift':
          setMovement(m => ({ ...m, sprint: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
}

// Audio Manager Hook
function useAudioManager(soundEnabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const footstepSoundsRef = useRef<AudioBuffer[]>([]);
  const ambientSoundRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      // Load footstep sounds (placeholder - would load actual files)
      // loadFootstepSounds();
      // playAmbientSound();
    }
    return () => {
      if (ambientSoundRef.current) {
        ambientSoundRef.current.stop();
      }
    };
  }, [soundEnabled]);

  const playFootstep = () => {
    if (!soundEnabled || !audioContextRef.current) return;
    // Play random footstep sound
  };

  return { playFootstep };
}

// ==================== LIGHTING SYSTEM ====================
function MuseumLighting() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x1a1a1a, 0.025);
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.35} color="#f8f9fa" />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.0}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-8, 3, -10]} intensity={0.5} color="#ff8c00" distance={15} />
      <pointLight position={[8, 3, -10]} intensity={0.5} color="#ff8c00" distance={15} />
    </>
  );
}

// ==================== MUSEUM ARCHITECTURE ====================
function MuseumArchitecture() {
  // Use texture for floor (with compression and lazy loading)
  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#0e1a2b');
      gradient.addColorStop(1, '#1a2332');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    return texture;
  }, []);

  return (
    <group name="architecture">
      {/* Floor with texture */}
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        args={[60, 60]}
        receiveShadow
      >
        <meshStandardMaterial
          map={floorTexture}
          roughness={0.4}
          metalness={0.2}
          envMapIntensity={0.5}
        />
      </Plane>

      {/* Ceiling */}
      <Plane
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 5, 0]}
        args={[60, 60]}
      >
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </Plane>

      {/* Walls */}
      <Box position={[0, 2.5, -30]} args={[60, 5, 0.5]} receiveShadow castShadow>
        <meshStandardMaterial color="#2f4f4f" roughness={0.9} metalness={0.1} />
      </Box>
      <Box position={[0, 2.5, 30]} args={[60, 5, 0.5]} receiveShadow castShadow>
        <meshStandardMaterial color="#2f4f4f" roughness={0.9} metalness={0.1} />
      </Box>
      <Box position={[-30, 2.5, 0]} args={[0.5, 5, 60]} receiveShadow castShadow>
        <meshStandardMaterial color="#2f4f4f" roughness={0.9} metalness={0.1} />
      </Box>
      <Box position={[30, 2.5, 0]} args={[0.5, 5, 60]} receiveShadow castShadow>
        <meshStandardMaterial color="#2f4f4f" roughness={0.9} metalness={0.1} />
      </Box>

      {/* Gallery dividers */}
      <Box position={[0, 2.5, -10]} args={[30, 5, 0.3]} receiveShadow castShadow>
        <meshStandardMaterial color="#36454f" roughness={0.85} metalness={0.15} />
      </Box>
    </group>
  );
}

// ==================== EXHIBIT WITH LOD ====================
function ExhibitPedestal({ 
  position, 
  artifact, 
  onSelect,
  distance = 0
}: { 
  position: [number, number, number]; 
  artifact: Artifact; 
  onSelect: (artifact: Artifact) => void;
  distance?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.SpotLight>(null);

  // LOD - Level of Detail based on distance
  const lodLevel = distance < 10 ? 'high' : distance < 20 ? 'medium' : 'low';

  useFrame((state) => {
    if (meshRef.current && hovered && lodLevel === 'high') {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 0.5;
      meshRef.current.rotation.y += 0.01;
    } else if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = 0.5;
    }

    if (lightRef.current) {
      lightRef.current.intensity = hovered ? 2.0 : 1.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Pedestal - simplified for distant views */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.5, lodLevel === 'low' ? 8 : 32]} />
        <meshStandardMaterial 
          color={hovered ? "#3d3d3d" : "#2a2a2a"} 
          roughness={0.3} 
          metalness={0.7}
        />
      </mesh>

      {/* Artifact representation with LOD */}
      <Detailed distances={[0, 10, 20]}>
        {/* High detail */}
        <mesh
          ref={meshRef}
          position={[0, 0.5, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onSelect(artifact)}
          castShadow
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={hovered ? '#ff8c00' : '#f8f9fa'}
            emissive={hovered ? '#ff8c00' : '#000000'}
            emissiveIntensity={hovered ? 0.3 : 0}
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>

        {/* Medium detail */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color='#f8f9fa' />
        </mesh>

        {/* Low detail */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshBasicMaterial color='#f8f9fa' />
        </mesh>
      </Detailed>

      {/* Spotlight */}
      {lodLevel !== 'low' && (
        <spotLight
          ref={lightRef}
          position={[0, 4, 0]}
          angle={0.4}
          penumbra={0.5}
          intensity={1.5}
          color="#fff5e6"
          castShadow
        />
      )}

      {/* Label - only show when close */}
      {distance < 15 && (
        <Html position={[0, 1.5, 0]} center distanceFactor={8}>
          <div 
            className={`px-3 py-1 rounded-lg transition-all duration-300 ${
              hovered 
                ? 'bg-orange-500 text-white scale-110' 
                : 'bg-white/10 text-white/80 backdrop-blur-sm'
            }`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {artifact.name}
          </div>
        </Html>
      )}
    </group>
  );
}

// ==================== TELEPORT POINT ====================
function TeleportPoint({ 
  point, 
  onTeleport 
}: { 
  point: TeleportPoint; 
  onTeleport: (point: TeleportPoint) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.2;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={point.position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onTeleport(point)}
      >
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
        <meshStandardMaterial
          color={hovered ? '#ff8c00' : '#4a90e2'}
          emissive={hovered ? '#ff8c00' : '#4a90e2'}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      <Html position={[0, 0.8, 0]} center distanceFactor={8}>
        <div className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-lg">
          {point.name}
        </div>
      </Html>
    </group>
  );
}

// ==================== VISITOR AVATAR ====================
function VisitorAvatar({ visitor }: { visitor: VisitorPresence }) {
  return (
    <group position={visitor.position} rotation={[0, visitor.rotation, 0]}>
      {/* Avatar body */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.6, 16]} />
        <meshStandardMaterial color={visitor.color} />
      </mesh>
      
      {/* Avatar head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={visitor.color} />
      </mesh>

      {/* Name tag */}
      <Html position={[0, 2.2, 0]} center distanceFactor={10}>
        <div className="px-2 py-1 bg-black/80 text-white text-xs rounded backdrop-blur-sm">
          {visitor.name}
        </div>
      </Html>
    </group>
  );
}

// ==================== ADVANCED CAMERA CONTROLLER ====================
function AdvancedCameraController({ 
  locked,
  tourMode,
  tourData,
  onTourComplete
}: { 
  locked: boolean;
  tourMode: boolean;
  tourData?: TourStop;
  onTourComplete?: () => void;
}) {
  const { camera, gl } = useThree();
  const movement = useKeyboardControls();
  
  const state = useRef<CameraState>({
    position: new THREE.Vector3(0, 1.6, 15),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: { pitch: 0, yaw: 0 },
    headBobPhase: 0,
  });

  const params = {
    walkSpeed: 4.0,
    sprintSpeed: 7.0,
    acceleration: 20.0,
    deceleration: 15.0,
    lookSensitivity: 0.002,
    maxPitch: Math.PI / 3,
    minPitch: -Math.PI / 3,
    headBobFrequency: 8.0,
    headBobAmplitude: 0.08,
    inertia: 0.9,
  };

  useEffect(() => {
    camera.position.copy(state.current.position);

    const handleMouseMove = (e: MouseEvent) => {
      if (!document.pointerLockElement || tourMode) return;

      state.current.rotation.yaw -= e.movementX * params.lookSensitivity;
      state.current.rotation.pitch -= e.movementY * params.lookSensitivity;
      state.current.rotation.pitch = THREE.MathUtils.clamp(
        state.current.rotation.pitch,
        params.minPitch,
        params.maxPitch
      );
    };

    const handleClick = () => {
      if (!locked && !tourMode) gl.domElement.requestPointerLock();
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('click', handleClick);

    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [camera, gl, locked, tourMode]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const { position, velocity, rotation, headBobPhase } = state.current;

    if (tourMode && tourData) {
      // Guided tour mode - smooth camera movement to target
      const targetPos = new THREE.Vector3(...tourData.cameraPosition);
      const targetLookAt = new THREE.Vector3(...tourData.cameraTarget);
      
      position.lerp(targetPos, 2 * dt);
      
      const direction = targetLookAt.clone().sub(position).normalize();
      const targetYaw = Math.atan2(direction.x, direction.z);
      const targetPitch = Math.asin(-direction.y);
      
      rotation.yaw = THREE.MathUtils.lerp(rotation.yaw, targetYaw, 3 * dt);
      rotation.pitch = THREE.MathUtils.lerp(rotation.pitch, targetPitch, 3 * dt);
      
      camera.position.copy(position);
      camera.rotation.order = 'YXZ';
      camera.rotation.y = rotation.yaw;
      camera.rotation.x = rotation.pitch;
      
      return;
    }

    if (locked) return;

    // Normal movement mode
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.yaw);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3(1, 0, 0);
    right.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.yaw);
    right.normalize();

    const targetVelocity = new THREE.Vector3();
    const speed = movement.sprint ? params.sprintSpeed : params.walkSpeed;

    if (movement.forward) targetVelocity.add(forward.clone().multiplyScalar(speed));
    if (movement.backward) targetVelocity.add(forward.clone().multiplyScalar(-speed));
    if (movement.left) targetVelocity.add(right.clone().multiplyScalar(-speed));
    if (movement.right) targetVelocity.add(right.clone().multiplyScalar(speed));

    const accel = targetVelocity.length() > 0 ? params.acceleration : params.deceleration;
    velocity.lerp(targetVelocity, accel * dt);
    velocity.multiplyScalar(params.inertia);

    const isMoving = velocity.length() > 0.1;
    if (isMoving) {
      state.current.headBobPhase += params.headBobFrequency * dt;
      const bobOffset = Math.sin(state.current.headBobPhase) * params.headBobAmplitude;
      position.y = 1.6 + bobOffset;
    } else {
      position.y = THREE.MathUtils.lerp(position.y, 1.6, 5 * dt);
      state.current.headBobPhase = 0;
    }

    const newPosition = position.clone().add(velocity.clone().multiplyScalar(dt));
    newPosition.x = THREE.MathUtils.clamp(newPosition.x, -28, 28);
    newPosition.z = THREE.MathUtils.clamp(newPosition.z, -28, 28);
    position.copy(newPosition);

    camera.position.copy(position);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = rotation.yaw;
    camera.rotation.x = rotation.pitch;
  });

  return null;
}

// ==================== MAIN SCENE ====================
function MuseumScene({ 
  artifacts, 
  onArtifactSelect,
  locked,
  tourMode,
  tourData,
  teleportPoints,
  onTeleport,
  visitors
}: { 
  artifacts: Artifact[]; 
  onArtifactSelect: (artifact: Artifact) => void;
  locked: boolean;
  tourMode: boolean;
  tourData?: TourStop;
  teleportPoints: TeleportPoint[];
  onTeleport: (point: TeleportPoint) => void;
  visitors: VisitorPresence[];
}) {
  const { camera } = useThree();

  // Calculate distances for LOD
  const artifactsWithDistance = useMemo(() => {
    return artifacts.map(artifact => ({
      ...artifact,
      distance: camera.position.distanceTo(new THREE.Vector3(...artifact.position))
    }));
  }, [artifacts, camera.position]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.6, 15]} fov={75} />
      <AdvancedCameraController locked={locked} tourMode={tourMode} tourData={tourData} />

      <MuseumLighting />
      <MuseumArchitecture />

      {/* Exhibits with LOD */}
      {artifactsWithDistance.map((artifact) => (
        <ExhibitPedestal
          key={artifact.id}
          position={artifact.position}
          artifact={artifact}
          onSelect={onArtifactSelect}
          distance={artifact.distance}
        />
      ))}

      {/* Teleport points */}
      {teleportPoints.map((point) => (
        <TeleportPoint
          key={point.id}
          point={point}
          onTeleport={onTeleport}
        />
      ))}

      {/* Other visitors */}
      {visitors.map((visitor) => (
        <VisitorAvatar key={visitor.id} visitor={visitor} />
      ))}

      <Environment preset="city" />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom 
          intensity={0.3} 
          luminanceThreshold={0.9} 
          luminanceSmoothing={0.9}
        />
        <DepthOfField 
          focusDistance={0.02} 
          focalLength={0.05} 
          bokehScale={2}
        />
        <Vignette 
          offset={0.3} 
          darkness={0.5}
        />
        <SSAO 
          samples={16}
          radius={0.5}
          intensity={30}
        />
      </EffectComposer>

      {/* Preload assets */}
      <Preload all />
    </>
  );
}

// ==================== MAIN COMPONENT ====================
export default function ImmersiveMuseum() {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [locked, setLocked] = useState(false);
  const [tourMode, setTourMode] = useState(false);
  const [currentTourStop, setCurrentTourStop] = useState(0);
  const [vrMode, setVrMode] = useState(false);

  const { playFootstep } = useAudioManager(soundEnabled);

  // Curated artifact positions
  const artifacts: Artifact[] = [
    { id: 1, name: 'Ancient Pottery', category: 'Ceramics', period: '1200 BC', description: 'Traditional Kikuyu pottery with intricate geometric patterns representing community unity.', position: [-10, 0, -20] },
    { id: 2, name: 'Maasai Spear', category: 'Weapons', period: '1800s', description: 'Ceremonial warrior spear used in coming-of-age rituals.', position: [0, 0, -20] },
    { id: 3, name: 'Beaded Jewelry', category: 'Ornaments', period: '1900s', description: 'Intricate Maasai beadwork with symbolic color meanings.', position: [10, 0, -20] },
    { id: 4, name: 'Wooden Mask', category: 'Art', period: '1600s', description: 'Ritual ceremonial mask used in harvest celebrations.', position: [-15, 0, -8] },
    { id: 5, name: 'Clay Vessel', category: 'Ceramics', period: '1400 BC', description: 'Storage vessel for grains with rain-summoning symbols.', position: [-5, 0, -8] },
    { id: 6, name: 'Iron Tools', category: 'Tools', period: '1700s', description: 'Blacksmith-crafted agricultural implements.', position: [5, 0, -8] },
    { id: 7, name: 'Textile Art', category: 'Textiles', period: '1850s', description: 'Hand-woven fabric with ancestral storytelling patterns.', position: [15, 0, -8] },
    { id: 8, name: 'Ceremonial Drum', category: 'Instruments', period: '1750s', description: 'Traditional drum used in ritual ceremonies.', position: [-10, 0, 5] },
    { id: 9, name: 'Warrior Shield', category: 'Weapons', period: '1800s', description: 'Battle shield with clan identification markings.', position: [0, 0, 5] },
    { id: 10, name: 'Sisal Basket', category: 'Crafts', period: '1900s', description: 'Woven storage basket with traditional dye techniques.', position: [10, 0, 5] },
  ];

  // Teleport points
  const teleportPoints: TeleportPoint[] = [
    { id: 'entrance', name: 'Entrance Hall', position: [0, 0, 25], rotation: Math.PI },
    { id: 'ancient', name: 'Ancient Gallery', position: [0, 0, -15], rotation: 0 },
    { id: 'modern', name: 'Modern Gallery', position: [0, 0, 10], rotation: Math.PI },
  ];

  // Tour stops
  const tourStops: TourStop[] = [
    { artifactId: 1, duration: 8, cameraPosition: [-8, 2, -18], cameraTarget: [-10, 0.5, -20], narration: 'Welcome to our Ancient Pottery exhibit...' },
    { artifactId: 2, duration: 8, cameraPosition: [2, 2, -18], cameraTarget: [0, 0.5, -20], narration: 'This Maasai spear represents...' },
    { artifactId: 3, duration: 8, cameraPosition: [12, 2, -18], cameraTarget: [10, 0.5, -20], narration: 'Beadwork is central to Maasai culture...' },
  ];

  // Simulated visitor presence
  const [visitors, setVisitors] = useState<VisitorPresence[]>([
    { id: '1', position: [-5, 0, -10], rotation: 0, name: 'Visitor 1', color: '#4a90e2' },
    { id: '2', position: [8, 0, 0], rotation: Math.PI / 4, name: 'Visitor 2', color: '#e94b3c' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleArtifactSelect = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setLocked(true);
    document.exitPointerLock();
  };

  const closeModal = () => {
    setSelectedArtifact(null);
    setLocked(false);
  };

  const handleTeleport = (point: TeleportPoint) => {
    // Teleport implementation handled by camera controller
    console.log('Teleporting to:', point.name);
  };

  const startTour = () => {
    setTourMode(true);
    setCurrentTourStop(0);
    setLocked(true);
  };

  const stopTour = () => {
    setTourMode(false);
    setLocked(false);
  };

  const nextTourStop = () => {
    if (currentTourStop < tourStops.length - 1) {
      setCurrentTourStop(currentTourStop + 1);
    } else {
      stopTour();
    }
  };

  const enableVR = async () => {
    // VR mode would use WebXR API
    if ('xr' in navigator) {
      setVrMode(true);
      // Initialize VR session
    }
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Cultural Heritage Museum
            </h1>
            <p className="text-white/60 text-sm mt-1">
              {tourMode ? '🎙️ Guided Tour Mode' : 'Free Exploration Mode'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
              title="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowMiniMap(!showMiniMap)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
              title="Toggle Map"
            >
              <Map className="w-5 h-5" />
            </button>
            <button
              onClick={tourMode ? stopTour : startTour}
              className={`p-3 rounded-lg text-white transition-all duration-300 backdrop-blur-sm border ${
                tourMode 
                  ? 'bg-red-500/90 hover:bg-red-500 border-red-400/50' 
                  : 'bg-green-500/90 hover:bg-green-500 border-green-400/50'
              }`}
              title={tourMode ? 'Stop Tour' : 'Start Guided Tour'}
            >
              <Radio className="w-5 h-5" />
            </button>
            <button
              onClick={enableVR}
              className="p-3 bg-purple-500/90 hover:bg-purple-500 rounded-lg text-white transition-all duration-300 backdrop-blur-sm"
              title="Enable VR Mode"
            >
              <Glasses className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="p-3 bg-orange-500/90 hover:bg-orange-500 rounded-lg text-white transition-all duration-300 backdrop-blur-sm"
              title="Show Instructions"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Instructions Panel */}
      {showInstructions && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-black/95 backdrop-blur-md rounded-2xl p-8 max-w-2xl border border-white/20 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Navigation className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-white">Navigation Guide</h3>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-2">Movement</h4>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs">W</kbd>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs">A</kbd>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs">S</kbd>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs">D</kbd>
                </div>
                <span className="text-white/80 text-sm">Move</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <kbd className="px-3 py-1 bg-white/10 rounded text-xs">SHIFT</kbd>
                <span className="text-white/80 text-sm">Sprint</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <kbd className="px-3 py-1 bg-white/10 rounded text-xs">MOUSE</kbd>
                <span className="text-white/80 text-sm">Look</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-2">Interactions</h4>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <kbd className="px-3 py-1 bg-white/10 rounded text-xs">CLICK</kbd>
                <span className="text-white/80 text-sm">Select artifact</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <kbd className="px-3 py-1 bg-white/10 rounded text-xs">ESC</kbd>
                <span className="text-white/80 text-sm">Release cursor</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 rounded bg-blue-500/30 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-white/80 text-sm">Teleport zones</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-orange-200 text-sm">
                💡 <strong>Tip:</strong> Look for glowing blue circles on the floor to teleport between gallery sections
              </p>
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-200 text-sm">
                🎙️ <strong>Guided Tour:</strong> Click the radio icon to start an automated tour with narration
              </p>
            </div>

            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-purple-200 text-sm">
                🥽 <strong>VR Mode:</strong> Experience the museum in virtual reality (requires VR headset)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tour Controls */}
      {tourMode && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20 bg-black/90 backdrop-blur-md rounded-xl p-6 border border-green-500/30 max-w-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Radio className="w-6 h-6 text-green-400 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">Guided Tour Active</h3>
              <p className="text-white/60 text-sm">
                Stop {currentTourStop + 1} of {tourStops.length}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-white/5 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-green-500 h-full transition-all duration-500"
                style={{ width: `${((currentTourStop + 1) / tourStops.length) * 100}%` }}
              />
            </div>
          </div>

          {tourStops[currentTourStop] && (
            <p className="text-white/80 text-sm mb-4">
              {tourStops[currentTourStop].narration}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={nextTourStop}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              {currentTourStop < tourStops.length - 1 ? 'Next Stop' : 'End Tour'}
            </button>
            <button
              onClick={stopTour}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Exit Tour
            </button>
          </div>
        </div>
      )}

      {/* Mini-Map */}
      {showMiniMap && (
        <div className="absolute bottom-6 right-6 z-20 bg-black/90 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="w-56 h-56 bg-slate-900 rounded-lg relative overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(#ffffff10 1px, transparent 1px), linear-gradient(90deg, #ffffff10 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />

            {/* Artifacts on map */}
            {artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="absolute w-2 h-2 bg-orange-500 rounded-full"
                style={{
                  left: `${((artifact.position[0] + 30) / 60) * 100}%`,
                  top: `${((artifact.position[2] + 30) / 60) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={artifact.name}
              />
            ))}

            {/* Teleport points on map */}
            {teleportPoints.map((point) => (
              <div
                key={point.id}
                className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse"
                style={{
                  left: `${((point.position[0] + 30) / 60) * 100}%`,
                  top: `${((point.position[2] + 30) / 60) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={point.name}
              />
            ))}

            {/* Other visitors on map */}
            {visitors.map((visitor) => (
              <div
                key={visitor.id}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: visitor.color,
                  left: `${((visitor.position[0] + 30) / 60) * 100}%`,
                  top: `${((visitor.position[2] + 30) / 60) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={visitor.name}
              />
            ))}

            {/* Player position */}
            <div className="absolute w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" 
              style={{ left: '50%', top: '50%' }}
            >
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Legend:</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-white/60">Artifacts</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-white/60">Teleports</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visitor Count */}
      <div className="absolute top-32 right-6 z-20 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>{visitors.length} visitors online</span>
        </div>
      </div>

      {/* Artifact Detail Modal */}
      {selectedArtifact && (
        <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                      {selectedArtifact.category}
                    </span>
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                      {selectedArtifact.period}
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {selectedArtifact.name}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* 3D Model Viewer */}
                <div className="space-y-4">
                  <div className="aspect-square bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden">
                    <div className="text-center text-white/40">
                      <div className="w-32 h-32 mx-auto mb-4 border-2 border-white/20 rounded-2xl flex items-center justify-center">
                        <span className="text-6xl">🏺</span>
                      </div>
                      <p className="text-sm">3D Model Viewer</p>
                      <p className="text-xs text-white/30 mt-1">
                        {selectedArtifact.model3dUrl ? 'Loading model...' : 'No 3D model available'}
                      </p>
                    </div>
                  </div>

                  {/* Audio Narration */}
                  {selectedArtifact.audioUrl && (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Volume2 className="w-5 h-5 text-orange-400" />
                        <span className="text-white font-semibold">Audio Guide</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-colors">
                          <Play className="w-4 h-4" />
                        </button>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 w-0" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-orange-400" />
                      Description
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {selectedArtifact.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/60 text-sm mb-1">Category</p>
                      <p className="text-white font-semibold">{selectedArtifact.category}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/60 text-sm mb-1">Historical Period</p>
                      <p className="text-white font-semibold">{selectedArtifact.period}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-blue-400" />
                      Cultural Context
                    </h4>
                    <p className="text-blue-200 text-sm">
                      This artifact represents an important aspect of Kenyan cultural heritage, 
                      reflecting the craftsmanship and traditions of its time period.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Continue Exploring
                    </button>
                    <button
                      className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
                      title="Share"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="absolute bottom-6 left-6 z-20 space-y-2">
        <div className="px-4 py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 text-white/80 text-sm">
          Press <kbd className="px-2 py-1 bg-white/20 rounded mx-1">ESC</kbd> to release cursor
        </div>
        {!document.pointerLockElement && !locked && !tourMode && (
          <div className="px-4 py-2 bg-orange-500/90 backdrop-blur-sm rounded-lg border border-orange-400/50 text-white text-sm font-medium animate-pulse">
            Click canvas to start exploring
          </div>
        )}
      </div>

      {/* Performance Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white/60 text-xs">
        LOD Active • Optimized Rendering
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        className="w-full h-full"
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <MuseumScene
            artifacts={artifacts}
            onArtifactSelect={handleArtifactSelect}
            locked={locked}
            tourMode={tourMode}
            tourData={tourStops[currentTourStop]}
            teleportPoints={teleportPoints}
            onTeleport={handleTeleport}
            visitors={visitors}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}