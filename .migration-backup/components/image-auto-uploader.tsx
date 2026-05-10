"use client"

import { useEffect, useRef } from "react"
import { localDB, generateId } from "@/lib/local-storage"
import { toast } from "react-hot-toast"

interface ImageAutoUploaderProps {
  userId: string
  sessionId?: string
  onUploadComplete?: (imageUrl: string) => void
}

export function ImageAutoUploader({ userId, sessionId, onUploadComplete }: ImageAutoUploaderProps) {
  const uploadInProgressRef = useRef(false)
  const lastImageCountRef = useRef(0)

  useEffect(() => {
    const checkForNewImages = () => {
      const images = localDB.getImages()
      const userImages = images.filter((img) => img.user_id === userId)

      if (userImages.length > lastImageCountRef.current) {
        const latestImage = userImages[userImages.length - 1]
        onUploadComplete?.(latestImage.image_url)
        toast.success("Imagen guardada automáticamente")
        lastImageCountRef.current = userImages.length
      }
    }

    // Verificar cada 2 segundos
    const interval = setInterval(checkForNewImages, 2000)

    return () => clearInterval(interval)
  }, [userId, onUploadComplete])

  const saveImage = async (imageBlob: Blob, imageName: string) => {
    if (uploadInProgressRef.current) return

    uploadInProgressRef.current = true

    try {
      const formData = new FormData()
      formData.append("file", imageBlob)

      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Error uploading image")
      }

      const { url } = await uploadResponse.json()

      localDB.addImage({
        id: generateId(),
        user_id: userId,
        session_id: sessionId,
        image_url: url,
        processing_time_ms: 0,
        generation_timestamp: new Date().toISOString(),
      })

      console.log("Image saved successfully:", url)
    } catch (error) {
      console.error("Error saving image:", error)
      toast.error("Error al guardar la imagen")
    } finally {
      uploadInProgressRef.current = false
    }
  }

  return null
}
