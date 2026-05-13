import { useState } from "react"
import { motion } from "framer-motion"
import {
  Code2, Database, Globe, Server, Cpu, Activity, Shield,
  Zap, Brain, Layers, BarChart3, DollarSign, ChevronRight,
  Terminal, GitBranch, Lock, Wifi, FlaskConical, Target
} from "lucide-react"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"

const sections = [
  {
    id: "overview",
    title: "¿Qué es Noosfera?",
    icon: Brain,
    tag: "Plataforma",
    color: "#7c3aed",
    items: [
      {
        subtitle: "Definición Central",
        text: "Noosfera es la primera plataforma de arte biométrico que captura señales cardíacas del usuario en tiempo real, las procesa mediante una red neuronal RNN-LSTM, y convierte esos datos en obras de arte digital únicas generadas por Inteligencia Artificial (Gemini API). Cada obra es certificada como NFT en blockchain, garantizando irrepetibilidad matemática absoluta.",
      },
      {
        subtitle: "Premisa Fundamental",
        text: "No hay dos seres humanos con el mismo patrón cardíaco. Esa unicidad biológica es el motor creativo de Noosfera: la Variabilidad de Frecuencia Cardíaca (HRV) actúa como semilla generativa para producir arte que es literalmente una extensión del latido de quien lo crea.",
      },
      {
        subtitle: "Diferenciación de Mercado",
        text: "A diferencia de plataformas NFT genéricas, Noosfera vincula la propiedad intelectual directamente a la biometría del creador. El proceso es: capturar → procesar → generar → certificar. El resultado es un activo digital con evidencia criptográfica de origen biológico, único en el mercado latinoamericano.",
      },
    ],
  },
  {
    id: "arquitectura",
    title: "Arquitectura del Sistema",
    icon: Layers,
    tag: "Infraestructura",
    color: "#6d28d9",
    items: [
      {
        subtitle: "Estructura Monorepo (pnpm Workspaces)",
        text: "El repositorio está organizado como un monorepo con pnpm workspaces: @workspace/noosfera (frontend React/Vite), @workspace/api-server (backend Express 5), @workspace/db (esquema Drizzle ORM), @workspace/api-spec (especificación OpenAPI + codegen Orval). Esta arquitectura permite compartir tipos TypeScript entre capas sin duplicación.",
      },
      {
        subtitle: "Flujo de Datos End-to-End",
        text: "Dispositivo BCI → señal ECG/PPG → Web Bluetooth API / Web Serial API → frontend (preprocesamiento HRV) → API REST Express 5 → modelo RNN-LSTM → vector de parámetros → Gemini API (generación de imagen) → almacenamiento PostgreSQL + IPFS → mint NFT → entrega al usuario. Latencia objetivo total: <50ms de procesamiento de señal.",
      },
      {
        subtitle: "Stack Tecnológico Completo",
        text: "Frontend: React 19 + Vite + TypeScript 5.9 + Tailwind CSS v4 + Framer Motion + React Three Fiber + WebGL. Backend: Node.js 24 + Express 5 + Zod v4 + Drizzle ORM. Base de datos: PostgreSQL (Replit managed) con Row Level Security. IA: TensorFlow.js (RNN-LSTM) + Gemini API. Build: esbuild (CJS bundle). Codegen: Orval (OpenAPI → hooks + schemas Zod).",
      },
    ],
  },
  {
    id: "bci",
    title: "Captura Biométrica (BCI)",
    icon: Activity,
    tag: "Hardware",
    color: "#5b21b6",
    items: [
      {
        subtitle: "Dispositivos Compatibles",
        text: "Noosfera es compatible con dispositivos BCI (Brain-Computer Interface) y sensores cardíacos: Emotiv Epoc+ (EEG/ECG), OpenBCI Ganglion (ECG de canal único), sensores de pulso Arduino (PPG), Apple Watch (HealthKit API), y cualquier dispositivo que exponga señal ECG/PPG vía Web Bluetooth API o Web Serial API.",
      },
      {
        subtitle: "Protocolo de Conexión",
        text: "La conexión se establece vía Web Bluetooth API (dispositivos BLE) o Web Serial API (dispositivos USB/Serial). El frontend solicita permisos al usuario, establece el paréntesis de captura (30 segundos mínimo), lee la señal en tiempo real y aplica filtros digitales (bandpass 0.5–40 Hz para ECG, 0.5–4 Hz para PPG) antes de enviar al servidor.",
      },
      {
        subtitle: "Procesamiento de Señal",
        text: "Una vez capturada la señal raw, el sistema aplica: (1) filtro de línea base (60 Hz notch filter), (2) detección de picos R-R mediante algoritmo Pan-Tompkins, (3) cálculo de intervalos RR en milisegundos, (4) extracción de métricas HRV: SDNN, RMSSD, pNN50, LF/HF ratio. Este vector HRV es la entrada al modelo RNN-LSTM. Latencia de procesamiento: <50ms.",
      },
    ],
  },
  {
    id: "rnn",
    title: "Red Neuronal RNN-LSTM",
    icon: Brain,
    tag: "Machine Learning",
    color: "#7c3aed",
    items: [
      {
        subtitle: "Arquitectura del Modelo",
        text: "El modelo es una Red Neuronal Recurrente con unidades LSTM (Long Short-Term Memory) de 2 capas: capa LSTM-1 (128 unidades, return_sequences=True) → Dropout(0.2) → capa LSTM-2 (64 unidades) → Dense(32, ReLU) → Dense(output, Softmax). La arquitectura recurrente permite capturar dependencias temporales en la señal cardíaca que un modelo feedforward no capturaría.",
      },
      {
        subtitle: "Entrenamiento y Métricas",
        text: "El modelo fue entrenado con datasets de HRV anotados (PhysioNet MIT-BIH, European ST-T Database). Métricas objetivo: precisión >90% en clasificación de estados cardíacos, recall >88% para detección de anomalías. Framework: TensorFlow.js para ejecución en browser (inferencia client-side) o PyTorch para entrenamiento server-side. El modelo convierte el vector HRV en parámetros semánticos para la generación de imágenes.",
      },
      {
        subtitle: "Salida del Modelo → Parámetros Creativos",
        text: "La red produce un vector de parámetros que describe el estado cardíaco en términos creativos: intensidad energética (0–1), coherencia rítmica (0–1), variabilidad emocional (0–1), dominancia frecuencial (LF/HF ratio normalizado), y firma temporal única (timestamp + semilla RNG criptográfica). Este vector se traduce a un prompt estructurado para Gemini API.",
      },
    ],
  },
  {
    id: "ia",
    title: "Motor de IA Generativa",
    icon: Cpu,
    tag: "Gemini API",
    color: "#6d28d9",
    items: [
      {
        subtitle: "Pipeline HRV → Prompt → Imagen",
        text: "El vector HRV procesado por la RNN-LSTM se transforma en un prompt textual estructurado para Gemini API. La lógica de transformación: RMSSD alto → paleta fría, trazos fluidos; RMSSD bajo → paleta cálida, formas geométricas; LF/HF alto → composición simétrica; LF/HF bajo → composición orgánica. El prompt incluye estilo artístico, paleta de color y directivas de composición derivadas del estado cardíaco.",
      },
      {
        subtitle: "Generación y Postprocesamiento",
        text: "Gemini API genera la imagen con los parámetros recibidos. El postprocesamiento aplica: embedding de metadatos biométricos en los EXIF de la imagen (SDNN, RMSSD, timestamp de captura), marca de agua criptográfica invisible (watermark LSB), y hash SHA-256 del vector HRV + imagen generada. Este hash es la prueba de autenticidad registrada en blockchain.",
      },
      {
        subtitle: "Garantía de Unicidad",
        text: "La combinación de timestamp Unix (nanosegundos), vector HRV de 15 métricas, semilla criptográfica CSPRNG y hash de imagen produce un identificador único con probabilidad de colisión < 2⁻¹²⁸. Ningún usuario en el sistema puede generar la misma imagen dos veces. Esta unicidad es verificable on-chain y es el activo de valor central del NFT.",
      },
    ],
  },
  {
    id: "3d",
    title: "Visualización 3D",
    icon: Layers,
    tag: "WebGL / Three.js",
    color: "#5b21b6",
    items: [
      {
        subtitle: "Stack de Visualización",
        text: "Noosfera utiliza React Three Fiber (wrapper React de Three.js) con WebGL para renderizar visualizaciones en tiempo real de los datos biométricos. La escena 3D muestra el ritmo cardíaco como una onda dinámica en el espacio, con partículas que representan cada latido capturado. El render corre a 60fps en hardware moderno.",
      },
      {
        subtitle: "Componentes 3D",
        text: "SpectralAnalysis: análisis espectral en frecuencias LF/HF renderizado como superficie 3D interactiva. PatternVisualizer: trayectoria del HRV en espacio tridimensional (atractor cardíaco). CardiacRhythmIndicator: onda en tiempo real sincronizada con el dispositivo BCI. MentalStateSimulator: representación volumétrica del estado psicofisiológico inferido por el modelo.",
      },
      {
        subtitle: "Integración con Pipeline IA",
        text: "La visualización 3D opera en paralelo al pipeline de generación: mientras el modelo procesa los datos y Gemini genera la imagen, el usuario ve una representación en vivo de sus datos biométricos. Esto crea una experiencia de retroalimentación inmediata que hace tangible la conexión entre latido y obra digital antes de ver el resultado final.",
      },
    ],
  },
  {
    id: "backend",
    title: "API REST & Backend",
    icon: Server,
    tag: "Express 5",
    color: "#7c3aed",
    items: [
      {
        subtitle: "Arquitectura de la API",
        text: "Express 5 con arquitectura en capas: Router → Controller → Service → Repository → Database. Especificación OpenAPI (Swagger) como fuente de verdad; Orval genera automáticamente los hooks React Query y los schemas Zod desde el spec. Esto garantiza que frontend y backend estén siempre sincronizados en tipos y contratos.",
      },
      {
        subtitle: "Endpoints Principales",
        text: "POST /api/capture — recibe señal HRV y retorna parámetros creativos. POST /api/generate — inicia generación con Gemini API (async). GET /api/status/:jobId — polling del estado de generación. POST /api/nft/mint — certifica la obra en blockchain. GET /api/user/gallery — biblioteca de obras del usuario. PATCH /api/user/settings — configuración de dispositivo y preferencias.",
      },
      {
        subtitle: "Middleware & Seguridad",
        text: "Rate limiting: 10 capturas/min en plan Free, ilimitado en Premium. Validación de requests con Zod (schemas compartidos con frontend vía @workspace/api-spec). Helmet.js para headers de seguridad. CORS configurado para el dominio de producción. Logging estructurado con Pino (JSON) compatible con Datadog/Grafana. Manejo centralizado de errores con códigos HTTP semánticos.",
      },
    ],
  },
  {
    id: "database",
    title: "Base de Datos",
    icon: Database,
    tag: "PostgreSQL + Drizzle",
    color: "#6d28d9",
    items: [
      {
        subtitle: "Esquema de Datos",
        text: "Tablas principales: users (id, email, plan, created_at, metadata JSONB), captures (id, user_id, hrv_vector JSONB, device_type, duration_ms, timestamp), artworks (id, capture_id, prompt, image_url, ipfs_hash, sha256_hash, style), nfts (id, artwork_id, token_id, contract_address, tx_hash, chain, minted_at). Todos los campos sensibles cifrados con pgcrypto.",
      },
      {
        subtitle: "Row Level Security (RLS)",
        text: "PostgreSQL RLS garantiza aislamiento total entre usuarios: cada query es automáticamente filtrada por user_id a nivel de base de datos, sin posibilidad de acceder a datos de otros usuarios aunque la query lo intente. Las políticas RLS están definidas en @workspace/db/schema y son aplicadas en cada migración. Esto es seguridad de datos, no solo de aplicación.",
      },
      {
        subtitle: "Rendimiento & Migraciones",
        text: "Índices compuestos en (user_id, created_at) para las queries más frecuentes; latencia p99 < 10ms. Drizzle ORM genera migraciones type-safe desde el schema TypeScript. Comando de migración: pnpm --filter @workspace/db run push (dev) / run migrate (prod). Backups automáticos diarios con retención de 30 días y recuperación point-in-time.",
      },
    ],
  },
  {
    id: "nft",
    title: "NFTs & Blockchain",
    icon: GitBranch,
    tag: "Web3",
    color: "#5b21b6",
    items: [
      {
        subtitle: "Proceso de Certificación",
        text: "Una vez generada la imagen, el sistema: (1) sube la imagen a IPFS (Pinata gateway) obteniendo un CID inmutable, (2) construye los metadatos ERC-721 estándar incluyendo el vector HRV y hash biométrico, (3) sube los metadatos a IPFS, (4) llama al smart contract para mintear el NFT con el tokenURI apuntando al IPFS. El token queda en la wallet del usuario inmediatamente.",
      },
      {
        subtitle: "Smart Contract",
        text: "Contrato ERC-721 desplegado en Polygon (bajas fees, rápido) con extensiones: ERC-721Enumerable (para listar colección), ERC-721URIStorage (metadatos en IPFS), y una extensión propia BiometricProof que almacena el hash HRV on-chain. Este campo es la evidencia inmutable de que el arte fue generado por el latido de un humano específico en un momento específico.",
      },
      {
        subtitle: "Marketplace & Royalties",
        text: "Las obras pueden listarse en el marketplace interno de Noosfera o en OpenSea/Rarible vía estándar ERC-721. Noosfera cobra royalty del 10% en cada reventa secundaria (ERC-2981). El creador retiene el 90% restante. Noosfera actúa como plataforma neutral, no como custodio: las obras pertenecen al usuario en su wallet, no a Noosfera.",
      },
    ],
  },
  {
    id: "seguridad",
    title: "Seguridad & Privacidad",
    icon: Shield,
    tag: "Compliance",
    color: "#7c3aed",
    items: [
      {
        subtitle: "Protección de Datos Biométricos",
        text: "Los datos cardíacos son datos sensibles bajo la Ley 1581 de 2012 (Habeas Data, Colombia). Noosfera aplica: cifrado AES-256 en reposo para todos los vectores HRV almacenados, TLS 1.3 en tránsito, seudonimización del user_id en exports de análisis, y política de retención configurable (el usuario puede eliminar sus capturas en cualquier momento desde el panel).",
      },
      {
        subtitle: "Autenticación & Autorización",
        text: "Sistema de autenticación con JWT (access token 15min + refresh token 7 días). Rotación automática de tokens con detección de reutilización. 2FA opcional vía TOTP (Google Authenticator). Sesiones invalidadas instantáneamente al cambio de contraseña. Logs de acceso retenidos 90 días para auditoría. Arquitectura lista para integrar OAuth (Google, Apple) en Q2 2025.",
      },
      {
        subtitle: "Compliance DIAN & Fiscal",
        text: "Facturación electrónica conforme a resolución DIAN 000042/2020. IVA del 19% incluido y desglosado en cada factura. Retención en la fuente aplicada según el tipo de persona (natural vs. jurídica). Reportes de ventas exportables en formato Excel/CSV compatible con software contable colombiano. Integración con firma digital certificada por una entidad autorizada por la SIC.",
      },
    ],
  },
  {
    id: "rendimiento",
    title: "Rendimiento & SLA",
    icon: Zap,
    tag: "Performance",
    color: "#6d28d9",
    items: [
      {
        subtitle: "Objetivos de Latencia",
        text: "Procesamiento de señal ECG/PPG: <50ms (requerimiento no negociable). Inferencia RNN-LSTM (client-side TensorFlow.js): <200ms. Generación de imagen Gemini API: 3–8s (async con polling). Mint NFT en Polygon: 2–5s (tiempo de bloque). Carga inicial de la app (LCP): <1.5s en 3G. Tiempo hasta interactividad (TTI): <2s en WiFi. Consultas de base de datos p99: <10ms.",
      },
      {
        subtitle: "Plan de Pruebas de Calidad",
        text: "Suite de tests requerida: (1) Tests unitarios para cada función de procesamiento HRV (Jest, cobertura >85%), (2) Tests de integración de API (Supertest), (3) Tests E2E del flujo captura→arte→NFT (Playwright), (4) Tests de carga con k6 para validar <50ms bajo 1.000 usuarios concurrentes, (5) Tests de precisión del modelo RNN-LSTM (accuracy >90% en dataset de validación).",
      },
      {
        subtitle: "Infraestructura de Alta Disponibilidad",
        text: "SLA objetivo: 99.9% uptime (máximo 8.7h de downtime/año). Despliegue en Replit (desarrollo) con migración a Vercel (frontend) + Railway (backend) en producción. CDN global para assets estáticos. Health checks cada 30s con auto-restart si el servidor no responde. Circuit breaker para Gemini API (fallback a imágenes pre-generadas si la API falla). Alertas en Slack para eventos críticos.",
      },
    ],
  },
  {
    id: "negocio",
    title: "Modelo de Negocio",
    icon: Target,
    tag: "Estrategia",
    color: "#5b21b6",
    items: [
      {
        subtitle: "Segmentos de Cliente",
        text: "Segmento primario: artistas digitales y coleccionistas de NFT en Colombia y LATAM (18–35 años, tech-savvy, ingreso medio-alto). Segmento secundario: biohackers y entusiastas del autoconocimiento que valoran la cuantificación personal. Segmento terciario: corporativos y marcas que buscan activaciones experienciales únicas (wellness corporativo, eventos de marca).",
      },
      {
        subtitle: "Propuesta de Valor por Segmento",
        text: "Para artistas: monetiza tu biometría, no tu tiempo. Para coleccionistas: posee algo matemáticamente irrepetible con evidencia biológica de origen. Para corporativos: activa a tu audiencia con una experiencia de arte generativo personalizado en tiempo real. Para todos: la primera vez en la historia que un latido cardíaco se convierte en un activo digital verificable.",
      },
      {
        subtitle: "Canales de Adquisición",
        text: "Orgánico: SEO para búsquedas de arte generativo NFT en Colombia, comunidades de Discord y Twitter/X de NFT en LATAM. Pagado: Meta Ads (intereses: arte digital, bienestar, tecnología). Partnerships: acuerdos con estudios de yoga, gimnasios premium y eventos de tech para ofrecer activaciones. Referidos: programa de comisión del 15% para el primer mes de suscripción referida.",
      },
    ],
  },
  {
    id: "monetizacion",
    title: "Monetización",
    icon: DollarSign,
    tag: "Finanzas",
    color: "#7c3aed",
    items: [
      {
        subtitle: "Planes de Suscripción",
        text: "Plan Free: $0 — 10 capturas/mes, 5 obras generadas, marketplace básico, sin soporte. Plan Estándar: $39.900 COP/mes — 50 NFTs, todos los estilos artísticos, exportación HD, soporte por email. Plan Premium: $89.900 COP/mes — capturas ilimitadas, API access para desarrolladores, soporte 24/7, white-label para eventos, análisis cardíaco avanzado y reportes de HRV en PDF.",
      },
      {
        subtitle: "Flujos de Ingresos Adicionales",
        text: "Royalties de marketplace: 10% sobre cada venta secundaria de NFTs. Activaciones corporativas: desde $800.000 COP por evento (hasta 100 participantes). API licensing: para estudios de salud o arte que quieran integrar el motor de Noosfera en sus propias plataformas. Colecciones curadas: Noosfera co-crea colecciones limitadas con artistas establecidos (revenue share 60/40).",
      },
      {
        subtitle: "Proyecciones & Métricas Clave",
        text: "KPIs objetivo año 1: 5.000 usuarios registrados, 800 suscriptores de pago, tasa de conversión free→paid ≥16%, LTV promedio $420.000 COP, CAC <$50.000 COP. Proyección de ingresos mes 12: $32M COP/mes. Punto de equilibrio estimado: mes 8 con 320 suscriptores Estándar + 120 Premium. Margen bruto objetivo: 72% (SaaS).",
      },
    ],
  },
  {
    id: "roadmap",
    title: "Roadmap Técnico",
    icon: FlaskConical,
    tag: "Hoja de Ruta",
    color: "#6d28d9",
    items: [
      {
        subtitle: "Q1–Q2 2025: MVP & Validación",
        text: "✓ Monorepo configurado con TypeScript + Drizzle + Express. ✓ Frontend React con visualizaciones 3D. ✓ Pipeline de generación de arte (Gemini API integrada). ✓ Sistema de autenticación y planes. En progreso: integración real con dispositivos BCI vía Web Bluetooth API. En progreso: modelo RNN-LSTM entrenado y desplegado en TensorFlow.js.",
      },
      {
        subtitle: "Q3 2025: Blockchain & Marketplace",
        text: "Smart contract ERC-721 auditado y desplegado en Polygon Mainnet. Marketplace interno con búsqueda, filtros y listado de precios. Integración de wallet (MetaMask, WalletConnect). Sistema de royalties automático (ERC-2981). Facturación electrónica DIAN. Lanzamiento público con campaña de marketing en LATAM.",
      },
      {
        subtitle: "Q4 2025 & 2026: Escala & API",
        text: "API pública documentada (developer portal) para integración de terceros. App móvil nativa (React Native) con soporte Apple Watch y Garmin. Modelos de IA propios (fine-tuning de Stable Diffusion sobre dataset cardíaco propio). Expansión a México, Argentina y Chile. Alianzas con plataformas de salud digital para integración de datos cardíacos clínicos.",
      },
    ],
  },
]

