"use client"

import type React from "react"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { NoosferaProvider } from "@/contexts/noosfera-context"
import { CookiesConsent } from "@/components/cookies-consent"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <AuthProvider>
        <NoosferaProvider>
          <CookiesConsent />
          {children}
          <Toaster position="bottom-right" />
        </NoosferaProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
