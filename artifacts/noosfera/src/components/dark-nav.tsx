import { Link, useLocation } from "wouter"

interface DarkNavProps {
  activeLink?: "home" | "company" | "pricing" | "docs"
}

export function DarkNav({ activeLink }: DarkNavProps) {
  const [, navigate] = useLocation()

  const links = [
    { href: "/", label: "Inicio", key: "home" },
    { href: "/company", label: "Acerca de", key: "company" },
    { href: "/pricing", label: "Planes", key: "pricing" },
    { href: "/docs", label: "Documentación", key: "docs" },
  ] as const

  return (
    <header className="w-full px-4 py-4 z-50 sticky top-0 bg-white border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/"
          className="text-xl font-black text-gray-900 tracking-tight"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Noosfera
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label, key }) => (
            <Link key={key} href={href}
              className={`text-sm font-medium transition-colors ${
                activeLink === key
                  ? "text-purple-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}>
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => navigate("/auth/login")}
          className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#7c3aed" }}>
          Iniciar Sesión
        </button>
      </div>
    </header>
  )
}
