"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Sparkles, LogOut, User, RefreshCw, Download, X, Check, ImageIcon, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

type AppStep = "input" | "generating" | "result" | "gallery" | "exhausted"

const DAILY_LIMIT_FREE = 15
const DAILY_LIMIT_PREMIUM = 100
const STORAGE_KEY_PREFIX = "noosfera_user_daily"

interface DailyLimitData {
  date: string
  used: number
}

interface GeneratedArt {
  id: string
  imageUrl: string
  title: string
  description: string
  emotionalState: string
  energyLevel: number
  coherenceLevel: number
  pulses: number[]
  createdAt: Date
}

const artStyles = [
  { name: "Armonia Vital", color: "from-emerald-400 to-teal-500", emotion: "Tranquilidad y equilibrio" },
  { name: "Energia Pulsante", color: "from-rose-400 to-pink-500", emotion: "Vitalidad y pasion" },
  { name: "Flujo Cosmico", color: "from-violet-400 to-purple-500", emotion: "Creatividad y misterio" },
  { name: "Ritmo Dorado", color: "from-amber-400 to-orange-500", emotion: "Alegria y optimismo" },
  { name: "Serenidad Azul", color: "from-blue-400 to-indigo-500", emotion: "Calma y profundidad" },
]

export default function UserDashboardNew() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<AppStep>("input")
  const [pulses, setPulses] = useState<number[]>([])
  const [currentPulseInput, setCurrentPulseInput] = useState("")
  const [currentResult, setCurrentResult] = useState<GeneratedArt | null>(null)
  const [gallery, setGallery] = useState<GeneratedArt[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [totalGenerations, setTotalGenerations] = useState(0)
  const [dailyUsed, setDailyUsed] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const dailyLimit = user?.plan === "premium" ? DAILY_LIMIT_PREMIUM : DAILY_LIMIT_FREE
  const remainingToday = Math.max(0, dailyLimit - dailyUsed)

  useEffect(() => {
    // Load gallery from localStorage
    const savedGallery = localStorage.getItem(`noosfera_gallery_${user?.id}`)
    if (savedGallery) {
      setGallery(JSON.parse(savedGallery))
    }
    const savedCount = localStorage.getItem(`noosfera_count_${user?.id}`)
    if (savedCount) {
      setTotalGenerations(parseInt(savedCount))
    }
    
    // Load daily limit data
    const today = new Date().toDateString()
    const storageKey = `${STORAGE_KEY_PREFIX}_${user?.id}`
    const storedData = localStorage.getItem(storageKey)
    
    if (storedData) {
      try {
        const data: DailyLimitData = JSON.parse(storedData)
        if (data.date === today) {
          setDailyUsed(data.used)
          if (data.used >= dailyLimit) {
            setStep("exhausted")
          }
        } else {
          // New day, reset counter
          const newData: DailyLimitData = { date: today, used: 0 }
          localStorage.setItem(storageKey, JSON.stringify(newData))
          setDailyUsed(0)
        }
      } catch {
        const newData: DailyLimitData = { date: today, used: 0 }
        localStorage.setItem(storageKey, JSON.stringify(newData))
      }
    } else {
      const newData: DailyLimitData = { date: today, used: 0 }
      localStorage.setItem(storageKey, JSON.stringify(newData))
    }
  }, [user?.id, dailyLimit])

  const saveDailyUsage = (newUsed: number) => {
    const today = new Date().toDateString()
    const storageKey = `${STORAGE_KEY_PREFIX}_${user?.id}`
    const data: DailyLimitData = { date: today, used: newUsed }
    localStorage.setItem(storageKey, JSON.stringify(data))
    setDailyUsed(newUsed)
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
    if (!canGenerate || remainingToday <= 0) return

    setIsGenerating(true)
    setStep("generating")
    setGenerationProgress(0)

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

      const newArt: GeneratedArt = {
        id: Date.now().toString(),
        imageUrl,
        title: randomStyle.name,
        description: `Arte generado a partir de tus pulsos cardiacos (${pulses.join(", ")} BPM). Tu ritmo cardiaco unico ha sido transformado en esta pieza digital.`,
        emotionalState: randomStyle.emotion,
        energyLevel: Math.min(100, Math.round((avgPulse / 180) * 100)),
        coherenceLevel: Math.round(70 + Math.random() * 25),
        pulses: [...pulses],
        createdAt: new Date(),
      }

      setCurrentResult(newArt)
      
      // Save to gallery
      const newGallery = [newArt, ...gallery].slice(0, 20)
      setGallery(newGallery)
      localStorage.setItem(`noosfera_gallery_${user?.id}`, JSON.stringify(newGallery))
      
      const newCount = totalGenerations + 1
      setTotalGenerations(newCount)
      localStorage.setItem(`noosfera_count_${user?.id}`, newCount.toString())
      
      // Update daily usage
      const newDailyUsed = dailyUsed + 1
      saveDailyUsage(newDailyUsed)

      if (newDailyUsed >= dailyLimit) {
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
      const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 250)
      const colors = getGradientColors(style.color)
      gradient.addColorStop(0, colors.from)
      gradient.addColorStop(1, colors.to)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 400, 400)

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

        ctx.beginPath()
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, 0.5)`
        ctx.fill()
      })

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

  const resetForm = () => {
    setPulses([])
    setCurrentPulseInput("")
    setCurrentResult(null)
    setStep("input")
  }

  // Download image with watermark
  const downloadWithWatermark = (art: GeneratedArt) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.crossOrigin = "anonymous"
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      if (ctx) {
        // Draw the original image
        ctx.drawImage(img, 0, 0)
        
        // Add watermark
        ctx.save()
        ctx.font = "bold 16px Arial"
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        
        const watermarkText = "built with noosfera"
        const textMetrics = ctx.measureText(watermarkText)
        const x = canvas.width - textMetrics.width - 15
        const y = canvas.height - 15
        
        ctx.fillText(watermarkText, x, y)
        ctx.restore()
        
        // Download
        const link = document.createElement("a")
        link.download = `noosfera-${art.title.toLowerCase().replace(/\s+/g, "-")}-${art.id}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      }
    }
    
    img.src = art.imageUrl
  }

  const CircularProgress = ({ value, label, color }: { value: number; label: string; color: string }) => {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (value / 100) * circumference

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-200" />
            <circle
              cx="48" cy="48" r={radius}
              stroke="currentColor" strokeWidth="6" fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={color}
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-900">{value}%</span>
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
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-7 w-7 text-emerald-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Noosfera
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant={step === "gallery" ? "default" : "ghost"}
                size="sm"
                onClick={() => setStep(step === "gallery" ? "input" : "gallery")}
                className={step === "gallery" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                Mi Galeria ({gallery.length})
              </Button>

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
                    <div className="flex items-center gap-1 mt-1">
                      {user?.plan === "premium" ? (
                        <Crown className="h-3 w-3 text-amber-500" />
                      ) : null}
                      <span className={`text-xs font-medium ${user?.plan === "premium" ? "text-amber-600" : "text-emerald-600"}`}>
                        Plan {user?.plan === "premium" ? "Premium" : "Free"}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-gray-600 text-xs">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {remainingToday} imagenes restantes hoy
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-emerald-50/50 border-b border-emerald-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-gray-600">Total creados:</span>
              <span className="font-bold text-emerald-600">{totalGenerations}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-emerald-600" />
              <span className="text-gray-600">En galeria:</span>
              <span className="font-bold text-emerald-600">{gallery.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                {[...Array(dailyLimit > 15 ? 10 : dailyLimit)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < remainingToday ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-1">
                {remainingToday}/{dailyLimit} hoy
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* INPUT STEP */}
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Hola, <span className="text-emerald-500">{user?.name?.split(" ")[0]}</span>
                </h1>
                <p className="text-gray-600">Crea tu siguiente obra de arte cardiaco</p>
              </div>

              <Card className="bg-white/90 backdrop-blur shadow-xl border-emerald-100">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-3">
                    <Heart className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">Ingresa tus Pulsos</CardTitle>
                  <CardDescription>Escribe un valor y presiona Enter o coma</CardDescription>
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
                    Generar Arte
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Generando tu arte...</h3>
                  <p className="text-gray-500 mb-6">Interpretando tus patrones cardiacos</p>
                  <div className="space-y-2">
                    <Progress value={generationProgress} className="h-2" />
                    <p className="text-sm text-gray-400">{generationProgress}%</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* RESULT STEP */}
          {step === "result" && currentResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Tu Arte Digital</h2>
                <p className="text-gray-600 text-sm">Pulsos: {currentResult.pulses.join(", ")} BPM</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur shadow-xl border-emerald-100 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <img src={currentResult.imageUrl} alt={currentResult.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{currentResult.title}</h3>
                        <p className="text-sm text-emerald-600">{currentResult.emotionalState}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadWithWatermark(currentResult)}
                        className="h-9"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card className="bg-white/90 backdrop-blur border-emerald-100">
                    <CardContent className="p-4">
                      <p className="text-gray-600 text-sm leading-relaxed">{currentResult.description}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur border-emerald-100">
                    <CardContent className="p-4">
                      <div className="flex justify-around">
                        <CircularProgress value={currentResult.energyLevel} label="Energia" color="text-emerald-500" />
                        <CircularProgress value={currentResult.coherenceLevel} label="Coherencia" color="text-teal-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={resetForm}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Crear Otro
                    </Button>
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => setStep("gallery")}>
                      Ver Galeria
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* EXHAUSTED STEP */}
          {step === "exhausted" && (
            <motion.div
              key="exhausted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto text-center"
            >
              <Card className="bg-white/90 backdrop-blur shadow-xl border-amber-200">
                <CardContent className="py-12 px-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                    <ImageIcon className="h-8 w-8 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Limite diario alcanzado
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Has utilizado tus {dailyLimit} imagenes de hoy.
                    {user?.plan === "free" && " Actualiza a Premium para obtener mas imagenes diarias."}
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button onClick={() => setStep("gallery")} variant="outline" className="w-full">
                      Ver mi galeria
                    </Button>
                    {user?.plan === "free" && (
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        <Crown className="mr-2 h-4 w-4" />
                        Actualizar a Premium
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Tu limite se restablecera manana
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* GALLERY STEP */}
          {step === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Mi Galeria</h2>
                  <p className="text-gray-600 text-sm">{gallery.length} obras creadas</p>
                </div>
                <Button onClick={() => setStep("input")} className="bg-emerald-600 hover:bg-emerald-700">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Crear Nuevo
                </Button>
              </div>

              {gallery.length === 0 ? (
                <Card className="bg-white/90 backdrop-blur border-emerald-100">
                  <CardContent className="py-12 text-center">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tu galeria esta vacia</h3>
                    <p className="text-gray-500 mb-4">Crea tu primera obra de arte cardiaco</p>
                    <Button onClick={() => setStep("input")} className="bg-emerald-600 hover:bg-emerald-700">
                      Comenzar
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map((art) => (
                    <motion.div
                      key={art.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group"
                    >
                      <Card className="overflow-hidden bg-white/90 backdrop-blur border-emerald-100 hover:shadow-lg transition-shadow">
                        <div className="aspect-square relative">
                          <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-8 w-8 p-0"
                              onClick={() => downloadWithWatermark(art)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{art.title}</h4>
                          <p className="text-xs text-gray-500">{art.pulses.join(", ")} BPM</p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
