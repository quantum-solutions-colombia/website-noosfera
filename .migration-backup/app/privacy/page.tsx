"use client"

import { ArrowLeft, Shield, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function PrivacyPage() {
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
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Politica de Privacidad</CardTitle>
              <CardDescription className="text-gray-600">
                Ultima actualizacion: {new Date().toLocaleDateString("es-CO")}
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none pt-8">
              <p className="text-gray-600 leading-relaxed">
                En Noosfera, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta politica describe como 
                recopilamos, usamos y protegemos tu informacion personal y datos de ritmo cardiaco.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Informacion que Recopilamos</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">1.1 Informacion Personal</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Nombre y apellidos</li>
                <li>Direccion de correo electronico</li>
                <li>Fecha de nacimiento</li>
                <li>Informacion de perfil</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">1.2 Datos Cardiacos</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Patrones de ritmo cardiaco</li>
                <li>Datos de variabilidad cardiaca</li>
                <li>Metricas de frecuencia cardiaca</li>
                <li>Registros de sesiones de monitoreo</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Uso de la Informacion</h2>
              <p className="text-gray-600 leading-relaxed">Utilizamos la informacion recopilada para:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Personalizar tu experiencia</li>
                <li>Procesar y generar contenido digital</li>
                <li>Investigacion y desarrollo (datos anonimizados)</li>
                <li>Comunicarnos contigo sobre actualizaciones y cambios</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Proteccion de Datos</h2>
              <p className="text-gray-600 leading-relaxed">Implementamos medidas de seguridad robustas:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Encriptacion de extremo a extremo</li>
                <li>Almacenamiento seguro en servidores protegidos</li>
                <li>Acceso restringido al personal autorizado</li>
                <li>Monitoreo continuo de seguridad</li>
                <li>Copias de seguridad regulares</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Compartir Informacion</h2>
              <p className="text-gray-600 leading-relaxed">No compartimos tu informacion personal o datos de ritmo cardiaco con terceros, excepto:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Con tu consentimiento explicito</li>
                <li>Para cumplir con obligaciones legales</li>
                <li>Para proteger nuestros derechos o propiedad</li>
                <li>En caso de fusion o adquisicion empresarial</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Tus Derechos</h2>
              <p className="text-gray-600 leading-relaxed">Como usuario, tienes derecho a:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Acceder a tu informacion personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminacion de tus datos</li>
                <li>Exportar tus datos en un formato portable</li>
                <li>Retirar tu consentimiento en cualquier momento</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Retencion de Datos</h2>
              <p className="text-gray-600 leading-relaxed">
                Mantenemos tu informacion mientras tu cuenta este activa o sea necesario para proporcionar servicios. 
                Puedes solicitar la eliminacion de tu cuenta y datos en cualquier momento.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Menores de Edad</h2>
              <p className="text-gray-600 leading-relaxed">
                Nuestros servicios no estan dirigidos a menores de 18 anos. No recopilamos intencionalmente 
                informacion de menores.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Contacto</h2>
              <p className="text-gray-600 leading-relaxed">
                Si tienes preguntas sobre nuestra politica de privacidad, contactanos en:
              </p>
              <p className="text-gray-600">
                Email: <a href="mailto:privacy@noosfera.com" className="text-emerald-600 hover:underline">privacy@noosfera.com</a>
                <br />
                Telefono: +57 300 123 4567
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
