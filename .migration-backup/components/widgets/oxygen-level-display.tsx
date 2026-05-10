"use client"

import { motion } from "framer-motion"
import { Wind } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useNoosfera } from "@/contexts/noosfera-context"

export default function OxygenLevelDisplay() {
  const { cardiacHistory } = useNoosfera()
  const latestData = cardiacHistory[cardiacHistory.length - 1]
  const oxygenSaturation = latestData?.oxygenSaturation || 98

  return (
    <Card className="relative overflow-hidden border-cyan-500/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Saturación de Oxígeno</span>
          <Wind className="h-5 w-5 text-cyan-500" />
        </div>

        <motion.div
          className="text-5xl font-bold text-cyan-500 mb-2"
          key={oxygenSaturation}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {oxygenSaturation}%
        </motion.div>
        <div className="text-sm text-muted-foreground mb-3">SpO₂</div>

        <Progress value={oxygenSaturation} className="h-2 bg-cyan-950" />
      </CardContent>
    </Card>
  )
}
