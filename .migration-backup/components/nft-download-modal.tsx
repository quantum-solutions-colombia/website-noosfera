"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Check, Wallet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface NFTDownloadModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  nftToken: string
  imageId: string
}

export default function NFTDownloadModal({ isOpen, onClose, imageUrl, nftToken, imageId }: NFTDownloadModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<"png" | "jpg" | "svg" | "webp">("png")
  const [isDownloading, setIsDownloading] = useState(false)

  const formats = [
    { value: "png", label: "PNG", description: "Alta calidad, transparencia" },
    { value: "jpg", label: "JPG", description: "Tamaño optimizado" },
    { value: "svg", label: "SVG", description: "Vectorial, escalable" },
    { value: "webp", label: "WEBP", description: "Moderna, comprimida" },
  ] as const

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Simular descarga
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Crear enlace de descarga
      const link = document.createElement("a")
      link.href = imageUrl
      link.download = `noosfera-cardiac-nft-${imageId}.${selectedFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "✅ Descarga Exitosa",
        description: `Tu NFT cardíaco se descargó en formato ${selectedFormat.toUpperCase()}`,
      })

      // Cerrar modal después de descargar
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar la imagen",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleGoToWallet = () => {
    window.open("https://opensea.io/", "_blank")
    toast({
      title: "🚀 Redirigiendo a Wallet NFT",
      description: "Abriendo OpenSea - Principal marketplace NFT en Colombia",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-emerald-500" />
            Tu NFT Cardíaco está Listo
          </DialogTitle>
          <DialogDescription>Descarga tu imagen única o monetízala en el marketplace de NFTs</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Vista previa de la imagen */}
          <div className="relative rounded-lg overflow-hidden border-2 border-emerald-500/20">
            <img src={imageUrl || "/placeholder.svg"} alt="NFT Preview" className="w-full h-auto" />
            <div className="absolute top-2 right-2">
              <Badge className="bg-emerald-500/90 text-white">NFT Único</Badge>
            </div>
          </div>

          {/* Token NFT */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Token NFT Único</label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-sm font-mono text-emerald-500">{nftToken}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(nftToken)
                  toast({
                    title: "Copiado",
                    description: "Token NFT copiado al portapapeles",
                  })
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Este token único identifica tu NFT en la blockchain y garantiza su autenticidad
            </p>
          </div>

          {/* Selector de formato */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Formato de Descarga</label>
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => (
                <motion.button
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedFormat === format.value
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-muted hover:border-emerald-500/50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{format.label}</span>
                    {selectedFormat === format.value && <Check className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{format.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-2 border-emerald-500/30 rounded-lg"
          >
            <div className="flex items-start gap-3 mb-4">
              <Wallet className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">¿Quieres monetizar este NFT?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Conecta tu wallet y vende tu NFT cardíaco en el principal marketplace de Colombia. Acepta pagos en
                  ETH, USDC, MATIC y más criptomonedas.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleGoToWallet}
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Monetizar
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    variant="outline"
                    className="w-full border-emerald-500/50 hover:bg-emerald-500/10 bg-transparent"
                  >
                    {isDownloading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2"
                        >
                          <Download className="h-4 w-4" />
                        </motion.div>
                        Descargando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Solo Descargar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Información adicional */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              💡 <strong>Tip:</strong> Los NFTs cardíacos son únicos y tienen alto valor emocional. Si decides
              monetizar, establece un precio competitivo basado en la complejidad y rareza de tu patrón.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="ghost" onClick={onClose} className="gap-2">
            <X className="h-4 w-4" />
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
