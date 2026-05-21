import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, Shield, LogOut, RefreshCw, ImageIcon,
  Info, ToggleLeft, ToggleRight, Trash2, Check, AlertTriangle
} from "lucide-react"
import { useLocation } from "wouter"
import { localDB } from "@/lib-app/local-storage"
import type { GeneratedImage } from "@/lib-app/local-storage"
import { toast } from "react-hot-toast"

/* ── Brand Colors – cada métrica con su color propio ── */
const C1 = "#7c3aed"   // Total Usuarios — morado
const C2 = "#0ea5e9"   // Activos — azul
const C3 = "#10b981"   // Nuevos Hoy — verde
const C4 = "#f59e0b"   // Imágenes — ámbar
const C5 = "#ef4444"   // Generaciones de Arte — rojo
const PL = "#ede9fe"
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

/* ─────────────────────────────────────────
   INLINE INFO TOOLTIP
───────────────────────────────────────── */
function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 2, display: "flex" }}>
        <Info style={{ width: 12, height: 12 }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: "#1e1b4b", color: "#e9d5ff", fontFamily: DM, fontSize: 11, lineHeight: 1.5, borderRadius: 8, padding: "8px 12px", whiteSpace: "normal", width: 190, zIndex: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
            {text}
            <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", border: "5px solid transparent", borderBottomColor: "#1e1b4b" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────
   KPI DONUT — estilo unificado (sin animación continua)
   Igual para Total Usuarios, Activos e Imágenes
───────────────────────────────────────── */
function KpiDonut({
  value, total, color, label1, label2,
}: {
  value: number; total: number; color: string; label1: string; label2: string
}) {
  const r = 44, size = 100, cx = 50, cy = 50
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? value / total : 0
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
      <div style={{ position: "relative" }}>
        <svg width={size} height={size} style={{ display: "block", transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f0ff" strokeWidth="10" />
          <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${pct * circ} ${circ}` }}
            transition={{ duration: 1, ease: "easeOut" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: PLAYFAIR, fontSize: 22, fontWeight: 700, color }}>{value}</span>
          <span style={{ fontSize: 9, color: "#555", fontFamily: DM }}>de {total}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#222", fontFamily: DM }}>{label1}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: DM, marginLeft: 4 }}>{value}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ddd6fe", flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#222", fontFamily: DM }}>{label2}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#888", fontFamily: DM, marginLeft: 4 }}>{total - value}</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   KPI CARD 3 — Nuevos Hoy (barras estáticas, sin animación en número)
───────────────────────────────────────── */
function KpiNewToday({ value, weekData }: { value: number; weekData: number[] }) {
  const bars = weekData.length ? weekData : [0, 0, 0, 0, 0, 0, value]
  const max = Math.max(...bars, 1)
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 58, justifyContent: "center", marginBottom: 8 }}>
        {bars.map((v, i) => {
          const isToday = i === bars.length - 1
          const h = Math.max((v / max) * 52, 3)
          return (
            <div key={i} style={{ width: 14, height: h, background: isToday ? C3 : `${C3}66`, borderRadius: "3px 3px 0 0" }} />
          )
        })}
      </div>
      <span style={{ fontFamily: PLAYFAIR, fontSize: 28, fontWeight: 700, color: C3 }}>{value}</span>
      <p style={{ margin: "2px 0 0", fontSize: 10, color: "#333", fontFamily: DM }}>hoy</p>
    </div>
  )
}

/* ─────────────────────────────────────────
   CARD WRAPPER
───────────────────────────────────────── */
function ChartCard({ title, info, children, subtitle, titleColor }: { title: string; info: string; children: React.ReactNode; subtitle?: string; titleColor?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #000", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: subtitle ? 2 : 14 }}>
        <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 14, fontWeight: 700, color: titleColor || C1, textAlign: "center" }}>{title}</h3>
        <InfoTip text={info} />
      </div>
      {subtitle && <p style={{ margin: "0 0 10px", fontSize: 10, color: "#333", fontFamily: DM, textAlign: "center" }}>{subtitle}</p>}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

/* ─────────────────────────────────────────
   MINI BAR (estático, sin animación motion)
───────────────────────────────────────── */
function MiniBar({ data, color }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1)
  const barColor = color || C1
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 50 }}>
      {data.map((v, i) => (
        <div key={i}
          style={{ flex: 1, height: `${Math.max((v / max) * 100, 4)}%`, background: barColor, borderRadius: "3px 3px 0 0", opacity: 0.6 + 0.4 * (v / max) }} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   AREA LINE (estático, sin tick animado)
───────────────────────────────────────── */
function StaticAreaLine({ data, width = 215, height = 54, color }: { data: number[]; width?: number; height?: number; color?: string }) {
  const lineColor = color || C5
  const base = data.some(v => v > 0) ? data : [0, 0, 1, 0, 2, 1, 0]
  const max = Math.max(...base, 1)
  const coords = base.map((v, i) => {
    const x = (i / (base.length - 1)) * width
    const y = height - (v / max) * (height - 10) - 5
    return { x, y }
  })
  const pathD = coords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ")
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`
  const gradId = `aline_${lineColor.replace("#", "")}`
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={lineColor} stroke="white" strokeWidth="1.5" />)}
    </svg>
  )
}

