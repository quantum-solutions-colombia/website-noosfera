"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Sparkles, ArrowRight, UserPlus, ArrowLeft, RefreshCw, X, Check, ImageIcon, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type DemoStep = "welcome" | "input" | "generating" | "result" | "exhausted"

interface GeneratedResult {
  imageUrl: string
  title: string
  description: string
  emotionalState: string
  energyLevel: number
  coherenceLevel: number
  pulses: number[]
}

// Art styles for random generation
const artStyles = [
  { name: "Armonia Vital", color: "from-emerald-400 to-teal-500", emotion: "Tranquilidad y equilibrio" },
  { name: "Energia Pulsante", color: "from-rose-400 to-pink-500", emotion: "Vitalidad y pasion" },
  { name: "Flujo Cosmico", color: "from-violet-400 to-purple-500", emotion: "Creatividad y misterio" },
  { name: "Ritmo Dorado", color: "from-amber-400 to-orange-500", emotion: "Alegria y optimismo" },
  { name: "Serenidad Azul", color: "from-blue-400 to-indigo-500", emotion: "Calma y profundidad" },
]

const DAILY_LIMIT = 5
const STORAGE_KEY = "noosfera_demo_trial"

interface TrialData {
  date: string
  remaining: number
}

export default function SimpleDemo() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [step, setStep] = useState<DemoStep>("welcome")
  const [pulses, setPulses] = useState<number[]>([])
  const [currentPulseInput, setCurrentPulseInput] = useState("")
  const [attemptsRemaining, setAttemptsRemaining] = useState(DAILY_LIMIT)
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load trial data from localStorage
  useEffect(() => {
    const today = new Date().toDateString()
    const storedData = localStorage.getItem(STORAGE_KEY)
    
    if (storedData) {
      try {
        const data: TrialData = JSON.parse(storedData)
        if (data.date === today) {
          setAttemptsRemaining(data.remaining)
          if (data.remaining <= 0) {
            setStep("exhausted")
          }
        } else {
          // New day, reset counter
          const newData: TrialData = { date: today, remaining: DAILY_LIMIT }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
          setAttemptsRemaining(DAILY_LIMIT)
        }
      } catch {
        const newData: TrialData = { date: today, remaining: DAILY_LIMIT }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
      }
    } else {
      const newData: TrialData = { date: today, remaining: DAILY_LIMIT }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    }
    setIsLoaded(true)
  }, [])

  // Save trial data when attempts change
  const saveTrialData = (remaining: number) => {
    const today = new Date().toDateString()
    const data: TrialData = { date: today, remaining }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setAttemptsRemaining(remaining)
  }

  const handlePulseInputChange = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, "")
    if (numValue === "" || (parseInt(numValue) >= 0 && parseInt(numValue) <= 200)) {
      setCurrentPulseInput(numValue)
    }
  }

  const addPulse = useCallback(() => {
    const num = parseInt(currentPulseInput)
    if (num >= 40 && num <= 200 && pulses.length < 8) {
      setPulses([...pulses, num])
      setCurrentPulseInput("")
      inputRef.current?.focus()
    }
  }, [currentPulseInput, pulses])

  const removePulse = (index: number) => {
    setPulses(pulses.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault()
      addPulse()
    } else if (e.key === "Backspace" && currentPulseInput === "" && pulses.length > 0) {
      removePulse(pulses.length - 1)
    }
  }

  const canGenerate = pulses.length >= 1 && pulses.length <= 8

  const generateImage = async () => {
    if (!canGenerate || attemptsRemaining <= 0) return

    setIsGenerating(true)
    setStep("generating")
    setGenerationProgress(0)

    // Simulate generation process
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    try {
      const randomStyle = artStyles[Math.floor(Math.random() * artStyles.length)]
      
      // Try to use AI API for better image generation
      let imageUrl: string
      try {
        const aiResponse = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pulses,
            style: randomStyle.name,
            emotionalState: randomStyle.emotion,
          }),
        })

        if (aiResponse.ok) {
          const aiData = await aiResponse.json()
          imageUrl = aiData.imageUrl
        } else {
          // Fallback to canvas generation
          imageUrl = generateCanvasImage(pulses, randomStyle)
        }
      } catch {
        // Fallback to canvas generation
        imageUrl = generateCanvasImage(pulses, randomStyle)
      }

      const avgPulse = pulses.reduce((a, b) => a + b, 0) / 3

      const result: GeneratedResult = {
        imageUrl,
        title: randomStyle.name,
        description: `Esta imagen representa la esencia de tus ${pulses.length} pulsos cardiacos (${pulses.join(", ")} BPM). Los patrones unicos de tu ritmo cardiaco han sido transformados en arte digital mediante nuestro algoritmo de interpretacion emocional.`,
        emotionalState: randomStyle.emotion,
        energyLevel: Math.min(100, Math.round((avgPulse / 180) * 100)),
        coherenceLevel: Math.round(70 + Math.random() * 25),
        pulses: [...pulses],
      }

      setGeneratedResult(result)
      const newRemaining = attemptsRemaining - 1
      saveTrialData(newRemaining)
      
      if (newRemaining <= 0) {
        setStep("exhausted")
      } else {
        setStep("result")
      }
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  const generateCanvasImage = (pulseData: number[], style: typeof artStyles[0]): string => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Background gradient
      const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 250)
      
      // Parse colors from tailwind class
      const colors = getGradientColors(style.color)
      gradient.addColorStop(0, colors.from)
      gradient.addColorStop(1, colors.to)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 400, 400)

      // Draw circular patterns based on pulses
      pulseData.forEach((pulse, index) => {
        const angle = (index / pulseData.length) * Math.PI * 2
        const radius = 80 + (pulse % 40)
        const x = 200 + Math.cos(angle) * radius * 0.5
        const y = 200 + Math.sin(angle) * radius * 0.5
        const size = 20 + (pulse % 30)

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (index * 0.2)})`
        ctx.fill()

        // Inner circles
        ctx.beginPath()
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, 0.5)`
        ctx.fill()
      })

      // Central heart shape
      const heartSize = 40
      ctx.save()
      ctx.translate(200, 200)
      ctx.beginPath()
      ctx.moveTo(0, heartSize * 0.3)
      ctx.bezierCurveTo(-heartSize, -heartSize * 0.3, -heartSize, -heartSize, 0, -heartSize * 0.5)
      ctx.bezierCurveTo(heartSize, -heartSize, heartSize, -heartSize * 0.3, 0, heartSize * 0.3)
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fill()
      ctx.restore()

      // Add decorative particles
      for (let i = 0; i < 30; i++) {
        const px = Math.random() * 400
        const py = Math.random() * 400
        const ps = Math.random() * 3 + 1
        ctx.beginPath()
        ctx.arc(px, py, ps, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`
        ctx.fill()
      }
    }

    return canvas.toDataURL("image/png")
  }

  const getGradientColors = (gradientClass: string) => {
    const colorMap: Record<string, { from: string; to: string }> = {
      "from-emerald-400 to-teal-500": { from: "#34d399", to: "#14b8a6" },
      "from-rose-400 to-pink-500": { from: "#fb7185", to: "#ec4899" },
      "from-violet-400 to-purple-500": { from: "#a78bfa", to: "#a855f7" },
      "from-amber-400 to-orange-500": { from: "#fbbf24", to: "#f97316" },
      "from-blue-400 to-indigo-500": { from: "#60a5fa", to: "#6366f1" },
    }
    return colorMap[gradientClass] || { from: "#34d399", to: "#14b8a6" }
  }

  const resetDemo = () => {
    setPulses([])
    setCurrentPulseInput("")
    setGeneratedResult(null)
    setStep("input")
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }

  const CircularProgress = ({ value, label, color }: { value: number; label: string; color: string }) => {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (value / 100) * circumference

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={color}
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{value}%</span>
          </div>
        </div>
        <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-7 w-7 text-emerald-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Noosfera
              </span>
              <Badge variant="outline" className="ml-2 bg-emerald-500/10 text-emerald-600 border-emerald-200">
                DEMO
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => router.push("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-600 border-amber-200 text-xs">
                        Plan de prueba
                      </Badge>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-gray-600 text-xs">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {attemptsRemaining} imagenes restantes hoy
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("/auth/login")}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Iniciar Sesion
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Attempts remaining indicator */}
      <div className="bg-emerald-50/50 border-b border-emerald-100">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
              Plan de prueba
            </Badge>
            <div className="flex items-center gap-1.5">
              {[...Array(DAILY_LIMIT)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i < attemptsRemaining ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {attemptsRemaining > 0 
                ? `${attemptsRemaining} imagenes restantes por hoy`
                : "Sin imagenes disponibles hoy"}
            </span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* WELCOME STEP */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 mb-8"
              >
                <Heart className="h-12 w-12 text-white" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Bienvenido a <span className="text-emerald-500">Noosfera</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Descubre como transformamos tus pulsos cardiacos en arte digital unico.
                En este demo podras experimentar nuestra tecnologia de interpretacion emocional.
              </p>

              <Card className="bg-white/80 backdrop-blur border-emerald-100 mb-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Como funciona el demo:</h3>
                  <div className="grid gap-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ingresa hasta 8 pulsos cardiacos</p>
                        <p className="text-sm text-gray-500">Valores entre 40-200 BPM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Generamos tu arte digital</p>
                        <p className="text-sm text-gray-500">Nuestro algoritmo interpreta tus patrones</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Descubre tu resultado</p>
                        <p className="text-sm text-gray-500">Visualiza la interpretacion emocional</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                onClick={() => setStep("input")}
              >
                Comenzar Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-sm text-gray-500 mt-4">
                Tienes {attemptsRemaining} imagen{attemptsRemaining > 1 ? "es" : ""} de prueba hoy
              </p>
            </motion.div>
          )}

          {/* INPUT STEP */}
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <Card className="bg-white/90 backdrop-blur shadow-xl border-emerald-100">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-3">
                    <Heart className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">Ingresa tus Pulsos</CardTitle>
                  <CardDescription>
                    Escribe un valor y presiona Enter o coma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Inline Pulse Input */}
                  <div 
                    className="min-h-[56px] p-3 border-2 border-gray-200 rounded-xl bg-white focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all cursor-text"
                    onClick={() => inputRef.current?.focus()}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {pulses.map((pulse, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          <span>{pulse}</span>
                          <span className="text-emerald-500 text-xs">BPM</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removePulse(index)
                            }}
                            className="ml-0.5 hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ))}
                      
                      {pulses.length < 8 && (
                        <div className="flex items-center gap-1 flex-1 min-w-[80px]">
                          <input
                            ref={inputRef}
                            type="text"
                            inputMode="numeric"
                            placeholder={pulses.length === 0 ? "72, 65, 80..." : `Pulso ${pulses.length + 1}`}
                            value={currentPulseInput}
                            onChange={(e) => handlePulseInputChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={() => {
                              if (currentPulseInput) addPulse()
                            }}
                            className="flex-1 outline-none bg-transparent text-gray-700 placeholder:text-gray-400 text-sm min-w-0"
                          />
                          {currentPulseInput && parseInt(currentPulseInput) >= 40 && parseInt(currentPulseInput) <= 200 && (
                            <button
                              onClick={addPulse}
                              className="text-emerald-500 hover:text-emerald-600 transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          i < pulses.length ? "bg-emerald-500" : "bg-gray-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">
                      {pulses.length}/8 pulsos
                    </span>
                  </div>

                  {/* Validation message */}
                  {currentPulseInput && (parseInt(currentPulseInput) < 40 || parseInt(currentPulseInput) > 200) && (
                    <p className="text-sm text-amber-600 text-center">
                      El valor debe estar entre 40 y 200 BPM
                    </p>
                  )}

                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-11"
                    disabled={!canGenerate}
                    onClick={generateImage}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generar Mi Arte
                  </Button>

                  {pulses.length > 0 && pulses.length < 8 && (
                    <p className="text-xs text-gray-500 text-center">
                      Agrega {3 - pulses.length} pulso{3 - pulses.length > 1 ? "s" : ""} mas para continuar
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* GENERATING STEP */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto text-center"
            >
              <Card className="bg-white/90 backdrop-blur shadow-xl border-emerald-100">
                <CardContent className="py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 mb-6"
                  >
                    <Heart className="h-10 w-10 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Generando tu arte...
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Interpretando tus patrones cardiacos
                  </p>

                  <div className="space-y-2">
                    <Progress value={generationProgress} className="h-2" />
                    <p className="text-sm text-gray-400">{generationProgress}%</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* RESULT STEP */}
          {step === "result" && generatedResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Tu Arte Digital
                </h2>
                <p className="text-gray-600">
                  Basado en tus pulsos: {generatedResult.pulses.join(", ")} BPM
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Generated Image */}
                <Card className="bg-white/90 backdrop-blur shadow-xl border-emerald-100 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <img
                        src={generatedResult.imageUrl}
                        alt={generatedResult.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-900">{generatedResult.title}</h3>
                      <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-0">
                        {generatedResult.emotionalState}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis */}
                <div className="space-y-6">
                  <Card className="bg-white/90 backdrop-blur shadow-xl border-emerald-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Interpretacion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {generatedResult.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Circular Charts */}
                  <Card className="bg-white/90 backdrop-blur shadow-xl border-emerald-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Metricas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-around">
                        <CircularProgress 
                          value={generatedResult.energyLevel} 
                          label="Energia" 
                          color="text-emerald-500"
                        />
                        <CircularProgress 
                          value={generatedResult.coherenceLevel} 
                          label="Coherencia" 
                          color="text-teal-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {attemptsRemaining > 0 && (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={resetDemo}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Crear Otro
                      </Button>
                    )}
                    <Button 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => router.push("/auth/login")}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Crear Cuenta
                    </Button>
                  </div>

                  <p className="text-sm text-center text-gray-500">
                    {attemptsRemaining > 0 
                      ? `Te quedan ${attemptsRemaining} imagen${attemptsRemaining > 1 ? "es" : ""} de prueba hoy`
                      : "Crea una cuenta para generar arte ilimitado"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* EXHAUSTED STEP */}
          {step === "exhausted" && (
            <motion.div
              key="exhausted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto text-center"
            >
              <Card className="bg-white/90 backdrop-blur shadow-xl border-emerald-100">
                <CardContent className="py-10">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Limite de prueba alcanzado
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Has agotado tus {DAILY_LIMIT} imagenes de prueba por hoy. 
                    Las imagenes de prueba se recargan diariamente.
                  </p>

                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 h-11"
                      onClick={() => router.push("/auth/register")}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Crear una Cuenta Gratis
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full h-11"
                      onClick={() => router.push("/auth/login")}
                    >
                      Ya tengo cuenta
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-6">
                    Con una cuenta gratuita tendras acceso a mas funciones y podras guardar tu galeria
                  </p>
                </CardContent>
              </Card>

              {/* Show last generated result if exists */}
              {generatedResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <p className="text-sm text-gray-500 mb-3">Tu ultima creacion:</p>
                  <Card className="bg-white/90 backdrop-blur shadow-xl border-emerald-100 overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={generatedResult.imageUrl}
                        alt={generatedResult.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 text-left">
                      <h4 className="font-medium text-gray-900">{generatedResult.title}</h4>
                      <p className="text-xs text-gray-500">{generatedResult.pulses.join(", ")} BPM</p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
