"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useNoosfera } from "@/contexts/noosfera-context"
import { Power, Zap, Activity, Signal, AlertTriangle } from "lucide-react"

export default function ConnectionStatus() {
  const {
    connectionStatus,
    signalStrength,
    cardiacActivity,
    systemLoad,
    connect,
    disconnect,
    processingCardiac,
    captureCardiacData,
  } = useNoosfera()

  const [showPulse, setShowPulse] = useState(false)

  // Efecto de pulso cuando la señal es fuerte
  useEffect(() => {
    if (signalStrength > 85) {
      setShowPulse(true)
      const timer = setTimeout(() => setShowPulse(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [signalStrength])

  const handleConnectionToggle = () => {
    if (connectionStatus === "connected") {
      disconnect()
    } else {
      connect()
    }
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-emerald-500"
      case "connecting":
      case "calibrating":
        return "bg-amber-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-red-500"
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Conectado"
      case "connecting":
        return "Conectando"
      case "calibrating":
        return "Calibrando"
      case "error":
        return "Error"
      default:
        return "Desconectado"
    }
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Signal className="h-5 w-5 text-emerald-500" />
      case "connecting":
      case "calibrating":
        return <Activity className="h-5 w-5 text-amber-500" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Power className="h-5 w-5 text-muted-foreground" />
    }
  }

  const brainwaveActivity = cardiacActivity

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getConnectionIcon()}
          Estado del Sistema
        </CardTitle>
        <CardDescription>Conexión cardiaca y estado del procesamiento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <div className="flex justify-between mb-1">
              <span>Intensidad de señal</span>
              <span className="font-medium">{Math.round(signalStrength)}%</span>
            </div>
            <div className="relative">
              <Progress value={signalStrength} className="h-2" />
              <AnimatePresence>
                {showPulse && (
                  <motion.div
                    className="absolute inset-0 bg-emerald-500/30 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Actividad Cardiaca</span>
              <span className="font-medium">{brainwaveActivity}%</span>
            </div>
            <Progress value={brainwaveActivity} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Carga del sistema</span>
              <span className="font-medium">{systemLoad}%</span>
            </div>
            <Progress value={systemLoad} className="h-2" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-muted/50 mt-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${getConnectionStatusColor()}`}></div>
              <span className="font-medium">{getConnectionStatusText()}</span>
            </div>

            {connectionStatus === "connected" && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-xs text-emerald-500 font-medium"
              >
                Activo
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          onClick={handleConnectionToggle}
          disabled={connectionStatus === "connecting" || connectionStatus === "calibrating"}
          className={`w-full ${
            connectionStatus === "connected" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          <Power className="mr-2 h-4 w-4" />
          {connectionStatus === "connected"
            ? "Desconectar Monitor"
            : connectionStatus === "connecting"
              ? "Conectando..."
              : connectionStatus === "calibrating"
                ? "Calibrando..."
                : "Conectar Monitor"}
        </Button>

        {connectionStatus === "connected" && (
          <Button
            onClick={() => captureCardiacData()}
            disabled={processingCardiac}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Zap className="mr-2 h-4 w-4" />
            {processingCardiac ? "Procesando..." : "Capturar Datos Cardíacos"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
