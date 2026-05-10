"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useNoosfera } from "@/contexts/noosfera-context"
import { toast } from "react-hot-toast"
import ThoughtVisualizer from "@/components/thought-visualizer"
import {
  Brain,
  Activity,
  Zap,
  Download,
  Camera,
  Layers,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Wand2,
  Waves,
  Lightbulb,
  Gauge,
  BarChart3,
  LineChart,
  PieChart,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Filter,
} from "lucide-react"

// Componente para visualización avanzada de patrones neuronales
export default function VisualizationDashboard() {
  const {
    connectionStatus,
    brainwaveActivity,
    patternAnalysis,
    currentThoughtPattern,
    brainwaveHistory,
    captureThought,
    processingThought,
  } = useNoosfera()

  const [activeTab, setActiveTab] = useState("realtime")
  const [visualizationMode, setVisualizationMode] = useState("3d")
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [rotationSpeed, setRotationSpeed] = useState(50)
  const [detailLevel, setDetailLevel] = useState(75)
  const [colorScheme, setColorScheme] = useState("spectrum")
  const [showLabels, setShowLabels] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedData, setRecordedData] = useState<any[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState("png")
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["all"])
  const [highlightFrequency, setHighlightFrequency] = useState<string>("none")
  const [timeWindow, setTimeWindow] = useState("30s")
  const [analysisMode, setAnalysisMode] = useState("amplitude")
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureInterval, setCaptureInterval] = useState<NodeJS.Timeout | null>(null)
  const [captureCount, setCaptureCount] = useState(0)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [annotations, setAnnotations] = useState<
    { id: string; text: string; position: { x: number; y: number }; timestamp: number }[]
  >([])
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false)
  const [newAnnotationText, setNewAnnotationText] = useState("")
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null)
  const [filterSettings, setFilterSettings] = useState({
    noiseReduction: 50,
    smoothing: 30,
    threshold: 20,
    enhancement: 40,
  })

  const visualizerRef = useRef<HTMLDivElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Regiones cerebrales disponibles para selección
  const brainRegions = [
    { id: "all", name: "Todas las regiones" },
    { id: "frontal", name: "Lóbulo Frontal" },
    { id: "parietal", name: "Lóbulo Parietal" },
    { id: "temporal", name: "Lóbulo Temporal" },
    { id: "occipital", name: "Lóbulo Occipital" },
    { id: "cerebellum", name: "Cerebelo" },
    { id: "brainstem", name: "Tronco Encefálico" },
  ]

  // Bandas de frecuencia para resaltar
  const frequencyBands = [
    { id: "none", name: "Ninguna", color: "#cccccc" },
    { id: "delta", name: "Delta (0.5-4 Hz)", color: "#ec4899" },
    { id: "theta", name: "Theta (4-8 Hz)", color: "#8b5cf6" },
    { id: "alpha", name: "Alpha (8-13 Hz)", color: "#10b981" },
    { id: "beta", name: "Beta (13-30 Hz)", color: "#3b82f6" },
    { id: "gamma", name: "Gamma (30-100 Hz)", color: "#f59e0b" },
  ]

  // Esquemas de color disponibles
  const colorSchemes = [
    { id: "spectrum", name: "Espectro", description: "Colores basados en el espectro de frecuencias" },
    { id: "heatmap", name: "Mapa de calor", description: "Intensidad representada por temperatura de color" },
    { id: "monochrome", name: "Monocromático", description: "Escala de un solo color con diferentes intensidades" },
    { id: "neural", name: "Neural", description: "Colores inspirados en imágenes de neuroimagen" },
    { id: "contrast", name: "Alto contraste", description: "Máximo contraste para mejor visibilidad" },
  ]

  // Modos de análisis disponibles
  const analysisModes = [
    { id: "amplitude", name: "Amplitud", icon: <Activity className="h-4 w-4" /> },
    { id: "frequency", name: "Frecuencia", icon: <Waves className="h-4 w-4" /> },
    { id: "coherence", name: "Coherencia", icon: <Zap className="h-4 w-4" /> },
    { id: "complexity", name: "Complejidad", icon: <Sparkles className="h-4 w-4" /> },
    { id: "patterns", name: "Patrones", icon: <Lightbulb className="h-4 w-4" /> },
  ]

  // Ventanas de tiempo disponibles
  const timeWindows = [
    { id: "5s", name: "5 segundos" },
    { id: "30s", name: "30 segundos" },
    { id: "1m", name: "1 minuto" },
    { id: "5m", name: "5 minutos" },
    { id: "15m", name: "15 minutos" },
  ]

  // Iniciar/detener grabación de datos
  const toggleRecording = () => {
    if (isRecording) {
      // Detener grabación
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
      toast.success(`Grabación completada: ${recordingTime} segundos de datos`)
    } else {
      // Iniciar grabación
      setRecordedData([])
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)

        // Añadir datos actuales a la grabación
        if (currentThoughtPattern) {
          setRecordedData((prev) => [
            ...prev,
            {
              timestamp: Date.now(),
              pattern: currentThoughtPattern,
              brainwaveActivity,
              patternAnalysis,
            },
          ])
        }
      }, 1000)

      toast.success("Grabación iniciada")
    }

    setIsRecording(!isRecording)
  }

  // Exportar visualización o datos
  const handleExport = async () => {
    setIsExporting(true)

    try {
      if (exportFormat === "png" || exportFormat === "jpg") {
        // Exportar como imagen
        if (visualizerRef.current) {
          // Simulación de captura de imagen
          await new Promise((resolve) => setTimeout(resolve, 1500))
          toast.success(`Visualización exportada como ${exportFormat.toUpperCase()}`)
        }
      } else if (exportFormat === "json") {
        // Exportar datos como JSON
        const dataToExport =
          recordedData.length > 0
            ? recordedData
            : [
                {
                  timestamp: Date.now(),
                  pattern: currentThoughtPattern,
                  brainwaveActivity,
                  patternAnalysis,
                },
              ]

        const dataStr = JSON.stringify(dataToExport, null, 2)
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

        const exportFileDefaultName = `brain-data-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`

        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportFileDefaultName)
        linkElement.click()

        toast.success("Datos exportados como JSON")
      } else if (exportFormat === "csv") {
        // Exportar datos como CSV
        // Simulación de exportación CSV
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast.success("Datos exportados como CSV")
      }
    } catch (error) {
      toast.error("Error al exportar datos")
    } finally {
      setIsExporting(false)
    }
  }

  // Alternar modo de pantalla completa
  const toggleFullscreen = () => {
    if (visualizerRef.current) {
      if (!isFullscreen) {
        if (visualizerRef.current.requestFullscreen) {
          visualizerRef.current.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }

      setIsFullscreen(!isFullscreen)
    }
  }

  // Iniciar/detener captura automática
  const toggleAutoCapture = () => {
    if (isCapturing) {
      // Detener captura automática
      if (captureInterval) {
        clearInterval(captureInterval)
        setCaptureInterval(null)
      }
      toast.success(`Captura automática detenida. ${captureCount} capturas realizadas.`)
    } else {
      // Iniciar captura automática
      setCaptureCount(0)

      const interval = setInterval(async () => {
        if (connectionStatus === "connected" && !processingThought) {
          try {
            await captureThought()
            setCaptureCount((prev) => prev + 1)
          } catch (error) {
            console.error("Error en captura automática:", error)
          }
        }
      }, 10000) // Captura cada 10 segundos

      setCaptureInterval(interval)
      toast.success("Captura automática iniciada")
    }

    setIsCapturing(!isCapturing)
  }

  // Añadir anotación
  const addAnnotation = () => {
    if (newAnnotationText.trim() === "") return

    const newAnnotation = {
      id: `annotation-${Date.now()}`,
      text: newAnnotationText,
      position: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }, // Posición aleatoria
      timestamp: Date.now(),
    }

    setAnnotations((prev) => [...prev, newAnnotation])
    setNewAnnotationText("")
    setIsAddingAnnotation(false)
    toast.success("Anotación añadida")
  }

  // Eliminar anotación
  const deleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id))
    setSelectedAnnotation(null)
    toast.success("Anotación eliminada")
  }

  // Limpiar todas las anotaciones
  const clearAnnotations = () => {
    setAnnotations([])
    setSelectedAnnotation(null)
    toast.success("Todas las anotaciones eliminadas")
  }

  // Actualizar filtros
  const updateFilter = (filter: keyof typeof filterSettings, value: number[]) => {
    setFilterSettings((prev) => ({
      ...prev,
      [filter]: value[0],
    }))
  }

  // Restablecer filtros a valores predeterminados
  const resetFilters = () => {
    setFilterSettings({
      noiseReduction: 50,
      smoothing: 30,
      threshold: 20,
      enhancement: 40,
    })
    toast.success("Filtros restablecidos")
  }

  // Limpiar intervalo de grabación al desmontar
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (captureInterval) {
        clearInterval(captureInterval)
      }
    }
  }, [captureInterval])

  // Verificar si el dispositivo está conectado
  if (connectionStatus !== "connected") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-emerald-500" />
              Visualización Avanzada
            </CardTitle>
            <CardDescription>Visualización en tiempo real de patrones neuronales y actividad cerebral</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Dispositivo BCI no conectado</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Conecta tu dispositivo BCI para acceder a la visualización avanzada de patrones neuronales en tiempo real.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Zap className="mr-2 h-4 w-4" />
              Conectar Dispositivo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-emerald-500" />
                  Visualización Avanzada
                </CardTitle>
                <CardDescription>
                  Visualización en tiempo real de patrones neuronales y actividad cerebral
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={toggleFullscreen} className="flex items-center gap-1">
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Salir</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Pantalla completa</span>
                    </>
                  )}
                </Button>

                <Button
                  variant={showControls ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowControls(!showControls)}
                  className="flex items-center gap-1"
                >
                  {showControls ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span className="hidden sm:inline">Ocultar controles</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Mostrar controles</span>
                    </>
                  )}
                </Button>

                <Button
                  variant={isPaused ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex items-center gap-1"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4" />
                      <span className="hidden sm:inline">Reanudar</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" />
                      <span className="hidden sm:inline">Pausar</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="realtime" className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span>Tiempo real</span>
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>Análisis</span>
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  <span>Comparación</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Panel de visualización principal */}
              <div className={`${showControls ? "lg:col-span-3" : "lg:col-span-4"} relative`} ref={visualizerRef}>
                <div className="relative h-[600px] rounded-lg overflow-hidden border">
                  <div className="absolute inset-0">
                    <ThoughtVisualizer
                      fullscreen
                      isPaused={isPaused}
                      visualizationMode={visualizationMode}
                      zoomLevel={zoomLevel}
                      rotationSpeed={rotationSpeed}
                      detailLevel={detailLevel}
                      colorScheme={colorScheme}
                      showLabels={showLabels}
                      showGrid={showGrid}
                      showAxes={showAxes}
                      selectedRegions={selectedRegions}
                      highlightFrequency={highlightFrequency}
                      filterSettings={filterSettings}
                    />
                  </div>

                  {/* Anotaciones */}
                  {showAnnotations &&
                    annotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className={`absolute z-10 cursor-pointer ${selectedAnnotation === annotation.id ? "ring-2 ring-emerald-500" : ""}`}
                        style={{
                          left: `${annotation.position.x}%`,
                          top: `${annotation.position.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onClick={() =>
                          setSelectedAnnotation(annotation.id === selectedAnnotation ? null : annotation.id)
                        }
                      >
                        <div className="bg-emerald-500 h-3 w-3 rounded-full relative">
                          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500/30 animate-ping"></div>
                        </div>

                        {selectedAnnotation === annotation.id && (
                          <div className="absolute top-4 left-0 bg-card border rounded-md shadow-lg p-2 w-48 z-20">
                            <div className="text-sm font-medium mb-1">{annotation.text}</div>
                            <div className="text-xs text-muted-foreground mb-2">
                              {new Date(annotation.timestamp).toLocaleTimeString()}
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              onClick={() => deleteAnnotation(annotation.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}

                  {/* Indicadores de estado */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                      {activeTab === "realtime" ? "Tiempo real" : activeTab === "analysis" ? "Análisis" : "Comparación"}
                    </Badge>

                    {isRecording && (
                      <Badge className="bg-red-500 animate-pulse flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-white"></span>
                        Grabando: {recordingTime}s
                      </Badge>
                    )}

                    {isCapturing && (
                      <Badge className="bg-blue-500 flex items-center gap-1">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Auto-captura: {captureCount}
                      </Badge>
                    )}
                  </div>

                  {/* Controles flotantes */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-background/80 backdrop-blur-sm"
                      onClick={() => setIsAddingAnnotation(true)}
                    >
                      <Lightbulb className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-background/80 backdrop-blur-sm"
                      onClick={toggleRecording}
                    >
                      {isRecording ? <Pause className="h-4 w-4 text-red-500" /> : <Camera className="h-4 w-4" />}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-background/80 backdrop-blur-sm"
                      onClick={toggleAutoCapture}
                    >
                      {isCapturing ? <Pause className="h-4 w-4 text-blue-500" /> : <RefreshCw className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Diálogo para añadir anotación */}
                {isAddingAnnotation && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border rounded-lg shadow-lg p-4 w-80 z-30">
                    <h3 className="text-lg font-medium mb-2">Añadir anotación</h3>
                    <textarea
                      className="w-full p-2 border rounded-md mb-4 bg-background"
                      rows={3}
                      placeholder="Describe lo que observas..."
                      value={newAnnotationText}
                      onChange={(e) => setNewAnnotationText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddingAnnotation(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={addAnnotation}>Guardar</Button>
                    </div>
                  </div>
                )}

                {/* Información de estado */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">Actividad cerebral</div>
                    <div className="text-2xl font-bold">{brainwaveActivity}%</div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">Frecuencia dominante</div>
                    <div className="text-2xl font-bold">{patternAnalysis.dominantFrequency.toUpperCase()}</div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">Complejidad</div>
                    <div className="text-2xl font-bold">{patternAnalysis.complexityScore}%</div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">Estabilidad</div>
                    <div className="text-2xl font-bold">{patternAnalysis.patternStability}%</div>
                  </div>
                </div>
              </div>

              {/* Panel de controles */}
              {showControls && (
                <div className="lg:col-span-1">
                  <Card className="border-none shadow-md bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-emerald-500" />
                        Controles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Modo de visualización */}
                      <div className="space-y-2">
                        <Label>Modo de visualización</Label>
                        <Select value={visualizationMode} onValueChange={setVisualizationMode}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar modo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3d">Modelo 3D</SelectItem>
                            <SelectItem value="heatmap">Mapa de calor</SelectItem>
                            <SelectItem value="waves">Ondas cerebrales</SelectItem>
                            <SelectItem value="particles">Partículas</SelectItem>
                            <SelectItem value="network">Red neuronal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Zoom */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Zoom</Label>
                          <span className="text-sm">{zoomLevel}%</span>
                        </div>
                        <Slider
                          value={[zoomLevel]}
                          onValueChange={(value) => setZoomLevel(value[0])}
                          min={50}
                          max={200}
                          step={5}
                        />
                      </div>

                      {/* Velocidad de rotación */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Velocidad de rotación</Label>
                          <span className="text-sm">{rotationSpeed}%</span>
                        </div>
                        <Slider
                          value={[rotationSpeed]}
                          onValueChange={(value) => setRotationSpeed(value[0])}
                          min={0}
                          max={100}
                          step={5}
                        />
                      </div>

                      {/* Nivel de detalle */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Nivel de detalle</Label>
                          <span className="text-sm">{detailLevel}%</span>
                        </div>
                        <Slider
                          value={[detailLevel]}
                          onValueChange={(value) => setDetailLevel(value[0])}
                          min={25}
                          max={100}
                          step={5}
                        />
                      </div>

                      {/* Esquema de color */}
                      <div className="space-y-2">
                        <Label>Esquema de color</Label>
                        <Select value={colorScheme} onValueChange={setColorScheme}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar esquema" />
                          </SelectTrigger>
                          <SelectContent>
                            {colorSchemes.map((scheme) => (
                              <SelectItem key={scheme.id} value={scheme.id}>
                                <div className="flex flex-col">
                                  <span>{scheme.name}</span>
                                  <span className="text-xs text-muted-foreground">{scheme.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Regiones cerebrales */}
                      <div className="space-y-2">
                        <Label>Regiones cerebrales</Label>
                        <Select value={selectedRegions[0]} onValueChange={(value) => setSelectedRegions([value])}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar regiones" />
                          </SelectTrigger>
                          <SelectContent>
                            {brainRegions.map((region) => (
                              <SelectItem key={region.id} value={region.id}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Resaltar frecuencia */}
                      <div className="space-y-2">
                        <Label>Resaltar frecuencia</Label>
                        <Select value={highlightFrequency} onValueChange={setHighlightFrequency}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar frecuencia" />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencyBands.map((band) => (
                              <SelectItem key={band.id} value={band.id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: band.color }}></div>
                                  <span>{band.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Opciones de visualización */}
                      <div className="space-y-3">
                        <Label>Opciones de visualización</Label>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-labels" className="cursor-pointer">
                            Mostrar etiquetas
                          </Label>
                          <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-grid" className="cursor-pointer">
                            Mostrar cuadrícula
                          </Label>
                          <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-axes" className="cursor-pointer">
                            Mostrar ejes
                          </Label>
                          <Switch id="show-axes" checked={showAxes} onCheckedChange={setShowAxes} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-annotations" className="cursor-pointer">
                            Mostrar anotaciones
                          </Label>
                          <Switch
                            id="show-annotations"
                            checked={showAnnotations}
                            onCheckedChange={setShowAnnotations}
                          />
                        </div>
                      </div>

                      {/* Filtros */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Filtros</Label>
                          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-xs">Reducción de ruido</Label>
                            <span className="text-xs">{filterSettings.noiseReduction}%</span>
                          </div>
                          <Slider
                            value={[filterSettings.noiseReduction]}
                            onValueChange={(value) => updateFilter("noiseReduction", value)}
                            max={100}
                            step={5}
                            className="h-1.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-xs">Suavizado</Label>
                            <span className="text-xs">{filterSettings.smoothing}%</span>
                          </div>
                          <Slider
                            value={[filterSettings.smoothing]}
                            onValueChange={(value) => updateFilter("smoothing", value)}
                            max={100}
                            step={5}
                            className="h-1.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-xs">Umbral</Label>
                            <span className="text-xs">{filterSettings.threshold}%</span>
                          </div>
                          <Slider
                            value={[filterSettings.threshold]}
                            onValueChange={(value) => updateFilter("threshold", value)}
                            max={100}
                            step={5}
                            className="h-1.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-xs">Realce</Label>
                            <span className="text-xs">{filterSettings.enhancement}%</span>
                          </div>
                          <Slider
                            value={[filterSettings.enhancement]}
                            onValueChange={(value) => updateFilter("enhancement", value)}
                            max={100}
                            step={5}
                            className="h-1.5"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Controles adicionales para la pestaña de análisis */}
            {activeTab === "analysis" && (
              <div className="mt-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-medium">Análisis de patrones neuronales</h3>

                  <div className="flex flex-wrap gap-2">
                    <Select value={timeWindow} onValueChange={setTimeWindow}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Ventana de tiempo" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeWindows.map((window) => (
                          <SelectItem key={window.id} value={window.id}>
                            {window.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={analysisMode} onValueChange={setAnalysisMode}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Modo de análisis" />
                      </SelectTrigger>
                      <SelectContent>
                        {analysisModes.map((mode) => (
                          <SelectItem key={mode.id} value={mode.id}>
                            <div className="flex items-center gap-2">
                              {mode.icon}
                              <span>{mode.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Filter className="h-4 w-4" />
                      <span>Filtros</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <LineChart className="h-4 w-4 text-emerald-500" />
                        Tendencias temporales
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-muted-foreground">Gráfico de tendencias temporales</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-emerald-500" />
                        Distribución de frecuencias
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-muted-foreground">Gráfico de distribución</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-emerald-500" />
                        Métricas de análisis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Coherencia</div>
                          <div className="text-xl font-bold">78%</div>
                          <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "78%" }}></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Estabilidad</div>
                          <div className="text-xl font-bold">{patternAnalysis.patternStability}%</div>
                          <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${patternAnalysis.patternStability}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Complejidad</div>
                          <div className="text-xl font-bold">{patternAnalysis.complexityScore}%</div>
                          <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                            <div
                              className="h-full bg-violet-500 rounded-full"
                              style={{ width: `${patternAnalysis.complexityScore}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Intensidad</div>
                          <div className="text-xl font-bold">{brainwaveActivity}%</div>
                          <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${brainwaveActivity}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-500" />
                        Patrones detectados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <Waves className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                              <div className="font-medium">Patrón Alpha dominante</div>
                              <div className="text-xs text-muted-foreground">Estado de relajación</div>
                            </div>
                          </div>
                          <Badge>85%</Badge>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <Zap className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <div className="font-medium">Actividad frontal elevada</div>
                              <div className="text-xs text-muted-foreground">Procesamiento cognitivo</div>
                            </div>
                          </div>
                          <Badge>72%</Badge>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                              <Lightbulb className="h-4 w-4 text-violet-500" />
                            </div>
                            <div>
                              <div className="font-medium">Sincronización hemisférica</div>
                              <div className="text-xs text-muted-foreground">Integración de información</div>
                            </div>
                          </div>
                          <Badge>68%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Controles adicionales para la pestaña de comparación */}
            {activeTab === "comparison" && (
              <div className="mt-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-medium">Comparación de patrones</h3>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Wand2 className="h-4 w-4" />
                      <span>Seleccionar referencia</span>
                    </Button>

                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>Compartir comparación</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        Patrón actual
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-muted-foreground">Visualización del patrón actual</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        Patrón de referencia
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-muted-foreground">Selecciona un patrón de referencia para comparar</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-emerald-500" />
                      Análisis comparativo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                      Selecciona un patrón de referencia para ver el análisis comparativo
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Brain className="h-3.5 w-3.5" />
                <span>{patternAnalysis.dominantFrequency.toUpperCase()}</span>
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5" />
                <span>{brainwaveActivity}% actividad</span>
              </Badge>

              {recordedData.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Save className="h-3.5 w-3.5" />
                  <span>{recordedData.length} capturas</span>
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportFormat("png")}
                disabled={isExporting}
                className={exportFormat === "png" ? "bg-muted" : ""}
              >
                PNG
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportFormat("jpg")}
                disabled={isExporting}
                className={exportFormat === "jpg" ? "bg-muted" : ""}
              >
                JPG
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportFormat("json")}
                disabled={isExporting}
                className={exportFormat === "json" ? "bg-muted" : ""}
              >
                JSON
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportFormat("csv")}
                disabled={isExporting}
                className={exportFormat === "csv" ? "bg-muted" : ""}
              >
                CSV
              </Button>

              <Button
                onClick={handleExport}
                disabled={isExporting}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
