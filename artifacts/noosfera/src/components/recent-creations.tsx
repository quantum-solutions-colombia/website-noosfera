import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useLocation } from "wouter"
import { Star, ChevronRight } from "lucide-react"

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

const ITEMS = [...BASE_ITEMS, ...BASE_ITEMS, ...BASE_ITEMS]
const N = BASE_ITEMS.length

const CARD_W        = 170
const CARD_H        = 240
const CARD_W_ACTIVE = 250
const CARD_H_ACTIVE = 360
const GAP           = 16
const INTERVAL      = 2800

const BENEFITS = [
  "Derechos comerciales incluidos",
  "Regístrate en 30 segundos",
  "Arte único generado por IA",
]

export function RecentCreations() {
  const [active, setActive] = useState(N + 2)
  const trackRef  = useRef<HTMLDivElement>(null)
  const skipAnim  = useRef(false)
  const [, navigate] = useLocation()

  const centerActive = useCallback((idx: number, smooth: boolean) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[idx] as HTMLElement
    if (!card) return
    track.scrollTo({
      left: card.offsetLeft - track.clientWidth / 2 + card.clientWidth / 2,
      behavior: smooth ? "smooth" : "instant",
    })
  }, [])

  useEffect(() => {
    const id = setInterval(() => setActive(prev => prev + 1), INTERVAL)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (skipAnim.current) {
      centerActive(active, false)
      skipAnim.current = false
      return
    }
    centerActive(active, true)
    if (active >= N * 2) {
      const target = active - N
      skipAnim.current = true
      setTimeout(() => setActive(target), 500)
    }
    if (active < N) {
      const target = active + N
      skipAnim.current = true
      setTimeout(() => setActive(target), 500)
    }
  }, [active, centerActive])

  const dotIndex = (active % N + N) % N

  return (
    <>
      {/* ── Carousel ── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6 mb-10 text-center">
          <motion.p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500 mb-3"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} viewport={{ once: true }}>
            Comunidad
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-black text-gray-900 text-center"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }} viewport={{ once: true }}>
            Creaciones Recientes
          </motion.h2>
        </div>

        <div ref={trackRef}
          className="flex items-center overflow-x-hidden pb-4 px-8"
          style={{ gap: GAP, userSelect: "none" }}>
          {ITEMS.map((item, idx) => {
            const isActive = idx === active
            return (
              <div key={`${item.src}-${idx}`}
                className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                style={{
                  width:  isActive ? CARD_W_ACTIVE : CARD_W,
                  height: isActive ? CARD_H_ACTIVE : CARD_H,
                  transition: skipAnim.current ? "none" : "width 0.5s cubic-bezier(.4,0,.2,1), height 0.5s cubic-bezier(.4,0,.2,1)",
                  boxShadow: isActive ? "0 28px 64px rgba(124,58,237,0.32)" : "0 4px 16px rgba(0,0,0,0.09)",
                }}>
                <img src={item.src} alt={item.title}
                  className="w-full h-full object-cover"
                  style={{ filter: isActive ? "none" : "brightness(0.70) saturate(0.80)", transition: "filter 0.5s ease" }} />
                {isActive && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />}
                {isActive && <p className="absolute bottom-4 left-4 text-white text-sm font-bold tracking-wide">{item.title}</p>}
              </div>
            )
          })}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {BASE_ITEMS.map((_, idx) => (
            <div key={idx} className="rounded-full"
              style={{
                width: idx === dotIndex ? 28 : 8, height: 8,
                backgroundColor: idx === dotIndex ? "#7c3aed" : "#e5e7eb",
                transition: "width 0.4s ease, background-color 0.4s ease",
              }} />
          ))}
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
        <div className="flex flex-col lg:flex-row min-h-[520px]">

          {/* Left — big ghost image filling full column */}
          <motion.div className="lg:w-1/2 min-h-[320px] lg:min-h-0"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <img src="/images/nft-ghost.png" alt="Fantasma digital"
              className="w-full h-full object-cover"
              style={{ minHeight: 420 }} />
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

            {/* Reviewer info + Stars in same row */}
            <div className="flex items-center gap-4 justify-center flex-wrap">
              {/* Avatar + name + label */}
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

              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            {/* Quote — centered */}
            <blockquote className="text-gray-700 leading-relaxed text-center">
              Noosfera es{" "}
              <span className="text-purple-600 font-semibold">algo verdaderamente increíble</span>
              , puedes crear retratos únicos, obras abstractas y arte digital que nunca se
              repite — todo desde tus propios datos cardíacos.
            </blockquote>

            {/* CTA button */}
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
