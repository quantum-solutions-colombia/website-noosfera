import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, Shield, LogOut, UserPlus, UserCheck,
  RefreshCw, ImageIcon, Info, X, ToggleLeft, ToggleRight, Trash2, Check, AlertTriangle
} from "lucide-react"
import { useLocation } from "wouter"
import { localDB } from "@/lib-app/local-storage"
import type { GeneratedImage } from "@/lib-app/local-storage"
import { toast } from "react-hot-toast"

const P = "#7c3aed"
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

function useTick(ms = 60) {
  const [t, setT] = useState(0)
  useEffect(() => { const id = setInterval(() => setT(x => x + 1), ms); return () => clearInterval(id) }, [ms])
  return t
}

/* ── Info tooltip ── */
function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", padding: 2, display: "flex", alignItems: "center" }}>
        <Info style={{ width: 13, height: 13 }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: "#1e1b4b", color: "#e9d5ff", fontFamily: DM, fontSize: 11, lineHeight: 1.5, borderRadius: 8, padding: "8px 12px", whiteSpace: "normal", width: 200, zIndex: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
            {text}
            <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", border: "5px solid transparent", borderBottomColor: "#1e1b4b" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Single multi-ring orbital KPI chart ── */
function OrbitalKPI({ stats, images }: { stats: { totalUsers: number; activeUsers: number; newUsersToday: number; newUsersWeek: number }; images: number }) {
  const tick = useTick(40)
  const cx = 110, cy = 110, size = 220
  const rings = [
    { label: "Total", value: stats.totalUsers, max: Math.max(stats.totalUsers, 1), r: 88, color: P, w: 10 },
    { label: "Activos", value: stats.activeUsers, max: Math.max(stats.totalUsers, 1), r: 70, color: "#9333ea", w: 9 },
    { label: "Nuevos hoy", value: stats.newUsersToday, max: Math.max(stats.totalUsers, 1), r: 52, color: "#a21caf", w: 8 },
    { label: "Imágenes", value: images, max: Math.max(images, 1), r: 34, color: "#6d28d9", w: 7 },
  ]
  return (
    <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 16, padding: "22px 28px", boxShadow: "0 2px 14px rgba(124,58,237,0.07)", display: "flex", alignItems: "center", gap: 32 }}>
      {/* Chart */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={size} height={size}>
          {rings.map(({ r, color, w }, i) => {
            const circ = 2 * Math.PI * r
            const pct = 1
            const pulse = 0.06 * Math.sin(tick * 0.05 + i * 1.1)
            const dashLen = circ * (0.82 + pulse)
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${color}18`} strokeWidth={w} />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={w}
                  strokeLinecap="round" strokeDasharray={`${dashLen} ${circ}`}
                  style={{ transform: `rotate(${-90 + tick * (0.3 + i * 0.12)}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: "none" }} />
              </g>
            )
          })}
          <text x={cx} y={cy - 8} textAnchor="middle" style={{ fontFamily: PLAYFAIR, fontSize: 32, fontWeight: 700, fill: P }}>{stats.totalUsers}</text>
          <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontFamily: DM, fontSize: 10, fill: "#aaa" }}>usuarios totales</text>
        </svg>
      </div>
      {/* Legend */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        {rings.map(({ label, value, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#555", fontFamily: DM, flex: 1 }}>{label}</span>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: PLAYFAIR, color, minWidth: 32, textAlign: "right" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Mini bar chart ── */
function MiniBar({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 52 }}>
      {data.map((v, i) => (
        <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.07, duration: 0.5 }}
          style={{ flex: 1, height: `${Math.max((v / max) * 100, 4)}%`, background: `linear-gradient(180deg, ${P}, #9333ea)`, borderRadius: "3px 3px 0 0", transformOrigin: "bottom", opacity: 0.6 + 0.4 * (v / max) }} />
      ))}
    </div>
  )
}

/* ── Continuously animated area line chart ── */
function AnimatedAreaLine({ data, width = 220, height = 56 }: { data: number[]; width?: number; height?: number }) {
  const tick = useTick(50)
  const baseData = data.length >= 2 ? data : [0, 0, 1, 0, 2, 1, 0]
  const max = Math.max(...baseData, 1)
  const coords = useMemo(() => {
    return baseData.map((v, i) => {
      const x = (i / (baseData.length - 1)) * width
      const baseY = height - (v / max) * (height - 10) - 5
      const wave = 2.5 * Math.sin(tick * 0.06 + i * 0.9)
      return { x, y: baseY + wave }
    })
  }, [tick, baseData, max, width, height])

  const pathD = coords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ")
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="aline" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P} stopOpacity="0.3" />
          <stop offset="100%" stopColor={P} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#aline)" />
      <path d={pathD} fill="none" stroke={P} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={P} stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  )
}

