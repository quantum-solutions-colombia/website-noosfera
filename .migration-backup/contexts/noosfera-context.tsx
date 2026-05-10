"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "react-hot-toast"

// Tipos para el contenido generado
export type ContentType = "text" | "image"

export interface GeneratedContent {
  id: string
  type: ContentType
  content: string
  timestamp: number
  cardiacPattern: any
  metadata: any
  patternId: string
}

export interface NoosferaConfig {
  cardiacSensitivity: number
  samplingRate: number
  autoCalibration: boolean
  dataCollection: boolean
  advancedMode: boolean
  hrvAnalysis: boolean
  stressDetection: boolean
}

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "calibrating" | "error"

export interface CardiacData {
  heartRate: number
  hrVariability: number
  systolic: number
  diastolic: number
  oxygenSaturation: number
  stressLevel: number
  timestamp: number
}

export interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  latency: number
  accuracy: number
  timestamp: number
}

export interface CardiacPattern {
  id: string
  timestamp: number
  stressLevel: number
  heartHealthScore: number
  emotionalState: string
  variabilityTrend: number
  patternData: number[]
}

interface NoosferaContextType {
  connectionStatus: ConnectionStatus
  signalStrength: number
  connect: () => void
  disconnect: () => void

  processingCardiac: boolean
  captureCardiacData: (customData?: any) => Promise<void>

  generatedContent: GeneratedContent[]
  generateContent: (type?: ContentType) => Promise<void>
  deleteContent: (id: string) => void

  config: NoosferaConfig
  updateConfig: (newConfig: Partial<NoosferaConfig>) => void
  resetConfig: () => void

  currentCardiacPattern: CardiacPattern | null
  cardiacActivity: number
  systemLoad: number

  cardiacHistory: CardiacData[]
  systemMetrics: SystemMetrics[]
  cardiacAnalysis: {
    dominantFrequency: string
    patternStability: number
    heartHealthScore: number
    matchConfidence: number
  }
  clearHistory: () => void

  isDemoMode: boolean
  setDemoMode: (isDemo: boolean) => void
}

const defaultConfig: NoosferaConfig = {
  cardiacSensitivity: 50,
  samplingRate: 75,
  autoCalibration: true,
  dataCollection: true,
  advancedMode: false,
  hrvAnalysis: true,
  stressDetection: true,
}

const NoosferaContext = createContext<NoosferaContextType | undefined>(undefined)

