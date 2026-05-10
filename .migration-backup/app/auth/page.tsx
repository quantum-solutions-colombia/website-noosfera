"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Heart, Eye, EyeOff, ArrowRight, UserPlus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "react-hot-toast"

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, register, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "register") {
      setActiveTab("register")
    }
  }, [searchParams])

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginData.email || !loginData.password) {
      toast.error("Por favor completa todos los campos")
      return
    }

    if (loginData.email === "admin@noosfera.com") {
      toast.error("El acceso de administrador no está disponible desde aquí")
      return
    }

    const success = await login(loginData.email, loginData.password)
    if (success) {
      router.push("/dashboard")
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast.error("Por favor completa todos los campos")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (registerData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    const success = await register(registerData.name, registerData.email, registerData.password)
    if (success) {
      router.push("/dashboard")
    }
  }

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-emerald-500/10 p-3 rounded-full">
              <Heart className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Noosfera</h1>
          <p className="text-gray-500 text-sm mt-1">Sistema de Monitoreo Cardíaco</p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "register"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <motion.form
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLoginSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                  Correo Electrónico
                </Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="correo@gmail.com"
                  value={loginData.email}
                  onChange={handleLoginInputChange}
                  disabled={isLoading}
                  className="h-12 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    disabled={isLoading}
                    className="h-12 bg-gray-50 border-gray-200 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Verificando..." : "Acceder al sistema"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400">O continúa con</span>
                </div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center gap-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </button>
            </motion.form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <motion.form
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-sm font-medium text-gray-700">
                  Tu Nombre
                </Label>
                <Input
                  id="register-name"
                  name="name"
                  type="text"
                  placeholder="Juan"
                  value={registerData.name}
                  onChange={handleRegisterInputChange}
                  disabled={isLoading}
                  className="h-12 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                  Correo Electrónico
                </Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="correo@gmail.com"
                  value={registerData.email}
                  onChange={handleRegisterInputChange}
                  disabled={isLoading}
                  className="h-12 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={registerData.password}
                    onChange={handleRegisterInputChange}
                    disabled={isLoading}
                    className="h-12 bg-gray-50 border-gray-200 rounded-lg pr-12 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password" className="text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterInputChange}
                    disabled={isLoading}
                    className="h-12 bg-gray-50 border-gray-200 rounded-lg pr-12 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear mi cuenta"}
                {!isLoading && <UserPlus className="h-4 w-4" />}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400">O regístrate con</span>
                </div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center gap-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </button>
            </motion.form>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-emerald-500/10 p-3 rounded-full">
              <Heart className="h-8 w-8 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Noosfera</h1>
          <p className="text-gray-500 text-sm mt-1">Cargando...</p>
        </div>
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
