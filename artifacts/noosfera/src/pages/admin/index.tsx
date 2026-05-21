import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, Shield, LogOut, UserPlus, UserCheck, Brain,
  RefreshCw, ImageIcon, Info, X, UserX, ToggleLeft, ToggleRight, Trash2
} from "lucide-react"
import { useLocation } from "wouter"
import { localDB } from "@/lib-app/local-storage"
import type { GeneratedImage } from "@/lib-app/local-storage"
import { toast } from "react-hot-toast"

const PURPLE = "#7c3aed"
const PURPLE_LIGHT = "#ede9fe"
const PLAYFAIR = "'Playfair Display', Georgia, serif"
const DM = "'DM Sans', sans-serif"

interface User {
  id: string; name: string | null; email: string | null
  plan: string; createdAt: string; is_active: boolean; lastLogin: string | null
}

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 6 && h < 12) return "Buenos días"
  if (h >= 12 && h < 18) return "Buenas tardes"
  return "Buenas noches"
}

function useTick(ms = 80) {
  const [t, setT] = useState(0)
  useEffect(() => { const id = setInterval(() => setT(x => x + 1), ms); return () => clearInterval(id) }, [ms])
  return t
}

/* ── KPI Spark Line (animated) ── */
function SparkCard({
  label, value, icon, color, spark
}: { label: string; value: number; icon: React.ReactNode; color: string; spark: number[] }) {
  const max = Math.max(...spark, 1)
  const w = 80, h = 28
  const pts = spark.map((v, i) => {
    const x = (i / (spark.length - 1)) * w
    const y = h - (v / max) * (h - 4) - 2
    return `${x},${y}`
  }).join(" ")
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 14px rgba(124,58,237,0.07)", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 11, color: "#888", fontFamily: DM, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</p>
          <p style={{ margin: 0, fontSize: 38, fontWeight: 700, fontFamily: PLAYFAIR, color: PURPLE, lineHeight: 1 }}>{value}</p>
        </div>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      </div>
      <div style={{ marginTop: 14 }}>
        <svg width={w} height={h} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id={`sg-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PURPLE} stopOpacity="0.25" />
              <stop offset="100%" stopColor={PURPLE} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={`M ${pts.split(" ").join(" L ")} L ${w},${h} L 0,${h} Z`} fill={`url(#sg-${label})`} />
          <polyline points={pts} fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  )
}

/* ── Donut ── */
function Donut({ value, max, size = 120 }: { value: number; max: number; size?: number }) {
  const r = size / 2 - 10
  const c = 2 * Math.PI * r
  const pct = max > 0 ? value / max : 0
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f0ff" strokeWidth="10" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={PURPLE} strokeWidth="10"
        strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${c}` }}
        animate={{ strokeDasharray: `${pct * c} ${c}` }}
        transition={{ duration: 1, ease: "easeOut" }} />
    </svg>
  )
}

/* ── Mini bar chart ── */
function MiniBar({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 50 }}>
      {data.map((v, i) => (
        <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
          style={{ flex: 1, height: `${Math.max((v / max) * 100, 4)}%`, background: `linear-gradient(180deg, ${PURPLE}, #9333ea)`, borderRadius: "3px 3px 0 0", transformOrigin: "bottom", opacity: 0.65 + 0.35 * (v / max) }} />
      ))}
    </div>
  )
}

/* ── Line/Area chart ── */
function AreaLine({ data, width = 220, height = 56 }: { data: number[]; width?: number; height?: number }) {
  if (data.length < 2) return <div style={{ height }} />
  const max = Math.max(...data, 1)
  const coords = data.map((v, i) => ({ x: (i / (data.length - 1)) * width, y: height - (v / max) * (height - 8) - 4 }))
  const path = coords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ")
  const area = `${path} L ${width},${height} L 0,${height} Z`
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="agrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PURPLE} stopOpacity="0.28" /><stop offset="100%" stopColor={PURPLE} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#agrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
      <motion.path d={path} fill="none" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }} />
      {coords.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="3.5" fill={PURPLE} stroke="white" strokeWidth="1.5"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.06 }} />
      ))}
    </svg>
  )
}

