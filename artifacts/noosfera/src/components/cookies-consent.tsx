import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export function CookiesConsent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [hasHandled, setHasHandled] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const cookieConsent = localStorage.getItem("cookies-consent")
    if (!cookieConsent) {
      const timer = setTimeout(() => setIsOpen(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = useCallback(() => {
    if (hasHandled) return
    setHasHandled(true)
    localStorage.setItem("cookies-consent", "accepted")
    setIsOpen(false)
  }, [hasHandled])

  const handleReject = useCallback(() => {
    if (hasHandled) return
    setHasHandled(true)
    localStorage.setItem("cookies-consent", "rejected")
    setIsOpen(false)
  }, [hasHandled])

  if (!isMounted) return null

  return (
    <AnimatePresence>
      {isOpen && !hasHandled && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
        >
          <div
            style={{
              background: "linear-gradient(135deg, rgba(20,10,40,0.97) 0%, rgba(30,14,60,0.97) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(124,58,237,0.35)",
              boxShadow: "0 -4px 40px rgba(124,58,237,0.18), 0 8px 40px rgba(0,0,0,0.35)",
            }}
            className="w-full max-w-5xl mx-auto rounded-2xl px-6 py-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">

              {/* Icon + text */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.4)" }}>
                  <span className="text-lg">🍪</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1"
                    style={{ color: "#a78bfa" }}>
                    Política de Cookies
                  </p>
                  <p className="text-[13px] leading-relaxed text-white/70">
                    Usamos cookies esenciales para mejorar tu experiencia en Noosfera.{" "}
                    <a href="/cookies"
                      className="transition-colors hover:underline underline-offset-2"
                      style={{ color: "#c4b5fd" }}>
                      Más información
                    </a>
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleReject}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.55)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.10)"
                    e.currentTarget.style.color = "rgba(255,255,255,0.80)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)"
                    e.currentTarget.style.color = "rgba(255,255,255,0.55)"
                  }}>
                  Rechazar
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-white"
                  style={{ background: "#7c3aed" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#6d28d9" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#7c3aed" }}>
                  Aceptar todo
                </button>
                <button
                  onClick={handleReject}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all ml-1"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)" }}>
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
