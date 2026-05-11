import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useLocation } from "wouter"
import { BadgeCheck, Zap, ShieldCheck, Users, ImageIcon, Globe } from "lucide-react"

const ITEMS = [
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

const CARD_W        = 170
const CARD_H        = 240
const CARD_W_ACTIVE = 250
const CARD_H_ACTIVE = 360
const GAP           = 16
const INTERVAL      = 2800

const BENEFITS = [
  { icon: BadgeCheck, label: "Derechos comerciales" },
  { icon: Zap,        label: "Regístrate en 30 segundos" },
  { icon: ShieldCheck,label: "100% seguro y privado" },
]

const STATS = [
  { icon: Users,     value: "50,000+", label: "Creadores activos" },
  { icon: ImageIcon, value: "200,000+",label: "NFTs generados" },
  { icon: Globe,     value: "120+",    label: "Países en la red" },
]

export function RecentCreations() {
  const [active, setActive] = useState(2)
  const trackRef = useRef<HTMLDivElement>(null)
  const [, navigate] = useLocation()

  /* ── auto-advance ── */
  useEffect(() => {
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % ITEMS.length)
    }, INTERVAL)
    return () => clearInterval(id)
  }, [])

  /* ── keep active card centered ── */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[active] as HTMLElement
    if (!card) return
    const trackRect = track.getBoundingClientRect()
    const cardRect  = card.getBoundingClientRect()
    track.scrollBy({
      left: cardRect.left - trackRect.left - trackRect.width / 2 + cardRect.width / 2,
      behavior: "smooth",
    })
  }, [active])

  return (
    <>
      {/* ── Carousel ── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6 mb-10 text-center">
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500 mb-3"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} viewport={{ once: true }}
          >
            Comunidad
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-black text-gray-900"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }} viewport={{ once: true }}
          >
            Creaciones Recientes
          </motion.h2>
        </div>

        {/* Track — items-center so active card expands from the middle */}
        <div
          ref={trackRef}
          className="flex items-center overflow-x-auto pb-4 px-8"
          style={{
            gap: GAP,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            userSelect: "none",
          }}
        >
          {ITEMS.map((item, idx) => {
            const isActive = idx === active
            return (
              <div
                key={item.src}
                className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                style={{
                  width:  isActive ? CARD_W_ACTIVE : CARD_W,
                  height: isActive ? CARD_H_ACTIVE : CARD_H,
                  transition: "width 0.5s cubic-bezier(.4,0,.2,1), height 0.5s cubic-bezier(.4,0,.2,1)",
                  boxShadow: isActive
                    ? "0 28px 64px rgba(124,58,237,0.32)"
                    : "0 4px 16px rgba(0,0,0,0.09)",
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  style={{
                    filter: isActive ? "none" : "brightness(0.70) saturate(0.80)",
                    transition: "filter 0.5s ease",
                  }}
                />
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                )}
                {isActive && (
                  <p className="absolute bottom-4 left-4 text-white text-sm font-bold tracking-wide">
                    {item.title}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {ITEMS.map((_, idx) => (
            <div
              key={idx}
              className="rounded-full"
              style={{
                width:  idx === active ? 28 : 8,
                height: 8,
                backgroundColor: idx === active ? "#7c3aed" : "#e5e7eb",
                transition: "width 0.4s ease, background-color 0.4s ease",
              }}
            />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.h2
            className="text-2xl md:text-3xl font-black mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} viewport={{ once: true }}
          >
            <span className="text-purple-600">Únete a millones de personas</span>{" "}
            <span className="text-gray-900">en la creación de imágenes con IA.</span>
          </motion.h2>

          <motion.p
            className="text-gray-500 mb-10"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }} viewport={{ once: true }}
          >
            Comienza tu propio viaje creativo con Noosfera.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-8"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }} viewport={{ once: true }}
          >
            {BENEFITS.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-full"
                  style={{ backgroundColor: "#f5f3ff" }}
                >
                  <Icon className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                </span>
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats / Social Proof ── */}
      <section className="py-16 border-t border-gray-100" style={{ background: "linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)" }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto text-center">
            {STATS.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className="flex flex-col items-center gap-3"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "white", boxShadow: "0 4px 20px rgba(124,58,237,0.14)" }}
                >
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-4xl font-black text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {value}
                </p>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
