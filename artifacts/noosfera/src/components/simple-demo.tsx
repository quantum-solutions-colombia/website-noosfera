import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart, Sparkles, ArrowLeft, UserPlus, RefreshCw, X, Check,
  ImageIcon, LogOut, Home, Palette, Users, Grid3x3,
  ChevronLeft, ChevronRight, Download, Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocation } from "wouter"
import { useAuth } from "@/contexts/auth-context"

type DemoStep = "home" | "input" | "generating" | "result" | "exhausted"

interface GeneratedResult {
  imageUrl: string
  title: string
  description: string
  emotionalState: string
  energyLevel: number
  coherenceLevel: number
  pulses: number[]
}

const artStyles = [
  { name: "Armonía Vital", color: "from-emerald-400 to-teal-500", emotion: "Tranquilidad y equilibrio" },
  { name: "Energía Pulsante", color: "from-rose-400 to-pink-500", emotion: "Vitalidad y pasión" },
  { name: "Flujo Cósmico", color: "from-violet-400 to-purple-500", emotion: "Creatividad y misterio" },
  { name: "Ritmo Dorado", color: "from-amber-400 to-orange-500", emotion: "Alegría y optimismo" },
  { name: "Serenidad Azul", color: "from-blue-400 to-indigo-500", emotion: "Calma y profundidad" },
]

const GALLERY_IMAGES = [
  "/images/pipeline-ai-battle.png",
  "/images/pipeline-forest.png",
  "/images/pipeline-castle.png",
  "/images/pipeline-ship.png",
  "/images/pipeline-pyramids.png",
  "/images/pipeline-ocean.png",
]

const GALLERY_LABELS = [
  "Batalla de robots · Energía 94%",
  "Bosque místico · Coherencia 88%",
  "Castillo abandonado · Profundidad 91%",
  "Barco hundido · Misterio 87%",
  "Pirámides de México · Historia 96%",
  "Océano bioluminiscente · Calma 89%",
]

const DAILY_LIMIT = 5
const STORAGE_KEY = "noosfera_demo_trial"

interface TrialData { date: string; remaining: number }

type NavItem = "inicio" | "creaciones" | "estilos" | "comunidad"

