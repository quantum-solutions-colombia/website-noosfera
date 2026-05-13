import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"
import { useLocation } from "wouter"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"

const planData = {
  monthly: [
    {
      id: "free",
      label: "FREE",
      price: "$0",
      sub: "para siempre",
      annualSaving: null,
      tag: null,
      tagColor: null,
      features: [
        "10 capturas cardíacas / mes",
        "5 NFTs generados / mes",
        "Resolución estándar 720p",
        "Marca de agua Noosfera",
      ],
    },
    {
      id: "standard",
      label: "ESTÁNDAR",
      price: "$39.900",
      sub: "COP / mes",
      annualSaving: null,
      tag: "Más Popular",
      tagColor: { bg: "#ef4444", text: "#fff" },
      features: [
        "Todo lo del plan Free",
        "Capturas ilimitadas",
        "50 NFTs generados / mes",
        "Resolución Full HD 1080p",
        "Sin marca de agua",
      ],
    },
    {
      id: "premium",
      label: "PREMIUM",
      price: "$89.900",
      sub: "COP / mes",
      annualSaving: null,
      tag: "Mejor Precio",
      tagColor: { bg: "#b45309", text: "#fff" },
      features: [
        "Todo lo del plan Estándar",
        "NFTs ilimitados",
        "Resolución Ultra 4K",
        "Acceso a API completa",
        "Soporte prioritario 24/7",
      ],
    },
  ],
  annual: [
    {
      id: "free",
      label: "FREE",
      price: "$0",
      sub: "para siempre",
      annualSaving: null,
      tag: null,
      tagColor: null,
      features: [
        "10 capturas cardíacas / mes",
        "5 NFTs generados / mes",
        "Resolución estándar 720p",
        "Marca de agua Noosfera",
      ],
    },
    {
      id: "standard",
      label: "ESTÁNDAR",
      price: "$31.920",
      sub: "COP / mes",
      annualSaving: "AHORRAS $95.760 AL AÑO",
      tag: "Más Popular",
      tagColor: { bg: "#ef4444", text: "#fff" },
      features: [
        "Todo lo del plan Free",
        "Capturas ilimitadas",
        "50 NFTs generados / mes",
        "Resolución Full HD 1080p",
        "Sin marca de agua",
      ],
    },
    {
      id: "premium",
      label: "PREMIUM",
      price: "$71.920",
      sub: "COP / mes",
      annualSaving: "AHORRAS $215.760 AL AÑO",
      tag: "Mejor Precio",
      tagColor: { bg: "#b45309", text: "#fff" },
      features: [
        "Todo lo del plan Estándar",
        "NFTs ilimitados",
        "Resolución Ultra 4K",
        "Acceso a API completa",
        "Soporte prioritario 24/7",
      ],
    },
  ],
}

const faqs = [
  {
    q: "¿Puedo cambiar de plan en cualquier momento?",
    a: "Sí, puedes cambiar o cancelar tu suscripción en cualquier momento desde tu panel de control. Los cambios se reflejan en tu próximo ciclo de facturación.",
  },
  {
    q: "¿Qué sucede con mis NFTs si cancelo?",
    a: "Tus NFTs generados permanecen en tu cuenta de forma permanente. Solo pierdes acceso a funcionalidades premium según tu nuevo plan.",
  },
  {
    q: "¿Hay descuento por suscripción anual?",
    a: "Sí, todos nuestros planes ofrecen un 20% de descuento con facturación anual equivalente a 2 meses gratis. El descuento se aplica automáticamente al seleccionarlo.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos tarjetas de crédito/débito, PSE, Nequi y Daviplata. Todos los pagos se procesan con encriptación SSL de 256 bits.",
  },
  {
    q: "¿Los datos cardíacos son privados?",
    a: "Absolutamente. Tus datos biométricos están cifrados end-to-end y nunca se comparten con terceros. Tú tienes el control total de tu información.",
  },
]

