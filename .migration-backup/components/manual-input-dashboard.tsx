"use client"
import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNoosfera } from "@/contexts/noosfera-context"
import { toast } from "react-hot-toast"
import { Keyboard, Zap, Maximize2, Minimize2, Eye, EyeOff, History, Activity } from "lucide-react"

export default function ManualInputDashboard() {
  const { connectionStatus, captureThought } = useNoosfera()

  const [activeTab, setActiveTab] = useState("waveforms")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedData, setRecordedData] = useState<any[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [customPresets, setCustomPresets] = useState<any[]>([])
  const [isEditingPreset, setIsEditingPreset] = useState(false)
  const [newPresetName, setNewPresetName] = useState("")
  const [history, setHistory] = useState<
    {
      id: string
      type: string
      values: any
      timestamp: number
      name?: string
    }[]
  >([])

  // Valores de ondas cerebrales
  const [waveValues, setWaveValues] = useState({
    alpha: 50,
    beta: 50,
    theta: 50,
    delta: 50,
    gamma: 50,
  })

  // Valores de regiones cerebrales
  const [regionValues, setRegionValues] = useState({
    frontal: 50,
    parietal: 50,
    temporal: 50,
    occipital: 50,
    cerebellum: 50,
    brainstem: 50,
  })

  // Valores de métricas cognitivas
  const [cognitiveValues, setCognitiveValues] = useState({
    attention: 50,
    memory: 50,
    creativity: 50,
    reasoning: 50,
    processing: 50,
    emotional: 50,
  })

  // Valores de patrones
  const [patternValues, setPatternValues] = useState({
    complexity: 50,
    stability: 50,
    coherence: 50,
    variability: 50,
    intensity: 50,
    synchronization: 50,
  })

  // Valores de secuencia personalizada
  const [customSequence, setCustomSequence] = useState("")
  const [sequenceType, setSequenceType] = useState("numeric")
  const [sequenceFormat, setSequenceFormat] = useState("csv")

  // Valores de audio
  const [audioSettings, setAudioSettings] = useState({
    volume: 50,
    pitch: 50,
    tempo: 50,
    reverb: 30,
    filter: 40,
  })
  const [isPlaying, setIsPlaying] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Procesar datos manuales
  const processManualData = async () => {
    if (connectionStatus === "connected") {
      toast.error("Desconecta el BCI para usar el modo manual")
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)

    // Simular progreso
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + Math.random() * 10
      })
    }, 200)

    try {
      // Preparar datos para enviar
      const dataToProcess = {
        ...waveValues,
        ...regionValues,
        ...cognitiveValues,
        ...patternValues,
      }

      // Registrar en el historial
      const historyEntry = {
        id: `history-${Date.now()}`,
        type: activeTab,
        values: {
          waveValues: { ...waveValues },
          regionValues: { ...regionValues },
          cognitiveValues: { ...cognitiveValues },
          patternValues: { ...patternValues },
        },
        timestamp: Date.now(),
      }

      setHistory((prev) => [historyEntry, ...prev])

      // Simular procesamiento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Enviar datos al contexto
      await captureThought(dataToProcess)

      // Completar progreso
      setProcessingProgress(100)
      toast.success("Datos procesados correctamente")
    } catch (error) {
      toast.error("Error al procesar los datos")
    } finally {
      clearInterval(progressInterval)
      setTimeout(() => {
        setIsProcessing(false)
        setProcessingProgress(0)
      }, 500)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8" ref={containerRef}>
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-6 w-6 text-emerald-500" />
                  Entrada Manual Avanzada
                </CardTitle>
                <CardDescription>
                  Ingresa valores manualmente para simular patrones neuronales sin necesidad de un dispositivo BCI
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="flex items-center gap-1"
                >
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
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-1"
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">Historial</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Barra de progreso de procesamiento */}
            {isProcessing && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Procesando datos...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(processingProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Controles principales */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Button
                onClick={processManualData}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
              >
                <Zap className="h-4 w-4" />
                {isProcessing ? "Procesando..." : "Procesar Datos"}
              </Button>
            </div>

            {/* Mensaje de estado */}
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <Activity className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">Panel de entrada manual simplificado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
