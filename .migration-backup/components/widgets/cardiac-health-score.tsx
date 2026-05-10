"use client"

import { motion } from "framer-motion"
import { Heart, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useNoosfera } from "@/contexts/noosfera-context"
import { useEffect, useState } from "react"

export default function CardiacHealthScore() {
  const { cardiacAnalysis } = useNoosfera()
  const [previousScore, setPreviousScore] = useState(cardiacAnalysis.heartHealthScore)
  const currentScore = cardiacAnalysis.heartHealthScore

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviousScore(currentScore)
    }, 2000)
    return () => clearTimeout(timer)
  }, [currentScore])

  const trend = currentScore > previousScore ? "up" : currentScore < previousScore ? "down" : "stable"

  return (
    <Card className="relative overflow-hidden border-pink-500/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Puntuación de Salud</span>
          <Heart className="h-5 w-5 text-pink-500" fill="currentColor" />
        </div>

        <div className="flex items-end gap-3">
          <motion.div
            className="text-5xl font-bold text-pink-500"
            key={currentScore}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentScore}
          </motion.div>
          <div className="text-xl text-muted-foreground pb-2">de 100</div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          {trend === "up" && (
            <>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-emerald-500 font-medium">Mejorando</span>
            </>
          )}
          {trend === "down" && (
            <>
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-500 font-medium">Descendiendo</span>
            </>
          )}
          {trend === "stable" && (
            <>
              <Minus className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-yellow-500 font-medium">Estable</span>
            </>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 flex-1 rounded-full ${i < Math.floor(currentScore / 20) ? "bg-pink-500" : "bg-gray-700"}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
