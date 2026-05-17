import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Brain, Layers, Cpu, Server, Database, GitBranch,
  Shield, Zap, Target, DollarSign, FlaskConical, Code2,
  Download, ChevronRight,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"

/* ─── PlantUML-style DB Schema ──────────────────────────────── */
const dbTables = [
  {
    name: "users",
    stereotype: "entity",
    pk: [{ name: "id", type: "UUID" }],
    fields: [
      { name: "email", type: "TEXT UNIQUE" },
      { name: "plan", type: "ENUM" },
      { name: "created_at", type: "TIMESTAMPTZ" },
      { name: "metadata", type: "JSONB" },
    ],
  },
  {
    name: "captures",
    stereotype: "entity",
    pk: [{ name: "id", type: "UUID" }],
    fk: [{ name: "user_id", type: "UUID" }],
    fields: [
      { name: "pulse_vector", type: "JSONB" },
      { name: "hex_sequence", type: "TEXT" },
      { name: "duration_ms", type: "INT" },
      { name: "timestamp", type: "TIMESTAMPTZ" },
    ],
  },
  {
    name: "artworks",
    stereotype: "entity",
    pk: [{ name: "id", type: "UUID" }],
    fk: [{ name: "capture_id", type: "UUID" }],
    fields: [
      { name: "prompt", type: "TEXT" },
      { name: "image_url", type: "TEXT" },
      { name: "ipfs_hash", type: "TEXT" },
      { name: "sha256", type: "TEXT" },
    ],
  },
  {
    name: "nfts",
    stereotype: "entity",
    pk: [{ name: "id", type: "UUID" }],
    fk: [{ name: "artwork_id", type: "UUID" }],
    fields: [
      { name: "token_id", type: "BIGINT" },
      { name: "contract", type: "TEXT" },
      { name: "tx_hash", type: "TEXT" },
      { name: "minted_at", type: "TIMESTAMPTZ" },
    ],
  },
]

