"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Box, Text, OrbitControls } from "@react-three/drei"
import type * as THREE from "three"

interface DataBarProps {
  position: [number, number, number]
  height: number
  color: string
  label: string
  value: number
}

function DataBar({ position, height, color, label, value }: DataBarProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group position={position}>
      <Box ref={meshRef} args={[0.8, height, 0.8]} position={[0, height / 2, 0]}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </Box>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {label}
      </Text>
      <Text position={[0, height + 0.3, 0]} fontSize={0.15} color="white" anchorX="center" anchorY="middle">
        {value}
      </Text>
    </group>
  )
}

interface User3DChartProps {
  users: Array<{
    id: number
    name: string
    company: { name: string }
  }>
}

export default function User3DChart({ users }: User3DChartProps) {
  const chartData = useMemo(() => {
    const companyCount = users.reduce(
      (acc, user) => {
        const company = user.company.name
        acc[company] = (acc[company] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topCompanies = Object.entries(companyCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    return topCompanies.map(([company, count], index) => ({
      label: company.split(" ")[0], // First word only for display
      value: count,
      height: count * 0.5,
      color: [
        "#3b82f6", // blue
        "#8b5cf6", // purple
        "#06b6d4", // cyan
        "#10b981", // emerald
        "#f59e0b", // amber
      ][index],
      position: [(index - 2) * 2, 0, 0] as [number, number, number],
    }))
  }, [users])

  return (
    <div className="h-80 w-full">
      <Canvas camera={{ position: [8, 6, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {chartData.map((data, index) => (
          <DataBar
            key={index}
            position={data.position}
            height={data.height}
            color={data.color}
            label={data.label}
            value={data.value}
          />
        ))}

        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}
