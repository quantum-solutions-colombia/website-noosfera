import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain, Sparkles, RefreshCw, X, Check,
  Home, Users, ChevronLeft, ChevronRight, Download,
  ImageIcon, Settings, Crown, Share2, Heart, MessageCircle,
  CreditCard, Bell, Lock, Globe, Palette, Eye, EyeOff,
} from "lucide-react"
import { useLocation } from "wouter"
import { useAuth } from "@/contexts/auth-context"

type NavItem = "inicio" | "comunidad" | "galeria" | "ajustes"

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
  "/images/viking-warrior.png",
  "/images/hero-dragon.png",
  "/images/community-roman-city.png",
  "/images/pipeline-forest.png",
  "/images/hero-gorilla.png",
  "/images/nft-ghost.png",
  "/images/hero-maya.png",
  "/images/hero-inca.png",
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
  const { user, logout, completeTutorial } = useAuth()
  const isRealUser = !!(user && user.email !== "demo@noosfera.com")
  const effectiveLimit = isRealUser ? (user?.plan === "premium" ? 100 : 15) : DAILY_LIMIT
  const [attemptsRemaining, setAttemptsRemaining] = useState(effectiveLimit)
  const [tutorialStep, setTutorialStep] = useState(0)
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
  const [communityUploads, setCommunityUploads] = useState<GeneratedResult[]>([])
  const [communityLikes, setCommunityLikes] = useState<Record<string, number>>({})
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set())
  const [communityDetail, setCommunityDetail] = useState<{ src: string; label: string; likes: number } | null>(null)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<"standard" | "premium">("premium")
  const [cardData, setCardData] = useState({ name: "", number: "", expiry: "", cvv: "" })
  const [showCvv, setShowCvv] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [settingsTab, setSettingsTab] = useState<"cuenta" | "notificaciones" | "privacidad" | "seguridad">("cuenta")
  const [notifSettings, setNotifSettings] = useState({ email: true, push: false, weekly: true })
  const [privacySettings, setPrivacySettings] = useState({ publicProfile: true, showInCommunity: true })
  const inputRef = useRef<HTMLInputElement>(null)

  const getTimeGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return "Buenos días"
    if (h < 19) return "Buenas tardes"
    return "Buenas noches"
  }

  const uploadToCommunity = (result: GeneratedResult) => {
    setCommunityUploads(prev => {
      const alreadyUploaded = prev.some(r => r.tokenId === result.tokenId)
      if (alreadyUploaded) return prev
      return [result, ...prev]
    })
  }

  useEffect(() => {
    if (isRealUser && user) {
      // Real authenticated user: use user-ID based daily tracking
      const today = new Date().toDateString()
      const storageKey = `noosfera_daily_${user.id}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          const data = JSON.parse(stored)
          if (data.date === today) {
            const remaining = Math.max(0, effectiveLimit - data.used)
            setAttemptsRemaining(remaining)
            if (remaining <= 0) setShowModal("exhausted")
          } else {
            localStorage.setItem(storageKey, JSON.stringify({ date: today, used: 0 }))
            setAttemptsRemaining(effectiveLimit)
          }
        } catch {
          localStorage.setItem(storageKey, JSON.stringify({ date: today, used: 0 }))
          setAttemptsRemaining(effectiveLimit)
        }
      } else {
        localStorage.setItem(storageKey, JSON.stringify({ date: today, used: 0 }))
        setAttemptsRemaining(effectiveLimit)
      }
      setIsLoaded(true)
    } else {
      const fp = generateFingerprint(); setFingerprint(fp)
      const localReset = localResetAt(fp)
      if (localReset) setResetAt(localReset)
      checkUsage(fp).then(r => {
        setAttemptsRemaining(r.remaining)
        if (r.resetAt) setResetAt(r.resetAt)
        else if (localReset) setResetAt(localReset)
        if (r.remaining <= 0) setShowModal("exhausted")
        setIsLoaded(true)
      })
      if (!localStorage.getItem("noosfera_demo_disclaimer")) setShowDisclaimer(true)
    }
  }, [isRealUser, user?.id])

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

  const consumeRealUserUsage = () => {
    if (!user) return { remaining: 0, blocked: true }
    const today = new Date().toDateString()
    const storageKey = `noosfera_daily_${user.id}`
    const stored = localStorage.getItem(storageKey)
    let used = 0
    if (stored) {
      try { const d = JSON.parse(stored); if (d.date === today) used = d.used } catch {}
    }
    const newUsed = used + 1
    localStorage.setItem(storageKey, JSON.stringify({ date: today, used: newUsed }))
    const remaining = Math.max(0, effectiveLimit - newUsed)
    return { remaining, blocked: newUsed > effectiveLimit }
  }

  const generateImage = async () => {
    if (pulses.length === 0 || attemptsRemaining <= 0) return

    let newRemaining: number
    if (isRealUser) {
      const usage = consumeRealUserUsage()
      if (usage.blocked) { setAttemptsRemaining(0); setShowModal("exhausted"); return }
      newRemaining = usage.remaining
    } else {
      const usage = await consumeUsage(fingerprint)
      if (usage.resetAt) setResetAt(usage.resetAt)
      if (usage.blocked) { setAttemptsRemaining(0); setShowModal("exhausted"); return }
      newRemaining = usage.remaining
    }
    setAttemptsRemaining(newRemaining)
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
    setShowModal(newRemaining <= 0 ? "exhausted" : "result")
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

  const showTutorial = isRealUser && user?.preferences?.tutorialCompleted === false

  const handleTutorialNext = () => {
    if (tutorialStep < 3) {
      setTutorialStep(prev => prev + 1)
    } else {
      completeTutorial()
    }
  }

  const tutorialSteps = [
    {
      icon: "❤️",
      title: "Ingresa tus pulsos cardíacos",
      description: "Escribe cada lectura de tu frecuencia cardíaca (40–200 BPM). Puedes agregar hasta 9 valores para crear una obra más detallada.",
    },
    {
      icon: "✨",
      title: "La IA transforma tu ritmo en arte",
      description: "Nuestra inteligencia artificial convierte la energía única de tus latidos en una obra digital irrepetible.",
    },
    {
      icon: "🖼️",
      title: "Descarga y comparte tu obra",
      description: "Guarda tu arte en tu galería, descárgalo y compártelo. Tienes generaciones diarias disponibles según tu plan.",
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-white" style={font}>

      {/* ── TUTORIAL BIENVENIDA (solo usuarios reales nuevos) ── */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}>
            <motion.div
              key={tutorialStep}
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: -16 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl w-full max-w-xs overflow-hidden"
              style={{ border: "2px solid #7c3aed", ...font }}>

              {/* Hero image */}
              <div style={{ position: "relative", height: 88, flexShrink: 0 }}>
                <img src="/images/hero-3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(20,5,40,0.78) 100%)" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 17, color: "#fff", textShadow: "0 2px 20px rgba(124,58,237,0.9), 0 2px 12px rgba(0,0,0,0.6)" }}>
                    {tutorialStep === 0 ? `¡Hola, ${user?.name?.split(" ")[0]}! 👋` : tutorialSteps[tutorialStep - 1]?.icon + " " + tutorialSteps[tutorialStep - 1]?.title}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {tutorialStep === 0 ? (
                  <>
                    <p className="text-sm font-bold text-gray-900 text-center mb-2" style={font}>Bienvenido a Noösfera</p>
                    <p className="text-xs text-gray-500 text-center mb-4" style={font}>En menos de un minuto te mostramos todo lo que puedes crear aquí.</p>
                  </>
                ) : (
                  <p className="text-xs text-gray-600 text-center mb-4" style={font}>{tutorialSteps[tutorialStep - 1]?.description}</p>
                )}

                {/* Step dots */}
                <div className="flex justify-center gap-1.5 mb-4">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                      width: tutorialStep === i ? 18 : 6, height: 6, borderRadius: 3,
                      background: tutorialStep === i ? "#7c3aed" : "#e5e7eb",
                      transition: "all 0.3s ease",
                    }} />
                  ))}
                </div>

                <button onClick={handleTutorialNext}
                  className="w-full py-3 rounded-2xl font-black text-white text-sm tracking-wide hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#7c3aed", ...font }}>
                  {tutorialStep === 0 ? "Ver cómo funciona →" : tutorialStep < 3 ? "Continuar →" : "¡Empezar a crear!"}
                </button>
                <button onClick={() => completeTutorial()}
                  className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Saltar tutorial
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    <div className="grid grid-cols-4 gap-1 pt-1">
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
                      {isRealUser && generatedResult && (
                        <button onClick={() => { uploadToCommunity(generatedResult); closeModal() }}
                          className="flex flex-col items-center justify-center gap-1.5 py-3 font-bold text-xs transition-all hover:opacity-70"
                          style={{ color: communityUploads.some(r => r.tokenId === generatedResult.tokenId) ? "#059669" : "#7c3aed", background: "none", border: "none", ...font }}>
                          <Share2 className="h-4 w-4" />
                          {communityUploads.some(r => r.tokenId === generatedResult.tokenId) ? "Publicado" : "Comunidad"}
                        </button>
                      )}
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
                <div style={{ position: "relative", overflow: "hidden", borderRadius: "inherit" }}>
                  {/* Full background image */}
                  <img src="/images/hero-maya.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,2,25,0.45) 0%, rgba(10,2,25,0.82) 100%)" }} />

                  {/* X button */}
                  <button onClick={closeModal} style={{ position: "absolute", top: 10, right: 10, zIndex: 10, background: "rgba(0,0,0,0.35)", border: "none", borderRadius: 8, padding: "6px", color: "#fff", cursor: "pointer", lineHeight: 1 }}>
                    <X className="h-4 w-4" />
                  </button>

                  {/* Content */}
                  <div style={{ position: "relative", zIndex: 2, padding: "48px 24px 28px", textAlign: "center" }}>
                    <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 18, color: "#fff", marginBottom: 8, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
                      Límite alcanzado
                    </h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>
                      Has usado tus {DAILY_LIMIT} generaciones del plan de prueba.
                    </p>
                    {resetAt && (
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#fde68a", marginBottom: 20 }}>
                        Tu plan se restablece mañana a las {new Date(resetAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </p>
                    )}
                    <button onClick={() => navigate("/auth/register")}
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 14, color: "#fff", background: "none", border: "none", cursor: "pointer", width: "100%", padding: "10px 0", letterSpacing: 0.2 }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                      Crear Cuenta Gratis
                    </button>
                    <button onClick={closeModal}
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", marginTop: 4 }}>
                      Cerrar
                    </button>
                  </div>
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
                <Brain className="h-5 w-5 flex-shrink-0" style={{ color: "#7c3aed" }} />
                <span className="font-black text-gray-900 text-base tracking-tight" style={font}>
                  {isRealUser ? `Hola, ${user?.name?.split(" ")[0]}` : "Noosfera Demo"}
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-100 text-gray-400 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-2" style={font}>Principal</p>
              {([
                { id: "inicio" as NavItem, icon: Home, label: "Inicio" },
                { id: "galeria" as NavItem, icon: ImageIcon, label: "Galería" },
                { id: "comunidad" as NavItem, icon: Users, label: "Comunidad" },
              ] as const).map(item => (
                <button key={item.id} onClick={() => setActiveNav(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ ...(activeNav === item.id ? { backgroundColor: "#f5f3ff", color: "#7c3aed" } : { color: "#6b7280" }), ...font }}>
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </button>
              ))}
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-2" style={font}>Cuenta</p>
                <button onClick={() => setActiveNav("ajustes")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ ...(activeNav === "ajustes" ? { backgroundColor: "#f5f3ff", color: "#7c3aed" } : { color: "#6b7280" }), ...font }}>
                  <Settings className="h-4 w-4 flex-shrink-0" />
                  Ajustes
                </button>
              </div>
            </nav>
            <div className="px-3 pb-4">
              {isRealUser ? (
                <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {user?.plan === "premium" && <Crown className="h-3 w-3 text-amber-300" />}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200" style={font}>
                      {user?.plan === "premium" ? "Plan Premium" : "Plan Gratuito"}
                    </p>
                  </div>
                  <p className="text-xs text-purple-200 mb-3" style={font}>{user?.email}</p>
                  {user?.plan !== "premium" && (
                    <button onClick={() => setActiveNav("ajustes")}
                      className="w-full mb-2 py-1.5 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                      style={{ backgroundColor: "rgba(255,255,255,0.22)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", ...font }}>
                      ✦ Actualizar a Premium
                    </button>
                  )}
                  <button onClick={logout}
                    className="w-full py-1.5 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.2)", ...font }}>
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
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
              )}
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
                  <Brain className="h-5 w-5" style={{ color: "#7c3aed" }} />
                  <span className="font-black text-gray-900 text-sm" style={font}>Noösfera</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-white"
            style={{ backgroundColor: attemptsRemaining > 0 ? "#7c3aed" : "#991b1b" }}>
            <span className="font-bold" style={font}>
              {isRealUser ? (user?.plan === "premium" ? "Premium" : "Plan Free") : "Plan de prueba"}
            </span>
            <span className="font-mono font-bold tabular-nums" style={font}>
              {attemptsRemaining}/{effectiveLimit}
            </span>
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
                  {isRealUser ? (
                    <>
                      <p className="text-sm font-semibold mb-1" style={{ color: "#7c3aed", ...font }}>{getTimeGreeting()}, {user?.name?.split(" ")[0]}</p>
                      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight" style={font}>
                        ¡Qué genial tenerte de nuevo!
                      </h1>
                      <p className="text-sm text-gray-500 mb-6 max-w-xs" style={font}>
                        ¿Qué arte deseas hacer hoy?
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight" style={font}>
                        Transforma tus <span style={{ color: "#7c3aed" }}>latidos</span> en arte
                      </h1>
                      <p className="text-sm text-gray-500 mb-6 max-w-xs" style={font}>
                        Ingresa tus pulsos cardíacos y nuestra IA los convierte en una obra digital única
                      </p>
                    </>
                  )}
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

          {/* ── GALERÍA VIEW ── */}
          {activeNav === "galeria" && (
            <div className="px-5 py-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-black text-gray-900 text-xl" style={font}>Mi Galería</h2>
                  <p className="text-sm text-gray-400 mt-0.5" style={font}>{myCreations.length} obra{myCreations.length !== 1 ? "s" : ""} creada{myCreations.length !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={openInput}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#7c3aed", ...font }}>
                  <Sparkles className="h-4 w-4" />
                  Crear Nueva
                </button>
              </div>

              {myCreations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <h3 className="font-black text-gray-900 text-base mb-2" style={font}>Tu galería está vacía</h3>
                  <p className="text-sm text-gray-400 mb-5 max-w-xs" style={font}>Crea tu primera obra de arte a partir de tus latidos</p>
                  <button onClick={openInput}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#7c3aed", ...font }}>
                    Ingresar Pulsos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {myCreations.map((art, i) => {
                    const isUploaded = communityUploads.some(r => r.tokenId === art.tokenId)
                    return (
                      <motion.div key={art.tokenId || i}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm group relative"
                        style={{ backgroundColor: "#fff" }}>
                        <div className="relative cursor-pointer" onClick={() => { setGeneratedResult(art); setShowModal("result") }}>
                          <img src={art.imageUrl} alt={art.title} className="w-full object-cover block" style={{ height: "160px" }} />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                        </div>
                        <div className="p-3">
                          <p className="font-black text-gray-900 text-xs truncate mb-0.5" style={font}>{art.title}</p>
                          <p className="text-[10px] text-gray-400 truncate mb-2" style={font}>{art.pulses.join(", ")} BPM</p>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => { setGeneratedResult(art); handleDownload() }}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:opacity-80"
                              style={{ backgroundColor: "#f5f3ff", color: "#7c3aed", ...font }}>
                              <Download className="h-3 w-3" />
                              Descargar
                            </button>
                            {isRealUser && (
                              <button
                                onClick={() => uploadToCommunity(art)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:opacity-80"
                                style={{ backgroundColor: isUploaded ? "#d1fae5" : "#f5f3ff", color: isUploaded ? "#059669" : "#7c3aed", ...font }}>
                                <Share2 className="h-3 w-3" />
                                {isUploaded ? "Publicado" : "Comunidad"}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── AJUSTES VIEW ── */}
          {activeNav === "ajustes" && (
            <div className="px-5 py-6 max-w-lg mx-auto">
              <h2 className="font-black text-gray-900 text-xl mb-1" style={font}>Ajustes</h2>
              <p className="text-sm text-gray-400 mb-5" style={font}>Personaliza tu experiencia en Noosfera</p>

              {isRealUser ? (
                <>
                  {/* Tabs */}
                  <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ backgroundColor: "#f3f4f6" }}>
                    {([
                      { id: "cuenta", label: "Cuenta" },
                      { id: "notificaciones", label: "Avisos" },
                      { id: "privacidad", label: "Privacidad" },
                      { id: "seguridad", label: "Seguridad" },
                    ] as const).map(tab => (
                      <button key={tab.id} onClick={() => setSettingsTab(tab.id)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                        style={{ backgroundColor: settingsTab === tab.id ? "#fff" : "transparent", color: settingsTab === tab.id ? "#7c3aed" : "#6b7280", boxShadow: settingsTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", ...font }}>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* ── TAB: CUENTA ── */}
                  {settingsTab === "cuenta" && (
                    <>
                      <div className="rounded-2xl p-5 border border-gray-100 shadow-sm mb-4 bg-white">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-xl flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
                            {user?.name?.charAt(0) || "U"}
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-gray-900 text-sm" style={font}>{user?.name}</p>
                            <p className="text-xs text-gray-400 mb-2" style={font}>{user?.email}</p>
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full w-fit text-xs font-bold"
                              style={{ backgroundColor: user?.plan === "premium" ? "#fef3c7" : "#f5f3ff", color: user?.plan === "premium" ? "#92400e" : "#7c3aed" }}>
                              {user?.plan === "premium" && <Crown className="h-3 w-3" />}
                              Plan {user?.plan === "premium" ? "Premium" : "Gratuito"}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 pt-3 border-t border-gray-50">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500" style={font}>Imágenes disponibles hoy</span>
                            <span className="text-xs font-black" style={{ color: attemptsRemaining > 3 ? "#059669" : "#dc2626", ...font }}>{attemptsRemaining} / {effectiveLimit}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${(attemptsRemaining / effectiveLimit) * 100}%`, backgroundColor: attemptsRemaining > 3 ? "#059669" : "#dc2626" }} />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500" style={font}>Marca de agua</span>
                            <span className="text-xs font-bold text-gray-900" style={font}>{user?.plan === "premium" ? "Sin marca de agua" : "Incluida en descargas"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500" style={font}>Total de obras creadas</span>
                            <span className="text-xs font-bold text-gray-900" style={font}>{myCreations.length} obras</span>
                          </div>
                        </div>
                      </div>

                      {user?.plan !== "premium" && (
                        <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
                          <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <Crown className="h-5 w-5 text-amber-300" />
                              <p className="font-black text-white text-base" style={font}>Actualiza tu plan</p>
                            </div>
                            <p className="text-xs text-purple-200 mb-4" style={font}>Desbloquea 100 imágenes diarias, sin marca de agua y generación prioritaria</p>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {[
                                { name: "Estándar", price: "$39.900", period: "/mes", features: ["50 imgs/día", "Sin marca de agua", "Alta resolución"] },
                                { name: "Premium", price: "$89.900", period: "/mes", features: ["100 imgs/día", "Ultra 4K", "API de integración"], highlight: true },
                              ].map(plan => (
                                <button key={plan.name}
                                  onClick={() => { setSelectedPlanId(plan.name.toLowerCase() as "standard" | "premium"); setShowPlanModal(true) }}
                                  className="rounded-xl p-3 text-left transition-all hover:scale-105"
                                  style={{ backgroundColor: (plan as any).highlight ? "#fff" : "rgba(255,255,255,0.15)", border: (plan as any).highlight ? "2px solid #fbbf24" : "1.5px solid rgba(255,255,255,0.3)" }}>
                                  {(plan as any).highlight && <div className="text-[9px] font-black text-amber-600 mb-1" style={font}>⭐ MÁS POPULAR</div>}
                                  <p className="font-black text-sm mb-0.5" style={{ color: (plan as any).highlight ? "#7c3aed" : "#fff", ...font }}>{plan.name}</p>
                                  <p className="font-black text-lg leading-none" style={{ color: (plan as any).highlight ? "#7c3aed" : "#fff", ...font }}>{plan.price}<span className="text-[10px] font-normal opacity-70">{plan.period}</span></p>
                                  <div className="mt-2 space-y-0.5">
                                    {plan.features.map(f => (
                                      <div key={f} className="flex items-center gap-1">
                                        <Check className="h-2.5 w-2.5 flex-shrink-0" style={{ color: (plan as any).highlight ? "#059669" : "rgba(255,255,255,0.7)" }} />
                                        <span className="text-[10px]" style={{ color: (plan as any).highlight ? "#374151" : "rgba(255,255,255,0.85)", ...font }}>{f}</span>
                                      </div>
                                    ))}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="rounded-2xl p-5 border border-gray-100 shadow-sm bg-white">
                        <h3 className="font-black text-sm text-gray-700 mb-3" style={font}>Sesión</h3>
                        <button onClick={logout}
                          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                          style={{ backgroundColor: "#fef2f2", color: "#dc2626", ...font }}>
                          Cerrar Sesión
                        </button>
                      </div>
                    </>
                  )}

                  {/* ── TAB: NOTIFICACIONES ── */}
                  {settingsTab === "notificaciones" && (
                    <div className="space-y-4">
                      <div className="rounded-2xl p-5 border border-gray-100 shadow-sm bg-white">
                        <div className="flex items-center gap-2 mb-4">
                          <Bell className="h-4 w-4" style={{ color: "#7c3aed" }} />
                          <h3 className="font-black text-sm text-gray-700" style={font}>Notificaciones</h3>
                        </div>
                        <div className="space-y-4">
                          {([
                            { key: "email", label: "Notificaciones por email", desc: "Recibe avisos sobre tu cuenta y nuevas funciones" },
                            { key: "push", label: "Notificaciones push", desc: "Avisos en tiempo real en el navegador" },
                            { key: "weekly", label: "Resumen semanal", desc: "Recibe un resumen de tu actividad cada semana" },
                          ] as const).map(item => (
                            <div key={item.key} className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-800" style={font}>{item.label}</p>
                                <p className="text-xs text-gray-400 mt-0.5" style={font}>{item.desc}</p>
                              </div>
                              <button onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                className="flex-shrink-0 w-11 h-6 rounded-full transition-all relative"
                                style={{ backgroundColor: notifSettings[item.key] ? "#7c3aed" : "#e5e7eb" }}>
                                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                                  style={{ left: notifSettings[item.key] ? "calc(100% - 22px)" : "2px" }} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl p-4 border border-purple-100 bg-purple-50">
                        <p className="text-xs text-purple-700 font-semibold text-center" style={font}>
                          💡 Las notificaciones te avisan cuando tu límite diario se renueva
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ── TAB: PRIVACIDAD ── */}
                  {settingsTab === "privacidad" && (
                    <div className="space-y-4">
                      <div className="rounded-2xl p-5 border border-gray-100 shadow-sm bg-white">
                        <div className="flex items-center gap-2 mb-4">
                          <Globe className="h-4 w-4" style={{ color: "#7c3aed" }} />
                          <h3 className="font-black text-sm text-gray-700" style={font}>Visibilidad</h3>
                        </div>
                        <div className="space-y-4">
                          {([
                            { key: "publicProfile", label: "Perfil público", desc: "Otros usuarios pueden ver tu perfil y estadísticas" },
                            { key: "showInCommunity", label: "Aparecer en la comunidad", desc: "Tus obras publicadas aparecen en el feed de la comunidad" },
                          ] as const).map(item => (
                            <div key={item.key} className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-800" style={font}>{item.label}</p>
                                <p className="text-xs text-gray-400 mt-0.5" style={font}>{item.desc}</p>
                              </div>
                              <button onClick={() => setPrivacySettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                className="flex-shrink-0 w-11 h-6 rounded-full transition-all relative"
                                style={{ backgroundColor: privacySettings[item.key] ? "#7c3aed" : "#e5e7eb" }}>
                                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                                  style={{ left: privacySettings[item.key] ? "calc(100% - 22px)" : "2px" }} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl p-5 border border-gray-100 shadow-sm bg-white">
                        <div className="flex items-center gap-2 mb-3">
                          <Palette className="h-4 w-4" style={{ color: "#7c3aed" }} />
                          <h3 className="font-black text-sm text-gray-700" style={font}>Datos y privacidad</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-3" style={font}>
                          Tus datos biométricos son procesados localmente y nunca se almacenan en nuestros servidores sin tu consentimiento explícito.
                        </p>
                        <button className="w-full py-2 rounded-xl text-xs font-bold border transition-all hover:bg-gray-50"
                          style={{ borderColor: "#e5e7eb", color: "#dc2626", ...font }}>
                          Solicitar eliminación de datos
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── TAB: SEGURIDAD ── */}
                  {settingsTab === "seguridad" && (
                    <div className="space-y-4">
                      <div className="rounded-2xl p-5 border border-gray-100 shadow-sm bg-white">
                        <div className="flex items-center gap-2 mb-4">
                          <Lock className="h-4 w-4" style={{ color: "#7c3aed" }} />
                          <h3 className="font-black text-sm text-gray-700" style={font}>Contraseña</h3>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-bold text-gray-600 mb-1 block" style={font}>Contraseña actual</label>
                            <input type="password" placeholder="••••••••"
                              className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                              style={{ borderColor: "#e5e7eb", fontFamily: "'DM Sans', sans-serif" }} />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-600 mb-1 block" style={font}>Nueva contraseña</label>
                            <input type="password" placeholder="••••••••"
                              className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                              style={{ borderColor: "#e5e7eb", fontFamily: "'DM Sans', sans-serif" }} />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-600 mb-1 block" style={font}>Confirmar nueva contraseña</label>
                            <input type="password" placeholder="••••••••"
                              className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2"
                              style={{ borderColor: "#e5e7eb", fontFamily: "'DM Sans', sans-serif" }} />
                          </div>
                          <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                            style={{ backgroundColor: "#7c3aed", ...font }}>
                            Actualizar Contraseña
                          </button>
                        </div>
                      </div>
                      <div className="rounded-2xl p-5 border border-gray-100 shadow-sm bg-white">
                        <h3 className="font-black text-sm text-gray-700 mb-3" style={font}>Sesiones activas</h3>
                        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#f9fafb" }}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f5f3ff" }}>
                            <Globe className="h-4 w-4" style={{ color: "#7c3aed" }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-gray-800" style={font}>Sesión actual · Navegador web</p>
                            <p className="text-[10px] text-gray-400" style={font}>Activa ahora · Esta sesión</p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "#f5f3ff" }}>
                    <Settings className="h-8 w-8" style={{ color: "#7c3aed" }} />
                  </div>
                  <h3 className="font-black text-gray-900 text-base mb-2" style={font}>Crea una cuenta</h3>
                  <p className="text-sm text-gray-400 mb-5 max-w-xs" style={font}>Regístrate para acceder a ajustes y opciones de plan</p>
                  <button onClick={() => navigate("/auth/register")}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#7c3aed", ...font }}>
                    Registrarse Gratis
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── COMUNIDAD VIEW ── */}
          {activeNav === "comunidad" && (
            <div className="px-5 py-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-black text-gray-900 text-xl" style={font}>Comunidad Noosfera</h2>
                  <p className="text-sm text-gray-400 mt-0.5" style={font}>Arte biométrico generado por nuestra comunidad global</p>
                </div>
                {isRealUser && (
                  <button onClick={openInput}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs text-white hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#7c3aed", ...font }}>
                    <Sparkles className="h-3.5 w-3.5" />
                    Publicar Arte
                  </button>
                )}
              </div>

              {communityUploads.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-black text-gray-800 text-sm mb-3 px-1" style={font}>Mis publicaciones</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {communityUploads.map((art, i) => (
                      <div key={i} className="flex-shrink-0 rounded-xl overflow-hidden border-2 shadow-sm relative cursor-pointer"
                        style={{ borderColor: "#7c3aed" }}
                        onClick={() => { setGeneratedResult(art); setShowModal("result") }}>
                        <img src={art.imageUrl} alt={art.title} className="w-24 h-24 object-cover block" />
                        <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-white text-[9px] font-bold truncate" style={font}>{art.title}</p>
                        </div>
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                          style={{ backgroundColor: "#7c3aed", color: "#fff" }}>Tuyo</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ columns: "2 160px", gap: "8px" }}>
                {COMMUNITY_IMAGES.map((img, i) => {
                  const imgKey = img.src
                  const likes = communityLikes[imgKey] ?? Math.floor(10 + i * 7 + 3)
                  const isLiked = likedImages.has(imgKey)
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-2xl overflow-hidden cursor-pointer group relative"
                      style={{ breakInside: "avoid", marginBottom: "8px", display: "block" }}
                      onClick={() => setCommunityDetail({ src: img.src, label: img.label, likes })}>
                      <img src={img.src} alt={img.label} className="w-full object-cover block"
                        style={{ height: i % 3 === 0 ? "200px" : i % 3 === 1 ? "160px" : "180px" }} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-[11px] font-bold truncate mb-1" style={font}>{img.label}</p>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              const newLiked = new Set(likedImages)
                              if (isLiked) {
                                newLiked.delete(imgKey)
                                setCommunityLikes(prev => ({ ...prev, [imgKey]: (prev[imgKey] ?? likes) - 1 }))
                              } else {
                                newLiked.add(imgKey)
                                setCommunityLikes(prev => ({ ...prev, [imgKey]: (prev[imgKey] ?? likes) + 1 }))
                              }
                              setLikedImages(newLiked)
                            }}
                            className="flex items-center gap-1 transition-all hover:scale-110"
                            style={{ background: "none", border: "none", cursor: "pointer", color: isLiked ? "#f43f5e" : "rgba(255,255,255,0.8)", ...font }}>
                            <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
                            <span className="text-[10px] font-bold">{communityLikes[imgKey] ?? likes}</span>
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setCommunityDetail({ src: img.src, label: img.label, likes }) }}
                            className="flex items-center gap-1 transition-all hover:scale-110"
                            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.8)", ...font }}>
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold">{3 + i}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {!isRealUser && (
                <div className="mt-6 rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
                  <p className="font-black text-white text-sm mb-1" style={font}>¿Quieres publicar tu arte?</p>
                  <p className="text-xs text-purple-200 mb-3" style={font}>Crea una cuenta gratuita para compartir tus obras con la comunidad</p>
                  <button onClick={() => navigate("/auth/register")}
                    className="px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#fff", color: "#7c3aed", ...font }}>
                    Crear Cuenta Gratis
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* ── COMMUNITY DETAIL MODAL ── */}
        <AnimatePresence>
          {communityDetail && (
            <motion.div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCommunityDetail(null)} />
              <motion.div className="relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden bg-white shadow-2xl"
                initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}>
                <div className="relative">
                  <img src={communityDetail.src} alt={communityDetail.label} className="w-full h-64 object-cover block" />
                  <button onClick={() => setCommunityDetail(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-black text-gray-900 text-base" style={font}>{communityDetail.label}</h3>
                      <p className="text-xs text-gray-400 mt-0.5" style={font}>Arte biométrico · Noosfera</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const imgKey = communityDetail.src
                          const isLiked = likedImages.has(imgKey)
                          const newLiked = new Set(likedImages)
                          if (isLiked) {
                            newLiked.delete(imgKey)
                            setCommunityLikes(prev => ({ ...prev, [imgKey]: (prev[imgKey] ?? communityDetail.likes) - 1 }))
                          } else {
                            newLiked.add(imgKey)
                            setCommunityLikes(prev => ({ ...prev, [imgKey]: (prev[imgKey] ?? communityDetail.likes) + 1 }))
                          }
                          setLikedImages(newLiked)
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all hover:scale-105"
                        style={{ backgroundColor: likedImages.has(communityDetail.src) ? "#fef2f2" : "#f5f3ff", color: likedImages.has(communityDetail.src) ? "#f43f5e" : "#7c3aed", ...font }}>
                        <Heart className={`h-3.5 w-3.5 ${likedImages.has(communityDetail.src) ? "fill-current" : ""}`} />
                        {communityLikes[communityDetail.src] ?? communityDetail.likes}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide" style={font}>Comentarios</p>
                    {[
                      { name: "Valentina M.", comment: "¡Increíble obra! Los colores son fascinantes 🎨" },
                      { name: "Carlos R.", comment: "Arte biométrico en su máxima expresión" },
                      { name: "Ana L.", comment: "Me encanta cómo los latidos generan esto ❤️" },
                    ].map((c, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xs text-white"
                          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
                          {c.name.charAt(0)}
                        </div>
                        <div className="flex-1 px-3 py-2 rounded-xl" style={{ backgroundColor: "#f9fafb" }}>
                          <p className="text-[10px] font-black text-gray-700 mb-0.5" style={font}>{c.name}</p>
                          <p className="text-xs text-gray-600" style={font}>{c.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {isRealUser ? (
                    <div className="flex gap-2">
                      <input placeholder="Escribe un comentario…"
                        className="flex-1 px-3 py-2 rounded-xl border text-xs outline-none focus:ring-2"
                        style={{ borderColor: "#e5e7eb", fontFamily: "'DM Sans', sans-serif" }} />
                      <button className="px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all"
                        style={{ backgroundColor: "#7c3aed", ...font }}>
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setCommunityDetail(null); navigate("/auth/register") }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all"
                      style={{ backgroundColor: "#7c3aed", ...font }}>
                      Crea una cuenta para comentar
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PLAN UPGRADE MODAL ── */}
        <AnimatePresence>
          {showPlanModal && (
            <motion.div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowPlanModal(false); setPaymentSuccess(false) }} />
              <motion.div className="relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden"
                initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}>
                <button onClick={() => { setShowPlanModal(false); setPaymentSuccess(false) }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
                  style={{ backgroundColor: "#f3f4f6" }}>
                  <X className="h-4 w-4 text-gray-600" />
                </button>

                {paymentSuccess ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "linear-gradient(135deg, #059669 0%, #047857 100%)" }}>
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900 text-xl mb-2" style={font}>¡Bienvenido a Premium!</h3>
                    <p className="text-sm text-gray-500 mb-6" style={font}>Tu plan ha sido activado. Ya puedes disfrutar de todas las funciones premium.</p>
                    <button onClick={() => { setShowPlanModal(false); setPaymentSuccess(false) }}
                      className="w-full py-3 rounded-xl font-black text-white hover:opacity-90 transition-all"
                      style={{ backgroundColor: "#7c3aed", ...font }}>
                      Comenzar a Crear
                    </button>
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[85vh]">
                    {/* Header */}
                    <div className="px-5 pt-6 pb-4" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="h-5 w-5 text-amber-300" />
                        <h3 className="font-black text-white text-lg" style={font}>Actualizar Plan</h3>
                      </div>
                      <p className="text-xs text-purple-200" style={font}>Elige el plan que mejor se adapta a ti</p>
                    </div>

                    <div className="p-5">
                      {/* Plan selector */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        {([
                          { id: "standard", name: "Estándar", price: "$39.900", period: "/mes", desc: "Para creadores frecuentes", features: ["50 imágenes/día", "Sin marca de agua", "Alta resolución (2048px)", "Galería ilimitada", "Soporte prioritario"] },
                          { id: "premium", name: "Premium", price: "$89.900", period: "/mes", desc: "Para profesionales", features: ["100 imágenes/día", "Ultra resolución 4K", "API de integración", "Galería NFT", "Soporte 24/7", "Acceso anticipado"] },
                        ] as const).map(plan => (
                          <button key={plan.id} onClick={() => setSelectedPlanId(plan.id)}
                            className="rounded-2xl p-4 text-left transition-all"
                            style={{ border: selectedPlanId === plan.id ? "2px solid #7c3aed" : "2px solid #e5e7eb", backgroundColor: selectedPlanId === plan.id ? "#faf5ff" : "#fff" }}>
                            {plan.id === "premium" && <div className="text-[9px] font-black mb-1" style={{ color: "#7c3aed", ...font }}>⭐ RECOMENDADO</div>}
                            <p className="font-black text-gray-900 text-sm" style={font}>{plan.name}</p>
                            <p className="text-[10px] text-gray-400 mb-2" style={font}>{plan.desc}</p>
                            <p className="font-black text-xl leading-none mb-3" style={{ color: "#7c3aed", ...font }}>
                              {plan.price}<span className="text-xs font-normal text-gray-400">{plan.period}</span>
                            </p>
                            <div className="space-y-1">
                              {plan.features.map(f => (
                                <div key={f} className="flex items-start gap-1.5">
                                  <Check className="h-3 w-3 mt-0.5 flex-shrink-0" style={{ color: "#059669" }} />
                                  <span className="text-[10px] text-gray-600" style={font}>{f}</span>
                                </div>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Card payment form */}
                      <div className="rounded-2xl p-4 border mb-4" style={{ borderColor: "#e5e7eb" }}>
                        <div className="flex items-center gap-2 mb-4">
                          <CreditCard className="h-4 w-4" style={{ color: "#7c3aed" }} />
                          <p className="font-black text-sm text-gray-700" style={font}>Información de pago</p>
                          <div className="ml-auto flex gap-1.5">
                            {["VISA", "MC", "AMEX"].map(b => (
                              <div key={b} className="px-1.5 py-0.5 rounded text-[8px] font-black border"
                                style={{ borderColor: "#e5e7eb", color: "#6b7280" }}>{b}</div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block" style={font}>Nombre en la tarjeta</label>
                            <input value={cardData.name} onChange={e => setCardData(p => ({ ...p, name: e.target.value }))}
                              placeholder="Juan García"
                              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-purple-300"
                              style={{ borderColor: "#e5e7eb", fontFamily: "'DM Sans', sans-serif" }} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block" style={font}>Número de tarjeta</label>
                            <input value={cardData.number}
                              onChange={e => {
                                const v = e.target.value.replace(/\D/g, "").slice(0, 16)
                                const formatted = v.replace(/(.{4})/g, "$1 ").trim()
                                setCardData(p => ({ ...p, number: formatted }))
                              }}
                              placeholder="1234 5678 9012 3456" maxLength={19}
                              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-purple-300 font-mono"
                              style={{ borderColor: "#e5e7eb", fontFamily: "monospace" }} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block" style={font}>Vencimiento</label>
                              <input value={cardData.expiry}
                                onChange={e => {
                                  let v = e.target.value.replace(/\D/g, "").slice(0, 4)
                                  if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2)
                                  setCardData(p => ({ ...p, expiry: v }))
                                }}
                                placeholder="MM/AA" maxLength={5}
                                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-purple-300"
                                style={{ borderColor: "#e5e7eb", fontFamily: "'DM Sans', sans-serif" }} />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block" style={font}>CVV</label>
                              <div className="relative">
                                <input value={cardData.cvv} onChange={e => setCardData(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                                  type={showCvv ? "text" : "password"} placeholder="123" maxLength={4}
                                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-purple-300 pr-9"
                                  style={{ borderColor: "#e5e7eb", fontFamily: "'DM Sans', sans-serif" }} />
                                <button type="button" onClick={() => setShowCvv(p => !p)}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                                  {showCvv ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: "#f9fafb" }}>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 font-semibold" style={font}>Plan {selectedPlanId === "premium" ? "Premium" : "Estándar"}</span>
                          <span className="font-black text-gray-900" style={font}>{selectedPlanId === "premium" ? "$89.900" : "$39.900"}/mes</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                          <span style={font}>IVA incluido</span>
                          <span style={font}>Se renueva automáticamente</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv) return
                          setTimeout(() => setPaymentSuccess(true), 800)
                        }}
                        disabled={!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv}
                        className="w-full py-3.5 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#7c3aed", ...font }}>
                        <CreditCard className="h-4 w-4 inline mr-2" />
                        Pagar {selectedPlanId === "premium" ? "$89.900" : "$39.900"}
                      </button>
                      <p className="text-center text-[10px] text-gray-400 mt-2" style={font}>
                        🔒 Pago seguro · Cancela cuando quieras
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
