import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const TriangularPrism = () => {
  // Define vertices for a triangular prism (6 vertices: 3 for front face, 3 for back face)
  const vertices = new Float32Array([
    // Front triangle face
    0, 0.5, 0.5,      // top
    -0.5, -0.5, 0.5,  // bottom left
    0.5, -0.5, 0.5,   // bottom right
    // Back triangle face
    0, 0.5, -0.5,     // top
    -0.5, -0.5, -0.5, // bottom left
    0.5, -0.5, -0.5,  // bottom right
  ]);

  // Define faces using indices (triangles)
  const indices = new Uint16Array([
    // Front face
    0, 1, 2,
    // Back face
    3, 5, 4,
    // Bottom face (rectangle made of 2 triangles)
    1, 4, 2,
    2, 4, 5,
    // Left side face
    0, 4, 1,
    0, 3, 4,
    // Right side face
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
      <meshStandardMaterial color="hsl(217, 91%, 60%)" side={2} />
    </mesh>
  );
};

const Grid = () => {
  return (
    <gridHelper args={[10, 10, 0x888888, 0x444444]} />
  );
};

export const TriangleViewer = () => {
  const controlsRef = useRef<any>(null);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
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
        <TriangularPrism />
        <Grid />
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
