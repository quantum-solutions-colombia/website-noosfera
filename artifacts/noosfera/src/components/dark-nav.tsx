import { useLocation, Link } from "wouter"

interface DarkNavProps {
  activeLink?: "home" | "company" | "pricing" | "docs"
}

export function DarkNav({ activeLink }: DarkNavProps) {
  const [, navigate] = useLocation()

  const links = [
    { href: "/", label: "Inicio", key: "home" },
    { href: "/company", label: "Quiénes Somos", key: "company" },
    { href: "/pricing", label: "Planes", key: "pricing" },
    { href: "/docs", label: "Documentación", key: "docs" },
  ] as const

  return (
    <header className="w-full px-4 py-5 z-50 sticky top-0 backdrop-blur-xl border-b"
      style={{ backgroundColor: "rgba(11,11,18,0.92)", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-xl font-bold text-[#f0ece0] tracking-tight">
          Noosfera
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label, key }) => (
            <Link key={key} href={href}
              className={`text-sm tracking-wide transition-colors ${
                activeLink === key
                  ? "text-[#f59e0b] font-medium"
                  : "text-[#8a8898] hover:text-[#f0ece0]"
              }`}>
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => navigate("/auth/login")}
          className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#f59e0b] hover:text-[#fbbf24] transition-colors">
          — Iniciar Sesión
        </button>
      </div>
    </header>
  )
}
