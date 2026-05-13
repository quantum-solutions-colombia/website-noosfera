
import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react"
import { useLocation, useSearch, Link } from "wouter"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "react-hot-toast"
import { Footer } from "@/components/footer"

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

function AuthContent() {
  const [, navigate] = useLocation()
  const search = useSearch()
  const { login, register, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirmPassword: "" })

  useEffect(() => {
    const params = new URLSearchParams(search)
    if (params.get("tab") === "register") setActiveTab("register")
  }, [search])

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
    if (success) { setActiveTab("login"); toast.success("¡Cuenta creada! Ahora inicia sesión") }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation header */}
      <header className="w-full px-6 py-4 z-50 bg-white border-b border-gray-100 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/"
            className="text-xl font-black text-gray-900 tracking-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Noosfera
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "/", label: "Inicio" },
              { href: "/company", label: "Quiénes Somos" },
              { href: "/pricing", label: "Planes" },
              { href: "/docs", label: "Documentación" },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                {label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => navigate("/auth")}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#7c3aed" }}>
            Iniciar Sesión
          </button>
        </div>
      </header>

      {/* Auth hero area */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-4 py-10"
        style={{
          backgroundImage: "url('/images/castle-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          minHeight: 520,
        }}>

        {/* Dark overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(10,4,30,0.80) 0%, rgba(30,10,60,0.76) 100%)",
          backdropFilter: "blur(2px)",
        }} />

        {/* Card container */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative", zIndex: 1,
            width: "100%", maxWidth: 380,
            background: "#fff",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.45), 0 4px 20px rgba(124,58,237,0.2)",
          }}>

          {/* Hero image inside card */}
          <div style={{ position: "relative", height: 130, flexShrink: 0 }}>
            <img
              src="/images/castle-bg.png"
              alt="Castillo"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(20,5,40,0.75) 100%)"
            }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 22,
                color: "#fff", letterSpacing: "-0.3px", textAlign: "center",
                textShadow: "0 2px 20px rgba(124,58,237,0.8), 0 2px 12px rgba(0,0,0,0.6)"
              }}>
                Bienvenido a Noosfera
              </span>
            </div>
          </div>

          {/* Form section */}
          <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Headline */}
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, color: "#111", margin: 0, lineHeight: 1.35 }}>
                {activeTab === "login"
                  ? "Inicia sesión para explorar el arte cardíaco con IA"
                  : "Crea tu cuenta y empieza a crear"}
              </h2>
              <p style={{ color: "#888", fontSize: 11.5, marginTop: 4 }}>
                {activeTab === "login"
                  ? "Si eres nuevo, ¡registrarte solo te llevará un momento!"
                  : "Únete a miles de artistas digitales en Noosfera"}
              </p>
            </div>

            {/* Google button */}
            <button
              onClick={() => toast("Inicio con Google próximamente", { icon: "🚀" })}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", padding: "10px 0",
                border: "1.5px solid #e5e7eb", borderRadius: 10,
                background: "#fff", cursor: "pointer",
                fontWeight: 600, fontSize: 13, color: "#111",
                transition: "background 0.18s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f7f7f7")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>
              <GoogleIcon />
              Continuar con Google
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
              <span style={{ color: "#bbb", fontSize: 10, fontWeight: 500 }}>o</span>
              <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
            </div>

            {/* Tab switcher */}
            <div style={{ display: "flex", background: "#f5f5f7", borderRadius: 10, padding: 3 }}>
              {(["login", "register"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer",
                    fontWeight: 600, fontSize: 12,
                    background: activeTab === tab ? "#fff" : "transparent",
                    color: activeTab === tab ? "#111" : "#999",
                    boxShadow: activeTab === tab ? "0 1px 6px rgba(0,0,0,0.10)" : "none",
                    transition: "all 0.2s",
                  }}>
                  {tab === "login" ? "Iniciar Sesión" : "Registrarse"}
                </button>
              ))}
            </div>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {activeTab === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleLoginSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#444" }}>Correo Electrónico</label>
                    <input
                      type="email" name="email" placeholder="correo@gmail.com"
                      value={loginData.email}
                      onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))}
                      disabled={isLoading}
                      style={{
                        padding: "9px 11px", borderRadius: 9, border: "1.5px solid #e5e7eb",
                        fontSize: 13, outline: "none", background: "#fafafa", color: "#111",
                        transition: "border-color 0.18s",
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = "#7c3aed" }}
                      onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb" }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#444" }}>Contraseña</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"} name="password" placeholder="Tu contraseña"
                        value={loginData.password}
                        onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                        disabled={isLoading}
                        style={{
                          width: "100%", padding: "9px 38px 9px 11px", borderRadius: 9,
                          border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none",
                          background: "#fafafa", color: "#111", boxSizing: "border-box",
                          transition: "border-color 0.18s",
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = "#7c3aed" }}
                        onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb" }}
                      />
                      <button type="button" onClick={() => setShowPassword(p => !p)}
                        style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit" disabled={isLoading}
                    style={{
                      width: "100%", padding: "11px 0", borderRadius: 10, border: "none",
                      background: "#7c3aed", color: "#fff", fontWeight: 700, fontSize: 13,
                      cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      marginTop: 1,
                    }}>
                    {isLoading ? "Verificando..." : <><span>Acceder</span><ArrowRight className="h-4 w-4" /></>}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleRegisterSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                  {[
                    { label: "Tu Nombre", name: "name", type: "text", placeholder: "Juan García", value: registerData.name },
                    { label: "Correo Electrónico", name: "email", type: "email", placeholder: "correo@gmail.com", value: registerData.email },
                  ].map(field => (
                    <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#444" }}>{field.label}</label>
                      <input
                        type={field.type} name={field.name} placeholder={field.placeholder}
                        value={field.value}
                        onChange={e => setRegisterData(p => ({ ...p, [e.target.name]: e.target.value }))}
                        disabled={isLoading}
                        style={{
                          padding: "9px 11px", borderRadius: 9, border: "1.5px solid #e5e7eb",
                          fontSize: 13, outline: "none", background: "#fafafa", color: "#111",
                          transition: "border-color 0.18s",
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = "#7c3aed" }}
                        onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb" }}
                      />
                    </div>
                  ))}

                  {[
                    { label: "Contraseña", name: "password", placeholder: "Mínimo 6 caracteres", show: showPassword, toggle: () => setShowPassword(p => !p), value: registerData.password },
                    { label: "Confirmar Contraseña", name: "confirmPassword", placeholder: "Repite tu contraseña", show: showConfirmPassword, toggle: () => setShowConfirmPassword(p => !p), value: registerData.confirmPassword },
                  ].map(field => (
                    <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#444" }}>{field.label}</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={field.show ? "text" : "password"} name={field.name} placeholder={field.placeholder}
                          value={field.value}
                          onChange={e => setRegisterData(p => ({ ...p, [e.target.name]: e.target.value }))}
                          disabled={isLoading}
                          style={{
                            width: "100%", padding: "9px 38px 9px 11px", borderRadius: 9,
                            border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none",
                            background: "#fafafa", color: "#111", boxSizing: "border-box",
                            transition: "border-color 0.18s",
                          }}
                          onFocus={e => { e.currentTarget.style.borderColor = "#7c3aed" }}
                          onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb" }}
                        />
                        <button type="button" onClick={field.toggle}
                          style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>
                          {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit" disabled={isLoading}
                    style={{
                      width: "100%", padding: "11px 0", borderRadius: 10, border: "none",
                      background: "#7c3aed", color: "#fff", fontWeight: 700, fontSize: 13,
                      cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      marginTop: 1,
                    }}>
                    {isLoading ? "Creando cuenta..." : <><span>Crear mi cuenta</span><UserPlus className="h-4 w-4" /></>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Security note */}
            <p style={{ textAlign: "center", fontSize: 10, color: "#bbb", lineHeight: 1.5 }}>
              Este sitio está protegido por reCAPTCHA y se aplican la{" "}
              <span style={{ color: "#7c3aed" }}>Política de Privacidad</span> y los{" "}
              <span style={{ color: "#7c3aed" }}>Términos de Servicio</span>.
            </p>
          </div>
        </motion.div>

        {/* Volver a inicio — below the form */}
        <div style={{ position: "relative", zIndex: 1, marginTop: 18 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.80)", fontSize: 13, fontWeight: 500,
              textDecoration: "underline", textUnderlineOffset: 3,
              transition: "color 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff" }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.80)" }}>
            ← Volver a inicio
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function AuthPage() {
  return <AuthContent />
}
