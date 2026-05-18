import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Brain, Layers, Cpu, Server, Database, GitBranch,
  Shield, Zap, Target, DollarSign, FlaskConical, Code2,
  Download, ChevronRight,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { DarkNav } from "@/components/dark-nav"
import { jsPDF } from "jspdf"

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
  "/images/pipeline-ai-battle.png",
  "/images/pipeline-forest.png",
  "/images/pipeline-castle.png",
  "/images/pipeline-ship.png",
  "/images/pipeline-pyramids.png",
  "/images/pipeline-ocean.png",
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
                  className="w-full rounded-xl"
                  style={{ display: "block", width: "100%", height: "auto", objectFit: "contain" }}
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
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentW = pageW - margin * 2
  let y = margin

  const purple = [124, 58, 237] as [number, number, number]
  const darkGray = [17, 17, 17] as [number, number, number]
  const midGray = [68, 68, 68] as [number, number, number]
  const lightGray = [170, 170, 170] as [number, number, number]

  const checkNewPage = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage()
      y = margin
      addPageFooter()
    }
  }

  const addPageFooter = () => {
    const pg = doc.getNumberOfPages()
    doc.setFontSize(8)
    doc.setTextColor(...lightGray)
    doc.text("Noosfera Platform — Documentación Técnica v2.0", margin, pageH - 10)
    doc.text(`Página ${pg}`, pageW - margin, pageH - 10, { align: "right" })
  }

  const addSectionTag = (tag: string) => {
    checkNewPage(10)
    doc.setFontSize(7)
    doc.setTextColor(...purple)
    doc.setFont("helvetica", "bold")
    doc.text(tag.toUpperCase(), margin, y)
    y += 6
  }

  const addHeading2 = (text: string) => {
    checkNewPage(14)
    doc.setDrawColor(...purple)
    doc.setLineWidth(0.8)
    doc.line(margin, y + 1, margin, y + 6)
    doc.setFontSize(13)
    doc.setTextColor(...purple)
    doc.setFont("helvetica", "bold")
    doc.text(text, margin + 3, y + 5)
    y += 12
  }

  const addHeading3 = (text: string) => {
    checkNewPage(10)
    doc.setFontSize(10)
    doc.setTextColor(...darkGray)
    doc.setFont("helvetica", "bold")
    doc.text(text, margin, y)
    y += 6
  }

  const addParagraph = (text: string) => {
    checkNewPage(8)
    doc.setFontSize(9.5)
    doc.setTextColor(...midGray)
    doc.setFont("helvetica", "normal")
    const lines = doc.splitTextToSize(text, contentW) as string[]
    lines.forEach((line: string) => {
      checkNewPage(6)
      doc.text(line, margin, y)
      y += 5.5
    })
    y += 2
  }

  const addBulletLine = (label: string, value: string) => {
    checkNewPage(8)
    doc.setFontSize(9.5)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...darkGray)
    const labelText = `${label}: `
    doc.text(labelText, margin, y)
    const labelW = doc.getTextWidth(labelText)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...midGray)
    const rest = doc.splitTextToSize(value, contentW - labelW) as string[]
    doc.text(rest[0] || "", margin + labelW, y)
    y += 5.5
    for (let i = 1; i < rest.length; i++) {
      checkNewPage(5.5)
      doc.text(rest[i], margin + labelW, y)
      y += 5.5
    }
  }

  /* ── COVER PAGE ── */
  doc.setFillColor(...purple)
  doc.rect(0, 0, pageW, 60, "F")

  doc.setFontSize(28)
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.text("Noosfera", margin, 32)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(220, 200, 255)
  doc.text("Documentación Técnica v2.0  ·  Actualizada mayo 2026  ·  Confidencial — uso interno", margin, 42)

  doc.setDrawColor(220, 200, 255)
  doc.setLineWidth(0.5)
  doc.line(margin, 48, pageW - margin, 48)

  y = 75
  doc.setFontSize(18)
  doc.setTextColor(...darkGray)
  doc.setFont("helvetica", "bold")
  doc.text("Arquitectura y Desarrollo de Noosfera", margin, y)
  y += 9

  doc.setFontSize(10.5)
  doc.setTextColor(...midGray)
  doc.setFont("helvetica", "normal")
  const subtitle = "Pipeline técnico completo: desde el latido del usuario hasta la obra digital certificada en blockchain."
  const subLines = doc.splitTextToSize(subtitle, contentW) as string[]
  subLines.forEach((l: string) => { doc.text(l, margin, y); y += 6 })
  y += 8

  const badges = ["Gemini API", "WebGL 3D", "ERC-721 NFT", "PostgreSQL RLS", "Express 5"]
  let bx = margin
  badges.forEach(b => {
    doc.setFillColor(245, 243, 255)
    doc.setDrawColor(...purple)
    doc.setLineWidth(0.3)
    doc.roundedRect(bx, y - 4, doc.getTextWidth(b) + 6, 7, 1.5, 1.5, "FD")
    doc.setFontSize(7.5)
    doc.setTextColor(...purple)
    doc.setFont("helvetica", "bold")
    doc.text(b, bx + 3, y + 0.5)
    bx += doc.getTextWidth(b) + 10
  })
  y += 16

  doc.setDrawColor(233, 213, 255)
  doc.setLineWidth(0.4)
  doc.line(margin, y, pageW - margin, y)
  y += 10

  /* ── SECTION 1 ── */
  addSectionTag("Plataforma")
  addHeading2("1. ¿Qué es Noosfera?")
  addHeading3("Definición Central")
  addParagraph("Noosfera es la primera plataforma de arte biométrico que captura los pulsos cardíacos del usuario, los procesa mediante algoritmos de análisis matemático, y convierte esa información en obras de arte digital únicas generadas por Inteligencia Artificial (Gemini API). Cada obra es certificada como NFT en blockchain, garantizando irrepetibilidad absoluta.")
  addHeading3("Premisa Fundamental")
  addParagraph("No hay dos seres humanos con el mismo patrón cardíaco. Esa unicidad biológica es el motor creativo de Noosfera: la variabilidad de los pulsos actúa como semilla generativa para producir arte que es literalmente una extensión del latido de quien lo crea.")
  addHeading3("Diferenciación de Mercado")
  addParagraph("A diferencia de plataformas NFT genéricas, Noosfera vincula la propiedad intelectual directamente a la biometría del creador. El resultado es un activo digital con evidencia criptográfica de origen biológico, único en el mercado latinoamericano.")

  /* ── SECTION 2 ── */
  y += 4
  addSectionTag("Infraestructura")
  addHeading2("2. Arquitectura del Sistema")
  addHeading3("Estructura Monorepo (pnpm workspaces)")
  addBulletLine("@workspace/noosfera", "React 19 + Vite + TypeScript 5.9 + Tailwind CSS v4 + Framer Motion")
  addBulletLine("@workspace/api-server", "Express 5 + Zod v4 + Pino logging")
  addBulletLine("@workspace/db", "Drizzle ORM + PostgreSQL con Row-Level Security")
  addBulletLine("@workspace/api-spec", "OpenAPI 3.1 + Orval para generación de hooks y esquemas Zod")
  addHeading3("Stack Tecnológico Completo")
  addParagraph("Frontend: React 19 + Vite + TypeScript 5.9 + Tailwind CSS v4 + Framer Motion + React Three Fiber. Backend: Node.js 24 + Express 5 + Zod v4. Base de datos: PostgreSQL con RLS habilitado. Inteligencia Artificial: Gemini API (Google). Blockchain: Polygon (ERC-721, ERC-2981). Build: esbuild (CJS bundle).")
  addHeading3("Patrones de Arquitectura")
  addParagraph("API-first design con contrato OpenAPI como fuente de verdad. Validación en ambos extremos (Zod en frontend y backend). Separación estricta de responsabilidades con monorepo. JWT stateless con rotación automática cada 24h.")

  /* ── SECTION 3 ── */
  y += 4
  addSectionTag("Motor de Generación")
  addHeading2("3. Pipeline: Pulsos → Arte")
  addBulletLine("Paso 1 — Captura biométrica", "Secuencia de intervalos R-R en ms capturada vía sensor o entrada manual. Ej: [842, 856, 831, 869] ms. Validación: 40-200 BPM, 1-8 valores.")
  addBulletLine("Paso 2 — Conversión hexadecimal", "Cada valor se convierte a representación hex de 16 bits. Ej: 842ms → 0x034A, 856ms → 0x0358, 831ms → 0x033F, 869ms → 0x0365.")
  addBulletLine("Paso 3 — Codificación binaria", "Representación binaria completa: 0000001101001010 0000001101011000 0000001100111111 0000001101100101.")
  addBulletLine("Paso 4 — Métricas de variabilidad", "SDNN: 42.3ms | RMSSD: 38.1ms | LF/HF: 1.24 | pNN50: 18.7% | Coherencia: 0.82. Estas métricas determinan el estado emocional inferido.")
  addBulletLine("Paso 5 — Generación del prompt", "Traducción a prompt estructurado para Gemini API. Ejemplo: 'Composicion armonica de trazos fluidos, paleta violeta-azul profunda, energia media, alta coherencia ritmica, forma organica expansiva'.")
  addBulletLine("Paso 6 — Obra certificada NFT", "Imagen generada por IA certificada con SHA-256 del vector biométrico, subida a IPFS (CID inmutable) y minteada como token ERC-721 en Polygon con metadatos biométricos.")

  /* ── SECTION 4 ── */
  y += 4
  addSectionTag("PostgreSQL + Drizzle ORM")
  addHeading2("4. Base de Datos")
  addHeading3("Esquema de Tablas")
  addBulletLine("users", "id, email, name, avatar, plan, created_at. RLS: el usuario solo ve sus propios datos.")
  addBulletLine("captures", "id, user_id (FK), pulse_values (jsonb), hex_values, binary_values, sdnn, rmssd, lf_hf, coherence, created_at.")
  addBulletLine("artworks", "id, capture_id (FK), user_id (FK), image_url, ipfs_cid, prompt, style, energy, coherence, nft_ready, created_at.")
  addBulletLine("nfts", "id, artwork_id (FK), user_id (FK), token_id, contract_address, tx_hash, opensea_url, created_at.")
  addHeading3("Seguridad de Datos")
  addParagraph("Row-Level Security (RLS) activo en todas las tablas. Cifrado AES-256 en reposo para datos biométricos sensibles. Backups automáticos con retención de 30 días. Índices en columnas de búsqueda frecuente.")

  /* ── SECTION 5 ── */
  y += 4
  addSectionTag("Web3 — Blockchain")
  addHeading2("5. NFTs & Blockchain")
  addParagraph("Implementación sobre Polygon (PoS) para minimizar gas fees. Contrato inteligente ERC-721 con extensión ERC-2981 para royalties automáticos.")
  addHeading3("Flujo de Minting")
  addBulletLine("1. Generación", "Imagen generada por Gemini API y almacenada temporalmente.")
  addBulletLine("2. IPFS Upload", "Imagen subida a IPFS via Pinata. CID generado es inmutable y permanente.")
  addBulletLine("3. Metadatos", "JSON con CID de imagen, hash biométrico SHA-256, métricas HRV, timestamp, propietario.")
  addBulletLine("4. Minting", "Llamada al smart contract con tokenURI apuntando a metadatos en IPFS.")
  addBulletLine("5. Royalties", "10% automático en cada reventa vía ERC-2981. Distribuido al creador original.")
  addHeading3("Verificación de Autenticidad")
  addParagraph("Cada NFT incluye el hash SHA-256 del vector de pulsos cardíacos en sus metadatos on-chain, permitiendo verificación criptográfica de que el arte fue generado a partir de los pulsos biológicos del creador.")

  /* ── SECTION 6 ── */
  y += 4
  addSectionTag("Compliance & Seguridad")
  addHeading2("6. Seguridad & Privacidad")
  addHeading3("Marco Legal")
  addParagraph("Cumplimiento Ley 1581/2012 (Habeas Data, Colombia). Registro ante SIC como responsable de tratamiento de datos personales sensibles (biométricos). Facturación electrónica DIAN resolución 000042/2020.")
  addHeading3("Medidas de Seguridad Técnica")
  addBulletLine("Tránsito", "TLS 1.3 obligatorio en todas las conexiones. HSTS activado.")
  addBulletLine("Reposo", "AES-256-GCM para datos biométricos almacenados.")
  addBulletLine("Autenticación", "JWT con rotación automática cada 24h. Refresh tokens con rotación. Rate limiting por IP y por usuario.")
  addBulletLine("Infraestructura", "Firewall de aplicaciones (WAF). Escaneo de vulnerabilidades mensual. Penetration testing trimestral.")
  addHeading3("Derechos del Usuario")
  addParagraph("Los usuarios pueden solicitar acceso, corrección, supresión o portabilidad de sus datos biométricos en cualquier momento. Los datos son eliminados definitivamente 30 días después de la solicitud de baja.")

  /* ── SECTION 7 ── */
  y += 4
  addSectionTag("Finanzas & Crecimiento")
  addHeading2("7. Monetización")
  addHeading3("Planes de Suscripción")
  addBulletLine("Free", "$0 / mes · 10 capturas/mes · 2 NFTs/mes · galería pública.")
  addBulletLine("Estándar", "$39.900 COP/mes · 100 capturas/mes · 20 NFTs/mes · analytics básico · sin marca de agua.")
  addBulletLine("Premium", "$89.900 COP/mes · capturas ilimitadas · NFTs ilimitados · analytics avanzado · API access · soporte prioritario.")
  addHeading3("Proyecciones Financieras")
  addBulletLine("Mes 3", "200 usuarios activos. MRR: $4.5M COP.")
  addBulletLine("Mes 6", "800 usuarios activos. MRR: $16M COP.")
  addBulletLine("Mes 8", "Punto de equilibrio. 1.200 usuarios activos.")
  addBulletLine("Mes 12", "2.500 usuarios activos. MRR: $32M COP. CAC recuperado en mes 4.")
  addHeading3("Estrategia de Crecimiento")
  addParagraph("Canal principal: comunidades de arte digital en Instagram y TikTok (LATAM). Partnerships con plataformas de bienestar y wellness. Programa de referidos con 30 días Premium gratis. Presencia en Art Basel Miami y eventos NFT de Bogotá y Medellín.")

  /* ── FOOTER on last page ── */
  addPageFooter()

  doc.save("Noosfera-Documentacion-Tecnica-v2.0.pdf")
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
function TimelineEntry({ section, index, noLine }: { section: typeof timelineSections[0]; index: number; noLine?: boolean }) {
  const Icon = section.icon
  const isLast = noLine || index === timelineSections.length - 1

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
                  <h3 className="text-sm font-bold text-gray-900"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.subtitle}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pl-8"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.text}</p>
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
                  <h3 className="text-sm font-bold text-gray-900"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.subtitle}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pl-8"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.text}</p>
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
        <div className="px-6 md:px-12 text-center">
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
            className="text-gray-500 max-w-xl text-sm leading-relaxed mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Pipeline técnico completo: desde el latido del usuario hasta la obra digital certificada en blockchain.
          </motion.p>
        </div>
      </section>

      {/* Mobile: single column */}
      <div className="md:hidden px-6 py-14">
        <div className="relative">
          {timelineSections.map((section, index) => (
            <TimelineEntry key={section.id} section={section} index={index} />
          ))}
        </div>
      </div>

      {/* Desktop: alternating left-right two-column layout */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-x-10 px-10 lg:px-16 py-14">
        {/* Left column: even sections (0, 2, 4…) */}
        <div className="relative">
          {timelineSections.filter((_, i) => i % 2 === 0).map((section, colIdx) => {
            const realIndex = colIdx * 2
            const isLastInCol = colIdx === Math.ceil(timelineSections.length / 2) - 1
            return <TimelineEntry key={section.id} section={section} index={realIndex} noLine={isLastInCol} />
          })}
        </div>
        {/* Right column: odd sections (1, 3, 5…) — offset by 1 for stagger */}
        <div className="relative mt-28">
          {timelineSections.filter((_, i) => i % 2 !== 0).map((section, colIdx) => {
            const realIndex = colIdx * 2 + 1
            const isLastInCol = colIdx === Math.floor(timelineSections.length / 2) - 1
            return <TimelineEntry key={section.id} section={section} index={realIndex} noLine={isLastInCol} />
          })}
        </div>
      </div>

      {/* Purple CTA Footer — full-width, uniform with other pages */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="py-16 text-center"
        style={{ backgroundColor: "#7c3aed", borderRadius: "2.5rem 2.5rem 0 0" }}>
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Documentación Técnica v2.0
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Noosfera Platform
            </h2>
            <p className="text-purple-200 text-base leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Actualizada mayo 2026 · Descarga la documentación técnica completa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={downloadPDF}
                className="flex items-center justify-center gap-2.5 px-8 py-4 font-semibold text-purple-700 text-sm tracking-wide transition-all hover:opacity-95"
                style={{ backgroundColor: "#ffffff", borderRadius: "14px" }}>
                <Download className="h-4 w-4" />
                Descargar Documentación
              </button>
              <a href="/auth/register"
                className="px-8 py-4 font-semibold text-purple-700 text-sm tracking-wide transition-all hover:opacity-95 inline-block"
                style={{ backgroundColor: "#ffffff", borderRadius: "14px" }}>
                Crear cuenta gratis
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer waveBg="#7c3aed" />
    </div>
  )
}
