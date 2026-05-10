"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { localDB, generateId, simpleHash, verifyPassword, type User as DBUser } from "@/lib/local-storage"

// Tipos para el contexto de autenticación
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "admin" | "researcher"
  plan: "free" | "premium"
  createdAt: Date
  lastLogin: Date
  preferences: {
    theme?: "light"
    notifications: boolean
    tutorialCompleted: boolean
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  completeTutorial: () => void
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    localDB.initializeDemoData()

    const checkSession = () => {
      try {
        const currentUserId = localDB.getCurrentUser()
        if (currentUserId) {
          const userData = localDB.getUserById(currentUserId)
          if (userData) {
            const userObj: User = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              avatar: userData.avatar,
              role: userData.role,
              plan: userData.plan || "free",
              createdAt: new Date(userData.createdAt),
              lastLogin: new Date(userData.lastLogin),
              preferences: userData.preferences,
            }
            setUser(userObj)
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const userData = localDB.getUserByEmail(email)

      if (!userData) {
        toast.error("Usuario no encontrado")
        return false
      }

      if (!verifyPassword(password, userData.password)) {
        toast.error("Contraseña incorrecta")
        return false
      }

      if (!userData.is_active) {
        toast.error("Usuario inactivo")
        return false
      }

      // Actualizar último login
      localDB.updateUser(userData.id, { lastLogin: new Date().toISOString() })
      localDB.setCurrentUser(userData.id)

      const userObj: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        role: userData.role,
        plan: userData.plan || "free",
        createdAt: new Date(userData.createdAt),
        lastLogin: new Date(),
        preferences: userData.preferences,
      }

      setUser(userObj)
      setIsAuthenticated(true)
      toast.success("Inicio de sesion exitoso")
      return true
    } catch (error) {
      console.error("Error during login:", error)
      toast.error("Error al iniciar sesión")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Verificar si el usuario ya existe
      const existingUser = localDB.getUserByEmail(email)
      if (existingUser) {
        toast.error("El email ya está registrado")
        return false
      }

      const now = new Date().toISOString()
      const newUser: DBUser = {
        id: generateId(),
        name,
        email,
        password: simpleHash(password),
        role: "user",
        plan: "free",
        is_active: true,
        createdAt: now,
        lastLogin: now,
        updatedAt: now,
        preferences: {
          theme: "light",
          notifications: true,
          tutorialCompleted: false,
        },
      }

      localDB.addUser(newUser)
      toast.success("Registro exitoso. Ya puedes iniciar sesión")
      return true
    } catch (error) {
      console.error("Error during registration:", error)
      toast.error("Error al registrar usuario")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setIsLoading(true)
    try {
      localDB.clearCurrentUser()
      setUser(null)
      setIsAuthenticated(false)
      toast.success("Sesión cerrada")
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
      toast.error("Error al cerrar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para actualizar datos del usuario
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)

      // Actualizar en localStorage
      localDB.updateUser(user.id, {
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        preferences: updatedUser.preferences,
      })

      toast.success("Perfil actualizado")
    }
  }

  // Función para marcar el tutorial como completado
  const completeTutorial = () => {
    if (user) {
      const updatedPreferences = {
        ...user.preferences,
        tutorialCompleted: true,
      }
      setUser({
        ...user,
        preferences: updatedPreferences,
      })

      localDB.updateUser(user.id, { preferences: updatedPreferences })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        completeTutorial,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
