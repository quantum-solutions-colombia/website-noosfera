

import { useEffect } from "react"
import { useLocation } from "wouter"

export default function RegisterPage() {
  const [, navigate] = useLocation()

  useEffect(() => {
    navigate("/auth?tab=register")
  }, [navigate])

  return null
}
