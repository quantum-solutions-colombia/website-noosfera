import { useEffect } from "react"
import { motion } from "framer-motion"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"

function FadeSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -22 }}
      viewport={{ once: false, margin: "-80px 0px -80px 0px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}>
      {children}
    </motion.div>
  )
}

export default function PrivacyPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }) }, [])
  return (
    <div className="min-h-screen bg-white">
      <DarkNav />

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <button onClick={() => window.history.back()}
          className="mb-8 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors">
          ← Volver
        </button>

        <div className="text-center mb-10 pb-8 border-b border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Política de Privacidad
          </h1>
          <p className="text-sm text-gray-400">
            Última actualización: {new Date().toLocaleDateString("es-CO")}
          </p>
        </div>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <FadeSection>
            <p className="text-center text-base text-gray-500 leading-relaxed">
              En Noosfera, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe cómo
              recopilamos, usamos y protegemos tu información personal y datos de pulso cardíaco.
            </p>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>1. Información que Recopilamos</h2>
              <h3 className="font-bold text-gray-800 mb-2">1.1 Información Personal</h3>
              <ul className="space-y-2 pl-4 mb-4">
                {["Nombre y apellidos", "Dirección de correo electrónico", "Fecha de nacimiento", "Información de perfil"].map(i => (
                  <li key={i} className="flex items-start gap-2"><span className="text-purple-500 mt-1">•</span>{i}</li>
                ))}
              </ul>
              <h3 className="font-bold text-gray-800 mb-2">1.2 Datos Cardíacos</h3>
              <ul className="space-y-2 pl-4">
                {["Patrones de ritmo cardíaco", "Datos de variabilidad cardíaca", "Métricas de frecuencia cardíaca", "Registros de sesiones de monitoreo"].map(i => (
                  <li key={i} className="flex items-start gap-2"><span className="text-purple-500 mt-1">•</span>{i}</li>
                ))}
              </ul>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>2. Uso de la Información</h2>
              <p className="mb-3">Utilizamos la información recopilada para:</p>
              <ul className="space-y-2 pl-4">
                {["Proporcionar y mejorar nuestros servicios", "Personalizar tu experiencia", "Procesar y generar contenido digital", "Investigación y desarrollo (datos anonimizados)", "Comunicarnos contigo sobre actualizaciones y cambios"].map(i => (
                  <li key={i} className="flex items-start gap-2"><span className="text-purple-500 mt-1">•</span>{i}</li>
                ))}
              </ul>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>3. Protección de Datos</h2>
              <p className="mb-3">Implementamos medidas de seguridad robustas:</p>
              <ul className="space-y-2 pl-4">
                {["Encriptación de extremo a extremo", "Almacenamiento seguro en servidores protegidos", "Acceso restringido al personal autorizado", "Monitoreo continuo de seguridad", "Copias de seguridad regulares"].map(i => (
                  <li key={i} className="flex items-start gap-2"><span className="text-purple-500 mt-1">•</span>{i}</li>
                ))}
              </ul>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>4. Tus Derechos</h2>
              <p className="mb-3">Como usuario, tienes derecho a:</p>
              <ul className="space-y-2 pl-4">
                {["Acceder a tu información personal", "Corregir datos inexactos", "Solicitar la eliminación de tus datos", "Exportar tus datos en un formato portable", "Retirar tu consentimiento en cualquier momento"].map(i => (
                  <li key={i} className="flex items-start gap-2"><span className="text-purple-500 mt-1">•</span>{i}</li>
                ))}
              </ul>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>5. Retención de Datos</h2>
              <p>Mantenemos tu información mientras tu cuenta esté activa o sea necesario para proporcionar servicios. Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento.</p>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>6. Menores de Edad</h2>
              <p>Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información de menores.</p>
            </div>
          </FadeSection>

          <FadeSection>
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#f5f3ff" }}>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>7. Contacto</h2>
              <p>Si tienes preguntas sobre nuestra política de privacidad, contáctanos en:</p>
              <p className="mt-2">
                Email: <a href="mailto:privacy@noosfera.com" className="text-purple-600 hover:underline font-medium">privacy@noosfera.com</a><br />
                Teléfono: +57 300 123 4567
              </p>
            </div>
          </FadeSection>
        </div>
      </main>

      <section className="py-16" style={{ backgroundColor: "#7c3aed", borderRadius: "2.5rem 2.5rem 0 0", marginTop: "0.5rem" }}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">Comienza Hoy</p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Transforma tus latidos<br />en arte digital
            </h2>
            <p className="text-purple-200 text-base leading-relaxed">
              Tus datos están protegidos con cifrado de extremo a extremo. Empieza gratis, sin tarjeta de crédito.
            </p>
            <div className="flex justify-center pt-2">
              <a href="/auth/register"
                className="px-8 py-4 font-semibold text-purple-700 text-sm tracking-wide transition-all hover:opacity-95 inline-block"
                style={{ backgroundColor: "#ffffff", borderRadius: "14px" }}>
                Regístrate ahora
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer waveBg="#7c3aed" />
    </div>
  )
}
