import { useEffect } from "react"
import { useLocation, Link } from "wouter"
import { useAuth } from "@/contexts/auth-context"
import { CookiesConsent } from "@/components/cookies-consent"
import { RecentCreations } from "@/components/recent-creations"
import { HeroCarousel } from "@/components/hero-carousel"
import { Footer } from "@/components/footer"

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
      {/* Header */}
      <header className="w-full px-6 py-4 z-50 bg-white border-b border-gray-100 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/"
            className="text-xl font-black text-gray-900 tracking-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Noosfera
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "/", label: "Inicio", active: true },
              { href: "/company", label: "Quiénes Somos" },
              { href: "/pricing", label: "Planes" },
              { href: "/docs", label: "Documentación" },
            ].map(({ href, label, active }) => (
              <Link key={href} href={href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-purple-600" : "text-gray-500 hover:text-gray-900"
                }`}>
                {label}
              </Link>
            ))}
          </nav>

          <button
            onClick={showAuth}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#7c3aed" }}>
            Iniciar Sesión
          </button>
        </div>
      </header>

      {/* Hero */}
      <HeroCarousel onStartDemo={startDemo} onShowAuth={showAuth} />

      {/* Recent Creations */}
      <RecentCreations />

      {/* CTA Section */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)" }}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">Empieza Hoy</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Comienza a Crear<br />
              tu Arte Digital
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Únete a miles de creadores que ya están monetizando sus patrones cardíacos únicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={showAuth}
                className="px-8 py-4 rounded-full font-semibold text-white text-sm tracking-wide transition-all hover:opacity-90"
                style={{ backgroundColor: "#7c3aed" }}>
                Comenzar Gratis
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="px-8 py-4 rounded-full font-semibold text-gray-700 text-sm tracking-wide border border-gray-300 hover:border-purple-300 hover:text-purple-600 transition-all bg-white">
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
