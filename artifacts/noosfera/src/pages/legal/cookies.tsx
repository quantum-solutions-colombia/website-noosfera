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

export default function CookiesPage() {
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
            Política de Cookies
          </h1>
          <p className="text-sm text-gray-400">
            Última actualización: {new Date().toLocaleDateString("es-CO")}
          </p>
        </div>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <FadeSection>
            <p className="text-center text-base text-gray-500 leading-relaxed">
              En Noosfera, utilizamos cookies y tecnologías similares para mejorar tu experiencia de navegación.
              Esta política explica qué son las cookies, cómo las utilizamos y tus opciones respecto a ellas.
            </p>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>1. Qué son las Cookies</h2>
              <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Nos permiten recordar tus preferencias y mejorar tu experiencia de usuario.</p>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>2. Tipos de Cookies que Utilizamos</h2>
              <div className="space-y-5">
                {[
                  {
                    name: "2.1 Cookies Esenciales",
                    desc: "Son necesarias para el funcionamiento básico del sitio web. Sin estas cookies, algunos servicios no podrían funcionar correctamente.",
                    items: ["Autenticación y sesión de usuario", "Preferencias de seguridad", "Balanceo de carga del servidor"],
                  },
                  {
                    name: "2.2 Cookies de Preferencias",
                    desc: "Permiten recordar tus preferencias y configuraciones personalizadas.",
                    items: ["Idioma preferido", "Configuración de visualización", "Preferencias de notificaciones"],
                  },
                  {
                    name: "2.3 Cookies Analíticas",
                    desc: "Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio web.",
                    items: ["Páginas visitadas y tiempo de permanencia", "Fuentes de tráfico", "Rendimiento del sitio"],
                  },
                ].map(({ name, desc, items }) => (
                  <div key={name} className="rounded-xl p-5 border border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-900 mb-2">{name}</h3>
                    <p className="text-sm mb-3">{desc}</p>
                    <ul className="space-y-1.5">
                      {items.map(i => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">•</span>{i}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>3. Gestión de Cookies</h2>
              <p className="mb-3">Puedes gestionar tus preferencias de cookies en cualquier momento a través de:</p>
              <ul className="space-y-2 pl-4">
                {["La configuración de tu navegador", "Nuestro banner de consentimiento de cookies", "El panel de configuración de tu cuenta"].map(i => (
                  <li key={i} className="flex items-start gap-2"><span className="text-purple-500 mt-1">•</span>{i}</li>
                ))}
              </ul>
            </div>
          </FadeSection>

          <FadeSection>
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>4. Duración de las Cookies</h2>
              <p>Las cookies pueden ser de sesión (se eliminan al cerrar el navegador) o persistentes (permanecen hasta su fecha de expiración o hasta que las elimines manualmente).</p>
            </div>
          </FadeSection>

          <FadeSection>
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#f5f3ff" }}>
              <h2 className="text-lg font-black text-gray-900 mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>5. Contacto</h2>
              <p>Si tienes preguntas sobre nuestra política de cookies, contáctanos en:</p>
              <p className="mt-2">
                Email: <a href="mailto:privacy@noosfera.com" className="text-purple-600 hover:underline font-medium">privacy@noosfera.com</a>
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
              Usamos cookies para mejorar tu experiencia. Empieza gratis, sin tarjeta de crédito.
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
