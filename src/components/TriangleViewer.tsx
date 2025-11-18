import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import * as THREE from "three";

const TriangularPrism = () => {
  const vertices = new Float32Array([
    0, 0.5, 0.5,      
    -0.5, -0.5, 0.5,  
    0.5, -0.5, 0.5,   
    0, 0.5, -0.5,     
    -0.5, -0.5, -0.5, 
    0.5, -0.5, -0.5,  
  ]);

  const indices = new Uint16Array([
    0, 1, 2,
    3, 5, 4,
    1, 4, 2,
    2, 4, 5,
    0, 4, 1,
    0, 3, 4,
    0, 2, 5,
    0, 5, 3,
  ]);

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={6}
          array={vertices}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          array={indices}
          count={indices.length}
          itemSize={1}
        />
      </bufferGeometry>
      <meshStandardMaterial 
        color="hsl(210, 100%, 70%)" 
        transparent 
        opacity={0.5}
        side={2}
      />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(vertices, 3)).setIndex(new THREE.BufferAttribute(indices, 1))]} />
        <lineBasicMaterial attach="material" color="hsl(210, 100%, 70%)" />
      </lineSegments>
    </mesh>
  );
};

const Cube = () => {
  return (
    <>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="hsl(210, 100%, 70%)" 
          transparent 
          opacity={0.5}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial attach="material" color="hsl(210, 100%, 70%)" />
      </lineSegments>
    </>
  );
};

const Sphere = () => {
  return (
    <>
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial 
          color="hsl(210, 100%, 70%)" 
          transparent 
          opacity={0.5}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.SphereGeometry(0.7, 32, 32)]} />
        <lineBasicMaterial attach="material" color="hsl(210, 100%, 70%)" />
      </lineSegments>
    </>
  );
};


export const TriangleViewer = ({ shape = "triangle" }: { shape?: "triangle" | "square" | "circle" }) => {
  const controlsRef = useRef<any>(null);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    }
  };

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[3, 3, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {shape === "triangle" && <TriangularPrism />}
        {shape === "square" && <Cube />}
        {shape === "circle" && <Sphere />}
        <OrbitControls ref={controlsRef} enableDamping />
      </Canvas>
      
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-background"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-background"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className="bg-background"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
