"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useNoosfera } from "@/contexts/noosfera-context"

export default function HeartRateDisplay() {
  const { cardiacHistory } = useNoosfera()
  const latestData = cardiacHistory[cardiacHistory.length - 1]
  const heartRate = latestData?.heartRate || 72

  return (
    <Card className="relative overflow-hidden border-emerald-500/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Frecuencia Cardíaca</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 60 / heartRate, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Heart className="h-5 w-5 text-emerald-500" fill="currentColor" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <motion.div
            className="text-5xl font-bold text-emerald-500"
            key={heartRate}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {heartRate}
          </motion.div>
          <div className="text-sm text-muted-foreground">BPM</div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{ transformOrigin: "left" }}
        />
      </CardContent>
    </Card>
  )
}
