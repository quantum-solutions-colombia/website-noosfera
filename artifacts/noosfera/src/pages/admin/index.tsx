

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Users, Shield, LogOut, UserPlus, UserCheck, Brain, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLocation } from "wouter"
import { localDB } from "@/lib-app/local-storage"
import { toast } from "react-hot-toast"

interface User {
  id: string
  name: string | null
  email: string | null
  plan: string
  createdAt: string
  is_active: boolean
  lastLogin: string | null
}

function getAdminGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) return "Buenos días, Admin"
  if (hour >= 12 && hour < 18) return "Buenas tardes, Admin"
  return "Buenas noches, Admin"
}

export default function AdminDashboard() {
  const [, navigate] = useLocation()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    newUsersWeek: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const greeting = useMemo(() => getAdminGreeting(), [])

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        const currentUserId = localDB.getCurrentUser()

        if (!currentUserId) {
          toast.error("Debes iniciar sesion")
          navigate("/auth/login")
          return
        }

        const user = localDB.getUserById(currentUserId)

        const ADMIN_EMAILS = ["admin@noosfera.com", "noosferasuperadmin@gmail.com"]
        if (!user || !ADMIN_EMAILS.includes(user.email)) {
          toast.error("No tienes permisos de administrador")
          navigate("/")
          return
        }

        setIsAdminUser(true)
        fetchData()
      } catch (err) {
        console.error("Error in admin check:", err)
        setLoading(false)
      }
    }

    checkAdminAndFetchData()

    const interval = setInterval(() => {
      if (isAdminUser) {
        fetchData()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [navigate, isAdminUser])

  const fetchData = () => {
    try {
      const usersData = localDB.getUsers()

      const today = new Date().toISOString().split("T")[0]
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const weekAgoStr = weekAgo.toISOString().split("T")[0]

      const totalUsers = usersData.length
      const activeUsers = usersData.filter((u) => u.is_active).length
      const newUsersToday = usersData.filter((u) => u.createdAt && u.createdAt.split("T")[0] === today).length
      const newUsersWeek = usersData.filter((u) => u.createdAt && u.createdAt.split("T")[0] >= weekAgoStr).length

      setUsers(usersData)
      setStats({ totalUsers, activeUsers, newUsersToday, newUsersWeek })
      setLastUpdate(new Date())
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localDB.clearCurrentUser()
    navigate("/")
  }

  const CircularProgress = ({ value, max, label, color }: { value: number; max: number; label: string; color: string }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0
    const radius = 60
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-36 h-36">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle cx="72" cy="72" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-violet-100" />
            <circle
              cx="72" cy="72" r={radius}
              stroke="currentColor" strokeWidth="10" fill="transparent"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" className={color}
              style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-violet-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{value}</span>
            <span className="text-xs text-violet-400">de {max}</span>
          </div>
        </div>
        <span className="mt-3 text-sm font-medium text-violet-700">{label}</span>
      </div>
    )
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center">
        <Card className="p-8 text-center border-violet-200">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">Acceso denegado. Solo administradores autorizados.</p>
          <Button onClick={() => navigate("/")} className="bg-violet-600 hover:bg-violet-700">Volver al inicio</Button>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-violet-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #faf5ff 0%, #f5f3ff 50%, #ede9fe 100%)" }}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-violet-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-violet-100 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h1
                  className="text-xl font-bold text-violet-900"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Panel de Administración
                </h1>
                <p className="text-sm text-violet-500 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Noösfera · Control Center
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-violet-50 text-violet-600 border-violet-200">
                <span className="w-2 h-2 bg-violet-500 rounded-full mr-2 animate-pulse"></span>
                En vivo
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Greeting banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: "linear-gradient(90deg, #ede9fe, #fff, #ede9fe)", borderBottom: "1px solid #ddd6fe" }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)" }}>
            <Brain className="h-5 w-5 text-white" />
          </div>
          <p className="text-violet-800 font-medium text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span className="font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#7c3aed" }}>
              Bienvenido, Admin
            </span>
            {" "}— {greeting.replace("Admin", "").trim()}, bienvenido al panel de control de Noösfera.
          </p>
        </div>
      </motion.div>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Usuarios", value: stats.totalUsers, icon: <Users className="h-6 w-6 text-violet-600" />, bg: "bg-violet-100", border: "border-violet-100", delay: 0.1 },
            { label: "Activos", value: stats.activeUsers, icon: <UserCheck className="h-6 w-6 text-purple-600" />, bg: "bg-purple-100", border: "border-purple-100", delay: 0.2 },
            { label: "Nuevos Hoy", value: stats.newUsersToday, icon: <UserPlus className="h-6 w-6 text-fuchsia-600" />, bg: "bg-fuchsia-100", border: "border-fuchsia-100", delay: 0.3 },
            { label: "Esta Semana", value: stats.newUsersWeek, icon: <Brain className="h-6 w-6 text-indigo-600" />, bg: "bg-indigo-100", border: "border-indigo-100", delay: 0.4 },
          ].map(({ label, value, icon, bg, border, delay }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
              <Card className={`bg-white/80 backdrop-blur ${border}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-violet-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
                      <p className="text-3xl font-bold text-violet-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{value}</p>
                    </div>
                    <div className={`${bg} p-3 rounded-full`}>{icon}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Circular Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/80 backdrop-blur border-violet-100 h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-violet-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-8">
                  <CircularProgress value={stats.activeUsers} max={stats.totalUsers} label="Usuarios Activos" color="text-violet-500" />
                  <CircularProgress value={stats.newUsersWeek} max={stats.totalUsers} label="Nuevos (7 días)" color="text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/80 backdrop-blur border-violet-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-violet-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                    Usuarios Registrados
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-violet-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <RefreshCw className="h-4 w-4" />
                    <span>Actualizado: {lastUpdate.toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {users.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-violet-50/60 rounded-lg hover:bg-violet-100/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={user.is_active ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-500"}>
                            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-violet-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {user.name || "Sin nombre"}
                          </p>
                          <p className="text-sm text-violet-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={user.is_active ? "default" : "secondary"}
                          className={user.is_active ? "bg-violet-100 text-violet-700 hover:bg-violet-100" : ""}
                        >
                          {user.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                        <div className="text-right">
                          <p className="text-xs text-violet-400">Registro</p>
                          <p className="text-sm font-medium text-violet-700">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {users.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-violet-200 mx-auto mb-3" />
                      <p className="text-violet-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>No hay usuarios registrados</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
