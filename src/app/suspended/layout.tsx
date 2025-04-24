// app/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionData } from "@/lib/session";
import { SplashScreen } from "@/lib/ui";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
export const metadata: Metadata = {
  title: "Alcuphi",
  description: "Alcumus for us Physicists ⚛",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionData();

  if (session.action === "logout") {
    return redirect("/logout");
  }

  return (
    <main className="bg-zinc-950 h-full w-full absolute">
      {/* Regular UI */}
      {children}
    </main>
  );
}
