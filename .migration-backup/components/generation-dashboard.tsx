"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useNoosfera } from "@/contexts/noosfera-context"
import { toast } from "react-hot-toast"
import {
  Wand2,
  FileText,
  ImageIcon,
  Code,
  Music,
  Brain,
  Zap,
  Download,
  Copy,
  Loader2,
  Trash2,
  Settings,
  RotateCcw,
  X,
  Maximize2,
  Minimize2,
  LayoutGrid,
  List,
  SlidersHorizontal,
  History,
  Clock,
  Star,
  LayoutDashboardIcon,
} from "lucide-react"

// Componente para generación avanzada de contenido
export default function GenerationDashboard() {
  const {
    connectionStatus,
    brainwaveActivity,
    patternAnalysis,
    currentThoughtPattern,
    generateContent,
    generatedContent,
    processingThought,
  } = useNoosfera()

  const [activeTab, setActiveTab] = useState("text")
  const [generationMode, setGenerationMode] = useState("standard")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationSettings, setGenerationSettings] = useState({
    creativity: 70,
    coherence: 60,
    detail: 50,
    length: 50,
    style: "neutral",
    tone: "informative",
    format: "paragraph",
  })
  const [imageSettings, setImageSettings] = useState({
    style: "realistic",
    complexity: 70,
    colorScheme: "vibrant",
    composition: "balanced",
    subject: "abstract",
    resolution: "medium",
  })
  const [codeSettings, setCodeSettings] = useState({
    language: "javascript",
    complexity: 50,
    comments: true,
    optimization: 60,
    paradigm: "functional",
  })
  const [musicSettings, setMusicSettings] = useState({
    genre: "ambient",
    tempo: 80,
    complexity: 50,
    duration: 30,
    mood: "calm",
  })
  const [customPrompt, setCustomPrompt] = useState("")
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [generatedItems, setGeneratedItems] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">("newest")
  const [filterBy, setFilterBy] = useState<"all" | "text" | "image" | "code" | "music" | "video">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [history, setHistory] = useState<
    {
      id: string
      type: string
      timestamp: number
      settings: any
      prompt?: string
    }[]
  >([])
  const [showHistory, setShowHistory] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  const generationContainerRef = useRef<HTMLDivElement>(null)

  // Estilos disponibles para generación de texto
  const textStyles = [
    { id: "neutral", name: "Neutral", description: "Estilo equilibrado y objetivo" },
    { id: "creative", name: "Creativo", description: "Estilo imaginativo y original" },
    { id: "academic", name: "Académico", description: "Estilo formal y riguroso" },
    { id: "poetic", name: "Poético", description: "Estilo lírico y expresivo" },
    { id: "technical", name: "Técnico", description: "Estilo preciso y especializado" },
    { id: "narrative", name: "Narrativo", description: "Estilo de relato o historia" },
    { id: "persuasive", name: "Persuasivo", description: "Estilo convincente y argumentativo" },
    { id: "humorous", name: "Humorístico", description: "Estilo divertido y ligero" },
  ]

  // Tonos disponibles para generación de texto
  const textTones = [
    { id: "informative", name: "Informativo", description: "Tono objetivo y educativo" },
    { id: "formal", name: "Formal", description: "Tono serio y profesional" },
    { id: "casual", name: "Casual", description: "Tono relajado y conversacional" },
    { id: "enthusiastic", name: "Entusiasta", description: "Tono energético y positivo" },
    { id: "serious", name: "Serio", description: "Tono grave y solemne" },
    { id: "optimistic", name: "Optimista", description: "Tono positivo y esperanzador" },
    { id: "critical", name: "Crítico", description: "Tono analítico y evaluativo" },
    { id: "empathetic", name: "Empático", description: "Tono comprensivo y solidario" },
  ]

  // Formatos disponibles para generación de texto
  const textFormats = [
    { id: "paragraph", name: "Párrafo", description: "Texto continuo en párrafos" },
    { id: "bullet", name: "Viñetas", description: "Lista con viñetas" },
    { id: "numbered", name: "Numerado", description: "Lista numerada" },
    { id: "outline", name: "Esquema", description: "Estructura jerárquica" },
    { id: "dialogue", name: "Diálogo", description: "Conversación entre personajes" },
    { id: "poem", name: "Poema", description: "Estructura poética" },
    { id: "code", name: "Código", description: "Formato de código" },
    { id: "markdown", name: "Markdown", description: "Formato de marcado ligero" },
  ]

  // Estilos disponibles para generación de imágenes
  const imageStyles = [
    { id: "realistic", name: "Realista", description: "Estilo fotorrealista" },
    { id: "abstract", name: "Abstracto", description: "Formas y colores no representativos" },
    { id: "digital", name: "Digital", description: "Arte digital moderno" },
    { id: "painterly", name: "Pictórico", description: "Estilo de pintura tradicional" },
    { id: "sketch", name: "Boceto", description: "Dibujo a mano alzada" },
    { id: "3d", name: "3D", description: "Renderizado tridimensional" },
    { id: "pixel", name: "Pixel Art", description: "Estilo de píxeles retro" },
    { id: "surreal", name: "Surrealista", description: "Imágenes oníricas y fantásticas" },
  ]

  // Esquemas de color disponibles para generación de imágenes
  const colorSchemes = [
    { id: "vibrant", name: "Vibrante", description: "Colores intensos y saturados" },
    { id: "muted", name: "Apagado", description: "Colores suaves y desaturados" },
    { id: "monochrome", name: "Monocromático", description: "Variaciones de un solo color" },
    { id: "complementary", name: "Complementario", description: "Colores opuestos en el círculo cromático" },
    { id: "analogous", name: "Análogo", description: "Colores adyacentes en el círculo cromático" },
    { id: "triadic", name: "Triádico", description: "Tres colores equidistantes en el círculo cromático" },
    { id: "warm", name: "Cálido", description: "Predominio de rojos, naranjas y amarillos" },
    { id: "cool", name: "Frío", description: "Predominio de azules, verdes y violetas" },
  ]

  // Lenguajes disponibles para generación de código
  const codeLanguages = [
    { id: "javascript", name: "JavaScript", description: "Lenguaje de programación web" },
    { id: "python", name: "Python", description: "Lenguaje de propósito general" },
    { id: "java", name: "Java", description: "Lenguaje orientado a objetos" },
    { id: "csharp", name: "C#", description: "Lenguaje de Microsoft .NET" },
    { id: "cpp", name: "C++", description: "Lenguaje de sistemas y rendimiento" },
    { id: "ruby", name: "Ruby", description: "Lenguaje dinámico y expresivo" },
    { id: "go", name: "Go", description: "Lenguaje eficiente y concurrente" },
    { id: "rust", name: "Rust", description: "Lenguaje seguro y de alto rendimiento" },
  ]

  // Géneros musicales disponibles para generación de música
  const musicGenres = [
    { id: "ambient", name: "Ambient", description: "Música atmosférica y envolvente" },
    { id: "electronic", name: "Electrónica", description: "Música basada en sonidos sintéticos" },
    { id: "classical", name: "Clásica", description: "Música de tradición occidental" },
    { id: "jazz", name: "Jazz", description: "Música improvisada y sincopada" },
    { id: "rock", name: "Rock", description: "Música basada en guitarras eléctricas" },
    { id: "pop", name: "Pop", description: "Música popular contemporánea" },
    { id: "hiphop", name: "Hip Hop", description: "Música rítmica con elementos vocales rapeados" },
    { id: "folk", name: "Folk", description: "Música tradicional y acústica" },
  ]

  // Generar contenido basado en el tipo seleccionado
  const handleGenerate = async () => {
    if (connectionStatus !== "connected" || !currentThoughtPattern) {
      toast.error("Necesitas un patrón de pensamiento capturado para generar contenido")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    // Simular progreso
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + Math.random() * 10
      })
    }, 300)

    try {
      // Preparar configuración basada en el tipo de contenido
      let settings = {}
      let prompt = customPrompt

      switch (activeTab) {
        case "text":
          settings = generationSettings
          if (!prompt) prompt = "Generar texto basado en el patrón neuronal actual"
          break
        case "image":
          settings = imageSettings
          if (!prompt) prompt = "Generar imagen basada en el patrón neuronal actual"
          break
        case "code":
          settings = codeSettings
          if (!prompt) prompt = `Generar código en ${codeSettings.language} basado en el patrón neuronal actual`
          break
        case "music":
          settings = musicSettings
          if (!prompt) prompt = `Generar música ${musicSettings.genre} basada en el patrón neuronal actual`
          break
        default:
          settings = generationSettings
      }

      // Registrar en el historial
      const historyEntry = {
        id: `history-${Date.now()}`,
        type: activeTab,
        timestamp: Date.now(),
        settings,
        prompt,
      }

      setHistory((prev) => [historyEntry, ...prev])

      // Generar contenido
      const result = await generateContent(activeTab, settings, prompt)

      // Añadir a la lista de elementos generados
      const newItem = {
        id: `generated-${Date.now()}`,
        type: activeTab,
        content: result,
        timestamp: Date.now(),
        settings,
        prompt,
        rating: 0,
      }

      setGeneratedItems((prev) => [newItem, ...prev])
      setSelectedItem(newItem.id)

      // Completar progreso
      setGenerationProgress(100)
      toast.success(
        `${activeTab === "text" ? "Texto" : activeTab === "image" ? "Imagen" : activeTab === "code" ? "Código" : "Música"} generado correctamente`,
      )
    } catch (error) {
      toast.error(
        `Error al generar ${activeTab === "text" ? "texto" : activeTab === "image" ? "imagen" : activeTab === "code" ? "código" : "música"}`,
      )
    } finally {
      clearInterval(progressInterval)
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationProgress(0)
      }, 500)
    }
  }

  // Alternar favorito
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites((prev) => prev.filter((itemId) => itemId !== id))
      toast.success("Eliminado de favoritos")
    } else {
      setFavorites((prev) => [...prev, id])
      toast.success("Añadido a favoritos")
    }
  }

  // Eliminar elemento generado
  const deleteItem = (id: string) => {
    setGeneratedItems((prev) => prev.filter((item) => item.id !== id))
    if (selectedItem === id) {
      setSelectedItem(null)
    }
    // También eliminar de favoritos si existe
    if (favorites.includes(id)) {
      setFavorites((prev) => prev.filter((itemId) => itemId !== id))
    }
    toast.success("Elemento eliminado")
  }

  // Calificar elemento
  const rateItem = (id: string, rating: number) => {
    setGeneratedItems((prev) => prev.map((item) => (item.id === id ? { ...item, rating } : item)))
    toast.success(`Calificación actualizada: ${rating}/5`)
  }

  // Copiar al portapapeles
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Copiado al portapapeles")
  }

  // Descargar elemento
  const downloadItem = (item: any) => {
    if (item.type === "text" || item.type === "code") {
      // Descargar como archivo de texto
      const element = document.createElement("a")
      const file = new Blob([item.content], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `${item.type === "text" ? "texto" : "codigo"}-${new Date().toISOString().slice(0, 10)}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } else if (item.type === "image") {
      // Descargar imagen (simulado)
      const link = document.createElement("a")
      link.href = item.content
      link.download = `imagen-${new Date().toISOString().slice(0, 10)}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (item.type === "music") {
      // Descargar música (simulado)
      toast.success("Descarga de música iniciada")
    }

    toast.success("Descarga iniciada")
  }

  // Alternar modo de pantalla completa
  const toggleFullscreen = () => {
    if (generationContainerRef.current) {
      if (!isFullscreen) {
        if (generationContainerRef.current.requestFullscreen) {
          generationContainerRef.current.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }

      setIsFullscreen(!isFullscreen)
    }
  }

  // Actualizar configuración de generación de texto
  const updateTextSetting = (setting: keyof typeof generationSettings, value: any) => {
    setGenerationSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  // Actualizar configuración de generación de imágenes
  const updateImageSetting = (setting: keyof typeof imageSettings, value: any) => {
    setImageSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  // Actualizar configuración de generación de código
  const updateCodeSetting = (setting: keyof typeof codeSettings, value: any) => {
    setCodeSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  // Actualizar configuración de generación de música
  const updateMusicSetting = (setting: keyof typeof musicSettings, value: any) => {
    setMusicSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  // Restablecer configuración a valores predeterminados
  const resetSettings = () => {
    switch (activeTab) {
      case "text":
        setGenerationSettings({
          creativity: 70,
          coherence: 60,
          detail: 50,
          length: 50,
          style: "neutral",
          tone: "informative",
          format: "paragraph",
        })
        break
      case "image":
        setImageSettings({
          style: "realistic",
          complexity: 70,
          colorScheme: "vibrant",
          composition: "balanced",
          subject: "abstract",
          resolution: "medium",
        })
        break
      case "code":
        setCodeSettings({
          language: "javascript",
          complexity: 50,
          comments: true,
          optimization: 60,
          paradigm: "functional",
        })
        break
      case "music":
        setMusicSettings({
          genre: "ambient",
          tempo: 80,
          complexity: 50,
          duration: 30,
          mood: "calm",
        })
        break
    }

    toast.success("Configuración restablecida")
  }

  // Aplicar configuración desde el historial
  const applyFromHistory = (historyItem: any) => {
    setActiveTab(historyItem.type)

    switch (historyItem.type) {
      case "text":
        setGenerationSettings(historyItem.settings)
        break
      case "image":
        setImageSettings(historyItem.settings)
        break
      case "code":
        setCodeSettings(historyItem.settings)
        break
      case "music":
        setMusicSettings(historyItem.settings)
        break
    }

    if (historyItem.prompt) {
      setCustomPrompt(historyItem.prompt)
    }

    setShowHistory(false)
    toast.success("Configuración aplicada desde el historial")
  }

  // Filtrar elementos generados
  const filteredItems = generatedItems.filter((item) => {
    // Filtrar por tipo
    if (filterBy !== "all" && item.type !== filterBy) {
      return false
    }

    // Filtrar por búsqueda
    if (searchQuery && !item.prompt?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  // Ordenar elementos generados
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.timestamp - a.timestamp
      case "oldest":
        return a.timestamp - b.timestamp
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  // Verificar si el dispositivo está conectado
  if (connectionStatus !== "connected") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-6 w-6 text-emerald-500" />
              Generación Avanzada
            </CardTitle>
            <CardDescription>Generación de contenido basada en patrones neuronales</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Dispositivo BCI no conectado</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Conecta tu dispositivo BCI para acceder a la generación avanzada de contenido basada en tus patrones
              neuronales.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Zap className="mr-2 h-4 w-4" />
              Conectar Dispositivo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" ref={generationContainerRef}>
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-6 w-6 text-emerald-500" />
                  Generación Avanzada
                </CardTitle>
                <CardDescription>Generación de contenido basada en patrones neuronales</CardDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={toggleFullscreen} className="flex items-center gap-1">
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Salir</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Pantalla completa</span>
                    </>
                  )}
                </Button>

                <Button
                  variant={showSidebar ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="flex items-center gap-1"
                >
                  {showSidebar ? (
                    <>
                      <LayoutDashboardIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Ocultar panel</span>
                    </>
                  ) : (
                    <>
                      <LayoutDashboardIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Mostrar panel</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-1"
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">Historial</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Panel de configuración */}
              {showSidebar && (
                <div className="lg:col-span-1">
                  <Card className="border-none shadow-md bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5 text-emerald-500" />
                        Configuración
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Tipo de contenido */}
                      <div className="space-y-2">
                        <Label>Tipo de contenido</Label>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                          <TabsList className="grid grid-cols-4">
                            <TabsTrigger value="text" className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              <span className="hidden sm:inline">Texto</span>
                            </TabsTrigger>
                            <TabsTrigger value="image" className="flex items-center gap-1">
                              <ImageIcon className="h-4 w-4" />
                              <span className="hidden sm:inline">Imagen</span>
                            </TabsTrigger>
                            <TabsTrigger value="code" className="flex items-center gap-1">
                              <Code className="h-4 w-4" />
                              <span className="hidden sm:inline">Código</span>
                            </TabsTrigger>
                            <TabsTrigger value="music" className="flex items-center gap-1">
                              <Music className="h-4 w-4" />
                              <span className="hidden sm:inline">Música</span>
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>

                      {/* Modo de generación */}
                      <div className="space-y-2">
                        <Label>Modo de generación</Label>
                        <Select value={generationMode} onValueChange={setGenerationMode}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar modo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Estándar</SelectItem>
                            <SelectItem value="advanced">Avanzado</SelectItem>
                            <SelectItem value="experimental">Experimental</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Prompt personalizado */}
                      <div className="space-y-2">
                        <Label>Prompt personalizado (opcional)</Label>
                        <Textarea
                          placeholder="Describe lo que quieres generar..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          rows={3}
                        />
                      </div>

                      {/* Configuración específica por tipo de contenido */}
                      <TabsContent value="text" className="space-y-4 mt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Creatividad</Label>
                            <span className="text-sm">{generationSettings.creativity}%</span>
                          </div>
                          <Slider
                            value={[generationSettings.creativity]}
                            onValueChange={(value) => updateTextSetting("creativity", value[0])}
                            max={100}
                            step={5}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Coherencia</Label>
                            <span className="text-sm">{generationSettings.coherence}%</span>
                          </div>
                          <Slider
                            value={[generationSettings.coherence]}
                            onValueChange={(value) => updateTextSetting("coherence", value[0])}
                            max={100}
                            step={5}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Nivel de detalle</Label>
                            <span className="text-sm">{generationSettings.detail}%</span>
                          </div>
                          <Slider
                            value={[generationSettings.detail]}
                            onValueChange={(value) => updateTextSetting("detail", value[0])}
                            max={100}
                            step={5}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Longitud</Label>
                            <span className="text-sm">{generationSettings.length}%</span>
                          </div>
                          <Slider
                            value={[generationSettings.length]}
                            onValueChange={(value) => updateTextSetting("length", value[0])}
                            max={100}
                            step={5}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Estilo</Label>
                          <Select
                            value={generationSettings.style}
                            onValueChange={(value) => updateTextSetting("style", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estilo" />
                            </SelectTrigger>
                            <SelectContent>
                              {textStyles.map((style) => (
                                <SelectItem key={style.id} value={style.id}>
                                  <div className="flex flex-col">
                                    <span>{style.name}</span>
                                    <span className="text-xs text-muted-foreground">{style.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Tono</Label>
                          <Select
                            value={generationSettings.tone}
                            onValueChange={(value) => updateTextSetting("tone", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tono" />
                            </SelectTrigger>
                            <SelectContent>
                              {textTones.map((tone) => (
                                <SelectItem key={tone.id} value={tone.id}>
                                  <div className="flex flex-col">
                                    <span>{tone.name}</span>
                                    <span className="text-xs text-muted-foreground">{tone.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Formato</Label>
                          <Select
                            value={generationSettings.format}
                            onValueChange={(value) => updateTextSetting("format", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar formato" />
                            </SelectTrigger>
                            <SelectContent>
                              {textFormats.map((format) => (
                                <SelectItem key={format.id} value={format.id}>
                                  <div className="flex flex-col">
                                    <span>{format.name}</span>
                                    <span className="text-xs text-muted-foreground">{format.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>

                      <TabsContent value="image" className="space-y-4 mt-0">
                        <div className="space-y-2">
                          <Label>Estilo</Label>
                          <Select
                            value={imageSettings.style}
                            onValueChange={(value) => updateImageSetting("style", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estilo" />
                            </SelectTrigger>
                            <SelectContent>
                              {imageStyles.map((style) => (
                                <SelectItem key={style.id} value={style.id}>
                                  <div className="flex flex-col">
                                    <span>{style.name}</span>
                                    <span className="text-xs text-muted-foreground">{style.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Complejidad</Label>
                            <span className="text-sm">{imageSettings.complexity}%</span>
                          </div>
                          <Slider
                            value={[imageSettings.complexity]}
                            onValueChange={(value) => updateImageSetting("complexity", value[0])}
                            max={100}
                            step={5}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Esquema de color</Label>
                          <Select
                            value={imageSettings.colorScheme}
                            onValueChange={(value) => updateImageSetting("colorScheme", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar esquema" />
                            </SelectTrigger>
                            <SelectContent>
                              {colorSchemes.map((scheme) => (
                                <SelectItem key={scheme.id} value={scheme.id}>
                                  <div className="flex flex-col">
                                    <span>{scheme.name}</span>
                                    <span className="text-xs text-muted-foreground">{scheme.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Composición</Label>
                          <Select
                            value={imageSettings.composition}
                            onValueChange={(value) => updateImageSetting("composition", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar composición" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="balanced">Equilibrada</SelectItem>
                              <SelectItem value="dynamic">Dinámica</SelectItem>
                              <SelectItem value="minimalist">Minimalista</SelectItem>
                              <SelectItem value="complex">Compleja</SelectItem>
                              <SelectItem value="symmetrical">Simétrica</SelectItem>
                              <SelectItem value="asymmetrical">Asimétrica</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Tema</Label>
                          <Select
                            value={imageSettings.subject}
                            onValueChange={(value) => updateImageSetting("subject", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tema" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="abstract">Abstracto</SelectItem>
                              <SelectItem value="landscape">Paisaje</SelectItem>
                              <SelectItem value="portrait">Retrato</SelectItem>
                              <SelectItem value="stilllife">Naturaleza muerta</SelectItem>
                              <SelectItem value="conceptual">Conceptual</SelectItem>
                              <SelectItem value="surreal">Surrealista</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Resolución</Label>
                          <Select
                            value={imageSettings.resolution}
                            onValueChange={(value) => updateImageSetting("resolution", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar resolución" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Baja (512x512)</SelectItem>
                              <SelectItem value="medium">Media (1024x1024)</SelectItem>
                              <SelectItem value="high">Alta (2048x2048)</SelectItem>
                              <SelectItem value="ultra">Ultra (4096x4096)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>

                      <TabsContent value="code" className="space-y-4 mt-0">
                        <div className="space-y-2">
                          <Label>Lenguaje</Label>
                          <Select
                            value={codeSettings.language}
                            onValueChange={(value) => updateCodeSetting("language", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar lenguaje" />
                            </SelectTrigger>
                            <SelectContent>
                              {codeLanguages.map((language) => (
                                <SelectItem key={language.id} value={language.id}>
                                  <div className="flex flex-col">
                                    <span>{language.name}</span>
                                    <span className="text-xs text-muted-foreground">{language.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Complejidad</Label>
                            <span className="text-sm">{codeSettings.complexity}%</span>
                          </div>
                          <Slider
                            value={[codeSettings.complexity]}
                            onValueChange={(value) => updateCodeSetting("complexity", value[0])}
                            max={100}
                            step={5}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Optimización</Label>
                            <span className="text-sm">{codeSettings.optimization}%</span>
                          </div>
                          <Slider
                            value={[codeSettings.optimization]}
                            onValueChange={(value) => updateCodeSetting("optimization", value[0])}
                            max={100}
                            step={5}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="comments" className="cursor-pointer">
                            Incluir comentarios
                          </Label>
                          <Switch
                            id="comments"
                            checked={codeSettings.comments}
                            onCheckedChange={(value) => updateCodeSetting("comments", value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Paradigma</Label>
                          <Select
                            value={codeSettings.paradigm}
                            onValueChange={(value) => updateCodeSetting("paradigm", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar paradigma" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="functional">Funcional</SelectItem>
                              <SelectItem value="oop">Orientado a objetos</SelectItem>
                              <SelectItem value="procedural">Procedural</SelectItem>
                              <SelectItem value="reactive">Reactivo</SelectItem>
                              <SelectItem value="declarative">Declarativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>

                      <TabsContent value="music" className="space-y-4 mt-0">
                        <div className="space-y-2">
                          <Label>Género</Label>
                          <Select
                            value={musicSettings.genre}
                            onValueChange={(value) => updateMusicSetting("genre", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar género" />
                            </SelectTrigger>
                            <SelectContent>
                              {musicGenres.map((genre) => (
                                <SelectItem key={genre.id} value={genre.id}>
                                  <div className="flex flex-col">
                                    <span>{genre.name}</span>
                                    <span className="text-xs text-muted-foreground">{genre.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Tempo (BPM)</Label>
                            <span className="text-sm">{musicSettings.tempo}</span>
                          </div>
                          <Slider
                            value={[musicSettings.tempo]}
                            onValueChange={(value) => updateMusicSetting("tempo", value[0])}
                            min={40}
                            max={200}
                            step={1}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Complejidad</Label>
                            <span className="text-sm">{musicSettings.complexity}%</span>
                          </div>
                          <Slider
                            value={[musicSettings.complexity]}
                            onValueChange={(value) => updateMusicSetting("complexity", value[0])}
                            max={100}
                            step={5}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Duración (segundos)</Label>
                            <span className="text-sm">{musicSettings.duration}s</span>
                          </div>
                          <Slider
                            value={[musicSettings.duration]}
                            onValueChange={(value) => updateMusicSetting("duration", value[0])}
                            min={10}
                            max={120}
                            step={5}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Estado de ánimo</Label>
                          <Select
                            value={musicSettings.mood}
                            onValueChange={(value) => updateMusicSetting("mood", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="calm">Tranquilo</SelectItem>
                              <SelectItem value="energetic">Energético</SelectItem>
                              <SelectItem value="melancholic">Melancólico</SelectItem>
                              <SelectItem value="happy">Alegre</SelectItem>
                              <SelectItem value="mysterious">Misterioso</SelectItem>
                              <SelectItem value="tense">Tenso</SelectItem>
                              <SelectItem value="relaxed">Relajado</SelectItem>
                              <SelectItem value="epic">Épico</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>

                      <div className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" onClick={resetSettings} className="flex items-center gap-1">
                          <RotateCcw className="h-4 w-4" />
                          <span>Restablecer</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                          className="flex items-center gap-1"
                        >
                          <SlidersHorizontal className="h-4 w-4" />
                          <span>Avanzado</span>
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !currentThoughtPattern}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generar{" "}
                            {activeTab === "text"
                              ? "Texto"
                              : activeTab === "image"
                                ? "Imagen"
                                : activeTab === "code"
                                  ? "Código"
                                  : "Música"}
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {/* Panel principal de generación */}
              <div className={`${showSidebar ? "lg:col-span-3" : "lg:col-span-4"}`}>
                {/* Barra de progreso de generación */}
                {isGenerating && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        Generando{" "}
                        {activeTab === "text"
                          ? "texto"
                          : activeTab === "image"
                            ? "imagen"
                            : activeTab === "code"
                              ? "código"
                              : "música"}
                        ...
                      </span>
                      <span>{generationProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                )}

                {/* Contenido generado */}
                <div className="space-y-6">
                  {/* Controles de visualización */}
                  {generatedItems.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Buscar..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full sm:w-64"
                        />

                        <Select value={filterBy} onValueChange={setFilterBy}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Filtrar por" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="image">Imagen</SelectItem>
                            <SelectItem value="code">Código</SelectItem>
                            <SelectItem value="music">Música</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Ordenar por" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Más reciente</SelectItem>
                            <SelectItem value="oldest">Más antiguo</SelectItem>
                            <SelectItem value="rating">Calificación</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant={viewMode === "grid" ? "default" : "outline"}
                          size="icon"
                          onClick={() => setViewMode("grid")}
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>

                        <Button
                          variant={viewMode === "list" ? "default" : "outline"}
                          size="icon"
                          onClick={() => setViewMode("list")}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Vista de elementos generados */}
                  {sortedItems.length > 0 ? (
                    <div
                      className={
                        viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"
                      }
                    >
                      {sortedItems.map((item) => (
                        <Card
                          key={item.id}
                          className={`overflow-hidden transition-all duration-200 ${selectedItem === item.id ? "ring-2 ring-emerald-500" : ""}`}
                          onClick={() => setSelectedItem(item.id)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base flex items-center gap-2">
                                {item.type === "text" ? (
                                  <FileText className="h-4 w-4 text-emerald-500" />
                                ) : item.type === "image" ? (
                                  <ImageIcon className="h-4 w-4 text-blue-500" />
                                ) : item.type === "code" ? (
                                  <Code className="h-4 w-4 text-violet-500" />
                                ) : (
                                  <Music className="h-4 w-4 text-amber-500" />
                                )}
                                <span>
                                  {item.type === "text"
                                    ? "Texto"
                                    : item.type === "image"
                                      ? "Imagen"
                                      : item.type === "code"
                                        ? "Código"
                                        : "Música"}
                                </span>
                              </CardTitle>

                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite(item.id)
                                  }}
                                >
                                  {favorites.includes(item.id) ? (
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  ) : (
                                    <Star className="h-4 w-4" />
                                  )}
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteItem(item.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <CardDescription className="text-xs truncate">
                              {item.prompt || "Generado desde patrón neuronal"}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="pb-2">
                            {item.type === "text" && (
                              <div className="max-h-32 overflow-y-auto text-sm">{item.content}</div>
                            )}

                            {item.type === "image" && (
                              <div className="aspect-square bg-muted rounded-md overflow-hidden">
                                <img
                                  src={item.content || "/placeholder.svg?height=200&width=200"}
                                  alt="Imagen generada"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {item.type === "code" && (
                              <div className="max-h-32 overflow-y-auto text-sm bg-muted p-2 rounded-md font-mono">
                                <pre>{item.content}</pre>
                              </div>
                            )}

                            {item.type === "music" && (
                              <div className="flex items-center justify-center h-32 bg-muted rounded-md">
                                <Music className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className="pt-2 flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <Button
                                  key={rating}
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    rateItem(item.id, rating)
                                  }}
                                >
                                  {rating <= item.rating ? (
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                  ) : (
                                    <Star className="h-3 w-3" />
                                  )}
                                </Button>
                              ))}
                            </div>

                            <div className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mb-4" />
                          <h3 className="text-xl font-medium mb-2">Generando contenido...</h3>
                          <p className="text-muted-foreground max-w-md">
                            Estamos procesando tu patrón neuronal para generar contenido de alta calidad.
                          </p>
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-xl font-medium mb-2">No hay contenido generado</h3>
                          <p className="text-muted-foreground max-w-md mb-6">
                            Configura los parámetros y haz clic en "Generar" para crear contenido basado en tus patrones
                            neuronales.
                          </p>
                          <Button
                            onClick={handleGenerate}
                            disabled={!currentThoughtPattern}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generar{" "}
                            {activeTab === "text"
                              ? "Texto"
                              : activeTab === "image"
                                ? "Imagen"
                                : activeTab === "code"
                                  ? "Código"
                                  : "Música"}
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Vista detallada del elemento seleccionado */}
                  {selectedItem && (
                    <Card className="mt-6">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="flex items-center gap-2">
                            {sortedItems.find((item) => item.id === selectedItem)?.type === "text" ? (
                              <>
                                <FileText className="h-5 w-5 text-emerald-500" />
                                <span>Texto Generado</span>
                              </>
                            ) : sortedItems.find((item) => item.id === selectedItem)?.type === "image" ? (
                              <>
                                <ImageIcon className="h-5 w-5 text-blue-500" />
                                <span>Imagen Generada</span>
                              </>
                            ) : sortedItems.find((item) => item.id === selectedItem)?.type === "code" ? (
                              <>
                                <Code className="h-5 w-5 text-violet-500" />
                                <span>Código Generado</span>
                              </>
                            ) : (
                              <>
                                <Music className="h-5 w-5 text-amber-500" />
                                <span>Música Generada</span>
                              </>
                            )}
                          </CardTitle>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const item = sortedItems.find((item) => item.id === selectedItem)
                                if (item) {
                                  if (item.type === "text" || item.type === "code") {
                                    copyToClipboard(item.content)
                                  }
                                }
                              }}
                              className="flex items-center gap-1"
                            >
                              <Copy className="h-4 w-4" />
                              <span>Copiar</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const item = sortedItems.find((item) => item.id === selectedItem)
                                if (item) {
                                  downloadItem(item)
                                }
                              }}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              <span>Descargar</span>
                            </Button>
                          </div>
                        </div>
                        <CardDescription>
                          {sortedItems.find((item) => item.id === selectedItem)?.prompt ||
                            "Generado desde patrón neuronal"}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        {sortedItems.find((item) => item.id === selectedItem)?.type === "text" && (
                          <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap">
                            {sortedItems.find((item) => item.id === selectedItem)?.content}
                          </div>
                        )}

                        {sortedItems.find((item) => item.id === selectedItem)?.type === "image" && (
                          <div className="flex justify-center">
                            <img
                              src={
                                sortedItems.find((item) => item.id === selectedItem)?.content ||
                                "/placeholder.svg?height=400&width=400" ||
                                "/placeholder.svg"
                              }
                              alt="Imagen generada"
                              className="max-h-[500px] rounded-lg"
                            />
                          </div>
                        )}

                        {sortedItems.find((item) => item.id === selectedItem)?.type === "code" && (
                          <div className="p-4 bg-muted rounded-lg font-mono overflow-x-auto">
                            <pre>{sortedItems.find((item) => item.id === selectedItem)?.content}</pre>
                          </div>
                        )}

                        {sortedItems.find((item) => item.id === selectedItem)?.type === "music" && (
                          <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg">
                            <Music className="h-16 w-16 text-muted-foreground mb-4" />
                            <p className="text-center text-muted-foreground">
                              Reproductor de audio no disponible en esta vista previa
                            </p>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={favorites.includes(selectedItem) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleFavorite(selectedItem)}
                            className="flex items-center gap-1"
                          >
                            {favorites.includes(selectedItem) ? (
                              <>
                                <Star className="h-4 w-4 fill-amber-500" />
                                <span>Favorito</span>
                              </>
                            ) : (
                              <>
                                <Star className="h-4 w-4" />
                                <span>Añadir a favoritos</span>
                              </>
                            )}
                          </Button>

                          <div className="flex items-center gap-1 ml-4">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Button
                                key={rating}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  const item = sortedItems.find((item) => item.id === selectedItem)
                                  if (item) {
                                    rateItem(item.id, rating)
                                  }
                                }}
                              >
                                {rating <= (sortedItems.find((item) => item.id === selectedItem)?.rating || 0) ? (
                                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                ) : (
                                  <Star className="h-4 w-4" />
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Generado el{" "}
                          {new Date(
                            sortedItems.find((item) => item.id === selectedItem)?.timestamp || Date.now(),
                          ).toLocaleString()}
                        </div>
                      </CardFooter>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            {/* Panel de historial */}
            {showHistory && (
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5 text-emerald-500" />
                        <span>Historial de Generación</span>
                      </CardTitle>

                      <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>Historial de configuraciones y generaciones anteriores</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {history.length > 0 ? (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {history.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {item.type === "text" ? (
                                <FileText className="h-5 w-5 text-emerald-500" />
                              ) : item.type === "image" ? (
                                <ImageIcon className="h-5 w-5 text-blue-500" />
                              ) : item.type === "code" ? (
                                <Code className="h-5 w-5 text-violet-500" />
                              ) : (
                                <Music className="h-5 w-5 text-amber-500" />
                              )}

                              <div>
                                <div className="font-medium">
                                  {item.type === "text"
                                    ? "Texto"
                                    : item.type === "image"
                                      ? "Imagen"
                                      : item.type === "code"
                                        ? "Código"
                                        : "Música"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(item.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>

                            <Button variant="outline" size="sm" onClick={() => applyFromHistory(item)}>
                              Aplicar
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No hay historial</h3>
                        <p className="text-muted-foreground max-w-md">
                          El historial se irá creando a medida que generes contenido.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
