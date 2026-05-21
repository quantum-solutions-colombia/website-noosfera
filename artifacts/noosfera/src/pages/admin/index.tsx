import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, Shield, LogOut, UserPlus, UserCheck, Brain,
  RefreshCw, ImageIcon, Activity, TrendingUp, Zap, Clock, Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLocation } from "wouter"
import { localDB } from "@/lib-app/local-storage"
import type { GeneratedImage } from "@/lib-app/local-storage"
import { toast } from "react-hot-toast"

const PURPLE = "#7c3aed"
const PURPLE_LIGHT = "#ede9fe"
const PLAYFAIR = "'Playfair Display', Georgia, serif"
const DM_SANS = "'DM Sans', sans-serif"

interface User {
  id: string
  name: string | null
  email: string | null
  plan: string
  createdAt: string
  is_active: boolean
  lastLogin: string | null
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h >= 6 && h < 12) return "Buenos días"
  if (h >= 12 && h < 18) return "Buenas tardes"
  return "Buenas noches"
}

function useTick(ms = 1000) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ms)
    return () => clearInterval(id)
  }, [ms])
  return tick
}

function DonutChart({ value, max, color = PURPLE, size = 120 }: { value: number; max: number; color?: string; size?: number }) {
  const r = size / 2 - 10
  const circ = 2 * Math.PI * r
  const pct = max > 0 ? value / max : 0
  const offset = circ * (1 - pct)
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f0ff" strokeWidth="10" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  )
}

function MiniBarChart({ data, color = PURPLE }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 50 }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
          style={{ flex: 1, background: color, borderRadius: "3px 3px 0 0", opacity: 0.7 + 0.3 * (v / max) }}
        />
      ))}
    </div>
  )
}

function LineChart({ data, color = PURPLE, width = 220, height = 60 }: { data: number[]; color?: string; width?: number; height?: number }) {
  if (data.length < 2) return null
  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - (v / max) * (height - 8) - 4
    return `${x},${y}`
  })
  const fill = pts.map((p, i) => {
    if (i === 0) return `M ${p}`
    return `L ${p}`
  }).join(" ")
  const area = `${fill} L ${width},${height} L 0,${height} Z`
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg1)" />
      <path d={fill} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - (v / max) * (height - 8) - 4}
          r="3.5" fill={color} stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  )
}

function RadarChart({ values, labels, color = PURPLE, size = 110 }: { values: number[]; labels: string[]; color?: string; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 18
  const n = values.length
  const angle = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2
  const pts = values.map((v, i) => {
    const a = angle(i)
    const rv = (v / 100) * r
    return { x: cx + rv * Math.cos(a), y: cy + rv * Math.sin(a) }
  })
  const grid = [0.33, 0.66, 1].map(scale => {
    const gpts = Array.from({ length: n }, (_, i) => {
      const a = angle(i)
      return `${cx + r * scale * Math.cos(a)},${cy + r * scale * Math.sin(a)}`
    }).join(" ")
    return gpts
  })
  const polyPts = pts.map(p => `${p.x},${p.y}`).join(" ")
  return (
    <svg width={size} height={size}>
      {grid.map((g, i) => <polygon key={i} points={g} fill="none" stroke="#ede9fe" strokeWidth="1" />)}
      {Array.from({ length: n }, (_, i) => (
        <line key={i} x1={cx} y1={cy}
          x2={cx + r * Math.cos(angle(i))} y2={cy + r * Math.sin(angle(i))}
          stroke="#ddd6fe" strokeWidth="1" />
      ))}
      <polygon points={polyPts} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {labels.map((lbl, i) => {
        const a = angle(i)
        const lx = cx + (r + 12) * Math.cos(a)
        const ly = cy + (r + 12) * Math.sin(a)
        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 7, fill: "#7c3aed", fontFamily: DM_SANS, fontWeight: 600 }}>{lbl}</text>
      })}
    </svg>
  )
}

