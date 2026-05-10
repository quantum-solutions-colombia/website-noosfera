"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Zap,
  FileText,
  Activity,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
  AlertCircle,
  HelpCircle,
  BarChart3,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface TutorialStep {
  title: string
  description: string
  icon: React.ReactNode
  image: string
  tips: string[]
  keyPoints: string[]
  alert?: {
    type: "info" | "warning"
    content: string
  }
}

interface TutorialModalProps {
  onClose?: () => void
}

export default function TutorialModal({ onClose }: TutorialModalProps) {
  const { user, completeTutorial } = useAuth()
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Mostrar el tutorial solo si el usuario está autenticado y no ha completado el tutorial
  useEffect(() => {
    if (user && !user.preferences.tutorialCompleted) {
      setOpen(true)
    }
  }, [user])

  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Bienvenido a Noösfera",
      description:
        "Noösfera es un sistema avanzado de interpretación de pensamientos mediante inteligencia artificial. Esta guía te ayudará a comprender cómo utilizar todas sus funcionalidades.",
      icon: <Brain className="h-6 w-6 text-emerald-500" />,
      image: "/tutorial/welcome.jpg",
      tips: [
        "Explora la interfaz para familiarizarte con el sistema",
        "Utiliza el menú principal para navegar entre secciones",
        "Personaliza la configuración según tus necesidades",
      ],
      keyPoints: [
        "Noösfera transforma patrones neuronales en contenido digital",
        "Interfaz intuitiva diseñada para facilitar la interpretación de pensamientos",
        "Sistema adaptable a diferentes perfiles de usuario",
      ],
      alert: {
        type: "info",
        content: "Este tutorial te guiará paso a paso por todas las funcionalidades principales del sistema.",
      },
    },
    {
      title: "Conexión del Dispositivo BCI",
      description:
        "El primer paso es conectar tu dispositivo de Interfaz Cerebro-Computadora (BCI). Este dispositivo captura las señales neuronales que Noösfera interpretará.",
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      image: "/tutorial/connect.jpg",
      tips: [
        "Asegúrate de que el dispositivo BCI esté correctamente colocado",
        "Verifica que los sensores estén en contacto directo con la piel",
        "Mantén un ambiente tranquilo durante la calibración inicial",
      ],
      keyPoints: [
        "Presiona el botón 'Conectar BCI' en el panel principal",
        "Espera a que el sistema complete la calibración automática",
        "El indicador de conexión cambiará a verde cuando esté listo",
      ],
      alert: {
        type: "warning",
        content: "Para obtener resultados óptimos, evita movimientos bruscos durante la calibración del dispositivo.",
      },
    },
    {
      title: "Captura de Pensamientos",
      description:
        "Una vez conectado el BCI, podrás capturar patrones neuronales para procesarlos en tiempo real. El sistema analizará tus ondas cerebrales y las convertirá en patrones interpretables.",
      icon: <Brain className="h-6 w-6 text-violet-500" />,
      image: "/tutorial/capture.jpg",
      tips: [
        "Concéntrate en un pensamiento específico durante la captura",
        "Mantén la calma y evita distracciones externas",
        "Experimenta con diferentes tipos de pensamientos para ver resultados variados",
      ],
      keyPoints: [
        "Utiliza el botón 'Capturar Pensamiento' cuando estés listo",
        "Observa la visualización en tiempo real de tu actividad cerebral",
        "El sistema identificará patrones dominantes y complejidad",
      ],
    },
    {
      title: "Visualización de Patrones Neuronales",
      description:
        "Noösfera ofrece visualizaciones avanzadas en 3D de tus patrones neuronales. Estas representaciones te permiten explorar y comprender mejor tu actividad cerebral.",
      icon: <Activity className="h-6 w-6 text-amber-500" />,
      image: "/tutorial/visualize.jpg",
      tips: [
        "Utiliza los controles de zoom y rotación para explorar los patrones en 3D",
        "Observa cómo cambian los patrones según tus pensamientos",
        "Presta atención a las áreas de mayor actividad",
      ],
      keyPoints: [
        "Las conexiones brillantes indican mayor actividad neuronal",
        "Los colores representan diferentes tipos de ondas cerebrales",
        "La densidad de conexiones muestra la complejidad del pensamiento",
      ],
    },
    {
      title: "Generación de Contenido",
      description:
        "Transforma tus patrones neuronales en contenido digital como texto e imágenes. El sistema utiliza algoritmos avanzados para interpretar tus pensamientos y convertirlos en creaciones digitales.",
      icon: <FileText className="h-6 w-6 text-emerald-500" />,
      image: "/tutorial/generate.jpg",
      tips: [
        "Ajusta los parámetros de complejidad y creatividad según tus preferencias",
        "Guarda tus creaciones favoritas en la biblioteca",
        "Compara diferentes resultados para entender mejor la interpretación",
      ],
      keyPoints: [
        "Selecciona el tipo de contenido: texto o imagen",
        "Personaliza los parámetros de generación",
        "Visualiza una vista previa antes de generar el contenido final",
      ],
    },
    {
      title: "Análisis de Ondas Cerebrales",
      description:
        "Explora y analiza tus ondas cerebrales en detalle. Noösfera proporciona gráficos y métricas que te ayudan a comprender mejor tu actividad cerebral.",
      icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
      image: "/tutorial/analyze.jpg",
      tips: [
        "Observa las diferentes categorías de ondas: Alpha, Beta, Theta y Delta",
        "Identifica patrones recurrentes en tu actividad cerebral",
        "Utiliza estos datos para mejorar tus futuras capturas",
      ],
      keyPoints: [
        "Las ondas Alpha (8-13 Hz) indican estado relajado o meditativo",
        "Las ondas Beta (13-30 Hz) muestran estado alerta o concentración",
        "Las ondas Theta (4-8 Hz) aparecen en estados de somnolencia o creatividad",
        "Las ondas Delta (0.5-4 Hz) predominan en sueño profundo",
      ],
    },
    {
      title: "Biblioteca de Contenido",
      description:
        "Todos los contenidos generados se almacenan automáticamente en tu biblioteca personal. Aquí puedes organizar, filtrar y exportar tus creaciones.",
      icon: <FileText className="h-6 w-6 text-violet-500" />,
      image: "/tutorial/library.jpg",
      tips: [
        "Utiliza los filtros para encontrar contenido específico",
        "Descarga tus creaciones para usarlas en otros contextos",
        "Revisa los metadatos para entender mejor el origen de cada creación",
      ],
      keyPoints: [
        "Accede a la biblioteca desde el menú principal",
        "Organiza el contenido por tipo, fecha o complejidad",
        "Exporta tu biblioteca completa para hacer copias de seguridad",
      ],
    },
    {
      title: "¡Estás listo para comenzar!",
      description:
        "Has completado el tutorial de Noösfera. Ahora tienes los conocimientos básicos para comenzar a explorar y utilizar todas las funcionalidades del sistema.",
      icon: <Check className="h-6 w-6 text-emerald-500" />,
      image: "/tutorial/complete.jpg",
      tips: [
        "Explora cada sección a tu propio ritmo",
        "No dudes en experimentar con diferentes configuraciones",
        "Recuerda que puedes acceder a la documentación en cualquier momento",
      ],
      keyPoints: [
        "Conecta tu dispositivo BCI",
        "Captura pensamientos y genera contenido",
        "Analiza tus patrones neuronales",
        "Personaliza el sistema según tus necesidades",
      ],
      alert: {
        type: "info",
        content: "Puedes volver a ver este tutorial en cualquier momento desde la sección de ayuda.",
      },
    },
  ]

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setImageLoaded(false)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setImageLoaded(false)
    }
  }

  const handleComplete = () => {
    completeTutorial()
    handleClose()
  }

  const handleSkip = () => {
    completeTutorial()
    handleClose()
  }

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget
    img.src = `/placeholder.svg?height=300&width=600&text=${encodeURIComponent(tutorialSteps[currentStep].title)}`
    setImageLoaded(true)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 pb-0">
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" onClick={handleSkip} className="h-7 w-7 rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </Button>
          </div>

          <Progress value={progress} className="h-1 mb-4" />

          <div className="flex items-center gap-2">
            {tutorialSteps[currentStep].icon}
            <DialogTitle className="text-lg">{tutorialSteps[currentStep].title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm">{tutorialSteps[currentStep].description}</DialogDescription>
        </DialogHeader>

        <div className="p-4 pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="relative rounded-lg overflow-hidden border aspect-video bg-muted">
                {/* Skeleton loader */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                )}

                <img
                  src={tutorialSteps[currentStep].image || "/placeholder.svg"}
                  alt={tutorialSteps[currentStep].title}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0",
                  )}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>

              {tutorialSteps[currentStep].alert && (
                <Alert
                  variant={tutorialSteps[currentStep].alert.type === "warning" ? "destructive" : "default"}
                  className={cn(
                    "text-xs py-2",
                    tutorialSteps[currentStep].alert.type === "info"
                      ? "bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                      : "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
                  )}
                >
                  {tutorialSteps[currentStep].alert.type === "info" ? (
                    <Info className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  <AlertDescription className="text-xs">{tutorialSteps[currentStep].alert.content}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-medium flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-500" />
                    Puntos Clave:
                  </h4>
                  <ul className="space-y-1">
                    {tutorialSteps[currentStep].keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-1 text-xs">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-0.5 rounded-full mt-0.5 shrink-0">
                          <svg className="h-1.5 w-1.5 text-emerald-500" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                        </div>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium flex items-center gap-1">
                    <HelpCircle className="h-3 w-3 text-blue-500" />
                    Consejos Útiles:
                  </h4>
                  <ul className="space-y-1">
                    {tutorialSteps[currentStep].tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-1 text-xs">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-0.5 rounded-full mt-0.5 shrink-0">
                          <svg className="h-1.5 w-1.5 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                        </div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <DialogFooter className="p-4 pt-0 flex flex-row justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-1"
            size="sm"
          >
            <ChevronLeft className="h-3 w-3" />
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSkip} className="text-muted-foreground" size="sm">
              {currentStep < tutorialSteps.length - 1 ? "Omitir" : "Cerrar"}
            </Button>

            <Button
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1"
              size="sm"
            >
              {currentStep < tutorialSteps.length - 1 ? (
                <>
                  Siguiente
                  <ChevronRight className="h-3 w-3" />
                </>
              ) : (
                <>
                  Completar
                  <Check className="h-3 w-3" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
