"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Zap,
  Moon,
  Sun,
  Power,
  ChevronDown,
  BarChart3,
  Activity,
  LogOut,
  User,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ImageIcon,
  Settings,
  LayoutDashboard,
  Cable as Cube,
  Shapes,
  Crown,
  TrendingUp,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ThoughtVisualizer from "@/components/thought-visualizer"
import { useNoosfera } from "@/contexts/noosfera-context"
import { toast } from "@/hooks/use-toast"

// Eliminar imports de componentes obsoletos
import ConnectionStatus from "@/components/widgets/connection-status"
import PatternVisualizer from "@/components/widgets/pattern-visualizer"
import NeuralParticles from "@/components/animations/neural-particles"
import FloatingActionButton from "@/components/floating-action-button"
import ActivityTimeline from "@/components/widgets/activity-timeline"
import Advanced3DBrain from "@/components/advanced-3d-brain"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { SidebarInset } from "@/components/ui/sidebar-inset"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { useAuth } from "@/contexts/auth-context"
import { Check } from "lucide-react"

interface GeneratedImage {
  id: string
  url: string
  timestamp: number
  pulses: number[]
  description: string
}

type PlanType = "free" | "standard" | "premium"

interface UserPlan {
  type: PlanType
  capturesRemaining: number
  capturesLimit: number
  nftsRemaining: number
  nftsLimit: number
  resetDate: Date
}