function PulseWave({ tick }: { tick: number }) {
  const pts = useMemo(() => {
    const w = 220, h = 40
    const points: string[] = []
    for (let i = 0; i <= 60; i++) {
      const x = (i / 60) * w
      const phase = i / 60 * 2 * Math.PI
      const spike = i > 20 && i < 23 ? Math.sin((i - 20) * Math.PI) * 30 : 0
      const y = h / 2 - Math.sin(phase * 3 + tick * 0.4) * 6 - spike
      points.push(`${x},${y}`)
    }
    return points.join(" ")
  }, [tick])
  return (
    <svg width={220} height={40} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function AdminDashboard() {
  const [, navigate] = useLocation()
  const [users, setUsers] = useState<User[]>([])
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, newUsersToday: 0, newUsersWeek: 0 })
  const [loading, setLoading] = useState(true)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [previewImg, setPreviewImg] = useState<GeneratedImage | null>(null)
  const tick = useTick(80)
  const greeting = useMemo(() => getGreeting(), [])

  useEffect(() => {
    const check = async () => {
      const uid = localDB.getCurrentUser()
      if (!uid) { toast.error("Debes iniciar sesion"); navigate("/auth/login"); return }
      const user = localDB.getUserById(uid)
      const ADMINS = ["admin@noosfera.com", "noosferasuperadmin@gmail.com"]
      if (!user || !ADMINS.includes(user.email)) { toast.error("Sin permisos"); navigate("/"); return }
      setIsAdminUser(true)
      fetchData()
    }
    check()
    const iv = setInterval(() => { if (isAdminUser) fetchData() }, 3000)
    return () => clearInterval(iv)
  }, [navigate, isAdminUser])

  const fetchData = () => {
    try {
      const usersData = localDB.getUsers()
      const imagesData = localDB.getImages()
      const today = new Date().toISOString().split("T")[0]
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
      const weekAgoStr = weekAgo.toISOString().split("T")[0]
      setUsers(usersData)
      setImages(imagesData)
      setStats({
        totalUsers: usersData.length,
        activeUsers: usersData.filter(u => u.is_active).length,
        newUsersToday: usersData.filter(u => u.createdAt?.split("T")[0] === today).length,
        newUsersWeek: usersData.filter(u => u.createdAt?.split("T")[0] >= weekAgoStr).length,
      })
      setLastUpdate(new Date())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => { localDB.clearCurrentUser(); navigate("/") }

  const weeklyData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split("T")[0]
    })
    return days.map(day => users.filter(u => u.createdAt?.split("T")[0] === day).length)
  }, [users])

  const imagesByDay = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split("T")[0]
    })
    return days.map(day => images.filter(img => img.generation_timestamp?.split("T")[0] === day).length)
  }, [images])

  const planData = useMemo(() => {
    const plans: Record<string, number> = {}
    users.forEach(u => { plans[u.plan || "free"] = (plans[u.plan || "free"] || 0) + 1 })
    return Object.entries(plans).map(([plan, count]) => ({ plan, count }))
  }, [users])

  const radarValues = useMemo(() => {
    const t = stats.totalUsers || 1
    return [
      Math.min(100, (stats.activeUsers / t) * 100),
      Math.min(100, (stats.newUsersToday / Math.max(t, 1)) * 100 * 5),
      Math.min(100, (images.length / Math.max(t, 1)) * 20),
      Math.min(100, (stats.newUsersWeek / Math.max(t, 1)) * 100),
      Math.min(100, (stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100),
      Math.min(100, images.length > 0 ? 80 : 20),
    ]
  }, [stats, images])

  if (!isAdminUser && !loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <Shield style={{ width: 48, height: 48, color: "#ef4444", margin: "0 auto 16px" }} />
          <p style={{ color: "#ef4444", fontFamily: DM_SANS, marginBottom: 16 }}>Acceso denegado.</p>
          <button onClick={() => navigate("/")} style={{ background: PURPLE, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontFamily: DM_SANS }}>Volver</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: `3px solid ${PURPLE_LIGHT}`, borderTop: `3px solid ${PURPLE}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: PURPLE, fontFamily: DM_SANS }}>Cargando datos…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: DM_SANS, display: "flex", flexDirection: "column" }}>

      {/* ── HEADER ── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #f3f0ff", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(124,58,237,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, background: `linear-gradient(135deg, ${PURPLE}, #9333ea)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain style={{ width: 20, height: 20, color: "#fff" }} />
            </div>
            <span style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 18, color: PURPLE }}>Noosfera</span>
          </div>

          {/* Centered title */}
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <h1 style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 20, color: PURPLE, margin: 0, letterSpacing: "-0.3px" }}>
              Noosfera Control Center
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, border: `1px solid ${PURPLE_LIGHT}`, background: "#faf8ff" }}>
              <span style={{ width: 7, height: 7, background: "#22c55e", borderRadius: "50%", display: "inline-block", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: PURPLE, fontFamily: DM_SANS }}>En vivo</span>
            </div>
            <button
              onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", border: "1px solid #fecaca", borderRadius: 8, background: "#fff5f5", cursor: "pointer", color: "#dc2626", fontFamily: DM_SANS, fontSize: 13, fontWeight: 600 }}>
              <LogOut style={{ width: 14, height: 14 }} /> Salir
            </button>
          </div>
        </div>
      </header>

      {/* ── GREETING ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ background: "#faf8ff", borderBottom: "1px solid #ede9fe", padding: "14px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontFamily: DM_SANS, fontSize: 15, color: "#111" }}>
          <span style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 17, color: PURPLE }}>Bienvenido, Admin</span>
          {" "}— {greeting}, bienvenido al panel de control de Noösfera.
        </p>
      </motion.div>

      <main style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "32px 24px", boxSizing: "border-box" }}>

        {/* ── KPI STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Usuarios", value: stats.totalUsers, icon: <Users style={{ width: 22, height: 22, color: PURPLE }} />, bg: "#f3f0ff" },
            { label: "Activos", value: stats.activeUsers, icon: <UserCheck style={{ width: 22, height: 22, color: "#9333ea" }} />, bg: "#faf0ff" },
            { label: "Nuevos Hoy", value: stats.newUsersToday, icon: <UserPlus style={{ width: 22, height: 22, color: "#a21caf" }} />, bg: "#fdf4ff" },
            { label: "Imágenes", value: images.length, icon: <ImageIcon style={{ width: 22, height: 22, color: "#6d28d9" }} />, bg: "#ede9fe" },
          ].map(({ label, value, icon, bg }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: "#666", fontFamily: DM_SANS, fontWeight: 500 }}>{label}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 36, fontWeight: 700, fontFamily: PLAYFAIR, color: PURPLE, lineHeight: 1 }}>{value}</p>
                </div>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── 6 CHARTS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 32 }}>

          {/* Chart 1: Donut — Active users */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <h3 style={{ margin: "0 0 16px", fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Usuarios Activos</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <DonutChart value={stats.activeUsers} max={stats.totalUsers} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: PLAYFAIR, fontSize: 24, fontWeight: 700, color: PURPLE }}>{stats.activeUsers}</span>
                  <span style={{ fontSize: 10, color: "#888", fontFamily: DM_SANS }}>de {stats.totalUsers}</span>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: PURPLE, display: "inline-block" }} />
                  <span style={{ fontSize: 12, color: "#333", fontFamily: DM_SANS }}>Activos</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: PURPLE, fontFamily: DM_SANS, marginLeft: "auto" }}>{stats.activeUsers}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ede9fe", display: "inline-block" }} />
                  <span style={{ fontSize: 12, color: "#333", fontFamily: DM_SANS }}>Inactivos</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#888", fontFamily: DM_SANS, marginLeft: "auto" }}>{stats.totalUsers - stats.activeUsers}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chart 2: Bars — Registrations last 7 days */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
            style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <h3 style={{ margin: "0 0 4px", fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Registros (7 días)</h3>
            <p style={{ margin: "0 0 14px", fontSize: 11, color: "#888", fontFamily: DM_SANS }}>Nuevos usuarios por día</p>
            <MiniBarChart data={weeklyData.length ? weeklyData : [0, 1, 0, 2, 1, 0, stats.newUsersToday]} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              {["L", "M", "X", "J", "V", "S", "D"].map(d => (
                <span key={d} style={{ fontSize: 9, color: "#aaa", fontFamily: DM_SANS, flex: 1, textAlign: "center" }}>{d}</span>
              ))}
            </div>
          </motion.div>

          {/* Chart 3: Line — Image generations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
            style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <h3 style={{ margin: "0 0 4px", fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Generaciones de Arte</h3>
            <p style={{ margin: "0 0 14px", fontSize: 11, color: "#888", fontFamily: DM_SANS }}>Imágenes generadas por día</p>
            <LineChart data={imagesByDay.length ? imagesByDay : [0, 0, 1, 0, 2, 1, images.length]} width={220} height={56} />
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#333", fontFamily: DM_SANS }}>
              Total: <strong style={{ color: PURPLE }}>{images.length}</strong> imágenes
            </p>
          </motion.div>

          {/* Chart 4: Horizontal bars — Plan distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
            style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <h3 style={{ margin: "0 0 16px", fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Distribución de Planes</h3>
            {(planData.length ? planData : [{ plan: "free", count: stats.totalUsers }]).map(({ plan, count }, i) => {
              const colors = [PURPLE, "#9333ea", "#a21caf", "#6d28d9"]
              const pct = stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0
              return (
                <div key={plan} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#333", fontFamily: DM_SANS, textTransform: "capitalize" }}>{plan}</span>
                    <span style={{ fontSize: 12, color: colors[i % colors.length], fontFamily: DM_SANS, fontWeight: 700 }}>{count}</span>
                  </div>
                  <div style={{ height: 8, background: "#f3f0ff", borderRadius: 99 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                      style={{ height: "100%", background: colors[i % colors.length], borderRadius: 99 }}
                    />
                  </div>
                </div>
              )
            })}
          </motion.div>

          {/* Chart 5: Radar — Platform metrics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}
            style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <h3 style={{ margin: "0 0 10px", fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Métricas Globales</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <RadarChart values={radarValues} labels={["Activos", "Nuevos", "Arte", "Semana", "Retención", "IA"]} size={130} />
            </div>
          </motion.div>

          {/* Chart 6: Live pulse wave */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 700, color: PURPLE }}>Actividad en Tiempo Real</h3>
              <span style={{ width: 7, height: 7, background: "#22c55e", borderRadius: "50%", display: "inline-block", animation: "pulse 1.2s infinite" }} />
            </div>
            <div style={{ overflow: "hidden" }}>
              <PulseWave tick={tick} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 11, color: "#888", fontFamily: DM_SANS }}>Última act.</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 700, color: "#333", fontFamily: DM_SANS }}>{lastUpdate.toLocaleTimeString()}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 11, color: "#888", fontFamily: DM_SANS }}>Esta semana</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 700, color: PURPLE, fontFamily: DM_SANS }}>{stats.newUsersWeek} nuevos</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 11, color: "#888", fontFamily: DM_SANS }}>Sesión</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 700, color: "#22c55e", fontFamily: DM_SANS }}>Activa</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── USERS TABLE ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f9f5ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 16, fontWeight: 700, color: PURPLE }}>Usuarios Registrados</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RefreshCw style={{ width: 13, height: 13, color: "#aaa" }} />
                <span style={{ fontSize: 11, color: "#aaa", fontFamily: DM_SANS }}>{lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto", padding: "10px 16px" }}>
              {users.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Users style={{ width: 40, height: 40, color: "#ddd6fe", margin: "0 auto 10px" }} />
                  <p style={{ color: "#bbb", fontFamily: DM_SANS, fontSize: 13 }}>Sin usuarios aún</p>
                </div>
              ) : users.map((user, i) => (
                <motion.div key={user.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px", borderBottom: "1px solid #faf8ff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: user.is_active ? PURPLE_LIGHT : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: user.is_active ? PURPLE : "#999", fontFamily: DM_SANS, fontSize: 14 }}>
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111", fontFamily: DM_SANS }}>{user.name || "Sin nombre"}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#888", fontFamily: DM_SANS }}>{user.email}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, fontFamily: DM_SANS, background: user.is_active ? "#f3f0ff" : "#f3f4f6", color: user.is_active ? PURPLE : "#999" }}>
                      {user.is_active ? "Activo" : "Inactivo"}
                    </span>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: 10, color: "#aaa", fontFamily: DM_SANS }}>Registro</p>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#333", fontFamily: DM_SANS }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── GENERATED IMAGES ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }}
            style={{ background: "#fff", border: "1px solid #f3f0ff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
            <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f9f5ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontFamily: PLAYFAIR, fontSize: 16, fontWeight: 700, color: PURPLE }}>Imágenes Generadas</h3>
              <span style={{ padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#f3f0ff", color: PURPLE, fontFamily: DM_SANS }}>{images.length} total</span>
            </div>
            <div style={{ padding: "14px 16px", maxHeight: 320, overflowY: "auto" }}>
              {images.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <ImageIcon style={{ width: 40, height: 40, color: "#ddd6fe", margin: "0 auto 10px" }} />
                  <p style={{ color: "#bbb", fontFamily: DM_SANS, fontSize: 13 }}>Sin imágenes generadas aún</p>
                  <p style={{ color: "#ccc", fontFamily: DM_SANS, fontSize: 11 }}>Las imágenes de demo y usuarios aparecerán aquí</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {images.map((img, i) => (
                    <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      onClick={() => setPreviewImg(img)}
                      style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden", cursor: "pointer", border: "2px solid #f3f0ff", background: "#f9f5ff" }}>
                      <img src={img.image_url} alt="Arte generado"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "rgba(124,58,237,0)", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.35)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(124,58,237,0)")}>
                        <Eye style={{ width: 20, height: 20, color: "#fff", opacity: 0 }} className="hover-show" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #f3f0ff", background: "#fff", padding: "16px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#999", fontFamily: DM_SANS }}>
          &copy; 2026 <span style={{ color: PURPLE, fontWeight: 600 }}>Noosfera</span>. Todos los derechos reservados.
        </p>
      </footer>

      {/* ── IMAGE PREVIEW MODAL ── */}
      <AnimatePresence>
        {previewImg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPreviewImg(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 16, overflow: "hidden", maxWidth: 500, width: "100%" }}>
              <img src={previewImg.image_url} alt="Arte" style={{ width: "100%", display: "block" }} />
              <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: "#888", fontFamily: DM_SANS }}>Generada: {new Date(previewImg.generation_timestamp).toLocaleString()}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#bbb", fontFamily: DM_SANS }}>ID: {previewImg.id.slice(0, 16)}…</p>
                </div>
                <button onClick={() => setPreviewImg(null)}
                  style={{ border: "1px solid #f3f0ff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: DM_SANS, fontSize: 13, color: PURPLE, background: "#faf8ff" }}>
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
        @keyframes spin { to { transform: rotate(360deg) } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px }
        ::-webkit-scrollbar-track { background: #faf8ff }
        ::-webkit-scrollbar-thumb { background: #ddd6fe; border-radius: 99px }
      `}</style>
    </div>
  )
}
