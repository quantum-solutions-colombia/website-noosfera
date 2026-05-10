"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Zap, LogIn, Crown, Check, TrendingUp, Image, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"

// Plans data - only the 3 plans that rotate on the right
interface Plan {
  id: number
  name: string
  price: string
  period: string
  features: string[]
  gradient: string
  icon: React.ReactNode
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 0,
    name: "Plan Free",
    price: "$0",
    period: "Gratis",
    features: ["10 capturas/mes", "5 NFTs/mes", "Resolucion estandar"],
    gradient: "from-gray-600 to-gray-700",
    icon: <Heart className="h-8 w-8 text-white" />,
  },
  {
    id: 1,
    name: "Plan Estandar",
    price: "$39.900",
    period: "COP/mes",
    features: ["Capturas ilimitadas", "50 NFTs/mes", "Sin marca de agua"],
    gradient: "from-blue-500 to-indigo-600",
    icon: <Zap className="h-8 w-8 text-white" />,
    popular: true,
  },
  {
    id: 2,
    name: "Plan Premium",
    price: "$89.900",
    period: "COP/mes",
    features: ["NFTs ilimitados", "Ultra 4K", "API + Soporte 24/7"],
    gradient: "from-violet-500 to-purple-600",
    icon: <Crown className="h-8 w-8 text-white" />,
  },
]

// FAQ data - only questions
interface FAQ {
  id: number
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    id: 0,
    question: "Puedo cambiar de plan en cualquier momento?",
    answer: "Si, puedes cambiar de plan o cancelar tu suscripcion en cualquier momento desde tu panel de control. Los cambios se reflejan en tu proximo ciclo de facturacion.",
  },
  {
    id: 1,
    question: "Que sucede con mis NFTs si cancelo?",
    answer: "Tus NFTs generados permanecen en tu cuenta de forma permanente. Solo perderas acceso a funcionalidades premium segun tu nuevo plan.",
  },
  {
    id: 2,
    question: "Hay descuento por suscripcion anual?",
    answer: "Si, todos nuestros planes ofrecen un 20% de descuento si te suscribes por un ano completo. El descuento se aplica automaticamente al seleccionar facturacion anual.",
  },
  {
    id: 3,
    question: "Que metodos de pago aceptan?",
    answer: "Aceptamos tarjetas de credito/debito, transferencias bancarias y billeteras digitales. Los pagos se procesan de forma segura con encriptacion SSL.",
  },
]

// Business model features
const businessFeatures = [
  {
    icon: Heart,
    title: "Captura tu Ritmo",
    description: "Conecta tu dispositivo y captura tus patrones cardiacos unicos en tiempo real.",
    color: "emerald"
  },
  {
    icon: Image,
    title: "Genera Arte NFT",
    description: "Nuestra IA transforma tus latidos en obras de arte digital unicas e irrepetibles.",
    color: "blue"
  },
  {
    icon: Wallet,
    title: "Monetiza",
    description: "Vende tus NFTs cardiacos en las principales plataformas y genera ingresos.",
    color: "violet"
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState(0)
  const [currentFAQ, setCurrentFAQ] = useState(0)

  // Auto-rotate plans carousel (only the 3 plans)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlan((prev) => (prev + 1) % plans.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate FAQ carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFAQ((prev) => (prev + 1) % faqs.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-emerald-50/30 isolate">
      <header className="w-full px-4 py-6 z-50 bg-white border-b border-gray-100 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <Heart className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Noosfera
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Inicio
            </Link>
            <Link href="/company" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Quienes Somos
            </Link>
            <Link href="/pricing" className="text-emerald-600 font-medium">
              Planes
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Documentacion
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/auth/login")}
              className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20 hover:border-emerald-500/40"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Iniciar Sesion
            </Button>
          </div>
        </div>
      </header>

      {/* Plans Section - Static text left, rotating plans right */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Static Text Content - Left Side */}
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Planes de Suscripcion
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Elige el Plan Perfecto para Ti
                </h2>
                <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                  Comienza gratis y actualiza cuando estes listo para monetizar tus patrones cardiacos. Todos los planes incluyen actualizaciones automaticas.
                </p>
              </div>
            </div>

            {/* Rotating Plan Cards - Right Side */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className={`relative w-64 md:w-72 rounded-2xl bg-gradient-to-br ${plans[currentPlan].gradient} p-5 shadow-xl transition-all duration-500`}>
                {plans[currentPlan].popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    Popular
                  </div>
                )}
                
                <div className="flex justify-center mb-3">
                  <div className="bg-white/20 p-2.5 rounded-xl">
                    {plans[currentPlan].icon}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white text-center mb-1">
                  {plans[currentPlan].name}
                </h3>
                
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-white">{plans[currentPlan].price}</span>
                  <span className="text-white/80 text-sm ml-1">{plans[currentPlan].period}</span>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {plans[currentPlan].features.map((feature, index) => (
                    <li key={index} className="flex items-center text-white/90 text-sm">
                      <Check className="h-4 w-4 mr-2 text-white flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  size="sm"
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                  onClick={() => router.push("/auth/login")}
                >
                  Comenzar Ahora
                </Button>
              </div>
            </div>
          </div>

          {/* Carousel Indicators for Plans */}
          <div className="flex justify-center gap-3 mt-12">
            {plans.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPlan(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentPlan
                    ? "w-8 h-3 bg-emerald-500"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Ver plan ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Business Model Section - Cards without badge */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Monetiza tu Ritmo Cardiaco Unico
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Cada latido capturado es unico e irrepetible. Convierte tus patrones de ritmo cardiaco en activos digitales valiosos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {businessFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-gray-200 hover:border-emerald-200 transition-all hover:shadow-lg bg-white">
                <CardContent className="p-8 text-center">
                  <div className={`bg-${feature.color}-100 p-4 rounded-2xl w-fit mb-6 mx-auto`}>
                    <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section - Centered text only, no images */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Preguntas Frecuentes
            </h2>
            
            <div className="min-h-[200px] flex flex-col justify-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 transition-all duration-500">
                {faqs[currentFAQ].question}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed transition-all duration-500">
                {faqs[currentFAQ].answer}
              </p>
            </div>

            {/* Carousel Indicators for FAQ */}
            <div className="flex justify-center gap-3 pt-8">
              {faqs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFAQ(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentFAQ
                      ? "w-8 h-3 bg-emerald-500"
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ver pregunta ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Comienza a Monetizar Hoy</h2>
          <p className="text-gray-600 mb-8">
            Unete a miles de creadores que ya estan ganando dinero con sus patrones cardiacos unicos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => router.push("/auth/login")}
            >
              Comenzar Ahora
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/docs")}>
              Conocer Mas
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
