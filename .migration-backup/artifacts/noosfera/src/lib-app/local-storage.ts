// Tipos de datos
export interface User {
  id: string
  name: string
  email: string
  password: string // encriptado básicamente
  avatar?: string
  role: "user" | "admin" | "researcher"
  plan: "free" | "premium"
  is_active: boolean
  createdAt: string
  lastLogin: string
  updatedAt: string
  preferences: {
    theme?: "light"
    notifications: boolean
    tutorialCompleted: boolean
  }
}

export interface BCISession {
  id: string
  user_id: string
  created_at: string
  device_type?: string
  duration_minutes?: number
}

export interface BrainPulse {
  id: string
  user_id: string
  session_id?: string
  wave_type: string
  frequency: number
  amplitude: number
  created_at: string
}

export interface GeneratedImage {
  id: string
  user_id: string
  session_id?: string
  image_url: string
  processing_time_ms: number
  generation_timestamp: string
}

// Claves de localStorage
const STORAGE_KEYS = {
  USERS: "noosfera_users",
  SESSIONS: "noosfera_sessions",
  PULSES: "noosfera_pulses",
  IMAGES: "noosfera_images",
  CURRENT_USER: "noosfera_current_user",
}

// Utilidades de localStorage
class LocalStorageDB {
  // Usuarios
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS)
    return data ? JSON.parse(data) : []
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  }

  getUserById(id: string): User | null {
    const users = this.getUsers()
    return users.find((u) => u.id === id) || null
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers()
    return users.find((u) => u.email === email) || null
  }

  addUser(user: User): void {
    const users = this.getUsers()
    users.push(user)
    this.saveUsers(users)
  }

  updateUser(id: string, updates: Partial<User>): void {
    const users = this.getUsers()
    const index = users.findIndex((u) => u.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() }
      this.saveUsers(users)
    }
  }

  deleteUser(id: string): void {
    const users = this.getUsers()
    const filtered = users.filter((u) => u.id !== id)
    this.saveUsers(filtered)
  }

  // Sesiones BCI
  getSessions(): BCISession[] {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS)
    return data ? JSON.parse(data) : []
  }

  saveSessions(sessions: BCISession[]): void {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions))
  }

  addSession(session: BCISession): void {
    const sessions = this.getSessions()
    sessions.push(session)
    this.saveSessions(sessions)
  }

  // Pulsos cerebrales
  getPulses(): BrainPulse[] {
    const data = localStorage.getItem(STORAGE_KEYS.PULSES)
    return data ? JSON.parse(data) : []
  }

  savePulses(pulses: BrainPulse[]): void {
    localStorage.setItem(STORAGE_KEYS.PULSES, JSON.stringify(pulses))
  }

  addPulse(pulse: BrainPulse): void {
    const pulses = this.getPulses()
    pulses.push(pulse)
    this.savePulses(pulses)
  }

  // Imágenes generadas
  getImages(): GeneratedImage[] {
    const data = localStorage.getItem(STORAGE_KEYS.IMAGES)
    return data ? JSON.parse(data) : []
  }

  saveImages(images: GeneratedImage[]): void {
    localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images))
  }

  addImage(image: GeneratedImage): void {
    const images = this.getImages()
    images.push(image)
    this.saveImages(images)
  }

  // Usuario actual
  getCurrentUser(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  }

  setCurrentUser(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId)
  }

  clearCurrentUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }

  // Inicializar datos de demostración
  initializeDemoData(): void {
    // Solo inicializar si no hay usuarios
    if (this.getUsers().length === 0) {
      const demoUser: User = {
        id: "demo-001",
        name: "Usuario Demo",
        email: "demo@noosfera.com",
        password: simpleHash("demo123"),
        role: "user",
        plan: "free",
        is_active: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          theme: "light",
          notifications: true,
          tutorialCompleted: false,
        },
      }

      const adminUser: User = {
        id: "admin-001",
        name: "Administrador",
        email: "admin@noosfera.com",
        password: simpleHash("admin123"),
        role: "admin",
        plan: "premium",
        is_active: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          theme: "light",
          notifications: true,
          tutorialCompleted: true,
        },
      }

      this.addUser(demoUser)
      this.addUser(adminUser)
    }
  }
}

export const localDB = new LocalStorageDB()

// Generar ID único
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Simular hash simple (en producción usar bcrypt o similar)
export function simpleHash(password: string): string {
  return btoa(password) // Base64 básico, NO seguro para producción real
}

export function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash
}
