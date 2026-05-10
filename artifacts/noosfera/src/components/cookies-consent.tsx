import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 w-72"
        >
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-black/[0.06] dark:border-white/[0.07] px-5 py-4">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-2">
              Cookies
            </p>
            <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Usamos cookies esenciales para mejorar tu experiencia.{" "}
              <a href="/cookies" className="text-emerald-600 hover:text-emerald-700 transition-colors underline-offset-2 hover:underline">
                Más info
              </a>
            </p>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleAccept}
                className="text-[12px] font-semibold tracking-wide text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                — Aceptar
              </button>
              <span className="text-zinc-200 dark:text-zinc-700 select-none">|</span>
              <button
                onClick={handleReject}
                className="text-[12px] font-semibold tracking-wide text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                — Rechazar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
