import { useRef, useState } from "react"
import { motion } from "framer-motion"

const ITEMS = [
  { src: "/images/nft-1.png", title: "Forest Spirit" },
  { src: "/images/nft-2.png", title: "Neon Noir" },
  { src: "/images/nft-3.png", title: "Dark Abyss" },
  { src: "/images/nft-4.png", title: "Crane Dream" },
  { src: "/images/nft-5.png", title: "Cosmic Panda" },
  { src: "/images/nft-6.png", title: "Aurora Wolf" },
]

export function RecentCreations() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(2)

  const scrollTo = (idx: number) => {
    setActive(idx)
    const track = trackRef.current
    if (!track) return
    const card = track.children[idx] as HTMLElement
    if (!card) return
    const trackRect = track.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    track.scrollBy({
      left: cardRect.left - trackRect.left - trackRect.width / 2 + cardRect.width / 2,
      behavior: "smooth",
    })
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6 mb-10 text-center">
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500 mb-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Comunidad
        </motion.p>
        <motion.h2
          className="text-4xl md:text-5xl font-black text-gray-900"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          viewport={{ once: true }}
        >
          Creaciones Recientes
        </motion.h2>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-4 px-6 md:px-12 lg:px-24 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {ITEMS.map((item, idx) => {
          const isActive = idx === active
          return (
            <motion.div
              key={item.src}
              onClick={() => scrollTo(idx)}
              className="relative flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden"
              style={{
                width: isActive ? 220 : 160,
                height: isActive ? 310 : 225,
                transition: "width 0.4s ease, height 0.4s ease",
                boxShadow: isActive
                  ? "0 24px 60px rgba(124,58,237,0.28)"
                  : "0 6px 20px rgba(0,0,0,0.10)",
              }}
              whileHover={{ scale: isActive ? 1 : 1.03 }}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover"
                style={{
                  filter: isActive ? "none" : "brightness(0.85)",
                  transition: "filter 0.4s ease",
                }}
              />
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              )}
              {isActive && (
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-white text-sm font-bold">{item.title}</p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {ITEMS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className="rounded-full transition-all"
            style={{
              width: idx === active ? 24 : 8,
              height: 8,
              backgroundColor: idx === active ? "#7c3aed" : "#e5e7eb",
              transition: "width 0.3s ease, background-color 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  )
}
