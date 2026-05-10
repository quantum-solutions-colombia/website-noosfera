"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileText, Database, Layers, Brain, Zap, Search, Download, FileDown, FileCode, Cpu, Layout } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast"
import html2canvas from "html2canvas"

export default function Documentation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [techFilter, setTechFilter] = useState("all")

  const diagramRef = useRef<HTMLDivElement>(null)
  const contextDiagramRef = useRef<HTMLDivElement>(null)
  const componentDiagramRef = useRef<HTMLDivElement>(null)
  const widgetDiagramRef = useRef<HTMLDivElement>(null)
  const architectureDiagramRef = useRef<HTMLDivElement>(null)
  const dataFlowDiagramRef = useRef<HTMLDivElement>(null)

  const exportDiagramAsPNG = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
    if (!ref.current) return

    toast.loading("Exportando diagrama...", { id: "export-diagram" })

    try {
      const canvas = await html2canvas(ref.current, {
        backgroundColor: null,
        scale: 2, // Higher resolution
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `${filename}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Diagrama exportado correctamente", { id: "export-diagram" })
    } catch (error) {
      console.error("Error exporting diagram:", error)
      toast.error("Error al exportar el diagrama", { id: "export-diagram" })
    }
  }

  const generateDocumentation = () => {
    // Crear contenido HTML que Word puede interpretar
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Documentación de Clases del Sistema Noösfera</title>
  <style>
    body { font-family: 'Calibri', sans-serif; line-height: 1.5; }
    h1 { color: #2E7D32; font-size: 24pt; }
    h2 { color: #388E3C; font-size: 18pt; margin-top: 20pt; }
    h3 { color: #43A047; font-size: 14pt; }
    table { width: 100%; border-collapse: collapse; margin: 15pt 0; }
    th { background-color: #E8F5E9; color: #2E7D32; font-weight: bold; text-align: left; padding: 8pt; border: 1px solid #C8E6C9; }
    td { padding: 8pt; border: 1px solid #E0E0E0; vertical-align: top; }
    .class-name { font-weight: bold; }
    .class-type { color: #757575; font-style: italic; }
    .tech-badge { display: inline-block; padding: 2pt 6pt; border-radius: 4pt; font-size: 8pt; color: white; }
    .tech-js { background-color: #F7DF1E; color: black; }
    .tech-ts { background-color: #3178C6; }
    .tech-react { background-color: #61DAFB; color: black; }
    .tech-html { background-color: #E34F26; }
    .tech-css { background-color: #1572B6; }
    .tech-api { background-color: #00BCD4; }
    .tech-threejs { background-color: #000000; }
    .class-diagram { page-break-inside: avoid; margin: 20pt 0; }
    .class-box { border: 1px solid #000; margin-bottom: 10pt; }
    .class-name-header { background-color: #E8F5E9; padding: 5pt; font-weight: bold; border-bottom: 1px solid #000; }
    .class-attributes { padding: 5pt; border-bottom: 1px solid #000; }
    .class-methods { padding: 5pt; }
    .relationship { margin: 5pt 0; }
    .category-header { background-color: #F5F5F5; padding: 5pt; font-weight: bold; border-bottom: 1px solid #E0E0E0; }
  </style>
</head>
<body>
  <h1>Documentación de Clases del Sistema Noösfera</h1>
  
  <h2>Tabla Completa de Clases por Tecnología</h2>
  
  <h3>Componentes React (TypeScript)</h3>
  <table>
    <tr>
      <th width="20%">Clase</th>
      <th width="15%">Tipo</th>
      <th width="15%">Tecnología</th>
      <th width="20%">Función</th>
      <th width="30%">Descripción</th>
    </tr>
    <tr>
      <td class="class-name">Dashboard</td>
      <td class="class-type">Componente</td>
      <td><span class="tech-badge tech-react">React</span> <span class="tech-badge tech-ts">TypeScript</span></td>
      <td>Interfaz principal</td>
      <td>Componente principal que organiza la interfaz de usuario y gestiona la navegación entre secciones.</td>
    </tr>
    <tr>
      <td class="class-name">ThoughtVisualizer</td>
      <td class="class-type">Componente</td>
      <td><span class="tech-badge tech-react">React</span> <span class="tech-badge tech-ts">TypeScript</span> <span class="tech-badge tech-threejs">Three.js</span></td>
      <td>Visualización de patrones</td>
      <td>Visualiza los patrones neuronales y los pensamientos interpretados mediante animaciones interactivas.</td>
    </tr>
    <!-- Más componentes React -->
  </table>
  
  <h3>Contextos (TypeScript)</h3>
  <table>
    <tr>
      <th width="20%">Clase</th>
      <th width="15%">Tipo</th>
      <th width="15%">Tecnología</th>
      <th width="20%">Función</th>
      <th width="30%">Descripción</th>
    </tr>
    <tr>
      <td class="class-name">NoosferaContext</td>
      <td class="class-type">Contexto</td>
      <td><span class="tech-badge tech-react">React</span> <span class="tech-badge tech-ts">TypeScript</span></td>
      <td>Gestión de estado global</td>
      <td>Proporciona acceso centralizado al estado de la aplicación, incluyendo la conexión BCI, patrones de pensamiento, contenido generado y configuración del sistema.</td>
    </tr>
    <!-- Más contextos -->
  </table>
  
  <!-- Más tablas por tecnología -->
  
  <h2>Diagramas de Clases</h2>
  
  <h3>Arquitectura General del Sistema</h3>
  <!-- Diagrama de arquitectura -->
  
  <h3>Contextos</h3>
  <!-- Diagrama de contextos -->
  
  <h3>Componentes Principales</h3>
  <!-- Diagrama de componentes -->
  
  <h3>Widgets y Componentes Auxiliares</h3>
  <!-- Diagrama de widgets -->
  
  <h3>Flujo de Datos</h3>
  <!-- Diagrama de flujo de datos -->
</body>
</html>
    `

    // Crear un blob con el contenido HTML
    const blob = new Blob([htmlContent], { type: "application/msword" })

    // Crear URL para el blob
    const url = URL.createObjectURL(blob)

    // Crear un elemento de enlace para descargar
    const a = document.createElement("a")
    a.href = url
    a.download = "Noosfera_Documentacion_Clases.doc"

    // Simular clic para iniciar la descarga
    document.body.appendChild(a)
    a.click()

    // Limpiar
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Documentación de clases descargada en formato Word correctamente")
  }

  // Datos de todas las clases del sistema con tecnología añadida
  const allClasses = [
    // Contextos
    {
      name: "NoosferaContext",
      type: "Contexto",
      tech: "React/TypeScript",
      category: "Contexto",
      function: "Gestión de estado global",
      description:
        "Proporciona acceso centralizado al estado de la aplicación, incluyendo la conexión BCI, patrones de pensamiento, contenido generado y configuración del sistema.",
    },
    {
      name: "AuthContext",
      type: "Contexto",
      tech: "React/TypeScript",
      category: "Contexto",
      function: "Gestión de autenticación",
      description:
        "Maneja la autenticación de usuarios, incluyendo inicio de sesión, registro, cierre de sesión y gestión de perfiles de usuario.",
    },

    // Componentes React
    {
      name: "Dashboard",
      type: "Componente",
      tech: "React/TypeScript",
      category: "UI",
      function: "Interfaz principal",
      description:
        "Componente principal que organiza la interfaz de usuario y gestiona la navegación entre secciones. Coordina la interacción entre componentes.",
    },
    {
      name: "ThoughtVisualizer",
      type: "Componente",
      tech: "React/TypeScript/Three.js",
      category: "UI",
      function: "Visualización de patrones",
      description:
        "Visualiza los patrones neuronales y los pensamientos interpretados mediante animaciones interactivas. Proporciona controles para zoom, rotación y modo de pantalla completa.",
    },
    {
      name: "ContentGenerator",
      type: "Componente",
      tech: "React/TypeScript",
      category: "UI",
      function: "Generación de contenido",
      description:
        "Genera contenido (texto e imágenes) a partir de los patrones neuronales capturados. Permite ajustar parámetros como complejidad y creatividad.",
    },
    {
      name: "ContentLibrary",
      type: "Componente",
      tech: "React/TypeScript",
      category: "UI",
      function: "Gestión de contenido",
      description:
        "Biblioteca que almacena y gestiona el contenido generado a partir de los patrones neuronales. Permite filtrar, visualizar y eliminar contenido.",
    },
    {
      name: "SettingsPanel",
      type: "Componente",
      tech: "React/TypeScript",
      category: "UI",
      function: "Configuración del sistema",
      description:
        "Panel de configuración que permite ajustar los parámetros del sistema, como sensibilidad neural, velocidad de procesamiento y opciones de visualización.",
    },
    {
      name: "BciSimulator",
      type: "Componente",
      tech: "React/TypeScript/Three.js",
      category: "UI",
      function: "Simulación de BCI",
      description:
        "Simulador de interfaz cerebro-computadora que visualiza la actividad neuronal y simula conexiones neuronales en tiempo real.",
    },

    // Widgets
    {
      name: "BrainwaveChart",
      type: "Widget",
      tech: "React/TypeScript/D3.js",
      category: "UI",
      function: "Visualización de ondas",
      description:
        "Visualiza la actividad de ondas cerebrales en tiempo real mediante gráficos dinámicos que muestran diferentes frecuencias cerebrales.",
    },
    {
      name: "PatternVisualizer",
      type: "Widget",
      tech: "React/TypeScript/D3.js",
      category: "UI",
      function: "Visualización de patrones",
      description:
        "Muestra los patrones neuronales específicos capturados, permitiendo a los usuarios entender la estructura de sus pensamientos.",
    },
    {
      name: "ConnectionStatus",
      type: "Widget",
      tech: "React/TypeScript",
      category: "UI",
      function: "Estado de conexión",
      description:
        "Muestra el estado de conexión del BCI, proporcionando feedback visual sobre si el dispositivo está conectado y funcionando correctamente.",
    },
    {
      name: "SystemMetrics",
      type: "Widget",
      tech: "React/TypeScript/D3.js",
      category: "UI",
      function: "Métricas del sistema",
      description:
        "Muestra métricas del sistema en tiempo real, como uso de CPU, memoria y rendimiento del procesamiento neuronal.",
    },
    {
      name: "ActivityTimeline",
      type: "Widget",
      tech: "React/TypeScript",
      category: "UI",
      function: "Historial de actividades",
      description:
        "Muestra un historial cronológico de actividades y eventos del sistema, mejorando la trazabilidad de las interacciones.",
    },
    {
      name: "StatusRing",
      type: "Widget",
      tech: "React/TypeScript/SVG",
      category: "UI",
      function: "Indicador de estado",
      description:
        "Visualiza el estado de conexión y la fuerza de la señal mediante un diseño circular intuitivo y estético.",
    },

    // Animaciones
    {
      name: "NeuralParticles",
      type: "Animación",
      tech: "Three.js/WebGL",
      category: "Visualización",
      function: "Simulación neuronal",
      description:
        "Sistema de partículas que simula la actividad neuronal, visualizando las conexiones y activaciones neuronales de forma dinámica.",
    },
    {
      name: "BrainModel",
      type: "Animación",
      tech: "Three.js/WebGL",
      category: "Visualización",
      function: "Modelo cerebral",
      description:
        "Modelo 3D del cerebro con animaciones que muestran la actividad en diferentes regiones cerebrales durante el procesamiento de pensamientos.",
    },
    {
      name: "SpectralAnalysis",
      type: "Widget",
      tech: "React/TypeScript/WebGL",
      category: "Visualización",
      function: "Análisis de frecuencias",
      description:
        "Visualiza el análisis espectral de las ondas cerebrales, mostrando la distribución de frecuencias y potencias en tiempo real.",
    },

    // Hooks
    {
      name: "useResizeObserver",
      type: "Hook",
      tech: "TypeScript",
      category: "Utilidad",
      function: "Observación de tamaño",
      description:
        "Hook personalizado para manejar ResizeObserver de manera segura, facilitando la creación de componentes responsivos.",
    },
    {
      name: "useMobile",
      type: "Hook",
      tech: "TypeScript",
      category: "Utilidad",
      function: "Detección de dispositivos",
      description:
        "Hook para detectar dispositivos móviles y ajustar la interfaz según el tipo de dispositivo y tamaño de pantalla.",
    },
    {
      name: "useBciConnection",
      type: "Hook",
      tech: "TypeScript/WebSocket",
      category: "Conexión",
      function: "Gestión de conexión BCI",
      description:
        "Hook personalizado para gestionar la conexión con el dispositivo BCI, manejar eventos de conexión y desconexión.",
    },
    {
      name: "useThoughtCapture",
      type: "Hook",
      tech: "TypeScript",
      category: "Procesamiento",
      function: "Captura de pensamientos",
      description: "Hook para capturar y procesar patrones de pensamiento desde el dispositivo BCI.",
    },

    // API y Servicios
    {
      name: "BciApiService",
      type: "Servicio",
      tech: "TypeScript/REST",
      category: "API",
      function: "Comunicación con API",
      description: "Servicio para comunicarse con la API del dispositivo BCI, enviar comandos y recibir datos.",
    },
    {
      name: "ContentGenerationService",
      type: "Servicio",
      tech: "TypeScript/REST",
      category: "API",
      function: "Generación de contenido",
      description: "Servicio para comunicarse con la API de generación de contenido basada en patrones neuronales.",
    },
    {
      name: "AuthService",
      type: "Servicio",
      tech: "TypeScript/REST",
      category: "API",
      function: "Autenticación",
      description: "Servicio para manejar la autenticación de usuarios, tokens y sesiones.",
    },
    {
      name: "StorageService",
      type: "Servicio",
      tech: "TypeScript/IndexedDB",
      category: "Almacenamiento",
      function: "Almacenamiento local",
      description:
        "Servicio para almacenar datos localmente utilizando IndexedDB, incluyendo patrones capturados y contenido generado.",
    },

    // Tipos y Enums
    {
      name: "ContentType",
      type: "Enum",
      tech: "TypeScript",
      category: "Tipo",
      function: "Tipos de contenido",
      description:
        "Define los tipos de contenido que pueden generarse a partir de patrones neuronales: 'text' | 'image'.",
    },
    {
      name: "ConnectionStatus",
      type: "Enum",
      tech: "TypeScript",
      category: "Tipo",
      function: "Estados de conexión",
      description:
        "Define los posibles estados de conexión del dispositivo BCI: 'disconnected' | 'connecting' | 'connected' | 'calibrating' | 'error'.",
    },
    {
      name: "GeneratedContent",
      type: "Interface",
      tech: "TypeScript",
      category: "Tipo",
      function: "Estructura de contenido",
      description:
        "Define la estructura del contenido generado a partir de patrones neuronales, incluyendo tipo, contenido, timestamp y metadatos.",
    },
    {
      name: "NoosferaConfig",
      type: "Interface",
      tech: "TypeScript",
      category: "Tipo",
      function: "Configuración del sistema",
      description:
        "Define la configuración del sistema Noösfera, incluyendo sensibilidad neural, velocidad de procesamiento y opciones de visualización.",
    },
    {
      name: "ThoughtPattern",
      type: "Interface",
      tech: "TypeScript",
      category: "Tipo",
      function: "Estructura de patrones",
      description:
        "Define la estructura de un patrón de pensamiento capturado, incluyendo complejidad, frecuencia dominante y datos del patrón.",
    },
    {
      name: "User",
      type: "Interface",
      tech: "TypeScript",
      category: "Tipo",
      function: "Datos de usuario",
      description:
        "Define la estructura de datos de un usuario, incluyendo información personal, rol, fechas de creación y preferencias.",
    },

    // Utilidades
    {
      name: "PatternAnalyzer",
      type: "Utilidad",
      tech: "TypeScript/WebAssembly",
      category: "Procesamiento",
      function: "Análisis de patrones",
      description:
        "Utilidad para analizar patrones neuronales, identificar características y clasificarlos según su complejidad y tipo.",
    },
    {
      name: "SignalProcessor",
      type: "Utilidad",
      tech: "TypeScript/WebAssembly",
      category: "Procesamiento",
      function: "Procesamiento de señales",
      description:
        "Utilidad para procesar señales neuronales en bruto, aplicar filtros y transformaciones para mejorar la calidad de los datos.",
    },
    {
      name: "DataNormalizer",
      type: "Utilidad",
      tech: "TypeScript",
      category: "Procesamiento",
      function: "Normalización de datos",
      description:
        "Utilidad para normalizar datos neuronales, eliminar ruido y preparar los datos para su visualización y análisis.",
    },

    // Estilos
    {
      name: "GlobalStyles",
      type: "Estilo",
      tech: "CSS/Tailwind",
      category: "UI",
      function: "Estilos globales",
      description: "Estilos globales de la aplicación, incluyendo variables CSS, temas y estilos base.",
    },
    {
      name: "ThemeProvider",
      type: "Componente",
      tech: "React/TypeScript",
      category: "UI",
      function: "Proveedor de tema",
      description:
        "Componente que proporciona el tema de la aplicación y gestiona el cambio entre modo claro y oscuro.",
    },
    {
      name: "AnimationStyles",
      type: "Estilo",
      tech: "CSS/Framer Motion",
      category: "UI",
      function: "Estilos de animación",
      description: "Estilos y configuraciones para las animaciones de la interfaz de usuario.",
    },
  ]

  // Obtener categorías únicas para el filtro
  const categories = [...new Set(allClasses.map((item) => item.category))]

  // Obtener tecnologías únicas para el filtro
  const technologies = [...new Set(allClasses.map((item) => item.tech))]
    .flatMap((tech) => tech.split("/"))
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort()

  // Filtrar elementos según el término de búsqueda y filtros
  const filterItems = (items) => {
    return items.filter((item) => {
      // Filtro de búsqueda
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tech.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro de categoría
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

      // Filtro de tecnología
      const matchesTech = techFilter === "all" || item.tech.toLowerCase().includes(techFilter.toLowerCase())

      return matchesSearch && matchesCategory && matchesTech
    })
  }

  const filteredClasses = filterItems(allClasses)

  // Agrupar clases por categoría para mostrarlas organizadas
  const groupedClasses = filteredClasses.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  // Función para renderizar un badge de tecnología con el color adecuado
  const renderTechBadge = (tech) => {
    const techColors = {
      React: "bg-blue-500 text-white",
      TypeScript: "bg-blue-700 text-white",
      JavaScript: "bg-yellow-400 text-black",
      HTML: "bg-orange-500 text-white",
      CSS: "bg-blue-400 text-white",
      Tailwind: "bg-cyan-500 text-white",
      "Three.js": "bg-black text-white",
      WebGL: "bg-purple-600 text-white",
      "D3.js": "bg-orange-600 text-white",
      SVG: "bg-green-500 text-white",
      REST: "bg-red-500 text-white",
      WebSocket: "bg-indigo-500 text-white",
      IndexedDB: "bg-yellow-600 text-white",
      WebAssembly: "bg-violet-600 text-white",
      "Framer Motion": "bg-purple-500 text-white",
    }

    const techs = tech.split("/")
    return (
      <div className="flex flex-wrap gap-1">
        {techs.map((t, i) => (
          <Badge key={i} variant="outline" className={`${techColors[t] || "bg-gray-500 text-white"} text-xs`}>
            {t}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div id="documentation">
      <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-500" />
            Documentación de Clases
          </CardTitle>
          <CardDescription>Diagramas y documentación de todas las clases del sistema Noösfera</CardDescription>
          <div className="flex justify-end mt-2">
            <Button
              onClick={generateDocumentation}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <FileText className="h-4 w-4" />
              Descargar Documentación en Word
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="class-table">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="class-table" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Tabla de Clases
              </TabsTrigger>
              <TabsTrigger value="class-diagrams" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Diagramas de Clases
              </TabsTrigger>
              <TabsTrigger value="architecture" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Arquitectura
              </TabsTrigger>
            </TabsList>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar clases por nombre, tipo, tecnología o descripción..."
                className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Categoría:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">Todas</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Tecnología:</span>
                <select
                  value={techFilter}
                  onChange={(e) => setTechFilter(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">Todas</option>
                  {technologies.map((tech, index) => (
                    <option key={index} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                  setTechFilter("all")
                }}
                className="ml-auto"
              >
                Limpiar filtros
              </Button>
            </div>

            <TabsContent value="class-table">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  <section>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">Tabla Completa de Clases</h2>
                      <div className="text-sm text-muted-foreground">{filteredClasses.length} clases encontradas</div>
                    </div>

                    {Object.keys(groupedClasses).length > 0 ? (
                      Object.entries(groupedClasses).map(([category, classes]) => (
                        <div key={category} className="mb-8">
                          <h3 className="text-lg font-semibold mb-3 px-4 py-2 bg-muted rounded-md">
                            {category} ({classes.length})
                          </h3>
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/50">
                                <TableHead className="w-[18%]">Clase</TableHead>
                                <TableHead className="w-[12%]">Tipo</TableHead>
                                <TableHead className="w-[20%]">Tecnología</TableHead>
                                <TableHead className="w-[20%]">Función</TableHead>
                                <TableHead className="w-[30%]">Descripción</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {classes.map((classItem, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{classItem.name}</TableCell>
                                  <TableCell className="text-muted-foreground">{classItem.type}</TableCell>
                                  <TableCell>{renderTechBadge(classItem.tech)}</TableCell>
                                  <TableCell>{classItem.function}</TableCell>
                                  <TableCell className="text-sm">{classItem.description}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No se encontraron clases que coincidan con los filtros seleccionados.
                      </div>
                    )}
                  </section>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="class-diagrams">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  <section>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">Diagramas de Clases</h2>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportDiagramAsPNG(diagramRef, "noosfera-diagrama-general")}
                          className="flex items-center gap-1"
                        >
                          <FileDown className="h-4 w-4" />
                          <span>Exportar Todo</span>
                        </Button>
                      </div>
                    </div>

                    <div ref={diagramRef} className="p-6 border rounded-lg bg-white dark:bg-gray-900">
                      <h3 className="text-xl font-bold mb-4 text-emerald-600">Diagrama General del Sistema</h3>

                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold">Contextos</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportDiagramAsPNG(contextDiagramRef, "noosfera-contextos")}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            <span>PNG</span>
                          </Button>
                        </div>

                        <div ref={contextDiagramRef} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border-2 border-emerald-500 rounded-lg overflow-hidden">
                              <div className="bg-emerald-100 dark:bg-emerald-900 p-2 font-bold text-emerald-800 dark:text-emerald-200 border-b-2 border-emerald-500 flex justify-between items-center">
                                <span>NoosferaContext</span>
                                <Badge className="bg-blue-700">TypeScript</Badge>
                              </div>
                              <div className="p-3 border-b border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800">
                                <p className="font-medium mb-1 text-sm">Atributos:</p>
                                <ul className="text-xs space-y-1">
                                  <li>+ connectionStatus: ConnectionStatus</li>
                                  <li>+ signalStrength: number</li>
                                  <li>+ processingThought: boolean</li>
                                  <li>+ currentThoughtPattern: ThoughtPattern | null</li>
                                  <li>+ generatedContent: GeneratedContent[]</li>
                                  <li>+ config: NoosferaConfig</li>
                                  <li>+ brainwaveActivity: number</li>
                                  <li>+ systemLoad: number</li>
                                </ul>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800">
                                <p className="font-medium mb-1 text-sm">Métodos:</p>
                                <ul className="text-xs space-y-1">
                                  <li>+ connect(): void</li>
                                  <li>+ disconnect(): void</li>
                                  <li>+ captureThought(): Promise&lt;void&gt;</li>
                                  <li>+ generateContent(): Promise&lt;void&gt;</li>
                                  <li>+ deleteContent(id: string): void</li>
                                  <li>+ updateConfig(): void</li>
                                  <li>+ resetConfig(): void</li>
                                </ul>
                              </div>
                            </div>

                            <div className="border-2 border-blue-500 rounded-lg overflow-hidden">
                              <div className="bg-blue-100 dark:bg-blue-900 p-2 font-bold text-blue-800 dark:text-blue-200 border-b-2 border-blue-500 flex justify-between items-center">
                                <span>AuthContext</span>
                                <Badge className="bg-blue-700">TypeScript</Badge>
                              </div>
                              <div className="p-3 border-b border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800">
                                <p className="font-medium mb-1 text-sm">Atributos:</p>
                                <ul className="text-xs space-y-1">
                                  <li>+ user: User | null</li>
                                  <li>+ isLoading: boolean</li>
                                  <li>+ isAuthenticated: boolean</li>
                                </ul>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800">
                                <p className="font-medium mb-1 text-sm">Métodos:</p>
                                <ul className="text-xs space-y-1">
                                  <li>+ login(): Promise&lt;boolean&gt;</li>
                                  <li>+ register(): Promise&lt;boolean&gt;</li>
                                  <li>+ logout(): void</li>
                                  <li>+ updateUser(): void</li>
                                  <li>+ completeTutorial(): void</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 p-2 border rounded bg-gray-50 dark:bg-gray-900">
                            <p className="text-xs font-medium">Relaciones:</p>
                            <ul className="text-xs mt-1">
                              <li>• NoosferaContext ← utiliza → ThoughtPattern</li>
                              <li>• NoosferaContext ← utiliza → GeneratedContent</li>
                              <li>• NoosferaContext ← utiliza → NoosferaConfig</li>
                              <li>• AuthContext ← utiliza → User</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold">Componentes Principales</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportDiagramAsPNG(componentDiagramRef, "noosfera-componentes")}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            <span>PNG</span>
                          </Button>
                        </div>

                        <div ref={componentDiagramRef} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="border-2 border-purple-500 rounded-lg overflow-hidden">
                              <div className="bg-purple-100 dark:bg-purple-900 p-2 font-bold text-purple-800 dark:text-purple-200 border-b-2 border-purple-500 flex justify-between items-center">
                                <span>Dashboard</span>
                                <Badge className="bg-blue-500">React</Badge>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800">
                                <p className="font-medium mb-1 text-sm">Responsabilidades:</p>
                                <ul className="text-xs space-y-1">
                                  <li>• Renderizar interfaz principal</li>
                                  <li>• Gestionar navegación</li>
                                  <li>• Mostrar indicadores de estado</li>
                                </ul>
                              </div>
                            </div>

                            <div className="border-2 border-purple-500 rounded-lg overflow-hidden">
                              <div className="bg-purple-100 dark:bg-purple-900 p-2 font-bold text-purple-800 dark:text-purple-200 border-b-2 border-purple-500 flex justify-between items-center">
                                <span>ThoughtVisualizer</span>
                                <div className="flex gap-1">
                                  <Badge className="bg-blue-500">React</Badge>
                                  <Badge className="bg-black">Three.js</Badge>
                                </div>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800">
                                <p className="font-medium mb-1 text-sm">Responsabilidades:</p>
                                <ul className="text-xs space-y-1">
                                  <li>• Visualizar patrones neuronales</li>
                                  <li>• Representar pensamientos</li>
                                  <li>• Controles interactivos</li>
                                </ul>
                              </div>
                            </div>

                            <div className="border-2 border-purple-500 rounded-lg overflow-hidden">
                              <div className="bg-purple-100 dark:bg-purple-900 p-2 font-bold text-purple-800 dark:text-purple-200 border-b-2 border-purple-500 flex justify-between items-center">
                                <span>ContentGenerator</span>
                                <Badge className="bg-blue-500">React</Badge>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800">
                                <p className="font-medium mb-1 text-sm">Responsabilidades:</p>
                                <ul className="text-xs space-y-1">
                                  <li>• Generar texto e imágenes</li>
                                  <li>• Ajustar parámetros</li>
                                  <li>• Previsualizar contenido</li>
                                </ul>
                              </div>
                            </div>

                            <div className="border-2 border-purple-500 rounded-lg overflow-hidden">
                              <div className="bg-purple-100 dark:bg-purple-900 p-2 font-bold text-purple-800 dark:text-purple-200 border-b-2 border-purple-500 flex justify-between items-center">
                                <span>ContentLibrary</span>
                                <Badge className="bg-blue-500">React</Badge>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800">
                                <p className="font-medium mb-1 text-sm">Responsabilidades:</p>
                                <ul className="text-xs space-y-1">
                                  <li>• Almacenar contenido</li>
                                  <li>• Filtrar por tipo</li>
                                  <li>• Gestionar contenido</li>
                                </ul>
                              </div>
                            </div>

                            <div className="border-2 border-purple-500 rounded-lg overflow-hidden">
                              <div className="bg-purple-100 dark:bg-purple-900 p-2 font-bold text-purple-800 dark:text-purple-200 border-b-2 border-purple-500 flex justify-between items-center">
                                <span>SettingsPanel</span>
                                <Badge className="bg-blue-500">React</Badge>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800">
                                <p className="font-medium mb-1 text-sm">Responsabilidades:</p>
                                <ul className="text-xs space-y-1">
                                  <li>• Configurar parámetros</li>
                                  <li>• Ajustar sensibilidad</li>
                                  <li>• Gestionar preferencias</li>
                                </ul>
                              </div>
                            </div>

                            <div className="border-2 border-purple-500 rounded-lg overflow-hidden">
                              <div className="bg-purple-100 dark:bg-purple-900 p-2 font-bold text-purple-800 dark:text-purple-200 border-b-2 border-purple-500 flex justify-between items-center">
                                <span>BciSimulator</span>
                                <div className="flex gap-1">
                                  <Badge className="bg-blue-500">React</Badge>
                                  <Badge className="bg-black">Three.js</Badge>
                                </div>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800">
                                <p className="font-medium mb-1 text-sm">Responsabilidades:</p>
                                <ul className="text-xs space-y-1">
                                  <li>• Simular actividad neuronal</li>
                                  <li>• Visualizar conexiones</li>
                                  <li>• Responder a configuración</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 p-2 border rounded bg-gray-50 dark:bg-gray-900">
                            <p className="text-xs font-medium">Relaciones:</p>
                            <ul className="text-xs mt-1">
                              <li>
                                • Dashboard ← contiene → ThoughtVisualizer, ContentGenerator, ContentLibrary,
                                SettingsPanel
                              </li>
                              <li>• ContentGenerator ← utiliza → NoosferaContext</li>
                              <li>• ContentLibrary ← utiliza → NoosferaContext</li>
                              <li>• SettingsPanel ← utiliza → NoosferaContext</li>
                              <li>• BciSimulator ← utiliza → NoosferaContext</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold">Widgets y Componentes Auxiliares</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportDiagramAsPNG(widgetDiagramRef, "noosfera-widgets")}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            <span>PNG</span>
                          </Button>
                        </div>

                        <div ref={widgetDiagramRef} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="border border-amber-500 rounded-lg overflow-hidden">
                              <div className="bg-amber-50 dark:bg-amber-900/30 p-2 font-medium text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800 flex justify-between items-center">
                                <span>BrainwaveChart</span>
                                <Badge className="bg-orange-600">D3.js</Badge>
                              </div>
                              <div className="p-2 text-xs bg-white dark:bg-gray-800">Visualiza ondas cerebrales</div>
                            </div>

                            <div className="border border-amber-500 rounded-lg overflow-hidden">
                              <div className="bg-amber-50 dark:bg-amber-900/30 p-2 font-medium text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800 flex justify-between items-center">
                                <span>PatternVisualizer</span>
                                <Badge className="bg-orange-600">D3.js</Badge>
                              </div>
                              <div className="p-2 text-xs bg-white dark:bg-gray-800">Muestra patrones neuronales</div>
                            </div>

                            <div className="border border-amber-500 rounded-lg overflow-hidden">
                              <div className="bg-amber-50 dark:bg-amber-900/30 p-2 font-medium text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800 flex justify-between items-center">
                                <span>ConnectionStatus</span>
                                <Badge className="bg-blue-500">React</Badge>
                              </div>
                              <div className="p-2 text-xs bg-white dark:bg-gray-800">Muestra estado de conexión</div>
                            </div>

                            <div className="border border-amber-500 rounded-lg overflow-hidden">
                              <div className="bg-amber-50 dark:bg-amber-900/30 p-2 font-medium text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800 flex justify-between items-center">
                                <span>SystemMetrics</span>
                                <Badge className="bg-orange-600">D3.js</Badge>
                              </div>
                              <div className="p-2 text-xs bg-white dark:bg-gray-800">Muestra métricas del sistema</div>
                            </div>

                            <div className="border border-amber-500 rounded-lg overflow-hidden">
                              <div className="bg-amber-50 dark:bg-amber-900/30 p-2 font-medium text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800 flex justify-between items-center">
                                <span>ActivityTimeline</span>
                                <Badge className="bg-blue-500">React</Badge>
                              </div>
                              <div className="p-2 text-xs bg-white dark:bg-gray-800">
                                Muestra historial de actividades
                              </div>
                            </div>

                            <div className="border border-amber-500 rounded-lg overflow-hidden">
                              <div className="bg-amber-50 dark:bg-amber-900/30 p-2 font-medium text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800 flex justify-between items-center">
                                <span>StatusRing</span>
                                <Badge className="bg-green-500">SVG</Badge>
                              </div>
                              <div className="p-2 text-xs bg-white dark:bg-gray-800">Visualiza fuerza de señal</div>
                            </div>

                            <div className="border border-amber-500 rounded-lg overflow-hidden">
                              <div className="bg-amber-50 dark:bg-amber-900/30 p-2 font-medium text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800 flex justify-between items-center">
                                <span>NeuralParticles</span>
                                <Badge className="bg-purple-600">WebGL</Badge>
                              </div>
                              <div className="p-2 text-xs bg-white dark:bg-gray-800">Simula actividad neuronal</div>
                            </div>

                            <div className="border border-amber-500 rounded-lg overflow-hidden">
                              <div className="bg-amber-50 dark:bg-amber-900/30 p-2 font-medium text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800 flex justify-between items-center">
                                <span>BrainModel</span>
                                <Badge className="bg-black">Three.js</Badge>
                              </div>
                              <div className="p-2 text-xs bg-white dark:bg-gray-800">Modelo 3D del cerebro</div>
                            </div>

                            <div className="border border-amber-500 rounded-lg overflow-hidden">
                              <div className="bg-amber-50 dark:bg-amber-900/30 p-2 font-medium text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800 flex justify-between items-center">
                                <span>SpectralAnalysis</span>
                                <Badge className="bg-purple-600">WebGL</Badge>
                              </div>
                              <div className="p-2 text-xs bg-white dark:bg-gray-800">
                                Análisis de frecuencias cerebrales
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="architecture">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  <section>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">Arquitectura del Sistema</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportDiagramAsPNG(architectureDiagramRef, "noosfera-arquitectura")}
                        className="flex items-center gap-1"
                      >
                        <FileDown className="h-4 w-4" />
                        <span>Exportar PNG</span>
                      </Button>
                    </div>

                    <div ref={architectureDiagramRef} className="p-6 border rounded-lg bg-white dark:bg-gray-900">
                      <h3 className="text-xl font-bold mb-4 text-emerald-600">Arquitectura General</h3>

                      <div className="mb-8">
                        <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg p-6">
                          <div className="grid grid-cols-1 gap-6">
                            <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/30 text-center">
                              <h4 className="font-bold mb-2">Capa de Presentación</h4>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="border border-blue-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-blue-500">React</Badge>
                                  <p>Componentes UI</p>
                                </div>
                                <div className="border border-blue-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-cyan-500">Tailwind</Badge>
                                  <p>Estilos</p>
                                </div>
                                <div className="border border-blue-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-purple-500">Framer Motion</Badge>
                                  <p>Animaciones</p>
                                </div>
                              </div>
                            </div>

                            <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50 dark:bg-green-900/30 text-center">
                              <h4 className="font-bold mb-2">Capa de Lógica de Negocio</h4>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="border border-green-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-blue-700">TypeScript</Badge>
                                  <p>Contextos</p>
                                </div>
                                <div className="border border-green-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-violet-600">WebAssembly</Badge>
                                  <p>Procesamiento</p>
                                </div>
                                <div className="border border-green-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-blue-700">TypeScript</Badge>
                                  <p>Servicios</p>
                                </div>
                              </div>
                            </div>

                            <div className="border-2 border-purple-500 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/30 text-center">
                              <h4 className="font-bold mb-2">Capa de Visualización</h4>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="border border-purple-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-black">Three.js</Badge>
                                  <p>Modelos 3D</p>
                                </div>
                                <div className="border border-purple-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-orange-600">D3.js</Badge>
                                  <p>Gráficos</p>
                                </div>
                                <div className="border border-purple-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-purple-600">WebGL</Badge>
                                  <p>Partículas</p>
                                </div>
                              </div>
                            </div>

                            <div className="border-2 border-red-500 rounded-lg p-4 bg-red-50 dark:bg-red-900/30 text-center">
                              <h4 className="font-bold mb-2">Capa de Datos</h4>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="border border-red-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-red-500">REST</Badge>
                                  <p>API</p>
                                </div>
                                <div className="border border-red-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-indigo-500">WebSocket</Badge>
                                  <p>Tiempo Real</p>
                                </div>
                                <div className="border border-red-400 rounded p-2 bg-white dark:bg-gray-800 text-xs">
                                  <Badge className="mb-1 bg-yellow-600">IndexedDB</Badge>
                                  <p>Almacenamiento</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-4 text-emerald-600">Flujo de Datos</h3>
                      <div
                        ref={dataFlowDiagramRef}
                        className="border-2 border-gray-300 dark:border-gray-700 rounded-lg p-6"
                      >
                        <div className="flex flex-col items-center">
                          <div className="border-2 border-gray-500 rounded-lg p-3 bg-gray-100 dark:bg-gray-800 text-center mb-4 w-64">
                            <p className="font-bold">Dispositivo BCI</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Captura de señales neuronales</p>
                          </div>

                          <div className="h-8 w-0.5 bg-gray-400"></div>
                          <div className="rounded-full bg-gray-400 p-1 mb-4">
                            <Zap className="h-4 w-4 text-white" />
                          </div>

                          <div className="border-2 border-indigo-500 rounded-lg p-3 bg-indigo-50 dark:bg-indigo-900/30 text-center mb-4 w-64">
                            <p className="font-bold">WebSocket / API</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Transmisión de datos en tiempo real
                            </p>
                          </div>

                          <div className="h-8 w-0.5 bg-gray-400"></div>
                          <div className="rounded-full bg-gray-400 p-1 mb-4">
                            <Cpu className="h-4 w-4 text-white" />
                          </div>

                          <div className="border-2 border-violet-500 rounded-lg p-3 bg-violet-50 dark:bg-violet-900/30 text-center mb-4 w-64">
                            <p className="font-bold">Procesamiento de Señales</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">WebAssembly / TypeScript</p>
                          </div>

                          <div className="h-8 w-0.5 bg-gray-400"></div>
                          <div className="rounded-full bg-gray-400 p-1 mb-4">
                            <Brain className="h-4 w-4 text-white" />
                          </div>

                          <div className="border-2 border-green-500 rounded-lg p-3 bg-green-50 dark:bg-green-900/30 text-center mb-4 w-64">
                            <p className="font-bold">Contextos React</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">NoosferaContext / AuthContext</p>
                          </div>

                          <div className="h-8 w-0.5 bg-gray-400"></div>
                          <div className="rounded-full bg-gray-400 p-1 mb-4">
                            <Layout className="h-4 w-4 text-white" />
                          </div>

                          <div className="border-2 border-blue-500 rounded-lg p-3 bg-blue-50 dark:bg-blue-900/30 text-center mb-4 w-64">
                            <p className="font-bold">Componentes UI</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">React / Tailwind / Framer Motion</p>
                          </div>

                          <div className="h-8 w-0.5 bg-gray-400"></div>
                          <div className="rounded-full bg-gray-400 p-1 mb-4">
                            <FileCode className="h-4 w-4 text-white" />
                          </div>

                          <div className="border-2 border-amber-500 rounded-lg p-3 bg-amber-50 dark:bg-amber-900/30 text-center w-64">
                            <p className="font-bold">Visualización</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Three.js / D3.js / WebGL</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
