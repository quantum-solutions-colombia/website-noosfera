"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Eye, EyeOff, ArrowLeft, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "react-hot-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error("Por favor completa todos los campos")
      return
    }

    // Verificar que sea una cuenta de administrador
    if (formData.email !== "admin@noosfera.com") {
      toast.error("Acceso no autorizado. Esta area es solo para administradores.")
      return
    }

    const success = await login(formData.email, formData.password)
    if (success) {
      router.push("/admin")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-amber-500/20 p-3 rounded-full border border-amber-500/30">
                <Shield className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Panel de Administracion</CardTitle>
            <CardDescription className="text-slate-400">
              Acceso restringido para administradores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Correo de Administrador</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@noosfera.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Contrasena</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contrasena"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white" 
                disabled={isLoading}
              >
                <Lock className="mr-2 h-4 w-4" />
                {isLoading ? "Verificando..." : "Acceder al Panel"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/")} 
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
