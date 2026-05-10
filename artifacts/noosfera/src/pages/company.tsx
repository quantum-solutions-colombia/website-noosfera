import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "wouter"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"

interface TeamSlide {
  id: number
  type: "intro" | "member"
  name?: string
  role?: string
  description: string
  image?: string
  accentColor: string
}

const teamSlides: TeamSlide[] = [
  {
    id: 0,
    type: "intro",
    description: "Conoce a las personas apasionadas que hacen posible Noosfera. Un equipo dedicado a transformar la tecnología cardíaca en arte digital.",
    accentColor: "#8b5cf6",
  },
  {
    id: 1,
    type: "member",
    name: "Miguel Molina",
    role: "CEO & Cofounder",
    description: "QA Tester con amplia experiencia en aseguramiento de calidad y pruebas de software. Apasionado por garantizar la excelencia en cada detalle del producto.",
    image: "/team/miguel-molina.jpg",
    accentColor: "#8b5cf6",
  },
  {
    id: 2,
    type: "member",
    name: "Harry Fishert",
    role: "Dev Full Stack & Founder",
    description: "Desarrollador Full Stack y fundador con experiencia en arquitectura de software y desarrollo de aplicaciones innovadoras. Líder técnico del proyecto Noosfera.",
    image: "/team/harry-fishert.jpg",
    accentColor: "#f59e0b",
  },
]

const values = [
  { title: "Innovación", desc: "Empujamos los límites de lo que es posible entre biometría y arte digital." },
  { title: "Unicidad", desc: "Cada creación es matemáticamente irrepetible — tan única como su creador." },
  { title: "Accesibilidad", desc: "Arte premium al alcance de cualquier persona con un latido." },
]

export default function CompanyPage() {
  const [, navigate] = useLocation()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamSlides.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const slide = teamSlides[currentSlide]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0b0b12", color: "#f0ece0" }}>
      <DarkNav activeLink="company" />

      {/* Hero */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,92,246,0.1), transparent)" }} />
        <div className="container mx-auto px-4 relative">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-[11px] uppercase tracking-[0.22em] text-[#8b5cf6] mb-5">
            Quiénes Somos
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#f0ece0] leading-tight mb-6">
            Las Personas Detrás<br />
            <span style={{ color: "#f59e0b" }}>de Noosfera</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#8a8898] max-w-lg mx-auto text-base leading-relaxed">
            Un equipo dedicado a transformar la tecnología cardíaca en arte digital único e irrepetible.
          </motion.p>
        </div>
      </section>

      {/* Team Carousel */}
      <section className="container mx-auto px-4 pb-28">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}>
              {slide.type === "intro" ? (
                <div className="text-center py-16 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[#8a8898] text-lg leading-relaxed max-w-xl mx-auto">{slide.description}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  {/* Text */}
                  <div className="text-center order-2 lg:order-1">
                    <p className="text-[11px] uppercase tracking-[0.22em] mb-4" style={{ color: slide.accentColor }}>
                      {slide.name}
                    </p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif" }}
                      className="text-4xl md:text-5xl font-bold text-[#f0ece0] leading-tight mb-6">
                      {slide.role}
                    </h2>
                    <p className="text-[#8a8898] leading-relaxed max-w-md mx-auto">{slide.description}</p>
                  </div>

                  {/* Image — organic frame */}
                  <div className="flex justify-center order-1 lg:order-2">
                    <div className="relative w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 overflow-hidden"
                      style={{
                        borderRadius: "44% 56% 52% 48% / 62% 58% 42% 38%",
                        border: `2px solid ${slide.accentColor}50`,
                        boxShadow: `0 0 0 8px ${slide.accentColor}08, 0 20px 60px rgba(0,0,0,0.4)`,
                        backgroundColor: "#16161f",
                      }}>
                      {slide.image ? (
                        <img src={slide.image} alt={slide.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${slide.accentColor}20, transparent)` }}>
                          <span style={{ color: slide.accentColor, fontFamily: "'Playfair Display', serif", fontSize: "3rem" }}>
                            {slide.name?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {teamSlides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === currentSlide ? "32px" : "10px",
                  height: "10px",
                  backgroundColor: i === currentSlide ? "#8b5cf6" : "rgba(255,255,255,0.15)",
                }} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
              className="text-center mb-16">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#8b5cf6] mb-4">Valores</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-4xl font-bold text-[#f0ece0]">
                Lo que nos mueve
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
              {values.map((v, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                  className="p-10 text-center" style={{ backgroundColor: "#0b0b12" }}>
                  <p className="text-[42px] font-bold leading-none mb-5"
                    style={{ color: "rgba(139,92,246,0.2)", fontFamily: "'Playfair Display', serif" }}>
                    0{i + 1}
                  </p>
                  <h3 className="text-lg font-semibold text-[#f0ece0] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {v.title}
                  </h3>
                  <p className="text-sm text-[#8a8898] leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(245,158,11,0.06), transparent)" }} />
        <div className="container mx-auto px-4 relative">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#f59e0b] mb-5">Únete</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl md:text-5xl font-bold text-[#f0ece0] mb-6">
            Sé Parte de la Revolución
          </h2>
          <p className="text-[#8a8898] mb-12 max-w-md mx-auto text-sm leading-relaxed">
            El arte biométrico es el futuro. Tus latidos tienen valor — empieza a crearlos hoy.
          </p>
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => navigate("/auth/login")}
              className="px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all hover:opacity-90"
              style={{ backgroundColor: "#f59e0b", color: "#0b0b12" }}>
              Comenzar Ahora
            </button>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <button onClick={() => navigate("/pricing")}
              className="text-[11px] uppercase tracking-[0.18em] text-[#8a8898] hover:text-[#f0ece0] transition-colors">
              — Ver Planes
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
