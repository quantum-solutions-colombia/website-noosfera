
import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Eye, EyeOff, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocation } from "wouter"
import { localDB, simpleHash } from "@/lib-app/local-storage"
import { toast } from "react-hot-toast"

const SUPER_ADMIN_EMAIL = "noosferasuperadmin@gmail.com"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) return "¡Buenos días, Admin!"
  if (hour >= 12 && hour < 18) return "¡Buenas tardes, Admin!"
  return "¡Buenas noches, Admin!"
}

export default function AdminLoginPage() {
  const [, navigate] = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const isSuperAdmin = email.trim().toLowerCase() === SUPER_ADMIN_EMAIL

  useEffect(() => {
    localDB.initializeDemoData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Por favor ingresa tu correo")
      return
    }

    setIsLoading(true)

    try {
      if (isSuperAdmin) {
        // Acceso directo por reconocimiento de correo
        const userData = localDB.getUserByEmail(SUPER_ADMIN_EMAIL)
        if (userData) {
          localDB.updateUser(userData.id, { lastLogin: new Date().toISOString() })
          localDB.setCurrentUser(userData.id)
          toast.success(getGreeting())
          navigate("/admin")
        } else {
          toast.error("Error al acceder. Recarga la página e intenta de nuevo.")
        }
        return
      }

      // Login normal con contraseña para otros admins
      if (!password) {
        toast.error("Por favor ingresa tu contraseña")
        return
      }

      const userData = localDB.getUserByEmail(email)
      if (!userData || userData.role !== "admin") {
        toast.error("Acceso no autorizado. Esta área es solo para administradores.")
        return
      }

      if (simpleHash(password) !== userData.password) {
        toast.error("Contraseña incorrecta")
        return
      }

      localDB.updateUser(userData.id, { lastLogin: new Date().toISOString() })
      localDB.setCurrentUser(userData.id)
      toast.success("Acceso concedido")
      navigate("/admin")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/10 px-8 py-6 text-center border-b border-slate-700">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-amber-500/20 p-3 rounded-full border border-amber-500/30">
                <Shield className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
            <p className="text-slate-400 text-sm mt-1">Acceso restringido para administradores</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Correo de Administrador
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors pr-10"
                  />
                  {isSuperAdmin && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
                  )}
                </div>

                {/* Admin recognized banner */}
                <AnimatePresence>
                  {isSuperAdmin && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
                    >
                      <Sparkles className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <p className="text-emerald-300 text-sm font-medium">
                        Administrador reconocido — acceso directo habilitado
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Password field — only shown for non-super-admin */}
              <AnimatePresence>
                {!isSuperAdmin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-sm font-medium text-slate-300">Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: isSuperAdmin ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #d97706, #b45309)" }}
              >
                <Shield className="h-4 w-4" />
                {isLoading ? "Verificando..." : isSuperAdmin ? "Acceder como Super Admin" : "Acceder al Panel"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-slate-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
