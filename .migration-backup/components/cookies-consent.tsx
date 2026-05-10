"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookiesConsent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [hasHandled, setHasHandled] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const cookieConsent = localStorage.getItem("cookies-consent")
    if (!cookieConsent) {
      const timer = setTimeout(() => setIsOpen(true), 1000)
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
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                    className="flex-shrink-0 mt-1"
                  >
                    <Cookie className="h-6 w-6 text-amber-500" />
                  </motion.div>

                  <div>
                    <h3 className="font-bold text-base text-gray-900 mb-1">
                      Politica de Cookies
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Utilizamos cookies esenciales para mejorar tu experiencia en Noosfera. Algunas cookies son 
                      obligatorias para el funcionamiento del sitio. Al hacer clic en "Aceptar Cookies", aceptas nuestra politica.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReject}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 ml-10">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white" 
                    onClick={handleAccept}
                  >
                    Aceptar Cookies
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 hover:bg-gray-50"
                    onClick={handleReject}
                  >
                    Rechazar
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
