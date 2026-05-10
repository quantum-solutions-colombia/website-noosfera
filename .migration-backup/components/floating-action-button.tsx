"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Zap, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useNoosfera } from "@/contexts/noosfera-context"
import { toast } from "@/hooks/use-toast"

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { connectionStatus, processingThought, captureThought, generateContent, currentThoughtPattern } = useNoosfera()

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleCaptureThought = async () => {
    if (connectionStatus !== "connected" || processingThought) {
      toast({
        title: "Error",
        description: "El BCI debe estar conectado para capturar pensamientos",
        variant: "destructive",
      })
      return
    }

    try {
      await captureThought()
      toast({
        title: "Éxito",
        description: "Pensamiento capturado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al capturar el pensamiento",
        variant: "destructive",
      })
    } finally {
      setIsOpen(false)
    }
  }

  const handleSettings = () => {
    toast({
      title: "Configuración",
      description: "Abriendo configuración...",
    })
    // Navegar a la sección de configuración
    const settingsSection = document.getElementById("settings-panel")
    if (settingsSection) {
      settingsSection.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  const isConnected = connectionStatus === "connected"

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <div className="absolute bottom-16 right-0 flex flex-col items-end space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-end space-y-2"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={handleCaptureThought}
                      disabled={!isConnected || processingThought}
                    >
                      <Zap className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" sideOffset={5}>
                    Capturar pensamiento
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleSettings}>
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" sideOffset={5}>
                    Configuración
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg"
            onClick={toggleMenu}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Brain className="h-6 w-6" />}
              </motion.div>
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </TooltipProvider>
  )
}
