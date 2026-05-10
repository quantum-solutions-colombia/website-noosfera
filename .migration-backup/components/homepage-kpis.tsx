"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, TrendingUp, DollarSign } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const creatorEarningsDataFinal = [
  { name: "Ganancia Creador", value: 85, color: "#10b981" },
  { name: "Comision Plataforma", value: 15, color: "#e5e7eb" },
]

const salesDistributionDataFinal = [
  { name: "Ventas Directas", value: 60, color: "#3b82f6" },
  { name: "Subastas", value: 25, color: "#8b5cf6" },
  { name: "Regalias", value: 15, color: "#f59e0b" },
]

const revenueGrowthDataFinal = [
  { name: "Ingresos Activos", value: 70, color: "#10b981" },
  { name: "Potencial", value: 30, color: "#e5e7eb" },
]

// Custom hook for animating chart data
function useAnimatedChartData<T extends { value: number }[]>(
  finalData: T,
  isInView: boolean,
  duration: number = 1500
): T {
  const [animatedData, setAnimatedData] = useState<T>(
    finalData.map(item => ({ ...item, value: 0 })) as T
  )

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedData(
        finalData.map(item => ({
          ...item,
          value: Math.round(item.value * easeOut),
        })) as T
      )

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, finalData, duration])

  return animatedData
}

// Custom hook for animating a number
function useAnimatedNumber(
  finalValue: number,
  isInView: boolean,
  duration: number = 1500
): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setValue(Math.round(finalValue * easeOut))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, finalValue, duration])

  return value
}

export function HomepageKPIs() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  // Animated data for each chart
  const creatorEarningsData = useAnimatedChartData(creatorEarningsDataFinal, isInView)
  const salesDistributionData = useAnimatedChartData(salesDistributionDataFinal, isInView, 1800)
  const revenueGrowthData = useAnimatedChartData(revenueGrowthDataFinal, isInView, 2000)

  // Animated numbers for display
  const animatedPercent1 = useAnimatedNumber(85, isInView)
  const animatedPercent3 = useAnimatedNumber(70, isInView, 2000)

  return (
    <section 
      ref={sectionRef}
      className="container mx-auto px-4 py-20 bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/50"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Tu Ganancia al Crear y Vender
          </h2>
        </motion.div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubre como funciona el modelo de ganancias en Noosfera y maximiza tus ingresos
        </p>
      </motion.div>

      {/* 3 Circular Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Chart 1 - Creator Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="border-emerald-100 hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                Ganancia del Creador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={creatorEarningsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {creatorEarningsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, '']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                <p className="text-3xl font-bold text-emerald-600">{animatedPercent1}%</p>
                <p className="text-sm text-gray-600">De cada venta es tuya</p>
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-gray-600">Tu ganancia</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <span className="text-gray-600">Comision</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart 2 - Sales Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="border-blue-100 hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                <div className="p-2 rounded-lg bg-blue-100">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                Tipos de Venta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {salesDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, '']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                <p className="text-3xl font-bold text-blue-600">3</p>
                <p className="text-sm text-gray-600">Formas de monetizar</p>
              </div>
              <div className="flex justify-center gap-3 mt-4 text-xs flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">Directas</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                  <span className="text-gray-600">Subastas</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-gray-600">Regalias</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart 3 - Revenue Growth */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Card className="border-violet-100 hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                <div className="p-2 rounded-lg bg-violet-100">
                  <Heart className="h-4 w-4 text-violet-600" />
                </div>
                Potencial de Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueGrowthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {revenueGrowthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, '']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                <p className="text-3xl font-bold text-violet-600">{animatedPercent3}%</p>
                <p className="text-sm text-gray-600">Ingresos recurrentes</p>
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-gray-600">Activos</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <span className="text-gray-600">Potencial</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
