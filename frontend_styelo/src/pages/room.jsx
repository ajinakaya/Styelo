import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Home, 
  RotateCw, 
  Move, 
  Trash2, 
  Save, 
  Download, 
  Upload,
  Settings,
  Palette,
  Maximize2,
  Grid,
  Eye,
  EyeOff
} from 'lucide-react';

const RoomDesigner3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  
  const [selectedObject, setSelectedObject] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [roomDimensions, setRoomDimensions] = useState({ width: 20, height: 12, depth: 16 });
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [viewMode, setViewMode] = useState('perspective'); // perspective, top, side
  const [roomColor, setRoomColor] = useState('#f5f5f5');

  // Furniture catalog
  const furnitureCatalog = [
    {
      id: 'sofa',
      name: 'Sofa',
      type: 'seating',
      dimensions: { width: 4, height: 1.5, depth: 2 },
      color: '#8B4513',
      price: 25000
    },
    {
      id: 'chair',
      name: 'Chair',
      type: 'seating',
      dimensions: { width: 1.5, height: 1.8, depth: 1.5 },
      color: '#654321',
      price: 8000
    },
    {
      id: 'table',
      name: 'Coffee Table',
      type: 'table',
      dimensions: { width: 2, height: 0.8, depth: 1.2 },
      color: '#D2691E',
      price: 12000
    },
    {
      id: 'bed',
      name: 'Bed',
      type: 'bedroom',
      dimensions: { width: 3, height: 1, depth: 4 },
      color: '#8B4513',
      price: 35000
    },
    {
      id: 'wardrobe',
      name: 'Wardrobe',
      type: 'storage',
      dimensions: { width: 2.5, height: 4, depth: 1 },
      color: '#654321',
      price: 28000
    },
    {
      id: 'desk',
      name: 'Desk',
      type: 'office',
      dimensions: { width: 2.5, height: 1.5, depth: 1.2 },
      color: '#D2691E',
      price: 15000
    }
  ];

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 12, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create room
    createRoom();

    // Create grid
    if (showGrid) {
      createGrid();
    }

    // Basic controls (manual implementation since OrbitControls isn't available)
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseDown = (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseMove = (event) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      // Rotate camera around the scene
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);

      mouseX = event.clientX;
      mouseY = event.clientY;

      handleMouseMove(event);
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (event) => {
      const scale = event.deltaY > 0 ? 1.1 : 0.9;
      camera.position.multiplyScalar(scale);
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.dispose();
    };
  }, [roomDimensions, showGrid]);

  const createRoom = () => {
    const scene = sceneRef.current;
    
    // Remove existing room
    const existingRoom = scene.getObjectByName('room');
    if (existingRoom) {
      scene.remove(existingRoom);
    }

    const roomGroup = new THREE.Group();
    roomGroup.name = 'room';

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: roomColor });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: roomColor,
      transparent: true,
      opacity: 0.8
    });

    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, roomDimensions.height / 2, -roomDimensions.depth / 2);
    roomGroup.add(backWall);

    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-roomDimensions.width / 2, roomDimensions.height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    roomGroup.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    rightWall.position.set(roomDimensions.width / 2, roomDimensions.height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    roomGroup.add(rightWall);

    scene.add(roomGroup);
  };

  const createGrid = () => {
    const scene = sceneRef.current;
    
    // Remove existing grid
    const existingGrid = scene.getObjectByName('grid');
    if (existingGrid) {
      scene.remove(existingGrid);
    }

    if (!showGrid) return;

    const gridHelper = new THREE.GridHelper(
      Math.max(roomDimensions.width, roomDimensions.depth),
      20,
      0x888888,
      0xcccccc
    );
    gridHelper.name = 'grid';
    scene.add(gridHelper);
  };

  const createFurniture = (item) => {
    const geometry = new THREE.BoxGeometry(
      item.dimensions.width,
      item.dimensions.height,
      item.dimensions.depth
    );
    const material = new THREE.MeshLambertMaterial({ color: item.color });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.y = item.dimensions.height / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { ...item, id: Date.now() + Math.random() };
    
    return mesh;
  };

  const addFurniture = (furnitureType) => {
    const furnitureTemplate = furnitureCatalog.find(item => item.id === furnitureType);
    if (!furnitureTemplate) return;

    const furniture = createFurniture(furnitureTemplate);
    furniture.position.set(0, furniture.position.y, 0);
    
    sceneRef.current.add(furniture);
    setFurnitureItems(prev => [...prev, furniture.userData]);
  };

  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object.userData.id) {
        setSelectedObject(object);
      }
    } else {
      setSelectedObject(null);
    }
  };

  const handleMouseMove = (event) => {
    if (!selectedObject || !isDragging) return;

    const rect = event.target.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    // Create a plane at y=0 for dragging
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    
    if (raycasterRef.current.ray.intersectPlane(plane, intersection)) {
      selectedObject.position.x = intersection.x;
      selectedObject.position.z = intersection.z;
    }
  };

  const deleteSelected = () => {
    if (selectedObject) {
      sceneRef.current.remove(selectedObject);
      setFurnitureItems(prev => prev.filter(item => item.id !== selectedObject.userData.id));
      setSelectedObject(null);
    }
  };

  const rotateSelected = () => {
    if (selectedObject) {
      selectedObject.rotation.y += Math.PI / 2;
    }
  };

  const changeViewMode = (mode) => {
    const camera = cameraRef.current;
    setViewMode(mode);

    switch (mode) {
      case 'top':
        camera.position.set(0, 20, 0);
        camera.lookAt(0, 0, 0);
        break;
      case 'side':
        camera.position.set(25, 8, 0);
        camera.lookAt(0, 0, 0);
        break;
      default:
        camera.position.set(15, 12, 15);
        camera.lookAt(0, 0, 0);
    }
  };

  const exportRoom = () => {
    const roomData = {
      dimensions: roomDimensions,
      furniture: furnitureItems.map(item => ({
        ...item,
        position: selectedObject?.position || { x: 0, y: 0, z: 0 },
        rotation: selectedObject?.rotation || { x: 0, y: 0, z: 0 }
      })),
      roomColor
    };
    
    const blob = new Blob([JSON.stringify(roomData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'room-design.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Room Designer</h1>
          <p className="text-gray-600">Drag & drop furniture to design your room</p>
        </div>

        {/* Room Controls */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Room Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width: {roomDimensions.width}m
              </label>
              <input
                type="range"
                min="10"
                max="30"
                value={roomDimensions.width}
                onChange={(e) => setRoomDimensions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Depth: {roomDimensions.depth}m
              </label>
              <input
                type="range"
                min="8"
                max="25"
                value={roomDimensions.depth}
                onChange={(e) => setRoomDimensions(prev => ({ ...prev, depth: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Color
              </label>
              <input
                type="color"
                value={roomColor}
                onChange={(e) => setRoomColor(e.target.value)}
                className="w-full h-10 rounded border"
              />
            </div>
          </div>
        </div>

        {/* Furniture Catalog */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Furniture Catalog</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {furnitureCatalog.map((item) => (
              <button
                key={item.id}
                onClick={() => addFurniture(item.id)}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: item.color }}>
                  📦
                </div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">Rs. {item.price.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Object Controls */}
        {selectedObject && (
          <div className="p-6 border-t bg-blue-50">
            <h3 className="text-lg font-semibold mb-4">Selected: {selectedObject.userData.name}</h3>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsDragging(!isDragging)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium ${
                  isDragging 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                <Move className="w-4 h-4 inline mr-1" />
                {isDragging ? 'Stop' : 'Move'}
              </button>
              
              <button
                onClick={rotateSelected}
                className="py-2 px-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              
              <button
                onClick={deleteSelected}
                className="py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => changeViewMode('perspective')}
                  className={`px-3 py-1 rounded ${viewMode === 'perspective' ? 'bg-white shadow' : ''}`}
                >
                  3D
                </button>
                <button
                  onClick={() => changeViewMode('top')}
                  className={`px-3 py-1 rounded ${viewMode === 'top' ? 'bg-white shadow' : ''}`}
                >
                  Top
                </button>
                <button
                  onClick={() => changeViewMode('side')}
                  className={`px-3 py-1 rounded ${viewMode === 'side' ? 'bg-white shadow' : ''}`}
                >
                  Side
                </button>
              </div>

              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg ${showGrid ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={exportRoom}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <div ref={mountRef} className="w-full h-full" />
          
          {/* Instructions */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-4 max-w-xs">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click and drag to rotate view</li>
              <li>• Scroll to zoom in/out</li>
              <li>• Click furniture to select</li>
              <li>• Use Move mode to drag furniture</li>
              <li>• Add furniture from the sidebar</li>
            </ul>
          </div>

          {/* Total Cost */}
          <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-4">
            <div className="text-lg font-semibold">
              Total Cost: Rs. {furnitureItems.reduce((total, item) => total + (item.price || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDesigner3D;