/* ─────────────────────────────────────────
   RADAR (continuo – solo la forma, no los números)
───────────────────────────────────────── */
function AnimatedRadar({ values, labels, size = 145 }: { values: number[]; labels: string[]; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 22
  const n = values.length
  const angle = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2
  const pts = values.map((v, i) => { const a = angle(i), rv = (v / 100) * r; return `${cx + rv * Math.cos(a)},${cy + rv * Math.sin(a)}` }).join(" ")
  const grid = [0.33, 0.66, 1].map(sc => Array.from({ length: n }, (_, i) => { const a = angle(i); return `${cx + r * sc * Math.cos(a)},${cy + r * sc * Math.sin(a)}` }).join(" "))
  return (
    <svg width={size} height={size}>
      {grid.map((g, i) => <polygon key={i} points={g} fill="none" stroke="#ede9fe" strokeWidth="1" />)}
      {Array.from({ length: n }, (_, i) => <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle(i))} y2={cy + r * Math.sin(angle(i))} stroke="#ddd6fe" strokeWidth="1" />)}
      <polygon points={pts} fill={C1} fillOpacity="0.2" stroke={C1} strokeWidth="2" strokeLinejoin="round" />
      {labels.map((lbl, i) => { const a = angle(i), lx = cx + (r + 15) * Math.cos(a), ly = cy + (r + 15) * Math.sin(a); return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 7, fill: "#222", fontFamily: DM, fontWeight: 700 }}>{lbl}</text> })}
    </svg>
  )
}

