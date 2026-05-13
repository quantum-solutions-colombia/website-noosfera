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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:px-6 sm:pb-5"
        >
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #7c3aed",
              boxShadow: "0 4px 32px rgba(124,58,237,0.13), 0 1px 8px rgba(0,0,0,0.07)",
              borderRadius: 16,
            }}
            className="w-full max-w-5xl mx-auto px-5 py-3.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-0.5"
                  style={{ color: "#7c3aed" }}>
                  Política de Cookies
                </p>
                <p className="text-[12.5px] leading-snug text-gray-600">
                  Usamos cookies esenciales para mejorar tu experiencia en Noosfera.{" "}
                  <a href="/cookies"
                    className="transition-colors hover:underline underline-offset-2"
                    style={{ color: "#7c3aed" }}>
                    Más información
                  </a>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleReject}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: "transparent",
                    border: "1.5px solid #e5e7eb",
                    color: "#6b7280",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#7c3aed"
                    e.currentTarget.style.color = "#7c3aed"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#e5e7eb"
                    e.currentTarget.style.color = "#6b7280"
                  }}>
                  Rechazar
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all text-white"
                  style={{ background: "#7c3aed" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#6d28d9" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#7c3aed" }}>
                  Aceptar todo
                </button>
                <button
                  onClick={handleReject}
                  className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
                  style={{ background: "#f3f4f6" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#e5e7eb" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6" }}>
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
