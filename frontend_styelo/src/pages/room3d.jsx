
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
RotateCw,Move,Trash2,Download,Grid,Square,Layout
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
  const [roomShape, setRoomShape] = useState('rectangle'); // rectangle, l-shape
  const [roomDimensions, setRoomDimensions] = useState({ 
    width: 20, 
    height: 12, 
    depth: 16,
    // L-shape specific dimensions
    lWidth: 12,
    lDepth: 10
  });
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [viewMode, setViewMode] = useState('perspective');
  const [roomColor, setRoomColor] = useState('#f5f5dc');

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
    },
    {
      id: 'chest_hauga',
      name: 'HAUGA Chest',
      type: 'storage',
      dimensions: { width: 2, height: 2, depth: 1.5 },
      color: '#f5f5f5',
      price: 3000
    },
    {
      id: 'chest_malm_tall',
      name: 'MALM Tall Chest',
      type: 'storage',
      dimensions: { width: 1.5, height: 3.5, depth: 1.2 },
      color: '#deb887',
      price: 4000
    },
    {
      id: 'chest_malm_wide',
      name: 'MALM Wide Chest',
      type: 'storage',
      dimensions: { width: 2.5, height: 2, depth: 1.2 },
      color: '#8B4513',
      price: 5000
    },
    {
      id: 'chest_malm_narrow',
      name: 'MALM Narrow',
      type: 'storage',
      dimensions: { width: 1.2, height: 2.5, depth: 1 },
      color: '#654321',
      price: 2000
    },
    {
      id: 'chest_malm_pine',
      name: 'MALM Pine Chest',
      type: 'storage',
      dimensions: { width: 2, height: 2.5, depth: 1.2 },
      color: '#daa520',
      price: 7000
    },
    {
      id: 'chest_malm_gray',
      name: 'MALM Gray Chest',
      type: 'storage',
      dimensions: { width: 2, height: 3, depth: 1.2 },
      color: '#808080',
      price: 6000
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
    camera.position.set(20, 15, 20);
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
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(15, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -25;
    directionalLight.shadow.camera.right = 25;
    directionalLight.shadow.camera.top = 25;
    directionalLight.shadow.camera.bottom = -25;
    scene.add(directionalLight);

    // Create room
    createRoom();

    // Create grid
    if (showGrid) {
      createGrid();
    }

    // Mouse controls
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
      camera.position.clampLength(5, 50);
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
  }, [roomDimensions, showGrid, roomShape]);

  const createRoom = () => {
    const scene = sceneRef.current;
    
    // Remove existing room
    const existingRoom = scene.getObjectByName('room');
    if (existingRoom) {
      scene.remove(existingRoom);
    }

    const roomGroup = new THREE.Group();
    roomGroup.name = 'room';

    if (roomShape === 'l-shape') {
      createLShapedRoom(roomGroup);
    } else {
      createRectangularRoom(roomGroup);
    }

    scene.add(roomGroup);
  };

  const createRectangularRoom = (roomGroup) => {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: roomColor });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: new THREE.Color(roomColor).multiplyScalar(0.9),
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

    // Front wall
    const frontWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    frontWall.position.set(0, roomDimensions.height / 2, roomDimensions.depth / 2);
    frontWall.rotation.y = Math.PI;
    roomGroup.add(frontWall);
  };

  const createLShapedRoom = (roomGroup) => {
    const { width, depth, lWidth, lDepth, height } = roomDimensions;
    
  
    // Main rectangle (larger area)
    const mainFloorGeometry = new THREE.PlaneGeometry(width, depth);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: roomColor });
    const mainFloor = new THREE.Mesh(mainFloorGeometry, floorMaterial);
    mainFloor.rotation.x = -Math.PI / 2;
    mainFloor.position.set(0, 0, 0);
    mainFloor.receiveShadow = true;
    roomGroup.add(mainFloor);

    // Extension rectangle (smaller area)
    const extFloorGeometry = new THREE.PlaneGeometry(lWidth, lDepth);
    const extFloor = new THREE.Mesh(extFloorGeometry, floorMaterial);
    extFloor.rotation.x = -Math.PI / 2;
    extFloor.position.set((width + lWidth) / 2, 0, (depth - lDepth) / 2);
    extFloor.receiveShadow = true;
    roomGroup.add(extFloor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: new THREE.Color(roomColor).multiplyScalar(0.9),
      transparent: true,
      opacity: 0.8
    });

    // Main room walls
    // Back wall (main)
    const backWallGeometry = new THREE.PlaneGeometry(width, height);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, height / 2, -depth / 2);
    roomGroup.add(backWall);

    // Left wall (main)
    const leftWallGeometry = new THREE.PlaneGeometry(depth, height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-width / 2, height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    roomGroup.add(leftWall);

    // Right wall (main) - partial
    const rightWallPartial = new THREE.PlaneGeometry(depth - lDepth, height);
    const rightWallP = new THREE.Mesh(rightWallPartial, wallMaterial);
    rightWallP.position.set(width / 2, height / 2, -lDepth / 2);
    rightWallP.rotation.y = -Math.PI / 2;
    roomGroup.add(rightWallP);

    // Front wall (main) - partial
    const frontWallPartial = new THREE.PlaneGeometry(width, height);
    const frontWallP = new THREE.Mesh(frontWallPartial, wallMaterial);
    frontWallP.position.set(0, height / 2, depth / 2);
    frontWallP.rotation.y = Math.PI;
    roomGroup.add(frontWallP);

    // Extension walls
    // Extension back wall
    const extBackWallGeometry = new THREE.PlaneGeometry(lWidth, height);
    const extBackWall = new THREE.Mesh(extBackWallGeometry, wallMaterial);
    extBackWall.position.set((width + lWidth) / 2, height / 2, (depth - lDepth) / 2 - lDepth / 2);
    roomGroup.add(extBackWall);

    // Extension right wall
    const extRightWallGeometry = new THREE.PlaneGeometry(lDepth, height);
    const extRightWall = new THREE.Mesh(extRightWallGeometry, wallMaterial);
    extRightWall.position.set(width / 2 + lWidth, height / 2, (depth - lDepth) / 2);
    extRightWall.rotation.y = -Math.PI / 2;
    roomGroup.add(extRightWall);

    // Extension front wall
    const extFrontWall = new THREE.Mesh(extBackWallGeometry, wallMaterial);
    extFrontWall.position.set((width + lWidth) / 2, height / 2, depth / 2);
    extFrontWall.rotation.y = Math.PI;
    roomGroup.add(extFrontWall);

    // Inner corner walls
    const innerWall1 = new THREE.PlaneGeometry(lWidth, height);
    const innerW1 = new THREE.Mesh(innerWall1, wallMaterial);
    innerW1.position.set(width / 2 + lWidth / 2, height / 2, (depth - lDepth) / 2);
    innerW1.rotation.y = Math.PI;
    roomGroup.add(innerW1);

    const innerWall2 = new THREE.PlaneGeometry(lDepth, height);
    const innerW2 = new THREE.Mesh(innerWall2, wallMaterial);
    innerW2.position.set(width / 2, height / 2, (depth - lDepth) / 2 + lDepth / 2);
    innerW2.rotation.y = Math.PI / 2;
    roomGroup.add(innerW2);
  };

  const createGrid = () => {
    const scene = sceneRef.current;
    
    // Remove existing grid
    const existingGrid = scene.getObjectByName('grid');
    if (existingGrid) {
      scene.remove(existingGrid);
    }

    if (!showGrid) return;

    const gridSize = Math.max(roomDimensions.width + roomDimensions.lWidth, roomDimensions.depth);
    const gridHelper = new THREE.GridHelper(
      gridSize + 5,
      Math.floor(gridSize / 2),
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
        camera.position.set(0, 25, 0);
        camera.lookAt(0, 0, 0);
        break;
      case 'side':
        camera.position.set(30, 10, 0);
        camera.lookAt(0, 0, 0);
        break;
      default:
        camera.position.set(20, 15, 20);
        camera.lookAt(0, 0, 0);
    }
  };

  const exportRoom = () => {
    const roomData = {
      dimensions: roomDimensions,
      shape: roomShape,
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

  const calculateTotalCost = () => {
    return furnitureItems.reduce((total, item) => total + item.price, 0);
  };

  const resetRoom = () => {
    sceneRef.current.children.forEach(child => {
      if (child.userData.id) {
        sceneRef.current.remove(child);
      }
    });
    setFurnitureItems([]);
    setSelectedObject(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Room Designer</h1>
          <p className="text-gray-600">Design your perfect room layout</p>
        </div>

        {/* Room Shape Selection */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Room Shape</h3>
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setRoomShape('rectangle')}
              className={`flex-1 p-3 rounded-lg border-2 ${
                roomShape === 'rectangle' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Square className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Rectangle</div>
            </button>
            
            <button
              onClick={() => setRoomShape('l-shape')}
              className={`flex-1 p-3 rounded-lg border-2 ${
                roomShape === 'l-shape' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Layout className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">L-Shape</div>
            </button>
          </div>
        </div>

        {/* Room Controls */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Room Dimensions</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Width: {roomDimensions.width}m
              </label>
              <input
                type="range"
                min="12"
                max="25"
                value={roomDimensions.width}
                onChange={(e) => setRoomDimensions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Depth: {roomDimensions.depth}m
              </label>
              <input
                type="range"
                min="10"
                max="20"
                value={roomDimensions.depth}
                onChange={(e) => setRoomDimensions(prev => ({ ...prev, depth: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            {roomShape === 'l-shape' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extension Width: {roomDimensions.lWidth}m
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="15"
                    value={roomDimensions.lWidth}
                    onChange={(e) => setRoomDimensions(prev => ({ ...prev, lWidth: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extension Depth: {roomDimensions.lDepth}m
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="15"
                    value={roomDimensions.lDepth}
                    onChange={(e) => setRoomDimensions(prev => ({ ...prev, lDepth: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height: {roomDimensions.height}m
              </label>
              <input
                type="range"
                min="8"
                max="16"
                value={roomDimensions.height}
                onChange={(e) => setRoomDimensions(prev => ({ ...prev, height: parseInt(e.target.value) }))}
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
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Furniture Catalog</h3>
          
          <div className="space-y-3">
            {furnitureCatalog.map((item) => (
              <button
                key={item.id}
                onClick={() => addFurniture(item.id)}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center gap-3"
              >
                <div 
                  className="w-10 h-10 rounded flex items-center justify-center text-lg flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                >
                  {item.type === 'storage' ? '📦' : item.type === 'seating' ? '🪑' : '🛏️'}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500">Rs. {item.price.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">
                    {item.dimensions.width}×{item.dimensions.depth}×{item.dimensions.height}m
                  </div>
                </div>
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