import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const Triangle = () => {
  const vertices = new Float32Array([
    0, 1, 0,
    -1, -1, 0,
    1, -1, 0,
  ]);

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={3}
          array={vertices}
          itemSize={3}
        />
      </bufferGeometry>
      <meshStandardMaterial color="#00ff00" side={2} />
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
        <Triangle />
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