/* ── Animated Radar (continuous) ── */
function AnimatedRadar({ values, labels, size = 138 }: { values: number[]; labels: string[]; size?: number }) {
  const tick = useTick(45)
  const cx = size / 2, cy = size / 2, r = size / 2 - 20
  const n = values.length
  const angle = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2
  const animVals = values.map((v, i) => {
    const w1 = 8 * Math.sin(tick * 0.05 + i * 1.3)
    const w2 = 4 * Math.cos(tick * 0.03 + i * 0.7)
    return Math.max(12, Math.min(100, v + w1 + w2))
  })
  const pts = animVals.map((v, i) => {
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
      <polygon points={pts} fill={P} fillOpacity="0.2" stroke={P} strokeWidth="2" strokeLinejoin="round" />
      {labels.map((lbl, i) => {
        const a = angle(i), lx = cx + (r + 14) * Math.cos(a), ly = cy + (r + 14) * Math.sin(a)
        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 7, fill: P, fontFamily: DM, fontWeight: 700 }}>{lbl}</text>
      })}
    </svg>
  )
}

/* ── Pulse wave ── */
function PulseWave() {
  const tick = useTick(65)
  const pts = useMemo(() => {
    const w = 220, h = 38
    return Array.from({ length: 61 }, (_, i) => {
      const x = (i / 60) * w
      const spike = i > 20 && i < 23 ? Math.sin((i - 20) * Math.PI) * 26 : 0
      const y = h / 2 - Math.sin((i / 60) * 2 * Math.PI * 3 + tick * 0.32) * 6 - spike
      return `${x},${y}`
    }).join(" ")
  }, [tick])
  return (
    <svg width={220} height={38} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={P} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Horizontal bars ── */
function HorizBars({ data }: { data: { plan: string; count: number; total: number }[] }) {
  const colors = [P, "#9333ea", "#a21caf", "#6d28d9"]
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
            <div style={{ height: 7, background: "#f3f0ff", borderRadius: 99 }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                style={{ height: "100%", background: `linear-gradient(90deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`, borderRadius: 99 }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Card wrapper with title + info tip ── */
function ChartCard({ title, info, children, extra }: { title: string; info: string; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: P }}>{title}</h3>
          <InfoTip text={info} />
        </div>
        {extra}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

/* ── Inline user row with management ── */
function UserRow({ user, onToggle, onDelete }: {
  user: User
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div style={{ borderBottom: "1px solid #f9f5ff" }}>
      {/* Main row */}
      <div onClick={() => { setExpanded(e => !e); setConfirmDelete(false) }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: 10, cursor: "pointer", transition: "background 0.15s", background: expanded ? "#faf8ff" : "transparent" }}
        onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = "#faf8ff" }}
        onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: user.is_active ? PL : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: user.is_active ? P : "#bbb", fontFamily: DM, fontSize: 13 }}>
            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111", fontFamily: DM }}>{user.name || "Sin nombre"}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#aaa", fontFamily: DM }}>{user.email}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: user.is_active ? "#f3f0ff" : "#f3f4f6", color: user.is_active ? P : "#bbb", fontFamily: DM }}>
            {user.is_active ? "Activo" : "Inactivo"}
          </span>
          <span style={{ fontSize: 11, color: "#ccc", fontFamily: DM }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}
            style={{ color: "#ccc", fontSize: 14, fontWeight: 700, lineHeight: 1 }}>›</motion.div>
        </div>
      </div>

      {/* Inline action panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "10px 14px 14px", background: "#faf8ff", borderRadius: "0 0 10px 10px", marginBottom: 4 }}>
              {!confirmDelete ? (
                <div style={{ display: "flex", gap: 8 }}>
                  {/* Toggle active */}
                  <button onClick={(e) => { e.stopPropagation(); onToggle(user.id, !user.is_active) }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: `1px solid ${PL}`, background: "#fff", cursor: "pointer", fontFamily: DM, fontSize: 12, fontWeight: 600, color: P, transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = PL}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    {user.is_active
                      ? <><ToggleLeft style={{ width: 14, height: 14 }} /> Desactivar</>
                      : <><ToggleRight style={{ width: 14, height: 14 }} /> Activar</>}
                  </button>
                  {/* Delete — shows confirm inline */}
                  <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff", cursor: "pointer", fontFamily: DM, fontSize: 12, fontWeight: 600, color: "#dc2626", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    <Trash2 style={{ width: 14, height: 14 }} /> Eliminar
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <AlertTriangle style={{ width: 14, height: 14, color: "#f59e0b", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontFamily: DM, color: "#555", flex: 1 }}>
                    ¿Eliminar a <strong>{user.name || user.email}</strong>? Esta acción es irreversible.
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(user.id); setExpanded(false) }}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 7, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontFamily: DM, fontSize: 12, fontWeight: 700 }}>
                    <Check style={{ width: 12, height: 12 }} /> Confirmar
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(false) }}
                    style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${PL}`, background: "#fff", color: P, cursor: "pointer", fontFamily: DM, fontSize: 12, fontWeight: 600 }}>
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

/* ── Image preview ── */
function ImagePreview({ img, onClose }: { img: GeneratedImage; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.88 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 16, overflow: "hidden", maxWidth: 480, width: "100%" }}>
        <img src={img.image_url} alt="Arte" style={{ width: "100%", display: "block" }} />
        <div style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: 11, color: "#aaa", fontFamily: DM }}>{new Date(img.generation_timestamp).toLocaleString()}</p>
          <button onClick={onClose} style={{ border: `1px solid ${PL}`, borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontFamily: DM, fontSize: 12, color: P, background: "#faf8ff" }}>Cerrar</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════ MAIN ═══════════════════════ */
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
      totalUsers: us.length,
      activeUsers: us.filter(u => u.is_active).length,
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

  const handleToggle = (id: string, active: boolean) => {
    localDB.updateUser(id, { is_active: active }); fetchData()
    toast.success(active ? "Usuario activado" : "Usuario desactivado")
  }
  const handleDelete = (id: string) => {
    localDB.deleteUser(id); fetchData()
    toast.success("Usuario eliminado")
  }

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
        <button onClick={() => navigate("/")} style={{ background: P, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontFamily: DM }}>Volver</button>
      </div>
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${PL}`, borderTop: `3px solid ${P}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: P, fontFamily: DM, fontSize: 13 }}>Cargando…</p>
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
      <header style={{ background: "#fff", borderBottom: "1px solid #f3f0ff", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(124,58,237,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ width: 140 }} />
          <h1 style={{ margin: 0, fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 20, color: P, textAlign: "center" }}>
            Noosfera Control Center
          </h1>
          <div style={{ width: 140, display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}>
            {/* En vivo — solo texto verde sin fondo ni borde */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, background: "#22c55e", borderRadius: "50%", display: "inline-block", animation: "pulse 1.4s infinite" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", fontFamily: DM }}>En vivo</span>
            </div>
            <button onClick={() => { localDB.clearCurrentUser(); navigate("/") }}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", border: `1px solid ${PL}`, borderRadius: 8, background: "#faf8ff", cursor: "pointer", color: P, fontFamily: DM, fontSize: 13, fontWeight: 600 }}>
              <LogOut style={{ width: 14, height: 14 }} /> Salir
            </button>
          </div>
        </div>
      </header>

      {/* ── GREETING ── */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: "#faf8ff", borderBottom: "1px solid #ede9fe", padding: "13px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontFamily: DM, fontSize: 15, color: "#111" }}>
          <span style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 17, color: P }}>Bienvenido, Admin</span>
          {" "}— {greeting}, bienvenido al panel de control de Noösfera.
        </p>
      </motion.div>

      <main style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "28px 24px", boxSizing: "border-box" }}>

        {/* ── SINGLE ORBITAL KPI CHART ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 17, fontWeight: 700, color: P }}>Resumen Global</h2>
            <InfoTip text="Gráfico orbital con los 4 indicadores clave de la plataforma: total de usuarios, activos, nuevos hoy e imágenes generadas. Cada anillo representa un indicador en tiempo real." />
          </div>
          <OrbitalKPI stats={stats} images={images.length} />
        </motion.div>

        {/* ── 6 CHARTS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 26 }}>

          {/* 1 Donut active */}
          <ChartCard title="Usuarios Activos" info="Proporción de usuarios activos respecto al total. El anillo se rellena en tiempo real.">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                {(() => {
                  const r = 50, c = 2 * Math.PI * r, pct = stats.totalUsers > 0 ? stats.activeUsers / stats.totalUsers : 0
                  return (
                    <svg width={116} height={116} style={{ transform: "rotate(-90deg)" }}>
                      <circle cx={58} cy={58} r={r} fill="none" stroke="#f3f0ff" strokeWidth="10" />
                      <motion.circle cx={58} cy={58} r={r} fill="none" stroke={P} strokeWidth="10" strokeLinecap="round"
                        initial={{ strokeDasharray: `0 ${c}` }}
                        animate={{ strokeDasharray: `${pct * c} ${c}` }}
                        transition={{ duration: 1 }} />
                    </svg>
                  )
                })()}
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: PLAYFAIR, fontSize: 22, fontWeight: 700, color: P }}>{stats.activeUsers}</span>
                  <span style={{ fontSize: 9, color: "#bbb", fontFamily: DM }}>de {stats.totalUsers}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[{ l: "Activos", v: stats.activeUsers, c: P }, { l: "Inactivos", v: stats.totalUsers - stats.activeUsers, c: "#ddd6fe" }].map(({ l, v, c }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                    <span style={{ fontSize: 11, color: "#555", fontFamily: DM }}>{l}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c, fontFamily: DM, marginLeft: 4 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* 2 Bar registrations */}
          <ChartCard title="Registros (7 días)" info="Nuevos usuarios registrados cada día durante la última semana.">
            <p style={{ margin: "0 0 10px", fontSize: 11, color: "#bbb", fontFamily: DM }}>Nuevos usuarios por día</p>
            <MiniBar data={weeklyData.some(v => v > 0) ? weeklyData : [0, 1, 0, 2, 1, 0, stats.newUsersToday]} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {["L", "M", "X", "J", "V", "S", "D"].map(d => (
                <span key={d} style={{ fontSize: 9, color: "#ddd", fontFamily: DM, flex: 1, textAlign: "center" }}>{d}</span>
              ))}
            </div>
          </ChartCard>

          {/* 3 Animated line — always moving */}
          <ChartCard title="Generaciones de Arte" info="Imágenes de arte generadas por IA por día en la última semana. La curva se anima continuamente." extra={
            <span style={{ fontSize: 11, color: "#bbb", fontFamily: DM }}>{images.length} total</span>
          }>
            <p style={{ margin: "0 0 10px", fontSize: 11, color: "#bbb", fontFamily: DM }}>Imágenes generadas por día</p>
            <AnimatedAreaLine data={imagesByDay} width={215} height={54} />
          </ChartCard>

          {/* 4 Plan bars */}
          <ChartCard title="Distribución de Planes" info="Cuántos usuarios tienen cada plan de suscripción (free, premium, etc.).">
            <HorizBars data={planData.length ? planData : [{ plan: "free", count: stats.totalUsers, total: stats.totalUsers }]} />
          </ChartCard>

          {/* 5 Radar — always animated */}
          <ChartCard title="Métricas Globales" info="Visualización hexagonal animada de 6 indicadores: activos, nuevos, arte generado, semana, retención y uso de IA. Se mueve en tiempo real.">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AnimatedRadar values={radarVals} labels={["Activos", "Nuevos", "Arte", "Semana", "Retención", "IA"]} size={145} />
            </div>
          </ChartCard>

          {/* 6 Pulse */}
          <ChartCard title="Actividad en Tiempo Real" info="Onda de pulso animada en tiempo real que refleja la actividad de la plataforma.">
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", animation: "pulse 1.2s infinite" }} />
              <span style={{ fontSize: 10, color: "#bbb", fontFamily: DM }}>señal activa</span>
            </div>
            <PulseWave />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              {[
                { l: "Última act.", v: lastUpdate.toLocaleTimeString(), c: "#333" },
                { l: "Esta semana", v: `${stats.newUsersWeek} nuevos`, c: P },
                { l: "Sesión", v: "Activa", c: "#22c55e" },
              ].map(({ l, v, c }) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 10, color: "#bbb", fontFamily: DM }}>{l}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 700, color: c, fontFamily: DM }}>{v}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* ── USERS + IMAGES ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Users with inline management */}
          <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f9f5ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 16, fontWeight: 700, color: P }}>Usuarios Registrados</h3>
                <InfoTip text="Lista de todos los usuarios. Haz clic en cualquier fila para desplegar opciones de gestión: activar/desactivar o eliminar con confirmación inline, sin ventanas emergentes." />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <RefreshCw style={{ width: 11, height: 11, color: "#ddd" }} />
                <span style={{ fontSize: 10, color: "#ddd", fontFamily: DM }}>{lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
            <div style={{ maxHeight: 360, overflowY: "auto", padding: "6px 10px" }}>
              {users.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 0" }}>
                  <Users style={{ width: 34, height: 34, color: "#ddd6fe", margin: "0 auto 8px" }} />
                  <p style={{ color: "#bbb", fontFamily: DM, fontSize: 13 }}>Sin usuarios aún</p>
                </div>
              ) : users.map(user => (
                <UserRow key={user.id} user={user} onToggle={handleToggle} onDelete={handleDelete} />
              ))}
            </div>
            <div style={{ padding: "8px 20px", borderTop: "1px solid #f9f5ff" }}>
              <p style={{ margin: 0, fontSize: 10, color: "#ddd", fontFamily: DM, textAlign: "center" }}>
                Clic en un usuario para gestionar → expandir acciones inline
              </p>
            </div>
          </div>

          {/* Images gallery */}
          <div style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f9f5ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 16, fontWeight: 700, color: P }}>Imágenes Generadas</h3>
                <InfoTip text="Galería global de todas las imágenes generadas por IA. Incluye imágenes de la demo y de usuarios reales. Clic en una imagen para verla en tamaño completo." />
              </div>
              <span style={{ padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: PL, color: P, fontFamily: DM }}>{images.length}</span>
            </div>
            <div style={{ padding: "12px 14px", maxHeight: 360, overflowY: "auto" }}>
              {images.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 0" }}>
                  <ImageIcon style={{ width: 34, height: 34, color: "#ddd6fe", margin: "0 auto 8px" }} />
                  <p style={{ color: "#bbb", fontFamily: DM, fontSize: 13 }}>Sin imágenes aún</p>
                  <p style={{ color: "#ddd", fontFamily: DM, fontSize: 11, marginTop: 4 }}>Las imágenes de demo y usuarios aparecerán aquí</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {images.map((img, i) => (
                    <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                      onClick={() => setPreviewImg(img)}
                      style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", cursor: "pointer", border: "2px solid #f3f0ff", background: "#f9f5ff" }}>
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
          &copy; 2026 <span style={{ color: P, fontWeight: 600 }}>Noosfera</span>.
        </p>
      </footer>

      {/* ── IMAGE MODAL ── */}
      <AnimatePresence>
        {previewImg && <ImagePreview img={previewImg} onClose={() => setPreviewImg(null)} />}
      </AnimatePresence>
    </div>
  )
}
