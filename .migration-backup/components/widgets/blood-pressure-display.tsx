"use client"

import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useNoosfera } from "@/contexts/noosfera-context"

export default function BloodPressureDisplay() {
  const { cardiacHistory } = useNoosfera()
  const latestData = cardiacHistory[cardiacHistory.length - 1]
  const systolic = latestData?.systolic || 120
  const diastolic = latestData?.diastolic || 80

  const getStatusColor = () => {
    if (systolic > 130 || diastolic > 85) return "text-red-500"
    if (systolic < 110 || diastolic < 70) return "text-yellow-500"
    return "text-emerald-500"
  }

  return (
    <Card className="relative overflow-hidden border-blue-500/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Presión Arterial</span>
          <Activity className="h-5 w-5 text-blue-500" />
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            className={`text-4xl font-bold ${getStatusColor()}`}
            key={systolic}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {systolic}
          </motion.div>
          <span className="text-2xl text-muted-foreground">/</span>
          <motion.div
            className={`text-4xl font-bold ${getStatusColor()}`}
            key={diastolic}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {diastolic}
          </motion.div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          <span className="font-medium">SISTÓLICA</span> / <span className="font-medium">DIASTÓLICA</span>
          <div className="text-xs mt-1">mmHg</div>
        </div>
      </CardContent>
    </Card>
  )
}
