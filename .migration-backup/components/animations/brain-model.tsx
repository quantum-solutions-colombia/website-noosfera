"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useNoosfera } from "@/contexts/noosfera-context"

export default function BrainModel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { connectionStatus, processingThought, brainwaveActivity } = useNoosfera()
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  // Efecto para seguir el cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calcular la distancia desde el centro
      const distX = (e.clientX - centerX) / (rect.width / 2)
      const distY = (e.clientY - centerY) / (rect.height / 2)

      // Limitar la rotación
      const maxRotation = 15
      const rotX = -distY * maxRotation
      const rotY = distX * maxRotation

      setRotation({ x: rotX, y: rotY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Determinar el color basado en el estado
  const getBrainColor = () => {
    if (!connectionStatus || connectionStatus === "disconnected") {
      return "#94a3b8" // Gris
    } else if (connectionStatus === "connecting" || connectionStatus === "calibrating") {
      return "#f59e0b" // Ámbar
    } else if (processingThought) {
      return "#3b82f6" // Azul
    } else {
      return "#10b981" // Verde
    }
  }

  // Determinar la intensidad de pulso basada en la actividad cerebral
  const getPulseIntensity = () => {
    if (connectionStatus !== "connected") return 0
    return brainwaveActivity / 100
  }

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <motion.div
        style={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        animate={{
          scale: processingThought ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: processingThought ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Cerebro SVG */}
        

        {/* Efecto de pulso */}
        {connectionStatus === "connected" && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-500/5"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2 * getPulseIntensity(), 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-500/5"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.05, 0.15 * getPulseIntensity(), 0.05],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Partículas neuronales */}
        {connectionStatus === "connected" && (
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-emerald-500"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20],
                  y: [Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20],
                  opacity: [0, 0.7 * getPulseIntensity(), 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
