"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  ImageIcon,
  Trash2,
  Calendar,
  Download,
  ExternalLink,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Tag,
  Info,
  Copy,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useNoosfera, type ContentType, type GeneratedContent } from "@/contexts/noosfera-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"

export default function ContentLibrary() {
  const [activeTab, setActiveTab] = useState<ContentType>("text")
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)

  const { generatedContent, deleteContent } = useNoosfera()

  // Extract all unique tags from content
  useEffect(() => {
    const tags = new Set<string>()
    generatedContent.forEach((item) => {
      if (item.metadata && item.metadata.tags) {
        item.metadata.tags.forEach((tag: string) => tags.add(tag))
      }
    })
    setAvailableTags(Array.from(tags))
  }, [generatedContent])

  // Filter content based on active tab, search term, and tags
  const filteredContent = generatedContent
    .filter((item) => item.type === activeTab)
    .filter((item) => {
      if (!searchTerm) return true

      // Search in content for text items
      if (item.type === "text" && typeof item.content === "string") {
        return item.content.toLowerCase().includes(searchTerm.toLowerCase())
      }

      // Search in metadata
      return item.metadata && JSON.stringify(item.metadata).toLowerCase().includes(searchTerm.toLowerCase())
    })
    .filter((item) => {
      if (selectedTags.length === 0) return true

      // Check if item has any of the selected tags
      return selectedTags.some((tag) => item.metadata && item.metadata.tags && item.metadata.tags.includes(tag))
    })
    // Sort by timestamp
    .sort((a, b) => {
      if (sortBy === "newest") {
        return b.timestamp - a.timestamp
      } else {
        return a.timestamp - b.timestamp
      }
    })

  const handleContentClick = (content: GeneratedContent) => {
    setSelectedContent(content)
    setDialogOpen(true)
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    // Show confirmation toast
    toast(
      (t) => (
        <div className="flex items-center gap-2">
          <span>¿Eliminar este elemento?</span>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              deleteContent(id)
              toast.dismiss(t.id)

              if (selectedContent?.id === id) {
                setDialogOpen(false)
              }

              toast.success("Elemento eliminado")
            }}
          >
            Eliminar
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t.id)}>
            Cancelar
          </Button>
        </div>
      ),
      { duration: 5000 },
    )
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const downloadContent = (content: GeneratedContent) => {
    if (content.type === "text") {
      const element = document.createElement("a")
      const file = new Blob([content.content], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `pensamiento_${content.id}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      toast.success("Texto descargado")
    } else if (content.type === "image") {
      // Download image with watermark
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.crossOrigin = "anonymous"
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        if (ctx) {
          // Draw the original image
          ctx.drawImage(img, 0, 0)
          
          // Add watermark
          ctx.save()
          ctx.font = "bold 16px Arial"
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
          ctx.shadowBlur = 4
          ctx.shadowOffsetX = 1
          ctx.shadowOffsetY = 1
          
          const watermarkText = "built with noosfera"
          const textMetrics = ctx.measureText(watermarkText)
          const x = canvas.width - textMetrics.width - 15
          const y = canvas.height - 15
          
          ctx.fillText(watermarkText, x, y)
          ctx.restore()
          
          // Download
          const link = document.createElement("a")
          link.download = `noosfera_${content.id}.png`
          link.href = canvas.toDataURL("image/png")
          link.click()
          toast.success("Imagen descargada")
        }
      }
      
      img.onerror = () => {
        // Fallback to direct download if image loading fails
        const link = document.createElement("a")
        link.href = content.content
        link.download = `noosfera_${content.id}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Imagen descargada")
      }
      
      img.src = content.content
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => toast.success("Copiado al portapapeles"))
      .catch(() => toast.error("No se pudo copiar al portapapeles"))
  }

  const exportLibrary = () => {
    setIsExporting(true)

    try {
      const dataToExport = {
        exportDate: new Date().toISOString(),
        content: generatedContent,
      }

      const jsonString = JSON.stringify(dataToExport, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `noosfera_biblioteca_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Biblioteca exportada correctamente")
    } catch (error) {
      toast.error("Error al exportar la biblioteca")
      console.error("Error exporting library:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500" />
              Biblioteca de Contenido
            </CardTitle>
            <CardDescription>Explora el contenido generado a partir de tus pensamientos</CardDescription>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={exportLibrary}
              disabled={isExporting || generatedContent.length === 0}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border rounded-lg p-4 mt-2 space-y-4 bg-muted/30">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar en la biblioteca..."
                        className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Ordenar por</Label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as "newest" | "oldest")}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest" className="flex items-center gap-2">
                          <SortDesc className="h-4 w-4" /> Más recientes
                        </SelectItem>
                        <SelectItem value="oldest" className="flex items-center gap-2">
                          <SortAsc className="h-4 w-4" /> Más antiguos
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {availableTags.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs flex items-center gap-1">
                      <Tag className="h-3 w-3" /> Etiquetas
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="text" onValueChange={(value) => setActiveTab(value as ContentType)}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Textos
              {generatedContent.filter((item) => item.type === "text").length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {generatedContent.filter((item) => item.type === "text").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Imágenes
              {generatedContent.filter((item) => item.type === "image").length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {generatedContent.filter((item) => item.type === "image").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            {filteredContent.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  {searchTerm || selectedTags.length > 0
                    ? "No se encontraron resultados para tu búsqueda"
                    : "No hay textos generados"}
                </p>
                {(searchTerm || selectedTags.length > 0) && (
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedTags([])
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredContent.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleContentClick(item)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-500/10 p-2 rounded-md">
                            <FileText className="h-5 w-5 text-emerald-500" />
                          </div>
                          <div>
                            <div className="font-medium">Texto generado</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(item.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              downloadContent(item)
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDelete(item.id, e)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.content}</div>
                      {item.metadata && item.metadata.tags && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.metadata.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          <TabsContent value="image">
            {filteredContent.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  {searchTerm || selectedTags.length > 0
                    ? "No se encontraron resultados para tu búsqueda"
                    : "No hay imágenes generadas"}
                </p>
                {(searchTerm || selectedTags.length > 0) && (
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedTags([])
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredContent.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="border rounded-lg overflow-hidden cursor-pointer group relative"
                      onClick={() => handleContentClick(item)}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={item.content || "/placeholder.svg"}
                          alt="Imagen generada"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="p-2 flex justify-between items-center">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.timestamp)}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              downloadContent(item)
                            }}
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDelete(item.id, e)}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {item.metadata && item.metadata.tags && (
                        <div className="px-2 pb-2 flex flex-wrap gap-1">
                          {item.metadata.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          {filteredContent.length} {activeTab === "text" ? "textos" : "imágenes"}
          {searchTerm || selectedTags.length > 0 ? " encontrados" : " en total"}
        </div>

        {filteredContent.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("")
              setSelectedTags([])
              setSortBy("newest")
            }}
            disabled={!searchTerm && selectedTags.length === 0 && sortBy === "newest"}
          >
            Restablecer filtros
          </Button>
        )}
      </CardFooter>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedContent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedContent.type === "text" ? (
                    <>
                      <FileText className="h-5 w-5 text-emerald-500" />
                      Texto Generado
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-5 w-5 text-emerald-500" />
                      Imagen Generada
                    </>
                  )}
                </DialogTitle>
                <DialogDescription className="flex items-center justify-between">
                  <span>Generado el {formatDate(selectedContent.timestamp)}</span>
                  <Badge variant="outline" className="ml-2">
                    ID: {selectedContent.id}
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              {selectedContent.type === "text" ? (
                <div className="space-y-4">
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <p className="whitespace-pre-wrap">{selectedContent.content}</p>
                  </ScrollArea>

                  {selectedContent.metadata && (
                    <div className="border rounded-md p-3 bg-muted/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-medium">Metadatos</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(selectedContent.metadata).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-xs text-muted-foreground capitalize">{key}</span>
                            <span>{typeof value === "object" ? JSON.stringify(value) : (value as string)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center p-4 border rounded-md">
                    <img
                      src={selectedContent.content || "/placeholder.svg"}
                      alt="Imagen generada"
                      className="max-h-[400px] object-contain"
                    />
                  </div>

                  {selectedContent.metadata && (
                    <div className="border rounded-md p-3 bg-muted/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-medium">Metadatos</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(selectedContent.metadata).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-xs text-muted-foreground capitalize">{key}</span>
                            <span>{typeof value === "object" ? JSON.stringify(value) : (value as string)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {selectedContent.type === "text" && (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(selectedContent.content)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => downloadContent(selectedContent)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Descargar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteContent(selectedContent.id)
                    setDialogOpen(false)
                    toast.success("Elemento eliminado")
                  }}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
