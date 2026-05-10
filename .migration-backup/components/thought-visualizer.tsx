"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNoosfera } from "@/contexts/noosfera-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Download, ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2, Heart, Zap, Activity, Eye, Layers } from 'lucide-react'
// Importar el nuevo hook
import { useResizeObserver } from "@/hooks/use-resize-observer"
import NFTDownloadModal from "@/components/nft-download-modal"

interface ThoughtVisualizerProps {
  fullscreen?: boolean
  isDemo?: boolean
}

export default function ThoughtVisualizer({ fullscreen = false, isDemo = false }: ThoughtVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [thoughtText, setThoughtText] = useState<string | null>(null)
  const [thoughtImage, setThoughtImage] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [showDetails, setShowDetails] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [visualizerMode, setVisualizerMode] = useState<"cardiac" | "rhythm" | "heartrate" | "flow">("cardiac")
  const [showNFTModal, setShowNFTModal] = useState(false)
  const [currentNFTToken, setCurrentNFTToken] = useState("")
  const [currentImageId, setCurrentImageId] = useState("")
  const [brainwaveData, setBrainwaveData] = useState([
    { frequency: 10, amplitude: 0.5, phase: 0, color: "#10b981", name: "Alpha" },
    { frequency: 20, amplitude: 0.3, phase: Math.PI / 4, color: "#3b82f6", name: "Beta" },
    { frequency: 6, amplitude: 0.7, phase: Math.PI / 2, color: "#8b5cf6", name: "Theta" },
    { frequency: 2, amplitude: 0.4, phase: Math.PI, color: "#ec4899", name: "Delta" },
    { frequency: 40, amplitude: 0.2, phase: Math.PI * 1.5, color: "#f59e0b", name: "Gamma" },
  ])

  const containerRef = useResizeObserver<HTMLDivElement>({
    onResize: (width, height) => {
      if (canvasRef.current) {
        canvasRef.current.width = width
        canvasRef.current.height = height
      }
    },
  })

  const { connectionStatus, processingThought, currentThoughtPattern, config } = useNoosfera()

  const active = connectionStatus === "connected"

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    if (processingThought) {
      setThoughtText(null)
      setThoughtImage(null)
    } else if (currentThoughtPattern && !processingThought) {
      const thoughts = [
        "Un corazón en ritmo constante y sano",
        "Una imagen de una persona relajada con un ritmo cardíaco lento",
        "Un gráfico de la frecuencia cardíaca en tiempo real",
        "Una representación del flujo sanguíneo en las arterias",
        "Un diagrama de la actividad cardíaca en diferentes capas",
      ]

      const index = Math.floor(
        (((currentThoughtPattern.patternData && currentThoughtPattern.patternData[0]) || 50) / 100) * thoughts.length,
      )
      setThoughtText(thoughts[Math.min(index, thoughts.length - 1)])

      const imageWidth = 400
      const imageHeight = 300
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = imageWidth
      tempCanvas.height = imageHeight
      const tempCtx = tempCanvas.getContext("2d")

      if (tempCtx && currentThoughtPattern && Array.isArray(currentThoughtPattern.patternData)) {
        const hue1 = Math.floor(((currentThoughtPattern.patternData[1] || 50) / 100) * 360)
        const hue2 = Math.floor(((currentThoughtPattern.patternData[2] || 120) / 100) * 360)
        const hue3 = Math.floor(((currentThoughtPattern.patternData[3] || 240) / 100) * 360)

        const gradient = tempCtx.createRadialGradient(
          imageWidth / 2,
          imageHeight / 2,
          0,
          imageWidth / 2,
          imageHeight / 2,
          imageWidth / 2,
        )
        gradient.addColorStop(0, `hsl(${hue1}, 70%, 30%)`)
        gradient.addColorStop(0.5, `hsl(${hue2}, 60%, 25%)`)
        gradient.addColorStop(1, `hsl(${hue3}, 80%, 20%)`)
        tempCtx.fillStyle = gradient
        tempCtx.fillRect(0, 0, imageWidth, imageHeight)

        const drawFractal = (x: number, y: number, size: number, depth: number) => {
          if (depth <= 0 || size < 2) return

          const branches = 3 + Math.floor(((currentThoughtPattern.patternData[4] || 50) / 100) * 4)

          for (let i = 0; i < branches; i++) {
            const angle = (Math.PI * 2 * i) / branches
            const newX = x + Math.cos(angle) * size
            const newY = y + Math.sin(angle) * size

            tempCtx.strokeStyle = `hsla(${hue1 + i * 30}, 70%, 60%, ${0.7 - depth * 0.1})`
            tempCtx.lineWidth = Math.max(1, depth)
            tempCtx.beginPath()
            tempCtx.moveTo(x, y)
            tempCtx.lineTo(newX, newY)
            tempCtx.stroke()

            drawFractal(newX, newY, size * 0.7, depth - 1)
          }
        }

        const numFractals = 2 + Math.floor(((currentThoughtPattern.patternData[5] || 30) / 100) * 3)
        for (let i = 0; i < numFractals; i++) {
          const x = (imageWidth / (numFractals + 1)) * (i + 1)
          const y = imageHeight / 2 + (Math.random() - 0.5) * 100
          drawFractal(x, y, 30 + Math.random() * 20, 4)
        }

        const numParticles = 50 + Math.floor(((currentThoughtPattern.patternData[6] || 40) / 100) * 100)
        for (let i = 0; i < numParticles; i++) {
          const x = Math.random() * imageWidth
          const y = Math.random() * imageHeight
          const size = 1 + Math.random() * 3
          const hue = hue1 + Math.random() * 60

          tempCtx.shadowColor = `hsl(${hue}, 80%, 60%)`
          tempCtx.shadowBlur = 10
          tempCtx.fillStyle = `hsla(${hue}, 80%, 70%, ${0.6 + Math.random() * 0.4})`
          tempCtx.beginPath()
          tempCtx.arc(x, y, size, 0, Math.PI * 2)
          tempCtx.fill()
        }

        tempCtx.shadowBlur = 0
        setThoughtImage(tempCanvas.toDataURL())
      }
    }
  }, [processingThought, currentThoughtPattern])

  useEffect(() => {
    if (!canvasRef.current || !active) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const nodes: {
      x: number
      y: number
      layer: number
      connections: number[]
      pulseIntensity: number
      nodeType: "atrium" | "ventricle" | "valve"
      activationLevel: number
      lastActivation: number
    }[] = []

    const layers = 5
    const nodesPerLayer = [8, 12, 16, 10, 6]

    let nodeIndex = 0
    for (let layer = 0; layer < layers; layer++) {
      const layerNodes = nodesPerLayer[layer]
      const xPos = (canvas.width / (layers + 1)) * (layer + 1)

      for (let i = 0; i < layerNodes; i++) {
        const yPos = (canvas.height / (layerNodes + 1)) * (i + 1)
        const nodeType = layer === 0 ? "atrium" : layer === layers - 1 ? "ventricle" : "valve"

        nodes.push({
          x: xPos,
          y: yPos,
          layer,
          connections: [],
          pulseIntensity: 0,
          nodeType,
          activationLevel: 0,
          lastActivation: 0,
        })

        if (layer > 0) {
          const prevLayerStart = nodes.findIndex((n) => n.layer === layer - 1)
          const prevLayerEnd = nodes.findIndex((n) => n.layer === layer) - 1

          const connectionProbability = 0.7
          for (let j = prevLayerStart; j <= prevLayerEnd; j++) {
            if (Math.random() < connectionProbability) {
              nodes[nodeIndex].connections.push(j)
            }
          }
        }

        nodeIndex++
      }
    }

    const pulses: {
      nodeIndex: number
      progress: number
      speed: number
      intensity: number
      targetNode: number
      pathPoints: { x: number; y: number }[]
    }[] = []

    const addPulse = () => {
      if (!processingThought && !currentThoughtPattern) return

      const inputNodes = nodes.filter((n) => n.layer === 0)
      const startNodeIndex = nodes.indexOf(inputNodes[Math.floor(Math.random() * inputNodes.length)])
      const startNode = nodes[startNodeIndex]

      if (startNode.connections.length > 0) {
        const targetNodeIndex = startNode.connections[Math.floor(Math.random() * startNode.connections.length)]
        const targetNode = nodes[targetNodeIndex]

        const pathPoints = []
        const steps = 10
        for (let i = 0; i <= steps; i++) {
          const t = i / steps
          const curveHeight = 20 * Math.sin(Math.PI * t)
          const x = startNode.x + (targetNode.x - startNode.x) * t
          const y = startNode.y + (targetNode.y - startNode.y) * t + curveHeight
          pathPoints.push({ x, y })
        }

        const baseSpeed = 0.015 + (config.processingSpeed / 100) * 0.025

        pulses.push({
          nodeIndex: startNodeIndex,
          targetNode: targetNodeIndex,
          progress: 0,
          speed: Math.random() * 0.01 + baseSpeed,
          intensity: Math.random() * 0.5 + 0.5,
          pathPoints,
        })
      }
    }

    const render = () => {
      const time = Date.now() / 1000
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
      )

      const bgIntensity = (Math.sin(time * 0.5) * 0.05 + 0.1) * (processingThought ? 2 : 1)
      bgGradient.addColorStop(0, `rgba(16, 185, 129, ${bgIntensity})`)
      bgGradient.addColorStop(0.7, `rgba(16, 185, 129, ${bgIntensity * 0.3})`)
      bgGradient.addColorStop(1, "rgba(16, 185, 129, 0)")

      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      setBrainwaveData((prev) =>
        prev.map((wave) => ({
          ...wave,
          phase: wave.phase + wave.frequency * 0.01,
          amplitude: wave.amplitude + (Math.random() - 0.5) * 0.05,
        })),
      )

      for (const node of nodes) {
        for (const connIndex of node.connections) {
          const connNode = nodes[connIndex]

          const connectionStrength = (node.pulseIntensity + connNode.pulseIntensity) / 2
          const baseAlpha = 0.1
          const dynamicAlpha = baseAlpha + connectionStrength * 0.4

          const connGradient = ctx.createLinearGradient(node.x, node.y, connNode.x, connNode.y)
          connGradient.addColorStop(0, `rgba(52, 211, 153, ${dynamicAlpha})`)
          connGradient.addColorStop(0.5, `rgba(52, 211, 153, ${dynamicAlpha * 1.5})`)
          connGradient.addColorStop(1, `rgba(52, 211, 153, ${dynamicAlpha})`)

          ctx.strokeStyle = connGradient
          ctx.lineWidth = 0.5 + connectionStrength * 2

          ctx.beginPath()
          ctx.moveTo(node.x, node.y)

          const midX = (node.x + connNode.x) / 2
          const midY = (node.y + connNode.y) / 2 - 10
          ctx.quadraticCurveTo(midX, midY, connNode.x, connNode.y)
          ctx.stroke()
        }
      }

      for (const node of nodes) {
        node.activationLevel *= 0.95
        if (node.pulseIntensity > 0.1) {
          node.activationLevel = Math.max(node.activationLevel, node.pulseIntensity)
          node.lastActivation = time
        }

        if (node.activationLevel > 0) {
          ctx.shadowColor = "rgba(52, 211, 153, 0.8)"
          ctx.shadowBlur = 15 * node.activationLevel
        } else {
          ctx.shadowBlur = 0
        }

        const baseSize = node.nodeType === "atrium" ? 6 : node.nodeType === "ventricle" ? 8 : 5
        const nodeSize = baseSize + node.activationLevel * 4

        let nodeColor = `rgba(52, 211, 153, ${0.6 + node.activationLevel * 0.4})`
        if (node.nodeType === "atrium") {
          nodeColor = `rgba(59, 130, 246, ${0.6 + node.activationLevel * 0.4})`
        } else if (node.nodeType === "ventricle") {
          nodeColor = `rgba(139, 92, 246, ${0.6 + node.activationLevel * 0.4})`
        }

        ctx.fillStyle = nodeColor
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
        ctx.fill()

        if (node.activationLevel > 0.5) {
          ctx.strokeStyle = `rgba(52, 211, 153, ${0.3 * node.activationLevel})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(node.x, node.y, nodeSize + 5 + Math.sin(time * 3) * 3, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.shadowBlur = 0
        node.pulseIntensity *= 0.95
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i]

        if (pulse.progress >= 1) {
          const targetNode = nodes[pulse.targetNode]
          targetNode.pulseIntensity = Math.max(targetNode.pulseIntensity, pulse.intensity)

          if (targetNode.connections.length > 0 && Math.random() < 0.7) {
            const nextTargetIndex = targetNode.connections[Math.floor(Math.random() * targetNode.connections.length)]
            const nextTarget = nodes[nextTargetIndex]

            const pathPoints = []
            const steps = 10
            for (let j = 0; j <= steps; j++) {
              const t = j / steps
              const curveHeight = 15 * Math.sin(Math.PI * t)
              const x = targetNode.x + (nextTarget.x - targetNode.x) * t
              const y = targetNode.y + (nextTarget.y - targetNode.y) * t + curveHeight
              pathPoints.push({ x, y })
            }

            pulses.push({
              nodeIndex: pulse.targetNode,
              targetNode: nextTargetIndex,
              progress: 0,
              speed: pulse.speed * 0.9,
              intensity: pulse.intensity * 0.8,
              pathPoints,
            })
          }

          pulses.splice(i, 1)
        } else {
          const pathIndex = Math.floor(pulse.progress * (pulse.pathPoints.length - 1))
          const currentPoint = pulse.pathPoints[pathIndex]

          if (currentPoint) {
            ctx.shadowColor = "rgba(52, 211, 153, 0.8)"
            ctx.shadowBlur = 12 * pulse.intensity

            ctx.fillStyle = `rgba(52, 211, 153, ${0.9 * pulse.intensity})`
            ctx.beginPath()
            ctx.arc(currentPoint.x, currentPoint.y, 3 * pulse.intensity, 0, Math.PI * 2)
            ctx.fill()

            for (let j = 1; j <= 3 && pathIndex - j >= 0; j++) {
              const trailPoint = pulse.pathPoints[pathIndex - j]
              const trailAlpha = (0.3 * pulse.intensity) / j
              ctx.fillStyle = `rgba(52, 211, 153, ${trailAlpha})`
              ctx.beginPath()
              ctx.arc(trailPoint.x, trailPoint.y, (2 * pulse.intensity) / j, 0, Math.PI * 2)
              ctx.fill()
            }

            ctx.shadowBlur = 0
          }

          pulse.progress += pulse.speed
        }
      }

      const pulseFrequency = processingThought || currentThoughtPattern ? 0.98 : 0.995
      if (Math.random() > pulseFrequency) {
        addPulse()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    if (processingThought || currentThoughtPattern) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => addPulse(), i * 200)
      }
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [active, processingThought, currentThoughtPattern, config.processingSpeed, zoom, rotation, visualizerMode])

  const downloadVisualization = () => {
    if (!thoughtImage) {
      toast({
        title: "Error",
        description: "No hay imagen generada para descargar",
        variant: "destructive",
      })
      return
    }

    const nftToken = `NFT-CARDIAC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const imageId = Date.now().toString()

    setCurrentNFTToken(nftToken)
    setCurrentImageId(imageId)

    setShowNFTModal(true)
  }

  if (!active) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Conecta el monitor cardíaco para visualizar los pulsos</p>
      </div>
    )
  }

  return (
    <>
      <div
        id="thought-visualizer"
        className={`w-full ${fullscreen || isFullscreen ? "h-[600px]" : "h-full"} relative`}
        ref={containerRef}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
            onClick={() =>
              setVisualizerMode(
                visualizerMode === "cardiac"
                  ? "heartrate"
                  : visualizerMode === "heartrate"
                    ? "flow"
                    : visualizerMode === "flow"
                      ? "rhythm"
                      : "cardiac",
              )
            }
          >
            {visualizerMode === "cardiac" && (
              <>
                <Heart className="h-4 w-4 mr-1" /> Patrón Cardíaco
              </>
            )}
            {visualizerMode === "heartrate" && (
              <>
                <Activity className="h-4 w-4 mr-1" /> Ritmo Cardíaco
              </>
            )}
            {visualizerMode === "flow" && (
              <>
                <Layers className="h-4 w-4 mr-1" /> Flujo Sanguíneo
              </>
            )}
            {visualizerMode === "rhythm" && (
              <>
                <Eye className="h-4 w-4 mr-1" /> Actividad Cardíaca
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 right-2 z-10"
            >
              <Card className="bg-background/80 backdrop-blur-sm border-none shadow-lg">
                <CardContent className="p-3 flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(zoom + 10, 200))}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(zoom - 10, 50))}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setRotation((rotation + 15) % 360)}>
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={downloadVisualization}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Detalles</Label>
                    <Switch checked={showDetails} onCheckedChange={setShowDetails} size="sm" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">Zoom</Label>
                      <span className="text-xs">{zoom}%</span>
                    </div>
                    <Slider
                      value={[zoom]}
                      onValueChange={(values) => setZoom(values[0])}
                      min={50}
                      max={200}
                      step={5}
                      className="h-1.5"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {visualizerMode === "heartrate" && (
          <div className="absolute inset-0 p-4">
            <div className="h-full bg-black/20 rounded-lg p-4">
              <h3 className="text-emerald-400 font-medium mb-4">Pulsos Cardíacos en Tiempo Real</h3>
              <div className="space-y-4">
                {brainwaveData.map((wave, index) => (
                  <div key={wave.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: wave.color }}>
                        {wave.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{wave.frequency}BPM</span>
                    </div>
                    <div className="h-8 bg-muted/20 rounded overflow-hidden">
                      <svg className="w-full h-full">
                        <motion.path
                          d={`M 0 16 ${Array.from({ length: 100 }, (_, i) => {
                            const x = (i / 99) * 100
                            const y = 16 + Math.sin(wave.phase + i * 0.2) * wave.amplitude * 12
                            return `L ${x} ${y}`
                          }).join(" ")}`}
                          fill="none"
                          stroke={wave.color}
                          strokeWidth="2"
                          opacity={0.8}
                          animate={{
                            pathLength: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(visualizerMode === "cardiac" || visualizerMode === "flow") && (
          <canvas
            ref={canvasRef}
            width={800}
            height={fullscreen || isFullscreen ? 600 : 300}
            className="w-full h-full"
          />
        )}

        <AnimatePresence>
          {(visualizerMode === "rhythm" || (thoughtText && thoughtImage && !processingThought && showDetails)) && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-black/70 p-6 rounded-lg max-w-md backdrop-blur-sm border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg font-medium text-emerald-400">Pulso Cardíaco Detectado:</h3>
                </div>
                <p className="text-white mb-4">{thoughtText || "Procesando actividad cardíaca..."}</p>

                {thoughtImage && (
                  <div className="border border-emerald-800 rounded-md overflow-hidden mb-4">
                    <img
                      src={thoughtImage || "/placeholder.svg"}
                      alt="Patrón cardíaco"
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {currentThoughtPattern && (
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Estabilidad: {currentThoughtPattern.complexityScore}%</div>
                    <div>Intensidad: {currentThoughtPattern.cognitiveLoad}%</div>
                    <div>Frecuencia: {currentThoughtPattern.dominantFrequency}</div>
                    <div>Salud: {currentThoughtPattern.emotionalValence}%</div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {processingThought && (
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
                  <Heart className="h-4 w-4" />
                </motion.div>
                Procesando pulsos cardíacos avanzados
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      <NFTDownloadModal
        isOpen={showNFTModal}
        onClose={() => setShowNFTModal(false)}
        imageUrl={thoughtImage || ""}
        nftToken={currentNFTToken}
        imageId={currentImageId}
      />
    </>
  )
}
