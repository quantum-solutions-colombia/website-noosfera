"use client"

import { useRouter } from "next/navigation"
import HelpCenter from "@/components/help/help-center"

export default function HelpPage() {
  const router = useRouter()

  return <HelpCenter />
}
