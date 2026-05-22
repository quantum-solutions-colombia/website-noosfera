import { useEffect, useState } from "react"
import { useLocation, useSearch } from "wouter"
import UserDashboardNew from "@/components/user-dashboard-new"
import SimpleDemo from "@/components/simple-demo"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const [, navigate] = useLocation()
  const search = useSearch()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [isDemoMode, setIsDemoMode] = useState<boolean | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(search)
    const mode = params.get("mode")
    const isDemoUser = user?.email === "demo@noosfera.com"
    setIsDemoMode(mode === "demo" || isDemoUser)
  }, [search, user])

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.email === "admin@noosfera.com") {
      navigate("/admin")
    }
  }, [isAuthenticated, isLoading, user, navigate])

  if (isLoading || isDemoMode === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }

  if (isAuthenticated && user?.email === "admin@noosfera.com") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Redirigiendo al panel de administracion...</div>
      </div>
    )
  }

  if (isDemoMode) return <SimpleDemo />
  if (isAuthenticated) return <SimpleDemo />

  navigate("/auth/login")
  return null
}
