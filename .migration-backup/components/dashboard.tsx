"use client"

import { SidebarInset } from "@/components/ui/sidebar"

import { SidebarFooter } from "@/components/ui/sidebar"

import { SidebarMenuButton } from "@/components/ui/sidebar"

import { SidebarMenuItem } from "@/components/ui/sidebar"

import { SidebarMenu } from "@/components/ui/sidebar"

import { SidebarGroupContent } from "@/components/ui/sidebar"

import { SidebarGroupLabel } from "@/components/ui/sidebar"

import { SidebarGroup } from "@/components/ui/sidebar"

import { SidebarContent } from "@/components/ui/sidebar"

import { SidebarHeader } from "@/components/ui/sidebar"

import { Sidebar } from "@/components/ui/sidebar"

import { SidebarProvider } from "@/components/ui/sidebar"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Moon, Sun, Power, ChevronDown, BarChart3, Home, History, LogOut, Heart, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ThoughtVisualizer from "@/components/thought-visualizer"
import { useNoosfera } from "@/contexts/noosfera-context"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// Importar los componentes
import ConnectionStatus from "@/components/widgets/connection-status"
import Advanced3DBrain from "@/components/advanced-3d-brain"
import NFTDownloadModal from "@/components/nft-download-modal"
import HeartRateDisplay from "@/components/widgets/heart-rate-display"
import BloodPressureDisplay from "@/components/widgets/blood-pressure-display"
import OxygenLevelDisplay from "@/components/widgets/oxygen-level-display"
import HRVDisplay from "@/components/widgets/hrv-display"
import StressLevelDisplay from "@/components/widgets/stress-level-display"
import CardiacHealthScore from "@/components/widgets/cardiac-health-score"
import ECGWaveDisplay from "@/components/widgets/ecg-wave-display"
import CardiacRhythmIndicator from "@/components/widgets/cardiac-rhythm-indicator"
import RecoveryTimeDisplay from "@/components/widgets/recovery-time-display"
import CardiacOutputDisplay from "@/components/widgets/cardiac-output-display"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface DashboardProps {
  isDemo?: boolean
  isDemoMode?: boolean
}

