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
      {/* For the top menu */}
      <div className="w-full flex justify-between p-3 items-center">
        <div className="flex items-center gap-6">
          <div className="font-['STRIX'] text-3xl select-none">
            <Link href={'/dashboard'} className="font-['STIX'] font-extrabold">alcuφ</Link>
          </div>
          <SplashScreen />
        </div>

        {/* Settings and Logout buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Settings" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" title="Logout">
            <Link href="/logout">
              <LogOut className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      {/* Regular UI */}
      {children}
    </main>
  );
}
