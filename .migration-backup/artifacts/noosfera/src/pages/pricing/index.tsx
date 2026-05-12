import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Crown, Zap, Heart, ChevronDown } from "lucide-react"
import { useLocation } from "wouter"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "para siempre",
    tag: null,
    icon: Heart,
    accentColor: "#6b7280",
    features: [
      "10 capturas cardíacas / mes",
      "5 NFTs generados / mes",
      "Resolución estándar 720p",
      "Marca de agua Noosfera",
    ],
  },
  {
    id: "standard",
    name: "Estándar",
    price: "$39.900",
    period: "COP / mes",
    tag: "Más popular",
    icon: Zap,
    accentColor: "#7c3aed",
    features: [
      "Capturas ilimitadas",
      "50 NFTs generados / mes",
      "Resolución Full HD 1080p",
      "Sin marca de agua",
      "Historial completo",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$89.900",
    period: "COP / mes",
    tag: "Máximo potencial",
    icon: Crown,
    accentColor: "#5b21b6",
    features: [
      "NFTs ilimitados",
      "Resolución Ultra 4K",
      "Acceso a API completa",
      "Soporte prioritario 24/7",
      "Análisis avanzado BCI",
      "Marketplace exclusivo",
    ],
  },
]

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
    a: "Sí, todos nuestros planes ofrecen un 20% de descuento con facturación anual. El descuento se aplica automáticamente al seleccionarlo.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos tarjetas de crédito/débito, PSE, Nequi y Daviplata. Todos los pagos se procesan con encriptación SSL.",
  },
]

const steps = [
  { n: "01", title: "Captura tu Ritmo", desc: "Conecta tu dispositivo y registra tus patrones cardíacos únicos en tiempo real." },
  { n: "02", title: "La IA Crea Arte", desc: "Nuestro algoritmo transforma tus latidos en obras digitales únicas e irrepetibles." },
  { n: "03", title: "Monetiza", desc: "Vende tus NFTs cardíacos en las principales plataformas y genera ingresos reales." },
]

export default function PricingPage() {
  const [, navigate] = useLocation()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <DarkNav activeLink="pricing" />

      {/* Hero */}
      <section className="py-20 text-center" style={{ background: "linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%)" }}>
        <div className="container mx-auto px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-4">
            Planes y Precios
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Elige el Plan<br />
            <span className="text-purple-600">Perfecto para Ti</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Comienza gratis y escala cuando estés listo para monetizar tu arte biométrico único.
          </motion.p>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            const isFeatured = plan.id === "standard"
            return (
              <motion.div key={plan.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className="relative rounded-2xl flex flex-col p-8"
                style={{
                  background: isFeatured ? "#7c3aed" : "white",
                  border: isFeatured ? "none" : "1.5px solid #e5e7eb",
                  boxShadow: isFeatured ? "0 20px 60px rgba(124,58,237,0.25)" : "none",
                }}>
                {plan.tag && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.18em] font-bold px-4 py-1.5 rounded-full"
                    style={isFeatured
                      ? { backgroundColor: "white", color: "#7c3aed" }
                      : { backgroundColor: "#7c3aed", color: "white" }}>
                    {plan.tag}
                  </div>
                )}

                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: isFeatured ? "rgba(255,255,255,0.2)" : "#f5f3ff" }}>
                  <Icon className="h-5 w-5" style={{ color: isFeatured ? "white" : "#7c3aed" }} />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2"
                  style={{ color: isFeatured ? "rgba(255,255,255,0.7)" : "#7c3aed" }}>
                  {plan.name}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-black" style={{ color: isFeatured ? "white" : "#111827", fontFamily: "'DM Sans', sans-serif" }}>
                    {plan.price}
                  </span>
                  <span className="text-sm ml-2" style={{ color: isFeatured ? "rgba(255,255,255,0.6)" : "#9ca3af" }}>
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm"
                      style={{ color: isFeatured ? "rgba(255,255,255,0.85)" : "#374151" }}>
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0"
                        style={{ color: isFeatured ? "rgba(255,255,255,0.9)" : "#7c3aed" }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button onClick={() => navigate("/auth/login")}
                  className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all"
                  style={isFeatured
                    ? { backgroundColor: "white", color: "#7c3aed" }
                    : { backgroundColor: "#7c3aed", color: "white" }}>
                  Comenzar ahora
                </button>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="border-t max-w-5xl mx-auto border-gray-100" />

      {/* How it works */}
      <section className="py-24 container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-4">Proceso</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Cómo Funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className="p-8 rounded-2xl border border-gray-100 bg-white hover:border-purple-200 hover:shadow-lg transition-all">
                <p className="text-5xl font-black mb-5 leading-none text-purple-100"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {step.n}
                </p>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t max-w-5xl mx-auto border-gray-100" />

      {/* FAQ */}
      <section className="py-24 container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-4">Preguntas</p>
            <h2 className="text-4xl font-black text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  className="w-full flex justify-between items-center py-5 text-left text-gray-900 text-sm font-semibold group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="group-hover:text-purple-600 transition-colors pr-4">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${openFaq === i ? "rotate-180 text-purple-600" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
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

      {/* CTA */}
      <section className="py-24 text-center" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)" }}>
        <div className="container mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500 mb-4">Comienza Hoy</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Tu Arte Único<br />Te Espera
          </h2>
          <p className="text-gray-500 mb-10 max-w-md mx-auto text-sm leading-relaxed">
            Únete a la primera comunidad de arte biométrico del mundo. Cada latido es una obra maestra.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => navigate("/auth/login")}
              className="px-8 py-4 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#7c3aed" }}>
              Comenzar gratis
            </button>
            <button onClick={() => navigate("/docs")}
              className="px-8 py-4 rounded-full text-sm font-semibold text-gray-700 border border-gray-300 hover:border-purple-300 hover:text-purple-600 transition-all bg-white">
              Ver documentación
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
