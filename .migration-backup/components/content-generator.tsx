"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  ImageIcon,
  Sparkles,
  Brain,
  Check,
  AlertCircle,
  Sliders,
  Zap,
  Download,
  Copy,
  Palette,
  Eye,
  Camera,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useNoosfera, type ContentType } from "@/contexts/noosfera-context"
import { toast } from "react-hot-toast"
import type { JSX } from "react/jsx-runtime"

type ImageStyle =
  | "abstract"
  | "realistic"
  | "hyperrealistic"
  | "surreal"
  | "minimalist"
  | "organic"
  | "geometric"
  | "fractal"

interface StyleConfig {
  name: string
  description: string
  icon: JSX.Element
  complexity: number
  creativity: number
}

export default function ContentGenerator() {
  const [generatingContent, setGeneratingContent] = useState(false)
  const [generationType, setGenerationType] = useState<ContentType>("text")
  const [generationProgress, setGenerationProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const [complexity, setComplexity] = useState(50)
  const [creativity, setCreativity] = useState(70)
  const [enhanceOutput, setEnhanceOutput] = useState(true)
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>("abstract")
  const [interpretationMode, setInterpretationMode] = useState<"automatic" | "guided" | "creative">("automatic")
  const [emotionalIntensity, setEmotionalIntensity] = useState(60)
  const [visualDetail, setVisualDetail] = useState(75)
  const [colorHarmony, setColorHarmony] = useState<
    "monochromatic" | "complementary" | "triadic" | "analogous" | "vibrant"
  >("complementary")
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  const { connectionStatus, processingThought, currentThoughtPattern, generateContent, config } = useNoosfera()

  const connected = connectionStatus === "connected"

  const styleConfigs: Record<ImageStyle, StyleConfig> = {
    abstract: {
      name: "Abstracto",
      description: "Formas y colores que representan conceptos e ideas",
      icon: <Palette className="h-4 w-4" />,
      complexity: 70,
      creativity: 90,
    },
    realistic: {
      name: "Realista",
      description: "Representaciones fieles a la realidad",
      icon: <Eye className="h-4 w-4" />,
      complexity: 85,
      creativity: 40,
    },
    hyperrealistic: {
      name: "Hiperrealista",
      description: "Detalles extremos que superan la realidad",
      icon: <Camera className="h-4 w-4" />,
      complexity: 95,
      creativity: 30,
    },
    surreal: {
      name: "Surrealista",
      description: "Combinaciones imposibles y oníricas",
      icon: <Brain className="h-4 w-4" />,
      complexity: 80,
      creativity: 95,
    },
    minimalist: {
      name: "Minimalista",
      description: "Simplicidad y elementos esenciales",
      icon: <Sparkles className="h-4 w-4" />,
      complexity: 30,
      creativity: 50,
    },
    organic: {
      name: "Orgánico",
      description: "Formas naturales y fluidas",
      icon: <Sparkles className="h-4 w-4" />,
      complexity: 60,
      creativity: 70,
    },
    geometric: {
      name: "Geométrico",
      description: "Patrones y formas matemáticas",
      icon: <Sparkles className="h-4 w-4" />,
      complexity: 75,
      creativity: 55,
    },
    fractal: {
      name: "Fractal",
      description: "Patrones auto-similares infinitos",
      icon: <Sparkles className="h-4 w-4" />,
      complexity: 90,
      creativity: 80,
    },
  }

  // Reset states when changing generation type
  useEffect(() => {
    setError(null)
    setSuccess(false)
    setPreviewContent(null)
  }, [generationType])

  useEffect(() => {
    if (!currentThoughtPattern || !connected) return

    // Generate preview for text
    if (generationType === "text") {
      const previewTexts = [
        "Los pensamientos fluyen como ríos de información neuronal, creando patrones complejos que definen nuestra experiencia consciente...",
        "La mente humana es un universo de conexiones, donde cada sinapsis contribuye a la sinfonía del pensamiento y la percepción...",
        "En el silencio de la contemplación, emergen estructuras cognitivas que revelan la arquitectura fundamental de nuestra consciencia...",
        "Los patrones neuronales capturados sugieren una actividad cerebral enfocada en procesos analíticos y resolución de problemas...",
        "La interfaz cerebro-computadora ha detectado secuencias que indican un estado de flujo mental, donde la creatividad y la lógica convergen...",
      ]

      const index = Math.floor((complexity + creativity) / 40) % previewTexts.length
      setPreviewContent(previewTexts[index])
    } else if (generationType === "image" && previewCanvasRef.current) {
      generateAdvancedImagePreview()
    }
  }, [
    currentThoughtPattern,
    connected,
    generationType,
    complexity,
    creativity,
    enhanceOutput,
    selectedStyle,
    emotionalIntensity,
    visualDetail,
    colorHarmony,
    interpretationMode,
  ])

  const generateAdvancedImagePreview = () => {
    const canvas = previewCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get style configuration
    const styleConfig = styleConfigs[selectedStyle]
    const effectiveComplexity = Math.min(100, complexity + styleConfig.complexity) / 2
    const effectiveCreativity = Math.min(100, creativity + styleConfig.creativity) / 2

    // Generate color palette based on thought pattern and emotional intensity
    const generateColorPalette = () => {
      const baseHue = currentThoughtPattern ? (currentThoughtPattern.emotionalValence * 3.6) % 360 : 180
      const saturation = Math.min(100, emotionalIntensity + 20)
      const lightness = 30 + visualDetail / 2

      switch (colorHarmony) {
        case "monochromatic":
          return [
            `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
            `hsl(${baseHue}, ${saturation - 20}%, ${lightness + 20}%)`,
            `hsl(${baseHue}, ${saturation - 10}%, ${lightness + 10}%)`,
          ]
        case "complementary":
          return [
            `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
            `hsl(${(baseHue + 180) % 360}, ${saturation}%, ${lightness}%)`,
            `hsl(${baseHue}, ${saturation - 30}%, ${lightness + 30}%)`,
          ]
        case "triadic":
          return [
            `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
            `hsl(${(baseHue + 120) % 360}, ${saturation}%, ${lightness}%)`,
            `hsl(${(baseHue + 240) % 360}, ${saturation}%, ${lightness}%)`,
          ]
        case "analogous":
          return [
            `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
            `hsl(${(baseHue + 30) % 360}, ${saturation}%, ${lightness}%)`,
            `hsl(${(baseHue - 30 + 360) % 360}, ${saturation}%, ${lightness}%)`,
          ]
        case "vibrant":
          return [
            `hsl(${baseHue}, 90%, 50%)`,
            `hsl(${(baseHue + 60) % 360}, 85%, 45%)`,
            `hsl(${(baseHue + 120) % 360}, 80%, 55%)`,
          ]
        default:
          return [`hsl(${baseHue}, ${saturation}%, ${lightness}%)`]
      }
    }

    const colors = generateColorPalette()

    // Create background based on style
    const createBackground = () => {
      switch (selectedStyle) {
        case "abstract":
        case "surreal":
          const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            Math.max(canvas.width, canvas.height) / 2,
          )
          gradient.addColorStop(0, colors[0])
          gradient.addColorStop(0.5, colors[1] || colors[0])
          gradient.addColorStop(1, colors[2] || colors[0])
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          break

        case "realistic":
        case "hyperrealistic":
          const linearGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          linearGrad.addColorStop(0, colors[0])
          linearGrad.addColorStop(1, colors[1] || colors[0])
          ctx.fillStyle = linearGrad
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          break

        case "minimalist":
          ctx.fillStyle = colors[0]
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          break

        default:
          const defaultGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          defaultGrad.addColorStop(0, colors[0])
          defaultGrad.addColorStop(1, colors[1] || colors[0])
          ctx.fillStyle = defaultGrad
          ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }

    createBackground()

    // Generate elements based on style and interpretation mode
    const numElements =
      selectedStyle === "minimalist"
        ? Math.floor(effectiveComplexity / 20) + 2
        : Math.floor(effectiveComplexity / 5) + 10

    for (let i = 0; i < numElements; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = (Math.random() * visualDetail) / 2 + 10
      const alpha = Math.random() * 0.8 + 0.2

      // Color selection based on emotional intensity
      const colorIndex = Math.floor(Math.random() * colors.length)
      const baseColor = colors[colorIndex]
      const emotionalShift = (emotionalIntensity - 50) / 50 // -1 to 1

      ctx.fillStyle = baseColor.replace(")", `, ${alpha})`)
      ctx.strokeStyle = baseColor

      // Draw elements based on style
      switch (selectedStyle) {
        case "abstract":
          drawAbstractShape(ctx, x, y, size, effectiveCreativity)
          break
        case "realistic":
          drawRealisticElement(ctx, x, y, size)
          break
        case "hyperrealistic":
          drawHyperRealisticElement(ctx, x, y, size, visualDetail)
          break
        case "surreal":
          drawSurrealElement(ctx, x, y, size, effectiveCreativity)
          break
        case "minimalist":
          drawMinimalistElement(ctx, x, y, size)
          break
        case "organic":
          drawOrganicShape(ctx, x, y, size, effectiveCreativity)
          break
        case "geometric":
          drawGeometricShape(ctx, x, y, size, i)
          break
        case "fractal":
          drawFractalPattern(ctx, x, y, size, 3)
          break
      }
    }

    // Apply post-processing effects
    if (enhanceOutput) {
      applyPostProcessingEffects(ctx, canvas)
    }

    setPreviewContent(canvas.toDataURL("image/png"))
  }

  const drawAbstractShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, creativity: number) => {
    ctx.beginPath()
    const points = Math.floor(creativity / 15) + 3
    const angleStep = (Math.PI * 2) / points

    for (let i = 0; i < points; i++) {
      const angle = i * angleStep + ((Math.random() - 0.5) * creativity) / 50
      const radius = size * (0.5 + Math.random() * 0.5)
      const px = x + Math.cos(angle) * radius
      const py = y + Math.sin(angle) * radius

      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }

  const drawRealisticElement = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Simple realistic shapes - circles and rectangles with gradients
    const shapeType = Math.random()
    if (shapeType < 0.5) {
      ctx.beginPath()
      ctx.arc(x, y, size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillRect(x - size / 2, y - size / 2, size, size)
    }
  }

  const drawHyperRealisticElement = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    detail: number,
  ) => {
    // Multiple layers for hyperrealistic effect
    for (let layer = 0; layer < Math.floor(detail / 25) + 1; layer++) {
      const layerSize = size * (1 - layer * 0.1)
      const layerAlpha = 0.8 - layer * 0.2

      ctx.globalAlpha = layerAlpha
      ctx.beginPath()
      ctx.arc(x, y, layerSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  const drawSurrealElement = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    creativity: number,
  ) => {
    // Impossible or dream-like shapes
    ctx.beginPath()
    const segments = Math.floor(creativity / 20) + 4
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const radius = size * (0.3 + Math.sin(angle * 3) * 0.4)
      const px = x + Math.cos(angle) * radius
      const py = y + Math.sin(angle) * radius

      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }

  const drawMinimalistElement = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Simple, clean shapes
    const shapeType = Math.floor(Math.random() * 3)
    ctx.lineWidth = 2

    switch (shapeType) {
      case 0: // Circle
        ctx.beginPath()
        ctx.arc(x, y, size / 2, 0, Math.PI * 2)
        ctx.stroke()
        break
      case 1: // Square
        ctx.strokeRect(x - size / 2, y - size / 2, size, size)
        break
      case 2: // Line
        ctx.beginPath()
        ctx.moveTo(x - size / 2, y)
        ctx.lineTo(x + size / 2, y)
        ctx.stroke()
        break
    }
  }

  const drawOrganicShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, creativity: number) => {
    // Natural, flowing shapes
    ctx.beginPath()
    const points = 8
    const angleStep = (Math.PI * 2) / points

    for (let i = 0; i <= points; i++) {
      const angle = i * angleStep
      const radiusVariation = Math.sin(angle * 2) * 0.3 + Math.sin(angle * 3) * 0.2
      const radius = size * (0.4 + radiusVariation + Math.random() * 0.2)
      const px = x + Math.cos(angle) * radius
      const py = y + Math.sin(angle) * radius

      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.fill()
  }

  const drawGeometricShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, index: number) => {
    // Mathematical shapes
    const shapeType = index % 4

    switch (shapeType) {
      case 0: // Triangle
        ctx.beginPath()
        ctx.moveTo(x, y - size / 2)
        ctx.lineTo(x - size / 2, y + size / 2)
        ctx.lineTo(x + size / 2, y + size / 2)
        ctx.closePath()
        ctx.fill()
        break
      case 1: // Hexagon
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          const px = x + (Math.cos(angle) * size) / 2
          const py = y + (Math.sin(angle) * size) / 2
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
        break
      case 2: // Diamond
        ctx.beginPath()
        ctx.moveTo(x, y - size / 2)
        ctx.lineTo(x + size / 2, y)
        ctx.lineTo(x, y + size / 2)
        ctx.lineTo(x - size / 2, y)
        ctx.closePath()
        ctx.fill()
        break
      case 3: // Star
        ctx.beginPath()
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2
          const radius = i % 2 === 0 ? size / 2 : size / 4
          const px = x + Math.cos(angle) * radius
          const py = y + Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
        break
    }
  }

  const drawFractalPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, depth: number) => {
    if (depth <= 0 || size < 2) return

    // Simple fractal tree
    ctx.beginPath()
    ctx.arc(x, y, size / 2, 0, Math.PI * 2)
    ctx.fill()

    if (depth > 1) {
      const newSize = size * 0.6
      const offset = size * 0.7
      drawFractalPattern(ctx, x - offset, y - offset, newSize, depth - 1)
      drawFractalPattern(ctx, x + offset, y - offset, newSize, depth - 1)
      drawFractalPattern(ctx, x, y + offset, newSize, depth - 1)
    }
  }

  const applyPostProcessingEffects = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Glow effect
    ctx.globalCompositeOperation = "overlay"
    const glowGradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height) / 2,
    )
    glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)")
    glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
    ctx.fillStyle = glowGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over"
  }

  const handleGenerateContent = async () => {
    if (!connected || !currentThoughtPattern) {
      setError("Debes capturar un pensamiento antes de generar contenido")
      return
    }

    setError(null)
    setSuccess(false)
    setGeneratingContent(true)
    setGenerationProgress(0)

    // Simular progreso con animación más fluida
    const startTime = Date.now()
    const totalDuration = 3000 * (1 - (config.processingSpeed / 100) * 0.7) // Duración basada en la velocidad configurada

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, (elapsed / totalDuration) * 100)
      setGenerationProgress(progress)

      if (progress < 100) {
        requestAnimationFrame(updateProgress)
      }
    }

    requestAnimationFrame(updateProgress)

    try {
      await generateContent(generationType)
      setSuccess(true)
      toast.success(`${generationType === "text" ? "Texto" : "Imagen"} generado correctamente`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al generar contenido"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setGenerationProgress(100)
      setGeneratingContent(false)
    }
  }

  const copyToClipboard = () => {
    if (previewContent && generationType === "text") {
      navigator.clipboard
        .writeText(previewContent)
        .then(() => toast.success("Texto copiado al portapapeles"))
        .catch(() => toast.error("No se pudo copiar el texto"))
    }
  }

  const downloadPreview = () => {
    if (previewContent) {
      if (generationType === "image") {
        const link = document.createElement("a")
        link.href = previewContent
        link.download = `preview-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Imagen descargada")
      } else {
        const blob = new Blob([previewContent], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `preview-${Date.now()}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success("Texto descargado")
      }
    }
  }

  return (
    <div id="content-generator">
      <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            Generador de Contenido Neural
          </CardTitle>
          <CardDescription>Transforma tus patrones neuronales en contenido digital</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" onValueChange={(value) => setGenerationType(value as ContentType)}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Texto
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Imagen
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              {/* ... existing text content ... */}
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 p-2 flex justify-between items-center border-b">
                    <div className="text-sm font-medium">Vista previa</div>
                    <div className="flex gap-1">
                      {previewContent && (
                        <>
                          <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={downloadPreview} className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        className="h-8 w-8"
                      >
                        <Sliders className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 min-h-[200px] flex items-center justify-center">
                    {generatingContent && (
                      <div className="text-center space-y-4 w-full">
                        <div className="flex justify-center">
                          <motion.div
                            className="relative"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <Brain className="h-10 w-10 text-emerald-500" />
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              animate={{
                                boxShadow: [
                                  "0 0 0 0 rgba(16, 185, 129, 0.4)",
                                  "0 0 0 10px rgba(16, 185, 129, 0)",
                                  "0 0 0 0 rgba(16, 185, 129, 0)",
                                ],
                              }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            />
                          </motion.div>
                        </div>
                        <h3 className="text-lg font-medium">Generando texto...</h3>
                        <div className="w-full max-w-md mx-auto space-y-2">
                          <div className="relative">
                            <Progress value={generationProgress} className="h-2" />
                            <motion.div
                              className="absolute top-0 left-0 h-full bg-emerald-500/30"
                              style={{
                                width: `${generationProgress}%`,
                                clipPath: "inset(0 0 0 0)",
                              }}
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Procesando patrones neuronales</span>
                            <span>{Math.round(generationProgress)}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {!generatingContent && (
                      <div className="w-full">
                        {success ? (
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-3">
                              <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                              Contenido generado con éxito
                            </p>
                            <p className="text-sm text-muted-foreground">Puedes verlo en la biblioteca de contenido</p>
                          </div>
                        ) : previewContent ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="whitespace-pre-wrap">{previewContent}</p>
                          </div>
                        ) : (
                          <div className="text-center space-y-2">
                            <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground">
                              {currentThoughtPattern
                                ? "Ajusta los parámetros y presiona el botón para generar texto"
                                : "Captura un pensamiento primero para poder generar texto"}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {showAdvancedOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Sliders className="h-4 w-4 text-emerald-500" />
                          Parámetros de generación
                        </h3>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Complejidad</Label>
                              <span className="text-sm">{complexity}%</span>
                            </div>
                            <Slider
                              value={[complexity]}
                              onValueChange={(values) => setComplexity(values[0])}
                              max={100}
                              step={1}
                            />
                            <p className="text-xs text-muted-foreground">
                              Controla la complejidad y profundidad del texto generado
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Creatividad</Label>
                              <span className="text-sm">{creativity}%</span>
                            </div>
                            <Slider
                              value={[creativity]}
                              onValueChange={(values) => setCreativity(values[0])}
                              max={100}
                              step={1}
                            />
                            <p className="text-xs text-muted-foreground">
                              Ajusta el nivel de creatividad y variabilidad
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Mejorar salida</Label>
                              <p className="text-xs text-muted-foreground">
                                Aplica mejoras automáticas al contenido generado
                              </p>
                            </div>
                            <Switch checked={enhanceOutput} onCheckedChange={setEnhanceOutput} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="image">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Button
                    variant={interpretationMode === "automatic" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInterpretationMode("automatic")}
                    className="flex items-center gap-1"
                  >
                    <Brain className="h-3 w-3" />
                    Automático
                  </Button>
                  <Button
                    variant={interpretationMode === "guided" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInterpretationMode("guided")}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Guiado
                  </Button>
                  <Button
                    variant={interpretationMode === "creative" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInterpretationMode("creative")}
                    className="flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    Creativo
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 p-2 flex justify-between items-center border-b">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">Vista previa</div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {styleConfigs[selectedStyle].icon}
                        {styleConfigs[selectedStyle].name}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {previewContent && (
                        <Button variant="ghost" size="icon" onClick={downloadPreview} className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        className="h-8 w-8"
                      >
                        <Sliders className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 min-h-[300px] flex items-center justify-center">
                    {generatingContent && (
                      <div className="text-center space-y-4 w-full">
                        <div className="flex justify-center">
                          <motion.div
                            className="relative"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <Brain className="h-10 w-10 text-emerald-500" />
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              animate={{
                                boxShadow: [
                                  "0 0 0 0 rgba(16, 185, 129, 0.4)",
                                  "0 0 0 10px rgba(16, 185, 129, 0)",
                                  "0 0 0 0 rgba(16, 185, 129, 0)",
                                ],
                              }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            />
                          </motion.div>
                        </div>
                        <h3 className="text-lg font-medium">
                          Generando imagen {styleConfigs[selectedStyle].name.toLowerCase()}...
                        </h3>
                        <div className="w-full max-w-md mx-auto space-y-2">
                          <div className="relative">
                            <Progress value={generationProgress} className="h-2" />
                            <motion.div
                              className="absolute top-0 left-0 h-full bg-emerald-500/30"
                              style={{
                                width: `${generationProgress}%`,
                                clipPath: "inset(0 0 0 0)",
                              }}
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Interpretando patrones neuronales</span>
                            <span>{Math.round(generationProgress)}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {!generatingContent && (
                      <div className="w-full">
                        {success ? (
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-3">
                              <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                              Imagen generada con éxito
                            </p>
                            <p className="text-sm text-muted-foreground">Puedes verla en la biblioteca de contenido</p>
                          </div>
                        ) : previewContent ? (
                          <div className="flex justify-center">
                            <img
                              src={previewContent || "/placeholder.svg"}
                              alt="Vista previa de imagen"
                              className="max-w-full max-h-[300px] rounded-md shadow-md"
                            />
                          </div>
                        ) : (
                          <div className="text-center space-y-2">
                            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground">
                              {currentThoughtPattern
                                ? "Ajusta los parámetros y presiona el botón para generar una imagen"
                                : "Captura un pensamiento primero para poder generar una imagen"}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Canvas oculto para generar la vista previa */}
                  <canvas ref={previewCanvasRef} width={400} height={300} className="hidden" />
                </div>

                <AnimatePresence>
                  {showAdvancedOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border rounded-lg p-4 space-y-6 bg-muted/30">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Sliders className="h-4 w-4 text-emerald-500" />
                          Parámetros avanzados de imagen
                        </h3>

                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label>Estilo de interpretación</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(styleConfigs).map(([key, config]) => (
                                <Button
                                  key={key}
                                  variant={selectedStyle === key ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setSelectedStyle(key as ImageStyle)}
                                  className="flex items-center gap-2 justify-start h-auto p-3"
                                >
                                  {config.icon}
                                  <div className="text-left">
                                    <div className="font-medium">{config.name}</div>
                                    <div className="text-xs text-muted-foreground">{config.description}</div>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Armonía de colores</Label>
                            <Select value={colorHarmony} onValueChange={(value: any) => setColorHarmony(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monochromatic">Monocromático</SelectItem>
                                <SelectItem value="complementary">Complementario</SelectItem>
                                <SelectItem value="triadic">Triádico</SelectItem>
                                <SelectItem value="analogous">Análogo</SelectItem>
                                <SelectItem value="vibrant">Vibrante</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Intensidad emocional</Label>
                              <span className="text-sm">{emotionalIntensity}%</span>
                            </div>
                            <Slider
                              value={[emotionalIntensity]}
                              onValueChange={(values) => setEmotionalIntensity(values[0])}
                              max={100}
                              step={1}
                            />
                            <p className="text-xs text-muted-foreground">
                              Controla la intensidad emocional reflejada en colores y formas
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Detalle visual</Label>
                              <span className="text-sm">{visualDetail}%</span>
                            </div>
                            <Slider
                              value={[visualDetail]}
                              onValueChange={(values) => setVisualDetail(values[0])}
                              max={100}
                              step={1}
                            />
                            <p className="text-xs text-muted-foreground">
                              Ajusta el nivel de detalle y complejidad visual
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Complejidad</Label>
                              <span className="text-sm">{complexity}%</span>
                            </div>
                            <Slider
                              value={[complexity]}
                              onValueChange={(values) => setComplexity(values[0])}
                              max={100}
                              step={1}
                            />
                            <p className="text-xs text-muted-foreground">
                              Controla la complejidad y detalle de la imagen
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Creatividad</Label>
                              <span className="text-sm">{creativity}%</span>
                            </div>
                            <Slider
                              value={[creativity]}
                              onValueChange={(values) => setCreativity(values[0])}
                              max={100}
                              step={1}
                            />
                            <p className="text-xs text-muted-foreground">
                              Ajusta el nivel de creatividad y variabilidad
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Mejorar salida</Label>
                              <p className="text-xs text-muted-foreground">
                                Aplica efectos visuales y mejoras a la imagen
                              </p>
                            </div>
                            <Switch checked={enhanceOutput} onCheckedChange={setEnhanceOutput} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            onClick={handleGenerateContent}
            disabled={!connected || generatingContent || processingThought || !currentThoughtPattern}
            className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
          >
            {generatingContent ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Zap className="h-4 w-4" />
                </motion.div>
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>
                  Generar{" "}
                  {generationType === "text" ? "texto" : `imagen ${styleConfigs[selectedStyle].name.toLowerCase()}`}
                </span>
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            {!connected
              ? "Conecta el BCI para generar contenido"
              : !currentThoughtPattern
                ? "Captura un pensamiento primero"
                : `Modo ${interpretationMode} - El contenido generado se guardará en tu biblioteca`}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
