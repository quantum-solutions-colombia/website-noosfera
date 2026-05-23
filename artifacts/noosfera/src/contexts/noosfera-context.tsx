

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
  generateContent: (type?: ContentType, options?: { style?: string; imageUrl?: string }) => Promise<GeneratedContent | undefined>
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

  // Temas epicos para Pollinations.AI - sin costo, sin API key
  const NOOSFERA_THEMES = [
    "a majestic dragon soaring through storm clouds with lightning",
    "an epic medieval battle with knights and sorcerers on horseback",
    "a futuristic spaceship emerging from a glowing nebula in deep space",
    "an enchanted ancient forest with glowing magical creatures and fireflies",
    "a massive sailing ship on stormy seas at sunset with dramatic waves",
    "a pack of wolves running through a snow-covered pine forest at dusk",
    "a phoenix rising from golden flames in a mystical landscape",
    "an underwater ancient city with bioluminescent sea creatures",
    "a warrior mage casting brilliant spells in an ancient stone temple",
    "a pride of lions in an African savanna at golden hour",
    "a crystal cave with mythical creatures and glowing gems",
    "a fierce battle between fire dragons and ice griffins in the sky",
    "a mystical forest with fairies and ancient tree spirits at night",
    "a family of elephants in a lush green jungle landscape",
    "space explorers discovering an alien world with towering crystal formations",
    "a giant sea serpent emerging from stormy ocean depths near a lighthouse",
    "an armada of pirate ships in an epic naval battle at night",
    "a fierce tiger stalking through dense tropical jungle foliage",
    "a medieval castle on a cliff surrounded by a magical aurora",
    "a cyberpunk city at night with neon lights and flying vehicles",
    "a herd of wild horses galloping across an open plain at sunrise",
    "an ancient temple guarded by stone golems in a jungle",
    "a polar bear and her cubs on an ice floe under northern lights",
    "a vast fantasy battlefield with armies of elves and dark knights",
    "a deep space station orbiting a ringed gas giant planet",
  ]

  const STYLE_DESCRIPTORS: Record<string, string> = {
    abstract: "vibrant abstract digital art with bold colors and geometric shapes,",
    realistic: "ultra-photorealistic, cinematic photography style,",
    hyperrealistic: "hyper-detailed photorealistic with dramatic studio lighting,",
    surreal: "surrealist dream-like painting style with impossible landscapes,",
    minimalist: "minimalist clean artistic illustration,",
    organic: "organic flowing natural shapes, botanical art style,",
    geometric: "geometric low-poly polygon art style,",
    fractal: "fractal recursive mandelbrot art style, infinitely detailed,",
  }

  // Genera descripciones algoritmicas en espanol basadas en datos cardiacos
  const generateAlgorithmicDescription = (pattern: CardiacPattern): string => {
    const avg = pattern.patternData.reduce((a, b) => a + b, 0) / pattern.patternData.length
    const range = Math.max(...pattern.patternData) - Math.min(...pattern.patternData)

    const intensityPhrases = avg > 70 
      ? ["una elevada tension interna", "una energia vibrante y pulsante", "una fuerza vital intensa"]
      : avg > 50 
      ? ["una energia vital moderada", "un flujo energetico equilibrado", "una presencia contenida"]
      : ["una calma profunda y meditativa", "una serenidad contemplativa", "un reposo consciente"]

    const variabilityPhrases = range > 40
      ? ["que oscila entre extremos emocionales", "con contradicciones internas que enriquecen la profundidad de la obra", "revelando tensiones dinamicas"]
      : range > 20
      ? ["que fluye en patrones armoniosos y controlados", "con ritmos que sugieren equilibrio interior", "articulando transiciones suaves"]
      : ["que permanece estable y centrada", "con una coherencia notable", "manifestando una solidez emocional"]

    const contextPhrases = [
      "explorando el lenguaje visual como extension del estado interno",
      "donde el color y la forma dialogan con el pulso vital",
      "transformando datos biometricos en expresion artistica",
      "capturando la esencia efimera del momento presente",
      "traduciendo el ritmo cardiaco en narrativa visual",
    ]

    const intensity = intensityPhrases[Math.floor(Math.random() * intensityPhrases.length)]
    const variability = variabilityPhrases[Math.floor(Math.random() * variabilityPhrases.length)]
    const context = contextPhrases[Math.floor(Math.random() * contextPhrases.length)]

    return `${intensity} ${variability}, ${context}`
  }

  // Genera imagen usando Pollinations.AI (gratuito, sin API key)
  const generatePollinationsImage = async (pattern: CardiacPattern, style: string): Promise<string> => {
    const seed = Math.floor(((pattern.stressLevel || 50) + (pattern.heartHealthScore || 75)) * 0.37 + Date.now() % 100)
    const theme = NOOSFERA_THEMES[seed % NOOSFERA_THEMES.length]
    
    const artisticStyle = STYLE_DESCRIPTORS[style] || "vibrant digital art,"
    const moodMap: Record<string, string> = {
      calm: "peaceful and serene atmosphere, soft lighting",
      normal: "epic and dramatic atmosphere, dynamic lighting",
      stressed: "intense and energetic atmosphere, bold contrast",
      alert: "powerful and awe-inspiring atmosphere, high energy",
    }
    const mood = moodMap[pattern.emotionalState] || "epic and dramatic atmosphere, dynamic lighting"

    const prompt = `${artisticStyle} ${theme}, ${mood}, highly detailed, professional digital art, 8k resolution, masterpiece quality, vivid saturated colors`
    
    // Pollinations.AI - servicio publico gratuito
    const encodedPrompt = encodeURIComponent(prompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`
    
    return imageUrl
  }

  const generateContent = async (type: ContentType = "text", options?: { style?: string; imageUrl?: string }) => {
    if (!currentCardiacPattern && !isDemoMode) return

    const loadingMessage = isDemoMode
      ? `Simulando creación de ${type === "text" ? "análisis" : "gráfico"}...`
      : `Creando ${type === "text" ? "análisis" : "gráfico"} basado en datos cardíacos...`

    toast.loading(loadingMessage, { id: "generate-content" })

    const pattern = currentCardiacPattern || {
      id: `cardiac-${Date.now()}`,
      timestamp: Date.now(),
      stressLevel: 35,
      heartHealthScore: 75,
      emotionalState: "normal",
      variabilityTrend: 45,
      patternData: Array.from({ length: 128 }, () => Math.random() * 100),
    }

    let contentValue: string

    if (type === "image") {
      if (options?.imageUrl) {
        contentValue = options.imageUrl
      } else {
        try {
          // Usar Pollinations.AI directamente (gratuito, sin API key)
          contentValue = await generatePollinationsImage(pattern, options?.style || "abstract")
        } catch {
          contentValue = generateImageUrlFromPattern(pattern)
        }
      }
    } else {
      await new Promise((r) => setTimeout(r, isDemoMode ? 1500 : 2500))
      contentValue = generateTextFromPattern(pattern)
    }

    const newContent: GeneratedContent = {
      id: `content-${Date.now()}`,
      timestamp: Date.now(),
      type: type,
      patternId: pattern.id,
      cardiacPattern: pattern,
      content: contentValue,
      metadata: {
        heartRate: Math.floor(Math.random() * 40) + 60,
        stress: pattern.stressLevel,
        health: pattern.heartHealthScore,
        ...(isDemoMode && { demoMode: true }),
      },
    }

    setGeneratedContent((prev) => [newContent, ...prev])

    const successMessage = isDemoMode
      ? `${type === "text" ? "Análisis" : "Imagen"} generado correctamente (Demo)`
      : `${type === "text" ? "Análisis" : "Imagen"} creado correctamente`

    toast.success(successMessage, { id: "generate-content" })

    return newContent
  }

  const generateTextFromPattern = (pattern: CardiacPattern) => {
    // Usar descripciones algoritmicas basadas en datos cardiacos
    const algorithmicDescription = generateAlgorithmicDescription(pattern)
    return `La imagen generada representa ${algorithmicDescription}.`
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
