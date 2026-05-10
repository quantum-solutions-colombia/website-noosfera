"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNoosfera } from "@/contexts/noosfera-context"
import { Clock, Brain, FileText, ImageIcon, Zap, Activity } from "lucide-react"

interface TimelineEvent {
  id: string
  type: "connection" | "capture" | "generation" | "analysis"
  title: string
  description: string
  timestamp: number
  icon: JSX.Element
  color: string
}

interface ActivityTimelineProps {
  fullscreen?: boolean
}

export default function ActivityTimeline({ fullscreen = false }: ActivityTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const { connectionStatus, processingThought, generatedContent } = useNoosfera()

  // Generar eventos basados en cambios de estado
  useEffect(() => {
    if (connectionStatus === "connected") {
      addEvent({
        type: "connection",
        title: "BCI Conectado",
        description: "Interfaz cerebro-computadora conectada y calibrada correctamente",
        icon: <Zap className="h-4 w-4" />,
        color: "bg-emerald-500",
      })
    } else if (connectionStatus === "disconnected" && events.length > 0) {
      addEvent({
        type: "connection",
        title: "BCI Desconectado",
        description: "Interfaz cerebro-computadora desconectada",
        icon: <Zap className="h-4 w-4" />,
        color: "bg-red-500",
      })
    }
  }, [connectionStatus])

  // Evento cuando se captura un pensamiento
  useEffect(() => {
    if (processingThought) {
      addEvent({
        type: "capture",
        title: "Capturando Pensamiento",
        description: "Procesando patrones neuronales",
        icon: <Brain className="h-4 w-4" />,
        color: "bg-blue-500",
      })
    }
  }, [processingThought])

  // Evento cuando se genera contenido
  useEffect(() => {
    if (generatedContent.length > 0) {
      const latestContent = generatedContent[0]

      // Verificar si ya existe un evento para este contenido
      const exists = events.some((event) => event.type === "generation" && event.id.includes(latestContent.id))

      if (!exists) {
        addEvent({
          type: "generation",
          title: `${latestContent.type === "text" ? "Texto" : "Imagen"} Generado`,
          description:
            latestContent.type === "text"
              ? latestContent.content.substring(0, 50) + "..."
              : "Visualización basada en patrones neuronales",
          icon: latestContent.type === "text" ? <FileText className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />,
          color: latestContent.type === "text" ? "bg-violet-500" : "bg-amber-500",
        })
      }
    }
  }, [generatedContent])

  // Añadir evento a la línea de tiempo
  const addEvent = (event: Omit<TimelineEvent, "id" | "timestamp">) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: `${event.type}-${Date.now()}`,
      timestamp: Date.now(),
    }

    setEvents((prev) => [newEvent, ...prev].slice(0, 50)) // Mantener hasta 50 eventos
  }

  // Formatear tiempo relativo
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) {
      return "hace unos segundos"
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`
    } else {
      const days = Math.floor(diff / 86400000)
      return `hace ${days} ${days === 1 ? "día" : "días"}`
    }
  }

  // Formatear fecha completa
  const formatFullDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-500" />
          {fullscreen ? "Historial de Actividad" : "Actividad del Sistema"}
        </CardTitle>
        <CardDescription>
          {fullscreen
            ? "Registro completo de todas las actividades y eventos del sistema"
            : "Historial de eventos recientes"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={`${fullscreen ? "h-[600px]" : "h-[300px]"} pr-4`}>
          <div className="relative pl-6 border-l">
            <AnimatePresence initial={false}>
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 relative"
                >
                  {/* Punto en la línea de tiempo */}
                  <div
                    className={`absolute -left-[22px] w-4 h-4 rounded-full ${event.color} flex items-center justify-center`}
                  >
                    {event.icon}
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{event.title}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {fullscreen ? formatFullDate(event.timestamp) : formatRelativeTime(event.timestamp)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>

                    {fullscreen && (
                      <div className="mt-2 pt-2 border-t border-muted text-xs text-muted-foreground">
                        <span>ID: {event.id}</span>
                        <span className="ml-4">Tipo: {event.type}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {events.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <p>No hay actividad reciente</p>
                <p className="text-sm mt-1">Conecta el BCI para comenzar</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
