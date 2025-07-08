import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Home, Grid3x3, Eye, Save, MoreHorizontal, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const predefinedFurniture = [
  { name: "Bed", path: "/models/bed.glb" },
  { name: "Lamp", path: "/models/lamp.glb" },
  { name: "Sofa", path: "/models/sofa.glb" },
  { name: "Table", path: "/models/table.glb" },
  { name: "Cupboard", path: "/models/chair.glb" },
  { name: "SideTable", path: "/models/sidetable.glb" },
];

const texturePaths = {
  wood: "/textures/wood.jpg",
  tile: "/textures/tile.jpg",
  carpet: "/textures/carpet.jpg",
  concrete: "/textures/concrete.jpg",
};

const RoomDesigner3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const selectedRef = useRef(null); 
  const floorMeshRef = useRef(null);

  const [viewMode, setViewMode] = useState("dollhouse");
  const [wallColor, setWallColor] = useState("#cccccc");
  const [floorType, setFloorType] = useState("wood");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showRotationNote, setShowRotationNote] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Helper to apply floor texture
  const applyFloorTexture = (type) => {
    if (!floorMeshRef.current) return;
    const loader = new THREE.TextureLoader();
    loader.load(texturePaths[type], (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4); // repeat for better scale
      floorMeshRef.current.material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        metalness: 0.2,
      });
      floorMeshRef.current.material.needsUpdate = true;
    });
  };

  // Main Three.js initialization useEffect
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f5f5f5");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(8, 10, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const loader = new GLTFLoader();
    const excludeMeshes = ["Object_4", "Object_7"]; 

    loader.load("/models/empty_room.glb", (gltf) => {
      const room = gltf.scene;

      room.traverse((child) => {
        if (child.isMesh) {
          if (child.name === "Object_3") {
            floorMeshRef.current = child;
            applyFloorTexture(floorType);
            child.name = "FloorMesh";
          } else if (!excludeMeshes.includes(child.name)) {
            // Wall recolor
            if (
              child.material &&
              (child.material.type === "MeshStandardMaterial" ||
                child.material.type === "MeshPhongMaterial")
            ) {
              child.material.color.set(wallColor);
              child.material.needsUpdate = true;
            }
            child.name = "WallMesh_" + child.name; 
          } else {
          
            child.visible = true;
          }
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(room);
    });

    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    handleResize();
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
   
      scene.children.forEach(object => {
          
          if (object.isMesh) {
              object.geometry.dispose();
              if (Array.isArray(object.material)) {
                  object.material.forEach(material => material.dispose());
              } else {
                  object.material.dispose();
              }
          }
          scene.remove(object);
      });
      renderer.dispose();
      controls.dispose();
    };
  }, []); 


  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((child) => {
      if (
        child.isMesh &&
        child.name.startsWith("WallMesh_") &&
        child.material &&
        (child.material.type === "MeshStandardMaterial" ||
          child.material.type === "MeshPhongMaterial")
      ) {
        child.material.color.set(wallColor);
        child.material.needsUpdate = true;
      }
    });
  }, [wallColor]);

  useEffect(() => {
    applyFloorTexture(floorType);
  }, [floorType]);

  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;

    const onMouseDown = (e) => {

      if (e.target !== rendererRef.current.domElement) return;

      const bounds = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
  
      const intersects = raycaster.intersectObjects(
        sceneRef.current.children,
        true
      );

      
      const target = intersects.find(
        (i) => i.object.parent?.userData?.draggable
      );

      if (target) {
        selectedRef.current = target.object.parent;
        isDragging = true;
  
        setShowRotationNote(true);
      } else {
        selectedRef.current = null;

        setShowRotationNote(false);
      }
    };

    const onMouseMove = (e) => {
      if (!isDragging || !selectedRef.current) return;
      const bounds = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
    
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); 
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(floorPlane, intersectionPoint);

      if (intersectionPoint) {
        selectedRef.current.position.set(
          intersectionPoint.x,
          selectedRef.current.position.y, 
          intersectionPoint.z
        );
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onKeyDown = (e) => {
      if (!selectedRef.current) return;

      if (e.key === "r" || e.key === "R") { 
        selectedRef.current.rotation.y += Math.PI / 8; 
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault(); 
        removeSelectedFurniture();
      }
    };

    const onWheel = (e) => {
      if (!selectedRef.current) return;
      e.preventDefault(); 
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      const newScale = Math.max(0.1, selectedRef.current.scale.x * (1 + delta)); 
      selectedRef.current.scale.set(newScale, newScale, newScale);
    };

    const dom = rendererRef.current.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    dom.addEventListener("mousemove", onMouseMove);
    dom.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("wheel", onWheel); 
    window.addEventListener("keydown", onKeyDown); 

    return () => {
      dom.removeEventListener("mousedown", onMouseDown);
      dom.removeEventListener("mousemove", onMouseMove);
      dom.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []); 

  // Function to add furniture model
  const handleAddFurniture = (path) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      const model = gltf.scene;
      model.userData.draggable = true; 

      const scaleFactor = 2.5; 
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);

      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      model.position.set(-center.x, size.y / 2 - center.y, -center.z);

      sceneRef.current.add(model);
      selectedRef.current = model; 
      setShowRotationNote(true); 
    });
  };


  const removeSelectedFurniture = () => {
    if (selectedRef.current && sceneRef.current) {
      sceneRef.current.remove(selectedRef.current);
     
      selectedRef.current.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      selectedRef.current = null; 
      setShowRotationNote(false); 
    }
  };

  const switchView = (mode) => {
    setViewMode(mode);
    const camera = cameraRef.current;
    if (mode === "dollhouse") {
      camera.position.set(8, 10, 8);
    } else if (mode === "top") {
      camera.position.set(0, 25, 0); 
    } else if (mode === "side") {
      camera.position.set(0, 5, 15); 
    }
   
    camera.lookAt(0, 0, 0);
    controlsRef.current.update(); 
  };

  const handleSaveLayout = () => {
 
    const furniture = sceneRef.current.children
      .filter((obj) => obj.userData?.draggable) 
      .map((obj) => ({
  
        position: obj.position.toArray(),
        rotation: obj.rotation.toArray(),
        scale: obj.scale.toArray(),

      }));

    localStorage.setItem("roomLayout", JSON.stringify(furniture));
    alert("Layout saved to localStorage!");
  };

  // Download snapshot image from canvas
  const handleDownloadSnapshot = () => {
    if (!rendererRef.current) return;
    try {
      const originalClearAlpha = rendererRef.current.getClearAlpha();
      const originalClearColor = new THREE.Color();
      rendererRef.current.getClearColor(originalClearColor);

      if (!sceneRef.current.background) {
          rendererRef.current.setClearColor(0xffffff); // White
          rendererRef.current.setClearAlpha(1);
          rendererRef.current.render(sceneRef.current, cameraRef.current);
      }


      const dataURL = rendererRef.current.domElement.toDataURL("image/png");

      if (!sceneRef.current.background) {
          rendererRef.current.setClearColor(originalClearColor);
          rendererRef.current.setClearAlpha(originalClearAlpha);
      }


      const link = document.createElement("a");
      link.download = "room_snapshot.png";
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Failed to download snapshot:", e);
      alert("Failed to download snapshot. Please ensure your browser supports canvas.toDataURL.");
    }
  };


