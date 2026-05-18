import { Router } from "express"

const router = Router()

const DEMO_LIMIT = 5
const usageMap = new Map<string, number>()

router.post("/demo/check", (req, res) => {
  const { fingerprint } = req.body as { fingerprint?: string }
  if (!fingerprint) return res.status(400).json({ error: "Missing fingerprint" })
  const used = usageMap.get(fingerprint) ?? 0
  const remaining = Math.max(0, DEMO_LIMIT - used)
  return res.json({ remaining, used, limit: DEMO_LIMIT })
})

router.post("/demo/use", (req, res) => {
  const { fingerprint } = req.body as { fingerprint?: string }
  if (!fingerprint) return res.status(400).json({ error: "Missing fingerprint" })
  const used = usageMap.get(fingerprint) ?? 0
  if (used >= DEMO_LIMIT) {
    return res.json({ remaining: 0, used, limit: DEMO_LIMIT, blocked: true })
  }
  const newUsed = used + 1
  usageMap.set(fingerprint, newUsed)
  const remaining = Math.max(0, DEMO_LIMIT - newUsed)
  return res.json({ remaining, used: newUsed, limit: DEMO_LIMIT, blocked: false })
})

export default router
