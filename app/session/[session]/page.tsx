import HomePage from "@/components/pages/HomePage";
import { SessionProvider } from "@/context/SessionContext";
import { redirect } from "next/navigation";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ session: string }>;
}) {
  const { session } = await params;

  if (!session) {
    redirect("/login");
  }

  return (
    <SessionProvider sessionId={session}>
      <HomePage />
    </SessionProvider>
  );
}
