"use client"

import { motion } from "framer-motion"
import { Timer } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useNoosfera } from "@/contexts/noosfera-context"
import { useEffect, useState } from "react"

export default function RecoveryTimeDisplay() {
  const { cardiacHistory } = useNoosfera()
  const [recoveryTime, setRecoveryTime] = useState(0)

  useEffect(() => {
    const latestData = cardiacHistory[cardiacHistory.length - 1]
    if (latestData) {
      const hrv = latestData.hrVariability
      const calculatedRecovery = Math.floor((100 - hrv) / 10) + Math.floor(Math.random() * 3)
      setRecoveryTime(calculatedRecovery)
    }
  }, [cardiacHistory])

  return (
    <Card className="relative overflow-hidden border-indigo-500/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Tiempo de Recuperación</span>
          <Timer className="h-5 w-5 text-indigo-500" />
        </div>

        <div className="flex items-end gap-2">
          <motion.div
            className="text-5xl font-bold text-indigo-500"
            key={recoveryTime}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {recoveryTime}
          </motion.div>
          <div className="text-xl text-muted-foreground pb-2">min</div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">Estimado</div>

        <motion.div className="mt-4 h-2 bg-indigo-950 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(12 - recoveryTime) * 8.33}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </motion.div>
      </CardContent>
    </Card>
  )
}
