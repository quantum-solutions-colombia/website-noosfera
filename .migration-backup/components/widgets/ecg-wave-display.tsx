"use client"
import { Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useNoosfera } from "@/contexts/noosfera-context"
import { useEffect, useRef } from "react"

export default function ECGWaveDisplay() {
  const { cardiacHistory, connectionStatus } = useNoosfera()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const offsetRef = useRef(0)

  useEffect(() => {
    if (connectionStatus !== "connected") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawECG = () => {
      const width = canvas.width
      const height = canvas.height
      const latestData = cardiacHistory[cardiacHistory.length - 1]
      const heartRate = latestData?.heartRate || 72

      ctx.clearRect(0, 0, width, height)

      // Grid background
      ctx.strokeStyle = "rgba(16, 185, 129, 0.1)"
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // ECG wave
      ctx.strokeStyle = "rgba(16, 185, 129, 1)"
      ctx.lineWidth = 2
      ctx.beginPath()

      const bpm = heartRate
      const beatDuration = (60 / bpm) * 100

      for (let x = 0; x < width; x++) {
        const relativeX = (x + offsetRef.current) % beatDuration
        let y = height / 2

        if (relativeX < 5) {
          y = height / 2 - (relativeX / 5) * 10
        } else if (relativeX < 10) {
          y = height / 2 - 10 + ((relativeX - 5) / 5) * 60
        } else if (relativeX < 15) {
          y = height / 2 + 50 - ((relativeX - 10) / 5) * 80
        } else if (relativeX < 20) {
          y = height / 2 - 30 + ((relativeX - 15) / 5) * 30
        } else {
          y = height / 2
        }

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      offsetRef.current += 2
      animationRef.current = requestAnimationFrame(drawECG)
    }

    drawECG()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [cardiacHistory, connectionStatus])

  return (
    <Card className="relative overflow-hidden border-emerald-500/20 col-span-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Electrocardiograma (ECG)</span>
          <Activity className="h-5 w-5 text-emerald-500" />
        </div>

        <canvas ref={canvasRef} width={600} height={150} className="w-full h-[150px] rounded-lg bg-black/20" />
      </CardContent>
    </Card>
  )
}
