import { useState } from "react"
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
      tag: "🔥 Más Popular",
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
      tag: "⭐ Mejor Valor",
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
      tag: "🔥 Más Popular",
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
      tag: "⭐ Mejor Valor",
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
  const plans = planData[billing]

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
            className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Elige el plan perfecto
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Comienza gratis y escala cuando estés listo para monetizar tu arte biométrico único.
          </motion.p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4">
            <div className="relative flex items-center bg-gray-100 rounded-full p-1 gap-1">
              {(["monthly", "annual"] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className="relative px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                  style={{
                    background: billing === b ? "#111827" : "transparent",
                    color: billing === b ? "#fff" : "#6b7280",
                  }}>
                  {b === "monthly" ? "Mensual" : "Anual"}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {billing === "annual" && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-1.5">
                  <svg viewBox="0 0 40 20" className="w-8 h-4 text-red-500" fill="none">
                    <path d="M35 5 Q20 15 5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5 10 L8 6 M5 10 L9 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-xs font-bold text-red-500 leading-tight text-left">
                    ¡20% OFF, eso es<br />2 meses GRATIS 🩷
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const isFeatured = plan.id === "standard"
            return (
              <motion.div key={plan.id + billing}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative rounded-2xl flex flex-col p-8"
                style={{
                  background: "white",
                  border: isFeatured ? "2px solid #7c3aed" : "1.5px solid #e5e7eb",
                  boxShadow: isFeatured ? "0 8px 40px rgba(124,58,237,0.15)" : "none",
                }}>

                {/* Badge */}
                {plan.tag && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold px-4 py-1.5 rounded-full"
                    style={{ backgroundColor: plan.tagColor!.bg, color: plan.tagColor!.text }}>
                    {plan.tag}
                  </div>
                )}

                {/* Plan name */}
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">{plan.label}</p>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-5xl font-black text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-400 ml-1.5">{plan.sub}</span>
                </div>

                {/* Annual savings pill */}
                <AnimatePresence>
                  {plan.annualSaving && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mb-4">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-md"
                        style={{ background: "#f3e8ff", color: "#7c3aed" }}>
                        {plan.annualSaving}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="border-t border-gray-100 my-4" />

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-purple-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button onClick={() => navigate("/auth")}
                  className="w-full py-3.5 rounded-full text-sm font-bold tracking-wide transition-all hover:opacity-90"
                  style={{
                    background: "#7c3aed",
                    color: "white",
                  }}>
                  Comenzar ahora
                </button>
              </motion.div>
            )
          })}
        </div>
      </section>

      <div className="border-t max-w-5xl mx-auto border-gray-100" />

      {/* FAQ — image-left layout, matching reviews section style */}
      <section className="py-24 container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Left — image + heading */}
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

          {/* Right — accordion */}
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

      {/* CTA — matches reference: light purple gradient, big heading, two buttons */}
      <section className="py-28 text-center" style={{ background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 60%, #ffffff 100%)" }}>
        <div className="container mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500 mb-5">Comienza Hoy</p>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Tu Arte Único<br />Te Espera
          </h2>
          <p className="text-gray-500 mb-10 max-w-md mx-auto text-base leading-relaxed">
            Únete a la primera comunidad de arte biométrico del mundo. Cada latido es una obra maestra.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => navigate("/auth")}
              className="px-8 py-4 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#7c3aed" }}>
              Comenzar gratis
            </button>
            <button onClick={() => navigate("/docs")}
              className="px-8 py-4 rounded-full text-sm font-semibold text-gray-700 border border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all bg-white">
              Ver documentación
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
