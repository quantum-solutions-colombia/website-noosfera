import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronRight, X, Send } from "lucide-react"

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

const N          = BASE_ITEMS.length
const INTERVAL   = 3000
const PERSPECTIVE = 1100
const VISIBLE    = 3

const CARD_W = 200
const CARD_H = 300
const RADIUS = 20

const BENEFITS = [
  "Derechos comerciales incluidos",
  "Regístrate en 30 segundos",
  "Arte único generado por IA",
]

function mod(n: number, m: number) { return ((n % m) + m) % m }

function getCardProps(offset: number) {
  const abs = Math.abs(offset)
  if (abs > VISIBLE) return null

  const rotateY    = offset * 40
  const translateX = offset * 160
  const translateZ = abs === 0 ? 130 : -abs * 55
  const opacity    = abs === 0 ? 1 : Math.max(0, 0.68 - abs * 0.16)
  const zIndex     = 20 - abs

  return { rotateY, translateX, translateZ, opacity, zIndex }
}

function ReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim() || rating === 0) return
    setSubmitted(true)
    setTimeout(() => onClose(), 2200)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="relative px-7 pt-7 pb-5"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
          <button onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: "rgba(255,255,255,0.18)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.28)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)" }}>
            <X className="w-4 h-4 text-white" />
          </button>
          <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-1">Comunidad</p>
          <h3 className="text-white font-black text-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Comparte tu experiencia
          </h3>
          <p className="text-purple-200 text-sm mt-1">Tu opinión ayuda a otros artistas a descubrir Noosfera</p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-7 py-10 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ background: "linear-gradient(135deg, #7c3aed22 0%, #5b21b622 100%)", border: "2px solid #7c3aed33" }}>
                🎉
              </div>
              <div>
                <p className="font-black text-gray-900 text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  ¡Gracias, {name}!
                </p>
                <p className="text-gray-500 text-sm mt-1">Tu reseña ha sido enviada con éxito.</p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="px-7 py-6 flex flex-col gap-5">

              {/* Star rating */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  ¿Cómo calificarías tu experiencia?
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 active:scale-95">
                      <Star
                        className="w-8 h-8 transition-colors"
                        style={{
                          fill: star <= (hoverRating || rating) ? "#f59e0b" : "none",
                          color: star <= (hoverRating || rating) ? "#f59e0b" : "#d1d5db",
                        }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label className="text-sm font-semibold text-gray-700">Tu nombre</label>
                <input
                  type="text"
                  placeholder="Ej. María García"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{
                    padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e5e7eb",
                    fontSize: 14, outline: "none", background: "#fafafa", color: "#111",
                    transition: "border-color 0.18s",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#7c3aed" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb" }}
                />
              </div>

              {/* Review text */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label className="text-sm font-semibold text-gray-700">Tu reseña</label>
                <textarea
                  placeholder="Cuéntanos sobre tu experiencia creando arte con Noosfera..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  required
                  rows={4}
                  style={{
                    padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e5e7eb",
                    fontSize: 14, outline: "none", background: "#fafafa", color: "#111",
                    resize: "none", fontFamily: "inherit", transition: "border-color 0.18s",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#7c3aed" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb" }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!name.trim() || !text.trim() || rating === 0}
                className="w-full py-3.5 rounded-xl font-bold text-white text-[15px] flex items-center justify-center gap-2 transition-all"
                style={{
                  background: (!name.trim() || !text.trim() || rating === 0) ? "#c4b5fd" : "#7c3aed",
                  cursor: (!name.trim() || !text.trim() || rating === 0) ? "not-allowed" : "pointer",
                }}
                onMouseEnter={e => { if (name.trim() && text.trim() && rating > 0) e.currentTarget.style.background = "#6d28d9" }}
                onMouseLeave={e => { if (name.trim() && text.trim() && rating > 0) e.currentTarget.style.background = "#7c3aed" }}>
                <Send className="w-4 h-4" />
                Enviar mi reseña
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export function RecentCreations() {
  const [active, setActive] = useState(0)
  const [showReviewModal, setShowReviewModal] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setActive(prev => mod(prev + 1, N)), INTERVAL)
    return () => clearInterval(id)
  }, [])

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

        {/* 3-D stage — fixed card size, circular corners always enforced */}
        <div className="relative flex items-center justify-center"
          style={{ height: CARD_H + 60, perspective: PERSPECTIVE }}>

          {BASE_ITEMS.map((item, idx) => {
            const offset = mod(idx - active + Math.floor(N / 2), N) - Math.floor(N / 2)
            const props = getCardProps(offset)
            if (!props) return null
            const { rotateY, translateX, translateZ, opacity, zIndex } = props
            const isActive = offset === 0

            return (
              <motion.div
                key={item.src}
                onClick={() => { if (!isActive) setActive(idx) }}
                animate={{
                  rotateY,
                  x: translateX,
                  z: translateZ,
                  opacity,
                  borderRadius: RADIUS,
                }}
                initial={false}
                transition={{ type: "spring", stiffness: 240, damping: 26 }}
                style={{
                  position: "absolute",
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: RADIUS,
                  overflow: "hidden",
                  zIndex,
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
                    filter: isActive ? "none" : "brightness(0.60) saturate(0.70)",
                    transition: "filter 0.45s ease",
                    display: "block",
                    borderRadius: RADIUS,
                  }} />
                {isActive && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.58) 0%, transparent 52%)",
                    borderRadius: RADIUS,
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

        {/* Dot navigation only — no arrows */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {BASE_ITEMS.map((_, idx) => (
            <button key={idx} onClick={() => setActive(idx)}
              className="rounded-full transition-all duration-300"
              style={{
                width: idx === active ? 28 : 8, height: 8,
                backgroundColor: idx === active ? "#7c3aed" : "#e5e7eb",
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
        <div className="flex flex-col lg:flex-row min-h-[480px]">

          {/* Left — image: reduced height, custom borders, only bottom signature cropped */}
          <motion.div
            className="lg:w-1/2 flex items-center justify-center p-6 lg:p-10"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div style={{
              width: "70%",
              aspectRatio: "3/4",
              borderRadius: "24px 4px 24px 4px",
              overflow: "hidden",
              border: "2px solid rgba(124,58,237,0.20)",
              outline: "4px solid rgba(124,58,237,0.07)",
            }}>
              <img
                src="/images/nft-castle-ai.png"
                alt="Castillo fantástico generado con IA"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                  display: "block",
                }} />
            </div>
          </motion.div>

          {/* Right — text content */}
          <motion.div className="lg:w-1/2 flex flex-col justify-center px-14 py-16 space-y-8"
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
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ backgroundColor: "#7c3aed" }}>
                Agrega tu reseña
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Review Modal ── */}
      <AnimatePresence>
        {showReviewModal && (
          <ReviewModal onClose={() => setShowReviewModal(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
