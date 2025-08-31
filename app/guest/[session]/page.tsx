import GuestPageComponent from "@/components/pages/GuestPage";
import { redirect } from "next/navigation";

export default async function GuestPage({
  params,
}: {
  params: Promise<{ session: string }>;
}) {
  const { session } = await params;

  if (!session) {
    redirect("/login");
  }

  return <GuestPageComponent sessionId={session} />;
}