/* ── Animated Radar ── */
function AnimatedRadar({ values, labels, size = 130 }: { values: number[]; labels: string[]; size?: number }) {
  const tick = useTick(60)
  const cx = size / 2, cy = size / 2, r = size / 2 - 18
  const n = values.length
  const angle = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2
  const animatedVals = values.map((v, i) => {
    const wobble = Math.sin(tick * 0.04 + i * 1.2) * 6
    return Math.max(10, Math.min(100, v + wobble))
  })
  const pts = animatedVals.map((v, i) => {
    const a = angle(i), rv = (v / 100) * r
    return `${cx + rv * Math.cos(a)},${cy + rv * Math.sin(a)}`
  }).join(" ")
  const grid = [0.33, 0.66, 1].map(sc =>
    Array.from({ length: n }, (_, i) => {
      const a = angle(i)
      return `${cx + r * sc * Math.cos(a)},${cy + r * sc * Math.sin(a)}`
    }).join(" ")
  )
  return (
    <svg width={size} height={size}>
      {grid.map((g, i) => <polygon key={i} points={g} fill="none" stroke="#ede9fe" strokeWidth="1" />)}
      {Array.from({ length: n }, (_, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle(i))} y2={cy + r * Math.sin(angle(i))} stroke="#ddd6fe" strokeWidth="1" />
      ))}
      <polygon points={pts} fill={PURPLE} fillOpacity="0.18" stroke={PURPLE} strokeWidth="2" strokeLinejoin="round" />
      {labels.map((lbl, i) => {
        const a = angle(i), lx = cx + (r + 13) * Math.cos(a), ly = cy + (r + 13) * Math.sin(a)
        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 7, fill: PURPLE, fontFamily: DM, fontWeight: 600 }}>{lbl}</text>
      })}
    </svg>
  )
}