export default function Dashboard({ isDemo = false, isDemoMode = false }: DashboardProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [demoDataGenerated, setDemoDataGenerated] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<
    Array<{ id: string; url: string; timestamp: number; nftToken: string }>
  >([])
  const [showNFTModal, setShowNFTModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    id: string
    url: string
    nftToken: string
  } | null>(null)
  const [demoCapturesRemaining, setDemoCapturesRemaining] = useState(2)
  const [showDemoLimitModal, setShowDemoLimitModal] = useState(false)

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
    systemMetrics,
    currentCardiacPattern,
    generateContent,
  } = useNoosfera()

  const actualDemoMode = isDemo || isDemoMode

  useEffect(() => {
    if (actualDemoMode && !demoDataGenerated) {
      // Simulate connection and data generation for demo
      setTimeout(() => {
        connect()
        setDemoDataGenerated(true)
      }, 1000)
    }
  }, [actualDemoMode, demoDataGenerated, connect])

  // Añadir un hook de useMemo para optimizar el renderizado de componentes pesados
  const memoizedAdvanced3DBrain = useMemo(
    () => <Advanced3DBrain isDemoMode={actualDemoMode} />,
    [connectionStatus, actualDemoMode],
  )

  // Ensure theme component doesn't render until mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide scroll indicator after scrolling
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

  if (!mounted) return null

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

  // Obtener la última métrica del sistema
  const latestMetric =
    systemMetrics.length > 0
      ? systemMetrics[systemMetrics.length - 1]
      : {
          cpuUsage: 0,
          memoryUsage: 0,
          latency: 0,
          accuracy: 0,
        }

  // Función para manejar la acción de capturar pensamiento
  const handleCapture = async () => {
    if (actualDemoMode) {
      // Simulate capture process in demo mode
      await captureCardiacData()
      return
    }
    await captureCardiacData()
  }

  const handleGenerate = async () => {
    if (actualDemoMode) {
      // Simulate generation process in demo mode
      await generateContent()
      return
    }
    await generateContent()
  }

  const handleAnalyze = () => {
    if (actualDemoMode) {
      // Simulate analysis in demo mode
      toast({
        title: "Análisis completado",
        description: "Análisis completado (Demo)",
      })
      return
    }
    setActiveTab("spectral")
  }

  const handleSettings = () => {
    if (actualDemoMode) {
      // Show demo settings
      setActiveTab("settings")
      return
    }
    setActiveTab("settings")
  }

  const handleExportNFT = (imageId: string) => {
    const image = generatedImages.find((img) => img.id === imageId)
    if (!image) return

    setSelectedImage({
      id: image.id,
      url: image.url,
      nftToken: image.nftToken,
    })
    setShowNFTModal(true)
  }

  const handleCaptureWithNFT = async () => {
    if (actualDemoMode) {
      if (demoCapturesRemaining <= 0) {
        setShowDemoLimitModal(true)
        return
      }

      await handleCapture()

      const nftToken = `NFT-CARDIAC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      const newImage = {
        id: Date.now().toString(),
        url: `/placeholder.svg?height=400&width=400&query=cardiac+pattern+art+${Date.now()}`,
        timestamp: Date.now(),
        nftToken: nftToken,
      }
      setGeneratedImages((prev) => [...prev, newImage])

      setDemoCapturesRemaining((prev) => prev - 1)

      setSelectedImage({
        id: newImage.id,
        url: newImage.url,
        nftToken: newImage.nftToken,
      })
      setShowNFTModal(true)

      if (demoCapturesRemaining - 1 === 1) {
        toast({
          title: "Última captura disponible",
          description: "Te queda 1 captura gratuita en el modo demo",
        })
      }
    }
  }

  const handleGoToRegister = () => {
    setShowDemoLimitModal(false)
    router.push("/auth/login")
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background transition-colors duration-300 flex" ref={dashboardRef}>
        {/* Sidebar */}
        <Sidebar variant="inset" className="z-50">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                <Heart className="h-6 w-6 text-emerald-500" />
              </motion.div>
              <h1 className="text-xl font-bold">Noösfera</h1>
              {!actualDemoMode && isAuthenticated && (
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
              )}
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")}>
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "advanced-3d"}
                      onClick={() => setActiveTab("advanced-3d")}
                    >
                      <Heart className="h-4 w-4" />
                      <span>Modelo 3D Cardíaco</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {!actualDemoMode && (
              <>
                <SidebarGroup>
                  <SidebarGroupLabel>Biblioteca</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive={activeTab === "history"} onClick={() => setActiveTab("history")}>
                          <History className="h-4 w-4" />
                          <span>Historial</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )}
          </SidebarContent>

          <SidebarFooter>
            <div className="p-4">
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

              <Button
                size="sm"
                onClick={() => (connectionStatus === "connected" ? disconnect() : connect())}
                className={
                  connectionStatus === "connected"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }
              >
                <Power className="mr-2 h-4 w-4" />
                {connectionStatus === "connected" ? "Desconectar" : "Conectar Monitor"}
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset>
          <div className="container mx-auto px-4 pb-20">
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
                    {/* Hero section con modelo 3D */}
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
                            Monitor Cardíaco <span className="text-emerald-500">Avanzado</span>
                          </h1>
                          <p className="text-lg text-muted-foreground mt-4 max-w-lg">
                            Visualiza, captura y transforma patrones de pulsos cardíacos en contenido digital con
                            tecnología de vanguardia.
                          </p>
                        </motion.div>

                        <div className="flex flex-wrap gap-4">
                          <Button
                            size="lg"
                            onClick={() => (connectionStatus === "connected" ? disconnect() : connect())}
                            className={
                              connectionStatus === "connected"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            }
                          >
                            <Power className="mr-2 h-5 w-5" />
                            {connectionStatus === "connected" ? "Desconectar" : "Conectar Monitor"}
                          </Button>

                          {connectionStatus === "connected" && (
                            <Button size="lg" variant="outline" onClick={handleCaptureWithNFT}>
                              <Zap className="mr-2 h-5 w-5" />
                              Capturar Pulso Cardíaco
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="md:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-md aspect-square">
                          <motion.div
                            className="w-full h-full flex items-center justify-center"
                            animate={{
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          >
                            <Heart className="w-64 h-64 text-emerald-500" strokeWidth={1.5} />
                          </motion.div>
                        </div>
                      </div>
                    </section>

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

                    {/* Dashboard principal */}
                    <section className="py-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Panel principal - ocupa 2 columnas */}
                        <div className="md:col-span-2 space-y-6">
                          {/* Visualizador 3D avanzado */}
                          {memoizedAdvanced3DBrain}

                          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
                            <CardHeader className="pb-0">
                              <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                  <Heart className="h-5 w-5 text-emerald-500" />
                                  Actividad Cardíaca en Tiempo Real
                                  {actualDemoMode && (
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs"
                                    >
                                      DEMO - Todas las funciones Premium desbloqueadas
                                    </Badge>
                                  )}
                                </CardTitle>
                              </div>
                              <CardDescription>Visualización de los pulsos cardíacos en tiempo real</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                              <div className="h-[300px] relative">
                                <ThoughtVisualizer isDemo={actualDemoMode} />
                              </div>
                            </CardContent>
                            <CardFooter className="border-t bg-muted/30 flex justify-between">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium">Estabilidad:</div>
                                <div className="text-sm">{cardiacAnalysis.patternStability}%</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium">Confianza:</div>
                                <div className="text-sm">{cardiacAnalysis.matchConfidence}%</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium">Salud Cardíaca:</div>
                                <div className="text-sm">{cardiacAnalysis.heartHealthScore}%</div>
                              </div>
                            </CardFooter>
                          </Card>
                        </div>

                        {/* Panel lateral - ocupa 1 columna */}
                        <div className="space-y-6">
                          {/* Estado de conexión */}
                          <ConnectionStatus />

                          {/* Acciones rápidas */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-emerald-500" />
                                Acciones Rápidas
                                {actualDemoMode && (
                                  <Badge
                                    variant="outline"
                                    className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs"
                                  >
                                    Premium
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription>Funciones principales del sistema</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4">
                              <Button
                                className="flex flex-col items-center justify-center h-24 bg-gradient-to-br from-emerald-500 to-emerald-700"
                                disabled={connectionStatus !== "connected" || processingCardiac}
                                onClick={handleCaptureWithNFT}
                              >
                                <Heart className="h-8 w-8 mb-2" />
                                <span>Capturar Pulso Cardíaco</span>
                              </Button>
                            </CardContent>
                          </Card>

                          {/* Estadísticas del sistema */}
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
                                  <span>{latestMetric.accuracy}%</span>
                                </div>
                                <Progress value={latestMetric.accuracy} className="h-2" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </section>

                    {connectionStatus === "connected" && (
                      <motion.section
                        className="py-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="mb-6">
                          <h2 className="text-3xl font-bold">Métricas Vitales en Tiempo Real</h2>
                          <p className="text-muted-foreground mt-2">Monitoreo continuo de tus indicadores cardíacos</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          <HeartRateDisplay />
                          <BloodPressureDisplay />
                          <OxygenLevelDisplay />
                          <HRVDisplay />
                          <StressLevelDisplay />
                          <CardiacHealthScore />
                          <CardiacRhythmIndicator />
                          <RecoveryTimeDisplay />
                          <CardiacOutputDisplay />
                          <ECGWaveDisplay />
                        </div>
                      </motion.section>
                    )}
                  </TabsContent>

                  <TabsContent value="advanced-3d">
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

                  {!actualDemoMode && (
                    <TabsContent value="history">
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-3xl font-bold">Historial</h2>
                          <p className="text-muted-foreground mt-2">
                            Revisa tu historial de patrones y contenido generado
                          </p>
                        </div>
                        {/* Contenido del historial */}
                      </div>
                    </TabsContent>
                  )}
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </SidebarInset>
      </div>

      {selectedImage && (
        <NFTDownloadModal
          isOpen={showNFTModal}
          onClose={() => {
            setShowNFTModal(false)
            setSelectedImage(null)
          }}
          imageUrl={selectedImage.url}
          nftToken={selectedImage.nftToken}
          imageId={selectedImage.id}
        />
      )}

      <Dialog open={showDemoLimitModal} onOpenChange={setShowDemoLimitModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-emerald-500" />
              Tokens Gratuitos Agotados
            </DialogTitle>
            <DialogDescription>Has utilizado todos los tokens gratuitos del demo</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-sm">
                🎉 <strong>¡Excelente!</strong> Has probado todas las funciones del modo demo.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Regístrate gratis y obtén:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>10 capturas mensuales gratuitas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Exportación de imágenes en todos los formatos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Tokens NFT únicos para monetización</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Acceso a tu galería personal</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                💡 Con el plan Free puedes empezar a monetizar tus NFTs cardíacos inmediatamente
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDemoLimitModal(false)}>
              Continuar explorando
            </Button>
            <Button onClick={handleGoToRegister} className="bg-emerald-600 hover:bg-emerald-700">
              Registrarse Gratis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {actualDemoMode && (
        <motion.div
          className="fixed bottom-24 right-6 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 bg-background/95 backdrop-blur-sm border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10">
                <span className="text-lg font-bold text-emerald-500">{demoCapturesRemaining}</span>
              </div>
              <div>
                <p className="text-sm font-medium">Capturas restantes</p>
                <p className="text-xs text-muted-foreground">Modo Demo</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </SidebarProvider>
  )
}
