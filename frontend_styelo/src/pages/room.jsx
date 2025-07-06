// RoomDesigner3D.js
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

const RoomDesigner = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const dragControlsRef = useRef();

  const [roomDimensions, setRoomDimensions] = useState({ width: 20, height: 10, depth: 16 });
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#f4f4f4');
  const [furniturePrice, setFurniturePrice] = useState(0);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(20, 15, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const loader = new THREE.TextureLoader();
    const woodTexture = loader.load('/textures/light_wood.jpg');
    woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(roomDimensions.width / 2, roomDimensions.depth / 2);

    const floorMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
    const floorGeometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: selectedColor, side: THREE.DoubleSide });

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMaterial
    );
    backWall.position.set(0, roomDimensions.height / 2, -roomDimensions.depth / 2);
    scene.add(backWall);

    const windowGeometry = new THREE.PlaneGeometry(4, 2);
    const windowMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, opacity: 0.5, transparent: true });
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
    windowMesh.position.set(0, 6, -roomDimensions.depth / 2 + 0.01);
    scene.add(windowMesh);

    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial
    );
    leftWall.position.set(-roomDimensions.width / 2, roomDimensions.height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial
    );
    rightWall.position.set(roomDimensions.width / 2, roomDimensions.height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    const frontWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMaterial
    );
    frontWall.position.set(0, roomDimensions.height / 2, roomDimensions.depth / 2);
    frontWall.rotation.y = Math.PI;
    scene.add(frontWall);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 8, -roomDimensions.depth / 2 + 1);
    scene.add(pointLight);

    const furnitureMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const table = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2), furnitureMaterial);
    table.position.set(0, 0.5, 0);
    table.castShadow = true;
    scene.add(table);

    const chair = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x555555 }));
    chair.position.set(4, 0.5, 2);
    chair.castShadow = true;
    scene.add(chair);

    setFurnitureItems([table, chair]);
    setFurniturePrice(150);

    const dragControls = new DragControls([table, chair], camera, renderer.domElement);
    dragControlsRef.current = dragControls;

    dragControls.addEventListener('dragstart', () => { controls.enabled = false; });
    dragControls.addEventListener('dragend', () => { controls.enabled = true; });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [selectedColor]);

  const addFurniture = (type) => {
    const scene = sceneRef.current;
    let furniture;
    let price = 0;

    switch (type) {
      case 'table':
        furniture = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2), new THREE.MeshStandardMaterial({ color: 0x8b4513 }));
        price = 100;
        break;
      case 'chair':
        furniture = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x555555 }));
        price = 50;
        break;
      case 'bed':
        furniture = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 2), new THREE.MeshStandardMaterial({ color: 0x334455 }));
        price = 200;
        break;
      default:
        return;
    }

    furniture.position.set(0, 0.5, 0);
    furniture.castShadow = true;
    scene.add(furniture);

    const updatedItems = [...furnitureItems, furniture];
    setFurnitureItems(updatedItems);
    setFurniturePrice(prev => prev + price);

    const dragControls = new DragControls(updatedItems, cameraRef.current, rendererRef.current.domElement);
    dragControls.addEventListener('dragstart', () => controlsRef.current.enabled = false);
    dragControls.addEventListener('dragend', () => controlsRef.current.enabled = true);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div ref={mountRef} style={{ width: '80vw', height: '100vh' }} />
      <div style={{ width: '20vw', padding: '1rem', background: '#f9f9f9', borderLeft: '1px solid #ddd' }}>
        <h3 className="text-xl font-semibold mb-4">Add Furniture</h3>
        <button onClick={() => addFurniture('table')} className="mb-2">Add Table</button><br />
        <button onClick={() => addFurniture('chair')} className="mb-2">Add Chair</button><br />
        <button onClick={() => addFurniture('bed')} className="mb-4">Add Bed</button>

        <h4 className="mt-4 font-medium">Change Wall Color</h4>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="mb-4"
        />

        <h4 className="mt-4 font-medium">Room Dimensions</h4>
        <label>Width: {roomDimensions.width}m</label>
        <input type="range" min="10" max="30" value={roomDimensions.width} onChange={(e) => setRoomDimensions({ ...roomDimensions, width: parseInt(e.target.value) })} /><br />
        <label>Height: {roomDimensions.height}m</label>
        <input type="range" min="8" max="20" value={roomDimensions.height} onChange={(e) => setRoomDimensions({ ...roomDimensions, height: parseInt(e.target.value) })} /><br />
        <label>Depth: {roomDimensions.depth}m</label>
        <input type="range" min="10" max="30" value={roomDimensions.depth} onChange={(e) => setRoomDimensions({ ...roomDimensions, depth: parseInt(e.target.value) })} /><br />

        <h4 className="mt-4 font-medium">Total Price: Rs {furniturePrice}</h4>
      </div>
    </div>
  );
};

export default RoomDesigner;