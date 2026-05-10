"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNoosfera } from "@/contexts/noosfera-context"
import { Activity, BarChart3, LineChart, PieChart, AudioWaveformIcon as Waveform } from "lucide-react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FrequencyBand {
  name: string
  range: string
  color: string
  description: string
}

export default function SpectralAnalysis() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeView, setActiveView] = useState<"time" | "frequency" | "distribution" | "coherence">("time")
  const [timeWindow, setTimeWindow] = useState<"5s" | "30s" | "1m" | "5m">("30s")
  const { brainwaveHistory, connectionStatus, patternAnalysis } = useNoosfera()

  // Frequency bands with their properties
  const frequencyBands: FrequencyBand[] = [
    {
      name: "Delta",
      range: "0.5-4 Hz",
      color: "#ec4899",
      description: "Sueño profundo, recuperación física",
    },
    {
      name: "Theta",
      range: "4-8 Hz",
      color: "#8b5cf6",
      description: "Meditación profunda, creatividad, memoria",
    },
    {
      name: "Alpha",
      range: "8-13 Hz",
      color: "#10b981",
      description: "Relajación, calma, estado meditativo ligero",
    },
    {
      name: "Beta",
      range: "13-30 Hz",
      color: "#3b82f6",
      description: "Concentración, cognición activa, alerta",
    },
    {
      name: "Gamma",
      range: "30-100 Hz",
      color: "#f59e0b",
      description: "Procesamiento cognitivo de alto nivel, percepción",
    },
  ]

  // Calculate frequency distribution from brainwave data
  const calculateFrequencyDistribution = () => {
    if (brainwaveHistory.length === 0) {
      return {
        delta: 20,
        theta: 15,
        alpha: 30,
        beta: 25,
        gamma: 10,
      }
    }

    // In a real application, this would perform FFT on the raw data
    // Here we'll simulate it based on the existing data
    const lastRecord = brainwaveHistory[brainwaveHistory.length - 1]

    // Calculate average values for each wave type
    const deltaAvg = lastRecord.delta.reduce((sum, val) => sum + val, 0) / lastRecord.delta.length
    const thetaAvg = lastRecord.theta.reduce((sum, val) => sum + val, 0) / lastRecord.theta.length
    const alphaAvg = lastRecord.alpha.reduce((sum, val) => sum + val, 0) / lastRecord.alpha.length
    const betaAvg = lastRecord.beta.reduce((sum, val) => sum + val, 0) / lastRecord.beta.length

    // Simulate gamma (not in original data)
    const gammaAvg = (alphaAvg + betaAvg) / 4 + Math.random() * 10

    // Calculate total for percentage
    const total = deltaAvg + thetaAvg + alphaAvg + betaAvg + gammaAvg

    return {
      delta: Math.round((deltaAvg / total) * 100),
      theta: Math.round((thetaAvg / total) * 100),
      alpha: Math.round((alphaAvg / total) * 100),
      beta: Math.round((betaAvg / total) * 100),
      gamma: Math.round((gammaAvg / total) * 100),
    }
  }

  // Get frequency distribution
  const distribution = calculateFrequencyDistribution()

  // Render time domain visualization
  useEffect(() => {
    if (!canvasRef.current || brainwaveHistory.length === 0 || connectionStatus !== "connected") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar el tamaño del canvas con debounce
    let resizeTimeout: NodeJS.Timeout | null = null
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeout) clearTimeout(resizeTimeout)

      resizeTimeout = setTimeout(() => {
        const { width, height } = canvas.getBoundingClientRect()
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }
      }, 100)
    })

    resizeObserver.observe(canvas)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get the most recent data points based on the selected time window
      let dataPoints: any[] = []
      switch (timeWindow) {
        case "5s":
          dataPoints = brainwaveHistory.slice(-5)
          break
        case "30s":
          dataPoints = brainwaveHistory.slice(-15)
          break
        case "1m":
          dataPoints = brainwaveHistory.slice(-30)
          break
        case "5m":
          dataPoints = brainwaveHistory
          break
      }

      if (dataPoints.length === 0) return

      const width = canvas.width
      const height = canvas.height
      const padding = 20
      const graphWidth = width - padding * 2
      const graphHeight = height - padding * 2

      // Draw background grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1

      // Horizontal grid lines
      for (let i = 0; i <= 4; i++) {
        const y = padding + (graphHeight / 4) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
      }

      // Vertical grid lines
      for (let i = 0; i <= 4; i++) {
        const x = padding + (graphWidth / 4) * i
        ctx.beginPath()
        ctx.moveTo(x, padding)
        ctx.lineTo(x, height - padding)
        ctx.stroke()
      }

      // Draw waveforms based on the active view
      if (activeView === "time") {
        // Time domain visualization - draw each wave type
        const waveTypes = ["alpha", "beta", "theta", "delta"]
        const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899"]

        waveTypes.forEach((type, typeIndex) => {
          ctx.strokeStyle = colors[typeIndex]
          ctx.lineWidth = 2
          ctx.beginPath()

          dataPoints.forEach((point, index) => {
            // Get average value for this wave type
            const values = point[type]
            const avg = values.reduce((sum: number, val: number) => sum + val, 0) / values.length

            // Normalize to graph height (0-100)
            const x = padding + (index / (dataPoints.length - 1)) * graphWidth
            const y = height - padding - (avg / 100) * graphHeight

            if (index === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          })

          ctx.stroke()

          // Add label
          ctx.fillStyle = colors[typeIndex]
          ctx.font = "12px sans-serif"
          ctx.fillText(type.charAt(0).toUpperCase() + type.slice(1), padding + 10 + typeIndex * 60, padding - 5)
        })
      } else if (activeView === "frequency") {
        // Frequency domain visualization - simulate FFT
        const barWidth = graphWidth / 50
        const maxFreq = 50 // Hz

        // Create simulated frequency spectrum
        const spectrum = Array(50)
          .fill(0)
          .map((_, i) => {
            const freq = i + 1
            let amplitude = 0

            // Delta (0.5-4 Hz)
            if (freq <= 4) {
              amplitude = distribution.delta * Math.random() * 0.5
            }
            // Theta (4-8 Hz)
            else if (freq <= 8) {
              amplitude = distribution.theta * Math.random() * 0.5
            }
            // Alpha (8-13 Hz)
            else if (freq <= 13) {
              amplitude = distribution.alpha * Math.random() * 0.5
            }
            // Beta (13-30 Hz)
            else if (freq <= 30) {
              amplitude = distribution.beta * Math.random() * 0.5
            }
            // Gamma (30+ Hz)
            else {
              amplitude = distribution.gamma * Math.random() * 0.5
            }

            return amplitude
          })

        // Draw frequency bands backgrounds
        const bands = [
          { name: "Delta", start: 0.5, end: 4, color: "rgba(236, 72, 153, 0.1)" },
          { name: "Theta", start: 4, end: 8, color: "rgba(139, 92, 246, 0.1)" },
          { name: "Alpha", start: 8, end: 13, color: "rgba(16, 185, 129, 0.1)" },
          { name: "Beta", start: 13, end: 30, color: "rgba(59, 130, 246, 0.1)" },
          { name: "Gamma", start: 30, end: 50, color: "rgba(245, 158, 11, 0.1)" },
        ]

        bands.forEach((band) => {
          const startX = padding + (band.start / maxFreq) * graphWidth
          const endX = padding + (band.end / maxFreq) * graphWidth
          const bandWidth = endX - startX

          ctx.fillStyle = band.color
          ctx.fillRect(startX, padding, bandWidth, graphHeight)

          // Add band label
          ctx.fillStyle = band.color.replace("0.1", "1")
          ctx.font = "10px sans-serif"
          ctx.fillText(band.name, startX + bandWidth / 2 - 15, height - 5)
        })

        // Draw spectrum
        spectrum.forEach((amplitude, i) => {
          const freq = i + 1
          const x = padding + (freq / maxFreq) * graphWidth
          const barHeight = (amplitude / 100) * graphHeight

          // Determine color based on frequency band
          let color
          if (freq <= 4) color = "rgba(236, 72, 153, 0.8)"
          else if (freq <= 8) color = "rgba(139, 92, 246, 0.8)"
          else if (freq <= 13) color = "rgba(16, 185, 129, 0.8)"
          else if (freq <= 30) color = "rgba(59, 130, 246, 0.8)"
          else color = "rgba(245, 158, 11, 0.8)"

          ctx.fillStyle = color
          ctx.fillRect(x, height - padding - barHeight, barWidth, barHeight)
        })

        // Draw frequency axis
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.font = "10px sans-serif"
        for (let freq = 0; freq <= maxFreq; freq += 10) {
          const x = padding + (freq / maxFreq) * graphWidth
          ctx.fillText(`${freq}Hz`, x, height - padding + 15)
        }
      } else if (activeView === "distribution") {
        // Distribution visualization - pie chart
        const width = canvas.width
        const height = canvas.height
        const padding = 20
        const graphWidth = width - padding * 2
        const graphHeight = height - padding * 2

        const centerX = width / 2
        const centerY = height / 2
        const radius = Math.min(graphWidth, graphHeight) / 2

        let startAngle = 0

        // Draw pie segments
        Object.entries(distribution).forEach(([band, percentage], index) => {
          const endAngle = startAngle + (percentage / 100) * Math.PI * 2

          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, radius, startAngle, endAngle)
          ctx.closePath()

          // Get color for this band
          const bandInfo = frequencyBands.find((b) => b.name.toLowerCase() === band)
          ctx.fillStyle = bandInfo ? bandInfo.color : "#ccc"
          ctx.fill()

          // Add label
          const labelAngle = startAngle + (endAngle - startAngle) / 2
          const labelRadius = radius * 0.7
          const labelX = centerX + Math.cos(labelAngle) * labelRadius
          const labelY = centerY + Math.sin(labelAngle) * labelRadius

          ctx.fillStyle = "white"
          ctx.font = "bold 12px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(`${percentage}%`, labelX, labelY)

          startAngle = endAngle
        })

        // Add legend
        const legendX = width - padding - 100
        const legendY = padding + 20

        frequencyBands.forEach((band, index) => {
          const y = legendY + index * 20

          ctx.fillStyle = band.color
          ctx.fillRect(legendX, y, 15, 15)

          ctx.fillStyle = "white"
          ctx.font = "12px sans-serif"
          ctx.textAlign = "left"
          ctx.fillText(band.name, legendX + 20, y + 12)
        })
      } else if (activeView === "coherence") {
        // Coherence visualization - brain region connectivity
        const width = canvas.width
        const height = canvas.height
        const padding = 20
        const graphWidth = width - padding * 2
        const graphHeight = height - padding * 2

        const centerX = width / 2
        const centerY = height / 2
        const radius = Math.min(graphWidth, graphHeight) / 2

        const regions = [
          { name: "Frontal", x: centerX, y: centerY - radius * 0.6 },
          { name: "Temporal L", x: centerX - radius * 0.6, y: centerY },
          { name: "Temporal R", x: centerX + radius * 0.6, y: centerY },
          { name: "Parietal", x: centerX, y: centerY + radius * 0.3 },
          { name: "Occipital", x: centerX, y: centerY + radius * 0.6 },
        ]

        // Draw connections between regions
        regions.forEach((region1, i) => {
          regions.forEach((region2, j) => {
            if (i < j) {
              // Calculate coherence value (simulated)
              const coherence = Math.random() * 0.8 + 0.2

              // Draw connection line with thickness and color based on coherence
              ctx.beginPath()
              ctx.moveTo(region1.x, region1.y)
              ctx.lineTo(region2.x, region2.y)

              const hue = 120 + (1 - coherence) * 240 // Green to red
              ctx.strokeStyle = `hsla(${hue}, 80%, 50%, ${coherence * 0.8})`
              ctx.lineWidth = coherence * 5
              ctx.stroke()
            }
          })
        })

        // Draw brain regions
        regions.forEach((region) => {
          ctx.beginPath()
          ctx.arc(region.x, region.y, 15, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(16, 185, 129, 0.8)"
          ctx.fill()

          ctx.fillStyle = "white"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(region.name, region.x, region.y)
        })
      }
    }

    render()

    // Update periodically with a reasonable interval
    const interval = setInterval(render, 1000)

    return () => {
      clearInterval(interval)
      resizeObserver.disconnect()
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }
  }, [brainwaveHistory, activeView, timeWindow, connectionStatus, distribution])

  if (connectionStatus !== "connected") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waveform className="h-5 w-5 text-emerald-500" />
            Análisis Espectral
          </CardTitle>
          <CardDescription>Análisis avanzado de frecuencias cerebrales</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Conecta el BCI para visualizar el análisis espectral</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waveform className="h-5 w-5 text-emerald-500" />
          Análisis Espectral
        </CardTitle>
        <CardDescription>Análisis avanzado de frecuencias cerebrales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
            <TabsList>
              <TabsTrigger value="time" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Tiempo</span>
              </TabsTrigger>
              <TabsTrigger value="frequency" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Frecuencia</span>
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Distribución</span>
              </TabsTrigger>
              <TabsTrigger value="coherence" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Coherencia</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={timeWindow} onValueChange={(value) => setTimeWindow(value as any)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Intervalo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5s">5 seg</SelectItem>
              <SelectItem value="30s">30 seg</SelectItem>
              <SelectItem value="1m">1 min</SelectItem>
              <SelectItem value="5m">5 min</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-[250px] relative">
          <canvas ref={canvasRef} width={800} height={250} className="w-full h-full" />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2">
          {frequencyBands.map((band) => (
            <motion.div
              key={band.name}
              className="p-2 rounded-md"
              style={{ backgroundColor: `${band.color}20` }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: band.color }}></div>
                <span className="font-medium text-sm">{band.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{band.range}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{band.description}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
