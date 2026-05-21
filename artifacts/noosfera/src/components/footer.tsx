import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "wouter"
import { Brain } from "lucide-react"
import React from "react"

const SOCIAL_HREFS: Record<string, string> = {
  facebook: "https://facebook.com/noosfera",
  instagram: "https://instagram.com/noosfera",
  tiktok: "https://tiktok.com/@noosfera",
  whatsapp: "https://wa.me/573001234567",
}

const BRAND_COLORS: Record<string, { backgroundColor?: string; backgroundImage?: string }> = {
  facebook:  { backgroundColor: "#1877F2" },
  instagram: { backgroundImage: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" },
  tiktok:    { backgroundColor: "#ff0050" },
  whatsapp:  { backgroundColor: "#25D366" },
}

const ICONS: Record<string, React.ReactNode> = {
  facebook: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
      <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  tiktok: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  whatsapp: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
}

export function Footer({ waveBg = "#7c3aed" }: { waveBg?: string } = {}) {
  const currentYear = new Date().getFullYear()
  const [selected, setSelected] = useState<string | null>(null)

  const handleSocialClick = (network: string) => {
    setSelected(prev => prev === network ? null : network)
  }

  return (
    <footer style={{ backgroundColor: "#0a0a0a" }}>
      {/* Wave SVG transition: CTA → black footer */}
      <div style={{ lineHeight: 0, backgroundColor: waveBg, marginBottom: -1 }}>
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: 80 }}>
          <path
            d="M0,0 C320,90 580,90 860,28 C1020,0 1220,52 1440,18 L1440,80 L0,80 Z"
            fill="#0a0a0a"
          />
        </svg>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center">

          <motion.div className="mb-8"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2">
              <img src="/favicon-brain.png" alt="Noosfera" style={{ width: 28, height: 28, objectFit: "contain" }} />
              <span className="text-2xl font-black text-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Noosfera
              </span>
            </div>
          </motion.div>

          <motion.div className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
            {(["facebook", "instagram", "tiktok", "whatsapp"] as const).map((network) => {
              const isSelected = selected === network
              const brandStyle = isSelected ? BRAND_COLORS[network] : {}
              return (
                <motion.a
                  key={network}
                  href={SOCIAL_HREFS[network]}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(network)}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{
                    backgroundColor: isSelected ? undefined : "#1a1a1a",
                    border: isSelected
                      ? "1px solid transparent"
                      : "1px solid rgba(255,255,255,0.12)",
                    transition: "background-color 0.2s ease, background-image 0.2s ease",
                    ...brandStyle,
                  }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  title={network}>
                  {ICONS[network]}
                </motion.a>
              )
            })}
          </motion.div>

          <motion.p className="text-gray-400 font-medium mb-8 text-center text-sm tracking-wide"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
            Convierte latidos en arte digital
          </motion.p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

      <div className="container mx-auto px-4 py-6">
        <motion.div className="flex flex-wrap justify-center items-center gap-2 text-sm"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}>
          <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
            Política de Cookies
          </Link>
          <span className="text-gray-600 mx-1">&#8226;</span>
          <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
            Términos y Condiciones
          </Link>
          <span className="text-gray-600 mx-1">&#8226;</span>
          <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
            Política de Privacidad
          </Link>
        </motion.div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

      <div className="container mx-auto px-4 py-5">
        <p className="text-center text-gray-600 text-sm">
          &copy; {currentYear} Noosfera.
        </p>
      </div>
    </footer>
  )
}
