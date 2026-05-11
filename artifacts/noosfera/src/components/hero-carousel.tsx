import { motion } from "framer-motion"

interface HeroCarouselProps {
  onStartDemo: () => void
  onShowAuth: () => void
}

export function HeroCarousel({ onStartDemo, onShowAuth }: HeroCarouselProps) {
  return (
    <section className="bg-white py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">

          {/* Images — first on mobile, right on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="order-1 lg:order-2 w-full"
          >
            {/* Desktop mosaic: 1 large left + 2 stacked right */}
            <div
              className="hidden lg:grid gap-3 h-[460px]"
              style={{ gridTemplateColumns: "2fr 1fr", gridTemplateRows: "1fr 1fr" }}
            >
              <img
                src="/images/hero-main.png"
                alt="Arte digital principal"
                className="row-span-2 w-full h-full object-cover rounded-2xl"
                style={{ boxShadow: "0 20px 60px rgba(124,58,237,0.18)" }}
              />
              <img
                src="/images/hero-top.png"
                alt="Arte digital 2"
                className="w-full h-full object-cover rounded-2xl"
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              />
              <img
                src="/images/hero-bottom.png"
                alt="Arte digital 3"
                className="w-full h-full object-cover rounded-2xl"
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              />
            </div>

            {/* Mobile mosaic: same 3-image layout, smaller */}
            <div
              className="grid lg:hidden gap-2 w-full"
              style={{
                gridTemplateColumns: "2fr 1fr",
                gridTemplateRows: "1fr 1fr",
                height: "280px",
              }}
            >
              <img
                src="/images/hero-main.png"
                alt="Arte digital principal"
                className="row-span-2 w-full h-full object-cover rounded-xl"
                style={{ boxShadow: "0 10px 40px rgba(124,58,237,0.15)" }}
              />
              <img
                src="/images/hero-top.png"
                alt="Arte digital 2"
                className="w-full h-full object-cover rounded-xl"
              />
              <img
                src="/images/hero-bottom.png"
                alt="Arte digital 3"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </motion.div>

          {/* Text — second on mobile (below images), left on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 lg:order-1 text-center lg:text-left space-y-6"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
              Arte Cardíaco con IA
            </p>

            <h1
              className="text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.25rem] font-black text-gray-900 leading-[1.08] tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              La forma más<br />
              sencilla de crear<br />
              <span className="text-purple-600">NFTs únicos.</span>
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mx-auto lg:mx-0 max-w-md">
              Transforma tus latidos en obras de arte digital irrepetibles. Impulsado por nuestra
              comunidad de arte cardíaco con IA.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartDemo}
                className="px-8 py-4 rounded-full font-semibold text-white text-sm tracking-wide transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "#7c3aed" }}
              >
                Comenzar Demo
              </button>
              <button
                onClick={onShowAuth}
                className="px-8 py-4 rounded-full font-semibold text-white text-sm tracking-wide transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ backgroundColor: "#5b21b6" }}
              >
                Iniciar Sesión
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
