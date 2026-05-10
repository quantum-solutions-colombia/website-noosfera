"use client"

import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useNoosfera } from "@/contexts/noosfera-context"

export default function StressLevelDisplay() {
  const { cardiacHistory } = useNoosfera()
  const latestData = cardiacHistory[cardiacHistory.length - 1]
  const stressLevel = latestData?.stressLevel || 30

  const getStressColor = () => {
    if (stressLevel > 60) return "bg-red-500"
    if (stressLevel > 40) return "bg-yellow-500"
    return "bg-emerald-500"
  }

  const getStressText = () => {
    if (stressLevel > 60) return "Alto"
    if (stressLevel > 40) return "Moderado"
    return "Bajo"
  }

  return (
    <Card className="relative overflow-hidden border-orange-500/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Nivel de Estrés</span>
          <Brain className="h-5 w-5 text-orange-500" />
        </div>

        <motion.div
          className="text-5xl font-bold text-orange-500"
          key={stressLevel}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {stressLevel}
        </motion.div>
        <div className="text-sm text-muted-foreground mb-3">de 100</div>

        <Progress value={stressLevel} className={`h-2 ${getStressColor()}`} />
        <motion.div
          className="mt-2 text-sm font-medium text-orange-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getStressText()}
        </motion.div>
      </CardContent>
    </Card>
  )
}
