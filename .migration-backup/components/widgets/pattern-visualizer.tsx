"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNoosfera } from "@/contexts/noosfera-context"
import { Heart } from "lucide-react"
import { AudioWaveform as Waveform } from "lucide-react"

export default function PatternVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { connectionStatus, currentThoughtPattern, processingThought } = useNoosfera()
  const animationFrameIdRef = useRef<number | null>(null)

  // Estado para almacenar los datos visualizados
  const [visualData, setVisualData] = useState<number[]>([])

  // Actualizar los datos visualizados cuando cambia el patrón de pensamiento
  useEffect(() => {
    if (currentThoughtPattern && currentThoughtPattern.patternData) {
      // Asegurarse de que patternData es un array antes de usarlo
      if (Array.isArray(currentThoughtPattern.patternData)) {
        setVisualData(currentThoughtPattern.patternData.slice(0, 32))
      } else {
        // Si no es un array, crear un array vacío o con valores por defecto
        setVisualData(Array(32).fill(50))
      }
    } else {
      // Si no hay patrón, mostrar datos aleatorios
      setVisualData(
        Array(32)
          .fill(0)
          .map(() => Math.random() * 100),
      )
    }
  }, [currentThoughtPattern])

  // Renderizar la visualización
  useEffect(() => {
    if (!canvasRef.current || connectionStatus !== "connected") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Configurar estilo
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    const render = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(220, 38, 38, 0.05)")
      gradient.addColorStop(0.5, "rgba(34, 197, 94, 0.03)")
      gradient.addColorStop(1, "rgba(220, 38, 38, 0.05)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2

      // Draw grid lines (ECG style)
      ctx.strokeStyle = "rgba(16, 185, 129, 0.1)"
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // Draw ECG waveform
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      const gradient2 = ctx.createLinearGradient(0, centerY - 50, 0, centerY + 50)
      gradient2.addColorStop(0, "rgba(220, 38, 38, 0.8)")
      gradient2.addColorStop(0.5, "rgba(34, 197, 94, 1)")
      gradient2.addColorStop(1, "rgba(220, 38, 38, 0.8)")
      ctx.strokeStyle = gradient2

      ctx.beginPath()
      visualData.forEach((value, index) => {
        const x = (index / visualData.length) * width
        const amplitude = (value / 100) * (height * 0.3)
        const waveY = centerY - amplitude + Math.sin(index * 0.5) * 10

        if (index === 0) {
          ctx.moveTo(x, waveY)
        } else {
          ctx.lineTo(x, waveY)
        }
      })
      ctx.stroke()

      visualData.forEach((value, index) => {
        if (value > 70) {
          const x = (index / visualData.length) * width
          const y = centerY - (value / 100) * (height * 0.3)

          ctx.shadowColor = "rgba(220, 38, 38, 0.8)"
          ctx.shadowBlur = 20
          ctx.fillStyle = "rgba(220, 38, 38, 0.6)"
          ctx.beginPath()
          ctx.arc(x, y, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      animationFrameIdRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [connectionStatus, visualData])

  if (connectionStatus !== "connected") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Ritmo Cardíaco
          </CardTitle>
          <CardDescription>Visualización en tiempo real del ECG</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Conecta el monitor cardíaco para ver el ECG</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-red-500/20 bg-gradient-to-br from-red-950/10 to-emerald-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
            <Heart className="h-5 w-5 text-red-500" />
          </motion.div>
          Monitoreo Cardíaco en Vivo
          {processingThought && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Waveform className="h-4 w-4 text-emerald-500" />
            </motion.div>
          )}
        </CardTitle>
        <CardDescription>ECG en tiempo real de tu ritmo cardíaco</CardDescription>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-[200px] rounded-lg bg-gradient-to-br from-gray-950 via-red-950/20 to-gray-950"
        />
        <motion.div
          className="mt-4 grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-muted-foreground">Frecuencia</p>
            <p className="text-lg font-bold text-emerald-500">72 bpm</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-muted-foreground">Variabilidad</p>
            <p className="text-lg font-bold text-red-500">45 ms</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground">Estrés</p>
            <p className="text-lg font-bold text-blue-500">Bajo</p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