/* ─────────────────────────────────────────
   PULSE WAVE (solo la onda, sin números)
───────────────────────────────────────── */
function PulseWave() {
  const [tick, setTick] = useState(0)
  useEffect(() => { const id = setInterval(() => setTick(x => x + 1), 65); return () => clearInterval(id) }, [])
  const pts = useMemo(() => {
    const w = 215, h = 38
    return Array.from({ length: 61 }, (_, i) => {
      const x = (i / 60) * w
      const spike = i > 20 && i < 23 ? Math.sin((i - 20) * Math.PI) * 26 : 0
      const y = h / 2 - Math.sin((i / 60) * 2 * Math.PI * 3 + tick * 0.32) * 6 - spike
      return `${x},${y}`
    }).join(" ")
  }, [tick])
  return <svg width={215} height={38} style={{ overflow: "visible" }}><polyline points={pts} fill="none" stroke={C2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

/* ─────────────────────────────────────────
   HORIZ BARS
───────────────────────────────────────── */
function HorizBars({ data }: { data: { plan: string; count: number; total: number }[] }) {
  const cols = [C1, C2, C3, C4]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map(({ plan, count, total }, i) => {
        const pct = total > 0 ? (count / total) * 100 : 0
        return (
          <div key={plan}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#111", fontFamily: DM, textTransform: "capitalize" }}>{plan}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: cols[i % cols.length], fontFamily: DM }}>{count}</span>
            </div>
            <div style={{ height: 7, background: "#f3f0ff", borderRadius: 99 }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                style={{ height: "100%", background: cols[i % cols.length], borderRadius: 99 }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────
   INLINE USER ROW
───────────────────────────────────────── */
function UserRow({ user, onToggle, onDelete }: { user: User; onToggle: (id: string, active: boolean) => void; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  return (
    <div style={{ borderBottom: "1px solid #f9f5ff" }}>
      <div onClick={() => { setExpanded(e => !e); setConfirmDel(false) }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: 10, cursor: "pointer", background: expanded ? "#faf8ff" : "transparent", transition: "background 0.15s" }}
        onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = "#faf8ff" }}
        onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: user.is_active ? PL : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: user.is_active ? C1 : "#888", fontFamily: DM, fontSize: 13 }}>
            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111", fontFamily: DM }}>{user.name || "Sin nombre"}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#555", fontFamily: DM }}>{user.email}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: user.is_active ? "#f3f0ff" : "#f3f4f6", color: user.is_active ? C1 : "#555", fontFamily: DM }}>
            {user.is_active ? "Activo" : "Inactivo"}
          </span>
          <span style={{ fontSize: 11, color: "#555", fontFamily: DM }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
          <motion.span animate={{ rotate: expanded ? 90 : 0 }} style={{ color: "#555", fontSize: 14, fontWeight: 700 }}>›</motion.span>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "10px 14px 14px", background: "#faf8ff", borderRadius: "0 0 10px 10px", marginBottom: 4 }}>
              {!confirmDel ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={e => { e.stopPropagation(); onToggle(user.id, !user.is_active) }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: `1px solid ${PL}`, background: "#fff", cursor: "pointer", fontFamily: DM, fontSize: 12, fontWeight: 600, color: C1 }}
                    onMouseEnter={e => e.currentTarget.style.background = PL} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    {user.is_active ? <><ToggleLeft style={{ width: 14, height: 14 }} /> Desactivar</> : <><ToggleRight style={{ width: 14, height: 14 }} /> Activar</>}
                  </button>
                  <button onClick={e => { e.stopPropagation(); setConfirmDel(true) }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff", cursor: "pointer", fontFamily: DM, fontSize: 12, fontWeight: 600, color: "#dc2626" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    <Trash2 style={{ width: 14, height: 14 }} /> Eliminar
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <AlertTriangle style={{ width: 14, height: 14, color: "#f59e0b", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontFamily: DM, color: "#333", flex: 1 }}>¿Eliminar a <strong>{user.name || user.email}</strong>? Irreversible.</span>
                  <button onClick={e => { e.stopPropagation(); onDelete(user.id); setExpanded(false) }}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 7, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontFamily: DM, fontSize: 12, fontWeight: 700 }}>
                    <Check style={{ width: 12, height: 12 }} /> Confirmar
                  </button>
                  <button onClick={e => { e.stopPropagation(); setConfirmDel(false) }}
                    style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${PL}`, background: "#fff", color: C1, cursor: "pointer", fontFamily: DM, fontSize: 12, fontWeight: 600 }}>
                    Cancelar
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────
   IMAGE PREVIEW
───────────────────────────────────────── */
function ImagePreview({ img, onClose }: { img: GeneratedImage; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.88 }} onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 16, overflow: "hidden", maxWidth: 480, width: "100%" }}>
        <img src={img.image_url} alt="Arte" style={{ width: "100%", display: "block" }} />
        <div style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: 11, color: "#555", fontFamily: DM }}>{new Date(img.generation_timestamp).toLocaleString()}</p>
          <button onClick={onClose} style={{ border: `1px solid ${PL}`, borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontFamily: DM, fontSize: 12, color: C1, background: "#faf8ff" }}>Cerrar</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════ */
export default function AdminDashboard() {
  const [, navigate] = useLocation()
  const [users, setUsers] = useState<User[]>([])
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, newUsersToday: 0, newUsersWeek: 0 })
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [previewImg, setPreviewImg] = useState<GeneratedImage | null>(null)
  const greeting = useMemo(() => getGreeting(), [])

  const fetchData = useCallback(() => {
    const us = localDB.getUsers()
    const imgs = localDB.getImages()
    const today = new Date().toISOString().split("T")[0]
    const wa = new Date(); wa.setDate(wa.getDate() - 7)
    const ws = wa.toISOString().split("T")[0]
    setUsers(us); setImages(imgs)
    setStats({
      totalUsers: us.length, activeUsers: us.filter(u => u.is_active).length,
      newUsersToday: us.filter(u => u.createdAt?.split("T")[0] === today).length,
      newUsersWeek: us.filter(u => u.createdAt?.split("T")[0] >= ws).length,
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
    setIsAdmin(true); fetchData()
    const iv = setInterval(fetchData, 4000)
    return () => clearInterval(iv)
  }, [navigate, fetchData])

  const handleToggle = (id: string, active: boolean) => { localDB.updateUser(id, { is_active: active }); fetchData(); toast.success(active ? "Activado" : "Desactivado") }
  const handleDelete = (id: string) => { localDB.deleteUser(id); fetchData(); toast.success("Eliminado") }

  const weeklyData = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return users.filter(u => u.createdAt?.split("T")[0] === d.toISOString().split("T")[0]).length
  }), [users])

  const imagesByDay = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return images.filter(img => img.generation_timestamp?.split("T")[0] === d.toISOString().split("T")[0]).length
  }), [images])

  const planData = useMemo(() => {
    const plans: Record<string, number> = {}
    users.forEach(u => { const p = u.plan || "free"; plans[p] = (plans[p] || 0) + 1 })
    return Object.entries(plans).map(([plan, count]) => ({ plan, count, total: users.length }))
  }, [users])

  const radarVals = useMemo(() => {
    const t = Math.max(stats.totalUsers, 1)
    return [
      Math.min(100, (stats.activeUsers / t) * 100 + 5),
      Math.min(100, (stats.newUsersToday / t) * 100 * 8 + 15),
      Math.min(100, (images.length / t) * 25 + 8),
      Math.min(100, (stats.newUsersWeek / t) * 100 + 8),
      Math.min(100, (stats.activeUsers / t) * 100 + 5),
      Math.min(100, images.length > 0 ? 80 : 25),
    ]
  }, [stats, images])

  if (!isAdmin && !loading) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: 40 }}>
        <Shield style={{ width: 44, height: 44, color: "#ef4444", margin: "0 auto 12px" }} />
        <p style={{ color: "#ef4444", fontFamily: DM, marginBottom: 16 }}>Acceso denegado.</p>
        <button onClick={() => navigate("/")} style={{ background: C1, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontFamily: DM }}>Volver</button>
      </div>
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${PL}`, borderTop: `3px solid ${C1}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: C1, fontFamily: DM, fontSize: 13 }}>Cargando…</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: DM, display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#faf8ff}
        ::-webkit-scrollbar-thumb{background:#ddd6fe;border-radius:99px}
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #000", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ width: 150 }} />
          <h1 style={{ margin: 0, fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 20, color: C1, textAlign: "center" }}>
            Noosfera Control Center
          </h1>
          <div style={{ width: 150, display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
              <span style={{ width: 7, height: 7, background: "#22c55e", borderRadius: "50%", flexShrink: 0, animation: "pulse 1.4s infinite" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", fontFamily: DM, whiteSpace: "nowrap" }}>Datos en vivo</span>
            </div>
            <button onClick={() => { localDB.clearCurrentUser(); navigate("/") }}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", border: "1px solid #000", borderRadius: 8, background: "#faf8ff", cursor: "pointer", color: C1, fontFamily: DM, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
              <LogOut style={{ width: 14, height: 14 }} /> Salir
            </button>
          </div>
        </div>
      </header>

      {/* ── GREETING ── */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: "#faf8ff", borderBottom: "1px solid #ede9fe", padding: "13px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontFamily: DM, fontSize: 15, color: "#111" }}>
          <span style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 17, color: C1 }}>Bienvenido, Admin</span>
          {" "}— {greeting}, bienvenido al panel de control de Noösfera.
        </p>
      </motion.div>

      <main style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "28px 24px", boxSizing: "border-box" }}>

        {/* ── 4 KPI CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 26 }}>

          {/* Card 1 — Total Usuarios */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            style={{ background: "#fff", border: "1px solid #000", borderRadius: 14, padding: "18px 16px 14px", boxShadow: "0 2px 14px rgba(0,0,0,0.07)", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 13, fontWeight: 700, color: C1 }}>Total Usuarios</h3>
              <InfoTip text="Número total de cuentas registradas en la plataforma." />
            </div>
            <KpiDonut value={stats.totalUsers} total={Math.max(stats.totalUsers, 1)} color={C1} label1="Registrados" label2="Vacíos" />
          </motion.div>

          {/* Card 2 — Activos */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            style={{ background: "#fff", border: "1px solid #000", borderRadius: 14, padding: "18px 16px 14px", boxShadow: "0 2px 14px rgba(0,0,0,0.07)", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 13, fontWeight: 700, color: C2 }}>Activos</h3>
              <InfoTip text="Usuarios con cuenta activa sobre el total registrado." />
            </div>
            <KpiDonut value={stats.activeUsers} total={Math.max(stats.totalUsers, 1)} color={C2} label1="Activos" label2="Inactivos" />
          </motion.div>

          {/* Card 3 — Nuevos Hoy */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }}
            style={{ background: "#fff", border: "1px solid #000", borderRadius: 14, padding: "18px 16px 14px", boxShadow: "0 2px 14px rgba(0,0,0,0.07)", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 13, fontWeight: 700, color: C3 }}>Nuevos Hoy</h3>
              <InfoTip text="Usuarios registrados hoy. Las barras muestran los últimos 7 días." />
            </div>
            <KpiNewToday value={stats.newUsersToday} weekData={weeklyData} />
          </motion.div>

          {/* Card 4 — Imágenes */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
            style={{ background: "#fff", border: "1px solid #000", borderRadius: 14, padding: "18px 16px 14px", boxShadow: "0 2px 14px rgba(0,0,0,0.07)", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 13, fontWeight: 700, color: C4 }}>Imágenes</h3>
              <InfoTip text="Total de obras de arte generadas por IA." />
            </div>
            <KpiDonut value={images.length} total={Math.max(images.length, 1)} color={C4} label1="Generadas" label2="Pendientes" />
          </motion.div>
        </div>

        {/* ── 6 CHARTS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 26 }}>

          {/* Usuarios Activos — morado */}
          <ChartCard title="Usuarios Activos" info="Proporción de usuarios activos sobre el total." titleColor={C1}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
              <div style={{ position: "relative" }}>
                {(() => {
                  const r = 50, c = 2 * Math.PI * r, pct = stats.totalUsers > 0 ? stats.activeUsers / stats.totalUsers : 0
                  return (
                    <svg width={116} height={116} style={{ transform: "rotate(-90deg)" }}>
                      <circle cx={58} cy={58} r={r} fill="none" stroke="#f3f0ff" strokeWidth="10" />
                      <motion.circle cx={58} cy={58} r={r} fill="none" stroke={C1} strokeWidth="10" strokeLinecap="round"
                        initial={{ strokeDasharray: `0 ${c}` }} animate={{ strokeDasharray: `${pct * c} ${c}` }} transition={{ duration: 1 }} />
                    </svg>
                  )
                })()}
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: PLAYFAIR, fontSize: 22, fontWeight: 700, color: C1 }}>{stats.activeUsers}</span>
                  <span style={{ fontSize: 9, color: "#333", fontFamily: DM }}>de {stats.totalUsers}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[{ l: "Activos", v: stats.activeUsers, c: C1 }, { l: "Inactivos", v: stats.totalUsers - stats.activeUsers, c: "#ddd6fe" }].map(({ l, v, c }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                    <span style={{ fontSize: 11, color: "#222", fontFamily: DM }}>{l}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c === "#ddd6fe" ? "#888" : c, fontFamily: DM, marginLeft: 4 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* Registros 7 días — azul */}
          <ChartCard title="Registros (7 días)" info="Nuevos usuarios por día en la última semana." subtitle="Nuevos usuarios por día" titleColor={C2}>
            <MiniBar data={weeklyData.some(v => v > 0) ? weeklyData : [0, 1, 0, 2, 1, 0, stats.newUsersToday]} color={C2} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {["L", "M", "X", "J", "V", "S", "D"].map(d => <span key={d} style={{ fontSize: 9, color: "#333", fontFamily: DM, flex: 1, textAlign: "center" }}>{d}</span>)}
            </div>
          </ChartCard>

          {/* Generaciones de Arte — rojo */}
          <ChartCard title="Generaciones de Arte" info="Imágenes generadas por IA por día." subtitle="Imágenes generadas por día" titleColor={C5}>
            <StaticAreaLine data={imagesByDay} color={C5} />
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#222", fontFamily: DM, textAlign: "center" }}>
              Total: <strong style={{ color: C5 }}>{images.length}</strong> imágenes
            </p>
          </ChartCard>

          {/* Distribución de Planes — multicolor */}
          <ChartCard title="Distribución de Planes" info="Cuántos usuarios tienen cada plan de suscripción." titleColor={C3}>
            <HorizBars data={planData.length ? planData : [{ plan: "free", count: stats.totalUsers, total: stats.totalUsers }]} />
          </ChartCard>

          {/* Métricas Globales — morado */}
          <ChartCard title="Métricas Globales" info="Visualización radar de 6 indicadores clave de la plataforma." titleColor={C1}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AnimatedRadar values={radarVals} labels={["Activos", "Nuevos", "Arte", "Semana", "Retención", "IA"]} />
            </div>
          </ChartCard>

          {/* Actividad en Tiempo Real — azul */}
          <ChartCard title="Actividad en Tiempo Real" info="Señal de pulso animada reflejando la actividad de la plataforma." titleColor={C2}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", animation: "pulse 1.2s infinite" }} />
              <span style={{ fontSize: 10, color: "#333", fontFamily: DM }}>señal activa</span>
            </div>
            <PulseWave />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              {[{ l: "Última act.", v: lastUpdate.toLocaleTimeString(), c: "#222" }, { l: "Esta semana", v: `${stats.newUsersWeek} nuevos`, c: C1 }, { l: "Sesión", v: "Activa", c: "#22c55e" }].map(({ l, v, c }) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 10, color: "#555", fontFamily: DM }}>{l}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 700, color: c, fontFamily: DM }}>{v}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* ── USERS + IMAGES ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          <div style={{ background: "#fff", border: "1px solid #000", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ padding: "15px 20px 11px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, position: "relative" }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: C1, textAlign: "center" }}>Usuarios Registrados</h3>
              <InfoTip text="Clic en un usuario para desplegar gestión inline: activar/desactivar o eliminar con confirmación integrada." />
              <div style={{ position: "absolute", right: 16, display: "flex", alignItems: "center", gap: 4 }}>
                <RefreshCw style={{ width: 11, height: 11, color: "#888" }} />
                <span style={{ fontSize: 10, color: "#555", fontFamily: DM }}>{lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
            <div style={{ maxHeight: 360, overflowY: "auto", padding: "6px 10px" }}>
              {users.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 0" }}>
                  <Users style={{ width: 34, height: 34, color: "#ddd6fe", margin: "0 auto 8px" }} />
                  <p style={{ color: "#555", fontFamily: DM, fontSize: 13 }}>Sin usuarios aún</p>
                </div>
              ) : users.map(user => <UserRow key={user.id} user={user} onToggle={handleToggle} onDelete={handleDelete} />)}
            </div>
            <div style={{ padding: "7px 20px", borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 10, color: "#555", fontFamily: DM }}>Clic en un usuario para gestionar</p>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #000", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ padding: "15px 20px 11px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: C1, textAlign: "center" }}>Imágenes Generadas</h3>
              <InfoTip text="Galería global de todas las imágenes generadas por IA. Clic para ver a tamaño completo." />
              <span style={{ padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: PL, color: C1, fontFamily: DM }}>{images.length}</span>
            </div>
            <div style={{ padding: "12px 14px", maxHeight: 360, overflowY: "auto" }}>
              {images.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 0" }}>
                  <ImageIcon style={{ width: 34, height: 34, color: "#ddd6fe", margin: "0 auto 8px" }} />
                  <p style={{ color: "#555", fontFamily: DM, fontSize: 13 }}>Sin imágenes aún</p>
                  <p style={{ color: "#333", fontFamily: DM, fontSize: 11, marginTop: 4 }}>Las imágenes de demo y usuarios aparecerán aquí</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {images.map((img, i) => (
                    <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                      onClick={() => setPreviewImg(img)}
                      style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", cursor: "pointer", border: "2px solid #000", background: "#f9f5ff" }}>
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
      <footer style={{ borderTop: "1px solid #000", background: "#fff", padding: "14px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <img src="/favicon-brain.png" alt="Noosfera" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <p style={{ margin: 0, fontSize: 13, color: "#555", fontFamily: DM }}>
            &copy; 2026 <span style={{ color: C1, fontWeight: 600 }}>Noosfera</span>.
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {previewImg && <ImagePreview img={previewImg} onClose={() => setPreviewImg(null)} />}
      </AnimatePresence>
    </div>
  )
}
