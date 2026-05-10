"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Zap, TrendingUp, Activity, Shield, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    id: 1,
    title: "Captura Cardiaca Directa",
    description: "Convierte tus patrones de ritmo cardiaco en arte visual unico mediante sensores de ultima generacion",
    icon: Heart,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    id: 2,
    title: "Generacion NFT Automatica",
    description: "Transforma tus latidos en NFTs comercializables con un solo clic en multiples blockchains",
    icon: Zap,
    gradient: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-50 to-cyan-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 3,
    title: "Marketplace Integrado",
    description: "Vende tus creaciones cardiacas en los principales marketplaces de NFTs del mundo",
    icon: TrendingUp,
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    id: 4,
    title: "Analisis en Tiempo Real",
    description: "Visualiza tus patrones cardiacos con graficas avanzadas y metricas detalladas al instante",
    icon: Activity,
    gradient: "from-rose-500 to-pink-600",
    bgGradient: "from-rose-50 to-pink-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: 5,
    title: "Seguridad Blockchain",
    description: "Tus NFTs estan protegidos con encriptacion de extremo a extremo y autenticacion certificada",
    icon: Shield,
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: 6,
    title: "IA Creativa",
    description: "Algoritmos de inteligencia artificial que transforman datos biometricos en arte digital unico",
    icon: Sparkles,
    gradient: "from-teal-500 to-emerald-600",
    bgGradient: "from-teal-50 to-emerald-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
]

export function FeaturesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % features.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const currentFeature = features[currentIndex]
  const Icon = currentFeature.icon

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Carousel Container */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentFeature.bgGradient} p-8 md:p-12 min-h-[400px] transition-all duration-500`}>
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/30 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative z-10 flex flex-col md:flex-row items-center gap-8"
          >
            {/* Icon Section */}
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`${currentFeature.iconBg} p-6 md:p-8 rounded-3xl shadow-lg`}
            >
              <Icon className={`h-16 w-16 md:h-20 md:w-20 ${currentFeature.iconColor}`} />
            </motion.div>

            {/* Content Section */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${currentFeature.gradient} text-white text-sm font-medium mb-4`}
              >
                Caracteristica {currentIndex + 1} de {features.length}
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                {currentFeature.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-lg md:text-xl leading-relaxed"
              >
                {currentFeature.description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            prevSlide()
            setIsAutoPlaying(false)
            setTimeout(() => setIsAutoPlaying(true), 5000)
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full h-10 w-10 md:h-12 md:w-12"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            nextSlide()
            setIsAutoPlaying(false)
            setTimeout(() => setIsAutoPlaying(true), 5000)
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full h-10 w-10 md:h-12 md:w-12"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? `w-8 bg-gradient-to-r ${features[index].gradient}`
                : "w-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${currentFeature.gradient}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
          key={currentIndex}
        />
      </div>
    </div>
  )
}