function PlantUMLTable({ table }: { table: typeof dbTables[0] }) {
  return (
    <div className="font-mono text-xs leading-relaxed min-w-[220px]"
      style={{ border: "1.5px solid #a78bfa", borderRadius: "6px", overflow: "hidden", background: "#fff" }}>
      <div className="px-3 py-2 text-center font-bold text-white text-xs tracking-wide"
        style={{ background: "linear-gradient(90deg, #7c3aed, #6d28d9)" }}>
        &lt;&lt;entity&gt;&gt;<br />
        <span className="text-sm">{table.name}</span>
      </div>
      <div style={{ borderTop: "1.5px solid #a78bfa" }}>
        {table.pk.map(f => (
          <div key={f.name} className="flex justify-between px-3 py-1 gap-6"
            style={{ borderBottom: "1px solid #ede9fe" }}>
            <span className="text-yellow-600 font-bold">* {f.name}</span>
            <span className="text-gray-400">{f.type} &lt;PK&gt;</span>
          </div>
        ))}
        {table.fk?.map(f => (
          <div key={f.name} className="flex justify-between px-3 py-1 gap-6"
            style={{ borderBottom: "1px solid #ede9fe" }}>
            <span className="text-purple-600 font-bold"># {f.name}</span>
            <span className="text-gray-400">{f.type} &lt;FK&gt;</span>
          </div>
        ))}
        <div style={{ borderTop: "2px dashed #e9d5ff" }} />
        {table.fields.map(f => (
          <div key={f.name} className="flex justify-between px-3 py-1 gap-6"
            style={{ borderBottom: "1px solid #f5f3ff" }}>
            <span className="text-gray-700">{f.name}</span>
            <span className="text-gray-400">{f.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlantUMLRelation({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 font-mono text-purple-400 text-xs">
      <span>1</span>
      <div className="h-8 w-px" style={{ background: "#a78bfa" }} />
      <span style={{ color: "#7c3aed" }}>&#9660;</span>
      <span className="text-[9px] font-bold tracking-widest text-purple-500">{label}</span>
      <span>N</span>
    </div>
  )
}

function DBSchema() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#faf8ff", border: "1.5px solid #ede9fe" }}>
      <div className="px-4 py-2 flex items-center gap-2 font-mono text-xs"
        style={{ background: "#1e1b4b", borderBottom: "1px solid #312e81" }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-purple-300 ml-2">@startuml noosfera_db_schema</span>
      </div>
      <div className="p-6 overflow-x-auto">
        <div className="flex items-start gap-6 min-w-max">
          <PlantUMLTable table={dbTables[0]} />
          <PlantUMLRelation label="user_id" />
          <PlantUMLTable table={dbTables[1]} />
          <PlantUMLRelation label="capture_id" />
          <PlantUMLTable table={dbTables[2]} />
          <PlantUMLRelation label="artwork_id" />
          <PlantUMLTable table={dbTables[3]} />
        </div>
        <div className="mt-4 font-mono text-[10px] text-purple-400">
          @enduml · 🔑 PK = Primary Key · # FK = Foreign Key · RLS activo en todas las tablas
        </div>
      </div>
    </div>
  )
}

/* ─── Interactive AI Generation Demo ───────────────────────── */
const NFT_IMAGES = [
  "/images/nft-1.png", "/images/nft-2.png", "/images/nft-3.png",
  "/images/nft-4.png", "/images/nft-5.png", "/images/nft-6.png",
  "/images/nft-7.png", "/images/nft-8.png", "/images/nft-9.png",
  "/images/nft-10.png", "/images/collage-1.png", "/images/collage-2.png",
  "/images/collage-3.png", "/images/collage-4.png", "/images/collage-5.png",
]

const PULSE_VALUES = [842, 856, 831, 869, 844, 852]
const DEMO_STEPS = [
  {
    label: "// 1. Pulsos cardíacos capturados",
    output: `pulsos = [${PULSE_VALUES.join(", ")}]  // ms`,
    color: "#34d399",
  },
  {
    label: "// 2. Conversión hexadecimal",
    output: PULSE_VALUES.map(p => `0x${p.toString(16).toUpperCase().padStart(4, "0")}`).join("  "),
    color: "#60a5fa",
  },
  {
    label: "// 3. Codificación binaria (primeros 3)",
    output: PULSE_VALUES.slice(0, 3).map(p => p.toString(2).padStart(16, "0")).join("\n"),
    color: "#a78bfa",
  },
  {
    label: "// 4. Métricas de variabilidad extraídas",
    output: "SDNN: 42.3ms  |  RMSSD: 38.1ms  |  LF/HF: 1.24\npNN50: 18.7%  |  Coherencia: 0.82",
    color: "#fbbf24",
  },
  {
    label: "// 5. Prompt generado para IA",
    output: '"Composición armónica de trazos fluidos, paleta\nvioleta-azul profunda, energía media, alta coherencia\nrítmica, forma orgánica expansiva"',
    color: "#f472b6",
  },
  {
    label: "// 6. Obra generada por IA  ✓  NFT ready",
    output: "IMAGE",
    color: "#34d399",
  },
]

function InteractiveDemo() {
  const [step, setStep] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [randomImage, setRandomImage] = useState("")

  const runDemo = () => {
    if (isRunning) return
    setIsRunning(true)
    setStep(-1)
    setRandomImage(NFT_IMAGES[Math.floor(Math.random() * NFT_IMAGES.length)])
    let i = 0
    const interval = setInterval(() => {
      setStep(i)
      i++
      if (i >= DEMO_STEPS.length) {
        clearInterval(interval)
        setIsRunning(false)
      }
    }, 1100)
  }

  const reset = () => { setStep(-1); setIsRunning(false) }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #312e81" }}>
      <div className="px-4 py-2 flex items-center justify-between"
        style={{ background: "#1e1b4b" }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="font-mono text-xs text-purple-300">noosfera_pipeline.ts</span>
        <div className="w-16" />
      </div>

      <div className="bg-gray-950 p-5 min-h-[220px]">
        {step === -1 && !isRunning && (
          <div className="font-mono text-sm text-gray-600">
            {"// Haz clic en ▶ Simular para ver el pipeline en acción..."}<br />
            <span className="text-purple-700">{"// pulsos → hex → binario → patrones → IA → arte"}</span>
          </div>
        )}
        {DEMO_STEPS.slice(0, step + 1).map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }} className="mb-4">
            <div className="font-mono text-xs text-gray-500 mb-1">{s.label}</div>
            {s.output === "IMAGE" ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}>
                <img
                  src={randomImage}
                  alt="Obra generada por IA"
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: "180px" }}
                />
                <p className="font-mono text-xs mt-2" style={{ color: "#34d399" }}>
                  ✓ Obra digital generada por IA — NFT ready
                </p>
              </motion.div>
            ) : (
              <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap" style={{ color: s.color }}>
                {s.output}
              </pre>
            )}
          </motion.div>
        ))}
        {isRunning && step < DEMO_STEPS.length - 1 && (
          <div className="flex items-center gap-2 font-mono text-xs text-yellow-400">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            procesando...
          </div>
        )}
      </div>

      <div className="px-5 py-3 flex items-center justify-between"
        style={{ background: "#0f0d1e", borderTop: "1px solid #1e1b4b" }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {DEMO_STEPS.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{ backgroundColor: i <= step ? "#7c3aed" : "#312e81" }} />
            ))}
          </div>
          {step >= 0 && (
            <span className="font-mono text-[10px] text-purple-500">
              paso {Math.min(step + 1, DEMO_STEPS.length)}/{DEMO_STEPS.length}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {step >= 0 && !isRunning && (
            <button onClick={reset}
              className="font-mono text-xs px-3 py-1.5 rounded-lg text-purple-400 border"
              style={{ borderColor: "#312e81", background: "transparent" }}>
              ↺ Reset
            </button>
          )}
          <button onClick={runDemo} disabled={isRunning}
            className="font-mono text-xs px-4 py-1.5 rounded-lg text-white font-bold transition-all"
            style={{ backgroundColor: isRunning ? "#4c1d95" : "#7c3aed", cursor: isRunning ? "not-allowed" : "pointer" }}>
            {isRunning ? "● Procesando..." : step >= DEMO_STEPS.length - 1 ? "▶ Reiniciar" : "▶ Simular"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── PDF Download ──────────────────────────────────────────── */
function downloadPDF() {
  const printWindow = window.open("", "_blank")
  if (!printWindow) return
  printWindow.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Arquitectura y Desarrollo de Noosfera — Documentación Técnica</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&family=DM+Mono&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', Arial, sans-serif; color: #111; background: #fff; font-size: 11pt; line-height: 1.6; }
    .page { max-width: 700px; margin: 0 auto; padding: 60px 50px; }
    .header { border-bottom: 3px solid #7c3aed; padding-bottom: 24px; margin-bottom: 36px; display: flex; justify-content: space-between; align-items: flex-end; }
    .logo { font-size: 22pt; font-weight: 900; color: #7c3aed; letter-spacing: -0.5px; }
    .doc-meta { text-align: right; font-size: 9pt; color: #888; }
    h1 { font-size: 20pt; font-weight: 900; color: #111; margin-bottom: 8px; }
    .subtitle { font-size: 11pt; color: #666; margin-bottom: 40px; }
    h2 { font-size: 14pt; font-weight: 900; color: #7c3aed; margin-top: 32px; margin-bottom: 10px; border-left: 3px solid #7c3aed; padding-left: 10px; }
    h3 { font-size: 11pt; font-weight: 700; color: #222; margin-top: 14px; margin-bottom: 6px; }
    p { color: #444; margin-bottom: 8px; }
    .tag { display: inline-block; font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #7c3aed; background: #f5f3ff; padding: 2px 8px; border-radius: 4px; margin-bottom: 6px; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e9d5ff; display: flex; justify-content: space-between; font-size: 9pt; color: #aaa; }
    .badge { display: inline-block; padding: 2px 8px; border: 1px solid #a78bfa; border-radius: 4px; font-size: 8pt; color: #7c3aed; margin-right: 6px; }
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">Noosfera</div>
      <div class="doc-meta">
        Documentación Técnica v2.0<br/>
        Actualizada mayo 2025<br/>
        Confidencial — uso interno
      </div>
    </div>

    <h1>Arquitectura y Desarrollo de Noosfera</h1>
    <p class="subtitle">Pipeline técnico completo: desde el latido del usuario hasta la obra digital certificada en blockchain.</p>

    <div style="margin-bottom:20px;">
      <span class="badge">Gemini API</span>
      <span class="badge">WebGL 3D</span>
      <span class="badge">ERC-721 NFT</span>
      <span class="badge">PostgreSQL RLS</span>
      <span class="badge">Express 5</span>
    </div>

    <h2>1. ¿Qué es Noosfera?</h2>
    <div class="tag">Plataforma</div>
    <h3>Definición Central</h3>
    <p>Noosfera es la primera plataforma de arte biométrico que captura los pulsos cardíacos del usuario, los procesa mediante algoritmos de análisis matemático, y convierte esa información en obras de arte digital únicas generadas por Inteligencia Artificial (Gemini API). Cada obra es certificada como NFT en blockchain.</p>
    <h3>Premisa Fundamental</h3>
    <p>No hay dos seres humanos con el mismo patrón cardíaco. Esa unicidad biológica es el motor creativo de Noosfera: la variabilidad de los pulsos actúa como semilla generativa para producir arte literalmente único.</p>

    <h2>2. Arquitectura del Sistema</h2>
    <div class="tag">Infraestructura</div>
    <h3>Estructura Monorepo</h3>
    <p>pnpm workspaces: @workspace/noosfera (React/Vite), @workspace/api-server (Express 5), @workspace/db (Drizzle ORM), @workspace/api-spec (OpenAPI + Orval).</p>
    <h3>Stack Tecnológico</h3>
    <p>Frontend: React 19 + Vite + TypeScript 5.9 + Tailwind CSS v4 + Framer Motion + React Three Fiber. Backend: Node.js 24 + Express 5 + Zod v4. DB: PostgreSQL con RLS. IA: Gemini API.</p>

    <h2>3. Pipeline: Pulsos → Arte</h2>
    <div class="tag">Motor de Generación</div>
    <p><strong>Paso 1 — Pulsos cardíacos:</strong> Captura de señal como secuencia de intervalos R-R en ms. Ej: [842, 856, 831, 869] ms</p>
    <p><strong>Paso 2 — Hexadecimal:</strong> Conversión de cada valor. Ej: 0x034A 0x0358 0x033F 0x0365</p>
    <p><strong>Paso 3 — Binario:</strong> 0000001101001010 0000001101011000...</p>
    <p><strong>Paso 4 — Patrones:</strong> SDNN: 42.3ms · RMSSD: 38.1ms · LF/HF: 1.24 · Coherencia: 0.82</p>
    <p><strong>Paso 5 — IA:</strong> Traducción a prompt estructurado para Gemini API.</p>
    <p><strong>Paso 6 — Obra NFT:</strong> Imagen certificada con SHA-256 del vector de pulsos, subida a IPFS y minteada como ERC-721.</p>

    <h2>4. Base de Datos</h2>
    <div class="tag">PostgreSQL + Drizzle</div>
    <p><strong>Tablas:</strong> users → captures → artworks → nfts (relaciones 1:N con FK). RLS activo en todas las tablas. Cifrado AES-256 en reposo para datos sensibles. Backups automáticos con retención 30 días.</p>

    <h2>5. NFTs & Blockchain</h2>
    <div class="tag">Web3</div>
    <p>ERC-721 en Polygon. Proceso: imagen → IPFS (CID inmutable) → metadatos con hash biométrico → mint en smart contract. Royalties automáticos 10% vía ERC-2981.</p>

    <h2>6. Seguridad & Privacidad</h2>
    <div class="tag">Compliance</div>
    <p>Ley 1581/2012 (Habeas Data, Colombia). TLS 1.3 en tránsito. AES-256 en reposo. JWT con rotación automática. Facturación DIAN 000042/2020.</p>

    <h2>7. Monetización</h2>
    <div class="tag">Finanzas</div>
    <p>Free: $0 / 10 capturas mes. Estándar: $39.900 COP/mes. Premium: $89.900 COP/mes. Proyección mes 12: $32M COP/mes. Punto equilibrio: mes 8.</p>

    <div class="footer">
      <div>Noosfera Platform — Documentación Técnica v2.0</div>
      <div>privacy@noosfera.com · +57 300 123 4567</div>
    </div>
  </div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`)
  printWindow.document.close()
}

/* ─── Timeline Sections ─────────────────────────────────────── */
const timelineSections = [
  {
    id: "overview", icon: Brain, tag: "Plataforma", title: "¿Qué es Noosfera?",
    items: [
      { subtitle: "Definición Central", text: "Noosfera es la primera plataforma de arte biométrico que captura los pulsos cardíacos del usuario, los procesa mediante algoritmos de análisis matemático, y convierte esa información en obras de arte digital únicas generadas por Inteligencia Artificial. Cada obra es certificada como NFT en blockchain, garantizando irrepetibilidad absoluta." },
      { subtitle: "Premisa Fundamental", text: "No hay dos seres humanos con el mismo patrón cardíaco. Esa unicidad biológica es el motor creativo de Noosfera: la variabilidad de los pulsos actúa como semilla generativa para producir arte que es literalmente una extensión del latido de quien lo crea." },
      { subtitle: "Diferenciación de Mercado", text: "A diferencia de plataformas NFT genéricas, Noosfera vincula la propiedad intelectual directamente a la biometría del creador. El resultado es un activo digital con evidencia criptográfica de origen biológico, único en el mercado latinoamericano." },
    ],
  },
  {
    id: "arquitectura", icon: Layers, tag: "Infraestructura", title: "Arquitectura del Sistema",
    items: [
      { subtitle: "Estructura Monorepo (pnpm Workspaces)", text: "El repositorio está organizado como un monorepo con pnpm workspaces: @workspace/noosfera (frontend React/Vite), @workspace/api-server (backend Express 5), @workspace/db (esquema Drizzle ORM), @workspace/api-spec (OpenAPI + codegen Orval). Esta arquitectura permite compartir tipos TypeScript entre capas sin duplicación." },
      { subtitle: "Flujo de Datos End-to-End", text: "Pulsos del usuario → frontend (preprocesamiento numérico) → API REST Express 5 → análisis de variabilidad → generación de prompt → Gemini API (imagen) → almacenamiento PostgreSQL + IPFS → mint NFT → entrega al usuario. Latencia objetivo de procesamiento: <50ms." },
      { subtitle: "Stack Tecnológico Completo", text: "Frontend: React 19 + Vite + TypeScript 5.9 + Tailwind CSS v4 + Framer Motion + React Three Fiber + WebGL. Backend: Node.js 24 + Express 5 + Zod v4 + Drizzle ORM. Base de datos: PostgreSQL con Row Level Security. IA: Gemini API. Build: esbuild. Codegen: Orval (OpenAPI → hooks + schemas Zod)." },
    ],
  },
  {
    id: "pipeline", icon: Cpu, tag: "Motor de Generación", title: "Pipeline: Pulsos → Arte",
    special: "pipeline",
    items: [],
  },
  {
    id: "ia", icon: Cpu, tag: "Inteligencia Artificial", title: "Motor de IA Generativa",
    items: [
      { subtitle: "De Patrones a Prompt", text: "Las métricas extraídas de los pulsos (variabilidad, frecuencia dominante, coherencia rítmica) se traducen automáticamente a un prompt textual estructurado. Alta variabilidad → paleta fría, composición fluida; baja variabilidad → paleta cálida, formas geométricas. El prompt es único para cada captura." },
      { subtitle: "Generación con Gemini API", text: "Gemini API recibe el prompt y genera la imagen con los parámetros derivados del latido. El postprocesamiento incrusta los metadatos del pulso en los EXIF de la imagen (vector numérico, timestamp de captura) y genera una marca de agua criptográfica invisible (watermark LSB)." },
      { subtitle: "Garantía de Unicidad", text: "La combinación de timestamp Unix (nanosegundos), vector de pulsos de 15 métricas, semilla criptográfica CSPRNG y hash de imagen produce un identificador único con probabilidad de colisión < 2⁻¹²⁸. Ningún usuario puede generar la misma imagen dos veces. Esta unicidad es verificable on-chain." },
    ],
  },
  {
    id: "3d", icon: Layers, tag: "WebGL / Three.js", title: "Visualización 3D en Tiempo Real",
    items: [
      { subtitle: "Stack de Visualización", text: "React Three Fiber (wrapper React de Three.js) con WebGL renderiza visualizaciones en tiempo real de los datos de pulso. La escena 3D muestra el ritmo cardíaco como una onda dinámica en el espacio, con partículas que representan cada pulso capturado. El render corre a 60fps en hardware moderno." },
      { subtitle: "Componentes 3D", text: "SpectralAnalysis: análisis espectral como superficie 3D interactiva. PatternVisualizer: trayectoria de variabilidad en espacio tridimensional. CardiacRhythmIndicator: onda en tiempo real sincronizada con los pulsos. MentalStateSimulator: representación volumétrica del estado fisiológico inferido." },
      { subtitle: "Experiencia Paralela", text: "La visualización 3D opera en paralelo al pipeline de generación: mientras la IA procesa los datos, el usuario ve una representación en vivo de sus pulsos. Esto crea retroalimentación inmediata que hace tangible la conexión entre latido y obra digital antes de ver el resultado final." },
    ],
  },
  {
    id: "backend", icon: Server, tag: "Express 5", title: "API REST & Backend",
    items: [
      { subtitle: "Arquitectura de la API", text: "Express 5 con arquitectura en capas: Router → Controller → Service → Repository → Database. Especificación OpenAPI (Swagger) como fuente de verdad; Orval genera automáticamente los hooks React Query y schemas Zod desde el spec, garantizando sincronía entre frontend y backend." },
      { subtitle: "Endpoints Principales", text: "POST /api/capture — recibe vector de pulsos y retorna parámetros creativos. POST /api/generate — inicia generación con Gemini API (async). GET /api/status/:jobId — polling del estado. POST /api/nft/mint — certifica en blockchain. GET /api/user/gallery — biblioteca del usuario." },
      { subtitle: "Middleware & Seguridad", text: "Rate limiting: 10 capturas/min en Free, ilimitado en Premium. Validación con Zod. Helmet.js para headers de seguridad. CORS para dominio de producción. Logging estructurado con Pino (JSON). Manejo centralizado de errores con códigos HTTP semánticos." },
    ],
  },
  {
    id: "database", icon: Database, tag: "PostgreSQL + Drizzle", title: "Base de Datos",
    special: "schema",
    items: [
      { subtitle: "Row Level Security (RLS)", text: "PostgreSQL RLS garantiza aislamiento total entre usuarios: cada query es automáticamente filtrada por user_id a nivel de base de datos, sin posibilidad de acceder a datos ajenos. Las políticas RLS están en @workspace/db/schema y se aplican en cada migración." },
      { subtitle: "Rendimiento & Migraciones", text: "Índices compuestos en (user_id, created_at) para queries frecuentes; latencia p99 < 10ms. Drizzle ORM genera migraciones type-safe desde el schema TypeScript. Backups automáticos con retención de 30 días y recuperación point-in-time." },
    ],
  },
  {
    id: "nft", icon: GitBranch, tag: "Web3", title: "NFTs & Blockchain",
    items: [
      { subtitle: "Proceso de Certificación", text: "Una vez generada la imagen: (1) se sube a IPFS (Pinata) obteniendo un CID inmutable, (2) se construyen metadatos ERC-721 con el hash del vector de pulsos, (3) se suben los metadatos a IPFS, (4) se llama al smart contract para mintear el NFT. El token queda en la wallet del usuario." },
      { subtitle: "Smart Contract", text: "Contrato ERC-721 en Polygon con extensiones: ERC-721Enumerable, ERC-721URIStorage, y BiometricProof (extensión propia) que almacena el hash del vector de pulsos on-chain. Este campo es evidencia inmutable de que el arte fue generado por los pulsos de un ser humano específico." },
      { subtitle: "Marketplace & Royalties", text: "Las obras se listan en el marketplace interno o en OpenSea vía ERC-721. Noosfera cobra royalty del 10% en cada reventa secundaria (ERC-2981). El creador retiene el 90%. Las obras pertenecen al usuario en su wallet, no a Noosfera." },
    ],
  },
  {
    id: "seguridad", icon: Shield, tag: "Compliance", title: "Seguridad & Privacidad",
    items: [
      { subtitle: "Protección de Datos de Pulsos", text: "Los datos de pulsos cardíacos son datos sensibles bajo la Ley 1581 de 2012 (Habeas Data, Colombia). Noosfera aplica: cifrado AES-256 en reposo, TLS 1.3 en tránsito, seudonimización del user_id en exports, y política de retención configurable (el usuario puede eliminar sus capturas en cualquier momento)." },
      { subtitle: "Autenticación & Autorización", text: "JWT con access token de 15 min + refresh token de 7 días, rotación automática y detección de reutilización. 2FA opcional vía TOTP. Sesiones invalidadas al cambio de contraseña. Logs de acceso retenidos 90 días para auditoría." },
      { subtitle: "Compliance DIAN", text: "Facturación electrónica conforme a resolución DIAN 000042/2020. IVA del 19% incluido y desglosado. Retención en la fuente según tipo de persona. Reportes exportables en formato compatible con software contable colombiano." },
    ],
  },
  {
    id: "rendimiento", icon: Zap, tag: "Performance", title: "Rendimiento & SLA",
    items: [
      { subtitle: "Objetivos de Latencia", text: "Procesamiento de señal de pulsos: <50ms (requerimiento no negociable). Generación de imagen Gemini API: 3–8s (async con polling). Mint NFT en Polygon: 2–5s. Carga inicial LCP: <1.5s en 3G. Consultas de base de datos p99: <10ms." },
      { subtitle: "Plan de Pruebas", text: "Tests unitarios para funciones de análisis de pulsos (Jest, cobertura >85%). Tests de integración de API (Supertest). Tests E2E del flujo captura→arte→NFT (Playwright). Tests de carga con k6 para <50ms bajo 1.000 usuarios concurrentes." },
      { subtitle: "Alta Disponibilidad", text: "SLA objetivo: 99.9% uptime. Health checks cada 30s con auto-restart. Circuit breaker para Gemini API con fallback a imágenes pre-generadas. Alertas automáticas para eventos críticos." },
    ],
  },
  {
    id: "negocio", icon: Target, tag: "Estrategia", title: "Modelo de Negocio",
    items: [
      { subtitle: "Segmentos de Cliente", text: "Primario: artistas digitales y coleccionistas de NFT en Colombia y LATAM (18–35 años, tech-savvy, ingreso medio-alto). Secundario: biohackers y entusiastas del autoconocimiento. Terciario: corporativos que buscan activaciones experienciales únicas." },
      { subtitle: "Propuesta de Valor", text: "Para artistas: monetiza tu biometría, no tu tiempo. Para coleccionistas: posee algo matemáticamente irrepetible con evidencia biológica de origen. Para corporativos: activa a tu audiencia con arte generativo personalizado en tiempo real." },
      { subtitle: "Canales de Adquisición", text: "Orgánico: SEO para arte generativo NFT en Colombia, comunidades en LATAM. Pagado: Meta Ads. Partnerships: estudios de bienestar, gimnasios premium, eventos tech. Referidos: comisión del 15% sobre el primer mes de suscripción referida." },
    ],
  },
  {
    id: "monetizacion", icon: DollarSign, tag: "Finanzas", title: "Monetización",
    items: [
      { subtitle: "Planes de Suscripción", text: "Plan Free: $0 — 10 capturas/mes, 5 obras generadas, marketplace básico. Plan Estándar: $39.900 COP/mes — 50 NFTs, todos los estilos, exportación HD, soporte email. Plan Premium: $89.900 COP/mes — capturas ilimitadas, API access, soporte 24/7, white-label para eventos." },
      { subtitle: "Ingresos Adicionales", text: "Royalties: 10% sobre cada reventa secundaria de NFTs. Activaciones corporativas: desde $800.000 COP por evento. API licensing para estudios que integren el motor de Noosfera. Colecciones curadas con artistas (revenue share 60/40)." },
      { subtitle: "Proyecciones Año 1", text: "KPIs objetivo: 5.000 usuarios registrados, 800 suscriptores de pago, conversión free→paid ≥16%, LTV $420.000 COP, CAC <$50.000 COP. Ingresos mes 12: $32M COP/mes. Punto de equilibrio: mes 8. Margen bruto: 72%." },
    ],
  },
  {
    id: "roadmap", icon: FlaskConical, tag: "Hoja de Ruta", title: "Roadmap Técnico",
    items: [
      { subtitle: "Q1–Q2 2025: MVP & Validación", text: "✓ Monorepo configurado con TypeScript + Drizzle + Express. ✓ Frontend React con visualizaciones 3D. ✓ Pipeline de generación de arte. ✓ Autenticación y planes. En progreso: análisis de pulsos en tiempo real e integración completa con Gemini API." },
      { subtitle: "Q3 2025: Blockchain & Marketplace", text: "Smart contract ERC-721 auditado en Polygon Mainnet. Marketplace interno con búsqueda y precios. Integración de wallet (MetaMask, WalletConnect). Royalties automáticos (ERC-2981). Facturación electrónica DIAN. Lanzamiento público en LATAM." },
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
      <div className="flex flex-col items-center w-10 flex-shrink-0">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-9 h-9 rounded-full flex items-center justify-center z-10 flex-shrink-0 shadow-sm"
          style={{ backgroundColor: "#7c3aed" }}>
          <Icon className="text-white" style={{ width: 16, height: 16 }} />
        </motion.div>
        {!isLast && (
          <div className="w-px flex-1 mt-1" style={{ background: "linear-gradient(to bottom, #a78bfa, #e9d5ff)" }} />
        )}
      </div>

      <motion.div
        className="flex-1 pb-14 pl-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{ duration: 0.45 }}>

        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-500">
            {section.tag}
          </span>
          <h2 className="text-xl font-black text-gray-900 mt-0.5 leading-snug"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {section.title}
          </h2>
        </div>

        {section.special === "pipeline" && (
          <div className="space-y-4">
            <InteractiveDemo />
          </div>
        )}

        {section.special === "schema" && (
          <div className="space-y-5">
            {section.items.map((item, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }} transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="rounded-xl p-5 border border-gray-100 hover:border-purple-100 hover:shadow-sm transition-all bg-white">
                <div className="flex items-start gap-3 mb-2">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-black text-purple-600"
                    style={{ backgroundColor: "#f5f3ff" }}>{idx + 1}</span>
                  <h3 className="text-sm font-bold text-gray-900">{item.subtitle}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pl-8">{item.text}</p>
              </motion.div>
            ))}
          </div>
        )}

        {!section.special && (
          <div className="space-y-3">
            {section.items.map((item, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }} transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="rounded-xl p-5 border border-gray-100 hover:border-purple-100 hover:shadow-sm transition-all bg-white">
                <div className="flex items-start gap-3 mb-2">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-black text-purple-600"
                    style={{ backgroundColor: "#f5f3ff" }}>{idx + 1}</span>
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
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }) }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <DarkNav activeLink="docs" />

      <section className="pt-28 pb-12 bg-white border-b border-gray-100">
        <div className="px-6 md:px-12">
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
            className="text-gray-500 max-w-xl text-sm leading-relaxed">
            Pipeline técnico completo: desde el latido del usuario hasta la obra digital certificada en blockchain.
          </motion.p>
        </div>
      </section>

      <div className="px-6 md:px-12 py-14" style={{ maxWidth: "820px" }}>
        <div className="relative">
          {timelineSections.map((section, index) => (
            <TimelineEntry key={section.id} section={section} index={index} />
          ))}
        </div>

        {/* Purple CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }} transition={{ duration: 0.5 }}
          className="rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200 mb-1">
              Documentación Técnica v2.0
            </p>
            <p className="text-white font-bold text-lg leading-snug">Noosfera Platform</p>
            <p className="text-purple-200 text-sm mt-0.5">Actualizada mayo 2025 · Confidencial</p>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-purple-700 hover:bg-white/90 transition-all whitespace-nowrap"
            style={{ backgroundColor: "#ffffff" }}>
            <Download className="h-4 w-4" />
            Descargar Documentación
          </button>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
