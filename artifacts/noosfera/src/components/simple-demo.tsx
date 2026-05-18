import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart, Sparkles, ArrowLeft, RefreshCw, X, Check,
  ImageIcon, LogOut, Home, Users, ChevronLeft, ChevronRight, Download,
} from "lucide-react"
import { useLocation } from "wouter"
import { useAuth } from "@/contexts/auth-context"

type DemoStep = "home" | "input" | "generating" | "result" | "exhausted"
type NavItem = "inicio" | "comunidad"

interface GeneratedResult {
  imageUrl: string
  title: string
  description: string
  emotionalState: string
  energyLevel: number
  coherenceLevel: number
  pulses: number[]
  tokenId: string
}

const artStyles = [
  { name: "Armonía Vital", emotion: "Tranquilidad y equilibrio" },
  { name: "Energía Pulsante", emotion: "Vitalidad y pasión" },
  { name: "Flujo Cósmico", emotion: "Creatividad y misterio" },
  { name: "Ritmo Dorado", emotion: "Alegría y optimismo" },
  { name: "Serenidad Azul", emotion: "Calma y profundidad" },
]

const HERO_IMAGES = [
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
]

const COMMUNITY_IMAGES = [
  { src: "/images/community-1.png", label: "OndaRítmica", user: "@carlos_m", likes: 142 },
  { src: "/images/community-2.png", label: "LuzBiométrica", user: "@sofia_r", likes: 98 },
  { src: "/images/community-3.png", label: "MandalaPulso", user: "@andres_v", likes: 231 },
  { src: "/images/community-4.png", label: "CromoCórdico", user: "@daniela_q", likes: 187 },
  { src: "/images/community-5.png", label: "RaízLatido", user: "@miguel_c", likes: 315 },
  { src: "/images/community-6.png", label: "GalaxiaVital", user: "@lucia_p", likes: 264 },
]

const DAILY_LIMIT = 5

function generateFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency ?? 0,
  ].join("|")
  let hash = 0
  for (let i = 0; i < components.length; i++) {
    const char = components.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36) + components.length.toString(36)
}

async function checkServerUsage(fp: string): Promise<number> {
  try {
    const res = await fetch("/api/demo/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint: fp }),
    })
    if (res.ok) {
      const d = await res.json()
      return d.remaining as number
    }
  } catch {}
  const stored = localStorage.getItem("nfp_" + fp)
  const used = stored ? parseInt(stored) : 0
  return Math.max(0, DAILY_LIMIT - used)
}

async function consumeServerUsage(fp: string): Promise<{ remaining: number; blocked: boolean }> {
  try {
    const res = await fetch("/api/demo/use", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint: fp }),
    })
    if (res.ok) {
      const d = await res.json()
      localStorage.setItem("nfp_" + fp, d.used.toString())
      return { remaining: d.remaining, blocked: d.blocked }
    }
  } catch {}
  const stored = localStorage.getItem("nfp_" + fp)
  const used = stored ? parseInt(stored) : 0
  if (used >= DAILY_LIMIT) return { remaining: 0, blocked: true }
  const newUsed = used + 1
  localStorage.setItem("nfp_" + fp, newUsed.toString())
  return { remaining: Math.max(0, DAILY_LIMIT - newUsed), blocked: false }
}

