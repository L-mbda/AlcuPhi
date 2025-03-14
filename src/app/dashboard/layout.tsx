// app/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionData } from "@/lib/session";
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
    <html lang="en">
      <body className="antialiased text-white">
        {children}
      </body>
    </html>
  );
}
