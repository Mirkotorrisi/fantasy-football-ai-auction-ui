"use client";

import HomePage from "@/components/pages/HomePage";
import LoginPage from "@/components/pages/LoginPage";
import { SessionProvider, useSession } from "@/context/SessionContext";

function AppContent() {
  const { sessionId } = useSession();

  return sessionId ? <HomePage /> : <LoginPage />;
}

export default function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}
