import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart, Sparkles, ArrowLeft, RefreshCw, X, Check,
  Home, Users, ChevronLeft, ChevronRight, Download,
} from "lucide-react"
import { useLocation } from "wouter"
import { useAuth } from "@/contexts/auth-context"

type NavItem = "inicio" | "comunidad"

interface GeneratedResult {
  imageUrl: string
  title: string
  emotionalState: string
  energyLevel: number
  coherenceLevel: number
  pulses: number[]
  tokenId: string
}

/* ── Diverse AI prompts — a new one picked at random every time ── */
const AI_PROMPTS = [
  "Majestic blue electric lion with cosmic mane, glowing energy portrait, fantasy ultra detailed digital art",
  "Golden phoenix rising from flames mythical fire bird, epic fantasy painting ultra detailed",
  "Ethereal forest fairy with iridescent wings bioluminescent glow, fantasy portrait ultra detailed",
  "Ancient dragon with emerald scales and lightning breath over misty mountains, ultra detailed",
  "Surrealist woman portrait with butterflies and flowers growing from hair, hyper realistic fantasy",
  "Cyberpunk samurai warrior neon city rain reflections purple glow, cinematic ultra detailed",
  "Magical underwater kingdom with mermaids and glowing coral, fantasy art ultra detailed",
  "Dark fantasy knight in crystal armor, haunted castle background, epic digital painting",
  "Psychedelic wolf howling at cosmic nebula moon, surrealist art vibrant colors ultra detailed",
  "Art nouveau goddess with flowing hair made of aurora borealis, elegant fantasy portrait",
  "Steampunk inventor surrounded by golden gears and floating airships, ultra detailed",
  "Abstract surrealist dreamscape with melting geometric shapes and impossible colors",
  "Mystical white tiger with third eye and chakra energy aura, spiritual fantasy art",
  "Rock music electric guitar exploding into cosmic stars and neon fractals, ultra detailed",
  "Ancient Egyptian pharaoh reborn as a cyberpunk deity, gold and neon, ultra detailed",
  "Bioluminescent jellyfish forest in deep ocean, ethereal purple blue glow, fantasy art",
  "Viking goddess with ravens and storm clouds, Norse mythology, epic digital painting",
  "Koi fish transforming into dragon in ink-wash surrealist painting, ultra detailed",
  "Crystal witch casting spell, floating runes and prismatic light, fantasy portrait",
  "Post-apocalyptic rose garden blooming from ruins, hope and decay surrealism, ultra detailed",
]

const artStyles = [
  { name: "Armonía Vital", emotion: "Tranquilidad y equilibrio" },
  { name: "Energía Pulsante", emotion: "Vitalidad y pasión" },
  { name: "Flujo Cósmico", emotion: "Creatividad y misterio" },
  { name: "Ritmo Dorado", emotion: "Alegría y optimismo" },
  { name: "Serenidad Azul", emotion: "Calma y profundidad" },
]

/* ── Hero side images — portrait 3:4 ── */
const HERO_IMAGES = [
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
  "/images/hero-4.png",
  "/images/hero-5.png",
  "/images/hero-6.png",
]

/* ── Community gallery ── */
const COMMUNITY_IMAGES = [
  { src: "/images/community-1.png", label: "Tiempo Disuelto" },
  { src: "/images/community-2.png", label: "Unicornio Cósmico" },
  { src: "/images/community-3.png", label: "Kraken de Luz" },
  { src: "/images/community-4.png", label: "Diosa Primavera" },
  { src: "/images/pipeline-ocean.png", label: "Océano Interior" },
  { src: "/images/pipeline-forest.png", label: "Bosque Místico" },
]

const DAILY_LIMIT = 5

function generateFingerprint(): string {
  const c = [navigator.userAgent, navigator.language, screen.width + "x" + screen.height, screen.colorDepth, new Date().getTimezoneOffset(), navigator.hardwareConcurrency ?? 0].join("|")
  let h = 0
  for (let i = 0; i < c.length; i++) { h = ((h << 5) - h) + c.charCodeAt(i); h = h & h }
  return Math.abs(h).toString(36) + c.length.toString(36)
}

