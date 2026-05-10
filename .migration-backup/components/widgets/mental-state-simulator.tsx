"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useNoosfera } from "@/contexts/noosfera-context"
import { Brain, Sparkles, Lightbulb, Waves, Loader2, Heart, Focus, Smile } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"
import type { JSX } from "react/jsx-runtime"

interface MentalState {
  id: string
  name: string
  description: string
  icon: JSX.Element
  color: string
  wavePatterns: {
    alpha: number
    beta: number
    theta: number
    delta: number
    gamma: number
  }
  brainRegions: string[]
  emotionalValence: number // -1 to 1 (negative to positive)
  arousalLevel: number // 0 to 1 (calm to excited)
  cognitiveLoad: number // 0 to 1 (low to high mental effort)
  visualPattern: "waves" | "particles" | "spiral" | "network" | "mandala"
}

export default function MentalStateSimulator() {
  const { connectionStatus, captureThought } = useNoosfera()
  const [selectedState, setSelectedState] = useState<string>("focus")
  const [customizing, setCustomizing] = useState(false)
  const [simulating, setSimulating] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [animationIntensity, setAnimationIntensity] = useState(0)
  const [pulsePhase, setPulsePhase] = useState(0)
  const [particleSystem, setParticleSystem] = useState<
    Array<{
      id: number
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      color: string
    }>
  >([])

  const [customWaves, setCustomWaves] = useState({
    alpha: 50,
    beta: 50,
    theta: 50,
    delta: 50,
    gamma: 50,
  })

  const mentalStates: MentalState[] = [
    {
      id: "focus",
      name: "Concentración Intensa",
      description: "Estado de atención focalizada con alta actividad Beta y baja Theta",
      icon: <Focus className="h-5 w-5 text-blue-500" />,
      color: "#3b82f6",
      wavePatterns: {
        alpha: 30,
        beta: 85,
        theta: 25,
        delta: 15,
        gamma: 60,
      },
      brainRegions: ["Corteza Prefrontal", "Corteza Parietal"],
      emotionalValence: 0.2,
      arousalLevel: 0.8,
      cognitiveLoad: 0.9,
      visualPattern: "network",
    },
    {
      id: "meditation",
      name: "Meditación Profunda",
      description: "Estado de calma con predominancia de ondas Alpha y Theta",
      icon: <Waves className="h-5 w-5 text-emerald-500" />,
      color: "#10b981",
      wavePatterns: {
        alpha: 80,
        beta: 20,
        theta: 75,
        delta: 40,
        gamma: 15,
      },
      brainRegions: ["Corteza Frontal", "Lóbulo Occipital", "Lóbulo Temporal"],
      emotionalValence: 0.6,
      arousalLevel: 0.2,
      cognitiveLoad: 0.3,
      visualPattern: "mandala",
    },
    {
      id: "creativity",
      name: "Creatividad",
      description: "Estado de pensamiento divergente con alta actividad Theta y Alpha",
      icon: <Sparkles className="h-5 w-5 text-violet-500" />,
      color: "#8b5cf6",
      wavePatterns: {
        alpha: 65,
        beta: 45,
        theta: 80,
        delta: 30,
        gamma: 50,
      },
      brainRegions: ["Lóbulo Temporal", "Corteza Parietal", "Corteza Frontal"],
      emotionalValence: 0.7,
      arousalLevel: 0.6,
      cognitiveLoad: 0.7,
      visualPattern: "spiral",
    },
    {
      id: "relaxation",
      name: "Relajación",
      description: "Estado de descanso con predominancia de ondas Alpha",
      icon: <Heart className="h-5 w-5 text-pink-500" />,
      color: "#ec4899",
      wavePatterns: {
        alpha: 85,
        beta: 15,
        theta: 50,
        delta: 45,
        gamma: 10,
      },
      brainRegions: ["Lóbulo Occipital", "Lóbulo Temporal"],
      emotionalValence: 0.8,
      arousalLevel: 0.1,
      cognitiveLoad: 0.2,
      visualPattern: "waves",
    },
    {
      id: "problem_solving",
      name: "Resolución de Problemas",
      description: "Estado analítico con alta actividad Beta y Gamma",
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      color: "#f59e0b",
      wavePatterns: {
        alpha: 40,
        beta: 75,
        theta: 35,
        delta: 20,
        gamma: 80,
      },
      brainRegions: ["Corteza Frontal", "Corteza Parietal", "Lóbulo Temporal"],
      emotionalValence: 0.1,
      arousalLevel: 0.7,
      cognitiveLoad: 0.95,
      visualPattern: "particles",
    },
    {
      id: "joy",
      name: "Alegría",
      description: "Estado emocional positivo con actividad equilibrada",
      icon: <Smile className="h-5 w-5 text-yellow-500" />,
      color: "#eab308",
      wavePatterns: {
        alpha: 70,
        beta: 60,
        theta: 40,
        delta: 25,
        gamma: 45,
      },
      brainRegions: ["Sistema Límbico", "Corteza Frontal", "Lóbulo Temporal"],
      emotionalValence: 0.9,
      arousalLevel: 0.6,
      cognitiveLoad: 0.4,
      visualPattern: "particles",
    },
  ]

  const currentState = mentalStates.find((state) => state.id === selectedState) || mentalStates[0]

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 0.1) % (Math.PI * 2))

      if (simulating) {
        setAnimationIntensity((prev) => {
          const target = 0.8 + Math.sin(Date.now() / 500) * 0.2
          return prev + (target - prev) * 0.1
        })
      } else {
        setAnimationIntensity((prev) => prev * 0.95)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [simulating])

  useEffect(() => {
    if (!simulating) {
      setParticleSystem([])
      return
    }

    const interval = setInterval(() => {
      setParticleSystem((prev) => {
        const updated = prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vx: particle.vx * 0.99,
            vy: particle.vy * 0.99,
          }))
          .filter((particle) => particle.life > 0)

        if (updated.length < 20 && Math.random() < 0.3) {
          const angle = Math.random() * Math.PI * 2
          const speed = 1 + Math.random() * 2

          updated.push({
            id: Date.now() + Math.random(),
            x: 150 + Math.cos(angle) * 50,
            y: 150 + Math.sin(angle) * 50,
            vx: Math.cos(angle + Math.PI / 2) * speed,
            vy: Math.sin(angle + Math.PI / 2) * speed,
            life: 60 + Math.random() * 40,
            maxLife: 100,
            color: currentState.color,
          })
        }

        return updated
      })
    }, 50)

    return () => clearInterval(interval)
  }, [simulating, currentState.color])

  useEffect(() => {
    if (currentState) {
      setCustomWaves(currentState.wavePatterns)
    }
  }, [selectedState])

  const handleWaveChange = (wave: keyof typeof customWaves, value: number[]) => {
    setCustomWaves((prev) => ({
      ...prev,
      [wave]: value[0],
    }))
  }

  const simulateMentalState = async () => {
    if (connectionStatus !== "connected") {
      toast.error("Conecta el BCI para simular estados mentales")
      return
    }

    setSimulating(true)
    setSimulationProgress(0)

    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    const wavePatterns = customizing ? customWaves : currentState.wavePatterns

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await captureThought(wavePatterns)
      toast.success(`Estado mental "${currentState.name}" simulado correctamente`)
    } catch (error) {
      toast.error("Error al simular el estado mental")
    } finally {
      clearInterval(interval)
      setSimulating(false)
    }
  }

  const StateVisualization = () => {
    if (!simulating) return null

    return (
      <div className="relative w-full h-48 bg-gradient-to-br from-background to-muted/30 rounded-lg overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentState.color}20, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2 + currentState.arousalLevel,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {currentState.visualPattern === "waves" && (
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(5)].map((_, i) => (
              <motion.path
                key={i}
                d={`M 0 ${96 + i * 10} Q 75 ${76 + i * 10 + Math.sin(pulsePhase + i) * 20} 150 ${96 + i * 10} T 300 ${96 + i * 10}`}
                fill="none"
                stroke={currentState.color}
                strokeWidth={2}
                opacity={0.6 - i * 0.1}
                animate={{
                  pathLength: [0, 1, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </svg>
        )}

        {currentState.visualPattern === "mandala" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-32 h-32 border-2 rounded-full"
              style={{ borderColor: currentState.color }}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: currentState.color,
                    left: "50%",
                    top: "50%",
                    transformOrigin: "0 0",
                  }}
                  animate={{
                    rotate: i * 45,
                    x: Math.cos((i * Math.PI) / 4) * 60,
                    y: Math.sin((i * Math.PI) / 4) * 60,
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    scale: {
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: i * 0.1,
                    },
                  }}
                />
              ))}
            </motion.div>
          </div>
        )}

        {currentState.visualPattern === "particles" && (
          <div className="absolute inset-0">
            {particleSystem.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: particle.color,
                  left: particle.x,
                  top: particle.y,
                  opacity: particle.life / particle.maxLife,
                }}
                animate={{
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: particle.maxLife / 60,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex gap-2">
          <Badge variant="outline" className="text-xs">
            Valencia: {currentState.emotionalValence > 0 ? "+" : ""}
            {(currentState.emotionalValence * 100).toFixed(0)}%
          </Badge>
          <Badge variant="outline" className="text-xs">
            Activación: {(currentState.arousalLevel * 100).toFixed(0)}%
          </Badge>
          <Badge variant="outline" className="text-xs">
            Carga: {(currentState.cognitiveLoad * 100).toFixed(0)}%
          </Badge>
        </div>
      </div>
    )
  }

  if (connectionStatus !== "connected") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-emerald-500" />
            Simulador de Estados Mentales
          </CardTitle>
          <CardDescription>Simula diferentes estados mentales y patrones de ondas cerebrales</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Conecta el BCI para simular estados mentales</p>
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
          Simulador de Estados Mentales Avanzado
        </CardTitle>
        <CardDescription>Simula estados mentales con visualizaciones y animaciones desarrolladas</CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {simulating ? (
            <motion.div
              key="simulating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 py-4"
            >
              <StateVisualization />
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Loader2 className="h-8 w-8" style={{ color: currentState.color }} />
                </motion.div>
              </div>
              <h3 className="text-center font-medium">
                Simulando estado: <span style={{ color: currentState.color }}>{currentState.name}</span>
              </h3>
              <div className="space-y-2 max-w-md mx-auto">
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      backgroundColor: currentState.color,
                      width: `${simulationProgress}%`,
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${simulationProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Generando patrones neuronales</span>
                  <span>{simulationProgress}%</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label>Estado Mental</Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado mental" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentalStates.map((state) => (
                      <SelectItem key={state.id} value={state.id} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {state.icon}
                          <span>{state.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <motion.div
                className="p-4 rounded-lg border-2 space-y-3"
                style={{
                  borderColor: currentState.color + "40",
                  backgroundColor: currentState.color + "10",
                }}
                animate={{
                  borderColor: [currentState.color + "40", currentState.color + "60", currentState.color + "40"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2">
                  {currentState.icon}
                  <h3 className="font-medium">{currentState.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{currentState.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>Valencia emocional:</span>
                    <span style={{ color: currentState.color }}>
                      {currentState.emotionalValence > 0 ? "+" : ""}
                      {(currentState.emotionalValence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nivel de activación:</span>
                    <span style={{ color: currentState.color }}>{(currentState.arousalLevel * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carga cognitiva:</span>
                    <span style={{ color: currentState.color }}>{(currentState.cognitiveLoad * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patrón visual:</span>
                    <span style={{ color: currentState.color }}>{currentState.visualPattern}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentState.brainRegions.map((region) => (
                    <Badge
                      key={region}
                      variant="outline"
                      style={{ borderColor: currentState.color, color: currentState.color }}
                    >
                      {region}
                    </Badge>
                  ))}
                </div>
              </motion.div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Patrones de Ondas Cerebrales</Label>
                  <Button variant="outline" size="sm" onClick={() => setCustomizing(!customizing)}>
                    {customizing ? "Usar Predefinido" : "Personalizar"}
                  </Button>
                </div>
                {customizing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          Alpha (8-12 Hz)
                        </Label>
                        <span className="text-sm">{customWaves.alpha}%</span>
                      </div>
                      <Slider
                        value={[customWaves.alpha]}
                        onValueChange={(value) => handleWaveChange("alpha", value)}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          Beta (12-30 Hz)
                        </Label>
                        <span className="text-sm">{customWaves.beta}%</span>
                      </div>
                      <Slider
                        value={[customWaves.beta]}
                        onValueChange={(value) => handleWaveChange("beta", value)}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                          Theta (4-8 Hz)
                        </Label>
                        <span className="text-sm">{customWaves.theta}%</span>
                      </div>
                      <Slider
                        value={[customWaves.theta]}
                        onValueChange={(value) => handleWaveChange("theta", value)}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                          Delta (0.5-4 Hz)
                        </Label>
                        <span className="text-sm">{customWaves.delta}%</span>
                      </div>
                      <Slider
                        value={[customWaves.delta]}
                        onValueChange={(value) => handleWaveChange("delta", value)}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          Gamma (30-100 Hz)
                        </Label>
                        <span className="text-sm">{customWaves.gamma}%</span>
                      </div>
                      <Slider
                        value={[customWaves.gamma]}
                        onValueChange={(value) => handleWaveChange("gamma", value)}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(currentState.wavePatterns).map(([wave, value], index) => {
                      const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"]
                      const labels = ["Alpha", "Beta", "Theta", "Delta", "Gamma"]

                      return (
                        <div key={wave} className="flex flex-col items-center">
                          <div className="w-full bg-muted rounded-md h-24 relative overflow-hidden">
                            <motion.div
                              className="absolute bottom-0 w-full rounded-b-md transition-all"
                              style={{
                                backgroundColor: colors[index],
                                height: `${value}%`,
                              }}
                              animate={{
                                height: [`${Math.max(value - 10, 0)}%`, `${value}%`, `${Math.max(value - 10, 0)}%`],
                              }}
                              transition={{
                                duration: 2 + index * 0.3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            />
                          </div>
                          <span className="text-xs mt-1">{labels[index]}</span>
                          <span className="text-xs font-medium">{value}%</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button
          onClick={simulateMentalState}
          disabled={simulating}
          className="w-full"
          style={{
            backgroundColor: simulating ? undefined : currentState.color,
            borderColor: currentState.color,
          }}
        >
          {simulating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Simulando...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Simular Estado Mental
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
