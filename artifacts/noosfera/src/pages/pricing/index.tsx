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
    accentColor: "#8a8898",
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
    accentColor: "#8b5cf6",
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
    accentColor: "#f59e0b",
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
    <div className="min-h-screen" style={{ backgroundColor: "#0b0b12", color: "#f0ece0" }}>
      <DarkNav activeLink="pricing" />

      {/* Hero */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.12), transparent)" }} />
        <div className="container mx-auto px-4 relative">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-[11px] uppercase tracking-[0.22em] text-[#8b5cf6] mb-5">
            Planes y Precios
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#f0ece0] leading-tight mb-6">
            Elige el Plan
            <br />
            <span style={{ color: "#f59e0b" }}>Perfecto para Ti</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#8a8898] text-lg max-w-xl mx-auto leading-relaxed">
            Comienza gratis y escala cuando estés listo para monetizar tu arte biométrico único.
          </motion.p>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            const isFeatured = plan.id === "standard"
            return (
              <motion.div key={plan.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className="relative rounded-2xl flex flex-col"
                style={{
                  background: isFeatured ? "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(109,40,217,0.08))" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isFeatured ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: isFeatured ? "0 0 40px rgba(139,92,246,0.12)" : "none",
                  padding: "32px",
                }}>
                {plan.tag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.18em] font-semibold px-4 py-1 rounded-full"
                    style={{ backgroundColor: plan.accentColor, color: "#0b0b12" }}>
                    {plan.tag}
                  </div>
                )}

                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${plan.accentColor}20` }}>
                  <Icon className="h-5 w-5" style={{ color: plan.accentColor }} />
                </div>

                <p className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: plan.accentColor }}>
                  {plan.name}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#f0ece0]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {plan.price}
                  </span>
                  <span className="text-[#8a8898] text-sm ml-2">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm text-[#c8c4ba]">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: plan.accentColor }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/auth/login")}
                  className="w-full py-3 rounded-xl text-sm font-medium tracking-wide transition-all"
                  style={isFeatured
                    ? { backgroundColor: "#8b5cf6", color: "#fff" }
                    : { backgroundColor: "rgba(255,255,255,0.06)", color: "#f0ece0", border: "none" }}>
                  Comenzar ahora
                </button>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="border-t mx-auto max-w-5xl" style={{ borderColor: "rgba(255,255,255,0.06)" }} />

      {/* How it works */}
      <section className="py-24 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
            className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#8b5cf6] mb-4">Proceso</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-4xl md:text-5xl font-bold text-[#f0ece0]">
              Cómo Funciona
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            {steps.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className="p-10" style={{ backgroundColor: "#0b0b12" }}>
                <p className="text-5xl font-bold mb-6 leading-none" style={{ color: "rgba(139,92,246,0.25)", fontFamily: "'Playfair Display', serif" }}>
                  {step.n}
                </p>
                <h3 className="text-lg font-semibold text-[#f0ece0] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {step.title}
                </h3>
                <p className="text-sm text-[#8a8898] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t mx-auto max-w-5xl" style={{ borderColor: "rgba(255,255,255,0.06)" }} />

      {/* FAQ */}
      <section className="py-24 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
            className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#8b5cf6] mb-4">Preguntas</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-4xl font-bold text-[#f0ece0]">
              Preguntas Frecuentes
            </h2>
          </motion.div>

          <div className="space-y-px" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.4, delay: i * 0.08 }} viewport={{ once: true }}>
                <button
                  className="w-full flex justify-between items-center py-5 text-left text-[#f0ece0] text-sm font-medium group"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="group-hover:text-[#8b5cf6] transition-colors pr-4">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 text-[#8a8898] transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                      className="text-sm text-[#8a8898] leading-relaxed overflow-hidden pb-5">
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(245,158,11,0.06), transparent)" }} />
        <div className="container mx-auto px-4 relative">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#f59e0b] mb-5">Comienza Hoy</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl md:text-5xl font-bold text-[#f0ece0] mb-6">
            Tu Arte Único<br />Te Espera
          </h2>
          <p className="text-[#8a8898] mb-12 max-w-md mx-auto text-sm leading-relaxed">
            Únete a la primera comunidad de arte biométrico del mundo. Cada latido es una obra maestra.
          </p>
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => navigate("/auth/login")}
              className="px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all hover:opacity-90"
              style={{ backgroundColor: "#f59e0b", color: "#0b0b12" }}>
              Comenzar gratis
            </button>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <button onClick={() => navigate("/docs")}
              className="text-[11px] uppercase tracking-[0.18em] text-[#8a8898] hover:text-[#f0ece0] transition-colors">
              — Ver documentación
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