async function checkUsage(fp: string): Promise<number> {
  try {
    const r = await fetch("/api/demo/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fingerprint: fp }) })
    if (r.ok) return (await r.json()).remaining as number
  } catch {}
  return Math.max(0, DAILY_LIMIT - parseInt(localStorage.getItem("nfp_" + fp) ?? "0"))
}

async function consumeUsage(fp: string): Promise<{ remaining: number; blocked: boolean }> {
  try {
    const r = await fetch("/api/demo/use", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fingerprint: fp }) })
    if (r.ok) { const d = await r.json(); localStorage.setItem("nfp_" + fp, d.used.toString()); return { remaining: d.remaining, blocked: d.blocked } }
  } catch {}
  const used = parseInt(localStorage.getItem("nfp_" + fp) ?? "0")
  if (used >= DAILY_LIMIT) return { remaining: 0, blocked: true }
  localStorage.setItem("nfp_" + fp, String(used + 1))
  return { remaining: Math.max(0, DAILY_LIMIT - used - 1), blocked: false }
}

function addWatermark(src: string, tokenId: string): Promise<string> {
  return new Promise(resolve => {
    const img = new Image(); img.crossOrigin = "anonymous"
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = img.width || 600; c.height = img.height || 600
      const ctx = c.getContext("2d")!; ctx.drawImage(img, 0, 0)
      ctx.fillStyle = "rgba(124, 58, 237, 0.6)"; ctx.fillRect(0, c.height - 52, c.width, 52)
      ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.max(13, c.width / 38)}px DM Sans, Arial`
      ctx.textAlign = "left"; ctx.fillText("© Noosfera Demo", 14, c.height - 28)
      ctx.font = `${Math.max(10, c.width / 52)}px DM Sans, Arial`; ctx.textAlign = "right"
      ctx.fillText("Token: " + tokenId, c.width - 14, c.height - 28)
      ctx.font = `${Math.max(9, c.width / 60)}px DM Sans, Arial`; ctx.textAlign = "left"
      ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillText("noosfera.com — Arte biométrico con IA", 14, c.height - 10)
      resolve(c.toDataURL("image/png"))
    }
    img.onerror = () => resolve(src); img.src = src
  })
}

function generateCanvasArt(pulses: number[]): string {
  const c = document.createElement("canvas"); c.width = 600; c.height = 600
  const ctx = c.getContext("2d")!
  const g = ctx.createRadialGradient(300, 300, 0, 300, 300, 340)
  const palette = [["#a78bfa","#7c3aed","#1e1b4b"],["#f472b6","#ec4899","#4a044e"],["#34d399","#059669","#022c22"],["#fbbf24","#f59e0b","#451a03"],["#60a5fa","#2563eb","#1e3a8a"]]
  const p = palette[Math.floor(Math.random() * palette.length)]
  g.addColorStop(0, p[0]); g.addColorStop(0.5, p[1]); g.addColorStop(1, p[2])
  ctx.fillStyle = g; ctx.fillRect(0, 0, 600, 600)
  for (let i = 0; i < 6; i++) {
    ctx.beginPath(); ctx.arc(300 + (Math.random() - 0.5) * 200, 300 + (Math.random() - 0.5) * 200, 20 + Math.random() * 80, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.12})`; ctx.fill()
  }
  pulses.forEach((pulse, i) => {
    const angle = (i / pulses.length) * Math.PI * 2
    const r = 80 + (pulse % 60)
    const x = 300 + Math.cos(angle) * r * 0.75, y = 300 + Math.sin(angle) * r * 0.75
    const size = 18 + (pulse % 30)
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${0.2 + i * 0.15})`; ctx.fill()
    ctx.beginPath(); ctx.arc(x, y, size * 0.45, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.fill()
  })
  for (let i = 0; i < 50; i++) {
    ctx.beginPath(); ctx.arc(Math.random() * 600, Math.random() * 600, Math.random() * 2 + 0.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.35})`; ctx.fill()
  }
  return c.toDataURL("image/png")
}

