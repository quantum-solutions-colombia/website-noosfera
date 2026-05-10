"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  ArrowLeft,
  CheckCircle,
  Circle,
  Database,
  Zap,
  Shield,
  Users,
  BarChart3,
  FileText,
  Code,
  Layers,
  GitBranch,
  Settings,
  Eye,
  Palette,
  Server,
  Cpu,
  FileCode,
  Globe,
  Wallet,
  TrendingUp,
  Brain,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function DocumentacionPage() {
  const router = useRouter()

  const [functionalityChecklist] = useState([
    {
      id: 1,
      name: "Sistema de Autenticación",
      description: "Login/registro de usuarios con validación y redirección automática",
      completed: true,
      category: "Autenticación",
    },
    {
      id: 2,
      name: "Modo Demo Limitado",
      description: "2 capturas gratuitas con mensaje de upgrade al agotar tokens",
      completed: true,
      category: "UX",
    },
    {
      id: 3,
      name: "Dashboard Personalizado",
      description: "Panel de control adaptado por usuario con contador de créditos",
      completed: true,
      category: "Dashboard",
    },
    {
      id: 4,
      name: "Captura de Pulsos Cardíacos",
      description: "Sistema de monitoreo cardíaco con hasta 5 pulsos por sesión",
      completed: true,
      category: "Monitor Cardíaco",
    },
    {
      id: 5,
      name: "Interpretación de Ritmo Cardíaco",
      description: "Conversión pulsos → binario → patrones → imagen artística",
      completed: true,
      category: "IA",
    },
    {
      id: 6,
      name: "Modelo 3D de Corazón",
      description: "Visualización cardíaca con regiones anatómicas en tiempo real",
      completed: true,
      category: "Visualización",
    },
    {
      id: 7,
      name: "Estados Cardíacos",
      description: "Simulador de 6 estados con métricas de frecuencia cardíaca",
      completed: true,
      category: "Análisis",
    },
    {
      id: 8,
      name: "Generación de Imágenes IA",
      description: "8 estilos de interpretación visual de patrones cardíacos",
      completed: true,
      category: "IA",
    },
    {
      id: 9,
      name: "Visualización de Ondas Cardíacas",
      description: "Monitoreo en tiempo real de variabilidad del ritmo cardíaco",
      completed: true,
      category: "Visualización",
    },
    {
      id: 10,
      name: "Sistema de Métricas Cardíacas",
      description: "Estadísticas avanzadas de BPM y frecuencias dominantes",
      completed: true,
      category: "Análisis",
    },
    {
      id: 11,
      name: "Sistema de Planes de Suscripción",
      description: "Free (10 capturas), Estándar (50 capturas), Premium (ilimitado) en COP",
      completed: true,
      category: "Monetización",
    },
    {
      id: 12,
      name: "Contador de Tokens/Créditos",
      description: "Visualización en tiempo real de capturas y NFTs restantes por plan",
      completed: true,
      category: "UX",
    },
    {
      id: 13,
      name: "Sistema de NFTs Cardíacos",
      description: "Generación de tokens únicos para monetización de imágenes",
      completed: true,
      category: "Blockchain",
    },
    {
      id: 14,
      name: "Modal de Descarga NFT",
      description: "Exportación en múltiples formatos (PNG, JPG, SVG, WEBP) con metadata",
      completed: true,
      category: "Exportación",
    },
    {
      id: 15,
      name: "Integración Marketplace NFT",
      description: "Redirección directa a OpenSea Colombia para monetización",
      completed: true,
      category: "Blockchain",
    },
    {
      id: 16,
      name: "Dashboard Administrativo",
      description: "Panel con datos reales de Supabase y métricas en tiempo real",
      completed: true,
      category: "Admin",
    },
    {
      id: 17,
      name: "Gráficos Analíticos Avanzados",
      description: "Gráficos de torta, barras y KPIs con datos de usuarios reales",
      completed: true,
      category: "Admin",
    },
    {
      id: 18,
      name: "Interfaz Responsiva",
      description: "Diseño adaptativo para múltiples dispositivos",
      completed: true,
      category: "UX",
    },
    {
      id: 19,
      name: "Documentación Técnica Completa",
      description: "Guía actualizada de funcionalidades, arquitectura y modelo de negocio",
      completed: true,
      category: "Documentación",
    },
    {
      id: 20,
      name: "Términos y Privacidad NFT",
      description: "Documentación legal sobre monetización NFT en Colombia",
      completed: true,
      category: "Legal",
    },

    // Funcionalidades futuras
    {
      id: 21,
      name: "Integración con Dispositivos IoT",
      description: "Conexión directa con relojes inteligentes y monitores cardíacos",
      completed: false,
      category: "Hardware",
    },
    {
      id: 22,
      name: "API REST Completa",
      description: "Endpoints públicos para microservicios externos",
      completed: false,
      category: "Backend",
    },
    {
      id: 23,
      name: "Análisis Predictivo Cardíaco",
      description: "Machine learning para predicción de patrones cardíacos",
      completed: false,
      category: "IA",
    },
    {
      id: 24,
      name: "Marketplace Interno NFT",
      description: "Plataforma propia para compra/venta de NFTs cardíacos",
      completed: false,
      category: "Blockchain",
    },
    {
      id: 25,
      name: "Colaboración Multi-usuario",
      description: "Sesiones compartidas y análisis grupal de patrones",
      completed: false,
      category: "Social",
    },
    {
      id: 26,
      name: "Integración con Wallets Cripto",
      description: "Conexión directa con MetaMask, Trust Wallet, etc.",
      completed: false,
      category: "Blockchain",
    },
  ])

  const completedCount = functionalityChecklist.filter((item) => item.completed).length
  const totalCount = functionalityChecklist.length
  const progressPercentage = (completedCount / totalCount) * 100

  const categories = [...new Set(functionalityChecklist.map((item) => item.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push("/")} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-emerald-500" />
              <h1 className="text-2xl font-bold text-foreground">Documentación Técnica</h1>
            </div>
          </div>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            v2.0.0
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-12">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              Progreso del Desarrollo
            </CardTitle>
            <CardDescription>Estado actual de implementación de funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Funcionalidades Completadas</span>
                <span className="font-medium">
                  {completedCount} de {totalCount}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {progressPercentage.toFixed(1)}% del proyecto completado
              </div>
              <div className="flex gap-2 flex-wrap mt-4">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  <Wallet className="h-3 w-3 mr-1" />
                  Sistema NFT Implementado
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Planes de Monetización Activos
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                  <Heart className="h-3 w-3 mr-1" />
                  Contexto Cardíaco Completo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checklist">Checklist de Funcionalidades</TabsTrigger>
            <TabsTrigger value="planteamiento">Planteamiento</TabsTrigger>
            <TabsTrigger value="estado-arte">Estado del Arte</TabsTrigger>
            <TabsTrigger value="desarrollo">Desarrollo</TabsTrigger>
          </TabsList>

          {/* Checklist de Funcionalidades */}
          <TabsContent value="checklist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Funcionalidades Implementadas
                </CardTitle>
                <CardDescription>Lista actualizada de todas las características del sistema Noösfera</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categories.map((category) => {
                    const categoryItems = functionalityChecklist.filter((item) => item.category === category)
                    const categoryCompleted = categoryItems.filter((item) => item.completed).length

                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-emerald-500">{category}</h3>
                          <Badge
                            variant={categoryCompleted === categoryItems.length ? "default" : "secondary"}
                            className={
                              categoryCompleted === categoryItems.length
                                ? "bg-emerald-500 text-white dark:text-slate-900"
                                : ""
                            }
                          >
                            {categoryCompleted}/{categoryItems.length}
                          </Badge>
                        </div>

                        <div className="grid gap-3">
                          {categoryItems.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: item.id * 0.1 }}
                              className={`flex items-start gap-3 p-3 rounded-lg border ${
                                item.completed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-muted/30 border-border"
                              }`}
                            >
                              {item.completed ? (
                                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <h4
                                  className={`font-medium ${item.completed ? "text-emerald-600 dark:text-emerald-300" : "text-foreground"}`}
                                >
                                  {item.name}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planteamiento del Problema */}
          <TabsContent value="planteamiento" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  1. Planteamiento del Problema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Descripción del Problema</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Identificación del problema</h4>
                      <p>
                        La interpretación de patrones cardíacos y estados emocionales a través de monitores de ritmo
                        cardíaco requiere sistemas complejos y especializados que no están al alcance del usuario
                        promedio. Además, no existe una forma accesible de monetizar estos datos biométricos únicos.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Definir el Problema</h4>
                      <p>
                        Existe una brecha tecnológica entre los avances en monitoreo cardíaco y las aplicaciones
                        prácticas accesibles para usuarios finales que desean explorar la interpretación de sus patrones
                        de ritmo cardíaco y monetizarlos como NFTs únicos.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Analizar el Problema</h4>
                      <p>
                        Los sistemas de monitoreo cardíaco actuales son costosos, no ofrecen interfaces intuitivas para
                        la interpretación visual de patrones, y carecen de integración con tecnologías blockchain para
                        monetización de datos biométricos personales.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Objetivo General</h3>
                  <p className="text-sm text-muted-foreground">
                    Desarrollar una plataforma web accesible que permita a los usuarios interpretar sus patrones
                    cardíacos mediante inteligencia artificial, transformando pulsos del corazón en representaciones
                    visuales únicas que pueden ser monetizadas como NFTs en el mercado colombiano de criptomonedas.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Objetivos Específicos</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      Crear una interfaz web responsiva para la captura de pulsos cardíacos
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      Implementar algoritmos de conversión de pulsos a patrones geométricos únicos
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      Desarrollar sistema de visualización 3D del corazón en tiempo real
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      Integrar IA para generación de imágenes basadas en interpretación cardíaca
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      Implementar sistema de NFTs con tokens únicos para monetización
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      Crear planes de suscripción accesibles para el mercado colombiano
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      Integrar con marketplaces NFT para facilitar la venta
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      Establecer conexión con dispositivos IoT de monitoreo cardíaco
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      Desarrollar marketplace interno para NFTs cardíacos
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Modelo de Negocio</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                          <Users className="h-4 w-4 text-emerald-500" />
                          Plan Free
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-1 text-muted-foreground">
                        <p className="font-medium text-foreground">$0 COP/mes</p>
                        <p>• 10 capturas mensuales</p>
                        <p>• 5 NFTs por mes</p>
                        <p>• Exportación básica</p>
                        <p>• Galería personal</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                          <Zap className="h-4 w-4 text-blue-500" />
                          Plan Estándar
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-1 text-muted-foreground">
                        <p className="font-medium text-foreground">$39.900 COP/mes</p>
                        <p>• 50 capturas mensuales</p>
                        <p>• 25 NFTs por mes</p>
                        <p>• Todos los formatos</p>
                        <p>• Análisis avanzado</p>
                        <p>• Soporte prioritario</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                          <TrendingUp className="h-4 w-4 text-purple-500" />
                          Plan Premium
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-1 text-muted-foreground">
                        <p className="font-medium text-foreground">$89.900 COP/mes</p>
                        <p>• Capturas ilimitadas</p>
                        <p>• NFTs ilimitados</p>
                        <p>• API access</p>
                        <p>• Análisis predictivo</p>
                        <p>• Soporte 24/7</p>
                        <p>• Comisión reducida NFT</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Requerimientos Funcionales</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                          <Users className="h-4 w-4 text-emerald-500" />
                          Usuario
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-1 text-muted-foreground">
                        <p>• Registro y autenticación segura</p>
                        <p>• Modo demo sin persistencia</p>
                        <p>• Dashboard personalizado</p>
                        <p>• Gestión de sesiones</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                          <Zap className="h-4 w-4 text-emerald-500" />
                          Procesamiento
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-1 text-muted-foreground">
                        <p>• Captura de 5 pulsos cardíacos</p>
                        <p>• Conversión a código binario</p>
                        <p>• Generación de patrones geométricos</p>
                        <p>• Interpretación visual con IA</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Estado del Arte */}
          <TabsContent value="estado-arte" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Code className="h-5 w-5 text-emerald-500" />
                  2. Estado del Arte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Framework SOA con Metodología Scrum</h3>
                  <p className="text-sm text-muted-foreground">
                    Noösfera implementa un framework completo de Arquitectura Orientada a Servicios (SOA) desarrollado
                    con metodología Scrum, garantizando entregas incrementales y servicios desacoplados para la
                    interpretación neuronal en tiempo real.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Etapas de Desarrollo SOA + Scrum</h4>
                      <div className="grid gap-3">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-emerald-500 text-white">Sprint 0</Badge>
                            <h5 className="font-medium text-foreground">Definición del Dominio</h5>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            <strong>Área de aplicación:</strong> Interpretación cardíaca y visualización de patrones
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            <strong>Problema central:</strong> "Convertir pulsos cardíacos en representaciones visuales
                            únicas y monetizables"
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong>Product Backlog inicial:</strong> Sistema BCI, procesamiento cardíaco, generación
                            IA, dashboard usuario, monetización NFT
                          </p>
                        </div>

                        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-500 text-white">Sprint 1</Badge>
                            <h5 className="font-medium text-foreground">Arquitectura Base SOA</h5>
                          </div>
                          <div className="grid gap-2 text-xs text-muted-foreground">
                            <p>
                              <strong>Servicios básicos:</strong> Usuarios, autenticación, sesiones
                            </p>
                            <p>
                              <strong>Servicios de negocio:</strong> Procesamiento cardíaco, generación IA,
                              visualización 3D, monetización NFT
                            </p>
                            <p>
                              <strong>Servicios transversales:</strong> Seguridad, auditoría, métricas, admin dashboard
                            </p>
                            <p>
                              <strong>Stack seleccionado:</strong> Next.js 14, TypeScript, Supabase, Vercel
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-500 text-white">Sprint 2-3</Badge>
                            <h5 className="font-medium text-foreground">Servicios Reutilizables</h5>
                          </div>
                          <div className="grid gap-1 text-xs text-muted-foreground">
                            <p>
                              • <strong>Servicio Usuarios:</strong> CRUD de perfiles y configuraciones
                            </p>
                            <p>
                              • <strong>Servicio Pulsos:</strong> Captura y procesamiento de señales cardíacas
                            </p>
                            <p>
                              • <strong>Servicio Patrones:</strong> Conversión binaria y generación geométrica
                            </p>
                            <p>
                              • <strong>Servicio IA:</strong> Interpretación visual con 8 estilos diferentes
                            </p>
                            <p>
                              • <strong>Servicio Visualización:</strong> Renderizado 3D del corazón en tiempo real
                            </p>
                            <p>
                              • <strong>Servicio NFT:</strong> Generación y metadatos de tokens únicos
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-500 text-white">Sprint 4</Badge>
                            <h5 className="font-medium text-foreground">Contratos de Servicio (APIs)</h5>
                          </div>
                          <div className="grid gap-1 text-xs text-muted-foreground">
                            <p>
                              • <code>POST /api/auth/login</code> → Autenticar usuario
                            </p>
                            <p>
                              • <code>POST /api/pulses/process</code> → Procesar pulsos cardíacos
                            </p>
                            <p>
                              • <code>POST /api/generate/image</code> → Generar interpretación visual
                            </p>
                            <p>
                              • <code>POST /api/nft/generate</code> → Generar NFT Cardíaco
                            </p>
                            <p>
                              • <code>GET /api/users/sessions</code> → Consultar historial de sesiones
                            </p>
                            <p>
                              • <code>GET /api/admin/metrics</code> → Métricas del sistema en tiempo real
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-teal-500/5 border border-teal-500/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-teal-500 text-white">Sprint 5-6</Badge>
                            <h5 className="font-medium text-foreground">Integración y Despliegue</h5>
                          </div>
                          <div className="grid gap-1 text-xs text-muted-foreground">
                            <p>
                              • <strong>Orquestación:</strong> Docker containers y Kubernetes para escalabilidad
                            </p>
                            <p>
                              • <strong>CI/CD:</strong> Vercel para despliegues automáticos
                            </p>
                            <p>
                              • <strong>Servicios externos:</strong> APIs de IA para generación de imágenes y conexión
                              con marketplaces NFT
                            </p>
                            <p>
                              • <strong>Monitoreo:</strong> Dashboard administrativo con métricas en tiempo real
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Lenguajes de Programación Utilizados</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Frontend - Lenguajes de Presentación</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Code className="h-4 w-4 text-emerald-500" />
                              TypeScript
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Lenguaje Principal del Frontend</p>
                              <p>
                                <strong>¿Por qué TypeScript?</strong> Superset de JavaScript que añade tipado estático,
                                esencial para aplicaciones neuronales donde la precisión de datos es crítica. Previene
                                errores en tiempo de compilación y mejora la mantenibilidad del código.
                              </p>
                              <p>
                                <strong>Beneficios en SOA:</strong> Contratos de interfaz claros entre servicios,
                                autocompletado inteligente, refactoring seguro, y documentación automática de APIs.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> Todos los componentes React, hooks personalizados,
                                contextos de estado, y lógica de negocio del frontend están escritos en TypeScript.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Palette className="h-4 w-4 text-emerald-500" />
                              CSS3 + PostCSS
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Estilizado Avanzado</p>
                              <p>
                                <strong>¿Por qué CSS3?</strong> Estándar moderno que permite animaciones fluidas,
                                gradientes complejos, y layouts responsivos. Fundamental para visualizaciones neuronales
                                que requieren precisión visual y transiciones suaves.
                              </p>
                              <p>
                                <strong>PostCSS:</strong> Procesador que optimiza CSS automáticamente, añade vendor
                                prefixes, y permite usar características futuras de CSS hoy.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> Estilos globales, animaciones de pulsos cerebrales,
                                temas claro/oscuro, y efectos visuales para el modelo 3D del cerebro.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <FileText className="h-4 w-4 text-emerald-500" />
                              HTML5 Semántico
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Estructura Accesible</p>
                              <p>
                                <strong>¿Por qué HTML5?</strong> Estándar que proporciona elementos semánticos (header,
                                main, section, article) esenciales para aplicaciones médicas accesibles que deben
                                cumplir estándares WCAG.
                              </p>
                              <p>
                                <strong>Beneficios en SOA:</strong> Estructura consistente entre servicios, SEO
                                optimizado, y compatibilidad con tecnologías asistivas.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> Estructura semántica de dashboards, formularios
                                accesibles, y navegación optimizada para lectores de pantalla.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Zap className="h-4 w-4 text-emerald-500" />
                              JavaScript ES2023
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Lógica Dinámica</p>
                              <p>
                                <strong>¿Por qué ES2023?</strong> Versión moderna con características como async/await,
                                destructuring, modules, y array methods avanzados. Permite programación funcional y
                                manejo eficiente de datos neuronales asíncronos.
                              </p>
                              <p>
                                <strong>Características utilizadas:</strong> Promises para APIs, Map/Set para
                                estructuras de datos complejas, y WeakMap para gestión de memoria en visualizaciones 3D.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> Procesamiento de pulsos cerebrales, animaciones del
                                modelo 3D, y comunicación en tiempo real con Supabase.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Backend - Lenguajes de Servidor</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Server className="h-4 w-4 text-emerald-500" />
                              Node.js + TypeScript
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Runtime del Servidor</p>
                              <p>
                                <strong>¿Por qué Node.js?</strong> Runtime JavaScript del servidor que permite usar el
                                mismo lenguaje en frontend y backend. Ideal para aplicaciones en tiempo real como
                                interpretación neuronal que requiere baja latencia.
                              </p>
                              <p>
                                <strong>Event Loop:</strong> Arquitectura no bloqueante perfecta para manejar múltiples
                                sesiones BCI simultáneas sin degradar el rendimiento.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> API Routes de Next.js, Server Actions, procesamiento
                                de pulsos cerebrales, y generación de imágenes en tiempo real.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Database className="h-4 w-4 text-emerald-500" />
                              SQL (PostgreSQL)
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Lenguaje de Base de Datos</p>
                              <p>
                                <strong>¿Por qué SQL?</strong> Lenguaje estándar para bases de datos relacionales,
                                esencial para consultas complejas de datos neuronales históricos y análisis de patrones
                                cerebrales a largo plazo.
                              </p>
                              <p>
                                <strong>PostgreSQL:</strong> Base de datos robusta con soporte para JSON, arrays, y
                                funciones avanzadas. Ideal para almacenar patrones neuronales complejos.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> Consultas de usuarios, sesiones BCI, pulsos
                                cerebrales, imágenes generadas, y análisis estadísticos de actividad neuronal.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Shield className="h-4 w-4 text-emerald-500" />
                              PL/pgSQL
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Procedimientos Almacenados</p>
                              <p>
                                <strong>¿Por qué PL/pgSQL?</strong> Lenguaje procedural de PostgreSQL que permite crear
                                funciones complejas directamente en la base de datos. Optimiza el procesamiento de datos
                                neuronales sin transferir grandes volúmenes al servidor.
                              </p>
                              <p>
                                <strong>Beneficios en SOA:</strong> Lógica de negocio encapsulada en la base de datos,
                                mejor rendimiento, y consistencia de datos garantizada.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> Triggers para auditoría, funciones de agregación de
                                pulsos cerebrales, y procedimientos de limpieza de sesiones antiguas.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Cpu className="h-4 w-4 text-emerald-500" />
                              Edge Runtime JavaScript
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Computación Distribuida</p>
                              <p>
                                <strong>¿Por qué Edge Runtime?</strong> Subconjunto de JavaScript optimizado para
                                ejecutarse en edge locations globalmente. Reduce latencia en procesamiento neuronal
                                crítico ejecutándose cerca del usuario.
                              </p>
                              <p>
                                <strong>Limitaciones beneficiosas:</strong> Sin Node.js APIs, solo Web APIs estándar, lo
                                que garantiza portabilidad y rendimiento consistente.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> Procesamiento de IA para interpretación de pulsos,
                                generación de patrones geométricos, y APIs de alta frecuencia.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Lenguajes de Configuración y Datos</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <FileCode className="h-4 w-4 text-emerald-500" />
                              JSON
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Intercambio de Datos</p>
                              <p>
                                <strong>¿Por qué JSON?</strong> Formato ligero y legible para intercambio de datos entre
                                servicios. Nativo en JavaScript y soportado universalmente por APIs REST.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> Configuración de componentes, respuestas de API,
                                almacenamiento de patrones geométricos neuronales, y configuración de Tailwind CSS.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Settings className="h-4 w-4 text-emerald-500" />
                              YAML
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Configuración de CI/CD</p>
                              <p>
                                <strong>¿Por qué YAML?</strong> Formato legible para configuración de pipelines de
                                despliegue. Más limpio que JSON para archivos de configuración complejos.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> GitHub Actions workflows, configuración de Docker (si
                                se usa), y archivos de configuración de herramientas de desarrollo.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Globe className="h-4 w-4 text-emerald-500" />
                              MDX
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Documentación Interactiva</p>
                              <p>
                                <strong>¿Por qué MDX?</strong> Combina Markdown con componentes React, permitiendo
                                documentación técnica interactiva con ejemplos ejecutables de código.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> Esta documentación técnica, guías de usuario, y
                                tutoriales interactivos sobre interpretación neuronal.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Layers className="h-4 w-4 text-emerald-500" />
                              GLSL
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Shaders 3D</p>
                              <p>
                                <strong>¿Por qué GLSL?</strong> OpenGL Shading Language para efectos visuales avanzados
                                en el modelo 3D del cerebro. Permite renderizado de alta performance directamente en la
                                GPU.
                              </p>
                              <p>
                                <strong>Uso en Noösfera:</strong> Efectos de iluminación neuronal, animaciones de pulsos
                                cerebrales, y visualizaciones de actividad en tiempo real en el modelo 3D.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Stack Tecnológico Detallado</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Frontend - Capa de Presentación</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Code className="h-4 w-4 text-emerald-500" />
                              Framework Principal
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Next.js 14 (App Router)</p>
                              <p>
                                <strong>¿Por qué?</strong> Framework React full-stack que permite Server-Side Rendering
                                (SSR), Static Site Generation (SSG) y API Routes en una sola aplicación. Ideal para
                                aplicaciones neurológicas que requieren renderizado rápido y SEO optimizado.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Facilita la creación de microservicios con API Routes,
                                permite separación clara entre cliente y servidor, y optimiza la carga de componentes.
                              </p>
                            </div>

                            <div>
                              <p className="font-medium text-foreground">TypeScript</p>
                              <p>
                                <strong>¿Por qué?</strong> Tipado estático que previene errores en tiempo de
                                compilación, especialmente crítico en aplicaciones médicas donde la precisión de datos
                                es fundamental.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Contratos de interfaz claros entre servicios,
                                autocompletado inteligente, y refactoring seguro en arquitecturas complejas.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Layers className="h-4 w-4 text-emerald-500" />
                              Estilizado y UI
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Tailwind CSS</p>
                              <p>
                                <strong>¿Por qué?</strong> Framework CSS utility-first que permite desarrollo rápido con
                                diseño consistente. Perfecto para interfaces neuronales que requieren precisión visual.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Componentes reutilizables con estilos consistentes,
                                fácil mantenimiento y escalabilidad visual.
                              </p>
                            </div>

                            <div>
                              <p className="font-medium text-foreground">Shadcn/ui + Radix UI</p>
                              <p>
                                <strong>¿Por qué?</strong> Componentes accesibles y personalizables que cumplen
                                estándares WCAG, esencial para aplicaciones médicas inclusivas.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Biblioteca de componentes modulares y reutilizables en
                                toda la arquitectura de servicios.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Zap className="h-4 w-4 text-emerald-500" />
                              Animaciones y UX
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Framer Motion</p>
                              <p>
                                <strong>¿Por qué?</strong> Biblioteca de animaciones declarativas que mejora la
                                experiencia usuario en visualizaciones neuronales complejas.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Animaciones consistentes entre servicios, transiciones
                                fluidas en cambios de estado, y feedback visual inmediato.
                              </p>
                            </div>

                            <div>
                              <p className="font-medium text-foreground">React Hook Form</p>
                              <p>
                                <strong>¿Por qué?</strong> Manejo eficiente de formularios con validación en tiempo
                                real, crucial para captura precisa de datos neuronales.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Validación consistente entre servicios y reducción de
                                re-renderizados innecesarios.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Brain className="h-4 w-4 text-emerald-500" />
                              Visualización 3D
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Three.js + React Three Fiber</p>
                              <p>
                                <strong>¿Por qué?</strong> Renderizado 3D de alta performance para visualización
                                anatómica del cerebro y representación de patrones neuronales en tiempo real.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Servicio de visualización independiente, reutilizable
                                en múltiples contextos (dashboard, admin, análisis).
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Backend - Lógica de Negocio</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Database className="h-4 w-4 text-emerald-500" />
                              Base de Datos
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Supabase (PostgreSQL)</p>
                              <p>
                                <strong>¿Por qué?</strong> Base de datos relacional con Row Level Security (RLS)
                                integrada, autenticación automática, y APIs REST generadas automáticamente. Ideal para
                                datos médicos que requieren máxima seguridad.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Servicios de datos independientes, escalabilidad
                                automática, backup automático, y APIs RESTful listas para microservicios.
                              </p>
                            </div>

                            <div>
                              <p className="font-medium text-foreground">Esquema de Datos Neurológicos</p>
                              <p>
                                <strong>Tablas principales:</strong> users, bci_sessions, brain_pulses,
                                generated_images, user_preferences
                              </p>
                              <p>
                                <strong>Relaciones:</strong> Diseño normalizado que permite análisis histórico y
                                patrones de comportamiento neuronal por usuario.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Settings className="h-4 w-4 text-emerald-500" />
                              API y Servicios
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Next.js API Routes</p>
                              <p>
                                <strong>¿Por qué?</strong> Endpoints RESTful integrados que permiten crear
                                microservicios sin configuración adicional. Perfecto para servicios de procesamiento
                                neuronal que requieren baja latencia.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Cada ruta es un microservicio independiente, fácil
                                testing, y despliegue automático con Vercel.
                              </p>
                            </div>

                            <div>
                              <p className="font-medium text-foreground">Server Actions</p>
                              <p>
                                <strong>¿Por qué?</strong> Funciones del servidor que se ejecutan de forma segura,
                                ideales para mutaciones de datos neuronales sensibles.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Lógica de negocio encapsulada, validación automática, y
                                integración directa con componentes React.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Shield className="h-4 w-4 text-emerald-500" />
                              Seguridad y Autenticación
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Supabase Auth + JWT</p>
                              <p>
                                <strong>¿Por qué?</strong> Sistema de autenticación robusto con tokens JWT, esencial
                                para proteger datos neuronales sensibles y cumplir regulaciones médicas.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Autenticación centralizada para todos los
                                microservicios, sesiones stateless, y políticas RLS automáticas.
                              </p>
                            </div>

                            <div>
                              <p className="font-medium text-foreground">Row Level Security (RLS)</p>
                              <p>
                                <strong>¿Por qué?</strong> Cada usuario solo puede acceder a sus propios datos
                                neuronales, garantizando privacidad médica a nivel de base de datos.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Seguridad automática en todos los servicios que acceden
                                a datos, sin lógica adicional en cada microservicio.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <BarChart3 className="h-4 w-4 text-emerald-500" />
                              Procesamiento IA
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Edge Runtime</p>
                              <p>
                                <strong>¿Por qué?</strong> Procesamiento distribuido cerca del usuario para reducir
                                latencia en interpretación neuronal en tiempo real.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Servicios de IA escalables automáticamente,
                                procesamiento paralelo, y respuesta inmediata.
                              </p>
                            </div>

                            <div>
                              <p className="font-medium text-foreground">APIs de IA Externas</p>
                              <p>
                                <strong>¿Por qué?</strong> Integración con servicios especializados de generación de
                                imágenes para interpretación visual de patrones neuronales.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Servicios especializados intercambiables, sin
                                dependencia de un solo proveedor de IA.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Infraestructura y Despliegue</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <Layers className="h-4 w-4 text-emerald-500" />
                              Hosting y CDN
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">Vercel Platform</p>
                              <p>
                                <strong>¿Por qué?</strong> Plataforma optimizada para Next.js con despliegue automático,
                                Edge Network global, y escalabilidad automática. Ideal para aplicaciones neuronales que
                                requieren alta disponibilidad.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Cada servicio se despliega independientemente, rollback
                                automático, preview deployments, y monitoreo integrado.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                              <GitBranch className="h-4 w-4 text-emerald-500" />
                              CI/CD y Monitoreo
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-3 text-muted-foreground">
                            <div>
                              <p className="font-medium text-foreground">GitHub Actions + Vercel</p>
                              <p>
                                <strong>¿Por qué?</strong> Pipeline automatizado que garantiza calidad de código y
                                despliegues seguros para aplicaciones médicas críticas.
                              </p>
                              <p>
                                <strong>Beneficios SOA:</strong> Testing automático de cada microservicio, despliegue
                                independiente, y rollback inmediato en caso de errores.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Tipos de Framework en Noösfera</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                          <Code className="h-4 w-4 text-emerald-500" />
                          Framework Web Full-Stack
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-2 text-muted-foreground">
                        <p>
                          <strong>Frontend:</strong> React + Next.js para interfaces neuronales interactivas
                        </p>
                        <p>
                          <strong>Backend:</strong> API Routes + Server Actions para procesamiento de datos
                        </p>
                        <p>
                          <strong>Aplicación:</strong> Plataforma web completa para interpretación neuronal
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                          <Brain className="h-4 w-4 text-emerald-500" />
                          Framework de Ciencia de Datos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-2 text-muted-foreground">
                        <p>
                          <strong>Procesamiento:</strong> Algoritmos de conversión binaria y patrones geométricos
                        </p>
                        <p>
                          <strong>Análisis:</strong> Interpretación de señales cerebrales en tiempo real
                        </p>
                        <p>
                          <strong>Visualización:</strong> Representación 3D de actividad neuronal
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                          <Shield className="h-4 w-4 text-emerald-500" />
                          Framework de Ciberseguridad
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-2 text-muted-foreground">
                        <p>
                          <strong>Autenticación:</strong> JWT + RLS para protección de datos médicos
                        </p>
                        <p>
                          <strong>Privacidad:</strong> Políticas estrictas de acceso a datos neuronales
                        </p>
                        <p>
                          <strong>Cumplimiento:</strong> Estándares de seguridad para aplicaciones de salud
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Desarrollo */}
          <TabsContent value="desarrollo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <GitBranch className="h-5 w-5 text-emerald-500" />
                  3. Desarrollo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Metodología de Desarrollo</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-foreground">Metodología Scrum</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-2 text-muted-foreground">
                        <p>• Desarrollo iterativo e incremental</p>
                        <p>• Sprints de 2 semanas</p>
                        <p>• Revisiones continuas</p>
                        <p>• Adaptación a cambios de requerimientos</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-foreground">Modelo Vista Controlador</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-2 text-muted-foreground">
                        <p>
                          • <strong>Modelo:</strong> Contextos y hooks de estado
                        </p>
                        <p>
                          • <strong>Vista:</strong> Componentes React
                        </p>
                        <p>
                          • <strong>Controlador:</strong> Server Actions y API Routes
                        </p>
                        <p>• Separación clara de responsabilidades</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Arquitectura del Sistema</h3>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Diseño de la Base de Datos</h4>
                    <div className="grid gap-3 text-xs">
                      <div className="p-3 bg-muted/20 rounded border">
                        <code className="text-emerald-500">users</code>
                        <p className="text-muted-foreground mt-1">id, email, name, created_at, settings</p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded border">
                        <code className="text-emerald-500">pulse_sessions</code>
                        <p className="text-muted-foreground mt-1">
                          id, user_id, pulses_data, binary_result, created_at
                        </p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded border">
                        <code className="text-emerald-500">generated_images</code>
                        <p className="text-muted-foreground mt-1">id, session_id, image_url, style_type, patterns</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Arquitectura de Componentes</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                            <Eye className="h-4 w-4 text-emerald-500" />
                            Frontend
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs space-y-1 text-muted-foreground">
                          <p>• Componentes reutilizables</p>
                          <p>• Context API para estado global</p>
                          <p>• Hooks personalizados</p>
                          <p>• Animaciones con Framer Motion</p>
                          <p>• Responsive design</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                            <Database className="h-4 w-4 text-emerald-500" />
                            Backend
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs space-y-1 text-muted-foreground">
                          <p>• API Routes para endpoints</p>
                          <p>• Server Actions para mutaciones</p>
                          <p>• Middleware de autenticación</p>
                          <p>• Procesamiento de datos neuronales</p>
                          <p>• Integración con servicios IA</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-500">Seguridad y Pruebas</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                          <Shield className="h-4 w-4 text-emerald-500" />
                          Seguridad de la API
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-1 text-muted-foreground">
                        <p>• Autenticación JWT</p>
                        <p>• Validación de entrada</p>
                        <p>• Rate limiting</p>
                        <p>• CORS configurado</p>
                        <p>• Sanitización de datos</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                          <Settings className="h-4 w-4 text-emerald-500" />
                          Pruebas del Software
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-1 text-muted-foreground">
                        <p>• Pruebas unitarias (Jest)</p>
                        <p>• Pruebas de integración</p>
                        <p>• Pruebas de componentes (Testing Library)</p>
                        <p>• Pruebas de API endpoints</p>
                        <p>• Pruebas de rendimiento</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
