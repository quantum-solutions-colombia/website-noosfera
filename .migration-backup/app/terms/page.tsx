"use client"

import { ArrowLeft, FileText, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function TermsPage() {
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
                <FileText className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Terminos y Condiciones</CardTitle>
              <CardDescription className="text-gray-600">
                Ultima actualizacion: {new Date().toLocaleDateString("es-CO")}
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none pt-8">
              <p className="text-gray-600 leading-relaxed">
                Bienvenido a Noosfera. Al acceder y utilizar este sistema, aceptas los siguientes terminos y 
                condiciones. Por favor, lee detenidamente este documento antes de utilizar nuestros servicios.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Aceptacion de los Terminos</h2>
              <p className="text-gray-600 leading-relaxed">
                Al utilizar Noosfera, aceptas estar sujeto a estos terminos de servicio. Si no estas de acuerdo con 
                alguna parte de los terminos, no podras acceder al servicio.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Descripcion del Servicio</h2>
              <p className="text-gray-600 leading-relaxed">
                Noosfera es un sistema de interpretacion de estados emocionales que utiliza tecnologia de monitoreo 
                cardiaco e inteligencia artificial para transformar patrones de ritmo cardiaco en contenido digital y NFTs.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Registro y Cuentas de Usuario</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Debes tener al menos 18 anos para utilizar este servicio</li>
                <li>Eres responsable de mantener la seguridad de tu cuenta</li>
                <li>La informacion proporcionada debe ser precisa y actualizada</li>
                <li>No debes compartir tus credenciales de acceso</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Uso del Servicio</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>El servicio debe utilizarse de manera etica y legal</li>
                <li>No debes intentar acceder a datos de otros usuarios</li>
                <li>No debes utilizar el servicio para fines maliciosos</li>
                <li>Debes seguir las pautas de uso seguro del dispositivo de monitoreo cardiaco</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Propiedad Intelectual</h2>
              <p className="text-gray-600 leading-relaxed">
                El contenido generado a traves de Noosfera esta sujeto a derechos de propiedad intelectual. Los 
                usuarios mantienen los derechos sobre el contenido que generan, mientras que Noosfera retiene los 
                derechos sobre la tecnologia y el sistema.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. NFTs y Monetizacion</h2>
              <p className="text-gray-600 leading-relaxed">
                Los usuarios pueden convertir sus patrones cardiacos en NFTs y monetizarlos. Al crear un NFT:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Mantienes la propiedad completa del NFT generado</li>
                <li>Noosfera cobra una comision del 10% por cada venta realizada</li>
                <li>Eres responsable de cumplir con las regulaciones fiscales de Colombia</li>
                <li>Debes declarar los ingresos obtenidos segun la normativa de la DIAN</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Limitacion de Responsabilidad</h2>
              <p className="text-gray-600 leading-relaxed">Noosfera no se hace responsable de:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Interrupciones del servicio</li>
                <li>Perdida de datos</li>
                <li>Danos indirectos o consecuentes</li>
                <li>Uso inadecuado del dispositivo de monitoreo cardiaco</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Modificaciones del Servicio</h2>
              <p className="text-gray-600 leading-relaxed">
                Nos reservamos el derecho de modificar o discontinuar el servicio en cualquier momento, con o sin 
                previo aviso. Los cambios en los terminos seran notificados a los usuarios.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Cancelacion del Servicio</h2>
              <p className="text-gray-600 leading-relaxed">
                Los usuarios pueden cancelar su cuenta en cualquier momento. Nos reservamos el derecho de suspender 
                o terminar cuentas que violen estos terminos.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Ley Aplicable</h2>
              <p className="text-gray-600 leading-relaxed">
                Estos terminos se rigen por las leyes de la Republica de Colombia y cualquier disputa sera resuelta 
                en los tribunales colombianos.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Contacto</h2>
              <p className="text-gray-600 leading-relaxed">
                Si tienes preguntas sobre estos terminos, contactanos en:
              </p>
              <p className="text-gray-600">
                Email: <a href="mailto:legal@noosfera.com" className="text-emerald-600 hover:underline">legal@noosfera.com</a>
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
