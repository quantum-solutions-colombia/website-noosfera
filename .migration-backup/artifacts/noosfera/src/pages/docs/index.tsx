import { useState } from "react"
import { motion } from "framer-motion"
import { Code2, Database, Globe, Server, Github, Briefcase, DollarSign, Cpu } from "lucide-react"
import { useLocation } from "wouter"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"

const sections = [
  {
    id: "frontend", title: "Frontend", icon: Code2, tag: "Interfaz",
    items: [
      { subtitle: "Tecnologías Principales", text: "Vite + React 19 con TypeScript 5. Tailwind CSS v4 para estilos con sistema de diseño personalizado. Framer Motion para animaciones fluidas y transiciones de alta calidad." },
      { subtitle: "Componentes UI", text: "Biblioteca de componentes basada en shadcn/ui con personalización completa. Componentes accesibles siguiendo estándares WCAG 2.1 con soporte total de teclado." },
      { subtitle: "Rendimiento", text: "Optimización automática con Vite, code splitting, lazy loading y prefetching para una experiencia instantánea en cualquier dispositivo y red." },
    ],
  },
  {
    id: "backend", title: "Backend", icon: Server, tag: "Servidor",
    items: [
      { subtitle: "API REST", text: "Express 5 con rutas organizadas y validación Zod. Manejo centralizado de errores, rate limiting y logging con Pino." },
      { subtitle: "Autenticación", text: "Sistema de autenticación local con localStorage para demo. Arquitectura lista para integrar JWT, OAuth y sesiones persistentes con Supabase Auth." },
      { subtitle: "Procesamiento", text: "Algoritmos de generación de arte en tiempo real. Conversión de pulsos cardíacos a patrones matemáticos únicos con más de 1.200 combinaciones posibles." },
    ],
  },
  {
    id: "database", title: "Base de Datos", icon: Database, tag: "Almacenamiento",
    items: [
      { subtitle: "PostgreSQL + Drizzle ORM", text: "Base de datos relacional con Row Level Security (RLS). Cada usuario solo accede a sus propios datos con validación a nivel de base de datos." },
      { subtitle: "Esquema Optimizado", text: "Tablas para usuarios, capturas cardíacas, NFTs generados y configuraciones. Índices para consultas en menos de 10ms." },
      { subtitle: "Respaldos", text: "Backups automáticos diarios con retención de 30 días. Recuperación point-in-time disponible en planes Premium." },
    ],
  },
  {
    id: "hosting", title: "Hosting", icon: Globe, tag: "Infraestructura",
    items: [
      { subtitle: "Vercel Platform", text: "Despliegue automático en Vercel con preview deployments para cada PR. CDN global con más de 100 puntos de presencia en todos los continentes." },
      { subtitle: "Edge Functions", text: "Funciones serverless ejecutadas en el edge para latencia mínima. Auto-scaling sin configuración manual, soporta picos de tráfico ilimitados." },
      { subtitle: "Dominio y SSL", text: "Dominio personalizado noosfera.cloud con certificado SSL automático. HTTPS forzado en todas las conexiones." },
    ],
  },
  {
    id: "github", title: "GitHub", icon: Github, tag: "Código",
    items: [
      { subtitle: "Control de Versiones", text: "Código fuente versionado con flujo Git Flow. Ramas protegidas con requerimientos de revisión de código y aprobación de equipo." },
      { subtitle: "CI/CD", text: "GitHub Actions para integración continua. Tests automáticos, linting, typecheck y build verification en cada commit para garantizar calidad." },
      { subtitle: "Colaboración", text: "Issues y Projects para gestión ágil de tareas. Pull requests con templates y checklists de revisión estandarizados." },
    ],
  },
  {
    id: "negocio", title: "Modelo de Negocio", icon: Briefcase, tag: "Estrategia",
    items: [
      { subtitle: "Propuesta de Valor", text: "Transformar datos biométricos únicos (pulsos cardíacos) en arte digital coleccionable. Cada imagen es matemáticamente irrepetible — nadie en el mundo puede tener la misma." },
      { subtitle: "Segmento de Clientes", text: "Artistas digitales, coleccionistas de NFTs, entusiastas de tecnología wearable y usuarios interesados en la cuantificación personal y el biohacking." },
      { subtitle: "Canales", text: "Plataforma web responsive, integraciones con dispositivos wearables (Apple Watch, Fitbit, Garmin) y marketplace propio de NFTs cardíacos." },
    ],
  },
  {
    id: "monetizacion", title: "Monetización", icon: DollarSign, tag: "Finanzas",
    items: [
      { subtitle: "Planes de Suscripción", text: "Plan Free: $0 COP (10 capturas/mes). Plan Estándar: $39.900 COP/mes (50 NFTs). Plan Premium: $89.900 COP/mes (ilimitado + API + soporte 24/7)." },
      { subtitle: "Pasarelas de Pago", text: "Integración con PSE, tarjetas de crédito/débito y Nequi/Daviplata para pagos móviles. Procesamiento seguro con encriptación SSL." },
      { subtitle: "Facturación", text: "Facturación electrónica conforme a normativa DIAN. Retención de IVA del 19% incluida en todos los precios mostrados al usuario." },
    ],
  },
  {
    id: "ia", title: "Inteligencia Artificial", icon: Cpu, tag: "Tecnología",
    items: [
      { subtitle: "Generación de Imágenes", text: "Algoritmo propietario de generación de arte basado en patrones cardíacos. Cada imagen es completamente única y nunca se repite en ninguna cuenta." },
      { subtitle: "Proceso Creativo", text: "Los pulsos se convierten en parámetros matemáticos que definen colores, formas geométricas, ondas y patrones. Más de 50 estilos artísticos aplicados adaptativamente." },
      { subtitle: "Unicidad Garantizada", text: "Combinación de timestamp, pulsos, semillas criptográficas y parámetros de estilo aseguran que ninguna imagen generada sea igual a otra en toda la plataforma." },
    ],
  },
]

export default function DocsPage() {
  const [, navigate] = useLocation()
  const [active, setActive] = useState("frontend")

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <DarkNav activeLink="docs" />

      {/* Hero */}
      <section className="py-20 text-center" style={{ background: "linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%)" }}>
        <div className="container mx-auto px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-4">
            Documentación Técnica
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Centro de Conocimiento
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
            Arquitectura técnica, modelo de negocio y tecnologías de la plataforma Noosfera.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 pb-24">
        <div className="max-w-6xl mx-auto flex gap-10">

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              {sections.map((s) => (
                <button key={s.id}
                  onClick={() => {
                    setActive(s.id)
                    document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all"
                  style={{
                    color: active === s.id ? "#7c3aed" : "#6b7280",
                    backgroundColor: active === s.id ? "#f5f3ff" : "transparent",
                    fontWeight: active === s.id ? "600" : "400",
                    borderLeft: active === s.id ? "2px solid #7c3aed" : "2px solid transparent",
                  }}>
                  {s.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 space-y-14 pt-6">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <motion.section key={section.id} id={section.id}
                  className="scroll-mt-28"
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }} viewport={{ once: true, margin: "-60px" }}
                  onViewportEnter={() => setActive(section.id)}>

                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#f5f3ff" }}>
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-500 mb-0.5">
                        {section.tag}
                      </p>
                      <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="rounded-xl p-5 border border-gray-100 hover:border-purple-100 hover:shadow-sm transition-all bg-white">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">{item.subtitle}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )
            })}

            <div className="pt-8 border-t border-gray-100">
              <button onClick={() => navigate("/")}
                className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                ← Volver al Inicio
              </button>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
