"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const galleryImages = [
  {
    id: 1,
    src: "/gallery/cardiac-art-1.jpg",
    alt: "Arte digital generado a partir de patrones cardiacos",
    title: "Ritmo Vital",
    description: "NFT generado a partir de un momento de meditacion profunda",
  },
  {
    id: 2,
    src: "/gallery/cardiac-art-2.jpg",
    alt: "Visualizacion de ondas cardiacas en arte abstracto",
    title: "Pulso Cosmico",
    description: "Patrones de ejercicio intenso transformados en arte",
  },
  {
    id: 3,
    src: "/gallery/cardiac-art-3.jpg",
    alt: "NFT de patrones biometricos unicos",
    title: "Latido Digital",
    description: "Emociones capturadas en colores vibrantes",
  },
  {
    id: 4,
    src: "/gallery/cardiac-art-4.jpg",
    alt: "Arte generativo basado en frecuencia cardiaca",
    title: "Frecuencia Eterna",
    description: "Momentos de calma convertidos en arte eterno",
  },
  {
    id: 5,
    src: "/gallery/cardiac-art-5.jpg",
    alt: "Obra digital de ritmos cardiacos",
    title: "Sintonia Interior",
    description: "La armonia del corazon en forma visual",
  },
]

export function ImageGalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  }, [])

  useEffect(() => {
    if (isHovered) return

    const interval = setInterval(nextSlide, 3500)
    return () => clearInterval(interval)
  }, [isHovered, nextSlide])

  // Get visible images (3 at a time on desktop, 1 on mobile)
  const getVisibleImages = () => {
    const images = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % galleryImages.length
      images.push({ ...galleryImages[index], position: i })
    }
    return images
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            Galeria NFT
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Arte Generado por Latidos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explora nuestra coleccion de NFTs unicos creados a partir de patrones cardiacos reales
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Desktop View - 3 images */}
          <div className="hidden md:flex gap-6 justify-center">
            <AnimatePresence mode="popLayout">
              {getVisibleImages().map((image, idx) => (
                <motion.div
                  key={`${image.id}-${currentIndex}`}
                  initial={{ opacity: 0, scale: 0.8, x: 100 }}
                  animate={{
                    opacity: idx === 1 ? 1 : 0.7,
                    scale: idx === 1 ? 1.05 : 0.95,
                    x: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`relative group cursor-pointer ${idx === 1 ? "z-10" : "z-0"}`}
                >
                  <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-xl">
                    {/* Gradient Placeholder Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      idx === 0 ? "from-emerald-400 to-teal-600" :
                      idx === 1 ? "from-blue-400 to-violet-600" :
                      "from-rose-400 to-pink-600"
                    }`}>
                      {/* Animated Pattern */}
                      <div className="absolute inset-0 opacity-30">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <motion.path
                            d="M0,50 Q25,30 50,50 T100,50"
                            stroke="white"
                            strokeWidth="0.5"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                          />
                          <motion.path
                            d="M0,60 Q25,40 50,60 T100,60"
                            stroke="white"
                            strokeWidth="0.3"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop", delay: 0.3 }}
                          />
                        </svg>
                      </div>

                      {/* Heart Icon Animation */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <svg className="w-24 h-24 text-white/40" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </motion.div>
                    </div>

                    {/* Overlay with info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-xl font-bold mb-1">{image.title}</h3>
                        <p className="text-sm text-white/80">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Mobile View - 1 image */}
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative mx-auto w-full max-w-sm"
              >
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-blue-500 to-violet-600">
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <svg className="w-24 h-24 text-white/40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </motion.div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">{galleryImages[currentIndex].title}</h3>
                      <p className="text-sm text-white/80">{galleryImages[currentIndex].description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-gradient-to-r from-emerald-500 to-blue-500"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Cada NFT es unico e irrepetible, generado a partir de tus propios latidos
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full">Ethereum</span>
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full">Polygon</span>
            <span className="px-4 py-2 bg-violet-50 text-violet-700 rounded-full">Solana</span>
            <span className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full">BSC</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
