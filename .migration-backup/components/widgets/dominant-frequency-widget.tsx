"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Waves, Activity, Brain, Zap } from "lucide-react"
import { useNoosfera } from "@/contexts/noosfera-context"

const DominantFrequencyWidget = () => {
  const { patternAnalysis, brainwaveActivity, connectionStatus } = useNoosfera()
  const [animatedFrequencies, setAnimatedFrequencies] = useState({
    alpha: 0,
    beta: 0,
    theta: 0,
    delta: 0,
    gamma: 0,
  })

  // Simular frecuencias dominantes basadas en el análisis de patrones
  const frequencies = {
    alpha: Math.max(0, Math.min(100, brainwaveActivity * 0.8 + Math.random() * 20)),
    beta: Math.max(0, Math.min(100, patternAnalysis.complexityScore * 0.9 + Math.random() * 15)),
    theta: Math.max(0, Math.min(100, (100 - brainwaveActivity) * 0.6 + Math.random() * 25)),
    delta: Math.max(0, Math.min(100, patternAnalysis.patternStability * 0.4 + Math.random() * 10)),
    gamma: Math.max(0, Math.min(100, patternAnalysis.matchConfidence * 0.7 + Math.random() * 20)),
  }

  // Animar valores
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedFrequencies((prev) => ({
        alpha: prev.alpha + (frequencies.alpha - prev.alpha) * 0.1,
        beta: prev.beta + (frequencies.beta - prev.beta) * 0.1,
        theta: prev.theta + (frequencies.theta - prev.theta) * 0.1,
        delta: prev.delta + (frequencies.delta - prev.delta) * 0.1,
        gamma: prev.gamma + (frequencies.gamma - prev.gamma) * 0.1,
      }))
    }, 150)

    return () => clearInterval(interval)
  }, [frequencies.alpha, frequencies.beta, frequencies.theta, frequencies.delta, frequencies.gamma])

  // Determinar frecuencia dominante
  const dominantFreq = Object.entries(animatedFrequencies).reduce((a, b) =>
    animatedFrequencies[a[0] as keyof typeof animatedFrequencies] >
    animatedFrequencies[b[0] as keyof typeof animatedFrequencies]
      ? a
      : b,
  )

  const frequencyData = [
    {
      name: "Alpha",
      value: animatedFrequencies.alpha,
      range: "8-12 Hz",
      color: "bg-emerald-500",
      description: "Relajación consciente",
      icon: <Waves className="h-4 w-4" />,
    },
    {
      name: "Beta",
      value: animatedFrequencies.beta,
      range: "13-30 Hz",
      color: "bg-blue-500",
      description: "Concentración activa",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      name: "Theta",
      value: animatedFrequencies.theta,
      range: "4-7 Hz",
      color: "bg-violet-500",
      description: "Creatividad profunda",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      name: "Delta",
      value: animatedFrequencies.delta,
      range: "0.5-3 Hz",
      color: "bg-indigo-500",
      description: "Sueño profundo",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      name: "Gamma",
      value: animatedFrequencies.gamma,
      range: "31-100 Hz",
      color: "bg-amber-500",
      description: "Procesamiento complejo",
      icon: <Waves className="h-4 w-4" />,
    },
  ]

  const getDominantFrequencyInfo = () => {
    const dominant = frequencyData.find((f) => f.name.toLowerCase() === dominantFreq[0])
    return dominant || frequencyData[0]
  }

  const dominantInfo = getDominantFrequencyInfo()

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-emerald-500" />
          Frecuencias Dominantes
          {connectionStatus === "connected" && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              Activo
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Frecuencia dominante destacada */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {dominantInfo.icon}
              <span className="font-semibold">{dominantInfo.name} Dominante</span>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              {Math.round(dominantInfo.value)}%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{dominantInfo.description}</p>
          <p className="text-xs text-muted-foreground mt-1">{dominantInfo.range}</p>
        </motion.div>

        {/* Lista de todas las frecuencias */}
        <div className="space-y-4">
          {frequencyData.map((freq, index) => (
            <motion.div
              key={freq.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${freq.color}`} />
                  <span className="text-sm font-medium">{freq.name}</span>
                  <span className="text-xs text-muted-foreground">({freq.range})</span>
                </div>
                <span className="text-sm font-bold">{Math.round(freq.value)}%</span>
              </div>

              <Progress value={freq.value} className="h-2" />

              <p className="text-xs text-muted-foreground">{freq.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-emerald-500">
                {Math.round((animatedFrequencies.alpha + animatedFrequencies.beta) / 2)}%
              </div>
              <div className="text-xs text-muted-foreground">Estado Consciente</div>
            </div>
            <div>
              <div className="text-lg font-bold text-violet-500">
                {Math.round((animatedFrequencies.theta + animatedFrequencies.delta) / 2)}%
              </div>
              <div className="text-xs text-muted-foreground">Estado Subconsciente</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DominantFrequencyWidget
