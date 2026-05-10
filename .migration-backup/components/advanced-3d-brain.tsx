"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useNoosfera } from "@/contexts/noosfera-context"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Maximize2, Minimize2, HeartIcon, Activity, Zap, TrendingUp } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Advanced3DHeartProps {
  className?: string
  fullscreen?: boolean
}

export default function Advanced3DHeartVisualization({ className, fullscreen = false }: Advanced3DHeartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { connectionStatus, processingCardiac, cardiacActivity } = useNoosfera()

  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(false)
  const [viewMode, setViewMode] = useState<"surface" | "wireframe" | "activity" | "neural_flow">("surface")
  const [highlightIntensity, setHighlightIntensity] = useState(0)
  const [neuralPulses, setNeuralPulses] = useState<
    Array<{
      id: number
      startRegion: string
      endRegion: string
      progress: number
      intensity: number
      speed: number
    }>
  >([])
  const [activity, setActivity] = useState<Record<string, number>>({})

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error(`Error attempting to enable fullscreen: ${err.message}`))
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleZoom = (direction: "in" | "out") => {
    if (direction === "in") {
      setZoom((prev) => Math.min(prev + 0.1, 2))
    } else {
      setZoom((prev) => Math.max(prev - 0.1, 0.5))
    }
  }

  const handleRotate = (direction: "cw" | "ccw") => {
    if (direction === "cw") {
      setRotation((prev) => ({ ...prev, y: prev.y + 15 }))
    } else {
      setRotation((prev) => ({ ...prev, y: prev.y - 15 }))
    }
  }

  const cardiacChambers = [
    {
      id: "rv",
      name: "Ventrículo Derecho",
      position: { x: -30, y: 0, z: 20 },
      function: "Bombea sangre a los pulmones",
      color: "#3b82f6",
      size: 35,
    },
    {
      id: "lv",
      name: "Ventrículo Izquierdo",
      position: { x: 30, y: 0, z: 20 },
      function: "Bombea sangre al cuerpo",
      color: "#ef4444",
      size: 38,
    },
    {
      id: "ra",
      name: "Aurícula Derecha",
      position: { x: -35, y: -25, z: 15 },
      function: "Recibe sangre del cuerpo",
      color: "#06b6d4",
      size: 25,
    },
    {
      id: "la",
      name: "Aurícula Izquierda",
      position: { x: 35, y: -25, z: 15 },
      function: "Recibe sangre de los pulmones",
      color: "#f59e0b",
      size: 25,
    },
    {
      id: "sa_node",
      name: "Nodo SA",
      position: { x: -20, y: -30, z: 18 },
      function: "Marcapasos natural del corazón",
      color: "#10b981",
      size: 12,
    },
    {
      id: "av_node",
      name: "Nodo AV",
      position: { x: 0, y: 5, z: 15 },
      function: "Retardo AV fisiológico",
      color: "#ec4899",
      size: 10,
    },
  ]

  useEffect(() => {
    if (connectionStatus !== "connected") return

    const interval = setInterval(() => {
      if (Math.random() < (cardiacActivity / 100) * 0.25) {
        const startChamber = cardiacChambers[Math.floor(Math.random() * cardiacChambers.length)]
        const endChamber = cardiacChambers[Math.floor(Math.random() * cardiacChambers.length)]

        if (startChamber.id !== endChamber.id) {
          setNeuralPulses((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              startRegion: startChamber.id,
              endRegion: endChamber.id,
              progress: 0,
              intensity: 0.5 + Math.random() * 0.5,
              speed: 0.008 + Math.random() * 0.015,
            },
          ])
        }
      }

      setActivity((prev) => {
        const newActivity = { ...prev }
        cardiacChambers.forEach((chamber) => {
          newActivity[chamber.id] = (newActivity[chamber.id] || 0) * 0.92

          if (Math.random() < 0.12) {
            newActivity[chamber.id] = Math.min((newActivity[chamber.id] || 0) + Math.random() * 0.35, 1)
          }

          if (processingCardiac && (chamber.id === "sa_node" || chamber.id === "av_node")) {
            newActivity[chamber.id] = Math.min((newActivity[chamber.id] || 0) + 0.25, 1)
          }
        })
        return newActivity
      })

      setNeuralPulses((prev) => prev.filter((pulse) => pulse.progress < 1))
    }, 80)

    return () => clearInterval(interval)
  }, [connectionStatus, cardiacActivity, processingCardiac])

  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralPulses((prev) =>
        prev.map((pulse) => ({
          ...pulse,
          progress: Math.min(pulse.progress + pulse.speed, 1),
        })),
      )
    }, 16)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (processingCardiac) {
      const interval = setInterval(() => {
        setHighlightIntensity((prev) => (prev === 0 ? 1 : 0))
      }, 500)
      return () => clearInterval(interval)
    } else {
      setHighlightIntensity(0)
    }
  }, [processingCardiac])

  useEffect(() => {
    if (!canvasRef.current || connectionStatus !== "connected") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

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

    let animationFrameId: number

    const heartModel = {
      vertices: [] as { x: number; y: number; z: number; activity: number; chamber: string }[],
      edges: [] as [number, number][],
      chambers: {} as Record<string, number[]>,
      synapses: [] as { from: number; to: number; strength: number }[],
    }

    const generateHeartModel = () => {
      heartModel.vertices = []
      heartModel.edges = []
      heartModel.synapses = []

      cardiacChambers.forEach((chamber) => {
        const numVertices = Math.floor(chamber.size * 2)
        heartModel.chambers[chamber.id] = []

        for (let i = 0; i < numVertices; i++) {
          const angle1 = Math.random() * Math.PI * 2
          const angle2 = Math.random() * Math.PI
          const radius = (Math.random() * 0.7 + 0.3) * chamber.size

          const x = chamber.position.x + radius * Math.sin(angle2) * Math.cos(angle1)
          const y = chamber.position.y + radius * Math.sin(angle2) * Math.sin(angle1)
          const z = chamber.position.z + radius * Math.cos(angle2)

          const jitter = chamber.size * 0.1
          const jx = x + (Math.random() - 0.5) * jitter
          const jy = y + (Math.random() - 0.5) * jitter
          const jz = z + (Math.random() - 0.5) * jitter

          const vertexIndex = heartModel.vertices.length
          heartModel.vertices.push({
            x: jx,
            y: jy,
            z: jz,
            activity: Math.random() * 0.2,
            chamber: chamber.id,
          })

          heartModel.chambers[chamber.id].push(vertexIndex)
        }
      })

      const createConnections = (chamber1: string, chamber2: string, strength: number) => {
        const vertices1 = heartModel.chambers[chamber1] || []
        const vertices2 = heartModel.chambers[chamber2] || []

        const numConnections = Math.floor(Math.min(vertices1.length, vertices2.length) * strength)

        for (let i = 0; i < numConnections; i++) {
          const v1 = vertices1[Math.floor(Math.random() * vertices1.length)]
          const v2 = vertices2[Math.floor(Math.random() * vertices2.length)]

          heartModel.edges.push([v1, v2])
          heartModel.synapses.push({
            from: v1,
            to: v2,
            strength: Math.random() * 0.5 + 0.5,
          })
        }
      }

      createConnections("rv", "ra", 0.2)
      createConnections("lv", "la", 0.2)
      createConnections("ra", "lv", 0.3)
      createConnections("la", "rv", 0.3)
      createConnections("sa_node", "lv", 0.1)
      createConnections("av_node", "lv", 0.1)
      createConnections("av_node", "rv", 0.1)
    }

    generateHeartModel()

    const updateActivity = () => {
      if (!cardiacActivity) return

      heartModel.synapses.forEach((synapse) => {
        const fromVertex = heartModel.vertices[synapse.from]
        const toVertex = heartModel.vertices[synapse.to]

        if (fromVertex.activity > 0.3) {
          const transmission = fromVertex.activity * synapse.strength * 0.1
          toVertex.activity = Math.min(toVertex.activity + transmission, 1)
        }
      })

      heartModel.vertices.forEach((vertex, index) => {
        vertex.activity *= 0.98

        const chamberActivity = activity[vertex.chamber] || 0
        vertex.activity += chamberActivity * 0.05

        if (Math.random() < 0.02) {
          vertex.activity += Math.random() * 0.1
        }

        if (activeRegion && vertex.chamber === activeRegion) {
          vertex.activity += 0.08 + Math.random() * 0.1
        }

        if (processingCardiac) {
          if (vertex.chamber === "sa_node" || vertex.chamber === "av_node") {
            vertex.activity += 0.1 * (1 + Math.sin(Date.now() / 300))
          }
        }

        vertex.activity = Math.min(Math.max(vertex.activity, 0), 1)
      })
    }

    const project = (x: number, y: number, z: number) => {
      const cosX = Math.cos((rotation.x * Math.PI) / 180)
      const sinX = Math.sin((rotation.x * Math.PI) / 180)
      const cosY = Math.cos((rotation.y * Math.PI) / 180)
      const sinY = Math.sin((rotation.y * Math.PI) / 180)
      const cosZ = Math.cos((rotation.z * Math.PI) / 180)
      const sinZ = Math.sin((rotation.z * Math.PI) / 180)

      const y1 = y * cosX - z * sinX
      const z1 = y * sinX + z * cosX

      const x2 = x * cosY + z1 * sinY
      const z2 = -x * sinY + z1 * cosY

      const x3 = x2 * cosZ - y1 * sinZ
      const y3 = x2 * sinZ + y1 * cosZ

      const scale = zoom * 1.5
      const focalLength = 300
      const depth = focalLength / (focalLength + z2)

      return {
        x: canvas.width / 2 + x3 * depth * scale,
        y: canvas.height / 2 + y3 * depth * scale,
        depth: depth,
      }
    }

    const render = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
      )
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.02)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.05)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      updateActivity()

      const sortedVertices = heartModel.vertices
        .map((vertex, index) => ({
          vertex,
          index,
          projected: project(vertex.x, vertex.y, vertex.z),
        }))
        .sort((a, b) => a.projected.depth - b.projected.depth)

      neuralPulses.forEach((pulse) => {
        const startChamber = cardiacChambers.find((r) => r.id === pulse.startRegion)
        const endChamber = cardiacChambers.find((r) => r.id === pulse.endRegion)

        if (startChamber && endChamber) {
          const startProj = project(startChamber.position.x, startChamber.position.y, startChamber.position.z)
          const endProj = project(endChamber.position.x, endChamber.position.y, endChamber.position.z)

          const currentX = startProj.x + (endProj.x - startProj.x) * pulse.progress
          const currentY = startProj.y + (endProj.y - startProj.y) * pulse.progress

          const lineGradient = ctx.createLinearGradient(startProj.x, startProj.y, endProj.x, endProj.y)
          lineGradient.addColorStop(0, `rgba(52, 211, 153, ${0.1 * pulse.intensity})`)
          lineGradient.addColorStop(pulse.progress, `rgba(52, 211, 153, ${0.8 * pulse.intensity})`)
          lineGradient.addColorStop(1, `rgba(52, 211, 153, ${0.1 * pulse.intensity})`)

          ctx.strokeStyle = lineGradient
          ctx.lineWidth = 2 * pulse.intensity
          ctx.beginPath()
          ctx.moveTo(startProj.x, startProj.y)
          ctx.lineTo(endProj.x, endProj.y)
          ctx.stroke()

          ctx.shadowColor = "rgba(52, 211, 153, 0.8)"
          ctx.shadowBlur = 15 * pulse.intensity
          ctx.fillStyle = `rgba(52, 211, 153, ${pulse.intensity})`
          ctx.beginPath()
          ctx.arc(currentX, currentY, 4 * pulse.intensity, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      if (viewMode === "wireframe" || viewMode === "neural_flow") {
        heartModel.edges.forEach(([a, b]) => {
          const vertexA = heartModel.vertices[a]
          const vertexB = heartModel.vertices[b]

          const projA = project(vertexA.x, vertexA.y, vertexA.z)
          const projB = project(vertexB.x, vertexB.y, vertexB.z)

          const avgActivity = (vertexA.activity + vertexB.activity) / 2
          const connectionAlpha = 0.1 + avgActivity * 0.4

          ctx.strokeStyle = `rgba(52, 211, 153, ${connectionAlpha})`
          ctx.lineWidth = 0.5 + avgActivity * 1.5
          ctx.beginPath()
          ctx.moveTo(projA.x, projA.y)
          ctx.lineTo(projB.x, projB.y)
          ctx.stroke()
        })
      }

      sortedVertices.forEach(({ vertex, index, projected }) => {
        const { x, y, depth } = projected

        if (depth < 0.1) return

        const chamber = cardiacChambers.find((r) => r.id === vertex.chamber)
        if (!chamber) return

        let size = 2 + vertex.activity * 8
        let alpha = 0.4 + vertex.activity * 0.6

        if (viewMode === "wireframe") {
          size = 1 + vertex.activity * 4
          alpha = 0.2 + vertex.activity * 0.5
        } else if (viewMode === "activity") {
          size = 3 + vertex.activity * 10
          alpha = 0.3 + vertex.activity * 0.7
        }

        if (highlightIntensity > 0 && (vertex.chamber === "sa_node" || vertex.chamber === "av_node")) {
          size += highlightIntensity * 3
          alpha += highlightIntensity * 0.3
        }

        if (vertex.activity > 0.3) {
          ctx.shadowColor = chamber.color
          ctx.shadowBlur = 15 * vertex.activity
        } else {
          ctx.shadowBlur = 0
        }

        ctx.beginPath()
        ctx.arc(x, y, size * depth, 0, Math.PI * 2)

        if (viewMode === "activity") {
          const activityHue = 160 - vertex.activity * 60
          ctx.fillStyle = `hsla(${activityHue}, 80%, ${50 + vertex.activity * 20}%, ${alpha})`
        } else {
          const chamberColor = chamber.color
          ctx.fillStyle = `${chamberColor}${Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`
        }

        ctx.fill()
        ctx.shadowBlur = 0

        if (viewMode === "surface" || viewMode === "activity") {
          const chamberCenter = project(chamber.position.x, chamber.position.y, chamber.position.z)
          const chamberActivity = activity[chamber.id] || 0

          if (chamberActivity > 0.2) {
            ctx.shadowColor = chamber.color
            ctx.shadowBlur = 20 * chamberActivity
            ctx.fillStyle = `${chamber.color}${Math.floor((0.6 + chamberActivity * 0.4) * 255)
              .toString(16)
              .padStart(2, "0")}`
            ctx.beginPath()
            ctx.arc(chamberCenter.x, chamberCenter.y, (8 + chamberActivity * 6) * chamberCenter.depth, 0, Math.PI * 2)
            ctx.fill()
            ctx.shadowBlur = 0
          }
        }
      })

      if (activeRegion) {
        const chamber = cardiacChambers.find((r) => r.id === activeRegion)
        if (chamber) {
          const { x, y } = project(chamber.position.x, chamber.position.y, chamber.position.z)

          ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
          ctx.fillRect(x - 80, y - 35, 160, 50)

          ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
          ctx.font = "bold 14px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(chamber.name, x, y - 15)

          ctx.font = "12px sans-serif"
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"

          const words = chamber.function.split(" ")
          let line = ""
          let lineY = y + 5

          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " "
            const metrics = ctx.measureText(testLine)

            if (metrics.width > 150 && i > 0) {
              ctx.fillText(line, x, lineY)
              line = words[i] + " "
              lineY += 15
            } else {
              line = testLine
            }
          }
          ctx.fillText(line, x, lineY)
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }
  }, [
    connectionStatus,
    rotation,
    zoom,
    activeRegion,
    viewMode,
    highlightIntensity,
    processingCardiac,
    cardiacActivity,
  ])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !e.buttons) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const rotX = ((e.clientY - centerY) / rect.height) * 30
      const rotY = ((e.clientX - centerX) / rect.width) * 30

      setRotation((prev) => ({ ...prev, x: rotX, y: rotY }))
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-lg border bg-gradient-to-br from-red-950/20 to-background",
        fullscreen || isFullscreen ? "h-[600px]" : "h-[400px]",
        className,
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {connectionStatus !== "connected" ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <HeartIcon className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">Conecta el monitor cardíaco para visualizar el modelo 3D</p>
          </div>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={800}
            height={fullscreen || isFullscreen ? 600 : 400}
            className="h-full w-full"
          />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2 max-w-md">
            {cardiacChambers.map((chamber) => (
              <Badge
                key={chamber.id}
                variant={activeRegion === chamber.id ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all text-xs",
                  activeRegion === chamber.id ? "bg-emerald-500 hover:bg-emerald-600" : "hover:bg-muted",
                )}
                onClick={() => setActiveRegion(activeRegion === chamber.id ? null : chamber.id)}
                style={{
                  borderColor: activeRegion === chamber.id ? chamber.color : undefined,
                  backgroundColor: activeRegion === chamber.id ? chamber.color : undefined,
                }}
              >
                {chamber.name}
              </Badge>
            ))}
          </div>

          <div className="absolute right-4 top-4 flex gap-2">
            <Badge
              variant={viewMode === "surface" ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all",
                viewMode === "surface" ? "bg-red-500 hover:bg-red-600" : "hover:bg-muted",
              )}
              onClick={() => setViewMode("surface")}
            >
              <HeartIcon className="mr-1 h-3 w-3" />
              Anatomía
            </Badge>
            <Badge variant="outline" onClick={() => setViewMode("activity")} className="hover:bg-muted">
              <Activity className="mr-1 h-3 w-3" />
              Función
            </Badge>
            <Badge variant="outline" onClick={() => setViewMode("neural_flow")} className="hover:bg-muted">
              <TrendingUp className="mr-1 h-3 w-3" />
              Flujo Sanguíneo
            </Badge>
          </div>

          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 right-4 flex flex-col gap-2"
            >
              <Card className="bg-background/80 backdrop-blur-sm p-2 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleZoom("in")}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleZoom("out")}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleRotate("cw")}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleRotate("ccw")}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-1 px-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Zoom</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <Slider
                    value={[zoom * 100]}
                    min={50}
                    max={200}
                    step={10}
                    onValueChange={(values) => setZoom(values[0] / 100)}
                  />
                </div>
              </Card>
            </motion.div>
          )}

          {processingCardiac && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="px-6 py-3 bg-black/60 rounded-full text-emerald-400 font-medium text-sm backdrop-blur-sm border border-emerald-500/30"
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 20px rgba(16, 185, 129, 0.3)",
                    "0 0 30px rgba(16, 185, 129, 0.5)",
                    "0 0 20px rgba(16, 185, 129, 0.3)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <HeartIcon className="h-4 w-4" />
                  </motion.div>
                  Procesando actividad cardíaca avanzada
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
