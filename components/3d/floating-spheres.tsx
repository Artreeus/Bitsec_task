"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial } from "@react-three/drei"
import type * as THREE from "three"

function FloatingSphere({
  position,
  color,
  speed,
}: { position: [number, number, number]; color: string; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.2
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.8) * 0.5
    }
  })

  return (
    <Sphere ref={meshRef} position={position} args={[1, 32, 32]}>
      <MeshDistortMaterial color={color} attach="material" distort={0.3} speed={2} roughness={0.2} metalness={0.8} />
    </Sphere>
  )
}

export default function FloatingSpheres() {
  const spheres = useMemo(
    () => [
      { position: [-8, 2, -5] as [number, number, number], color: "#3b82f6", speed: 0.5 },
      { position: [8, -1, -8] as [number, number, number], color: "#8b5cf6", speed: 0.7 },
      { position: [-6, -3, -6] as [number, number, number], color: "#06b6d4", speed: 0.6 },
      { position: [6, 4, -10] as [number, number, number], color: "#10b981", speed: 0.4 },
    ],
    [],
  )

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }} style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      {spheres.map((sphere, index) => (
        <FloatingSphere key={index} position={sphere.position} color={sphere.color} speed={sphere.speed} />
      ))}
    </Canvas>
  )
}
