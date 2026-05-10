"use client"

import { motion } from "framer-motion"
import { Droplet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useNoosfera } from "@/contexts/noosfera-context"
import { useEffect, useState } from "react"

export default function CardiacOutputDisplay() {
  const { cardiacHistory } = useNoosfera()
  const [cardiacOutput, setCardiacOutput] = useState(5.0)

  useEffect(() => {
    const latestData = cardiacHistory[cardiacHistory.length - 1]
    if (latestData) {
      const hr = latestData.heartRate
      const strokeVolume = 70
      const output = (hr * strokeVolume) / 1000
      setCardiacOutput(Number.parseFloat(output.toFixed(1)))
    }
  }, [cardiacHistory])

  return (
    <Card className="relative overflow-hidden border-teal-500/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Gasto Cardíaco</span>
          <Droplet className="h-5 w-5 text-teal-500" fill="currentColor" />
        </div>

        <div className="flex items-end gap-2">
          <motion.div
            className="text-5xl font-bold text-teal-500"
            key={cardiacOutput}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {cardiacOutput}
          </motion.div>
          <div className="text-xl text-muted-foreground pb-2">L/min</div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">Litros por minuto</div>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-12 rounded-lg ${i < Math.floor(cardiacOutput) ? "bg-teal-500" : "bg-teal-950"}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              style={{ transformOrigin: "bottom" }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
