import { motion } from "framer-motion"
import { useLocation } from "wouter"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"
import { Zap, Heart, Globe, ArrowRight } from "lucide-react"

const founders = [
  {
    name: "Miguel Molina",
    role: "CEO & Cofounder",
    description: "QA Tester con amplia experiencia en aseguramiento de calidad y pruebas de software. Apasionado por garantizar la excelencia en cada detalle del producto Noosfera.",
    image: "/team/miguel-molina.jpg",
    accent: "#7c3aed",
  },
  {
    name: "Harry Fishert",
    role: "Dev Full Stack & Founder",
    description: "Desarrollador Full Stack y fundador con experiencia en arquitectura de software y desarrollo de aplicaciones innovadoras. Líder técnico del proyecto Noosfera.",
    image: "/team/harry-fishert.jpg",
    accent: "#5b21b6",
  },
]

const pillars = [
  {
    icon: Zap,
    title: "Innovación",
    desc: "Empujamos los límites de lo que es posible entre biometría y arte digital, convirtiendo datos cardíacos en obras únicas.",
  },
  {
    icon: Heart,
    title: "Unicidad",
    desc: "Cada creación es matemáticamente irrepetible — tan única como el latido que la genera.",
  },
  {
    icon: Globe,
    title: "Accesibilidad",
    desc: "Arte premium al alcance de cualquier persona. Sin importar el origen, con un solo latido puedes crear.",
  },
]

export default function CompanyPage() {
  const [, navigate] = useLocation()

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <DarkNav activeLink="company" />

      {/* Hero — full-width cinematic image with overlay text */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden flex items-center justify-center">
        <img
          src="/images/about-hero.png"
          alt="Noosfera mundo"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 100%)" }} />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 mb-4">
            Acerca de
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Donde el latido de tu corazón<br />
            <span style={{ color: "#a78bfa" }}>se convierte en arte</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/70 text-base leading-relaxed max-w-xl mx-auto">
            Noosfera es la primera plataforma que transforma tus pulsos cardíacos en obras digitales únicas, certificadas y listas para el mercado.
          </motion.p>
        </div>
      </section>

      {/* What is Noosfera — split: text LEFT, mission image RIGHT */}
      <section className="overflow-hidden border-b border-gray-100">
        <div className="flex flex-col lg:flex-row min-h-[480px]">
          <motion.div
            className="lg:w-1/2 flex flex-col justify-center px-10 lg:px-20 py-16"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }} viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-4">Nuestra misión</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              ¿Qué es<br />
              <span className="text-purple-600">Noosfera?</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Noosfera es una plataforma de arte biométrico que captura los pulsos cardíacos de sus usuarios y los convierte — a través de inteligencia artificial — en obras de arte digital únicas, certificadas y listas para el mercado NFT.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Creemos que cada latido cuenta una historia. Nuestra tecnología lee esa historia y la transforma en algo visible, bello e irrepetible. No hay dos obras iguales porque no hay dos personas iguales.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:gap-3 transition-all">
              Ver planes <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          <motion.div
            className="lg:w-1/2 flex items-center justify-center p-6 lg:p-10"
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }} viewport={{ once: true }}
          >
            <div style={{
              width: "80%",
              aspectRatio: "3/4",
              borderRadius: "24px 4px 24px 4px",
              overflow: "hidden",
              border: "2px solid rgba(124,58,237,0.20)",
              outline: "4px solid rgba(124,58,237,0.07)",
            }}>
              <img
                src="/images/about-mission.png"
                alt="Noosfera misión"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-3">El equipo</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Las personas detrás de Noosfera
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-10 rounded-3xl border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(160deg, #faf8ff 0%, #ffffff 100%)" }}
              >
                <div
                  className="w-28 h-28 mb-6 overflow-hidden flex-shrink-0"
                  style={{
                    borderRadius: "44% 56% 52% 48% / 62% 58% 42% 38%",
                    border: `2px solid ${f.accent}40`,
                    boxShadow: `0 0 0 6px ${f.accent}10, 0 16px 48px rgba(124,58,237,0.12)`,
                    backgroundColor: "#f5f3ff",
                  }}
                >
                  <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600 mb-2">{f.name}</p>
                <h3 className="text-xl font-black text-gray-900 mb-4"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {f.role}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision — image LEFT, pillars RIGHT */}
      <section className="overflow-hidden border-t border-gray-100">
        <div className="flex flex-col lg:flex-row min-h-[480px]">
          <motion.div
            className="lg:w-1/2 flex items-center justify-center p-6 lg:p-10"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }} viewport={{ once: true }}
          >
            <div style={{
              width: "80%",
              aspectRatio: "3/4",
              borderRadius: "4px 24px 4px 24px",
              overflow: "hidden",
              border: "2px solid rgba(124,58,237,0.20)",
              outline: "4px solid rgba(124,58,237,0.07)",
            }}>
              <img
                src="/images/about-vision.png"
                alt="Noosfera visión"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 flex flex-col justify-center px-10 lg:px-16 py-16 space-y-8"
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }} viewport={{ once: true }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-3">Nuestros pilares</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Lo que nos mueve
              </h2>
            </div>
            <div className="space-y-6">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(124,58,237,0.1)" }}>
                    <p.icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{p.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20"
        style={{
          backgroundColor: "#7c3aed",
          borderRadius: "2.5rem 2.5rem 0 0",
          marginTop: "0.5rem",
        }}>
        <div className="container mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }} viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200 mb-4">
            Únete
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-white mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Convierte Tus Pulsos en Arte Digital
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}
            className="text-purple-200 mb-10 max-w-md mx-auto text-sm leading-relaxed">
            El arte biométrico es el futuro. Tus latidos tienen valor — empieza a crearlos hoy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate("/auth/login")}
              className="px-8 py-4 rounded-full text-sm font-semibold text-purple-700 bg-white transition-all hover:opacity-90 hover:scale-[1.01]">
              Comenzar Ahora
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="px-8 py-4 rounded-full text-sm font-semibold text-white border border-white/30 hover:border-white/60 transition-all">
              Comenzar demo
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
