"use client"

import { useEffect, useRef } from "react"
import { useNoosfera } from "@/contexts/noosfera-context"

interface NeuralParticlesProps {
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  speed: number
}

export default function NeuralParticles({ className = "" }: NeuralParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { connectionStatus, processingThought, config } = useNoosfera()

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Crear partículas
    const particles: Particle[] = []
    const particleCount = connectionStatus === "connected" ? 50 : 20

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle())
    }

    function createParticle(): Particle {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: connectionStatus === "connected" ? "#10b981" : "#94a3b8",
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.5 + 0.5,
      }
    }

    // Limitar la frecuencia de actualización para evitar sobrecarga
    const fps = 30 // Limitar a 30 FPS en lugar de 60
    const fpsInterval = 1000 / fps
    let then = Date.now()

    // Animar partículas
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const now = Date.now()
      const elapsed = now - then

      // Solo actualizar si ha pasado el intervalo necesario
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval)

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Actualizar y dibujar partículas
        particles.forEach((particle, index) => {
          // Ajustar velocidad según el estado
          const speedMultiplier = processingThought ? 2 : 1
          const configSpeedFactor = config.processingSpeed / 75

          particle.x += particle.vx * particle.speed * speedMultiplier * configSpeedFactor
          particle.y += particle.vy * particle.speed * speedMultiplier * configSpeedFactor

          // Reiniciar partículas que salen del canvas
          if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
            particles[index] = createParticle()
            return
          }

          // Dibujar partícula
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255)
            .toString(16)
            .padStart(2, "0")}`
          ctx.fill()
        })

        // Dibujar conexiones entre partículas cercanas
        const connectionDistance = connectionStatus === "connected" ? 150 : 100

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < connectionDistance) {
              // Calcular opacidad basada en la distancia
              const opacity = 1 - distance / connectionDistance

              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)

              const color = connectionStatus === "connected" ? "#10b981" : "#94a3b8"
              ctx.strokeStyle = `${color}${Math.floor(opacity * 40)
                .toString(16)
                .padStart(2, "0")}`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [connectionStatus, processingThought, config.processingSpeed])

  return <canvas ref={canvasRef} className={`fixed inset-0 pointer-events-none z-[-1] ${className}`} />
}
