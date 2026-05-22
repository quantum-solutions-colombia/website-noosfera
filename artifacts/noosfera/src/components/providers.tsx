

import type React from "react"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { NoosferaProvider } from "@/contexts/noosfera-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <AuthProvider>
        <NoosferaProvider>
          {children}
          <Toaster position="bottom-right" />
        </NoosferaProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
