"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check, ArrowRight, Zap, Heart, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Plan {
  id: string
  name: string
  description: string
  price: string
  currency: string
  period: string
  features: { text: string; included: boolean }[]
  cta: string
  highlighted: boolean
  badge?: string
  icon: React.ElementType
  color: string
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Plan Free",
    description: "Perfecto para comenzar",
    price: "$0",
    currency: "COP",
    period: "Gratis para siempre",
    features: [
      { text: "10 capturas cardiacas/mes", included: true },
      { text: "5 imagenes NFT/mes", included: true },
      { text: "Resolucion estandar", included: true },
      { text: "2 estilos de generacion", included: true },
      { text: "1 GB almacenamiento", included: true },
      { text: "Marca de agua en NFTs", included: false },
      { text: "Soporte por correo", included: false },
    ],
    cta: "Comenzar Ahora",
    highlighted: false,
    icon: Heart,
    color: "emerald"
  },
  {
    id: "standard",
    name: "Plan Estandar",
    description: "Ideal para creadores activos",
    price: "$39.900",
    currency: "COP",
    period: "por mes",
    features: [
      { text: "Capturas ilimitadas", included: true },
      { text: "50 imagenes NFT/mes", included: true },
      { text: "Resolucion alta (2048px)", included: true },
      { text: "Todos los estilos de generacion", included: true },
      { text: "50 GB almacenamiento", included: true },
      { text: "Sin marca de agua", included: true },
      { text: "Comision 8% (vs 10%)", included: true },
      { text: "Soporte prioritario", included: true },
    ],
    cta: "Comenzar Ahora",
    highlighted: true,
    icon: Zap,
    color: "emerald"
  },
  {
    id: "premium",
    name: "Plan Premium",
    description: "Para profesionales serios",
    price: "$89.900",
    currency: "COP",
    period: "por mes",
    features: [
      { text: "Todo del Plan Estandar +", included: true },
      { text: "NFTs ilimitados", included: true },
      { text: "Resolucion ultra (4096px)", included: true },
      { text: "Almacenamiento ilimitado", included: true },
      { text: "Estilos personalizados con IA", included: true },
      { text: "Comision minima 5%", included: true },
      { text: "API de integracion", included: true },
      { text: "Soporte 24/7", included: true },
      { text: "Promocion destacada en marketplace", included: true },
    ],
    cta: "Comenzar Ahora",
    highlighted: false,
    icon: Crown,
    color: "emerald"
  },
]

export function PlansCarousel() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(1) // Start with middle plan
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % plans.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + plans.length) % plans.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const getSlideStyle = (index: number) => {
    const diff = index - currentIndex
    const normalizedDiff = ((diff + plans.length) % plans.length)
    
    if (normalizedDiff === 0) {
      return { x: 0, scale: 1, opacity: 1, zIndex: 3 }
    } else if (normalizedDiff === 1 || normalizedDiff === -2) {
      return { x: 200, scale: 0.85, opacity: 0.6, zIndex: 2 }
    } else {
      return { x: -200, scale: 0.85, opacity: 0.6, zIndex: 2 }
    }
  }

  return (
    <div 
      className="relative overflow-hidden py-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative h-[360px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {plans.map((plan, index) => {
            const style = getSlideStyle(index)
            const isCenter = index === currentIndex
            const Icon = plan.icon
            
            return (
              <motion.div
                key={plan.id}
                className="absolute"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x: style.x,
                  scale: style.scale,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Card 
                  className={`w-[220px] h-[320px] relative transition-all duration-300 ${
                    isCenter 
                      ? plan.highlighted 
                        ? "border-2 border-emerald-500 shadow-2xl bg-gradient-to-br from-emerald-50 to-teal-50" 
                        : "border-emerald-200 shadow-xl bg-white"
                      : "border-gray-100 shadow-md bg-gray-50/80"
                  }`}
                >
                  {plan.badge && isCenter && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-emerald-500 text-white px-4 py-1">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-1 pt-3 px-3">
                    <div className="mx-auto p-2 rounded-lg bg-emerald-100 w-fit mb-1">
                      <Icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <CardTitle className="text-base text-gray-900">{plan.name}</CardTitle>
                    <CardDescription className="text-xs text-gray-600">{plan.description}</CardDescription>

                    <div className="mt-1">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500 text-[10px]">/{plan.currency}</span>
                      </div>
                      <p className="text-[10px] text-gray-500">{plan.period}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 pt-1 px-3">
                    <ul className="space-y-1 max-h-[100px] overflow-y-auto">
                      {plan.features.slice(0, 4).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-[11px]">
                          {feature.included ? (
                            <Check className="h-3 w-3 mr-1 text-emerald-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <div className="h-3 w-3 mr-1 text-gray-300 flex-shrink-0 mt-0.5">-</div>
                          )}
                          <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {isCenter && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Button
                          size="sm"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                          onClick={() => router.push("/auth/login")}
                        >
                          {plan.cta}
                          <ArrowRight className="ml-1.5 h-3 w-3" />
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors z-10"
        aria-label="Plan anterior"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors z-10"
        aria-label="Siguiente plan"
      >
        <ChevronRight className="h-6 w-6 text-gray-700" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {plans.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-emerald-500 w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Ir al plan ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
