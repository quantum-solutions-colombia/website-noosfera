"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useNoosfera } from "@/contexts/noosfera-context"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Zap, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PredictionResult {
  type: "mental_state" | "cognitive_load" | "emotional_state" | "focus_level"
  value: string
  confidence: number
  trend: "increasing" | "decreasing" | "stable"
  details: string
}

interface PatternInsight {
  title: string
  description: string
  relevance: number
  icon: JSX.Element
}

export default function PredictiveAnalysis() {
  const { connectionStatus, currentThoughtPattern, brainwaveHistory, patternAnalysis } = useNoosfera()
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  const [insights, setInsights] = useState<PatternInsight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<"predictions" | "insights">("predictions")

  // Generate predictions based on current data
  useEffect(() => {
    if (connectionStatus !== "connected" || !currentThoughtPattern) {
      setPredictions([])
      setInsights([])
      return
    }

    // Only update predictions when we have a new thought pattern
    if (currentThoughtPattern && !isAnalyzing) {
      runPredictiveAnalysis()
    }
  }, [connectionStatus, currentThoughtPattern])

  // Simulated predictive analysis
  const runPredictiveAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          generateResults()
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  // Generate prediction results
  const generateResults = () => {
    // Generate predictions based on current thought pattern
    const newPredictions: PredictionResult[] = [
      {
        type: "mental_state",
        value: getRandomMentalState(),
        confidence: Math.round(Math.random() * 30 + 70),
        trend: getRandomTrend(),
        details: "Basado en patrones de ondas Alpha y Theta predominantes",
      },
      {
        type: "cognitive_load",
        value: getRandomCognitiveLoad(),
        confidence: Math.round(Math.random() * 20 + 75),
        trend: getRandomTrend(),
        details: "Análisis de complejidad de patrones y actividad Beta",
      },
      {
        type: "emotional_state",
        value: getRandomEmotionalState(),
        confidence: Math.round(Math.random() * 25 + 65),
        trend: getRandomTrend(),
        details: "Correlación con patrones de actividad frontal y temporal",
      },
      {
        type: "focus_level",
        value: getRandomFocusLevel(),
        confidence: Math.round(Math.random() * 15 + 80),
        trend: getRandomTrend(),
        details: "Basado en estabilidad de patrones y coherencia entre regiones",
      },
    ]

    setPredictions(newPredictions)

    // Generate insights
    const newInsights: PatternInsight[] = [
      {
        title: "Patrón de creatividad detectado",
        description:
          "Se observa un aumento en la actividad Theta asociada con estados creativos y pensamiento divergente.",
        relevance: Math.round(Math.random() * 30 + 70),
        icon: <Sparkles className="h-4 w-4 text-violet-500" />,
      },
      {
        title: "Potencial para aprendizaje acelerado",
        description:
          "La combinación de ondas Alpha y Beta sugiere un estado óptimo para la absorción y retención de información.",
        relevance: Math.round(Math.random() * 20 + 60),
        icon: <Brain className="h-4 w-4 text-emerald-500" />,
      },
      {
        title: "Patrón de resolución de problemas",
        description:
          "La actividad frontal y parietal indica procesos activos de análisis y resolución de problemas complejos.",
        relevance: Math.round(Math.random() * 25 + 65),
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
      },
      {
        title: "Sincronización hemisférica",
        description:
          "Se detecta una alta coherencia entre hemisferios cerebrales, asociada con pensamiento integrado y holístico.",
        relevance: Math.round(Math.random() * 15 + 75),
        icon: <Zap className="h-4 w-4 text-blue-500" />,
      },
    ]

    setInsights(newInsights)
  }

  // Helper functions for random values
  const getRandomMentalState = () => {
    const states = ["Concentración", "Relajación", "Creatividad", "Análisis", "Meditación"]
    return states[Math.floor(Math.random() * states.length)]
  }

  const getRandomCognitiveLoad = () => {
    const loads = ["Bajo", "Moderado", "Alto", "Muy alto", "Óptimo"]
    return loads[Math.floor(Math.random() * loads.length)]
  }

  const getRandomEmotionalState = () => {
    const states = ["Neutral", "Positivo", "Enfocado", "Curioso", "Contemplativo"]
    return states[Math.floor(Math.random() * states.length)]
  }

  const getRandomFocusLevel = () => {
    const levels = ["Intenso", "Moderado", "Difuso", "Fluctuante", "Sostenido"]
    return levels[Math.floor(Math.random() * levels.length)]
  }

  const getRandomTrend = () => {
    const trends = ["increasing", "decreasing", "stable"]
    return trends[Math.floor(Math.random() * trends.length)] as "increasing" | "decreasing" | "stable"
  }

  // Get icon for prediction type
  const getPredictionIcon = (type: string) => {
    switch (type) {
      case "mental_state":
        return <Brain className="h-4 w-4" />
      case "cognitive_load":
        return <TrendingUp className="h-4 w-4" />
      case "emotional_state":
        return <Lightbulb className="h-4 w-4" />
      case "focus_level":
        return <Zap className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  // Get color for prediction type
  const getPredictionColor = (type: string) => {
    switch (type) {
      case "mental_state":
        return "text-emerald-500"
      case "cognitive_load":
        return "text-blue-500"
      case "emotional_state":
        return "text-violet-500"
      case "focus_level":
        return "text-amber-500"
      default:
        return "text-emerald-500"
    }
  }

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-3 w-3 text-emerald-500" />
      case "decreasing":
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      case "stable":
        return <TrendingUp className="h-3 w-3 text-amber-500 rotate-90" />
      default:
        return null
    }
  }

  // Get label for prediction type
  const getPredictionLabel = (type: string) => {
    switch (type) {
      case "mental_state":
        return "Estado Mental"
      case "cognitive_load":
        return "Carga Cognitiva"
      case "emotional_state":
        return "Estado Emocional"
      case "focus_level":
        return "Nivel de Enfoque"
      default:
        return type
    }
  }

  if (connectionStatus !== "connected") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-emerald-500" />
            Análisis Predictivo
          </CardTitle>
          <CardDescription>Predicciones basadas en patrones neuronales</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Conecta el BCI para acceder al análisis predictivo</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentThoughtPattern) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-emerald-500" />
            Análisis Predictivo
          </CardTitle>
          <CardDescription>Predicciones basadas en patrones neuronales</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Captura un pensamiento para generar predicciones</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-emerald-500" />
          Análisis Predictivo
        </CardTitle>
        <CardDescription>Predicciones basadas en patrones neuronales</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="predictions" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Predicciones
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictions">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 py-8"
                >
                  <div className="flex justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Brain className="h-12 w-12 text-emerald-500" />
                    </motion.div>
                  </div>
                  <h3 className="text-center font-medium">Analizando patrones neuronales</h3>
                  <div className="space-y-2 max-w-md mx-auto">
                    <Progress value={analysisProgress} />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Procesando datos</span>
                      <span>{analysisProgress}%</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {predictions.map((prediction, index) => (
                      <motion.div
                        key={prediction.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-3 bg-muted/30"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`${getPredictionColor(prediction.type)}`}>
                              {getPredictionIcon(prediction.type)}
                            </div>
                            <span className="font-medium text-sm">{getPredictionLabel(prediction.type)}</span>
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getTrendIcon(prediction.trend)}
                            <span>{prediction.confidence}%</span>
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">{prediction.value}</span>
                          <div className="text-xs text-muted-foreground">{prediction.details}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 bg-muted/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-muted/50 p-2 rounded-full">{insight.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{insight.title}</h3>
                        <Badge variant="outline">{insight.relevance}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button
          onClick={runPredictiveAnalysis}
          disabled={isAnalyzing || !currentThoughtPattern}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          <Brain className="mr-2 h-4 w-4" />
          Actualizar Análisis
        </Button>
      </CardFooter>
    </Card>
  )
}
