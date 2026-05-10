"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Users, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"

interface TeamSlide {
  id: number
  type: "intro" | "member"
  name?: string
  role?: string
  description: string
  image?: string
  gradient: string
}

const teamSlides: TeamSlide[] = [
  {
    id: 0,
    type: "intro",
    description: "Conoce a las personas apasionadas que hacen posible Noosfera. Un equipo dedicado a transformar la tecnologia cardiaca en arte digital.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 1,
    type: "member",
    name: "Miguel Molina",
    role: "CEO & Cofounder",
    description: "QA Tester con amplia experiencia en aseguramiento de calidad y pruebas de software. Apasionado por garantizar la excelencia en cada detalle del producto.",
    image: "/team/miguel-molina.jpg",
    gradient: "from-gray-700 to-gray-900",
  },
  {
    id: 2,
    type: "member",
    name: "Harry Fishert",
    role: "Dev Full Stack & Founder",
    description: "Desarrollador Full Stack y fundador con experiencia en arquitectura de software y desarrollo de aplicaciones innovadoras. Lider tecnico del proyecto Noosfera.",
    image: "/team/harry-fishert.jpg",
    gradient: "from-orange-500 to-amber-600",
  },
]

export default function CompanyPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamSlides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-emerald-50/30 isolate">
      <header className="w-full px-4 py-6 z-50 bg-white border-b border-gray-100 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <Heart className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Noosfera
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Inicio
            </Link>
            <Link href="/company" className="text-emerald-600 font-medium">
              Quienes Somos
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Planes
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Documentacion
            </Link>
          </nav>

          <Button
            variant="outline"
            onClick={() => router.push("/auth/login")}
            className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20 hover:border-emerald-500/40"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Iniciar Sesion
          </Button>
        </div>
      </header>

      {/* Team Carousel */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          {teamSlides[currentSlide].type === "intro" ? (
            /* Intro slide - centered text only, no image */
            <div className="max-w-3xl mx-auto text-center">
              <div className="space-y-6">
                <p className={`text-sm font-semibold uppercase tracking-wider bg-gradient-to-r ${teamSlides[currentSlide].gradient} bg-clip-text text-transparent`}>
                  Nuestro Equipo
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Las Personas Detras de Noosfera
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  {teamSlides[currentSlide].description}
                </p>
              </div>
            </div>
          ) : (
            /* Team member slides - grid layout with reduced image */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              {/* Text Content - Left Side */}
              <div className="order-2 lg:order-1">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    {teamSlides[currentSlide].role}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                    {teamSlides[currentSlide].description}
                  </p>
                </div>
              </div>

              {/* Image Content - Right Side - Reduced size */}
              <div className="order-1 lg:order-2 flex justify-center">
                <div
                  className={`relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl bg-gradient-to-br ${teamSlides[currentSlide].gradient} flex items-center justify-center shadow-xl overflow-hidden`}
                >
                  <Image
                    src={teamSlides[currentSlide].image || ""}
                    alt={teamSlides[currentSlide].name || "Team member"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {teamSlides.map((_, index) => (
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Unete a Noosfera</h2>
          <p className="text-gray-600 mb-8">
            Se parte de la revolucion del arte digital biometrico. Comienza a crear NFTs unicos con tus latidos hoy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => router.push("/auth/login")}
            >
              Comenzar Ahora
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/docs")}>
              Conocer Mas
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
