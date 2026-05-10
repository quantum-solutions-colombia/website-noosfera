"use client"

import { ArrowLeft, Cookie, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function CookiesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-emerald-50/30">
      {/* Header */}
      <header className="w-full px-4 py-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <Heart className="h-6 w-6 text-emerald-500" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Noosfera
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors">
              Inicio
            </Link>
            <Link href="/company" className="text-gray-600 hover:text-emerald-600 transition-colors">
              Quienes Somos
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-emerald-600 transition-colors">
              Planes
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-emerald-600 transition-colors">
              Documentacion
            </Link>
          </nav>

          <Button
            variant="outline"
            onClick={() => router.push("/auth/login")}
            className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20 hover:border-emerald-500/40"
          >
            Iniciar Sesion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-8 border-b">
              <div className="mx-auto mb-4 bg-emerald-100 p-4 rounded-full w-fit">
                <Cookie className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Politica de Cookies</CardTitle>
              <CardDescription className="text-gray-600">
                Ultima actualizacion: {new Date().toLocaleDateString("es-CO")}
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none pt-8">
              <p className="text-gray-600 leading-relaxed">
                En Noosfera, utilizamos cookies y tecnologias similares para mejorar tu experiencia de navegacion. 
                Esta politica explica que son las cookies, como las utilizamos y tus opciones respecto a ellas.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Que son las Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Las cookies son pequenos archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. 
                Nos permiten recordar tus preferencias y mejorar tu experiencia de usuario.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Tipos de Cookies que Utilizamos</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">2.1 Cookies Esenciales</h3>
              <p className="text-gray-600 leading-relaxed">
                Son necesarias para el funcionamiento basico del sitio web. Sin estas cookies, algunos servicios no podrian funcionar correctamente.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Autenticacion y sesion de usuario</li>
                <li>Preferencias de seguridad</li>
                <li>Balanceo de carga del servidor</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">2.2 Cookies de Preferencias</h3>
              <p className="text-gray-600 leading-relaxed">
                Permiten recordar tus preferencias y configuraciones personalizadas.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Idioma preferido</li>
                <li>Configuracion de visualizacion</li>
                <li>Preferencias de notificaciones</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">2.3 Cookies Analiticas</h3>
              <p className="text-gray-600 leading-relaxed">
                Nos ayudan a entender como los usuarios interactuan con nuestro sitio web.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Paginas visitadas y tiempo de permanencia</li>
                <li>Fuentes de trafico</li>
                <li>Rendimiento del sitio</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Gestion de Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Puedes gestionar tus preferencias de cookies en cualquier momento a traves de:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>La configuracion de tu navegador</li>
                <li>Nuestro banner de consentimiento de cookies</li>
                <li>El panel de configuracion de tu cuenta</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Cookies de Terceros</h2>
              <p className="text-gray-600 leading-relaxed">
                Algunas cookies son establecidas por servicios de terceros que aparecen en nuestras paginas:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Google Analytics (analisis de trafico)</li>
                <li>Servicios de pago (procesamiento de transacciones)</li>
                <li>Redes sociales (botones de compartir)</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Duracion de las Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Las cookies pueden ser de sesion (se eliminan al cerrar el navegador) o persistentes (permanecen hasta su fecha de expiracion o hasta que las elimines manualmente).
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Contacto</h2>
              <p className="text-gray-600 leading-relaxed">
                Si tienes preguntas sobre nuestra politica de cookies, contactanos en:
              </p>
              <p className="text-gray-600">
                Email: <a href="mailto:privacy@noosfera.com" className="text-emerald-600 hover:underline">privacy@noosfera.com</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
