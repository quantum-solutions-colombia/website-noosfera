import { useEffect } from "react"
import { motion } from "framer-motion"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"

function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -22 }}
      viewport={{ once: false, margin: "-80px 0px -80px 0px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  )
}

export default function TermsPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }) }, [])
  return (
    <div className="min-h-screen bg-white">
      <DarkNav />

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <button onClick={() => window.history.back()}
          className="mb-8 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-2">
          ← Volver
        </button>

        <div className="text-center mb-10 pb-8 border-b border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Términos y Condiciones
          </h1>
          <p className="text-sm text-gray-400">
            Última actualización: {new Date().toLocaleDateString("es-CO")}
          </p>
        </div>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <FadeSection>
            <p className="text-center text-base text-gray-500 leading-relaxed">
              Bienvenido a Noosfera. Al acceder y utilizar este sistema, aceptas los siguientes términos y
              condiciones. Por favor, lee detenidamente este documento antes de utilizar nuestros servicios.
            </p>
          </FadeSection>

          {[
            {
              title: "1. Aceptación de los Términos",
              content: "Al utilizar Noosfera, aceptas estar sujeto a estos términos de servicio. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio.",
            },
            {
              title: "2. Descripción del Servicio",
              content: "Noosfera es un sistema de interpretación de estados emocionales que utiliza tecnología de monitoreo cardíaco e inteligencia artificial para transformar patrones de ritmo cardíaco en contenido digital y NFTs.",
            },
          ].map(({ title, content }) => (
            <FadeSection key={title}>
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-3"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>{title}</h2>
                <p>{content}</p>
              </div>
            </FadeSection>
          ))}

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>3. Registro y Cuentas de Usuario</h2>
              <ul className="space-y-2 pl-4">
                {["Debes tener al menos 18 años para utilizar este servicio", "Eres responsable de mantener la seguridad de tu cuenta", "La información proporcionada debe ser precisa y actualizada", "No debes compartir tus credenciales de acceso"].map(i => (
                  <li key={i} className="flex items-start gap-2"><span className="text-purple-500 mt-1">•</span>{i}</li>
                ))}
              </ul>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>4. Uso del Servicio</h2>
              <ul className="space-y-2 pl-4">
                {["El servicio debe utilizarse de manera ética y legal", "No debes intentar acceder a datos de otros usuarios", "No debes utilizar el servicio para fines maliciosos", "Debes seguir las pautas de uso seguro del dispositivo de monitoreo cardíaco"].map(i => (
                  <li key={i} className="flex items-start gap-2"><span className="text-purple-500 mt-1">•</span>{i}</li>
                ))}
              </ul>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>5. Propiedad Intelectual</h2>
              <p>El contenido generado a través de Noosfera está sujeto a derechos de propiedad intelectual. Los usuarios mantienen los derechos sobre el contenido que generan, mientras que Noosfera retiene los derechos sobre la tecnología y el sistema.</p>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>6. NFTs y Monetización</h2>
              <p className="mb-3">Los usuarios pueden convertir sus patrones cardíacos en NFTs y monetizarlos. Al crear un NFT:</p>
              <ul className="space-y-2 pl-4">
                {["Mantienes la propiedad completa del NFT generado", "Noosfera cobra una comisión del 10% por cada venta realizada", "Eres responsable de cumplir con las regulaciones fiscales de Colombia", "Debes declarar los ingresos obtenidos según la normativa de la DIAN"].map(i => (
                  <li key={i} className="flex items-start gap-2"><span className="text-purple-500 mt-1">•</span>{i}</li>
                ))}
              </ul>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>7. Limitación de Responsabilidad</h2>
              <p className="mb-3">Noosfera no se hace responsable de:</p>
              <ul className="space-y-2 pl-4">
                {["Interrupciones del servicio", "Pérdida de datos", "Daños indirectos o consecuentes", "Uso inadecuado del dispositivo de monitoreo cardíaco"].map(i => (
                  <li key={i} className="flex items-start gap-2"><span className="text-purple-500 mt-1">•</span>{i}</li>
                ))}
              </ul>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>8. Ley Aplicable</h2>
              <p>Estos términos se rigen por las leyes de la República de Colombia y cualquier disputa será resuelta en los tribunales colombianos.</p>
            </div>
          </FadeSection>

          <FadeSection>
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#f5f3ff" }}>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>9. Contacto</h2>
              <p>Si tienes preguntas sobre estos términos, contáctanos en:</p>
              <p className="mt-2">
                Email: <a href="mailto:legal@noosfera.com" className="text-purple-600 hover:underline font-medium">legal@noosfera.com</a><br />
                Teléfono: +57 300 123 4567
              </p>
            </div>
          </FadeSection>
        </div>
      </main>

      <Footer />
    </div>
  )
}
