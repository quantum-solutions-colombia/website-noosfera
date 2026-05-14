import { motion } from "framer-motion"
import {
  Brain, Layers, Cpu, Server, Database, GitBranch,
  Shield, Zap, Target, DollarSign, FlaskConical, Code2,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"

/* ─── DB Schema Diagram ─────────────────────────────────────── */
const tables = [
  {
    name: "users",
    color: "#7c3aed",
    fields: [
      { name: "id", type: "UUID", pk: true },
      { name: "email", type: "TEXT UNIQUE" },
      { name: "plan", type: "ENUM" },
      { name: "created_at", type: "TIMESTAMPTZ" },
      { name: "metadata", type: "JSONB" },
    ],
  },
  {
    name: "captures",
    color: "#6d28d9",
    fields: [
      { name: "id", type: "UUID", pk: true },
      { name: "user_id", type: "UUID FK", fk: true },
      { name: "pulse_vector", type: "JSONB" },
      { name: "hex_sequence", type: "TEXT" },
      { name: "duration_ms", type: "INT" },
      { name: "timestamp", type: "TIMESTAMPTZ" },
    ],
  },
  {
    name: "artworks",
    color: "#5b21b6",
    fields: [
      { name: "id", type: "UUID", pk: true },
      { name: "capture_id", type: "UUID FK", fk: true },
      { name: "prompt", type: "TEXT" },
      { name: "image_url", type: "TEXT" },
      { name: "ipfs_hash", type: "TEXT" },
      { name: "sha256", type: "TEXT" },
    ],
  },
  {
    name: "nfts",
    color: "#4c1d95",
    fields: [
      { name: "id", type: "UUID", pk: true },
      { name: "artwork_id", type: "UUID FK", fk: true },
      { name: "token_id", type: "BIGINT" },
      { name: "contract", type: "TEXT" },
      { name: "tx_hash", type: "TEXT" },
      { name: "minted_at", type: "TIMESTAMPTZ" },
    ],
  },
]

function DBSchemaTable({ table }: { table: typeof tables[0] }) {
  return (
    <div className="rounded-xl overflow-hidden border-2 min-w-[190px]" style={{ borderColor: table.color + "40" }}>
      <div className="px-4 py-2.5 text-white text-xs font-bold font-mono tracking-wide flex items-center gap-2"
        style={{ backgroundColor: table.color }}>
        <Database className="h-3.5 w-3.5" />
        {table.name}
      </div>
      <div className="bg-white divide-y divide-gray-50">
        {table.fields.map(f => (
          <div key={f.name} className="flex items-center gap-2 px-4 py-1.5 text-xs font-mono">
            <span className="w-3 flex-shrink-0 text-center">
              {f.pk ? "🔑" : f.fk ? "🔗" : ""}
            </span>
            <span className={`flex-1 ${f.pk ? "font-bold text-gray-900" : f.fk ? "text-purple-600" : "text-gray-700"}`}>
              {f.name}
            </span>
            <span className="text-gray-400 text-[10px]">{f.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DBSchema() {
  return (
    <div className="rounded-2xl bg-gray-50 p-6 overflow-x-auto">
      <p className="text-xs font-bold uppercase tracking-widest text-purple-500 mb-5">Esquema de Base de Datos</p>
      <div className="flex items-start gap-4 min-w-max">
        {tables.map((t, i) => (
          <div key={t.name} className="flex items-center gap-4">
            <DBSchemaTable table={t} />
            {i < tables.length - 1 && (
              <div className="flex items-center gap-1 text-purple-300 font-mono text-sm mt-6">
                <div className="h-0.5 w-6" style={{ backgroundColor: "#a78bfa" }} />
                <span className="text-[10px] font-bold text-purple-400">1:N</span>
                <div className="h-0.5 w-6" style={{ backgroundColor: "#a78bfa" }} />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-4 font-mono">🔑 Primary Key · 🔗 Foreign Key · RLS activo en todas las tablas</p>
    </div>
  )
}

/* ─── Image Generation Pipeline ────────────────────────────── */
const pipelineSteps = [
  {
    num: "01",
    emoji: "💓",
    title: "Pulsos Cardíacos",
    desc: "El usuario genera pulsos. El sistema captura la señal en tiempo real como una secuencia numérica de intervalos R-R en milisegundos.",
    code: "[ 842, 856, 831, 869, 844 ]",
  },
  {
    num: "02",
    emoji: "🔢",
    title: "Conversión Hexadecimal",
    desc: "Cada valor numérico se convierte a su representación hexadecimal de 16 bits, generando una cadena única por sesión.",
    code: "0x034A 0x0358 0x033F 0x0365",
  },
  {
    num: "03",
    emoji: "⬛",
    title: "Codificación Binaria",
    desc: "Los valores hexadecimales se traducen a secuencias binarias de 16 bits que forman la firma digital del latido.",
    code: "0000001101001010 0000001101011000",
  },
  {
    num: "04",
    emoji: "🔬",
    title: "Análisis de Patrones",
    desc: "El motor analiza las secuencias binarias extrayendo métricas de variabilidad, frecuencia dominante y coherencia rítmica.",
    code: "SDNN: 42.3ms · RMSSD: 38.1ms · LF/HF: 1.24",
  },
  {
    num: "05",
    emoji: "🤖",
    title: "Inteligencia Artificial",
    desc: "Los patrones extraídos se traducen a un prompt estructurado. La IA interpreta la firma del latido y genera la composición visual.",
    code: '"energía media, ritmo armónico, paleta azul-violeta..."',
  },
  {
    num: "06",
    emoji: "🎨",
    title: "Obra Digital NFT",
    desc: "La imagen generada es única e irrepetible. Se certifica con el hash SHA-256 del vector de pulsos y se registra en blockchain.",
    code: "SHA256: a4f3b7c2... → IPFS → ERC-721 mint",
  },
]

function Pipeline() {
  return (
    <div className="space-y-3">
      {pipelineSteps.map((step, i) => (
        <motion.div key={step.num}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 hover:border-purple-100 hover:shadow-sm transition-all">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: "#f5f3ff" }}>
              {step.emoji}
            </div>
            {i < pipelineSteps.length - 1 && (
              <div className="w-0.5 h-4" style={{ backgroundColor: "#e9d5ff" }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold font-mono text-purple-400">{step.num}</span>
              <h4 className="text-sm font-bold text-gray-900">{step.title}</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-2">{step.desc}</p>
            <code className="block text-[10px] font-mono text-purple-600 bg-purple-50 rounded-lg px-3 py-1.5 truncate">
              {step.code}
            </code>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ─── Timeline Sections ─────────────────────────────────────── */
const timelineSections = [
  {
    id: "overview",
    icon: Brain,
    tag: "Plataforma",
    title: "¿Qué es Noosfera?",
    items: [
      { subtitle: "Definición Central", text: "Noosfera es la primera plataforma de arte biométrico que captura los pulsos cardíacos del usuario, los procesa mediante algoritmos de análisis matemático, y convierte esa información en obras de arte digital únicas generadas por Inteligencia Artificial. Cada obra es certificada como NFT en blockchain, garantizando irrepetibilidad absoluta." },
      { subtitle: "Premisa Fundamental", text: "No hay dos seres humanos con el mismo patrón cardíaco. Esa unicidad biológica es el motor creativo de Noosfera: la variabilidad de los pulsos actúa como semilla generativa para producir arte que es literalmente una extensión del latido de quien lo crea." },
      { subtitle: "Diferenciación de Mercado", text: "A diferencia de plataformas NFT genéricas, Noosfera vincula la propiedad intelectual directamente a la biometría del creador. El resultado es un activo digital con evidencia criptográfica de origen biológico, único en el mercado latinoamericano." },
    ],
  },
  {
    id: "arquitectura",
    icon: Layers,
    tag: "Infraestructura",
    title: "Arquitectura del Sistema",
    items: [
      { subtitle: "Estructura Monorepo (pnpm Workspaces)", text: "El repositorio está organizado como un monorepo con pnpm workspaces: @workspace/noosfera (frontend React/Vite), @workspace/api-server (backend Express 5), @workspace/db (esquema Drizzle ORM), @workspace/api-spec (OpenAPI + codegen Orval). Esta arquitectura permite compartir tipos TypeScript entre capas sin duplicación." },
      { subtitle: "Flujo de Datos End-to-End", text: "Pulsos del usuario → frontend (preprocesamiento numérico) → API REST Express 5 → análisis de variabilidad → generación de prompt → Gemini API (imagen) → almacenamiento PostgreSQL + IPFS → mint NFT → entrega al usuario. Latencia objetivo de procesamiento: <50ms." },
      { subtitle: "Stack Tecnológico Completo", text: "Frontend: React 19 + Vite + TypeScript 5.9 + Tailwind CSS v4 + Framer Motion + React Three Fiber + WebGL. Backend: Node.js 24 + Express 5 + Zod v4 + Drizzle ORM. Base de datos: PostgreSQL con Row Level Security. IA: Gemini API. Build: esbuild (CJS bundle). Codegen: Orval (OpenAPI → hooks + schemas Zod)." },
    ],
  },
  {
    id: "pipeline",
    icon: Cpu,
    tag: "Motor de Generación",
    title: "Pipeline: Pulsos → Arte",
    special: "pipeline",
    items: [],
  },
  {
    id: "ia",
    icon: Cpu,
    tag: "Inteligencia Artificial",
    title: "Motor de IA Generativa",
    items: [
      { subtitle: "De Patrones a Prompt", text: "Las métricas extraídas de los pulsos (variabilidad, frecuencia dominante, coherencia rítmica) se traducen automáticamente a un prompt textual estructurado. Alta variabilidad → paleta fría, composición fluida; baja variabilidad → paleta cálida, formas geométricas. El prompt es único para cada captura." },
      { subtitle: "Generación con Gemini API", text: "Gemini API recibe el prompt y genera la imagen con los parámetros derivados del latido. El postprocesamiento incrusta los metadatos del pulso en los EXIF de la imagen (vector numérico, timestamp de captura) y genera una marca de agua criptográfica invisible (watermark LSB)." },
      { subtitle: "Garantía de Unicidad", text: "La combinación de timestamp Unix (nanosegundos), vector de pulsos de 15 métricas, semilla criptográfica CSPRNG y hash de imagen produce un identificador único con probabilidad de colisión < 2⁻¹²⁸. Ningún usuario puede generar la misma imagen dos veces. Esta unicidad es verificable on-chain." },
    ],
  },
  {
    id: "3d",
    icon: Layers,
    tag: "WebGL / Three.js",
    title: "Visualización 3D en Tiempo Real",
    items: [
      { subtitle: "Stack de Visualización", text: "React Three Fiber (wrapper React de Three.js) con WebGL renderiza visualizaciones en tiempo real de los datos de pulso. La escena 3D muestra el ritmo cardíaco como una onda dinámica en el espacio, con partículas que representan cada pulso capturado. El render corre a 60fps en hardware moderno." },
      { subtitle: "Componentes 3D", text: "SpectralAnalysis: análisis espectral renderizado como superficie 3D interactiva. PatternVisualizer: trayectoria de variabilidad en espacio tridimensional. CardiacRhythmIndicator: onda en tiempo real sincronizada con la fuente de pulsos. MentalStateSimulator: representación volumétrica del estado fisiológico inferido." },
      { subtitle: "Experiencia en Paralelo", text: "La visualización 3D opera en paralelo al pipeline de generación: mientras la IA procesa los datos, el usuario ve una representación en vivo de sus pulsos. Esto crea retroalimentación inmediata que hace tangible la conexión entre latido y obra digital antes de ver el resultado final." },
    ],
  },
  {
    id: "backend",
    icon: Server,
    tag: "Express 5",
    title: "API REST & Backend",
    items: [
      { subtitle: "Arquitectura de la API", text: "Express 5 con arquitectura en capas: Router → Controller → Service → Repository → Database. Especificación OpenAPI (Swagger) como fuente de verdad; Orval genera automáticamente los hooks React Query y los schemas Zod desde el spec. Garantiza sincronía entre frontend y backend." },
      { subtitle: "Endpoints Principales", text: "POST /api/capture — recibe vector de pulsos y retorna parámetros creativos. POST /api/generate — inicia generación con Gemini API (async). GET /api/status/:jobId — polling del estado. POST /api/nft/mint — certifica en blockchain. GET /api/user/gallery — biblioteca del usuario." },
      { subtitle: "Middleware & Seguridad", text: "Rate limiting: 10 capturas/min en plan Free, ilimitado en Premium. Validación de requests con Zod. Helmet.js para headers de seguridad. CORS configurado para el dominio de producción. Logging estructurado con Pino (JSON). Manejo centralizado de errores con códigos HTTP semánticos." },
    ],
  },
  {
    id: "database",
    icon: Database,
    tag: "PostgreSQL + Drizzle",
    title: "Base de Datos",
    special: "schema",
    items: [
      { subtitle: "Row Level Security (RLS)", text: "PostgreSQL RLS garantiza aislamiento total entre usuarios: cada query es automáticamente filtrada por user_id a nivel de base de datos, sin posibilidad de acceder a datos ajenos aunque la query lo intente. Las políticas RLS están definidas en @workspace/db/schema y se aplican en cada migración." },
      { subtitle: "Rendimiento & Migraciones", text: "Índices compuestos en (user_id, created_at) para las queries más frecuentes; latencia p99 < 10ms. Drizzle ORM genera migraciones type-safe desde el schema TypeScript. Comando: pnpm --filter @workspace/db run push (dev). Backups automáticos diarios con retención de 30 días." },
    ],
  },
  {
    id: "nft",
    icon: GitBranch,
    tag: "Web3",
    title: "NFTs & Blockchain",
    items: [
      { subtitle: "Proceso de Certificación", text: "Una vez generada la imagen: (1) se sube a IPFS (Pinata) obteniendo un CID inmutable, (2) se construyen metadatos ERC-721 con el hash biométrico incluido, (3) se suben los metadatos a IPFS, (4) se llama al smart contract para mintear el NFT con tokenURI apuntando a IPFS. El token queda en la wallet del usuario." },
      { subtitle: "Smart Contract", text: "Contrato ERC-721 en Polygon con extensiones: ERC-721Enumerable, ERC-721URIStorage, y BiometricProof (extensión propia) que almacena el hash del vector de pulsos on-chain. Este campo es evidencia inmutable de que el arte fue generado por los pulsos de un ser humano específico." },
      { subtitle: "Marketplace & Royalties", text: "Las obras se pueden listar en el marketplace interno o en OpenSea vía ERC-721. Noosfera cobra royalty del 10% en cada reventa secundaria (ERC-2981). El creador retiene el 90%. Noosfera actúa como plataforma neutral: las obras pertenecen al usuario en su wallet." },
    ],
  },
  {
    id: "seguridad",
    icon: Shield,
    tag: "Compliance",
    title: "Seguridad & Privacidad",
    items: [
      { subtitle: "Protección de Datos de Pulsos", text: "Los datos de pulsos cardíacos son datos sensibles bajo la Ley 1581 de 2012 (Habeas Data, Colombia). Noosfera aplica: cifrado AES-256 en reposo, TLS 1.3 en tránsito, seudonimización del user_id en exports, y política de retención configurable (el usuario puede eliminar sus capturas en cualquier momento)." },
      { subtitle: "Autenticación & Autorización", text: "JWT (access token 15min + refresh token 7 días) con rotación automática y detección de reutilización. 2FA opcional vía TOTP. Sesiones invalidadas al cambio de contraseña. Logs de acceso retenidos 90 días para auditoría." },
      { subtitle: "Compliance DIAN", text: "Facturación electrónica conforme a resolución DIAN 000042/2020. IVA del 19% incluido y desglosado. Retención en la fuente según tipo de persona. Reportes exportables en formato compatible con software contable colombiano." },
    ],
  },
  {
    id: "rendimiento",
    icon: Zap,
    tag: "Performance",
    title: "Rendimiento & SLA",
    items: [
      { subtitle: "Objetivos de Latencia", text: "Procesamiento de señal de pulsos: <50ms (requerimiento no negociable). Generación de imagen Gemini API: 3–8s (async con polling). Mint NFT en Polygon: 2–5s. Carga inicial LCP: <1.5s en 3G. TTI: <2s en WiFi. Consultas de base de datos p99: <10ms." },
      { subtitle: "Plan de Pruebas de Calidad", text: "Tests unitarios para cada función de análisis de pulsos (Jest, cobertura >85%). Tests de integración de API (Supertest). Tests E2E del flujo captura→arte→NFT (Playwright). Tests de carga con k6 para validar <50ms bajo 1.000 usuarios concurrentes." },
      { subtitle: "Alta Disponibilidad", text: "SLA objetivo: 99.9% uptime. Health checks cada 30s con auto-restart. Circuit breaker para Gemini API (fallback a imágenes pre-generadas si la API falla). Alertas automáticas para eventos críticos." },
    ],
  },
  {
    id: "negocio",
    icon: Target,
    tag: "Estrategia",
    title: "Modelo de Negocio",
    items: [
      { subtitle: "Segmentos de Cliente", text: "Primario: artistas digitales y coleccionistas de NFT en Colombia y LATAM (18–35 años, tech-savvy, ingreso medio-alto). Secundario: biohackers y entusiastas del autoconocimiento. Terciario: corporativos que buscan activaciones experienciales únicas (wellness corporativo, eventos de marca)." },
      { subtitle: "Propuesta de Valor", text: "Para artistas: monetiza tu biometría, no tu tiempo. Para coleccionistas: posee algo matemáticamente irrepetible con evidencia biológica de origen. Para corporativos: activa a tu audiencia con arte generativo personalizado en tiempo real." },
      { subtitle: "Canales de Adquisición", text: "Orgánico: SEO para arte generativo NFT en Colombia, comunidades de Discord y Twitter/X en LATAM. Pagado: Meta Ads. Partnerships: estudios de yoga, gimnasios premium, eventos de tech. Referidos: comisión del 15% para el primer mes de suscripción referida." },
    ],
  },
  {
    id: "monetizacion",
    icon: DollarSign,
    tag: "Finanzas",
    title: "Monetización",
    items: [
      { subtitle: "Planes de Suscripción", text: "Plan Free: $0 — 10 capturas/mes, 5 obras generadas, marketplace básico. Plan Estándar: $39.900 COP/mes — 50 NFTs, todos los estilos, exportación HD, soporte por email. Plan Premium: $89.900 COP/mes — capturas ilimitadas, API access, soporte 24/7, white-label para eventos." },
      { subtitle: "Flujos de Ingresos Adicionales", text: "Royalties: 10% sobre cada reventa secundaria de NFTs. Activaciones corporativas: desde $800.000 COP por evento. API licensing para estudios que integren el motor de Noosfera. Colecciones curadas con artistas (revenue share 60/40)." },
      { subtitle: "Proyecciones Año 1", text: "KPIs objetivo: 5.000 usuarios registrados, 800 suscriptores de pago, conversión free→paid ≥16%, LTV promedio $420.000 COP, CAC <$50.000 COP. Ingresos proyectados mes 12: $32M COP/mes. Punto de equilibrio: mes 8. Margen bruto objetivo: 72%." },
    ],
  },
  {
    id: "roadmap",
    icon: FlaskConical,
    tag: "Hoja de Ruta",
    title: "Roadmap Técnico",
    items: [
      { subtitle: "Q1–Q2 2025: MVP & Validación", text: "✓ Monorepo configurado con TypeScript + Drizzle + Express. ✓ Frontend React con visualizaciones 3D. ✓ Pipeline de generación de arte. ✓ Sistema de autenticación y planes. En progreso: análisis de pulsos en tiempo real. En progreso: integración completa con Gemini API." },
      { subtitle: "Q3 2025: Blockchain & Marketplace", text: "Smart contract ERC-721 auditado en Polygon Mainnet. Marketplace interno con búsqueda y listado de precios. Integración de wallet (MetaMask, WalletConnect). Sistema de royalties automático. Facturación electrónica DIAN. Lanzamiento público en LATAM." },
      { subtitle: "Q4 2025 & 2026: Escala & API", text: "API pública documentada para integración de terceros. App móvil nativa (React Native). Modelos de IA propios (fine-tuning). Expansión a México, Argentina y Chile. Alianzas con plataformas de salud digital." },
    ],
  },
]

/* ─── Timeline Entry ─────────────────────────────────────────── */
function TimelineEntry({ section, index }: { section: typeof timelineSections[0]; index: number }) {
  const Icon = section.icon
  const isLast = index === timelineSections.length - 1

  return (
    <div className="relative flex gap-0">
      {/* Left: vertical line + node */}
      <div className="flex flex-col items-center w-14 flex-shrink-0">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 shadow-sm"
          style={{ backgroundColor: "#7c3aed" }}>
          <Icon className="h-4.5 w-4.5 text-white h-[18px] w-[18px]" />
        </motion.div>
        {!isLast && (
          <div className="w-0.5 flex-1 mt-1" style={{ background: "linear-gradient(to bottom, #a78bfa, #e9d5ff)" }} />
        )}
      </div>

      {/* Right: content */}
      <motion.div
        className="flex-1 pb-16 pl-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{ duration: 0.5 }}>

        {/* Section header */}
        <div className="mb-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-500">
            {section.tag}
          </span>
          <h2 className="text-xl font-black text-gray-900 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {section.title}
          </h2>
        </div>

        {/* Special: pipeline */}
        {section.special === "pipeline" && <Pipeline />}

        {/* Special: db schema + items */}
        {section.special === "schema" && (
          <div className="space-y-5">
            <DBSchema />
            {section.items.map((item, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="rounded-2xl p-5 border border-gray-100 hover:border-purple-100 hover:shadow-sm transition-all bg-white">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "#f5f3ff" }}>
                    <span className="text-[9px] font-black text-purple-600">{idx + 1}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{item.subtitle}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pl-8">{item.text}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Normal items */}
        {!section.special && (
          <div className="space-y-4">
            {section.items.map((item, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="rounded-2xl p-5 border border-gray-100 hover:border-purple-100 hover:shadow-sm transition-all bg-white">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "#f5f3ff" }}>
                    <span className="text-[9px] font-black text-purple-600">{idx + 1}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{item.subtitle}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pl-8">{item.text}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <DarkNav activeLink="docs" />

      {/* Hero — pure white */}
      <section className="pt-28 pb-14 text-center bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-4">
            Documentación Técnica
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Arquitectura y Desarrollo de Noosfera
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Pipeline técnico completo: desde el latido del usuario hasta la obra digital certificada en blockchain.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="relative">
          {timelineSections.map((section, index) => (
            <TimelineEntry key={section.id} section={section} index={index} />
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: false }} transition={{ duration: 0.5 }}
          className="flex items-center justify-between pt-8 border-t border-gray-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-1">Documentación Técnica v2.0</p>
            <p className="text-sm text-gray-400">Noosfera Platform · Actualizada mayo 2025</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Code2 className="h-3.5 w-3.5" />
            <code className="font-mono">pnpm run typecheck</code>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