export default function UserDashboard() {
  const { user, logout, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const dashboardRef = useRef<HTMLDivElement>(null)

  const {
    connectionStatus,
    signalStrength,
    connect,
    disconnect,
    processingCardiac,
    captureCardiacData,
    cardiacActivity,
    systemLoad,
    cardiacAnalysis,
    currentCardiacPattern,
    generateContent,
  } = useNoosfera()
  
  // Provide default values for cardiacAnalysis to prevent undefined errors
  const patternAnalysis = cardiacAnalysis || {
    dominantFrequency: "normal",
    patternStability: 0,
    heartHealthScore: 0,
    matchConfidence: 0,
  }

  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [pulses, setPulses] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState("")
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const [showImageStyleModal, setShowImageStyleModal] = useState(false)
  const [selectedImageStyle, setSelectedImageStyle] = useState<"realistic" | "geometric">("geometric")

  const [userPlan, setUserPlan] = useState<UserPlan>({
    type: "free",
    capturesRemaining: 10,
    capturesLimit: 10,
    nftsRemaining: 5,
    nftsLimit: 5,
    resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  })
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const memoizedAdvanced3DBrain = useMemo(() => <Advanced3DBrain isDemoMode={false} />, [connectionStatus])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user?.id) {
      const savedPlan = localStorage.getItem(`noosfera_plan_${user.id}`)
      if (savedPlan) {
        try {
          const plan = JSON.parse(savedPlan)
          plan.resetDate = new Date(plan.resetDate)
          setUserPlan(plan)
        } catch (error) {
          console.error("Error loading plan:", error)
        }
      }
    }
  }, [user?.id])

  const savePlan = (plan: UserPlan) => {
    if (user?.id) {
      localStorage.setItem(`noosfera_plan_${user.id}`, JSON.stringify(plan))
      setUserPlan(plan)
    }
  }

  useEffect(() => {
    if (user && !user.preferences?.tutorialCompleted) {
      setShowTutorial(true)
    }
  }, [user])

  useEffect(() => {
    const savedImages = localStorage.getItem(`noosfera_images_${user?.id}`)
    if (savedImages) {
      try {
        setGeneratedImages(JSON.parse(savedImages))
      } catch (error) {
        console.error("Error loading images:", error)
      }
    }
  }, [user?.id])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false)
      } else {
        setShowScrollIndicator(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const [localThoughtPattern, setLocalThoughtPattern] = useState<string | null>(null)

  if (!mounted || !user) return null

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
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

  const saveImages = (images: GeneratedImage[]) => {
    if (user?.id) {
      localStorage.setItem(`noosfera_images_${user.id}`, JSON.stringify(images))
      setGeneratedImages(images)
    }
  }

  const addPulse = (value: number) => {
    if (pulses.length < 5) {
      const newPulses = [...pulses, value]
      setPulses(newPulses)

      toast({
        title: "Pulso registrado",
        description: `Pulso ${newPulses.length}/5 registrado correctamente`,
      })

      if (newPulses.length === 5) {
        connect()

        setIsProcessing(true)
        setProcessingStep("Preparando monitor cardíaco para ti... Explora una nueva forma de digitalizar tus pulsos")

        setTimeout(() => {
          setIsProcessing(false)
          setProcessingStep("")
          toast({
            title: "¡Monitor cardíaco conectado automáticamente!",
            description: "Ahora puedes capturar tus patrones cardíacos",
          })
        }, 3000)
      }
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setPulses([]) // Clear all pulses when disconnecting
    setIsProcessing(false)
    setProcessingStep("")

    toast({
      title: "Monitor cardíaco desconectado",
      description: "Los pulsos han sido borrados. Ingresa 5 nuevos pulsos para reconectar.",
    })
  }

  const processPulses = async () => {
    if (pulses.length !== 5) return

    setIsProcessing(true)

    try {
      setProcessingStep("Conectando con dispositivo de monitoreo cardíaco...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setProcessingStep("Convirtiendo pulsos a código binario...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProcessingStep("Traduciendo binario a patrones geométricos...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProcessingStep("Generando imagen final...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newImage: GeneratedImage = {
        id: `img_${Date.now()}`,
        url: generateImageFromPulses(pulses),
        timestamp: Date.now(),
        pulses: [...pulses],
        description: `Imagen generada a partir de ${pulses.length} pulsos cardíacos`,
      }

      const updatedImages = [newImage, ...generatedImages]
      saveImages(updatedImages)

      toast({
        title: "¡Imagen generada exitosamente!",
        description: "Tu imagen ha sido creada exitosamente",
      })

      setPulses([])
      setActiveTab("dashboard")
    } catch (error) {
      toast({
        title: "Error en el procesamiento",
        description: "Hubo un problema al procesar los pulsos",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProcessingStep("")
    }
  }

  const generateImageFromPulses = (pulseData: number[], style: "realistic" | "geometric" = "geometric"): string => {
    const canvas = document.createElement("canvas")
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext("2d")

    if (ctx) {
      if (style === "realistic") {
        // Realistic style - more organic, heart-like patterns
        const hue = (pulseData[0] * 3.6) % 360
        const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 400)
        gradient.addColorStop(0, `hsl(${hue}, 60%, 15%)`)
        gradient.addColorStop(0.5, `hsl(${(hue + 30) % 360}, 50%, 25%)`)
        gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 40%, 35%)`)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 800, 600)

        // Create cardiac network-like connections
        pulseData.forEach((pulse, index) => {
          const x = (pulse * 8) % 800
          const y = (pulse * 6) % 600
          const size = (pulse % 30) + 10
          const nodeHue = (pulse * 2.4) % 360

          // Draw cardiac nodes
          ctx.fillStyle = `hsla(${nodeHue}, 70%, 70%, 0.8)`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()

          // Draw connections between nodes
          if (index > 0) {
            const prevX = (pulseData[index - 1] * 8) % 800
            const prevY = (pulseData[index - 1] * 6) % 600
            ctx.strokeStyle = `hsla(${nodeHue}, 60%, 60%, 0.4)`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(prevX, prevY)
            ctx.lineTo(x, y)
            ctx.stroke()
          }

          // Add pulse sparks
          for (let i = 0; i < 3; i++) {
            const sparkX = x + (Math.random() - 0.5) * 40
            const sparkY = y + (Math.random() - 0.5) * 40
            ctx.fillStyle = `hsla(${(nodeHue + 120) % 360}, 90%, 80%, 0.6)`
            ctx.beginPath()
            ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      } else {
        // Geometric style - original implementation
        const hue = (pulseData[0] * 3.6) % 360
        const gradient = ctx.createLinearGradient(0, 0, 800, 600)
        gradient.addColorStop(0, `hsl(${hue}, 70%, 20%)`)
        gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 70%, 30%)`)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 800, 600)

        pulseData.forEach((pulse, index) => {
          const x = (pulse * 8) % 800
          const y = (pulse * 6) % 600
          const size = (pulse % 50) + 20
          const shapeHue = (pulse * 3.6) % 360

          ctx.fillStyle = `hsla(${shapeHue}, 80%, 60%, 0.7)`
          ctx.beginPath()

          if (index % 3 === 0) {
            ctx.arc(x, y, size, 0, Math.PI * 2)
          } else if (index % 3 === 1) {
            ctx.rect(x - size / 2, y - size / 2, size, size)
          } else {
            ctx.moveTo(x, y - size / 2)
            ctx.lineTo(x - size / 2, y + size / 2)
            ctx.lineTo(x + size / 2, y + size / 2)
            ctx.closePath()
          }
          ctx.fill()
        })
      }

      return canvas.toDataURL("image/png")
    }

    return "/placeholder-xfyhp.png"
  }

  const completeTutorial = () => {
    setShowTutorial(false)
    if (user) {
      updateUser({
        ...user,
        preferences: {
          ...user.preferences,
          tutorialCompleted: true,
        },
      })
    }
  }

  const updateProfile = () => {
    if (user) {
      updateUser({
        ...user,
        name: profileData.name,
        email: profileData.email,
      })
      setIsEditingProfile(false)
      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido actualizados correctamente",
      })
    }
  }

  const handleCapture = async () => {
    if (userPlan.capturesRemaining <= 0) {
      toast({
        title: "Límite alcanzado",
        description: "Has alcanzado el límite de capturas de tu plan. Mejora tu plan para continuar.",
        variant: "destructive",
      })
      setShowUpgradeModal(true)
      return
    }

    if (pulses.length !== 5 || !connectionStatus) {
      toast({
        title: "Error",
        description: "Necesitas exactamente 5 pulsos y estar conectado al monitor cardíaco",
        variant: "destructive",
      })
      return
    }

    setShowImageStyleModal(true)
  }

  const handleGenerateWithStyle = async (style: "realistic" | "geometric") => {
    setShowImageStyleModal(false)

    if (userPlan.nftsRemaining <= 0) {
      toast({
        title: "Límite de NFTs alcanzado",
        description: "Has alcanzado el límite de NFTs de tu plan. Mejora tu plan para continuar.",
        variant: "destructive",
      })
      setShowUpgradeModal(true)
      return
    }

    try {
      setIsProcessing(true)
      setProcessingStep("Convirtiendo pulsos a código binario...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProcessingStep(
        style === "realistic"
          ? "Creando patrones cardíacos realistas..."
          : "Traduciendo binario a patrones geométricos...",
      )
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProcessingStep("Generando imagen final...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newImage: GeneratedImage = {
        id: `img_${Date.now()}`,
        url: generateImageFromPulses(pulses, style),
        timestamp: Date.now(),
        pulses: [...pulses],
        description: `Imagen ${style === "realistic" ? "realista" : "geométrica"} generada a partir de ${pulses.length} pulsos cardíacos`,
      }

      const updatedImages = [newImage, ...generatedImages]
      saveImages(updatedImages)

      setLocalThoughtPattern(newImage.url)

      const updatedPlan = {
        ...userPlan,
        capturesRemaining: userPlan.capturesRemaining - 1,
        nftsRemaining: userPlan.nftsRemaining - 1,
      }
      savePlan(updatedPlan)

      toast({
        title: "¡Imagen generada exitosamente!",
        description: `Tu imagen ${style === "realistic" ? "realista" : "geométrica"} se muestra en Actividad en Tiempo Real y se guardó en la Galería. Capturas restantes: ${updatedPlan.capturesRemaining}/${updatedPlan.capturesLimit}`,
      })

      setActiveTab("gallery")
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al generar la imagen",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProcessingStep("")
    }
  }

  const handleGenerate = async () => {
    await generateContent()
  }

  const handleAnalyze = () => {
    setActiveTab("visualize")
  }

  const handleSettings = () => {
    setActiveTab("profile")
  }

  const getPlanName = (type: PlanType) => {
    switch (type) {
      case "free":
        return "Free"
      case "standard":
        return "Estándar"
      case "premium":
        return "Premium"
    }
  }

  const getPlanColor = (type: PlanType) => {
    switch (type) {
      case "free":
        return "text-gray-500"
      case "standard":
        return "text-emerald-500"
      case "premium":
        return "text-purple-500"
    }
  }

  const tutorialSteps = [
    {
      title: "¡Bienvenido a Noösfera!",
      content: "Te guiaremos a través del proceso de interpretación de patrones cardíacos usando tecnología avanzada.",
      icon: <Heart className="h-8 w-8 text-emerald-500" />,
    },
    {
      title: "Paso 1: Registrar Pulsos",
      content:
        "Necesitas registrar exactamente 5 pulsos cardíacos usando tu reloj inteligente o dispositivo compatible.",
      icon: <Zap className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Paso 2: Procesamiento Cardíaco",
      content: "Una vez registrados los 5 pulsos, el sistema procesará automáticamente los datos cardíacos.",
      icon: <Heart className="h-8 w-8 text-violet-500" />,
    },
    {
      title: "Paso 3: Generación de Imagen",
      content:
        "Los pulsos se convertirán en código binario, luego en patrones geométricos y finalmente en una imagen única.",
      icon: <ImageIcon className="h-8 w-8 text-amber-500" />,
    },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background transition-colors duration-300 flex" ref={dashboardRef}>
        <NeuralParticles />

        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-lg p-6 max-w-md w-full"
              >
                <div className="text-center space-y-4">
                  {tutorialSteps[tutorialStep].icon}
                  <h3 className="text-xl font-bold">{tutorialSteps[tutorialStep].title}</h3>
                  <p className="text-muted-foreground">{tutorialSteps[tutorialStep].content}</p>

                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-muted-foreground">
                      {tutorialStep + 1} de {tutorialSteps.length}
                    </div>
                    <div className="flex gap-2">
                      {tutorialStep > 0 && (
                        <Button variant="outline" onClick={() => setTutorialStep(tutorialStep - 1)}>
                          Anterior
                        </Button>
                      )}
                      {tutorialStep < tutorialSteps.length - 1 ? (
                        <Button onClick={() => setTutorialStep(tutorialStep + 1)}>Siguiente</Button>
                      ) : (
                        <Button onClick={completeTutorial}>¡Comenzar!</Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar - misma estructura que el demo */}
        <Sidebar variant="inset" className="z-50">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                <Heart className="h-6 w-6 text-emerald-500" />
              </motion.div>
              <h1 className="text-xl font-bold">Noösfera</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={logout}
                      className="h-8 w-8 ml-auto text-muted-foreground hover:text-red-500"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cerrar Sesión</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")}>
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "3d"} onClick={() => setActiveTab("3d")}>
                      <Cube className="h-4 w-4" />
                      <span>Modelo 3D Cardíaco</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "gallery"} onClick={() => setActiveTab("gallery")}>
                      <ImageIcon className="h-4 w-4" />
                      <span>Galería</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Usuario</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
                      <User className="h-4 w-4" />
                      <span>Perfil</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="p-4 space-y-3">
              <Card className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Plan Actual</span>
                    <Badge variant="outline" className={`${getPlanColor(userPlan.type)} border-current`}>
                      {getPlanName(userPlan.type)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Capturas</span>
                      <span className="font-medium">
                        {userPlan.capturesRemaining}/{userPlan.capturesLimit}
                      </span>
                    </div>
                    <Progress value={(userPlan.capturesRemaining / userPlan.capturesLimit) * 100} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>NFTs</span>
                      <span className="font-medium">
                        {userPlan.nftsRemaining}/{userPlan.nftsLimit}
                      </span>
                    </div>
                    <Progress value={(userPlan.nftsRemaining / userPlan.nftsLimit) * 100} className="h-1.5" />
                  </div>
                  {userPlan.type === "free" && (
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                      onClick={() => setShowUpgradeModal(true)}
                    >
                      <Crown className="mr-2 h-3 w-3" />
                      Mejorar Plan
                    </Button>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getConnectionStatusColor()}`}></div>
                  <span className="text-xs">{getConnectionStatusText()}</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-7 w-7">
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cambiar a modo {theme === "dark" ? "claro" : "oscuro"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {connectionStatus === "connected" && (
                <Button size="sm" onClick={handleDisconnect} className="bg-red-600 hover:bg-red-700 w-full">
                  <Power className="mr-2 h-4 w-4" />
                  Desconectar Monitor
                </Button>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset>
          <div className="container mx-auto px-4 pb-20">
            {userPlan.type === "free" && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 mt-4">
                <Card className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border-emerald-500/20">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/20 p-2 rounded-full">
                          <TrendingUp className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Desbloquea todo el potencial de Noösfera</h3>
                          <p className="text-sm text-muted-foreground">
                            Capturas ilimitadas, más NFTs y funciones premium te esperan
                          </p>
                        </div>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                        onClick={() => setShowUpgradeModal(true)}
                      >
                        <Crown className="mr-2 h-4 w-4" />
                        Ver Planes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="dashboard">
                    <section className="py-10 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="md:w-1/2 space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Badge
                            variant="outline"
                            className="px-3 py-1 text-sm bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          >
                            Sistema de Monitoreo Cardíaco
                          </Badge>
                          <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
                            ¡Bienvenido a Noösfera, <span className="text-emerald-500">{user.name}</span>!
                          </h1>
                          <p className="text-lg text-muted-foreground mt-4 max-w-lg">
                            Así es como funciona nuestro sistema de inteligencia artificial para la interpretación de
                            patrones cardíacos a través de pulsos:
                          </p>
                        </motion.div>

                        <Card className="bg-gradient-to-br from-background to-muted/50">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Zap className="h-5 w-5 text-emerald-500" />
                              Ingreso de Pulsos Cardíacos
                            </CardTitle>
                            <CardDescription>
                              Registra hasta 5 pulsos cardíacos obtenidos mediante tu reloj inteligente
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex gap-2 mb-4">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                  key={num}
                                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold ${
                                    pulses.length >= num
                                      ? "bg-emerald-500 border-emerald-500 text-white"
                                      : "border-muted-foreground text-muted-foreground"
                                  }`}
                                >
                                  {pulses.length >= num ? <CheckCircle className="h-6 w-6" /> : num}
                                </div>
                              ))}
                            </div>

                            <div className="text-sm text-muted-foreground mb-4">
                              Pulsos registrados: {pulses.length}/5
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="pulse-input">Valor del Pulso (0-100)</Label>
                                <div className="flex gap-2 mt-1">
                                  <Input
                                    id="pulse-input"
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="Ej: 75"
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        const value = Number.parseInt((e.target as HTMLInputElement).value)
                                        if (value >= 0 && value <= 100) {
                                          addPulse(value)
                                          ;(e.target as HTMLInputElement).value = ""
                                        }
                                      }
                                    }}
                                  />
                                  <Button
                                    onClick={() => {
                                      const input = document.getElementById("pulse-input") as HTMLInputElement
                                      const value = Number.parseInt(input.value)
                                      if (value >= 0 && value <= 100) {
                                        addPulse(value)
                                        input.value = ""
                                      }
                                    }}
                                    disabled={pulses.length >= 5}
                                  >
                                    Agregar
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label>Pulsos Registrados</Label>
                                <div className="mt-1 p-2 border rounded min-h-[40px] flex flex-wrap gap-1">
                                  {pulses.map((pulse, index) => (
                                    <Badge key={index} variant="secondary">
                                      {pulse}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {pulses.length < 5 && (
                              <div className="flex items-center gap-2 text-amber-600">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">
                                  Necesitas registrar {5 - pulses.length} pulsos más. El monitor se conectará
                                  automáticamente.
                                </span>
                              </div>
                            )}

                            {pulses.length === 5 && connectionStatus === "connected" && (
                              <div className="flex items-center gap-2 text-emerald-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">
                                  ¡Monitor cardíaco conectado automáticamente! Puedes capturar tus patrones.
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {isProcessing && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-violet-500" />
                                Proceso de Interpretación
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                                  <span>{processingStep}</span>
                                </div>
                                <Progress
                                  value={
                                    processingStep.includes("Conectando")
                                      ? 25
                                      : processingStep.includes("Convirtiendo")
                                        ? 50
                                        : processingStep.includes("Traduciendo")
                                          ? 75
                                          : processingStep.includes("Generando")
                                            ? 100
                                            : 0
                                  }
                                />
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Indicador de desplazamiento */}
                        <AnimatePresence>
                          {showScrollIndicator && (
                            <motion.div
                              className="flex justify-center my-4"
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() =>
                                  window.scrollTo({
                                    top: window.innerHeight,
                                    behavior: "smooth",
                                  })
                                }
                              >
                                <p className="text-sm text-muted-foreground mb-2">Desplázate para ver más</p>
                                <ChevronDown className="h-6 w-6 text-muted-foreground" />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Dashboard principal - misma estructura que el demo */}
                        <section className="py-10">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-6">
                              {memoizedAdvanced3DBrain}

                              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
                                <CardHeader className="pb-0">
                                  <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2">
                                      <Heart className="h-5 w-5 text-emerald-500" />
                                      Actividad Cardíaca en Tiempo Real
                                    </CardTitle>
                                  </div>
                                  <CardDescription>
                                    Visualización de la actividad cardíaca en tiempo real
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                  <div className="h-[300px] relative">
                                    <ThoughtVisualizer isDemo={false} />
                                  </div>
                                </CardContent>
                                <CardFooter className="border-t bg-muted/30 flex justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium">Complejidad:</div>
                                    <div className="text-sm">{patternAnalysis.heartHealthScore}%</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium">Confianza:</div>
                                    <div className="text-sm">{patternAnalysis.matchConfidence}%</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium">Estabilidad:</div>
                                    <div className="text-sm">{patternAnalysis.patternStability}%</div>
                                  </div>
                                </CardFooter>
                              </Card>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* BrainwaveChart and SystemMetrics are removed as per updates */}
                              </div>

                              <ActivityTimeline />
                            </div>

                            <div className="space-y-6">
                              <ConnectionStatus />
                              <PatternVisualizer />

                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-emerald-500" />
                                    Acciones Rápidas
                                  </CardTitle>
                                  <CardDescription>Funciones principales del sistema</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                  <Button
                                    className="flex flex-col items-center justify-center h-24 bg-gradient-to-br from-emerald-500 to-emerald-700"
                                    disabled={
                                      connectionStatus !== "connected" || processingThought || pulses.length !== 5
                                    }
                                    onClick={handleCapture}
                                  >
                                    <Heart className="h-8 w-8 mb-2" />
                                    <span>Capturar Patrón</span>
                                  </Button>

                                  <Button
                                    className="flex flex-col items-center justify-center h-24 bg-gradient-to-br from-violet-500 to-violet-700"
                                    disabled={connectionStatus !== "connected"}
                                    onClick={handleAnalyze}
                                  >
                                    <Activity className="h-8 w-8 mb-2" />
                                    <span>Analizar</span>
                                  </Button>

                                  <Button
                                    className="flex flex-col items-center justify-center h-24 bg-gradient-to-br from-amber-500 to-amber-700"
                                    onClick={handleSettings}
                                  >
                                    <Settings className="h-8 w-8 mb-2" />
                                    <span>Configurar</span>
                                  </Button>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-emerald-500" />
                                    Estadísticas del Sistema
                                  </CardTitle>
                                  <CardDescription>Métricas de rendimiento en tiempo real</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Carga del Sistema</span>
                                      <span>{systemLoad}%</span>
                                    </div>
                                    <Progress value={systemLoad} className="h-2" />
                                  </div>

                                  <div className="space-y-2">
<div className="flex justify-between text-sm">
  <span>Actividad Cardíaca</span>
  <span>{cardiacActivity}%</span>
  </div>
  <Progress value={cardiacActivity} className="h-2" />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Fuerza de Señal</span>
                                      <span>{signalStrength}%</span>
                                    </div>
                                    <Progress value={signalStrength} className="h-2" />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Precisión</span>
                                      <span>{0}%</span> {/* Placeholder as systemMetrics is removed */}
                                    </div>
                                    <Progress value={0} className="h-2" />{" "}
                                    {/* Placeholder as systemMetrics is removed */}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </section>
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="3d">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold">Modelo 3D Cardíaco</h2>
                        <p className="text-muted-foreground mt-2">
                          Visualización tridimensional avanzada del corazón y actividad cardíaca
                        </p>
                      </div>
                      {memoizedAdvanced3DBrain}
                    </div>
                  </TabsContent>

                  <TabsContent value="profile">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold">Perfil de Usuario</h2>
                        <p className="text-muted-foreground mt-2">Gestiona tu información personal</p>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-emerald-500" />
                            Información del Perfil
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-semibold">{user.name}</h3>
                              <p className="text-muted-foreground">{user.email}</p>
                              <Badge variant="outline" className="mt-1">
                                {user.role}
                              </Badge>
                            </div>
                          </div>

                          {isEditingProfile ? (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                  id="name"
                                  value={profileData.name}
                                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={profileData.email}
                                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={updateProfile}>Guardar</Button>
                                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button onClick={() => setIsEditingProfile(true)}>
                              <Settings className="mr-2 h-4 w-4" />
                              Editar Perfil
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="gallery">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold">Galería de Imágenes</h2>
                        <p className="text-muted-foreground mt-2">
                          Todas las imágenes generadas a partir de tus patrones cardíacos
                        </p>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-emerald-500" />
                            Galería Completa
                          </CardTitle>
                          <CardDescription>Imágenes generadas: {generatedImages.length}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {generatedImages.length === 0 ? (
                            <div className="text-center py-8">
                              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-muted-foreground">
                                Aún no has generado ninguna imagen. ¡Registra tus primeros 5 pulsos para comenzar!
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {generatedImages.map((image) => (
                                <Card key={image.id} className="overflow-hidden">
                                  <div className="aspect-video bg-muted">
                                    <img
                                      src={image.url || "/placeholder.svg"}
                                      alt={image.description}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {new Date(image.timestamp).toLocaleString()}
                                    </p>
                                    <p className="text-sm">{image.description}</p>
                                    <div className="flex gap-1 mt-2">
                                      {image.pulses.map((pulse, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {pulse}
                                        </Badge>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </SidebarInset>

        <FloatingActionButton />

        {showImageStyleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-center">Selecciona el Estilo de Imagen</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleGenerateWithStyle("realistic")}
                  className="flex flex-col items-center p-4 border-2 border-emerald-500/30 rounded-lg hover:border-emerald-500 transition-colors"
                >
                  <Heart className="h-12 w-12 text-emerald-500 mb-2" />
                  <span className="font-medium">Realista</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Patrones cardíacos orgánicos
                  </span>
                </button>
                <button
                  onClick={() => handleGenerateWithStyle("geometric")}
                  className="flex flex-col items-center p-4 border-2 border-violet-500/30 rounded-lg hover:border-violet-500 transition-colors"
                >
                  <Shapes className="h-12 w-12 text-violet-500 mb-2" />
                  <span className="font-medium">Geométrica</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Formas abstractas y patrones
                  </span>
                </button>
              </div>
              <button
                onClick={() => setShowImageStyleModal(false)}
                className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Crown className="h-6 w-6 text-emerald-500" />
                Mejora tu Plan
              </DialogTitle>
              <DialogDescription>Elige el plan perfecto para tus necesidades</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {/* Plan Estándar */}
              <Card className="border-2 border-emerald-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Plan Estándar</CardTitle>
                    <Badge className="bg-emerald-500">Más Popular</Badge>
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$39.900</span>
                    <span className="text-muted-foreground"> COP/mes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      <strong>Capturas ilimitadas</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      <strong>50 imágenes NFT/mes</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Resolución alta (2048px)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Todos los estilos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">50 GB almacenamiento</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Sin marca de agua</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Comisión 8% (vs 10%)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Soporte prioritario</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Comenzar Ahora</Button>
                </CardFooter>
              </Card>

              {/* Plan Premium */}
              <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Plan Premium</CardTitle>
                    <Badge className="bg-purple-500">Pro</Badge>
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$89.900</span>
                    <span className="text-muted-foreground"> COP/mes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      <strong>Todo del Plan Estándar +</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      <strong>NFTs ilimitados</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Resolución ultra (4096px)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Almacenamiento ilimitado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Estilos personalizados IA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Comisión mínima 5%</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">API de integración</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Soporte 24/7</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Promoción destacada</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Comenzar Premium</Button>
                </CardFooter>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  )
}
