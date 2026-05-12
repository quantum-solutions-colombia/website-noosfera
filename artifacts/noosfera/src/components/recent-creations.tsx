import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "wouter"
import { Star, ChevronRight, ChevronLeft } from "lucide-react"

const BASE_ITEMS = [
  { src: "/images/nft-1.png",  title: "Forest Spirit" },
  { src: "/images/nft-2.png",  title: "Neon Noir" },
  { src: "/images/nft-3.png",  title: "Dark Abyss" },
  { src: "/images/nft-4.png",  title: "Crane Dream" },
  { src: "/images/nft-5.png",  title: "Cosmic Panda" },
  { src: "/images/nft-6.png",  title: "Aurora Wolf" },
  { src: "/images/nft-7.png",  title: "Fire Dragon" },
  { src: "/images/nft-8.png",  title: "Deep Mermaid" },
  { src: "/images/nft-9.png",  title: "Golden Samurai" },
  { src: "/images/nft-10.png", title: "Phoenix Rise" },
]

const N = BASE_ITEMS.length
const INTERVAL = 3000
const PERSPECTIVE = 1100
const VISIBLE = 3

const BENEFITS = [
  "Derechos comerciales incluidos",
  "Regístrate en 30 segundos",
  "Arte único generado por IA",
]

function mod(n: number, m: number) { return ((n % m) + m) % m }

function getCardProps(offset: number) {
  const abs = Math.abs(offset)
  if (abs > VISIBLE) return null

  const sign = Math.sign(offset)
  const rotateY   = offset * 38
  const translateX = offset * 148
  const translateZ = abs === 0 ? 140 : -abs * 60
  const scale      = abs === 0 ? 1 : 0.82 ** abs
  const opacity    = abs === 0 ? 1 : Math.max(0, 0.72 - abs * 0.18)
  const zIndex     = 20 - abs
  const width      = abs === 0 ? 240 : 170
  const height     = abs === 0 ? 350 : 240

  return { rotateY, translateX, translateZ, scale, opacity, zIndex, width, height }
}

export function RecentCreations() {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const [, navigate] = useLocation()

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1)
      setActive(prev => mod(prev + 1, N))
    }, INTERVAL)
    return () => clearInterval(id)
  }, [])

  const prev = () => {
    setDir(-1)
    setActive(p => mod(p - 1, N))
  }
  const next = () => {
    setDir(1)
    setActive(p => mod(p + 1, N))
  }

  return (
    <>
      {/* ── 3D Cube Carousel ── */}
      <section className="py-20 bg-white overflow-hidden select-none">
        <div className="container mx-auto px-6 mb-12 text-center">
          <motion.p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500 mb-3"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} viewport={{ once: true }}>
            Comunidad
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-black text-gray-900"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }} viewport={{ once: true }}>
            Creaciones Recientes
          </motion.h2>
        </div>

        {/* 3-D stage */}
        <div className="relative flex items-center justify-center"
          style={{ height: 400, perspective: PERSPECTIVE }}>

          {BASE_ITEMS.map((item, idx) => {
            const offset = mod(idx - active + Math.floor(N / 2), N) - Math.floor(N / 2)
            const props = getCardProps(offset)
            if (!props) return null
            const { rotateY, translateX, translateZ, scale, opacity, zIndex, width, height } = props
            const isActive = offset === 0

            return (
              <motion.div
                key={item.src}
                onClick={() => { if (!isActive) { setDir(offset > 0 ? 1 : -1); setActive(idx) } }}
                animate={{
                  rotateY,
                  x: translateX,
                  z: translateZ,
                  scale,
                  opacity,
                  width,
                  height,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                style={{
                  position: "absolute",
                  zIndex,
                  borderRadius: 20,
                  overflow: "hidden",
                  transformStyle: "preserve-3d",
                  cursor: isActive ? "default" : "pointer",
                  willChange: "transform, opacity",
                }}>
                <img
                  src={item.src}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: isActive ? "none" : "brightness(0.65) saturate(0.75)",
                    transition: "filter 0.5s ease",
                    display: "block",
                  }} />
                {isActive && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 55%)",
                  }} />
                )}
                {isActive && (
                  <p style={{
                    position: "absolute", bottom: 14, left: 14,
                    color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em",
                  }}>{item.title}</p>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Dots + arrow controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={prev}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-purple-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {BASE_ITEMS.map((_, idx) => (
              <button key={idx} onClick={() => { setDir(idx > active ? 1 : -1); setActive(idx) }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: idx === active ? 28 : 8, height: 8,
                  backgroundColor: idx === active ? "#7c3aed" : "#e5e7eb",
                }} />
            ))}
          </div>
          <button onClick={next}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-purple-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.h2 className="text-2xl md:text-3xl font-black mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <span className="text-purple-600">Únete a millones de personas</span>{" "}
            <span className="text-gray-900">en la creación de imágenes con IA.</span>
          </motion.h2>
          <motion.p className="text-gray-500 mb-10"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }} viewport={{ once: true }}>
            Comienza tu propio viaje creativo con Noosfera.
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-8"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }} viewport={{ once: true }}>
            {BENEFITS.map(label => (
              <span key={label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span className="text-purple-600 font-black text-base">✓</span>
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonial / Feature Section ── */}
      <section className="overflow-hidden border-t border-gray-100 bg-white">
        <div className="flex flex-col lg:flex-row min-h-[480px]">

          {/* Left — image with custom borders, reduced height, signature cropped */}
          <motion.div
            className="lg:w-1/2 flex items-center justify-center p-6 lg:p-10"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div style={{
              width: "100%",
              maxHeight: 400,
              borderRadius: "24px 4px 24px 4px",
              overflow: "hidden",
              border: "2px solid rgba(124,58,237,0.20)",
              outline: "4px solid rgba(124,58,237,0.07)",
            }}>
              <img
                src="/images/nft-ghost.png"
                alt="Fantasma digital"
                style={{
                  width: "100%",
                  height: 400,
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }} />
            </div>
          </motion.div>

          {/* Right — text content */}
          <motion.div className="lg:w-1/2 flex flex-col justify-center px-10 py-14 space-y-6"
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }} viewport={{ once: true }}>

            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight text-center"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Crea Arte Digital con IA
            </h2>

            <p className="text-gray-500 leading-relaxed text-center">
              Conecta tus latidos y observa cómo nuestra IA transforma tus patrones cardíacos
              en obras visuales únicas e irrepetibles.
            </p>

            {/* Reviewer info + Stars */}
            <div className="flex items-center gap-4 justify-center flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: "#7c3aed" }}>
                  MC
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-tight">María Camila</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Usuario verificado</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            <blockquote className="text-gray-700 leading-relaxed text-center">
              Noosfera es{" "}
              <span className="text-purple-600 font-semibold">algo verdaderamente increíble</span>
              , puedes crear retratos únicos, obras abstractas y arte digital que nunca se
              repite — todo desde tus propios datos cardíacos.
            </blockquote>

            <div className="flex justify-center">
              <button
                onClick={() => navigate("/auth/login")}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ backgroundColor: "#7c3aed" }}>
                Agrega tu reseña
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
