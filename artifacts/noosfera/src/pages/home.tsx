import { useEffect } from "react"
import { useLocation } from "wouter"
import { useAuth } from "@/contexts/auth-context"
import { CookiesConsent } from "@/components/cookies-consent"
import { RecentCreations } from "@/components/recent-creations"
import { HeroCarousel } from "@/components/hero-carousel"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"

export default function LandingPage() {
  const [, navigate] = useLocation()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard")
  }, [isAuthenticated, navigate])

  const startDemo = () => navigate("/dashboard?mode=demo")
  const showAuth = () => navigate("/auth/login")

  return (
    <div className="min-h-screen bg-white">
      <DarkNav activeLink="home" />

      <HeroCarousel onStartDemo={startDemo} onShowAuth={showAuth} />

      <RecentCreations />

      <section className="py-14 md:py-20"
        style={{
          backgroundColor: "#7c3aed",
          borderRadius: "2.5rem 2.5rem 0 0",
          marginTop: "0.5rem",
        }}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">Empieza Hoy</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Comienza a Crear<br />
              tu Arte Digital
            </h2>
            <p className="text-purple-200 text-base md:text-lg leading-relaxed">
              Transforma tus latidos en NFTs únicos y monetiza tu arte digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={showAuth}
                className="px-8 py-4 font-semibold text-purple-700 text-sm tracking-wide transition-all hover:opacity-95 hover:scale-[1.02]"
                style={{ backgroundColor: "#ffffff", borderRadius: "14px" }}>
                Comenzar Demo
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="px-8 py-4 font-semibold text-purple-700 text-sm tracking-wide transition-all hover:opacity-95 hover:scale-[1.02]"
                style={{ backgroundColor: "#ffffff", borderRadius: "14px" }}>
                Ver Planes
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CookiesConsent />
    </div>
  )
}
