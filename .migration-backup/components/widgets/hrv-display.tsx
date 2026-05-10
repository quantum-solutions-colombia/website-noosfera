"use client"

import { motion } from "framer-motion"
import { Waves } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useNoosfera } from "@/contexts/noosfera-context"

export default function HRVDisplay() {
  const { cardiacHistory } = useNoosfera()
  const latestData = cardiacHistory[cardiacHistory.length - 1]
  const hrv = latestData?.hrVariability || 45

  const getHRVStatus = () => {
    if (hrv < 30) return { label: "Bajo", color: "text-red-500" }
    if (hrv < 50) return { label: "Moderado", color: "text-yellow-500" }
    return { label: "Óptimo", color: "text-emerald-500" }
  }

  const status = getHRVStatus()

  return (
    <Card className="relative overflow-hidden border-purple-500/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Variabilidad Cardíaca</span>
          <Waves className="h-5 w-5 text-purple-500" />
        </div>

        <motion.div
          className={`text-5xl font-bold ${status.color}`}
          key={hrv}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {hrv}
        </motion.div>
        <div className="text-sm text-muted-foreground mt-1">ms (HRV)</div>

        <motion.div
          className={`mt-3 text-sm font-medium ${status.color}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Estado: {status.label}
        </motion.div>
      </CardContent>
    </Card>
  )
}
