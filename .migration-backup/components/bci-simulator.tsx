"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useNoosfera } from "@/contexts/noosfera-context"

export default function BciSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { connectionStatus, processingThought, signalStrength, config } = useNoosfera()

  const active = connectionStatus === "connected"

  useEffect(() => {
    if (!canvasRef.current || !active) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const points: { x: number; y: number; vx: number; vy: number; size: number; life: number; maxLife: number }[] = []

    const createPoint = () => {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const vx = (Math.random() - 0.5) * 2
      const vy = (Math.random() - 0.5) * 2
      const size = Math.random() * 3 + 1
      const maxLife = Math.random() * 100 + 50

      points.push({ x, y, vx, vy, size, life: 0, maxLife })
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Ajustar la densidad de puntos según la sensibilidad neural
      const maxPoints = Math.floor(50 * (config.neuralSensitivity / 50)) + (processingThought ? 50 : 0)

      // Add new points
      if (points.length < maxPoints && Math.random() > 0.8) {
        createPoint()
      }

      // Draw connections
      ctx.strokeStyle = processingThought ? "rgba(52, 211, 153, 0.2)" : "rgba(52, 211, 153, 0.1)"
      ctx.lineWidth = 0.5

      // Ajustar la distancia de conexión según la sensibilidad
      const connectionDistance = 80 * (config.neuralSensitivity / 50)

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.stroke()
          }
        }
      }

      // Ajustar la velocidad según la velocidad de procesamiento
      const speedFactor = config.processingSpeed / 75

      // Update and draw points
      points.forEach((point, index) => {
        point.x += point.vx * (processingThought ? 1.5 : 1) * speedFactor
        point.y += point.vy * (processingThought ? 1.5 : 1) * speedFactor
        point.life++

        // Remove points that are out of bounds or expired
        if (
          point.x < 0 ||
          point.x > canvas.width ||
          point.y < 0 ||
          point.y > canvas.height ||
          point.life > point.maxLife
        ) {
          points.splice(index, 1)
          return
        }

        const opacity = 1 - point.life / point.maxLife
        ctx.fillStyle = processingThought ? `rgba(52, 211, 153, ${opacity})` : `rgba(52, 211, 153, ${opacity * 0.7})`

        ctx.beginPath()
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    // Initialize with some points
    for (let i = 0; i < 20; i++) {
      createPoint()
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [active, processingThought, config.neuralSensitivity, config.processingSpeed, signalStrength])

  if (!active) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Conecta el BCI para visualizar la actividad neuronal</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} width={500} height={250} className="w-full h-full" />
      {processingThought && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="px-4 py-2 bg-black/50 rounded-full text-emerald-400 font-medium text-sm"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            Procesando señales neuronales
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
