"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  gradient: string
}

const slides: HeroSlide[] = [
  {
    id: 1,
    title: "Bienvenido a Noosfera",
    subtitle: "Tu ritmo cardiaco, tu arte digital",
    description: "Transforma tus latidos unicos en NFTs valiosos que puedes monetizar en el mercado de criptomonedas.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 2,
    title: "Tecnologia Innovadora",
    subtitle: "Inteligencia Artificial Avanzada",
    description: "Nuestra IA interpreta tus patrones cardiacos y los convierte en arte digital unico e irrepetible.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 3,
    title: "Monetiza tu Salud",
    subtitle: "Genera ingresos pasivos",
    description: "Cada latido capturado tiene valor. Vende tus NFTs cardiacos en las principales plataformas blockchain.",
    gradient: "from-violet-500 to-purple-600",
  },
]

interface HeroCarouselProps {
  onStartDemo: () => void
  onShowAuth: () => void
}

export function HeroCarousel({ onStartDemo, onShowAuth }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Background decorations - static */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Centered Text Content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          <h1 
            key={`title-${currentSlide}`}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-balance transition-opacity duration-500"
          >
            {slides[currentSlide].title}
          </h1>
          
          <p 
            key={`subtitle-${currentSlide}`}
            className={`text-xl md:text-2xl font-medium bg-gradient-to-r ${slides[currentSlide].gradient} bg-clip-text text-transparent transition-opacity duration-500`}
          >
            {slides[currentSlide].subtitle}
          </p>
          
          <p 
            key={`desc-${currentSlide}`}
            className="text-lg text-gray-600 max-w-xl leading-relaxed transition-opacity duration-500"
          >
            {slides[currentSlide].description}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              size="lg"
              className={`bg-gradient-to-r ${slides[currentSlide].gradient} hover:opacity-90 shadow-lg text-white transition-all duration-500`}
              onClick={onStartDemo}
            >
              Ver Demo
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={onShowAuth}
              className="border-gray-300 hover:border-gray-400 text-gray-700"
            >
              Iniciar Sesion
            </Button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 h-3 bg-emerald-500"
                  : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