/* ── Pulse wave ── */
function PulseWave() {
  const tick = useTick(70)
  const pts = useMemo(() => {
    const w = 220, h = 38
    return Array.from({ length: 61 }, (_, i) => {
      const x = (i / 60) * w
      const spike = i > 20 && i < 23 ? Math.sin((i - 20) * Math.PI) * 28 : 0
      const y = h / 2 - Math.sin((i / 60) * 2 * Math.PI * 3 + tick * 0.35) * 6 - spike
      return `${x},${y}`
    }).join(" ")
  }, [tick])
  return (
    <svg width={220} height={38} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Horizontal bars ── */
function HorizBars({ data }: { data: { plan: string; count: number; total: number }[] }) {
  const colors = [PURPLE, "#9333ea", "#a21caf", "#6d28d9"]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map(({ plan, count, total }, i) => {
        const pct = total > 0 ? (count / total) * 100 : 0
        return (
          <div key={plan}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#333", fontFamily: DM, textTransform: "capitalize" }}>{plan}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors[i % colors.length], fontFamily: DM }}>{count}</span>
            </div>
            <div style={{ height: 8, background: "#f3f0ff", borderRadius: 99 }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.7 }}
                style={{ height: "100%", background: `linear-gradient(90deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`, borderRadius: 99 }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Info tooltip popup ── */
const INFO_SECTIONS = [
  { title: "Contadores KPI", desc: "Totales de usuarios, activos, nuevos hoy e imágenes generadas. Cada tarjeta muestra un mini-gráfico de tendencia." },
  { title: "Usuarios Activos (Donut)", desc: "Proporción visual de usuarios activos sobre el total en tiempo real." },
  { title: "Registros 7 días (Barras)", desc: "Nuevos usuarios registrados cada día de la última semana." },
  { title: "Generaciones de Arte (Línea)", desc: "Imágenes de arte generadas por IA por día en la última semana." },
  { title: "Distribución de Planes (Barras H.)", desc: "Cuántos usuarios tienen cada plan (free, premium, etc.)." },
  { title: "Métricas Globales (Radar)", desc: "Vista hexagonal animada de: activos, nuevos, arte generado, retención semanal, y uso de IA." },
  { title: "Actividad en Tiempo Real", desc: "Onda de pulso animada que representa la actividad viva de la plataforma." },
  { title: "Usuarios Registrados", desc: "Lista completa de usuarios con opciones de gestión: activar/desactivar y eliminar." },
  { title: "Imágenes Generadas", desc: "Galería global de todas las imágenes generadas por IA, incluyendo las de demo." },
]

function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 520, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #f3f0ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 18, fontWeight: 700, color: PURPLE }}>Guía del Panel</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4 }}><X style={{ width: 20, height: 20 }} /></button>
        </div>
        <div style={{ overflowY: "auto", padding: "16px 24px 20px" }}>
          {INFO_SECTIONS.map(({ title, desc }) => (
            <div key={title} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #f9f5ff" }}>
              <p style={{ margin: "0 0 4px", fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 14, color: PURPLE }}>{title}</p>
              <p style={{ margin: 0, fontFamily: DM, fontSize: 13, color: "#444", lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── User management modal ── */
function UserManageModal({ user, onClose, onToggle, onDelete }: {
  user: User; onClose: () => void
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 380, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f3f0ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 16, fontWeight: 700, color: PURPLE }}>Gestionar Usuario</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa" }}><X style={{ width: 18, height: 18 }} /></button>
        </div>
        <div style={{ padding: "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: PURPLE_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: PURPLE, fontFamily: DM, fontSize: 16 }}>
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: "#111", fontFamily: DM, fontSize: 14 }}>{user.name || "Sin nombre"}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#888", fontFamily: DM }}>{user.email}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => { onToggle(user.id, !user.is_active); onClose() }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, border: `1px solid ${PURPLE_LIGHT}`, background: "#faf8ff", cursor: "pointer", fontFamily: DM, fontSize: 13, fontWeight: 600, color: PURPLE }}>
              {user.is_active ? <ToggleLeft style={{ width: 18, height: 18 }} /> : <ToggleRight style={{ width: 18, height: 18 }} />}
              {user.is_active ? "Desactivar cuenta" : "Activar cuenta"}
            </button>
            <button onClick={() => { if (confirm(`¿Eliminar a ${user.name || user.email}?`)) { onDelete(user.id); onClose() } }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, border: "1px solid #fecaca", background: "#fff5f5", cursor: "pointer", fontFamily: DM, fontSize: 13, fontWeight: 600, color: "#dc2626" }}>
              <Trash2 style={{ width: 18, height: 18 }} />
              Eliminar usuario
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Image preview modal ── */
function ImagePreview({ img, onClose }: { img: GeneratedImage; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 16, overflow: "hidden", maxWidth: 480, width: "100%" }}>
        <img src={img.image_url} alt="Arte" style={{ width: "100%", display: "block" }} />
        <div style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: 11, color: "#aaa", fontFamily: DM }}>
            {new Date(img.generation_timestamp).toLocaleString()}
          </p>
          <button onClick={onClose}
            style={{ border: `1px solid ${PURPLE_LIGHT}`, borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontFamily: DM, fontSize: 12, color: PURPLE, background: "#faf8ff" }}>
            Cerrar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [, navigate] = useLocation()
  const [users, setUsers] = useState<User[]>([])
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, newUsersToday: 0, newUsersWeek: 0 })
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [showInfo, setShowInfo] = useState(false)
  const [manageUser, setManageUser] = useState<User | null>(null)
  const [previewImg, setPreviewImg] = useState<GeneratedImage | null>(null)
  const greeting = useMemo(() => getGreeting(), [])

  const fetchData = useCallback(() => {
    const usersData = localDB.getUsers()
    const imagesData = localDB.getImages()
    const today = new Date().toISOString().split("T")[0]
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
    const weekStr = weekAgo.toISOString().split("T")[0]
    setUsers(usersData)
    setImages(imagesData)
    setStats({
      totalUsers: usersData.length,
      activeUsers: usersData.filter(u => u.is_active).length,
      newUsersToday: usersData.filter(u => u.createdAt?.split("T")[0] === today).length,
      newUsersWeek: usersData.filter(u => u.createdAt?.split("T")[0] >= weekStr).length,
    })
    setLastUpdate(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    const uid = localDB.getCurrentUser()
    if (!uid) { toast.error("Debes iniciar sesion"); navigate("/auth/login"); return }
    const user = localDB.getUserById(uid)
    if (!user || !["admin@noosfera.com", "noosferasuperadmin@gmail.com"].includes(user.email)) {
      toast.error("Sin permisos"); navigate("/"); return
    }
    setIsAdmin(true)
    fetchData()
    const iv = setInterval(fetchData, 4000)
    return () => clearInterval(iv)
  }, [navigate, fetchData])

  const handleToggleUser = (id: string, active: boolean) => {
    localDB.updateUser(id, { is_active: active })
    fetchData()
    toast.success(active ? "Usuario activado" : "Usuario desactivado")
  }

  const handleDeleteUser = (id: string) => {
    localDB.deleteUser(id)
    fetchData()
    toast.success("Usuario eliminado")
  }

  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      const day = d.toISOString().split("T")[0]
      return users.filter(u => u.createdAt?.split("T")[0] === day).length
    })
  }, [users])

  const imagesByDay = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      const day = d.toISOString().split("T")[0]
      return images.filter(img => img.generation_timestamp?.split("T")[0] === day).length
    })
  }, [images])

  const planData = useMemo(() => {
    const plans: Record<string, number> = {}
    users.forEach(u => { const p = u.plan || "free"; plans[p] = (plans[p] || 0) + 1 })
    return Object.entries(plans).map(([plan, count]) => ({ plan, count, total: users.length }))
  }, [users])

  const radarVals = useMemo(() => {
    const t = Math.max(stats.totalUsers, 1)
    return [
      Math.min(100, (stats.activeUsers / t) * 100),
      Math.min(100, (stats.newUsersToday / t) * 100 * 8 + 10),
      Math.min(100, (images.length / t) * 25 + 5),
      Math.min(100, (stats.newUsersWeek / t) * 100 + 5),
      Math.min(100, (stats.activeUsers / t) * 100),
      Math.min(100, images.length > 0 ? 80 : 20),
    ]
  }, [stats, images])

  /* Spark data (trend lines for KPI cards) */
  const sparkWeek = weeklyData
  const sparkActive = useMemo(() => Array.from({ length: 7 }, (_, i) => Math.max(0, stats.activeUsers - (6 - i) * 0)), [stats])
  const sparkImages = imagesByDay

  if (!isAdmin && !loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <Shield style={{ width: 44, height: 44, color: "#ef4444", margin: "0 auto 12px" }} />
          <p style={{ color: "#ef4444", fontFamily: DM, marginBottom: 16 }}>Acceso denegado.</p>
          <button onClick={() => navigate("/")} style={{ background: PURPLE, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontFamily: DM }}>Volver</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${PURPLE_LIGHT}`, borderTop: `3px solid ${PURPLE}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: PURPLE, fontFamily: DM, fontSize: 13 }}>Cargando…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: DM, display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin { to{transform:rotate(360deg)} }
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#faf8ff}
        ::-webkit-scrollbar-thumb{background:#ddd6fe;border-radius:99px}
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #f3f0ff", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(124,58,237,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Left — empty spacer to balance center title */}
          <div style={{ width: 160 }} />

          {/* Center — title only */}
          <h1 style={{ margin: 0, fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 20, color: PURPLE, letterSpacing: "-0.3px", textAlign: "center" }}>
            Noosfera Control Center
          </h1>

          {/* Right — actions */}
          <div style={{ width: 160, display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
            {/* Info */}
            <button onClick={() => setShowInfo(true)}
              style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${PURPLE_LIGHT}`, background: "#faf8ff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: PURPLE }}>
              <Info style={{ width: 16, height: 16 }} />
            </button>
            {/* En vivo */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: PURPLE_LIGHT, border: `1px solid #ddd6fe` }}>
              <span style={{ width: 7, height: 7, background: PURPLE, borderRadius: "50%", display: "inline-block", animation: "pulse 1.4s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: PURPLE, fontFamily: DM }}>En vivo</span>
            </div>
            {/* Salir */}
            <button onClick={() => { localDB.clearCurrentUser(); navigate("/") }}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", border: `1px solid ${PURPLE_LIGHT}`, borderRadius: 8, background: "#faf8ff", cursor: "pointer", color: PURPLE, fontFamily: DM, fontSize: 13, fontWeight: 600 }}>
              <LogOut style={{ width: 14, height: 14 }} /> Salir
            </button>
          </div>
        </div>
      </header>

      {/* ── GREETING ── */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: "#faf8ff", borderBottom: "1px solid #ede9fe", padding: "13px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontFamily: DM, fontSize: 15, color: "#111" }}>
          <span style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 17, color: PURPLE }}>Bienvenido, Admin</span>
          {" "}— {greeting}, bienvenido al panel de control de Noösfera.
        </p>
      </motion.div>

      <main style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "28px 24px", boxSizing: "border-box" }}>

        {/* ── KPI CARDS with spark lines ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          <SparkCard label="Total Usuarios" value={stats.totalUsers}
            icon={<Users style={{ width: 20, height: 20, color: PURPLE }} />}
            color="#f3f0ff" spark={[...weeklyData.map((_, i) => stats.totalUsers - weeklyData.slice(i).reduce((a, b) => a + b, 0))]} />
          <SparkCard label="Activos" value={stats.activeUsers}
            icon={<UserCheck style={{ width: 20, height: 20, color: "#9333ea" }} />}
            color="#faf0ff" spark={sparkActive} />
          <SparkCard label="Nuevos Hoy" value={stats.newUsersToday}
            icon={<UserPlus style={{ width: 20, height: 20, color: "#a21caf" }} />}
            color="#fdf4ff" spark={weeklyData} />
          <SparkCard label="Imágenes" value={images.length}
            icon={<ImageIcon style={{ width: 20, height: 20, color: "#6d28d9" }} />}
            color="#ede9fe" spark={sparkImages} />
        </div>

        {/* ── 6 CHARTS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 28 }}>

          {/* 1 Donut */}
          <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <h3 style={{ margin: "0 0 16px", fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Usuarios Activos</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Donut value={stats.activeUsers} max={stats.totalUsers} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: PLAYFAIR, fontSize: 24, fontWeight: 700, color: PURPLE }}>{stats.activeUsers}</span>
                  <span style={{ fontSize: 10, color: "#aaa", fontFamily: DM }}>de {stats.totalUsers}</span>
                </div>
              </div>
              <div>
                {[{ label: "Activos", val: stats.activeUsers, c: PURPLE }, { label: "Inactivos", val: stats.totalUsers - stats.activeUsers, c: "#ddd6fe" }].map(({ label, val, c }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: c, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#444", fontFamily: DM }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: c, fontFamily: DM, marginLeft: "auto", paddingLeft: 8 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2 Bar registrations */}
          <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <h3 style={{ margin: "0 0 4px", fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Registros (7 días)</h3>
            <p style={{ margin: "0 0 12px", fontSize: 11, color: "#aaa", fontFamily: DM }}>Nuevos usuarios por día</p>
            <MiniBar data={weeklyData.some(v => v > 0) ? weeklyData : [0, 1, 0, 2, 1, 0, stats.newUsersToday]} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              {["L", "M", "X", "J", "V", "S", "D"].map(d => (
                <span key={d} style={{ fontSize: 9, color: "#ccc", fontFamily: DM, flex: 1, textAlign: "center" }}>{d}</span>
              ))}
            </div>
          </div>

          {/* 3 Line generations */}
          <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <h3 style={{ margin: "0 0 4px", fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Generaciones de Arte</h3>
            <p style={{ margin: "0 0 12px", fontSize: 11, color: "#aaa", fontFamily: DM }}>Imágenes generadas por día</p>
            <AreaLine data={imagesByDay.some(v => v > 0) ? imagesByDay : [0, 0, 1, 0, 2, 1, images.length]} width={220} height={54} />
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#333", fontFamily: DM }}>
              Total: <strong style={{ color: PURPLE }}>{images.length}</strong> imágenes
            </p>
          </div>

          {/* 4 Horizontal plan bars */}
          <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <h3 style={{ margin: "0 0 16px", fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Distribución de Planes</h3>
            <HorizBars data={planData.length ? planData : [{ plan: "free", count: stats.totalUsers, total: stats.totalUsers }]} />
          </div>

          {/* 5 Animated radar */}
          <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <h3 style={{ margin: "0 0 10px", fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Métricas Globales</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AnimatedRadar values={radarVals} labels={["Activos", "Nuevos", "Arte", "Semana", "Retención", "IA"]} size={138} />
            </div>
          </div>

          {/* 6 Live pulse */}
          <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Actividad en Tiempo Real</h3>
              <span style={{ width: 7, height: 7, background: "#22c55e", borderRadius: "50%", display: "inline-block", animation: "pulse 1.2s infinite" }} />
            </div>
            <PulseWave />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              {[
                { label: "Última act.", val: lastUpdate.toLocaleTimeString(), c: "#333" },
                { label: "Esta semana", val: `${stats.newUsersWeek} nuevos`, c: PURPLE },
                { label: "Sesión", val: "Activa", c: "#22c55e" },
              ].map(({ label, val, c }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 10, color: "#aaa", fontFamily: DM }}>{label}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 700, color: c, fontFamily: DM }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── USERS + IMAGES ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>

          {/* Users with management */}
          <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f9f5ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 16, fontWeight: 700, color: PURPLE }}>Usuarios Registrados</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RefreshCw style={{ width: 12, height: 12, color: "#ccc" }} />
                <span style={{ fontSize: 11, color: "#ccc", fontFamily: DM }}>{lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
            <div style={{ maxHeight: 340, overflowY: "auto", padding: "8px 12px" }}>
              {users.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 0" }}>
                  <Users style={{ width: 36, height: 36, color: "#ddd6fe", margin: "0 auto 8px" }} />
                  <p style={{ color: "#bbb", fontFamily: DM, fontSize: 13 }}>Sin usuarios aún</p>
                </div>
              ) : users.map((user, i) => (
                <motion.div key={user.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setManageUser(user)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: 10, marginBottom: 4, cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#faf8ff")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: user.is_active ? PURPLE_LIGHT : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: user.is_active ? PURPLE : "#bbb", fontFamily: DM, fontSize: 13 }}>
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111", fontFamily: DM }}>{user.name || "Sin nombre"}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#aaa", fontFamily: DM }}>{user.email}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: user.is_active ? "#f3f0ff" : "#f3f4f6", color: user.is_active ? PURPLE : "#bbb", fontFamily: DM }}>
                      {user.is_active ? "Activo" : "Inactivo"}
                    </span>
                    <span style={{ fontSize: 11, color: "#ccc", fontFamily: DM }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div style={{ padding: "8px 20px", borderTop: "1px solid #f9f5ff" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#ccc", fontFamily: DM, textAlign: "center" }}>Clic en un usuario para gestionarlo</p>
            </div>
          </div>

          {/* Images gallery */}
          <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f9f5ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 16, fontWeight: 700, color: PURPLE }}>Imágenes Generadas</h3>
              <span style={{ padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: PURPLE_LIGHT, color: PURPLE, fontFamily: DM }}>{images.length}</span>
            </div>
            <div style={{ padding: "12px 14px", maxHeight: 340, overflowY: "auto" }}>
              {images.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 0" }}>
                  <ImageIcon style={{ width: 36, height: 36, color: "#ddd6fe", margin: "0 auto 8px" }} />
                  <p style={{ color: "#bbb", fontFamily: DM, fontSize: 13 }}>Sin imágenes aún</p>
                  <p style={{ color: "#ddd", fontFamily: DM, fontSize: 11, marginTop: 4 }}>Demo e imágenes de usuarios aparecerán aquí</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {images.map((img, i) => (
                    <motion.div key={img.id} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                      onClick={() => setPreviewImg(img)}
                      style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", cursor: "pointer", border: "2px solid #f3f0ff", background: "#f9f5ff", position: "relative" }}>
                      <img src={img.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #f3f0ff", background: "#fff", padding: "14px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#bbb", fontFamily: DM }}>
          &copy; 2026 <span style={{ color: PURPLE, fontWeight: 600 }}>Noosfera</span>.
        </p>
      </footer>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
        {manageUser && (
          <UserManageModal user={manageUser} onClose={() => setManageUser(null)}
            onToggle={handleToggleUser} onDelete={handleDeleteUser} />
        )}
        {previewImg && <ImagePreview img={previewImg} onClose={() => setPreviewImg(null)} />}
      </AnimatePresence>
    </div>
  )
}