/* ── Hero side panel (like login page) ── */
function HeroSidePanel({ side }: { side: "left" | "right" }) {
  const imgs = side === "left" ? [HERO_IMAGES[0], HERO_IMAGES[1], HERO_IMAGES[2]] : [HERO_IMAGES[3], HERO_IMAGES[4], HERO_IMAGES[5]]
  const rotations = side === "left" ? [-8, -4, -6] : [7, 4, 6]
  const cols: [number[], number[]] = side === "left"
    ? [[0, 2], [1]]
    : [[0], [1, 2]]
  return (
    <div className="absolute inset-y-0 w-52 flex gap-2 pointer-events-none overflow-hidden"
      style={side === "left" ? { left: 0 } : { right: 0 }}>
      {cols.map((colImgs, ci) => (
        <div key={ci} className="flex flex-col gap-2" style={{ marginTop: ci === (side === "left" ? 1 : 0) ? 28 : 0 }}>
          {colImgs.map((imgIdx) => (
            <div key={imgIdx} className="rounded-2xl overflow-hidden shadow-xl flex-shrink-0"
              style={{ width: 96, height: 128, transform: `rotate(${rotations[imgIdx]}deg)` }}>
              <img src={imgs[imgIdx]} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function SimpleDemo() {
  const [, navigate] = useLocation()
  const [attemptsRemaining, setAttemptsRemaining] = useState(DAILY_LIMIT)
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeNav, setActiveNav] = useState<NavItem>("inicio")
  const [myCreations, setMyCreations] = useState<GeneratedResult[]>([])
  const [fingerprint, setFingerprint] = useState("")
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  /* ── modal states ── */
  const [showModal, setShowModal] = useState<"input" | "generating" | "result" | "exhausted" | null>(null)
  const [pulses, setPulses] = useState<number[]>([])
  const [currentPulseInput, setCurrentPulseInput] = useState("")
  const [generationProgress, setGenerationProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fp = generateFingerprint(); setFingerprint(fp)
    checkUsage(fp).then(r => { setAttemptsRemaining(r); if (r <= 0) setShowModal("exhausted"); setIsLoaded(true) })
    if (!localStorage.getItem("noosfera_demo_disclaimer")) setShowDisclaimer(true)
  }, [])

  const acceptDisclaimer = () => { localStorage.setItem("noosfera_demo_disclaimer", "1"); setShowDisclaimer(false) }

  const handlePulseInputChange = (v: string) => {
    const n = v.replace(/[^0-9]/g, "")
    if (n === "" || parseInt(n) <= 200) setCurrentPulseInput(n)
  }

  const addPulse = useCallback(() => {
    const num = parseInt(currentPulseInput)
    if (num >= 40 && num <= 200 && pulses.length < 8) { setPulses(p => [...p, num]); setCurrentPulseInput(""); inputRef.current?.focus() }
  }, [currentPulseInput, pulses])

  const removePulse = (i: number) => setPulses(pulses.filter((_, j) => j !== i))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") { e.preventDefault(); addPulse() }
    else if (e.key === "Backspace" && currentPulseInput === "" && pulses.length > 0) removePulse(pulses.length - 1)
  }

  const openInput = () => {
    if (attemptsRemaining <= 0) { setShowModal("exhausted"); return }
    setPulses([]); setCurrentPulseInput(""); setGeneratedResult(null); setShowModal("input")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const generateImage = async () => {
    if (pulses.length === 0 || attemptsRemaining <= 0) return
    const usage = await consumeUsage(fingerprint)
    if (usage.blocked) { setAttemptsRemaining(0); setShowModal("exhausted"); return }
    setAttemptsRemaining(usage.remaining)
    setShowModal("generating"); setGenerationProgress(0)
    const iv = setInterval(() => setGenerationProgress(p => p >= 100 ? (clearInterval(iv), 100) : p + 3), 90)
    const style = artStyles[Math.floor(Math.random() * artStyles.length)]
    const tokenId = Math.abs((Date.now() ^ (Math.random() * 0xffffff | 0))).toString(16).toUpperCase().padStart(8, "0")
    const prompt = AI_PROMPTS[Math.floor(Math.random() * AI_PROMPTS.length)]
    let imageUrl = ""
    try {
      const r = await fetch("/api/generate-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pulses, style: style.name, prompt }) })
      imageUrl = r.ok ? (await r.json()).imageUrl : generateCanvasArt(pulses)
    } catch { imageUrl = generateCanvasArt(pulses) }
    clearInterval(iv); setGenerationProgress(100)
    const avg = pulses.reduce((a, b) => a + b, 0) / pulses.length
    const result: GeneratedResult = {
      imageUrl, title: style.name, emotionalState: style.emotion,
      energyLevel: Math.min(100, Math.round((avg / 180) * 100)),
      coherenceLevel: Math.round(70 + Math.random() * 25),
      pulses: [...pulses], tokenId,
    }
    setGeneratedResult(result); setMyCreations(p => [result, ...p.slice(0, 7)])
    setShowModal(usage.remaining <= 0 ? "exhausted" : "result")
  }

  const handleDownload = async () => {
    if (!generatedResult) return
    const wm = await addWatermark(generatedResult.imageUrl, generatedResult.tokenId)
    const a = document.createElement("a"); a.href = wm; a.download = `noosfera-demo-${generatedResult.tokenId}.png`; a.click()
  }

  const closeModal = () => { setShowModal(null); setPulses([]); setCurrentPulseInput("") }

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-7 h-7 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  )

  /* ── font ── */
  const font = { fontFamily: "'DM Sans', sans-serif" }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={font}>

      {/* ── DISCLAIMER ── */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {}} />
            <motion.div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 z-10"
              initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }} style={font}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#f5f3ff" }}>
                <Heart className="h-6 w-6" style={{ color: "#7c3aed" }} />
              </div>
              <h2 className="text-lg font-black text-gray-900 text-center mb-1" style={font}>Bienvenido al Demo</h2>
              <p className="text-sm text-gray-500 text-center mb-4">Antes de comenzar, ten en cuenta:</p>
              <div className="space-y-2.5 mb-6">
                {[
                  "Los datos del demo no son persistentes y se perderán al reiniciar el navegador.",
                  `Dispones de ${DAILY_LIMIT} generaciones. Una vez agotadas debes crear una cuenta.`,
                  "Las imágenes descargadas incluyen marca de agua de Noosfera.",
                  "El uso se registra por dispositivo, incluso en modo incógnito.",
                ].map((t, i) => (
                  <div key={i} className="flex gap-2.5 text-sm text-gray-600">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: "#f5f3ff" }}>
                      <Check className="h-2.5 w-2.5" style={{ color: "#7c3aed" }} />
                    </div>
                    {t}
                  </div>
                ))}
              </div>
              <button onClick={acceptDisclaimer}
                className="w-full py-3.5 rounded-2xl font-black text-white text-sm tracking-wide hover:opacity-90 transition-all"
                style={{ backgroundColor: "#7c3aed", ...font }}>
                Entendido — Comenzar
              </button>
              <p className="text-center text-xs text-gray-400 mt-2.5">
                Al continuar aceptas nuestros <a href="/terms" className="underline">términos de uso</a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL OVERLAY (input / generating / result / exhausted) ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={showModal === "input" ? closeModal : undefined} />
            <motion.div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10"
              initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 10 }}
              style={font}>

              {/* ── INPUT ── */}
              {showModal === "input" && (
                <div className="p-8">
                  <button onClick={closeModal} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#f5f3ff" }}>
                    <Heart className="h-6 w-6" style={{ color: "#7c3aed" }} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 text-center mb-1" style={font}>Ingresa tus Pulsos</h2>
                  <p className="text-sm text-gray-400 text-center mb-6">Valores entre 40–200 BPM · Enter para agregar</p>
                  <div className="min-h-[52px] p-3 border-2 border-gray-200 rounded-2xl bg-gray-50 focus-within:border-purple-400 focus-within:bg-white transition-all cursor-text mb-4"
                    onClick={() => inputRef.current?.focus()}>
                    <div className="flex flex-wrap items-center gap-2">
                      {pulses.map((p, i) => (
                        <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold"
                          style={{ backgroundColor: "#f5f3ff", color: "#7c3aed", ...font }}>
                          {p} <span className="text-xs font-medium opacity-60">BPM</span>
                          <button onClick={e => { e.stopPropagation(); removePulse(i) }} className="hover:opacity-80 p-0.5">
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
                          className="flex-1 min-w-[80px] outline-none bg-transparent text-gray-700 placeholder:text-gray-400 text-sm"
                          style={font} />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mb-5">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full transition-all"
                        style={{ backgroundColor: i < pulses.length ? "#7c3aed" : "#e5e7eb" }} />
                    ))}
                    <span className="text-xs text-gray-400 ml-2" style={font}>{pulses.length}/8</span>
                  </div>
                  <button onClick={generateImage} disabled={pulses.length === 0}
                    className="w-full py-4 rounded-2xl font-black text-white text-sm tracking-wide transition-all disabled:opacity-35 flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#7c3aed", ...font }}>
                    <Sparkles className="h-4 w-4" />
                    Generar Mi Arte Biométrico
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2.5" style={font}>
                    {attemptsRemaining} generación{attemptsRemaining !== 1 ? "es" : ""} disponible{attemptsRemaining !== 1 ? "s" : ""}
                  </p>
                </div>
              )}

              {/* ── GENERATING ── */}
              {showModal === "generating" && (
                <div className="p-8 text-center">
                  <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
                    style={{ backgroundColor: "#7c3aed" }}>
                    <Heart className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-black text-gray-900 mb-1" style={font}>Creando tu obra</h3>
                  <p className="text-sm text-gray-400 mb-6" style={font}>Transformando tus pulsos en arte único</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${generationProgress}%`, backgroundColor: "#7c3aed" }} />
                  </div>
                  <p className="text-xs text-gray-400 mb-5" style={font}>{generationProgress}%</p>
                  <div className="space-y-2">
                    {["Analizando patrones de pulso...", "Generando prompt biométrico...", "Renderizando con IA..."].map((msg, i) => (
                      <div key={i} className="text-xs text-gray-400 flex items-center gap-2 justify-center"
                        style={{ opacity: generationProgress > i * 33 ? 1 : 0.3, ...font }}>
                        {generationProgress > i * 33 + 10
                          ? <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                          : <div className="w-3 h-3 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin flex-shrink-0" />}
                        {msg}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── RESULT ── */}
              {(showModal === "result" || (showModal === "exhausted" && generatedResult)) && generatedResult && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-black text-gray-900 text-lg" style={font}>{generatedResult.title}</h2>
                      <p className="text-sm text-gray-400" style={font}>{generatedResult.emotionalState}</p>
                    </div>
                    {showModal === "result" && (
                      <button onClick={openInput}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 border border-gray-200 transition-all"
                        style={{ color: "#7c3aed", ...font }}>
                        <RefreshCw className="h-3.5 w-3.5" />
                        Nueva
                      </button>
                    )}
                    <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="rounded-2xl overflow-hidden shadow-lg mb-4 relative border border-gray-100">
                    <img src={generatedResult.imageUrl} alt={generatedResult.title}
                      className="w-full object-cover" style={{ maxHeight: "300px" }} />
                    <div className="absolute bottom-0 left-0 right-0 py-2 px-3 flex items-center justify-between"
                      style={{ backgroundColor: "rgba(124, 58, 237, 0.68)" }}>
                      <span className="text-white text-xs font-bold" style={font}>© Noosfera Demo</span>
                      <span className="text-white/80 text-[10px] font-mono">Token: {generatedResult.tokenId}</span>
                    </div>
                  </div>

                  <div className="rounded-xl p-3 border mb-3"
                    style={{ backgroundColor: "#faf5ff", borderColor: "#e9d5ff" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#7c3aed", ...font }}>Token de Autenticidad</p>
                        <p className="font-mono font-black text-gray-900 text-sm tracking-wider">{generatedResult.tokenId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400" style={font}>Estándar NFT</p>
                        <p className="text-xs font-bold" style={{ color: "#7c3aed", ...font }}>ERC-721 · Polygon</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[{ label: "Energía", v: generatedResult.energyLevel }, { label: "Coherencia", v: generatedResult.coherenceLevel }].map(m => (
                      <div key={m.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-gray-400" style={font}>{m.label}</span>
                          <span className="font-black text-base" style={{ color: "#7c3aed", ...font }}>{m.v}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${m.v}%`, backgroundColor: "#7c3aed" }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2.5">
                    <button onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
                      style={{ backgroundColor: "#7c3aed", ...font }}>
                      <Download className="h-4 w-4" />
                      Descargar
                    </button>
                    <button onClick={() => navigate("/auth/register")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm border-2 hover:bg-gray-50 transition-all"
                      style={{ borderColor: "#7c3aed", color: "#7c3aed", ...font }}>
                      <Sparkles className="h-4 w-4" />
                      Mintear NFT
                    </button>
                  </div>

                  {showModal === "exhausted" && (
                    <div className="mt-3 p-3 rounded-xl text-center"
                      style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a" }}>
                      <p className="text-sm font-bold text-amber-700" style={font}>Has agotado tus {DAILY_LIMIT} generaciones</p>
                      <a href="/auth/register" className="text-xs text-amber-600 underline font-semibold" style={font}>
                        Crea una cuenta gratis para continuar
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* ── EXHAUSTED (sin resultado) ── */}
              {showModal === "exhausted" && !generatedResult && (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#fef3c7" }}>
                    <Heart className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="font-black text-gray-900 text-lg mb-1" style={font}>Límite alcanzado</h3>
                  <p className="text-sm text-gray-400 mb-5" style={font}>Has usado tus {DAILY_LIMIT} generaciones del demo.</p>
                  <button onClick={() => navigate("/auth/register")}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-white"
                    style={{ backgroundColor: "#7c3aed", ...font }}>
                    Crear Cuenta Gratis
                  </button>
                  <button onClick={closeModal} className="mt-2 text-sm text-gray-400 hover:text-gray-600 transition-colors" style={font}>
                    Cerrar
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }} animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }}
            className="flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden"
            style={{ minHeight: "100vh" }}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 flex-shrink-0" style={{ color: "#7c3aed" }} />
                <span className="font-black text-gray-900 text-base tracking-tight" style={font}>Noosfera Demo</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-100 text-gray-400 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-2" style={font}>Navegar</p>
              {([
                { id: "inicio" as NavItem, icon: Home, label: "Inicio" },
                { id: "comunidad" as NavItem, icon: Users, label: "Comunidad" },
              ] as const).map(item => (
                <button key={item.id} onClick={() => setActiveNav(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ ...(activeNav === item.id ? { backgroundColor: "#f5f3ff", color: "#7c3aed" } : { color: "#6b7280" }), ...font }}>
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </button>
              ))}
              <div className="pt-1">
                <button onClick={() => navigate("/")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all"
                  style={font}>
                  <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                  Volver al Inicio
                </button>
              </div>
            </nav>
            <div className="px-3 pb-4">
              <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-1" style={font}>Plan de prueba</p>
                <p className="font-black text-sm mb-1" style={font}>Crea Tu Cuenta</p>
                <p className="text-xs text-purple-200 mb-3" style={font}>Desbloquea acceso completo</p>
                {["Uso Gratuito", "Derechos Comerciales", "Sin Marca de Agua"].map(f => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-purple-100 mb-1" style={font}>
                    <Check className="h-3 w-3 flex-shrink-0" /> {f}
                  </div>
                ))}
                <button onClick={() => navigate("/auth/register")}
                  className="w-full mt-3 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#ffffff", color: "#7c3aed", ...font }}>
                  Comenzar Gratis
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <>
                <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" style={{ color: "#7c3aed" }} />
                  <span className="font-black text-gray-900 text-sm" style={font}>Noosfera Demo</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{ backgroundColor: attemptsRemaining > 0 ? "#fef3c7" : "#fee2e2", color: attemptsRemaining > 0 ? "#92400e" : "#991b1b" }}>
            <span className="font-bold" style={font}>Plan de prueba</span>
            <div className="flex gap-1">
              {[...Array(DAILY_LIMIT)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i < attemptsRemaining ? "#7c3aed" : "#e5e7eb" }} />
              ))}
            </div>
            <span style={font}>{attemptsRemaining} rest.</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {/* ── HOME VIEW ── */}
          {activeNav === "inicio" && (
            <div>
              {/* Hero banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50/30" style={{ minHeight: "290px" }}>
                <HeroSidePanel side="left" />
                <HeroSidePanel side="right" />
                <div className="relative z-10 flex flex-col items-center justify-center text-center py-14 px-56">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight" style={font}>
                    Transforma tus <span style={{ color: "#7c3aed" }}>latidos</span> en arte
                  </h1>
                  <p className="text-sm text-gray-500 mb-6 max-w-xs" style={font}>
                    Ingresa tus pulsos cardíacos y nuestra IA los convierte en una obra digital única
                  </p>
                  <button onClick={openInput}
                    className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white hover:opacity-90 transition-all shadow-md"
                    style={{ backgroundColor: "#7c3aed", ...font }}>
                    Ingresar Pulsos
                  </button>
                </div>
              </div>

              {/* My creations (if any) */}
              {myCreations.length > 0 && (
                <div className="px-6 pt-5 pb-2">
                  <h3 className="font-black text-gray-800 text-sm mb-3" style={font}>Mis generaciones</h3>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {myCreations.map((c, i) => (
                      <div key={i} className="flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer"
                        onClick={() => { setGeneratedResult(c); setShowModal("result") }}>
                        <img src={c.imageUrl} alt={c.title} className="w-20 h-20 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Community gallery */}
              <div className="px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-black text-gray-900 text-base" style={font}>Lo que nuestra comunidad ha creado</h2>
                    <p className="text-xs text-gray-400 mt-0.5" style={font}>Arte biométrico generado por miembros de Noosfera</p>
                  </div>
                  <button className="text-sm font-semibold flex items-center gap-0.5" style={{ color: "#7c3aed", ...font }}>
                    Ver todo <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {COMMUNITY_IMAGES.map((img, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="rounded-2xl overflow-hidden cursor-pointer group relative"
                      onClick={openInput}>
                      <img src={img.src} alt={img.label} className="w-full object-cover" style={{ height: "130px" }} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all rounded-2xl" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-[11px] font-bold truncate" style={font}>{img.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── COMUNIDAD VIEW ── */}
          {activeNav === "comunidad" && (
            <div className="px-6 py-6">
              <h2 className="font-black text-gray-900 text-xl mb-1" style={font}>Comunidad Noosfera</h2>
              <p className="text-sm text-gray-400 mb-6" style={font}>Arte biométrico generado por nuestra comunidad global</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {COMMUNITY_IMAGES.map((img, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <img src={img.src} alt={img.label} className="w-full object-cover" style={{ height: "160px" }} />
                    <div className="p-3 bg-white">
                      <p className="font-bold text-gray-900 text-sm truncate" style={font}>{img.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
