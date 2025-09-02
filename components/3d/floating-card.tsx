"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { RoundedBox, Text, MeshDistortMaterial } from "@react-three/drei"
import type * as THREE from "three"

interface FloatingCardMeshProps {
  position: [number, number, number]
  text: string
  color: string
  value: string
}

function FloatingCardMesh({ position, text, color, value }: FloatingCardMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <RoundedBox args={[2, 1.2, 0.1]} radius={0.1} smoothness={4}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.1}
          speed={1}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
      <Text
        position={[0, 0.2, 0.06]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {text}
      </Text>
      <Text
        position={[0, -0.2, 0.06]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {value}
      </Text>
    </group>
  )
}

interface FloatingCardProps {
  cards: Array<{
    text: string
    value: string
    color: string
    position: [number, number, number]
  }>
}

export default function FloatingCard({ cards }: FloatingCardProps) {
  return (
    <div className="h-64 w-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} style={{ position: "absolute", top: 0, left: 0 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        {cards.map((card, index) => (
          <FloatingCardMesh
            key={index}
            position={card.position}
            text={card.text}
            color={card.color}
            value={card.value}
          />
        ))}
      </Canvas>
    </div>
  )
}
