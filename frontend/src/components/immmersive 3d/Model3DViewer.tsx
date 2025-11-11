// import { useEffect, useRef } from 'react';
// // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import * as THREE from 'three';

// interface Model3DViewerProps {
//     modelUrl: string;
//     className?: string;
// }

// export default function Model3DViewer({
//     modelUrl,
//     className = '',
// }: Model3DViewerProps) {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const sceneRef = useRef<THREE.Scene | null>(null);
//     const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//     const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//     const controlsRef = useRef<OrbitControls | null>(null);
//     const modelRef = useRef<THREE.Object3D | null>(null);

//     useEffect(() => {
//         if (!containerRef.current) return;

//         // Scene setup
//         const scene = new THREE.Scene();
//         sceneRef.current = scene;

//         // Camera setup
//         const camera = new THREE.PerspectiveCamera(
//             75,
//             containerRef.current.clientWidth /
//                 containerRef.current.clientHeight,
//             0.1,
//             1000
//         );
//         camera.position.z = 5;
//         cameraRef.current = camera;

//         // Renderer setup
//         const renderer = new THREE.WebGLRenderer({
//             antialias: true,
//             alpha: true,
//         });
//         renderer.setSize(
//             containerRef.current.clientWidth,
//             containerRef.current.clientHeight
//         );
//         renderer.setPixelRatio(window.devicePixelRatio);
//         renderer.outputEncoding = THREE.sRGBEncoding;
//         containerRef.current.appendChild(renderer.domElement);
//         rendererRef.current = renderer;

//         // Controls setup
//         const controls = new OrbitControls(camera, renderer.domElement);
//         controls.enableDamping = true;
//         controls.dampingFactor = 0.05;
//         controls.screenSpacePanning = false;
//         controls.minDistance = 2;
//         controls.maxDistance = 10;
//         controls.maxPolarAngle = Math.PI / 2;
//         controlsRef.current = controls;

//         // Lighting
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//         scene.add(ambientLight);

//         const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//         directionalLight.position.set(5, 5, 5);
//         scene.add(directionalLight);

//         const loader = new GLTFLoader();
//         loader.load(modelUrl, (gltf) => {
//             if (modelRef.current) {
//                 scene.remove(modelRef.current);
//             }

//             const model = gltf.scene;
//             model.scale.set(1, 1, 1); // Adjust scale as needed
//             scene.add(model);
//             modelRef.current = model;

//             // Center the model
//             const box = new THREE.Box3().setFromObject(model);
//             const center = box.getCenter(new THREE.Vector3());
//             model.position.sub(center);

//             // Adjust camera to fit model
//             const size = box.getSize(new THREE.Vector3());
//             const maxDim = Math.max(size.x, size.y, size.z);
//             camera.position.z = maxDim * 2;
//             controls.target.set(0, 0, 0);
//             controls.update();
//         });

//         // Animation loop
//         const animate = () => {
//             requestAnimationFrame(animate);
//             controls.update();
//             renderer.render(scene, camera);
//         };
//         animate();

//         // Resize handler
//         const handleResize = () => {
//             if (!containerRef.current) return;

//             const width = containerRef.current.clientWidth;
//             const height = containerRef.current.clientHeight;

//             camera.aspect = width / height;
//             camera.updateProjectionMatrix();
//             renderer.setSize(width, height);
//         };

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//             if (containerRef.current && renderer.domElement) {
//                 containerRef.current.removeChild(renderer.domElement);
//             }
//             renderer.dispose();
//         };
//     }, [modelUrl]);

//     return (
//         <div ref={containerRef} className={className}>
//             {/* Canvas will be added here */}
//         </div>
//     );
// }

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

export default function Model3DViewer({ modelUrl }: { modelUrl: string }) {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} />
                <Model url={modelUrl} />
                <OrbitControls enableDamping />
            </Canvas>
        </div>
    );
}
