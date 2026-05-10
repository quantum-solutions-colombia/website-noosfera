"use client"

import { Heart, Code2, Database, Globe, Server, Github, Briefcase, DollarSign, Cpu, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function DocsPage() {
  const router = useRouter()

  const sections = [
    {
      id: "frontend",
      title: "Frontend",
      icon: Code2,
      content: [
        {
          subtitle: "Tecnologias Principales",
          text: "Next.js 16 con React 19 y App Router. Tailwind CSS para estilos con sistema de diseno personalizado. Framer Motion para animaciones fluidas y transiciones."
        },
        {
          subtitle: "Componentes UI",
          text: "Biblioteca de componentes basada en shadcn/ui con personalizacion completa. Componentes accesibles siguiendo estandares WCAG 2.1."
        },
        {
          subtitle: "Rendimiento",
          text: "Optimizacion automatica de imagenes, code splitting, lazy loading y prefetching para una experiencia rapida en cualquier dispositivo."
        }
      ]
    },
    {
      id: "backend",
      title: "Backend",
      icon: Server,
      content: [
        {
          subtitle: "API Routes",
          text: "Endpoints serverless con Next.js API Routes. Validacion de datos, manejo de errores y rate limiting integrado."
        },
        {
          subtitle: "Autenticacion",
          text: "Sistema de autenticacion seguro con Supabase Auth. Soporte para email/password, OAuth providers y sesiones persistentes."
        },
        {
          subtitle: "Procesamiento",
          text: "Algoritmos de generacion de arte en tiempo real. Procesamiento de pulsos cardiacos con conversion a patrones visuales unicos."
        }
      ]
    },
    {
      id: "database",
      title: "Base de Datos",
      icon: Database,
      content: [
        {
          subtitle: "Supabase PostgreSQL",
          text: "Base de datos relacional con Row Level Security (RLS) habilitado. Cada usuario solo puede acceder a sus propios datos."
        },
        {
          subtitle: "Esquema de Datos",
          text: "Tablas optimizadas para usuarios, imagenes generadas, sesiones y configuraciones. Indices para consultas rapidas."
        },
        {
          subtitle: "Respaldos",
          text: "Backups automaticos diarios con retencion de 30 dias. Recuperacion point-in-time disponible en planes premium."
        }
      ]
    },
    {
      id: "hosting",
      title: "Hosting y Servidor",
      icon: Globe,
      content: [
        {
          subtitle: "Vercel Platform",
          text: "Despliegue automatico en Vercel con preview deployments para cada PR. CDN global con mas de 100 puntos de presencia."
        },
        {
          subtitle: "Edge Functions",
          text: "Funciones serverless ejecutadas en el edge para latencia minima. Auto-scaling sin configuracion."
        },
        {
          subtitle: "Dominio y SSL",
          text: "Dominio personalizado noosfera.cloud con certificado SSL automatico. HTTPS forzado en todas las conexiones."
        }
      ]
    },
    {
      id: "github",
      title: "GitHub",
      icon: Github,
      content: [
        {
          subtitle: "Repositorio",
          text: "Codigo fuente versionado en GitHub con flujo Git Flow. Ramas protegidas con requerimientos de revision."
        },
        {
          subtitle: "CI/CD",
          text: "GitHub Actions para integracion continua. Tests automaticos, linting y build verification en cada commit."
        },
        {
          subtitle: "Colaboracion",
          text: "Issues y Projects para gestion de tareas. Pull requests con templates y checklists de revision."
        }
      ]
    },
    {
      id: "negocio",
      title: "Modelo de Negocio",
      icon: Briefcase,
      content: [
        {
          subtitle: "Propuesta de Valor",
          text: "Transformar datos biometricos unicos (pulsos cardiacos) en arte digital coleccionable. Cada imagen es matematicamente irrepetible."
        },
        {
          subtitle: "Segmento de Clientes",
          text: "Artistas digitales, coleccionistas de NFTs, entusiastas de la tecnologia wearable y usuarios interesados en la cuantificacion personal."
        },
        {
          subtitle: "Canales",
          text: "Plataforma web responsive, integraciones con dispositivos wearables (Apple Watch, Fitbit, Garmin), y marketplace de NFTs."
        }
      ]
    },
    {
      id: "monetizacion",
      title: "Monetizacion Colombia",
      icon: DollarSign,
      content: [
        {
          subtitle: "Planes de Suscripcion",
          text: "Plan Free: $0 COP (10 capturas/mes). Plan Estandar: $39.900 COP/mes (50 NFTs). Plan Premium: $89.900 COP/mes (ilimitado)."
        },
        {
          subtitle: "Pasarelas de Pago",
          text: "Integracion con PSE para transferencias bancarias, tarjetas de credito/debito via Stripe, y Nequi/Daviplata para pagos moviles."
        },
        {
          subtitle: "Facturacion",
          text: "Facturacion electronica conforme a la normativa DIAN. Retencion de IVA del 19% incluida en todos los precios mostrados."
        }
      ]
    },
    {
      id: "ia",
      title: "Inteligencia Artificial",
      icon: Cpu,
      content: [
        {
          subtitle: "Generacion de Imagenes",
          text: "Algoritmo propietario de generacion de arte basado en patrones cardiacos. Cada imagen es completamente unica y nunca se repite."
        },
        {
          subtitle: "Proceso Creativo",
          text: "Los pulsos se convierten en parametros matematicos que definen colores, formas geometricas, ondas y patrones. Estilos artisticos variados aplicados aleatoriamente."
        },
        {
          subtitle: "Unicidad Garantizada",
          text: "Combinacion de timestamp, pulsos, semillas aleatorias y parametros de estilo aseguran que ninguna imagen generada sea igual a otra."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full px-4 py-6 z-50 bg-white border-b border-gray-100 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <Heart className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Noosfera
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Inicio
            </Link>
            <Link href="/company" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Quienes Somos
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Planes
            </Link>
            <Link href="/docs" className="text-emerald-600 font-medium">
              Documentacion
            </Link>
          </nav>

          <Button
            variant="outline"
            onClick={() => router.push("/auth/login")}
            className="border-emerald-500/20 hover:border-emerald-500/40"
          >
            Iniciar Sesion
          </Button>
        </div>
      </header>

      {/* Hero Section - Simple y limpio */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Centro de Documentacion
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Guia completa sobre la arquitectura tecnica, modelo de negocio y tecnologias 
              utilizadas en la plataforma Noosfera.
            </p>
          </div>
        </div>
      </section>

      {/* Documentation Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-emerald-100 p-3 rounded-xl shrink-0">
                  <section.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <span className="text-sm text-emerald-600 font-medium">Seccion {index + 1}</span>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
              </div>

              <div className="space-y-4 ml-0 md:ml-16">
                {section.content.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.subtitle}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              {index < sections.length - 1 && (
                <div className="mt-8 border-t border-gray-100" />
              )}
            </section>
          ))}

          {/* Back to Home */}
          <section className="text-center py-8 mt-8 border-t border-gray-100">
            <Button 
              variant="outline"
              onClick={() => router.push("/")}
              className="border-emerald-500/20 hover:border-emerald-500/40"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
