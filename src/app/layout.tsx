import type { Metadata } from "next";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "AlcuPhi",
  description: "Alcumus for us Physicists ⚛",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased text-white`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
