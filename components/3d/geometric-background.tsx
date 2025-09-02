"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Box, Octahedron } from "@react-three/drei"
import type * as THREE from "three"

function GeometricShape({
  position,
  rotation,
  scale,
  color,
  shape,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  color: string
  shape: "box" | "octahedron"
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.003
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 0.5) * 0.5
    }
  })

  const ShapeComponent = shape === "box" ? Box : Octahedron

  return (
    <ShapeComponent ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <meshStandardMaterial color={color} transparent opacity={0.1} wireframe />
    </ShapeComponent>
  )
}

export default function GeometricBackground() {
  const shapes = [
    {
      position: [-12, 8, -15] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: 2,
      color: "#3b82f6",
      shape: "box" as const,
    },
    {
      position: [12, -6, -20] as [number, number, number],
      rotation: [0.5, 0.5, 0] as [number, number, number],
      scale: 1.5,
      color: "#8b5cf6",
      shape: "octahedron" as const,
    },
    {
      position: [-8, -8, -12] as [number, number, number],
      rotation: [0.2, 0.8, 0.3] as [number, number, number],
      scale: 1.8,
      color: "#06b6d4",
      shape: "box" as const,
    },
    {
      position: [10, 10, -18] as [number, number, number],
      rotation: [0.7, 0.2, 0.5] as [number, number, number],
      scale: 1.2,
      color: "#10b981",
      shape: "octahedron" as const,
    },
  ]

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }} style={{ position: "absolute", top: 0, left: 0, zIndex: -2 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      {shapes.map((shape, index) => (
        <GeometricShape
          key={index}
          position={shape.position}
          rotation={shape.rotation}
          scale={shape.scale}
          color={shape.color}
          shape={shape.shape}
        />
      ))}
    </Canvas>
  )
}
