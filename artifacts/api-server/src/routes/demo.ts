import { Router } from "express"

const router = Router()

const DEMO_LIMIT = 5
const RESET_MS = 24 * 60 * 60 * 1000

interface UsageEntry {
  used: number
  firstUsedAt: number
}

const usageMap = new Map<string, UsageEntry>()

function getEntry(fp: string): UsageEntry {
  let entry = usageMap.get(fp)
  if (entry && Date.now() - entry.firstUsedAt >= RESET_MS) {
    usageMap.delete(fp)
    entry = undefined
  }
  return entry ?? { used: 0, firstUsedAt: Date.now() }
}

router.post("/demo/check", (req, res) => {
  const { fingerprint } = req.body as { fingerprint?: string }
  if (!fingerprint) return res.status(400).json({ error: "Missing fingerprint" })
  const entry = getEntry(fingerprint)
  const remaining = Math.max(0, DEMO_LIMIT - entry.used)
  const resetAt = entry.used > 0 ? entry.firstUsedAt + RESET_MS : null
  return res.json({ remaining, used: entry.used, limit: DEMO_LIMIT, resetAt })
})

router.post("/demo/use", (req, res) => {
  const { fingerprint } = req.body as { fingerprint?: string }
  if (!fingerprint) return res.status(400).json({ error: "Missing fingerprint" })
  let entry = getEntry(fingerprint)
  if (entry.used >= DEMO_LIMIT) {
    const resetAt = entry.firstUsedAt + RESET_MS
    return res.json({ remaining: 0, used: entry.used, limit: DEMO_LIMIT, blocked: true, resetAt })
  }
  const newEntry: UsageEntry = {
    used: entry.used + 1,
    firstUsedAt: entry.used === 0 ? Date.now() : entry.firstUsedAt,
  }
  usageMap.set(fingerprint, newEntry)
  const remaining = Math.max(0, DEMO_LIMIT - newEntry.used)
  const resetAt = newEntry.firstUsedAt + RESET_MS
  return res.json({ remaining, used: newEntry.used, limit: DEMO_LIMIT, blocked: false, resetAt })
})

export default router
