
import type React from "react"
import { useState, Suspense, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Eye, EyeOff, ArrowRight, UserPlus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLocation, useSearch } from "wouter"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "react-hot-toast"

function AuthContent() {
  const [, navigate] = useLocation()
  const search = useSearch()
  const { login, register, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  useEffect(() => {
    const params = new URLSearchParams(search)
    if (params.get("tab") === "register") setActiveTab("register")
  }, [search])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirmPassword: "" })

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginData.email || !loginData.password) { toast.error("Por favor completa todos los campos"); return }
    if (loginData.email === "admin@noosfera.com") { toast.error("El acceso de administrador no está disponible desde aquí"); return }
    const success = await login(loginData.email, loginData.password)
    if (success) navigate("/dashboard")
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) { toast.error("Por favor completa todos los campos"); return }
    if (registerData.password !== registerData.confirmPassword) { toast.error("Las contraseñas no coinciden"); return }
    if (registerData.password.length < 6) { toast.error("La contraseña debe tener al menos 6 caracteres"); return }
    const success = await register(registerData.name, registerData.email, registerData.password)
    if (success) navigate("/dashboard")
  }

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setRegisterData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-emerald-500/10 p-3 rounded-full">
              <Heart className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Noosfera</h1>
          <p className="text-gray-500 text-sm mt-1">Sistema de Monitoreo Cardíaco</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button type="button" onClick={() => setActiveTab("login")} className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Iniciar Sesión</button>
            <button type="button" onClick={() => setActiveTab("register")} className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Registrarse</button>
          </div>
          {activeTab === "login" && (
            <motion.form initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Correo Electrónico</Label>
                <Input id="login-email" name="email" type="email" placeholder="correo@gmail.com" value={loginData.email} onChange={handleLoginInputChange} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <div className="relative">
                  <Input id="login-password" name="password" type={showPassword ? "text" : "password"} placeholder="Tu contraseña" value={loginData.password} onChange={handleLoginInputChange} disabled={isLoading} className="pr-12" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isLoading}>
                {isLoading ? "Verificando..." : <>Acceder al sistema <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </motion.form>
          )}
          {activeTab === "register" && (
            <motion.form initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Tu Nombre</Label>
                <Input id="register-name" name="name" type="text" placeholder="Juan" value={registerData.name} onChange={handleRegisterInputChange} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Correo Electrónico</Label>
                <Input id="register-email" name="email" type="email" placeholder="correo@gmail.com" value={registerData.email} onChange={handleRegisterInputChange} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Contraseña</Label>
                <div className="relative">
                  <Input id="register-password" name="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres" value={registerData.password} onChange={handleRegisterInputChange} disabled={isLoading} className="pr-12" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input id="register-confirm-password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirma tu contraseña" value={registerData.confirmPassword} onChange={handleRegisterInputChange} disabled={isLoading} className="pr-12" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : <>Crear mi cuenta <UserPlus className="ml-2 h-4 w-4" /></>}
              </Button>
            </motion.form>
          )}
        </div>
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />Volver al inicio
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center">
        <Heart className="h-8 w-8 text-emerald-500 animate-pulse mx-auto" />
        <p className="text-gray-500 text-sm mt-2">Cargando...</p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthContent />
    </Suspense>
  )
}
