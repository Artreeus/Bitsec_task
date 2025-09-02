"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, OrbitControls } from "@react-three/drei"
import type * as THREE from "three"

interface UserPoint {
  lat: number
  lng: number
  name: string
}

function UserMarker({ position, name }: { position: [number, number, number]; name: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
    }
  })

  return (
    <Sphere ref={meshRef} args={[0.02]} position={position}>
      <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.5} />
    </Sphere>
  )
}

function Globe({ users }: { users: UserPoint[] }) {
  const globeRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005
    }
  })

  const userMarkers = useMemo(() => {
    return users.map((user, index) => {
      // Convert lat/lng to 3D coordinates on sphere
      const lat = (Number.parseFloat(user.lat) * Math.PI) / 180
      const lng = (Number.parseFloat(user.lng) * Math.PI) / 180
      const radius = 2

      const x = radius * Math.cos(lat) * Math.cos(lng)
      const y = radius * Math.sin(lat)
      const z = radius * Math.cos(lat) * Math.sin(lng)

      return {
        position: [x, y, z] as [number, number, number],
        name: user.name,
        key: index,
      }
    })
  }, [users])

  return (
    <group>
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshStandardMaterial color="#1e293b" transparent opacity={0.8} wireframe />
      </Sphere>

      {userMarkers.map((marker) => (
        <UserMarker key={marker.key} position={marker.position} name={marker.name} />
      ))}
    </group>
  )
}

interface UserGlobeProps {
  users: Array<{
    name: string
    address: {
      geo: {
        lat: string
        lng: string
      }
    }
  }>
}

export default function UserGlobe({ users }: UserGlobeProps) {
  const userPoints: UserPoint[] = useMemo(() => {
    return users.map((user) => ({
      lat: Number.parseFloat(user.address.geo.lat),
      lng: Number.parseFloat(user.address.geo.lng),
      name: user.name,
    }))
  }, [users])

  return (
    <div className="h-80 w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Globe users={userPoints} />

        <OrbitControls enablePan={false} enableZoom={true} minDistance={4} maxDistance={10} />
      </Canvas>
    </div>
  )
}
