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
  description?: string
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
  "/images/hero-inca.png",
  "/images/hero-6.png",
  "/images/hero-dragon.png",
  "/images/hero-gorilla.png",
]

/* ── Community gallery ── */
const COMMUNITY_IMAGES = [
  { src: "/images/community-1.png", label: "Tiempo Disuelto" },
  { src: "/images/community-roman-city.png", label: "Ciudad Romana" },
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

const RESET_KEY = (fp: string) => `nfp_reset_${fp}`
const USED_KEY  = (fp: string) => `nfp_${fp}`

function localResetAt(fp: string): number | null {
  const v = localStorage.getItem(RESET_KEY(fp)); return v ? parseInt(v) : null
}
function isLocallyExpired(fp: string): boolean {
  const ra = localResetAt(fp); return ra != null && Date.now() >= ra
}
function storeUsage(fp: string, used: number, resetAt: number | null) {
  localStorage.setItem(USED_KEY(fp), String(used))
  if (resetAt) localStorage.setItem(RESET_KEY(fp), String(resetAt))
}

async function checkUsage(fp: string): Promise<{ remaining: number; resetAt: number | null }> {
  if (isLocallyExpired(fp)) {
    localStorage.removeItem(USED_KEY(fp)); localStorage.removeItem(RESET_KEY(fp))
  }
  try {
    const r = await fetch("/api/demo/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fingerprint: fp }) })
    if (r.ok) {
      const d = await r.json()
      if (d.resetAt) storeUsage(fp, d.used, d.resetAt)
      return { remaining: d.remaining as number, resetAt: d.resetAt ?? localResetAt(fp) }
    }
  } catch {}
  const used = parseInt(localStorage.getItem(USED_KEY(fp)) ?? "0")
  return { remaining: Math.max(0, DAILY_LIMIT - used), resetAt: localResetAt(fp) }
}

async function consumeUsage(fp: string): Promise<{ remaining: number; blocked: boolean; resetAt: number | null }> {
  try {
    const r = await fetch("/api/demo/use", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fingerprint: fp }) })
    if (r.ok) {
      const d = await r.json()
      storeUsage(fp, d.used, d.resetAt)
      return { remaining: d.remaining, blocked: d.blocked, resetAt: d.resetAt ?? null }
    }
  } catch {}
  const used = parseInt(localStorage.getItem(USED_KEY(fp)) ?? "0")
  if (used >= DAILY_LIMIT) return { remaining: 0, blocked: true, resetAt: localResetAt(fp) }
  const resetAt = localResetAt(fp) ?? (Date.now() + 24 * 60 * 60 * 1000)
  storeUsage(fp, used + 1, resetAt)
  return { remaining: Math.max(0, DAILY_LIMIT - used - 1), blocked: false, resetAt }
}

