"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useNoosfera } from "@/contexts/noosfera-context"

export default function CardiacRhythmIndicator() {
  const { cardiacAnalysis } = useNoosfera()
  const { dominantFrequency } = cardiacAnalysis

  const getRhythmColor = () => {
    switch (dominantFrequency) {
      case "normal":
        return "text-emerald-500"
      case "elevated":
        return "text-orange-500"
      case "low":
        return "text-blue-500"
      case "variable":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  const getRhythmLabel = () => {
    switch (dominantFrequency) {
      case "normal":
        return "Normal"
      case "elevated":
        return "Elevado"
      case "low":
        return "Bajo"
      case "variable":
        return "Variable"
      default:
        return "Desconocido"
    }
  }

  return (
    <Card className="relative overflow-hidden border-yellow-500/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Ritmo Cardíaco</span>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Zap className="h-5 w-5 text-yellow-500" />
          </motion.div>
        </div>

        <motion.div
          className={`text-4xl font-bold ${getRhythmColor()}`}
          key={dominantFrequency}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getRhythmLabel()}
        </motion.div>
        <div className="text-sm text-muted-foreground mt-2">Frecuencia Dominante</div>

        <div className="mt-4 flex gap-1">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-8 flex-1 rounded-sm ${getRhythmColor().replace("text-", "bg-")}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: Math.random() * 0.5 + 0.5 }}
              transition={{
                duration: 0.3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: i * 0.05,
              }}
              style={{ transformOrigin: "bottom" }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