export function NoosferaProvider({ children }: { children: ReactNode }) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")
  const [signalStrength, setSignalStrength] = useState(0)
  const [signalInterval, setSignalInterval] = useState<NodeJS.Timeout | null>(null)

  const [processingCardiac, setProcessingCardiac] = useState(false)
  const [currentCardiacPattern, setCurrentCardiacPattern] = useState<CardiacPattern | null>(null)
  const [cardiacActivity, setCardiacActivity] = useState(0)
  const [systemLoad, setSystemLoad] = useState(0)

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [isDemoMode, setIsDemoMode] = useState(false)

  const [config, setConfig] = useState<NoosferaConfig>(() => {
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("noosfera-config")
      if (savedConfig) {
        try {
          return JSON.parse(savedConfig)
        } catch (e) {
          console.error("Error parsing saved config:", e)
        }
      }
    }
    return defaultConfig
  })

  const [cardiacHistory, setCardiacHistory] = useState<CardiacData[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>([])
  const [cardiacAnalysis, setCardiacAnalysis] = useState({
    dominantFrequency: "normal",
    patternStability: 68,
    heartHealthScore: 72,
    matchConfidence: 84,
  })

  const setDemoModeHandler = (isDemo: boolean) => {
    setIsDemoMode(isDemo)
    if (isDemo) {
      setTimeout(() => {
        connect()
        setTimeout(() => {
          generateDemoData()
        }, 3000)
      }, 1000)
    }
  }

  const generateDemoData = () => {
    const demoPattern: CardiacPattern = {
      id: `cardiac-${Date.now()}`,
      timestamp: Date.now(),
      stressLevel: 35,
      heartHealthScore: 78,
      emotionalState: "calm",
      variabilityTrend: 45,
      patternData: Array.from({ length: 128 }, () => Math.random() * 100),
    }

    setCurrentCardiacPattern(demoPattern)

    const demoContent: GeneratedContent[] = [
      {
        id: `demo-content-1-${Date.now()}`,
        type: "text",
        content:
          "Tu ritmo cardíaco revela un estado de calma mental y bienestar físico. La variabilidad cardíaca indica un sistema nervioso autónomo bien equilibrado.",
        timestamp: Date.now() - 300000,
        cardiacPattern: demoPattern,
        metadata: {
          heartRate: 72,
          hrv: 45,
          stress: "bajo",
          recommendation: "Mantén este estado de equilibrio",
        },
        patternId: demoPattern.id,
      },
      {
        id: `demo-content-2-${Date.now()}`,
        type: "image",
        content: `/placeholder.svg?height=400&width=400&query=cardiac+rhythm+visualization`,
        timestamp: Date.now() - 600000,
        cardiacPattern: demoPattern,
        metadata: {
          heartRate: 72,
          hrv: 45,
          emotionalTone: "positivo",
          visualType: "rhythm",
        },
        patternId: demoPattern.id,
      },
    ]

    setGeneratedContent(demoContent)
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("noosfera-config", JSON.stringify(config))
    }
  }, [config])

  useEffect(() => {
    if (typeof window !== "undefined" && generatedContent.length > 0 && !isDemoMode) {
      localStorage.setItem("noosfera-content", JSON.stringify(generatedContent))
    }
  }, [generatedContent, isDemoMode])

  useEffect(() => {
    if (typeof window !== "undefined" && !isDemoMode) {
      const savedContent = localStorage.getItem("noosfera-content")
      if (savedContent) {
        try {
          setGeneratedContent(JSON.parse(savedContent))
        } catch (e) {
          console.error("Error parsing saved content:", e)
        }
      }
    }
  }, [isDemoMode])

  useEffect(() => {
    return () => {
      if (signalInterval) clearInterval(signalInterval)
    }
  }, [signalInterval])

  const connect = () => {
    if (connectionStatus !== "disconnected") return

    setConnectionStatus("connecting")

    const connectDelay = isDemoMode ? 1000 : 2000
    const calibrateDelay = isDemoMode ? 1000 : 2000

    setTimeout(() => {
      setConnectionStatus("calibrating")

      setTimeout(() => {
        setConnectionStatus("connected")

        const interval = setInterval(() => {
          const baseStrength = Math.floor(Math.random() * 30) + 70
          const sensitivity = config.cardiacSensitivity / 100
          const adjustedStrength = Math.min(100, baseStrength * sensitivity * 1.5)

          setSignalStrength(adjustedStrength)

          setCardiacActivity(Math.floor(Math.random() * 40) + 60)

          setSystemLoad(Math.floor(Math.random() * 20) + 10)

          const newCardiacData: CardiacData = {
            heartRate: Math.floor(Math.random() * 40) + 60,
            hrVariability: Math.floor(Math.random() * 60) + 30,
            systolic: Math.floor(Math.random() * 30) + 110,
            diastolic: Math.floor(Math.random() * 20) + 70,
            oxygenSaturation: Math.floor(Math.random() * 5) + 95,
            stressLevel: Math.floor(Math.random() * 40) + 20,
            timestamp: Date.now(),
          }

          setCardiacHistory((prev) => {
            const updated = [...prev, newCardiacData]
            return updated.slice(-20)
          })

          const newMetrics: SystemMetrics = {
            cpuUsage: Math.floor(Math.random() * 30) + 20,
            memoryUsage: Math.floor(Math.random() * 40) + 30,
            latency: Math.floor(Math.random() * 50) + 10,
            accuracy: Math.floor(Math.random() * 20) + 75,
            timestamp: Date.now(),
          }

          setSystemMetrics((prev) => {
            const updated = [...prev, newMetrics]
            return updated.slice(-20)
          })

          if (currentCardiacPattern) {
            setCardiacAnalysis({
              dominantFrequency: ["normal", "elevated", "low", "variable"][Math.floor(Math.random() * 4)],
              patternStability: Math.floor(Math.random() * 30) + 60,
              heartHealthScore: Math.floor(Math.random() * 30) + 70,
              matchConfidence: Math.floor(Math.random() * 25) + 70,
            })
          }
        }, 2000)

        setSignalInterval(interval)
      }, calibrateDelay)
    }, connectDelay)
  }

  const disconnect = () => {
    if (connectionStatus === "disconnected") return

    if (signalInterval) {
      clearInterval(signalInterval)
      setSignalInterval(null)
    }

    setConnectionStatus("disconnected")
    setSignalStrength(0)
    setCardiacActivity(0)
    setSystemLoad(0)
    setCurrentCardiacPattern(null)
  }

  const captureCardiacData = async (customData?: any) => {
    if ((connectionStatus !== "connected" && !customData && !isDemoMode) || processingCardiac) return

    setProcessingCardiac(true)

    const loadingMessage = isDemoMode ? "Simulando captura de datos cardíacos..." : "Procesando datos cardíacos..."

    toast.loading(loadingMessage, { id: "capture-cardiac" })

    const processingDelay = isDemoMode ? 1500 : 2000

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const heartRate = customData?.heartRate || Math.floor(Math.random() * 40) + 60
        const hrv = customData?.hrv || Math.floor(Math.random() * 60) + 30
        const stress = customData?.stress || Math.floor(Math.random() * 40) + 20

        const newPattern: CardiacPattern = {
          id: `cardiac-${Date.now()}`,
          timestamp: Date.now(),
          stressLevel: stress,
          heartHealthScore: customData?.healthScore || Math.floor(Math.random() * 30) + 70,
          emotionalState: determineEmotionalState(heartRate),
          variabilityTrend: hrv,
          patternData: customData?.patternData || Array.from({ length: 128 }, () => Math.random() * 100),
        }

        setCurrentCardiacPattern(newPattern)
        setProcessingCardiac(false)

        const successMessage = isDemoMode
          ? "Datos cardíacos capturados correctamente (Demo)"
          : "Datos cardíacos registrados correctamente"

        toast.success(successMessage, { id: "capture-cardiac" })

        updateSystemMetrics()

        resolve()
      }, processingDelay)
    })
  }

  const determineEmotionalState = (heartRate: number): string => {
    if (heartRate < 60) return "calm"
    if (heartRate < 80) return "normal"
    if (heartRate < 100) return "stressed"
    return "alert"
  }

  const updateSystemMetrics = () => {
    setSystemMetrics((prevMetrics) => {
      const newMetrics = {
        cpuUsage: Math.floor(Math.random() * 30) + 20,
        memoryUsage: Math.floor(Math.random() * 40) + 30,
        latency: Math.floor(Math.random() * 50) + 10,
        accuracy: Math.floor(Math.random() * 20) + 75,
        timestamp: Date.now(),
      }
      return [newMetrics, ...prevMetrics.slice(0, 19)]
    })
  }

  const generateContent = async (type: ContentType = "text") => {
    if (!currentCardiacPattern && !isDemoMode) return

    const loadingMessage = isDemoMode
      ? `Simulando creación de ${type === "text" ? "análisis" : "gráfico"}...`
      : `Creando ${type === "text" ? "análisis" : "gráfico"} basado en datos cardíacos...`

    toast.loading(loadingMessage, { id: "generate-content" })

    const generationDelay = isDemoMode ? 2000 : 3000

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const pattern = currentCardiacPattern || {
          id: `cardiac-${Date.now()}`,
          timestamp: Date.now(),
          stressLevel: 35,
          heartHealthScore: 75,
          emotionalState: "normal",
          variabilityTrend: 45,
          patternData: Array.from({ length: 128 }, () => Math.random() * 100),
        }

        const newContent: GeneratedContent = {
          id: `content-${Date.now()}`,
          timestamp: Date.now(),
          type: type,
          patternId: pattern.id,
          cardiacPattern: pattern,
          content: type === "text" ? generateTextFromPattern(pattern) : generateImageUrlFromPattern(pattern),
          metadata: {
            heartRate: Math.floor(Math.random() * 40) + 60,
            stress: pattern.stressLevel,
            health: pattern.heartHealthScore,
            ...(isDemoMode && { demoMode: true }),
          },
        }

        setGeneratedContent((prev) => [newContent, ...prev])

        const successMessage = isDemoMode
          ? `${type === "text" ? "Análisis" : "Gráfico"} generado correctamente (Demo)`
          : `${type === "text" ? "Análisis" : "Gráfico"} creado correctamente`

        toast.success(successMessage, { id: "generate-content" })

        resolve()
      }, generationDelay)
    })
  }

  const generateTextFromPattern = (pattern: CardiacPattern) => {
    const texts = [
      "Tu ritmo cardíaco refleja un estado de equilibrio y estabilidad emocional. La variabilidad cardíaca indica un sistema nervioso bien regulado.",
      "Los patrones cardíacos capturados muestran una actividad cardiovascular óptima con excelente capacidad de recuperación.",
      "Tu corazón mantiene un ritmo consistente que sugiere una buena adaptación al estrés y un estado de salud cardiovascular favorable.",
      "La actividad cardíaca monitoreada indica un estado de calma mental con excelente variabilidad de frecuencia cardíaca.",
      "Los datos cardíacos revelan patrones de ritmo saludable con signos de coherencia cardíaca y bienestar emocional.",
    ]

    const index = Math.floor(pattern.heartHealthScore / 20)
    return texts[Math.min(index, texts.length - 1)]
  }

  const generateImageUrlFromPattern = (pattern: CardiacPattern) => {
    const width = 800
    const height = 600
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    if (ctx && pattern.patternData) {
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      const hue1 = Math.floor(((pattern.patternData[0] || 50) / 100) * 360)
      const hue2 = Math.floor(((pattern.patternData[1] || 120) / 100) * 360)
      gradient.addColorStop(0, `hsl(${hue1}, 70%, 20%)`)
      gradient.addColorStop(1, `hsl(${hue2}, 70%, 30%)`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = `hsl(0, 100%, ${50 + Math.random() * 30}%)`
      ctx.lineWidth = 3
      ctx.beginPath()

      const pointsPerSecond = 60
      const secondsDisplayed = 8
      const totalPoints = pointsPerSecond * secondsDisplayed

      for (let i = 0; i < totalPoints; i++) {
        const x = (i / totalPoints) * width
        const baseY = height / 2
        const amplitude = (pattern.heartHealthScore / 100) * 100
        const frequency = (pattern.variabilityTrend / 50) * 2

        const y =
          baseY -
          Math.sin((i / pointsPerSecond) * frequency * Math.PI) * amplitude -
          Math.sin((i / (pointsPerSecond * 2)) * Math.PI) * 30

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      return canvas.toDataURL("image/png")
    }

    return `/placeholder.svg?height=${height}&width=${width}&query=cardiac+rhythm`
  }

  const deleteContent = (id: string) => {
    setGeneratedContent((prev) => prev.filter((item) => item.id !== id))
  }

  const updateConfig = (newConfig: Partial<NoosferaConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
  }

  const clearHistory = () => {
    setCardiacHistory([])
    setSystemMetrics([])
  }

  useEffect(() => {
    if (connectionStatus === "connected") {
      const interval = setInterval(() => {
        const baseStrength = Math.floor(Math.random() * 30) + 70
        const sensitivity = config.cardiacSensitivity / 100
        const adjustedStrength = Math.min(100, baseStrength * sensitivity * 1.5)

        setSignalStrength(adjustedStrength)
        setCardiacActivity(Math.floor(Math.random() * 40) + 60)
        setSystemLoad(Math.floor(Math.random() * 20) + 10)

        const newCardiacData: CardiacData = {
          heartRate: Math.floor(Math.random() * 40) + 60,
          hrVariability: Math.floor(Math.random() * 60) + 30,
          systolic: Math.floor(Math.random() * 30) + 110,
          diastolic: Math.floor(Math.random() * 20) + 70,
          oxygenSaturation: Math.floor(Math.random() * 5) + 95,
          stressLevel: Math.floor(Math.random() * 40) + 20,
          timestamp: Date.now(),
        }

        setCardiacHistory((prev) => {
          const updated = [...prev, newCardiacData]
          return updated.slice(-20)
        })

        const newMetrics: SystemMetrics = {
          cpuUsage: Math.floor(Math.random() * 30) + 20,
          memoryUsage: Math.floor(Math.random() * 40) + 30,
          latency: Math.floor(Math.random() * 50) + 10,
          accuracy: Math.floor(Math.random() * 20) + 75,
          timestamp: Date.now(),
        }

        setSystemMetrics((prev) => {
          const updated = [...prev, newMetrics]
          return updated.slice(-20)
        })

        if (currentCardiacPattern) {
          setCardiacAnalysis({
            dominantFrequency: ["normal", "elevated", "low", "variable"][Math.floor(Math.random() * 4)],
            patternStability: Math.floor(Math.random() * 30) + 60,
            heartHealthScore: Math.floor(Math.random() * 30) + 70,
            matchConfidence: Math.floor(Math.random() * 25) + 70,
          })
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [connectionStatus, config.cardiacSensitivity, currentCardiacPattern])

  const value: NoosferaContextType = {
    connectionStatus,
    signalStrength,
    connect,
    disconnect,

    processingCardiac,
    captureCardiacData,

    generatedContent,
    generateContent,
    deleteContent,

    config,
    updateConfig,
    resetConfig,

    currentCardiacPattern,
    cardiacActivity,
    systemLoad,

    cardiacHistory,
    systemMetrics,
    cardiacAnalysis,
    clearHistory,

    isDemoMode,
    setDemoMode: setDemoModeHandler,
  }

  return <NoosferaContext.Provider value={value}>{children}</NoosferaContext.Provider>
}

export function useNoosfera() {
  const context = useContext(NoosferaContext)
  if (context === undefined) {
    throw new Error("useNoosfera debe ser usado dentro de un NoosferaProvider")
  }
  return context
}