function addWatermark(src: string, _tokenId: string): Promise<string> {
  return new Promise(resolve => {
    const img = new Image(); img.crossOrigin = "anonymous"
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = img.width || 600; c.height = img.height || 600
      const ctx = c.getContext("2d")!; ctx.drawImage(img, 0, 0)
      const sz = Math.max(28, c.width / 18)
      const cx = c.width - sz - 14, cy = c.height - sz - 14
      ctx.shadowColor = "rgba(0,0,0,0.45)"; ctx.shadowBlur = 8
      ctx.fillStyle = "rgba(255,255,255,0.88)"
      ctx.font = `bold ${sz}px Arial`
      ctx.textAlign = "center"; ctx.textBaseline = "middle"
      ctx.fillText("♥", cx, cy + 1)
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

/* ── Hero side panel — collage style, 4 images, no gaps ── */
function HeroSidePanel({ side }: { side: "left" | "right" }) {
  const imgs = side === "left"
    ? [HERO_IMAGES[0], HERO_IMAGES[6], HERO_IMAGES[2], HERO_IMAGES[1]]
    : [HERO_IMAGES[3], HERO_IMAGES[7], HERO_IMAGES[5], HERO_IMAGES[4]]
  return (
    <div className="absolute inset-y-0 pointer-events-none overflow-hidden flex"
      style={side === "left" ? { left: 0, width: 240 } : { right: 0, width: 240 }}>
      <div className="flex w-full">
        {[0, 1].map(col => (
          <div key={col} className="flex flex-col flex-1" style={{ marginTop: col === 1 ? -18 : 0 }}>
            {[imgs[col * 2], imgs[col * 2 + 1]].map((src, i) => (
              <div key={i} className="overflow-hidden flex-shrink-0" style={{ height: i === 0 ? 158 : 152 }}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ))}
      </div>
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
  const [tokenFirstView, setTokenFirstView] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)
  const [showMintModal, setShowMintModal] = useState(false)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [resetAt, setResetAt] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fp = generateFingerprint(); setFingerprint(fp)
    checkUsage(fp).then(r => {
      setAttemptsRemaining(r.remaining)
      if (r.resetAt) setResetAt(r.resetAt)
      if (r.remaining <= 0) setShowModal("exhausted")
      setIsLoaded(true)
    })
    if (!localStorage.getItem("noosfera_demo_disclaimer")) setShowDisclaimer(true)
  }, [])

  const acceptDisclaimer = () => { localStorage.setItem("noosfera_demo_disclaimer", "1"); setShowDisclaimer(false) }

  const handlePulseInputChange = (v: string) => {
    const n = v.replace(/[^0-9]/g, "")
    if (n === "" || parseInt(n) <= 200) setCurrentPulseInput(n)
  }

  const addPulse = useCallback(() => {
    const num = parseInt(currentPulseInput)
    if (num >= 40 && num <= 200 && pulses.length < 9) { setPulses(p => [...p, num]); setCurrentPulseInput(""); inputRef.current?.focus() }
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
    if (usage.resetAt) setResetAt(usage.resetAt)
    if (usage.blocked) { setAttemptsRemaining(0); setShowModal("exhausted"); return }
    setAttemptsRemaining(usage.remaining)
    setShowModal("generating"); setGenerationProgress(0)
    const iv = setInterval(() => setGenerationProgress(p => p >= 95 ? p : p + 1.8), 90)
    const style = artStyles[Math.floor(Math.random() * artStyles.length)]
    const tokenId = Math.abs((Date.now() ^ (Math.random() * 0xffffff | 0))).toString(16).toUpperCase().padStart(8, "0")
    const prompt = AI_PROMPTS[Math.floor(Math.random() * AI_PROMPTS.length)]

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 50000)

    const [imageData, descData] = await Promise.allSettled([
      fetch("/api/generate-image", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pulses, style: style.name, prompt }),
        signal: controller.signal,
      }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/noosfera/generate-description", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pulses, emotionalState: style.emotion, title: style.name }),
      }).then(r => r.ok ? r.json() : null).catch(() => null),
    ])

    clearTimeout(timeoutId)
    clearInterval(iv); setGenerationProgress(100)

    const imageUrl = (imageData.status === "fulfilled" && imageData.value?.imageUrl)
      ? imageData.value.imageUrl : generateCanvasArt(pulses)
    const description = (descData.status === "fulfilled" && descData.value?.description)
      ? descData.value.description : ""

    const avg = pulses.reduce((a, b) => a + b, 0) / pulses.length
    const result: GeneratedResult = {
      imageUrl, title: style.name, emotionalState: style.emotion,
      energyLevel: Math.min(100, Math.round((avg / 180) * 100)),
      coherenceLevel: Math.round(70 + Math.random() * 25),
      pulses: [...pulses], tokenId, description,
    }
    setGeneratedResult(result); setMyCreations(p => [result, ...p.slice(0, 7)])
    setTokenFirstView(true); setCopiedToken(false)
    setShowModal(usage.remaining <= 0 ? "exhausted" : "result")
  }

  const handleDownload = async () => {
    if (!generatedResult) return
    const wm = await addWatermark(generatedResult.imageUrl, generatedResult.tokenId)
    const a = document.createElement("a"); a.href = wm; a.download = `noosfera-demo-${generatedResult.tokenId}.png`; a.click()
  }

  const closeModal = () => {
    setShowModal(null); setPulses([]); setCurrentPulseInput("")
    setTokenFirstView(false); setCopiedToken(false)
  }

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-7 h-7 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  )

  /* ── font ── */
  const font = { fontFamily: "'DM Sans', sans-serif" }

  return (
    <div className="flex h-screen overflow-hidden bg-white" style={font}>

      {/* ── DISCLAIMER ── */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {}} />
            <motion.div
              className="relative bg-white rounded-3xl max-w-xs w-full z-10 overflow-hidden"
              style={{ border: "2px solid #7c3aed", ...font }}
              initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }}>

              {/* Hero image with title overlay */}
              <div style={{ position: "relative", height: 88, flexShrink: 0 }}>
                <img
                  src="/images/hero-3.png"
                  alt="Noosfera Demo"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(20,5,40,0.78) 100%)"
                }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 17,
                    color: "#fff", letterSpacing: "-0.3px", textAlign: "center",
                    textShadow: "0 2px 20px rgba(124,58,237,0.9), 0 2px 12px rgba(0,0,0,0.6)"
                  }}>
                    Bienvenido al Demo
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-xs text-gray-500 text-center mb-3">Antes de comenzar, ten en cuenta:</p>
                <div className="space-y-2 mb-5">
                  {[
                    "Los datos del demo no son persistentes y se perderán al reiniciar el navegador.",
                    `Dispones de ${DAILY_LIMIT} generaciones. Una vez agotadas debes crear una cuenta.`,
                    "Las imágenes descargadas incluyen marca de agua de Noosfera.",
                    "El uso se registra por dispositivo, incluso en modo incógnito.",
                  ].map((t, i) => (
                    <div key={i} className="flex gap-2 text-xs text-gray-600">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: "#f5f3ff" }}>
                        <Check className="h-2.5 w-2.5" style={{ color: "#7c3aed" }} />
                      </div>
                      {t}
                    </div>
                  ))}
                </div>
                <button onClick={acceptDisclaimer}
                  className="w-full py-3 rounded-2xl font-black text-white text-sm tracking-wide hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#7c3aed", ...font }}>
                  Aceptar
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">
                  Al continuar aceptas nuestros <a href="/terms" className="underline">términos de uso</a>
                </p>
              </div>
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
            <motion.div className="relative bg-white rounded-3xl w-full max-w-sm z-10 overflow-hidden"
              style={{ border: "2px solid #7c3aed" }}
              initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 10 }}>

              {/* ── INPUT ── */}
              {showModal === "input" && (
                <>
                  {/* Hero image */}
                  <div style={{ position: "relative", height: 80, flexShrink: 0 }}>
                    <img src="/images/hero-2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(20,5,40,0.72) 100%)" }} />
                    <button onClick={closeModal} className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/30 text-white hover:bg-black/50 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 16, color: "#fff", textShadow: "0 2px 20px rgba(124,58,237,0.9), 0 2px 12px rgba(0,0,0,0.6)" }}>
                        Ingresa tus Pulsos
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-400 text-center mb-3" style={font}>Valores entre 40–200 BPM · Enter para agregar</p>
                    {/* Pulse chips input */}
                    <div className="rounded-2xl mb-3 overflow-hidden" style={{ border: "2px solid #e9d5ff", background: "#faf5ff" }}>
                      <div className="p-3 cursor-text min-h-[56px]" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "6px" }}
                        onClick={() => inputRef.current?.focus()}>
                        {pulses.map((p, i) => {
                          const hues = ["#6d28d9","#7c3aed","#8b5cf6","#5b21b6","#7e22ce"]
                          const bg = hues[i % hues.length]
                          const rotations = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 0.5]
                          const pads = ["px-3 py-1","px-2.5 py-1.5","px-3 py-0.5","px-2 py-1","px-3.5 py-1"]
                          return (
                            <motion.div key={i}
                              initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: rotations[i % rotations.length] }}
                              transition={{ type: "spring", stiffness: 380, damping: 18 }}
                              className={`inline-flex items-center gap-1 rounded-full text-xs font-bold ${pads[i % pads.length]}`}
                              style={{ backgroundColor: bg, color: "#fff", ...font }}>
                              {p} <span className="opacity-60 text-[10px]">BPM</span>
                              <button onClick={e => { e.stopPropagation(); removePulse(i) }} className="hover:opacity-70 ml-0.5">
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </motion.div>
                          )
                        })}
                        {pulses.length < 9 && (
                          <input ref={inputRef} type="text" inputMode="numeric"
                            placeholder={pulses.length === 0 ? "Ej: 72, 65, 80..." : `Pulso ${pulses.length + 1}`}
                            value={currentPulseInput}
                            onChange={e => handlePulseInputChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={() => { if (currentPulseInput) addPulse() }}
                            className="flex-1 min-w-[80px] outline-none bg-transparent text-gray-700 placeholder:text-purple-300 text-sm"
                            style={font} />
                        )}
                      </div>
                      <div className="flex items-center gap-1 px-3 pb-2.5">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="flex-1 h-1 rounded-full transition-all"
                            style={{ backgroundColor: i < pulses.length ? "#7c3aed" : "#e9d5ff" }} />
                        ))}
                        <span className="text-[10px] text-purple-400 ml-1.5 font-bold" style={font}>{pulses.length}/9</span>
                      </div>
                    </div>
                    <button onClick={generateImage} disabled={pulses.length === 0}
                      className="w-full py-3 rounded-2xl font-black text-white text-sm tracking-wide transition-all disabled:opacity-35 flex items-center justify-center gap-2"
                      style={{ backgroundColor: "#7c3aed", ...font }}>
                      <Sparkles className="h-4 w-4" />
                      Crear Imagen
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2" style={font}>
                      {attemptsRemaining} generación{attemptsRemaining !== 1 ? "es" : ""} disponible{attemptsRemaining !== 1 ? "s" : ""}
                    </p>
                  </div>
                </>
              )}

              {/* ── GENERATING ── */}
              {showModal === "generating" && (
                <>
                  {/* Hero image */}
                  <div style={{ position: "relative", height: 80, flexShrink: 0 }}>
                    <img src="/images/hero-5.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(20,5,40,0.75) 100%)" }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 16, color: "#fff", textShadow: "0 2px 20px rgba(124,58,237,0.9), 0 2px 12px rgba(0,0,0,0.6)" }}>
                        Creando tu obra
                      </span>
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <p className="text-xs text-gray-400 mb-4" style={font}>Transformando tus pulsos en arte único</p>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${generationProgress}%`, backgroundColor: "#7c3aed" }} />
                    </div>
                    <p className="text-xs text-gray-400 mb-4" style={font}>{Math.round(generationProgress)}%</p>
                    <div className="space-y-1.5">
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
                </>
              )}

              {/* ── RESULT ── */}
              {(showModal === "result" || (showModal === "exhausted" && generatedResult)) && generatedResult && (
                <div>
                  {/* Image — heart watermark, no circle */}
                  <div className="relative overflow-hidden" style={{ borderRadius: "22px 22px 0 0" }}>
                    <img src={generatedResult.imageUrl} alt="Arte generado"
                      className="w-full object-cover block" style={{ maxHeight: "270px" }} />
                    <div className="absolute bottom-2.5 right-3" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)", fontSize: 20, lineHeight: 1 }}>
                      🤍
                    </div>
                    <button onClick={closeModal}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/40 text-white hover:bg-black/60 transition-colors"
                      style={{ zIndex: 50 }}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    {/* AI description — always show; fallback to emotionalState if empty */}
                    <p className="text-xs text-gray-500 italic text-center mb-3 leading-relaxed px-1" style={font}>
                      {generatedResult.description
                        ? `La imagen generada representa ${generatedResult.description}.`
                        : `La imagen generada representa una obra única nacida de tus latidos — ${generatedResult.emotionalState.toLowerCase()}.`}
                    </p>

                    {/* Token — ONLY visible on first view; hidden completely when revisiting */}
                    {tokenFirstView && (
                      <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: "#faf5ff", border: "1.5px solid #e9d5ff" }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7c3aed", ...font }}>
                            Token de Autenticidad
                          </p>
                          <button onClick={() => setShowTokenModal(true)}
                            className="text-[10px] font-semibold underline decoration-dotted" style={{ color: "#7c3aed" }}>
                            ¿Qué es esto?
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-mono font-black text-gray-900 text-sm tracking-wider flex-1">
                            {generatedResult.tokenId}
                          </p>
                          <button
                            onClick={() => { navigator.clipboard.writeText(generatedResult.tokenId); setCopiedToken(true) }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                            style={{ backgroundColor: copiedToken ? "#d1fae5" : "#ede9fe", color: copiedToken ? "#065f46" : "#7c3aed", ...font }}>
                            {copiedToken ? "✓ Copiado" : "Copiar"}
                          </button>
                        </div>
                        <p className="text-[10px] text-amber-600 font-semibold" style={font}>
                          ⚠ Visible solo esta vez — guárdalo antes de cerrar
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 text-right" style={font}>ERC-721 · Polygon</p>
                      </div>
                    )}

                    {/* 3 buttons — text only, no background */}
                    <div className="grid grid-cols-3 gap-1 pt-1">
                      <button onClick={openInput}
                        className="flex flex-col items-center justify-center gap-1.5 py-3 font-bold text-xs transition-all hover:opacity-70"
                        style={{ color: "#7c3aed", background: "none", border: "none", ...font }}>
                        <RefreshCw className="h-4 w-4" />
                        Nueva
                      </button>
                      <button onClick={handleDownload}
                        className="flex flex-col items-center justify-center gap-1.5 py-3 font-black text-xs transition-all hover:opacity-80"
                        style={{ color: "#7c3aed", background: "none", border: "none", ...font }}>
                        <Download className="h-4 w-4" />
                        Descargar
                      </button>
                      <button onClick={() => setShowMintModal(true)}
                        className="flex flex-col items-center justify-center gap-1.5 py-3 font-bold text-xs transition-all hover:opacity-70"
                        style={{ color: "#7c3aed", background: "none", border: "none", ...font }}>
                        <Sparkles className="h-4 w-4" />
                        Mintear
                      </button>
                    </div>

                    {showModal === "exhausted" && (
                      <div className="mt-3 p-3 rounded-xl text-center" style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a" }}>
                        <p className="text-xs font-bold text-amber-700 mb-0.5" style={font}>Has agotado tus {DAILY_LIMIT} generaciones</p>
                        {resetAt && (
                          <p className="text-xs text-amber-600 font-semibold mb-1" style={font}>
                            Tu plan se restablece mañana a las {new Date(resetAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                        <a href="/auth/register" className="text-xs text-amber-600 underline font-semibold" style={font}>
                          Crea una cuenta gratis para continuar
                        </a>
                      </div>
                    )}
                  </div>
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
                  <p className="text-sm text-gray-400 mb-2" style={font}>Has usado tus {DAILY_LIMIT} generaciones del demo.</p>
                  {resetAt && (
                    <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a" }}>
                      <p className="text-sm font-bold text-amber-700" style={font}>
                        Tu plan se restablece mañana a las {new Date(resetAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-xs text-amber-600 mt-0.5" style={font}>
                        El sistema recuerda tu uso aunque cambies de navegador
                      </p>
                    </div>
                  )}
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

      {/* ── MINT MODAL ── */}
      <AnimatePresence>
        {showMintModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMintModal(false)} />
            <motion.div className="relative bg-white rounded-3xl max-w-xs w-full z-10 overflow-hidden"
              style={{ border: "2px solid #7c3aed" }}
              initial={{ scale: 0.9, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}>
              <div style={{ position: "relative", height: 72 }}>
                <img src="/images/hero-4.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(20,5,40,0.78))" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 15, color: "#fff", textShadow: "0 2px 16px rgba(124,58,237,0.9)" }}>
                    ¿Qué es Mintear un NFT?
                  </span>
                </div>
              </div>
              <div className="p-5" style={font}>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  <strong>Mintear</strong> significa registrar tu obra de arte en la blockchain de <strong>Polygon</strong>, convirtiéndola en un NFT (Token No Fungible).
                </p>
                <div className="space-y-2 mb-4">
                  {[
                    "Tu arte queda registrado de forma permanente e inmutable",
                    "Demuestras ser el creador original con prueba criptográfica",
                    "Puedes venderlo o transferirlo en mercados NFT",
                    "Requiere crear una cuenta completa de Noosfera",
                  ].map((t, i) => (
                    <div key={i} className="flex gap-2 text-xs text-gray-600">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#f5f3ff" }}>
                        <Check className="h-2.5 w-2.5" style={{ color: "#7c3aed" }} />
                      </div>
                      {t}
                    </div>
                  ))}
                </div>
                <button onClick={() => { setShowMintModal(false); navigate("/auth/register") }}
                  className="w-full py-2.5 rounded-2xl font-black text-white text-sm hover:opacity-90 transition-all mb-2"
                  style={{ backgroundColor: "#7c3aed" }}>
                  Crear Cuenta y Mintear
                </button>
                <button onClick={() => setShowMintModal(false)}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOKEN MODAL ── */}
      <AnimatePresence>
        {showTokenModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTokenModal(false)} />
            <motion.div className="relative bg-white rounded-3xl max-w-xs w-full z-10 overflow-hidden"
              style={{ border: "2px solid #7c3aed" }}
              initial={{ scale: 0.9, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}>
              <div style={{ position: "relative", height: 72 }}>
                <img src="/images/hero-6.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(20,5,40,0.78))" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 15, color: "#fff", textShadow: "0 2px 16px rgba(124,58,237,0.9)" }}>
                    Token de Autenticidad
                  </span>
                </div>
              </div>
              <div className="p-5" style={font}>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  El <strong>Token de Autenticidad</strong> es un identificador único criptográfico que vincula tu imagen biométrica a su origen.
                </p>
                <div className="space-y-2 mb-4">
                  {[
                    "Generado a partir de tu sesión y tiempo de creación",
                    "Único e irrepetible para cada obra",
                    "Sirve como prueba de autoría antes del minteo",
                    "Solo visible una vez por seguridad — guárdalo bien",
                  ].map((t, i) => (
                    <div key={i} className="flex gap-2 text-xs text-gray-600">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#f5f3ff" }}>
                        <Check className="h-2.5 w-2.5" style={{ color: "#7c3aed" }} />
                      </div>
                      {t}
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowTokenModal(false)}
                  className="w-full py-2.5 rounded-2xl font-black text-white text-sm hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#7c3aed" }}>
                  Entendido
                </button>
              </div>
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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-white"
            style={{ backgroundColor: attemptsRemaining > 0 ? "#7c3aed" : "#991b1b" }}>
            <span className="font-bold" style={font}>Plan de prueba</span>
            <div className="flex gap-1">
              {[...Array(DAILY_LIMIT)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i < attemptsRemaining ? "#fff" : "rgba(255,255,255,0.3)" }} />
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
                  <button onClick={() => setActiveNav("comunidad")} className="text-sm font-semibold flex items-center gap-0.5" style={{ color: "#7c3aed", ...font }}>
                    Ver todo <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div style={{ columns: "3 120px", gap: "6px" }}>
                  {COMMUNITY_IMAGES.map((img, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-2xl overflow-hidden cursor-pointer group relative"
                      style={{ breakInside: "avoid", marginBottom: "6px", display: "block" }}
                      onClick={openInput}>
                      <img src={img.src} alt={img.label} className="w-full object-cover block"
                        style={{ height: i % 2 === 0 ? "160px" : "130px" }} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white text-[10px] font-bold truncate" style={font}>{img.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── COMUNIDAD VIEW ── */}
          {activeNav === "comunidad" && (
            <div className="px-5 py-6">
              <div className="text-center mb-6">
                <h2 className="font-black text-gray-900 text-xl" style={font}>Comunidad Noosfera</h2>
                <p className="text-sm text-gray-400 mt-1" style={font}>Arte biométrico generado por nuestra comunidad global</p>
              </div>
              <div style={{ columns: "2 160px", gap: "8px" }}>
                {COMMUNITY_IMAGES.map((img, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-2xl overflow-hidden cursor-pointer group relative"
                    style={{ breakInside: "avoid", marginBottom: "8px", display: "block" }}
                    onClick={openInput}>
                    <img src={img.src} alt={img.label} className="w-full object-cover block"
                      style={{ height: i % 3 === 0 ? "200px" : i % 3 === 1 ? "160px" : "180px" }} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all" />
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-xs font-bold text-center truncate" style={font}>{img.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
