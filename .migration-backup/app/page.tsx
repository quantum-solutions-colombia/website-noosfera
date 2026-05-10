"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  LogIn,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { CookiesConsent } from "@/components/cookies-consent"
import { HomepageKPIs } from "@/components/homepage-kpis"
import { HeroCarousel } from "@/components/hero-carousel"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const startDemo = () => {
    router.push("/dashboard?mode=demo")
  }

  const showAuth = () => {
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-emerald-50/30">
      {/* Header */}
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

          <nav>
            <ul className="flex items-center gap-2 md:gap-6">
              <li className="hidden md:block">
                <Link
                  href="/"
                  className="text-emerald-600 font-medium"
                >
                  Inicio
                </Link>
              </li>
              <li className="hidden md:block">
                <Link
                  href="/company"
                  className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  Quienes Somos
                </Link>
              </li>
              <li className="hidden md:block">
                <Link
                  href="/pricing"
                  className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  Planes
                </Link>
              </li>
              <li className="hidden md:block">
                <Link
                  href="/docs"
                  className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  Documentacion
                </Link>
              </li>
              <li>
                <Button
                  variant="outline"
                  onClick={() => router.push("/auth/login")}
                  className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20 hover:border-emerald-500/40"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesion
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <HeroCarousel onStartDemo={startDemo} onShowAuth={showAuth} />

      {/* KPIs Section - 3 Circular Charts */}
      <HomepageKPIs />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comienza a Crear tu Arte Digital
            </h2>
            <p className="text-gray-600 mb-8">
              Unete a miles de creadores que ya estan monetizando sus patrones cardiacos unicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => router.push("/auth/login")}
              >
                Comenzar Gratis
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/pricing")}
              >
                Ver Planes
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <CookiesConsent />
    </div>
  )
}