return (
  <div className="h-screen bg-white flex flex-col font-poppins">
    {/* Top Navigation */}
    <div className="w-full bg-white border-b border-black/30 px-6 py-4 shadow-sm flex justify-between items-center z-10">
      <div className="flex items-center gap-4"> 
        <button
          onClick={() => navigate('/')} 
          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-300 flex items-center gap-2 transition"
          title="Back to Home"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">🛋️ Design Your Room</h1>
      </div>
      <div className="flex items-center gap-3">
        {selectedRef.current && (
          <button
            onClick={removeSelectedFurniture}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 flex items-center gap-2 transition"
            title="Remove Selected Furniture (Del/Backspace)"
          >
            <Trash2 size={18} />
            Remove
          </button>
        )}
        <button
          onClick={handleSaveLayout}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 flex items-center gap-2 transition"
        >
          <Save size={18} />
          Save Layout
        </button>
        <button
          onClick={handleDownloadSnapshot}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 flex items-center gap-2 transition"
        >
           Snapshot
        </button>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-300 transition"
          title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          showSidebar ? "w-80" : "w-0"
        } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-black/30 flex justify-between items-center bg-white">
          <h2 className="text-lg font-semibold text-gray-800">Add Items</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Furniture List */}
          <div className="space-y-4">
            {predefinedFurniture.map((item) => (
              <div
                key={item.name}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <button
                    onClick={() => handleAddFurniture(item.path)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Wall Color */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
               Wall Color
            </label>
            <input
              type="color"
              value={wallColor}
              onChange={(e) => setWallColor(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 cursor-pointer"
            />
          </div>

          {/* Floor Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              🪵 Floor Type
            </label>
            <select
              value={floorType}
              onChange={(e) => setFloorType(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="wood">Wood</option>
              <option value="tile">Tile</option>
              <option value="carpet">Carpet</option>
              <option value="concrete">Concrete</option>
            </select>
          </div>
        </div>
      </aside>

      {/* 3D Viewport */}
      <main className="flex-1 relative bg-white">
        <div ref={mountRef} className="w-full h-full" />

        {/* User Interaction Notes */}
        {showRotationNote && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-800 text-sm py-2 px-4 rounded-lg shadow-md flex items-center gap-2 animate-fade-in z-20">
            <span role="img" aria-label="info">💡</span>
            Selected! Press 'R' to Rotate, use scroll wheel to Scale, click & drag to Move.
            <button
                onClick={() => setShowRotationNote(false)}
                className="ml-2 text-blue-600 hover:text-blue-900 font-semibold"
            >
                &times;
            </button>
          </div>
        )}

        {/* View Mode Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-2 flex items-center space-x-3">
            <button
              onClick={() => switchView("dollhouse")}
              className={`p-2 rounded-xl transition ${
                viewMode === "dollhouse" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              title="Dollhouse View"
            >
              <Home size={18} />
            </button>
            <button
              onClick={() => switchView("top")}
              className={`p-2 rounded-xl transition ${
                viewMode === "top" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              title="Top View"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => switchView("side")}
              className={`p-2 rounded-xl transition ${
                viewMode === "side" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              title="Side View"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
);
};

export default RoomDesigner3D;