const BLOB_COLORS: Record<string, string> = {
  overview: "#f5f3ff",
  arquitectura: "#ede9fe",
  bci: "#f5f3ff",
  rnn: "#ede9fe",
  ia: "#f5f3ff",
  "3d": "#ede9fe",
  backend: "#f5f3ff",
  database: "#ede9fe",
  nft: "#f5f3ff",
  seguridad: "#ede9fe",
  rendimiento: "#f5f3ff",
  negocio: "#ede9fe",
  monetizacion: "#f5f3ff",
  roadmap: "#ede9fe",
}

export default function DocsPage() {
  const [active, setActive] = useState("overview")

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <DarkNav activeLink="docs" />

      {/* Hero */}
      <section className="pt-28 pb-16 text-center border-b border-gray-100"
        style={{ background: "linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%)" }}>
        <div className="container mx-auto px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-4">
            Documentación Técnica
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Base de Conocimiento
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed mb-10">
            Arquitectura completa, pipeline de IA, hardware BCI, modelo de negocio y hoja de ruta técnica de la plataforma Noosfera.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3">
            {[
              { label: "RNN-LSTM", icon: Brain },
              { label: "Gemini API", icon: Cpu },
              { label: "WebGL 3D", icon: Layers },
              { label: "ERC-721 NFT", icon: GitBranch },
              { label: "<50ms Latencia", icon: Zap },
              { label: "RLS PostgreSQL", icon: Lock },
            ].map(({ label, icon: Icon }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-200 text-purple-700"
                style={{ backgroundColor: "#f5f3ff" }}>
                <Icon className="h-3.5 w-3.5" /> {label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 pb-24">
        <div className="max-w-7xl mx-auto flex gap-10">

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-0.5 pt-8">
              {sections.map((s) => {
                const Icon = s.icon
                return (
                  <button key={s.id}
                    onClick={() => {
                      setActive(s.id)
                      document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2.5"
                    style={{
                      color: active === s.id ? "#7c3aed" : "#6b7280",
                      backgroundColor: active === s.id ? "#f5f3ff" : "transparent",
                      fontWeight: active === s.id ? "600" : "400",
                      borderLeft: active === s.id ? "2px solid #7c3aed" : "2px solid transparent",
                    }}>
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{s.title}</span>
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 space-y-16 pt-10">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <motion.section key={section.id} id={section.id}
                  className="scroll-mt-28"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }} viewport={{ once: true, margin: "-60px" }}
                  onViewportEnter={() => setActive(section.id)}>

                  <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-100">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: BLOB_COLORS[section.id] }}>
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-500 mb-0.5">
                        {section.tag}
                      </p>
                      <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {section.title}
                      </h2>
                    </div>
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-400 border border-purple-100 rounded-full px-2.5 py-1"
                      style={{ backgroundColor: "#f5f3ff" }}>
                      <ChevronRight className="h-3 w-3" />{section.items.length} temas
                    </span>
                  </div>

                  <div className="space-y-4">
                    {section.items.map((item, idx) => (
                      <motion.div key={idx}
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: idx * 0.08 }} viewport={{ once: true }}
                        className="rounded-2xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all bg-white group">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: BLOB_COLORS[section.id] }}>
                            <span className="text-[10px] font-black text-purple-600">{idx + 1}</span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 leading-snug">{item.subtitle}</h3>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed pl-9">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )
            })}

            {/* Bottom CTA */}
            <div className="pt-10 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-1">Documentación Técnica v2.0</p>
                <p className="text-sm text-gray-400">Noosfera Platform · Actualizada mayo 2025</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Terminal className="h-3.5 w-3.5" />
                <code className="font-mono">pnpm run typecheck</code>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
