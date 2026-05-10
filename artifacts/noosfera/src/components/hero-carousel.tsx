import { motion } from "framer-motion"

interface HeroCarouselProps {
  onStartDemo: () => void
  onShowAuth: () => void
}

export function HeroCarousel({ onStartDemo, onShowAuth }: HeroCarouselProps) {
  return (
    <section className="bg-white py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

          {/* Left — Text content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-7"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
              Arte Biométrico con IA
            </p>

            <h1
              className="text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.25rem] font-black text-gray-900 leading-[1.08] tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              La forma más<br />
              sencilla de crear<br />
              <span className="text-purple-600">NFTs únicos.</span>
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
              Transforma tus latidos en obras de arte digital irrepetibles. Impulsado por nuestra
              comunidad de arte biométrico con IA.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onStartDemo}
                className="px-8 py-4 rounded-full font-semibold text-white text-sm tracking-wide transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "#7c3aed" }}
              >
                Comenzar Gratis
              </button>
              <button
                onClick={onShowAuth}
                className="px-8 py-4 rounded-full font-semibold text-gray-700 text-sm tracking-wide border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Iniciar Sesión
              </button>
            </div>
          </motion.div>

          {/* Right — Image mosaic (1 large left + 2 stacked right) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="hidden lg:grid gap-3 h-[480px]"
            style={{ gridTemplateColumns: "2fr 1fr", gridTemplateRows: "1fr 1fr" }}
          >
            <img
              src="/images/hero-main.png"
              alt="Arte cardiaco NFT principal"
              className="row-span-2 w-full h-full object-cover rounded-2xl"
              style={{ boxShadow: "0 20px 60px rgba(124,58,237,0.15)" }}
            />
            <img
              src="/images/hero-top.png"
              alt="Arte NFT biométrico"
              className="w-full h-full object-cover rounded-2xl"
              style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            />
            <img
              src="/images/hero-bottom.png"
              alt="Corazón digital NFT"
              className="w-full h-full object-cover rounded-2xl"
              style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            />
          </motion.div>

          {/* Mobile: single image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:hidden"
          >
            <img
              src="/images/hero-main.png"
              alt="Arte cardiaco NFT"
              className="w-full rounded-2xl object-cover max-h-72"
              style={{ boxShadow: "0 20px 60px rgba(124,58,237,0.15)" }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
