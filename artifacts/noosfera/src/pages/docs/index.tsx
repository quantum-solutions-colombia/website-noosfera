import { useState } from "react"
import { motion } from "framer-motion"
import { Code2, Database, Globe, Server, Github, Briefcase, DollarSign, Cpu } from "lucide-react"
import { useLocation } from "wouter"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"

const sections = [
  {
    id: "frontend", title: "Frontend", icon: Code2,
    tag: "Interfaz",
    items: [
      { subtitle: "Tecnologías Principales", text: "Vite + React 19 con TypeScript 5. Tailwind CSS v4 para estilos con sistema de diseño personalizado. Framer Motion para animaciones fluidas y transiciones de alta calidad." },
      { subtitle: "Componentes UI", text: "Biblioteca de componentes basada en shadcn/ui con personalización completa. Componentes accesibles siguiendo estándares WCAG 2.1 con soporte total de teclado." },
      { subtitle: "Rendimiento", text: "Optimización automática con Vite, code splitting, lazy loading y prefetching para una experiencia instantánea en cualquier dispositivo y red." },
    ],
  },
  {
    id: "backend", title: "Backend", icon: Server,
    tag: "Servidor",
    items: [
      { subtitle: "API REST", text: "Express 5 con rutas organizadas y validación Zod. Manejo centralizado de errores, rate limiting y logging con Pino." },
      { subtitle: "Autenticación", text: "Sistema de autenticación local con localStorage para demo. Arquitectura lista para integrar JWT, OAuth y sesiones persistentes con Supabase Auth." },
      { subtitle: "Procesamiento", text: "Algoritmos de generación de arte en tiempo real. Conversión de pulsos cardíacos a patrones matemáticos únicos con más de 1.200 combinaciones posibles." },
    ],
  },
  {
    id: "database", title: "Base de Datos", icon: Database,
    tag: "Almacenamiento",
    items: [
      { subtitle: "PostgreSQL + Drizzle ORM", text: "Base de datos relacional con Row Level Security (RLS). Cada usuario solo accede a sus propios datos con validación a nivel de base de datos." },
      { subtitle: "Esquema Optimizado", text: "Tablas para usuarios, capturas cardíacas, NFTs generados y configuraciones. Índices para consultas en menos de 10ms." },
      { subtitle: "Respaldos", text: "Backups automáticos diarios con retención de 30 días. Recuperación point-in-time disponible en planes Premium." },
    ],
  },
  {
    id: "hosting", title: "Hosting", icon: Globe,
    tag: "Infraestructura",
    items: [
      { subtitle: "Vercel Platform", text: "Despliegue automático en Vercel con preview deployments para cada PR. CDN global con más de 100 puntos de presencia en todos los continentes." },
      { subtitle: "Edge Functions", text: "Funciones serverless ejecutadas en el edge para latencia mínima. Auto-scaling sin configuración manual, soporta picos de tráfico ilimitados." },
      { subtitle: "Dominio y SSL", text: "Dominio personalizado noosfera.cloud con certificado SSL automático. HTTPS forzado en todas las conexiones y HTTP Strict Transport Security." },
    ],
  },
  {
    id: "github", title: "GitHub", icon: Github,
    tag: "Código",
    items: [
      { subtitle: "Control de Versiones", text: "Código fuente versionado con flujo Git Flow. Ramas protegidas con requerimientos de revisión de código y aprobación de equipo." },
      { subtitle: "CI/CD", text: "GitHub Actions para integración continua. Tests automáticos, linting, typecheck y build verification en cada commit para garantizar calidad." },
      { subtitle: "Colaboración", text: "Issues y Projects para gestión ágil de tareas. Pull requests con templates y checklists de revisión estandarizados." },
    ],
  },
  {
    id: "negocio", title: "Modelo de Negocio", icon: Briefcase,
    tag: "Estrategia",
    items: [
      { subtitle: "Propuesta de Valor", text: "Transformar datos biométricos únicos (pulsos cardíacos) en arte digital coleccionable. Cada imagen es matemáticamente irrepetible — nadie en el mundo puede tener la misma." },
      { subtitle: "Segmento de Clientes", text: "Artistas digitales, coleccionistas de NFTs, entusiastas de tecnología wearable y usuarios interesados en la cuantificación personal y el biohacking." },
      { subtitle: "Canales", text: "Plataforma web responsive, integraciones con dispositivos wearables (Apple Watch, Fitbit, Garmin) y marketplace propio de NFTs cardíacos." },
    ],
  },
  {
    id: "monetizacion", title: "Monetización", icon: DollarSign,
    tag: "Finanzas",
    items: [
      { subtitle: "Planes de Suscripción", text: "Plan Free: $0 COP (10 capturas/mes). Plan Estándar: $39.900 COP/mes (50 NFTs). Plan Premium: $89.900 COP/mes (ilimitado + API + soporte 24/7)." },
      { subtitle: "Pasarelas de Pago", text: "Integración con PSE para transferencias bancarias, tarjetas de crédito/débito, y Nequi/Daviplata para pagos móviles. Procesamiento seguro SSL." },
      { subtitle: "Facturación", text: "Facturación electrónica conforme a normativa DIAN. Retención de IVA del 19% incluida en todos los precios mostrados al usuario." },
    ],
  },
  {
    id: "ia", title: "Inteligencia Artificial", icon: Cpu,
    tag: "Tecnología",
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
    <div className="min-h-screen" style={{ backgroundColor: "#0b0b12", color: "#f0ece0" }}>
      <DarkNav activeLink="docs" />

      {/* Hero */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,92,246,0.1), transparent)" }} />
        <div className="container mx-auto px-4 relative">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-[11px] uppercase tracking-[0.22em] text-[#8b5cf6] mb-5">
            Documentación Técnica
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-5xl md:text-6xl font-bold text-[#f0ece0] leading-tight mb-6">
            Centro de Conocimiento
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#8a8898] max-w-lg mx-auto text-base leading-relaxed">
            Arquitectura técnica, modelo de negocio y tecnologías de la plataforma Noosfera.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-6xl mx-auto flex gap-10">

          {/* Sidebar — sticky on desktop */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-28 space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActive(s.id)
                    document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all"
                  style={{
                    color: active === s.id ? "#f0ece0" : "#8a8898",
                    backgroundColor: active === s.id ? "rgba(139,92,246,0.1)" : "transparent",
                    borderLeft: active === s.id ? "2px solid #8b5cf6" : "2px solid transparent",
                  }}>
                  {s.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 space-y-16">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <motion.section key={section.id} id={section.id}
                  className="scroll-mt-28"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }} viewport={{ once: true, margin: "-80px" }}
                  onViewportEnter={() => setActive(section.id)}>

                  {/* Section header */}
                  <div className="flex items-center gap-4 mb-8 pb-4"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}>
                      <Icon className="h-5 w-5" style={{ color: "#8b5cf6" }} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] mb-0.5" style={{ color: "#8b5cf6" }}>
                        {section.tag}
                      </p>
                      <h2 className="text-xl font-semibold text-[#f0ece0]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="grid gap-4">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="rounded-xl p-5"
                        style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <h3 className="text-sm font-semibold text-[#f0ece0] mb-2">{item.subtitle}</h3>
                        <p className="text-sm text-[#8a8898] leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )
            })}

            {/* Back */}
            <div className="pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => navigate("/")}
                className="text-[11px] uppercase tracking-[0.18em] text-[#8a8898] hover:text-[#f59e0b] transition-colors">
                — Volver al Inicio
              </button>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
