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

  const edgeGeometry = new THREE.BufferGeometry();
  edgeGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vertices, 3)
  );
  edgeGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

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
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color="hsl(210, 100%, 70%)" />
      </lineSegments>
    </mesh>
  );
};

const Cube = () => {
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
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
      <lineSegments geometry={boxGeo}>
        <lineBasicMaterial color="hsl(210, 100%, 70%)" />
      </lineSegments>
    </>
  );
};

const Sphere = () => {
  const sphereGeo = new THREE.SphereGeometry(0.7, 32, 32);
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
      <lineSegments geometry={sphereGeo}>
        <lineBasicMaterial color="hsl(210, 100%, 70%)" />
      </lineSegments>
    </>
  );
};

type TriangleViewerProps = {
  shape?: "triangle" | "square" | "circle";
  width?: number;
  depth?: number;
  height?: number;
};

export const TriangleViewer = ({
  shape = "triangle",
  width,
  depth,
  height,
}: TriangleViewerProps) => {
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

  const hasDims =
    width !== undefined || depth !== undefined || height !== undefined;

  return (
    <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden">
      {/* Dimensions overlay */}
      {hasDims && (
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-md px-3 py-2 text-xs space-y-1 z-10">
          <div className="font-medium text-[11px] tracking-wide">
            Dimensions (mm)
          </div>
          {width !== undefined && <div>Width: {width}</div>}
          {depth !== undefined && <div>Depth: {depth}</div>}
          {height !== undefined && <div>Height: {height}</div>}
        </div>
      )}

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
