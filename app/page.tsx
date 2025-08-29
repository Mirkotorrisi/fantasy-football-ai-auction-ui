"use client"

import { SessionProvider } from "@/context/SessionContext"
import LoginPage from "@/pages/LoginPage"
import HomePage from "@/pages/HomePage"
import { useSession } from "@/context/SessionContext"

function AppContent() {
  const { sessionId } = useSession()

  return sessionId ? <HomePage /> : <LoginPage />
}

export default function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  )
}
