"use client"

import { useEffect, useRef } from "react"

interface ResizeObserverOptions {
  debounceTime?: number
  onResize?: (width: number, height: number) => void
}

/**
 * Hook personalizado para manejar ResizeObserver con debounce
 * para evitar el error "ResizeObserver loop completed with undelivered notifications"
 */
export function useResizeObserver<T extends HTMLElement>(options: ResizeObserverOptions = {}) {
  const { debounceTime = 100, onResize } = options
  const elementRef = useRef<T>(null)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      // Cancelar el timeout anterior si existe
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }

      // Establecer un nuevo timeout para retrasar el procesamiento
      resizeTimeoutRef.current = setTimeout(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect
          if (onResize) {
            onResize(width, height)
          }
        }
      }, debounceTime)
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [debounceTime, onResize])

  return elementRef
}