export default function PricingPage() {
  const [, navigate] = useLocation()
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [direction, setDirection] = useState(0)
  const isAutoPlaying = useRef(true)
  const plans = planData[billing]

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir)
    setCurrentIndex(index)
  }, [])

  const next = useCallback(() => {
    goTo((currentIndex + 1) % plans.length, 1)
  }, [currentIndex, plans.length, goTo])

  const prev = useCallback(() => {
    goTo((currentIndex - 1 + plans.length) % plans.length, -1)
  }, [currentIndex, plans.length, goTo])

  useEffect(() => {
    if (!isAutoPlaying.current) return
    const id = setInterval(() => {
      setDirection(1)
      setCurrentIndex(prev => (prev + 1) % plans.length)
    }, 4000)
    return () => clearInterval(id)
  }, [plans.length])

  const plan = plans[currentIndex]

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.97 }),
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <DarkNav activeLink="pricing" />

      {/* Hero */}
      <section className="pt-20 pb-10 text-center" style={{ background: "linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%)" }}>
        <div className="container mx-auto px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-4">
            Planes y Precios
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Elige el plan perfecto
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Elige el acceso que necesitas para transformar tus pulsos cardíacos en arte digital único, certificado y listo para el mercado.
          </motion.p>
        </div>
      </section>

      {/* Plans Section */}
      <section className="overflow-hidden pb-16">
        {/* Outer wrapper: centers the whole block horizontally */}
        <div className="flex justify-center px-6 lg:px-10">
          {/* Row: image + card column — align-items: stretch so card matches image height */}
          <div className="flex flex-col lg:flex-row items-stretch gap-5">

            {/* Left — Dragon image: fixed width, fills its height via object-fit */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              style={{ flexShrink: 0 }}
            >
              <div style={{
                width: 280,
                height: "100%",
                minHeight: 420,
                borderRadius: "20px 4px 20px 4px",
                overflow: "hidden",
                border: "2px solid rgba(124,58,237,0.20)",
                outline: "4px solid rgba(124,58,237,0.07)",
              }}>
                <img
                  src="/images/dragon-pricing.png"
                  alt="Dragon Noosfera"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                />
              </div>
            </motion.div>

            {/* Right — Toggle + Card column */}
            <div
              className="flex flex-col"
              style={{ width: 310 }}
              onMouseEnter={() => { isAutoPlaying.current = false }}
              onMouseLeave={() => { isAutoPlaying.current = true }}
            >
              {/* Billing toggle — TOP, centered relative to card */}
              <div className="relative flex items-center justify-center mb-3">
                <AnimatePresence>
                  {billing === "annual" && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="absolute left-full ml-2 flex items-center gap-1 whitespace-nowrap"
                      style={{ top: "50%", transform: "translate(0, -50%)" }}
                    >
                      <svg viewBox="0 0 48 32" className="w-10 h-8 flex-shrink-0" fill="none">
                        <path d="M42 6 Q24 28 8 18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        <path d="M8 18 L13 15 M8 18 L11 23" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span className="text-xs font-bold text-red-500 leading-tight">
                        ¡20% OFF, eso es<br />2 meses GRATIS ❤️
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="relative flex items-center bg-gray-100 rounded-full p-1 gap-1">
                  {(["monthly", "annual"] as const).map(b => (
                    <button key={b} onClick={() => { setBilling(b); setCurrentIndex(1) }}
                      className="relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                      style={{
                        background: billing === b ? "#111827" : "transparent",
                        color: billing === b ? "#fff" : "#6b7280",
                      }}>
                      {b === "monthly" ? "Mensual" : "Anual"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card — flex: 1 so it stretches to fill remaining height */}
              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={plan.id + billing}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    style={{ position: "absolute", inset: 0 }}
                  >
                    <div
                      className="relative flex flex-col w-full h-full p-7"
                      style={{
                        background: "white",
                        border: "2px solid #111827",
                        borderRadius: "20px",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
                      }}>

                      {/* Badge */}
                      {plan.tag && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold px-5 py-1.5 rounded-full"
                          style={{ backgroundColor: plan.tagColor!.bg, color: plan.tagColor!.text }}>
                          {plan.tag}
                        </div>
                      )}

                      {/* Plan name + price */}
                      <div className="mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400 mb-2">{plan.label}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {plan.price}
                          </span>
                          <span className="text-sm text-gray-400">{plan.sub}</span>
                        </div>
                        <AnimatePresence>
                          {plan.annualSaving && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2">
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-md"
                                style={{ background: "#f3e8ff", color: "#7c3aed" }}>
                                {plan.annualSaving}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="border-t border-gray-100 mb-4" />

                      {/* Features — flex-1 so they fill space between price and button */}
                      <ul className="space-y-2.5 flex-1">
                        {plan.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-purple-500" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* CTA — pinned to bottom via mt-auto */}
                      <button
                        onClick={() => navigate("/auth/login")}
                        className="mt-auto w-full py-3.5 rounded-full text-sm font-bold tracking-wide transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                        style={{ background: "#7c3aed", color: "white" }}>
                        Comenzar ahora
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {plans.map((_, i) => (
                  <button key={i} onClick={() => goTo(i, i > currentIndex ? 1 : -1)}
                    aria-label={`Plan ${i + 1}`}
                    className="h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === currentIndex ? 28 : 10,
                      backgroundColor: i === currentIndex ? "#7c3aed" : "#d1d5db",
                    }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t max-w-5xl mx-auto border-gray-100" />

      {/* FAQ */}
      <section className="py-24 container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-3">Preguntas</p>
              <h2 className="text-4xl font-black text-gray-900 leading-tight mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Preguntas<br />Frecuentes
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Todo lo que necesitas saber antes de empezar tu viaje en Noosfera.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl" style={{ maxHeight: 420 }}>
              <img
                src="/images/nft-castle-ai.png"
                alt="Noosfera arte"
                className="w-full h-full object-cover"
                style={{ minHeight: 320 }}
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100 pt-2">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  className="w-full flex justify-between items-center py-5 text-left text-gray-900 text-sm font-semibold group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="group-hover:text-purple-600 transition-colors pr-4">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${openFaq === i ? "rotate-180 text-purple-600" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                      className="text-sm text-gray-500 leading-relaxed overflow-hidden pb-5">
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t max-w-5xl mx-auto border-gray-100" />

      {/* CTA — purple background with rounded top corners like home */}
      <section className="py-20"
        style={{
          backgroundColor: "#7c3aed",
          borderRadius: "2.5rem 2.5rem 0 0",
          marginTop: "0.5rem",
        }}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">Comienza Hoy</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Convierte Tus Pulsos<br />en Arte Digital
            </h2>
            <p className="text-purple-200 text-lg leading-relaxed">
              Únete a la primera comunidad que transforma pulsos cardíacos en obras únicas. Cada latido, una obra maestra.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={() => navigate("/auth/login")}
                className="px-8 py-4 font-semibold text-purple-700 text-sm tracking-wide transition-all hover:opacity-95 hover:scale-[1.02]"
                style={{ backgroundColor: "#ffffff", borderRadius: "14px" }}>
                Comenzar gratis
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="px-8 py-4 font-semibold text-purple-700 text-sm tracking-wide transition-all hover:opacity-95 hover:scale-[1.02]"
                style={{ backgroundColor: "#ffffff", borderRadius: "14px" }}>
                Comenzar demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
