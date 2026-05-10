"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Activity, Zap, Brain, Target } from "lucide-react"
import { useNoosfera } from "@/contexts/noosfera-context"

const AdvancedStatsWidget = () => {
  const { systemMetrics, brainwaveActivity, patternAnalysis, connectionStatus } = useNoosfera()
  const [animatedValues, setAnimatedValues] = useState({
    efficiency: 0,
    stability: 0,
    coherence: 0,
    focus: 0,
  })

  // Calcular métricas avanzadas
  const latestMetric =
    systemMetrics.length > 0
      ? systemMetrics[systemMetrics.length - 1]
      : {
          cpuUsage: 0,
          memoryUsage: 0,
          latency: 0,
          accuracy: 0,
        }

  const advancedStats = {
    efficiency: Math.min(100, (latestMetric.accuracy * brainwaveActivity) / 100),
    stability: patternAnalysis.patternStability,
    coherence: patternAnalysis.matchConfidence,
    focus: Math.min(100, (brainwaveActivity + patternAnalysis.complexityScore) / 2),
  }

  // Animar valores
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues((prev) => ({
        efficiency: prev.efficiency + (advancedStats.efficiency - prev.efficiency) * 0.1,
        stability: prev.stability + (advancedStats.stability - prev.stability) * 0.1,
        coherence: prev.coherence + (advancedStats.coherence - prev.coherence) * 0.1,
        focus: prev.focus + (advancedStats.focus - prev.focus) * 0.1,
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [advancedStats.efficiency, advancedStats.stability, advancedStats.coherence, advancedStats.focus])

  const getStatusColor = (value: number) => {
    if (value >= 80) return "text-emerald-500"
    if (value >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getStatusIcon = (value: number, prevValue = 0) => {
    if (value > prevValue) return <TrendingUp className="h-4 w-4 text-emerald-500" />
    if (value < prevValue) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Activity className="h-4 w-4 text-blue-500" />
  }

  const stats = [
    {
      label: "Eficiencia Neural",
      value: animatedValues.efficiency,
      icon: <Brain className="h-5 w-5 text-emerald-500" />,
      description: "Optimización del procesamiento cerebral",
    },
    {
      label: "Estabilidad",
      value: animatedValues.stability,
      icon: <Target className="h-5 w-5 text-blue-500" />,
      description: "Consistencia en patrones neuronales",
    },
    {
      label: "Coherencia",
      value: animatedValues.coherence,
      icon: <Zap className="h-5 w-5 text-violet-500" />,
      description: "Sincronización de ondas cerebrales",
    },
    {
      label: "Concentración",
      value: animatedValues.focus,
      icon: <Activity className="h-5 w-5 text-amber-500" />,
      description: "Nivel de enfoque mental",
    },
  ]

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          Estadísticas Avanzadas
          {connectionStatus === "connected" && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              En Vivo
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {stat.icon}
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${getStatusColor(stat.value)}`}>{Math.round(stat.value)}%</span>
                {getStatusIcon(stat.value)}
              </div>
            </div>

            <Progress value={stat.value} className="h-2" />

            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </motion.div>
        ))}

        {/* Resumen general */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rendimiento General</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-bold ${getStatusColor((animatedValues.efficiency + animatedValues.stability + animatedValues.coherence + animatedValues.focus) / 4)}`}
              >
                {Math.round(
                  (animatedValues.efficiency +
                    animatedValues.stability +
                    animatedValues.coherence +
                    animatedValues.focus) /
                    4,
                )}
                %
              </span>
              <Badge
                variant="outline"
                className={
                  (animatedValues.efficiency +
                    animatedValues.stability +
                    animatedValues.coherence +
                    animatedValues.focus) /
                    4 >=
                  80
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : (animatedValues.efficiency +
                          animatedValues.stability +
                          animatedValues.coherence +
                          animatedValues.focus) /
                          4 >=
                        60
                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                }
              >
                {(animatedValues.efficiency +
                  animatedValues.stability +
                  animatedValues.coherence +
                  animatedValues.focus) /
                  4 >=
                80
                  ? "Excelente"
                  : (animatedValues.efficiency +
                        animatedValues.stability +
                        animatedValues.coherence +
                        animatedValues.focus) /
                        4 >=
                      60
                    ? "Bueno"
                    : "Mejorando"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdvancedStatsWidget
