"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, RoundedBox } from "@react-three/drei"
import type * as THREE from "three"

interface AnimatedStatProps {
  position: [number, number, number]
  value: number
  label: string
  color: string
  targetValue: number
}

function AnimatedStat({ position, value, label, color, targetValue }: AnimatedStatProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValue((prev) => {
        const diff = targetValue - prev
        if (Math.abs(diff) < 0.1) {
          clearInterval(interval)
          return targetValue
        }
        return prev + diff * 0.1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [targetValue])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <RoundedBox args={[2, 1, 0.2]} radius={0.1}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} transparent opacity={0.9} />
      </RoundedBox>

      <Text
        position={[0, 0.2, 0.11]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {label}
      </Text>

      <Text
        position={[0, -0.1, 0.11]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {Math.round(currentValue)}
      </Text>
    </group>
  )
}

interface AnimatedStatsProps {
  stats: Array<{
    label: string
    value: number
    color: string
  }>
}

export default function AnimatedStats({ stats }: AnimatedStatsProps) {
  return (
    <div className="h-64 w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {stats.map((stat, index) => (
          <AnimatedStat
            key={index}
            position={[(index - 1) * 3, 0, 0]}
            value={stat.value}
            label={stat.label}
            color={stat.color}
            targetValue={stat.value}
          />
        ))}
      </Canvas>
    </div>
  )
}
