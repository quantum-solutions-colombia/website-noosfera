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
    accentColor: "#7c3aed",
  },
  {
    id: 1,
    type: "member",
    name: "Miguel Molina",
    role: "CEO & Cofounder",
    description: "QA Tester con amplia experiencia en aseguramiento de calidad y pruebas de software. Apasionado por garantizar la excelencia en cada detalle del producto.",
    image: "/team/miguel-molina.jpg",
    accentColor: "#7c3aed",
  },
  {
    id: 2,
    type: "member",
    name: "Harry Fishert",
    role: "Dev Full Stack & Founder",
    description: "Desarrollador Full Stack y fundador con experiencia en arquitectura de software y desarrollo de aplicaciones innovadoras. Líder técnico del proyecto Noosfera.",
    image: "/team/harry-fishert.jpg",
    accentColor: "#5b21b6",
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
    <div className="min-h-screen bg-white text-gray-900">
      <DarkNav activeLink="company" />

      {/* Hero */}
      <section className="py-20 text-center" style={{ background: "linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%)" }}>
        <div className="container mx-auto px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-4">
            Quiénes Somos
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Las Personas Detrás<br />
            <span className="text-purple-600">de Noosfera</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
            Un equipo dedicado a transformar la tecnología cardíaca en arte digital único e irrepetible.
          </motion.p>
        </div>
      </section>

      {/* Team Carousel */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}>
              {slide.type === "intro" ? (
                <div className="text-center py-16 rounded-2xl border border-gray-100 bg-gray-50">
                  <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">{slide.description}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="text-center order-2 lg:order-1">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-purple-600">
                      {slide.name}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {slide.role}
                    </h2>
                    <p className="text-gray-500 leading-relaxed max-w-md mx-auto">{slide.description}</p>
                  </div>

                  <div className="flex justify-center order-1 lg:order-2">
                    <div className="relative w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 overflow-hidden"
                      style={{
                        borderRadius: "44% 56% 52% 48% / 62% 58% 42% 38%",
                        border: `2px solid ${slide.accentColor}40`,
                        boxShadow: `0 0 0 8px ${slide.accentColor}08, 0 20px 60px rgba(124,58,237,0.15)`,
                        backgroundColor: "#f5f3ff",
                      }}>
                      {slide.image ? (
                        <img src={slide.image} alt={slide.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${slide.accentColor}15, #f5f3ff)` }}>
                          <span className="text-5xl font-black text-purple-600"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
                  backgroundColor: i === currentSlide ? "#7c3aed" : "#e5e7eb",
                }} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-4">Valores</p>
              <h2 className="text-4xl font-black text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Lo que nos mueve
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                  className="p-8 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all text-center">
                  <p className="text-5xl font-black mb-5 leading-none text-purple-100"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    0{i + 1}
                  </p>
                  <h3 className="text-lg font-black text-gray-900 mb-3">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)" }}>
        <div className="container mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500 mb-4">Únete</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Sé Parte de la Revolución
          </h2>
          <p className="text-gray-500 mb-10 max-w-md mx-auto text-sm leading-relaxed">
            El arte biométrico es el futuro. Tus latidos tienen valor — empieza a crearlos hoy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => navigate("/auth/login")}
              className="px-8 py-4 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#7c3aed" }}>
              Comenzar Ahora
            </button>
            <button onClick={() => navigate("/pricing")}
              className="px-8 py-4 rounded-full text-sm font-semibold text-gray-700 border border-gray-300 hover:border-purple-300 hover:text-purple-600 transition-all bg-white">
              Ver Planes
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