function addWatermark(sourceUrl: string, tokenId: string): Promise<string> {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width || 800
      canvas.height = img.height || 800
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0)
      ctx.fillStyle = "rgba(124, 58, 237, 0.55)"
      ctx.fillRect(0, canvas.height - 56, canvas.width, 56)
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${Math.max(14, canvas.width / 40)}px Arial`
      ctx.textAlign = "left"
      ctx.fillText("© Noosfera Demo", 16, canvas.height - 32)
      ctx.font = `${Math.max(11, canvas.width / 55)}px Arial`
      ctx.textAlign = "right"
      ctx.fillText(`Token: ${tokenId}`, canvas.width - 16, canvas.height - 32)
      ctx.font = `${Math.max(10, canvas.width / 62)}px Arial`
      ctx.textAlign = "left"
      ctx.fillStyle = "rgba(255,255,255,0.8)"
      ctx.fillText("noosfera.com — Arte biométrico con IA", 16, canvas.height - 12)
      resolve(canvas.toDataURL("image/png"))
    }
    img.onerror = () => resolve(sourceUrl)
    img.src = sourceUrl
  })
}

function generateCanvasImage(pulses: number[]): string {
  const canvas = document.createElement("canvas")
  canvas.width = 600; canvas.height = 600
  const ctx = canvas.getContext("2d")!
  const g = ctx.createRadialGradient(300, 300, 0, 300, 300, 340)
  g.addColorStop(0, "#a78bfa")
  g.addColorStop(0.5, "#7c3aed")
  g.addColorStop(1, "#1e1b4b")
  ctx.fillStyle = g; ctx.fillRect(0, 0, 600, 600)
  pulses.forEach((p, i) => {
    const angle = (i / pulses.length) * Math.PI * 2
    const r = 100 + (p % 60)
    const x = 300 + Math.cos(angle) * r * 0.7
    const y = 300 + Math.sin(angle) * r * 0.7
    const size = 25 + (p % 35)
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${0.25 + i * 0.15})`; ctx.fill()
    ctx.beginPath(); ctx.arc(x, y, size * 0.45, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fill()
  })
  for (let i = 0; i < 40; i++) {
    ctx.beginPath()
    ctx.arc(Math.random() * 600, Math.random() * 600, Math.random() * 2.5 + 0.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4})`; ctx.fill()
  }
  return canvas.toDataURL("image/png")
}

export default function SimpleDemo() {
  const [, navigate] = useLocation()
  const { logout } = useAuth()
  const [step, setStep] = useState<DemoStep>("home")
  const [pulses, setPulses] = useState<number[]>([])
  const [currentPulseInput, setCurrentPulseInput] = useState("")
  const [attemptsRemaining, setAttemptsRemaining] = useState(DAILY_LIMIT)
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeNav, setActiveNav] = useState<NavItem>("inicio")
  const [myCreations, setMyCreations] = useState<GeneratedResult[]>([])
  const [fingerprint, setFingerprint] = useState("")
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fp = generateFingerprint()
    setFingerprint(fp)
    checkServerUsage(fp).then(remaining => {
      setAttemptsRemaining(remaining)
      if (remaining <= 0) setStep("exhausted")
      setIsLoaded(true)
    })
    const accepted = localStorage.getItem("noosfera_demo_disclaimer")
    if (!accepted) setShowDisclaimer(true)
    else setIsLoaded(true)
  }, [])

  const acceptDisclaimer = () => {
    localStorage.setItem("noosfera_demo_disclaimer", "1")
    setShowDisclaimer(false)
  }

  const handlePulseInputChange = (v: string) => {
    const n = v.replace(/[^0-9]/g, "")
    if (n === "" || parseInt(n) <= 200) setCurrentPulseInput(n)
  }

  const addPulse = useCallback(() => {
    const num = parseInt(currentPulseInput)
    if (num >= 40 && num <= 200 && pulses.length < 8) {
      setPulses(prev => [...prev, num])
      setCurrentPulseInput("")
      inputRef.current?.focus()
    }
  }, [currentPulseInput, pulses])

  const removePulse = (i: number) => setPulses(pulses.filter((_, j) => j !== i))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") { e.preventDefault(); addPulse() }
    else if (e.key === "Backspace" && currentPulseInput === "" && pulses.length > 0) removePulse(pulses.length - 1)
  }

  const canGenerate = pulses.length >= 1

  const generateImage = async () => {
    if (!canGenerate || attemptsRemaining <= 0) return
    const result = await consumeServerUsage(fingerprint)
    if (result.blocked) { setStep("exhausted"); return }
    setAttemptsRemaining(result.remaining)
    setStep("generating")
    setGenerationProgress(0)
    const interval = setInterval(() => {
      setGenerationProgress(prev => prev >= 100 ? (clearInterval(interval), 100) : prev + 3)
    }, 90)
    const style = artStyles[Math.floor(Math.random() * artStyles.length)]
    const tokenId = Math.abs((Date.now() ^ (Math.random() * 0xffffff)) | 0).toString(16).toUpperCase().padStart(8, "0")
    let imageUrl: string
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pulses, style: style.name }),
      })
      imageUrl = res.ok ? (await res.json()).imageUrl : generateCanvasImage(pulses)
    } catch { imageUrl = generateCanvasImage(pulses) }
    const avgPulse = pulses.reduce((a, b) => a + b, 0) / pulses.length
    const created: GeneratedResult = {
      imageUrl,
      title: style.name,
      description: `Obra generada a partir de ${pulses.length} pulso${pulses.length > 1 ? "s" : ""} cardíaco${pulses.length > 1 ? "s" : ""} (${pulses.join(", ")} BPM).`,
      emotionalState: style.emotion,
      energyLevel: Math.min(100, Math.round((avgPulse / 180) * 100)),
      coherenceLevel: Math.round(70 + Math.random() * 25),
      pulses: [...pulses],
      tokenId,
    }
    clearInterval(interval)
    setGeneratedResult(created)
    setMyCreations(prev => [created, ...prev.slice(0, 7)])
    setStep(result.remaining <= 0 ? "exhausted" : "result")
  }

  const resetToInput = () => {
    setPulses([]); setCurrentPulseInput("")
    setGeneratedResult(null); setStep("input")
  }

  const handleDownload = async () => {
    if (!generatedResult) return
    const watermarked = await addWatermark(generatedResult.imageUrl, generatedResult.tokenId)
    const a = document.createElement("a")
    a.href = watermarked
    a.download = `noosfera-demo-${generatedResult.tokenId}.png`
    a.click()
  }

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── DISCLAIMER MODAL ─────────────────────────────── */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 z-10"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5 mx-auto"
                style={{ backgroundColor: "#f5f3ff" }}>
                <Heart className="h-7 w-7" style={{ color: "#7c3aed" }} />
              </div>
              <h2 className="text-xl font-black text-gray-900 text-center mb-2">Bienvenido al Demo</h2>
              <p className="text-sm text-gray-500 text-center mb-5 leading-relaxed">
                Antes de comenzar, ten en cuenta que:
              </p>
              <div className="space-y-3 mb-6">
                {[
                  "Los datos generados en el demo no son persistentes y se perderán al reiniciar el navegador.",
                  `Dispones de ${DAILY_LIMIT} generaciones de arte. Una vez agotadas, deberás crear una cuenta para continuar.`,
                  "Las imágenes descargadas incluyen marca de agua de Noosfera Demo.",
                  "El registro de uso se mantiene incluso en modo incógnito.",
                ].map((t, i) => (
                  <div key={i} className="flex gap-3 text-sm text-gray-600">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: "#f5f3ff" }}>
                      <Check className="h-3 w-3" style={{ color: "#7c3aed" }} />
                    </div>
                    {t}
                  </div>
                ))}
              </div>
              <button onClick={acceptDisclaimer}
                className="w-full py-3.5 rounded-2xl font-black text-white text-sm tracking-wide transition-all hover:opacity-90"
                style={{ backgroundColor: "#7c3aed" }}>
                Entendido — Comenzar Demo
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Al continuar aceptas nuestros <a href="/terms" className="underline">términos de uso</a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ──────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }} animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden"
            style={{ minHeight: "100vh" }}>

            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 flex-shrink-0" style={{ color: "#7c3aed" }} />
                <span className="font-black text-gray-900 text-base tracking-tight">Noosfera Demo</span>
              </div>
              <button onClick={() => setSidebarOpen(false)}
                className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-2">Navegar</p>
              {[
                { id: "inicio" as NavItem, icon: Home, label: "Inicio", onClick: () => { setActiveNav("inicio"); setStep("home") } },
                { id: "comunidad" as NavItem, icon: Users, label: "Comunidad", onClick: () => { setActiveNav("comunidad"); setStep("home") } },
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

              {/* Volver button below comunidad */}
              <div className="pt-2">
                <button onClick={() => navigate("/")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all">
                  <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                  Volver al Inicio
                </button>
              </div>
            </nav>

            {/* Plan card */}
            <div className="px-3 pb-4">
              <div className="rounded-2xl p-4 text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-1">Plan de prueba</p>
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
                  className="w-full py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#ffffff", color: "#7c3aed" }}>
                  Comenzar Gratis
                </button>
                <p className="text-center text-[10px] text-purple-300 mt-1.5">Sin tarjeta de crédito</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN PANEL ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar — minimal, no Iniciar Sesión */}
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
                <span className="font-black text-gray-900 text-sm">Noosfera Demo</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs"
            style={{ backgroundColor: attemptsRemaining > 0 ? "#fef3c7" : "#fee2e2", color: attemptsRemaining > 0 ? "#92400e" : "#991b1b" }}>
            <span className="font-bold">Plan de prueba</span>
            <div className="flex gap-1">
              {[...Array(DAILY_LIMIT)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: i < attemptsRemaining ? "#7c3aed" : "#e5e7eb" }} />
              ))}
            </div>
            <span>{attemptsRemaining} restante{attemptsRemaining !== 1 ? "s" : ""}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ── HOME ── */}
            {step === "home" && activeNav === "inicio" && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50/40" style={{ minHeight: "300px" }}>
                  {/* Floating images LEFT — bigger */}
                  <div className="absolute left-0 top-0 h-full w-52 pointer-events-none overflow-hidden">
                    <div className="absolute" style={{ top: "5%", left: "-10px", transform: "rotate(-7deg)", width: "160px" }}>
                      <img src={HERO_IMAGES[0]} alt="" className="rounded-2xl shadow-xl w-full object-cover" style={{ height: "108px" }} />
                    </div>
                    <div className="absolute" style={{ top: "52%", left: "20px", transform: "rotate(-4deg)", width: "140px" }}>
                      <img src={HERO_IMAGES[1]} alt="" className="rounded-2xl shadow-xl w-full object-cover" style={{ height: "94px" }} />
                    </div>
                  </div>
                  {/* Floating images RIGHT — bigger */}
                  <div className="absolute right-0 top-0 h-full w-52 pointer-events-none overflow-hidden">
                    <div className="absolute" style={{ top: "5%", right: "-10px", transform: "rotate(7deg)", width: "160px" }}>
                      <img src={HERO_IMAGES[2]} alt="" className="rounded-2xl shadow-xl w-full object-cover" style={{ height: "108px" }} />
                    </div>
                    <div className="absolute" style={{ top: "52%", right: "20px", transform: "rotate(4deg)", width: "140px" }}>
                      <img src={HERO_IMAGES[0]} alt="" className="rounded-2xl shadow-xl w-full object-cover" style={{ height: "94px" }} />
                    </div>
                  </div>

                  {/* Central */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center py-16 px-52">
                    <motion.h1
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
                      Transforma tus <span style={{ color: "#7c3aed" }}>latidos</span> en arte
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                      className="text-sm text-gray-500 mb-6 max-w-xs">
                      Ingresa tus pulsos cardíacos y nuestra IA los convierte en una obra digital única
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      onClick={() => setStep("input")}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white hover:opacity-90 transition-all shadow-lg"
                      style={{ backgroundColor: "#7c3aed" }}>
                      <Heart className="h-4 w-4" />
                      Generar mi arte biométrico
                    </motion.button>
                  </div>
                </div>

                {/* Community gallery */}
                <div className="px-6 py-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-black text-gray-900 text-lg">Lo que nuestra comunidad ha creado</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Arte biométrico generado por miembros de Noosfera</p>
                    </div>
                    <button className="text-sm font-semibold flex items-center gap-1" style={{ color: "#7c3aed" }}>
                      Ver todo <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {COMMUNITY_IMAGES.map((img, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-2xl overflow-hidden cursor-pointer group relative"
                        onClick={() => setStep("input")}>
                        <img src={img.src} alt={img.label} className="w-full object-cover"
                          style={{ height: "140px" }} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-2xl" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-white text-[11px] font-bold truncate">{img.label}</p>
                          <p className="text-white/70 text-[10px] truncate">{img.user}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── COMUNIDAD ── */}
            {step === "home" && activeNav === "comunidad" && (
              <motion.div key="comunidad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="px-6 py-6">
                <h2 className="font-black text-gray-900 text-xl mb-1">Comunidad Noosfera</h2>
                <p className="text-sm text-gray-400 mb-6">Arte biométrico generado por nuestra comunidad global</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {COMMUNITY_IMAGES.map((img, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                      <img src={img.src} alt={img.label} className="w-full object-cover" style={{ height: "160px" }} />
                      <div className="p-3 bg-white">
                        <p className="font-bold text-gray-900 text-sm truncate">{img.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{img.user}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Heart className="h-3 w-3" style={{ color: "#7c3aed" }} />
                          <span className="text-xs text-gray-500">{img.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── MIS CREACIONES ── */}
            {step === "home" && activeNav === "inicio" && myCreations.length > 0 && (
              <div className="px-6 pb-6">
                <h3 className="font-black text-gray-800 text-base mb-3">Mis generaciones</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {myCreations.map((c, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                      <img src={c.imageUrl} alt={c.title} className="w-full object-cover" style={{ height: "100px" }} />
                      <div className="p-2 bg-white">
                        <p className="font-bold text-xs text-gray-800 truncate">{c.title}</p>
                        <p className="text-[10px] text-gray-400 truncate">Token: {c.tokenId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── INPUT ── */}
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
                        Valores entre 40–200 BPM · presiona Enter para agregar
                      </p>

                      <div
                        className="min-h-[56px] p-3 border-2 border-gray-200 rounded-2xl bg-gray-50 focus-within:border-purple-400 focus-within:bg-white transition-all cursor-text mb-4"
                        onClick={() => inputRef.current?.focus()}>
                        <div className="flex flex-wrap items-center gap-2">
                          {pulses.map((pulse, i) => (
                            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold"
                              style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}>
                              {pulse} <span className="text-xs font-medium opacity-60">BPM</span>
                              <button onClick={e => { e.stopPropagation(); removePulse(i) }}
                                className="hover:opacity-80 p-0.5">
                                <X className="h-3 w-3" />
                              </button>
                            </motion.div>
                          ))}
                          {pulses.length < 8 && (
                            <input ref={inputRef} type="text" inputMode="numeric"
                              placeholder={pulses.length === 0 ? "72, 65, 80..." : `Pulso ${pulses.length + 1}`}
                              value={currentPulseInput}
                              onChange={e => handlePulseInputChange(e.target.value)}
                              onKeyDown={handleKeyDown}
                              onBlur={() => { if (currentPulseInput) addPulse() }}
                              className="flex-1 min-w-[80px] outline-none bg-transparent text-gray-700 placeholder:text-gray-400 text-sm" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 mb-6">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full transition-colors"
                            style={{ backgroundColor: i < pulses.length ? "#7c3aed" : "#e5e7eb" }} />
                        ))}
                        <span className="text-xs text-gray-400 ml-2">{pulses.length}/8</span>
                      </div>

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
              <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-full py-12 px-6">
                <div className="text-center max-w-sm">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                    style={{ backgroundColor: "#7c3aed" }}>
                    <Heart className="h-10 w-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">Creando tu obra</h3>
                  <p className="text-gray-400 text-sm mb-8">Nuestro algoritmo transforma tus pulsos en arte único</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${generationProgress}%`, backgroundColor: "#7c3aed" }} />
                  </div>
                  <p className="text-xs text-gray-400">{generationProgress}%</p>
                  <div className="mt-8 space-y-2">
                    {["Analizando patrones de pulso...", "Generando prompt biométrico...", "Renderizando con IA..."].map((msg, i) => (
                      <div key={i} className="text-xs text-gray-400 flex items-center gap-2 justify-center"
                        style={{ opacity: generationProgress > i * 33 ? 1 : 0.3 }}>
                        {generationProgress > i * 33 + 10
                          ? <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                          : <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-purple-500 animate-spin flex-shrink-0" />}
                        {msg}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── RESULT ── */}
            {(step === "result" || (step === "exhausted" && generatedResult)) && generatedResult && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-black text-gray-900 text-xl">{generatedResult.title}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{generatedResult.emotionalState}</p>
                  </div>
                  {step === "result" && (
                    <button onClick={resetToInput}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 border border-gray-200 transition-all"
                      style={{ color: "#7c3aed" }}>
                      <RefreshCw className="h-4 w-4" />
                      Nueva obra
                    </button>
                  )}
                </div>

                <div className="rounded-3xl overflow-hidden shadow-xl mb-5 border border-gray-100 relative">
                  <img src={generatedResult.imageUrl} alt={generatedResult.title}
                    className="w-full" style={{ maxHeight: "380px", objectFit: "cover" }} />
                  {/* Preview watermark overlay */}
                  <div className="absolute bottom-0 left-0 right-0 py-2 px-3 flex items-center justify-between"
                    style={{ backgroundColor: "rgba(124, 58, 237, 0.7)" }}>
                    <span className="text-white text-xs font-bold">© Noosfera Demo</span>
                    <span className="text-white/80 text-[10px] font-mono">Token: {generatedResult.tokenId}</span>
                  </div>
                </div>

                {/* Token / Certificate */}
                <div className="rounded-2xl p-4 border mb-4"
                  style={{ backgroundColor: "#faf5ff", borderColor: "#e9d5ff" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#7c3aed" }}>Token de Autenticidad</p>
                      <p className="font-mono font-black text-gray-900 text-sm tracking-wider">{generatedResult.tokenId}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Hash SHA-256 de tu vector biométrico</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Estándar NFT</p>
                      <p className="text-xs font-bold" style={{ color: "#7c3aed" }}>ERC-721 · Polygon</p>
                      <p className="text-xs text-gray-400 mt-1">Royalties: 10%</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Nivel de Energía", value: generatedResult.energyLevel },
                    { label: "Coherencia Rítmica", value: generatedResult.coherenceLevel },
                  ].map(m => (
                    <div key={m.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400 font-medium">{m.label}</span>
                        <span className="font-black text-lg" style={{ color: "#7c3aed" }}>{m.value}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${m.value}%`, backgroundColor: "#7c3aed" }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#7c3aed" }}>
                    <Download className="h-4 w-4" />
                    Descargar con marca de agua
                  </button>
                  <button onClick={() => navigate("/auth/register")}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border-2 hover:bg-gray-50 transition-all"
                    style={{ borderColor: "#7c3aed", color: "#7c3aed" }}>
                    <Sparkles className="h-4 w-4" />
                    Mintear como NFT
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-3">
                  La versión sin marca de agua y el minting NFT están disponibles con una cuenta registrada
                </p>

                {step === "exhausted" && (
                  <div className="mt-4 p-4 rounded-2xl text-center"
                    style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a" }}>
                    <p className="text-sm font-bold text-amber-700">Has agotado tus {DAILY_LIMIT} generaciones del demo</p>
                    <p className="text-xs text-amber-600 mt-1">
                      <a href="/auth/register" className="underline font-semibold">Crea una cuenta gratis</a> para continuar generando sin límite
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── EXHAUSTED (sin resultado) ── */}
            {step === "exhausted" && !generatedResult && (
              <motion.div key="exhausted"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-full py-12 px-6">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#fef3c7" }}>
                    <Heart className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="font-black text-gray-900 text-xl mb-2">Límite de generaciones alcanzado</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Has usado tus {DAILY_LIMIT} generaciones del demo. Crea una cuenta gratuita para continuar sin límites.
                  </p>
                  <button onClick={() => navigate("/auth/register")}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-white"
                    style={{ backgroundColor: "#7c3aed" }}>
                    Crear Cuenta Gratis — Sin tarjeta
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