export default function SimpleDemo() {
  const [, navigate] = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const [step, setStep] = useState<DemoStep>("home")
  const [pulses, setPulses] = useState<number[]>([])
  const [currentPulseInput, setCurrentPulseInput] = useState("")
  const [attemptsRemaining, setAttemptsRemaining] = useState(DAILY_LIMIT)
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeNav, setActiveNav] = useState<NavItem>("inicio")
  const [myCreations, setMyCreations] = useState<GeneratedResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data: TrialData = JSON.parse(stored)
        if (data.date === today) {
          setAttemptsRemaining(data.remaining)
          if (data.remaining <= 0) setStep("exhausted")
        } else {
          const n: TrialData = { date: today, remaining: DAILY_LIMIT }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(n))
          setAttemptsRemaining(DAILY_LIMIT)
        }
      } catch {
        const n: TrialData = { date: today, remaining: DAILY_LIMIT }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(n))
      }
    } else {
      const n: TrialData = { date: today, remaining: DAILY_LIMIT }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(n))
    }
    setIsLoaded(true)
  }, [])

  const saveTrialData = (remaining: number) => {
    const today = new Date().toDateString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, remaining }))
    setAttemptsRemaining(remaining)
  }

  const handlePulseInputChange = (value: string) => {
    const n = value.replace(/[^0-9]/g, "")
    if (n === "" || (parseInt(n) >= 0 && parseInt(n) <= 200)) setCurrentPulseInput(n)
  }

  const addPulse = useCallback(() => {
    const num = parseInt(currentPulseInput)
    if (num >= 40 && num <= 200 && pulses.length < 8) {
      setPulses(prev => [...prev, num])
      setCurrentPulseInput("")
      inputRef.current?.focus()
    }
  }, [currentPulseInput, pulses])

  const removePulse = (index: number) => setPulses(pulses.filter((_, i) => i !== index))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault()
      addPulse()
    } else if (e.key === "Backspace" && currentPulseInput === "" && pulses.length > 0) {
      removePulse(pulses.length - 1)
    }
  }

  const canGenerate = pulses.length >= 1 && pulses.length <= 8

  const generateCanvasImage = (pulseData: number[], style: typeof artStyles[0]): string => {
    const canvas = document.createElement("canvas")
    canvas.width = 400; canvas.height = 400
    const ctx = canvas.getContext("2d")
    if (ctx) {
      const colorMap: Record<string, { from: string; to: string }> = {
        "from-emerald-400 to-teal-500": { from: "#34d399", to: "#14b8a6" },
        "from-rose-400 to-pink-500": { from: "#fb7185", to: "#ec4899" },
        "from-violet-400 to-purple-500": { from: "#a78bfa", to: "#a855f7" },
        "from-amber-400 to-orange-500": { from: "#fbbf24", to: "#f97316" },
        "from-blue-400 to-indigo-500": { from: "#60a5fa", to: "#6366f1" },
      }
      const colors = colorMap[style.color] || { from: "#a78bfa", to: "#7c3aed" }
      const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 250)
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
        ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.3 + index * 0.2})`; ctx.fill()
        ctx.beginPath(); ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fill()
      })
      for (let i = 0; i < 30; i++) {
        ctx.beginPath()
        ctx.arc(Math.random() * 400, Math.random() * 400, Math.random() * 3 + 1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`; ctx.fill()
      }
    }
    return canvas.toDataURL("image/png")
  }

  const generateImage = async () => {
    if (!canGenerate || attemptsRemaining <= 0) return
    setIsGenerating(true)
    setStep("generating")
    setGenerationProgress(0)
    const interval = setInterval(() => {
      setGenerationProgress(prev => { if (prev >= 100) { clearInterval(interval); return 100 } return prev + 4 })
    }, 120)
    try {
      const randomStyle = artStyles[Math.floor(Math.random() * artStyles.length)]
      let imageUrl: string
      try {
        const res = await fetch("/api/generate-image", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pulses, style: randomStyle.name, emotionalState: randomStyle.emotion }),
        })
        if (res.ok) { const d = await res.json(); imageUrl = d.imageUrl }
        else imageUrl = generateCanvasImage(pulses, randomStyle)
      } catch { imageUrl = generateCanvasImage(pulses, randomStyle) }
      const avgPulse = pulses.reduce((a, b) => a + b, 0) / pulses.length
      const result: GeneratedResult = {
        imageUrl,
        title: randomStyle.name,
        description: `Obra generada a partir de ${pulses.length} pulsos cardíacos (${pulses.join(", ")} BPM). Tu ritmo biológico fue transformado en arte digital único.`,
        emotionalState: randomStyle.emotion,
        energyLevel: Math.min(100, Math.round((avgPulse / 180) * 100)),
        coherenceLevel: Math.round(70 + Math.random() * 25),
        pulses: [...pulses],
      }
      setGeneratedResult(result)
      setMyCreations(prev => [result, ...prev.slice(0, 7)])
      const newRemaining = attemptsRemaining - 1
      saveTrialData(newRemaining)
      setStep(newRemaining <= 0 ? "exhausted" : "result")
    } finally {
      clearInterval(interval)
      setIsGenerating(false)
    }
  }

  const resetDemo = () => {
    setPulses([]); setCurrentPulseInput("")
    setGeneratedResult(null); setStep("home")
    setActiveNav("inicio")
  }

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-400 text-sm">Cargando...</div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden"
            style={{ minHeight: "100vh" }}>

            {/* Logo + collapse */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 flex-shrink-0" style={{ color: "#7c3aed" }} />
                <span className="font-black text-gray-900 text-base tracking-tight">Noosfera</span>
                <Badge className="text-[9px] px-1.5 py-0 h-4 rounded font-bold"
                  style={{ backgroundColor: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}>
                  DEMO
                </Badge>
              </div>
              <button onClick={() => setSidebarOpen(false)}
                className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-2">Navegar</p>
              {[
                { id: "inicio" as NavItem, icon: Home, label: "Inicio", onClick: () => { setActiveNav("inicio"); setStep("home") } },
                { id: "creaciones" as NavItem, icon: Grid3x3, label: "Creaciones", onClick: () => { setActiveNav("creaciones"); setStep("home") } },
                { id: "estilos" as NavItem, icon: Palette, label: "Estilos", onClick: () => setActiveNav("estilos") },
                { id: "comunidad" as NavItem, icon: Users, label: "Comunidad", onClick: () => setActiveNav("comunidad") },
              ].map(item => (
                <button key={item.id} onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={activeNav === item.id
                    ? { backgroundColor: "#f5f3ff", color: "#7c3aed" }
                    : { color: "#6b7280" }}>
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Plan card */}
            <div className="px-3 pb-4">
              <div className="rounded-2xl p-4 text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-200">Plan de prueba</span>
                  <UserPlus className="h-4 w-4 text-purple-200" />
                </div>
                <p className="font-black text-sm mb-1">Crea Tu Cuenta</p>
                <p className="text-xs text-purple-200 mb-3">Desbloquea acceso completo</p>
                <div className="space-y-1 mb-3">
                  {["Uso Gratuito", "Derechos Comerciales", "Sin Marca de Agua"].map(f => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-purple-100">
                      <Check className="h-3 w-3 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate("/auth/register")}
                  className="w-full py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                  style={{ backgroundColor: "#ffffff", color: "#7c3aed" }}>
                  Comenzar Gratis
                </button>
                <p className="text-center text-[10px] text-purple-300 mt-1.5">Sin tarjeta de crédito</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN PANEL ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            {!sidebarOpen && (
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" style={{ color: "#7c3aed" }} />
                <span className="font-black text-gray-900 text-sm">Noosfera</span>
                <Badge className="text-[9px] px-1.5 h-4"
                  style={{ backgroundColor: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}>
                  DEMO
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Plan indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs"
              style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>
              <span className="font-bold">Plan de prueba</span>
              <div className="flex gap-1">
                {[...Array(DAILY_LIMIT)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: i < attemptsRemaining ? "#7c3aed" : "#e5e7eb" }} />
                ))}
              </div>
              <span>{attemptsRemaining} restantes</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
            {isAuthenticated ? (
              <button onClick={logout}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <Button size="sm" onClick={() => navigate("/auth/login")} className="gap-1.5"
                style={{ backgroundColor: "#7c3aed", color: "#fff" }}>
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </Button>
            )}
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ── HOME / GALLERY ── */}
            {step === "home" && activeNav !== "creaciones" && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* Hero Banner */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50/40"
                  style={{ minHeight: "260px" }}>
                  {/* Floating image cards - left */}
                  <div className="absolute left-0 top-0 h-full w-40 pointer-events-none overflow-hidden">
                    <div className="absolute" style={{ top: "10%", left: "-20px", transform: "rotate(-8deg)", width: "120px" }}>
                      <img src={GALLERY_IMAGES[1]} alt="" className="rounded-xl shadow-lg w-full object-cover" style={{ height: "80px" }} />
                    </div>
                    <div className="absolute" style={{ top: "50%", left: "10px", transform: "rotate(-5deg)", width: "100px" }}>
                      <img src={GALLERY_IMAGES[2]} alt="" className="rounded-xl shadow-lg w-full object-cover" style={{ height: "68px" }} />
                    </div>
                    <div className="absolute" style={{ top: "20%", left: "80px", transform: "rotate(-3deg)", width: "90px" }}>
                      <img src={GALLERY_IMAGES[3]} alt="" className="rounded-xl shadow-md w-full object-cover" style={{ height: "64px" }} />
                    </div>
                  </div>
                  {/* Floating image cards - right */}
                  <div className="absolute right-0 top-0 h-full w-40 pointer-events-none overflow-hidden">
                    <div className="absolute" style={{ top: "8%", right: "-10px", transform: "rotate(6deg)", width: "120px" }}>
                      <img src={GALLERY_IMAGES[0]} alt="" className="rounded-xl shadow-lg w-full object-cover" style={{ height: "80px" }} />
                    </div>
                    <div className="absolute" style={{ top: "48%", right: "15px", transform: "rotate(4deg)", width: "100px" }}>
                      <img src={GALLERY_IMAGES[4]} alt="" className="rounded-xl shadow-lg w-full object-cover" style={{ height: "68px" }} />
                    </div>
                    <div className="absolute" style={{ top: "18%", right: "85px", transform: "rotate(2deg)", width: "85px" }}>
                      <img src={GALLERY_IMAGES[5]} alt="" className="rounded-xl shadow-md w-full object-cover" style={{ height: "60px" }} />
                    </div>
                  </div>

                  {/* Central content */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center py-14 px-20">
                    <motion.h1
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      ¿Qué <span style={{ color: "#7c3aed" }}>crearás</span> hoy?
                    </motion.h1>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                      className="flex flex-wrap gap-3 justify-center">
                      <button onClick={() => { setStep("input"); setActiveNav("inicio") }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 shadow-md"
                        style={{ backgroundColor: "#7c3aed" }}>
                        <Sparkles className="h-4 w-4" />
                        Generar Mi Arte
                      </button>
                      <button onClick={() => setActiveNav("creaciones")}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-gray-100"
                        style={{ backgroundColor: "#ffffff", color: "#374151", border: "1px solid #e5e7eb" }}>
                        <ImageIcon className="h-4 w-4" />
                        Ver Creaciones
                      </button>
                      <button onClick={() => setStep("input")}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-gray-100"
                        style={{ backgroundColor: "#ffffff", color: "#374151", border: "1px solid #e5e7eb" }}>
                        <Zap className="h-4 w-4" />
                        Generar Videos
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* Gallery section */}
                <div className="px-6 py-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-black text-gray-900 text-lg">Arte Generado por IA</h2>
                    <button className="text-sm font-semibold flex items-center gap-1"
                      style={{ color: "#7c3aed" }}>
                      Ver Más <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {GALLERY_IMAGES.map((img, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-2xl overflow-hidden cursor-pointer group relative"
                        onClick={() => setStep("input")}>
                        <img src={img} alt={GALLERY_LABELS[i]} className="w-full object-cover"
                          style={{ height: "130px" }} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-2xl" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-all">
                          <p className="text-white text-[10px] font-semibold bg-black/50 rounded-lg px-2 py-1 truncate">
                            {GALLERY_LABELS[i]}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {/* Create new card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 }}
                      onClick={() => setStep("input")}
                      className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all"
                      style={{ height: "130px", borderColor: "#e5e7eb" }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#f5f3ff" }}>
                        <Sparkles className="h-4 w-4" style={{ color: "#7c3aed" }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-400">Crear nueva</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── MIS CREACIONES ── */}
            {step === "home" && activeNav === "creaciones" && (
              <motion.div key="creaciones" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="px-6 py-6">
                <h2 className="font-black text-gray-900 text-xl mb-6">Mis Creaciones</h2>
                {myCreations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: "#f5f3ff" }}>
                      <ImageIcon className="h-8 w-8" style={{ color: "#7c3aed" }} />
                    </div>
                    <h3 className="font-bold text-gray-700 mb-2">Aún no tienes creaciones</h3>
                    <p className="text-gray-400 text-sm mb-6">Genera tu primera obra biométrica</p>
                    <button onClick={() => { setStep("input"); setActiveNav("inicio") }}
                      className="px-6 py-3 rounded-xl font-bold text-sm text-white"
                      style={{ backgroundColor: "#7c3aed" }}>
                      Crear Mi Primera Obra
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {myCreations.map((creation, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <img src={creation.imageUrl} alt={creation.title} className="w-full object-cover"
                          style={{ height: "140px" }} />
                        <div className="p-3 bg-white">
                          <p className="font-bold text-gray-900 text-sm truncate">{creation.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{creation.emotionalState}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}>
                              {creation.energyLevel}% energía
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── INPUT STEP ── */}
            {step === "input" && (
              <motion.div key="input"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center min-h-full py-12 px-6">
                <div className="w-full max-w-md">
                  <button onClick={() => { setStep("home"); setActiveNav("inicio") }}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio
                  </button>
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5 mx-auto"
                        style={{ backgroundColor: "#f5f3ff" }}>
                        <Heart className="h-7 w-7" style={{ color: "#7c3aed" }} />
                      </div>
                      <h2 className="text-xl font-black text-gray-900 text-center mb-1">Ingresa tus Pulsos</h2>
                      <p className="text-sm text-gray-400 text-center mb-6">
                        Escribe valores entre 40–200 BPM y presiona Enter
                      </p>

                      {/* Pulse input */}
                      <div
                        className="min-h-[56px] p-3 border-2 border-gray-200 rounded-2xl bg-gray-50 focus-within:border-purple-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-50 transition-all cursor-text mb-4"
                        onClick={() => inputRef.current?.focus()}>
                        <div className="flex flex-wrap items-center gap-2">
                          {pulses.map((pulse, index) => (
                            <motion.div key={index}
                              initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold"
                              style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}>
                              <span>{pulse}</span>
                              <span className="text-xs font-medium opacity-60">BPM</span>
                              <button onClick={e => { e.stopPropagation(); removePulse(index) }}
                                className="hover:opacity-80 rounded-full p-0.5 transition-opacity">
                                <X className="h-3 w-3" />
                              </button>
                            </motion.div>
                          ))}
                          {pulses.length < 8 && (
                            <div className="flex items-center gap-1 flex-1 min-w-[80px]">
                              <input ref={inputRef} type="text" inputMode="numeric"
                                placeholder={pulses.length === 0 ? "72, 65, 80..." : `Pulso ${pulses.length + 1}`}
                                value={currentPulseInput}
                                onChange={e => handlePulseInputChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={() => { if (currentPulseInput) addPulse() }}
                                className="flex-1 outline-none bg-transparent text-gray-700 placeholder:text-gray-400 text-sm" />
                              {currentPulseInput && parseInt(currentPulseInput) >= 40 && parseInt(currentPulseInput) <= 200 && (
                                <button onClick={addPulse} style={{ color: "#7c3aed" }}>
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dots progress */}
                      <div className="flex items-center justify-center gap-2 mb-6">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full transition-colors"
                            style={{ backgroundColor: i < pulses.length ? "#7c3aed" : "#e5e7eb" }} />
                        ))}
                        <span className="text-xs text-gray-400 ml-2">{pulses.length}/8</span>
                      </div>

                      {currentPulseInput && (parseInt(currentPulseInput) < 40 || parseInt(currentPulseInput) > 200) && (
                        <p className="text-xs text-amber-500 text-center mb-4">El valor debe estar entre 40 y 200 BPM</p>
                      )}

                      <button onClick={generateImage} disabled={!canGenerate}
                        className="w-full py-4 rounded-2xl font-black text-white text-sm tracking-wide transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                        style={{ backgroundColor: "#7c3aed" }}>
                        <Sparkles className="h-5 w-5" />
                        Generar Mi Arte Biométrico
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-3">
                        {attemptsRemaining} generación{attemptsRemaining !== 1 ? "es" : ""} disponible{attemptsRemaining !== 1 ? "s" : ""} hoy
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── GENERATING ── */}
            {step === "generating" && (
              <motion.div key="generating"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-full py-12 px-6">
                <div className="text-center max-w-sm">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                    style={{ backgroundColor: "#7c3aed" }}>
                    <Heart className="h-10 w-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">Creando tu obra</h3>
                  <p className="text-gray-400 text-sm mb-8">Nuestro algoritmo convierte tus pulsos en arte único</p>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                    <motion.div className="h-2 rounded-full transition-all"
                      style={{ width: `${generationProgress}%`, backgroundColor: "#7c3aed" }} />
                  </div>
                  <p className="text-xs text-gray-400">{generationProgress}% completado</p>

                  <div className="mt-8 space-y-2">
                    {["Analizando patrones de pulso...", "Generando prompt creativo...", "Renderizando con IA..."].map((msg, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0 }} animate={{ opacity: generationProgress > i * 33 ? 1 : 0 }}
                        className="text-xs text-gray-400 flex items-center gap-2 justify-center">
                        {generationProgress > i * 33 + 10
                          ? <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                          : <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-purple-500 animate-spin flex-shrink-0" />}
                        {msg}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── RESULT ── */}
            {(step === "result" || step === "exhausted") && generatedResult && (
              <motion.div key="result"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-6">

                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="font-black text-gray-900 text-xl">{generatedResult.title}</h2>
                      <p className="text-sm text-gray-400 mt-0.5">{generatedResult.emotionalState}</p>
                    </div>
                    <button onClick={resetDemo}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100 border border-gray-200"
                      style={{ color: "#7c3aed" }}>
                      <RefreshCw className="h-4 w-4" />
                      Nueva obra
                    </button>
                  </div>

                  {/* Image */}
                  <div className="rounded-3xl overflow-hidden shadow-xl mb-5 border border-gray-100">
                    <img src={generatedResult.imageUrl} alt={generatedResult.title}
                      className="w-full" style={{ maxHeight: "420px", objectFit: "cover" }} />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { label: "Nivel de Energía", value: generatedResult.energyLevel, color: "#7c3aed" },
                      { label: "Coherencia Rítmica", value: generatedResult.coherenceLevel, color: "#5b21b6" },
                    ].map(m => (
                      <div key={m.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-400 font-medium">{m.label}</span>
                          <span className="font-black text-lg" style={{ color: m.color }}>{m.value}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-5">
                    <p className="text-sm text-gray-500 leading-relaxed">{generatedResult.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {generatedResult.pulses.map((p, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full font-mono font-medium"
                          style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}>{p} BPM</span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        const a = document.createElement("a")
                        a.href = generatedResult.imageUrl
                        a.download = `noosfera-${generatedResult.title.toLowerCase().replace(/\s/g, "-")}.png`
                        a.click()
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90 text-white"
                      style={{ backgroundColor: "#7c3aed" }}>
                      <Download className="h-4 w-4" />
                      Descargar Arte
                    </button>
                    <button onClick={() => navigate("/auth/register")}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:bg-gray-50 border-2"
                      style={{ borderColor: "#7c3aed", color: "#7c3aed" }}>
                      <Sparkles className="h-4 w-4" />
                      Mintear como NFT
                    </button>
                  </div>

                  {step === "exhausted" && (
                    <div className="mt-4 p-4 rounded-2xl text-center"
                      style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a" }}>
                      <p className="text-sm font-bold text-amber-700">Has agotado tus creaciones de hoy</p>
                      <p className="text-xs text-amber-600 mt-1">
                        Regresa mañana o <a href="/auth/register" className="underline font-semibold">crea una cuenta gratuita</a> para más.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── EXHAUSTED (no result) ── */}
            {step === "exhausted" && !generatedResult && (
              <motion.div key="exhausted-empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-full py-12 px-6">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#fef3c7" }}>
                    <Heart className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="font-black text-gray-900 text-xl mb-2">Sin creaciones disponibles</h3>
                  <p className="text-gray-400 text-sm mb-6">Has usado tus {DAILY_LIMIT} generaciones de hoy. Vuelve mañana o crea una cuenta.</p>
                  <button onClick={() => navigate("/auth/register")}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-white"
                    style={{ backgroundColor: "#7c3aed" }}>
                    Crear Cuenta Gratis
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
