"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Shield, LogOut, UserPlus, UserCheck, Heart, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { localDB } from "@/lib/local-storage"
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

export default function AdminDashboard() {
  const router = useRouter()
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

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        const currentUserId = localDB.getCurrentUser()

        if (!currentUserId) {
          toast.error("Debes iniciar sesion")
          router.push("/auth/login")
          return
        }

        const user = localDB.getUserById(currentUserId)

        if (!user || user.email !== "admin@noosfera.com") {
          toast.error("No tienes permisos de administrador")
          router.push("/")
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

    // Real-time updates every 3 seconds
    const interval = setInterval(() => {
      if (isAdminUser) {
        fetchData()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [router, isAdminUser])

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
      setStats({
        totalUsers,
        activeUsers,
        newUsersToday,
        newUsersWeek,
      })
      setLastUpdate(new Date())
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localDB.clearCurrentUser()
    router.push("/")
  }

  // Circular Progress Component
  const CircularProgress = ({ value, max, label, color }: { value: number; max: number; label: string; color: string }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0
    const radius = 60
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-36 h-36">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-gray-100"
            />
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={color}
              style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            <span className="text-xs text-gray-500">de {max}</span>
          </div>
        </div>
        <span className="mt-3 text-sm font-medium text-gray-600">{label}</span>
      </div>
    )
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">Acceso denegado. Solo administradores autorizados.</p>
          <Button onClick={() => router.push("/")}>Volver al inicio</Button>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel de Administracion</h1>
                <p className="text-sm text-gray-500">Noosfera - Tiempo Real</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
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

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white/80 backdrop-blur border-emerald-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Usuarios</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/80 backdrop-blur border-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Activos</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <UserCheck className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/80 backdrop-blur border-amber-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Nuevos Hoy</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.newUsersToday}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <UserPlus className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/80 backdrop-blur border-rose-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Esta Semana</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.newUsersWeek}</p>
                  </div>
                  <div className="bg-rose-100 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-rose-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Circular Charts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/80 backdrop-blur border-emerald-100 h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Estadisticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-8">
                  <CircularProgress 
                    value={stats.activeUsers} 
                    max={stats.totalUsers} 
                    label="Usuarios Activos" 
                    color="text-emerald-500" 
                  />
                  <CircularProgress 
                    value={stats.newUsersWeek} 
                    max={stats.totalUsers} 
                    label="Nuevos (7 dias)" 
                    color="text-blue-500" 
                  />
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
            <Card className="bg-white/80 backdrop-blur border-emerald-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Usuarios Registrados
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
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
                      className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={user.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>
                            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.name || "Sin nombre"}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={user.is_active ? "default" : "secondary"}
                          className={user.is_active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                        >
                          {user.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Registro</p>
                          <p className="text-sm font-medium text-gray-700">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {users.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No hay usuarios registrados</p>
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
