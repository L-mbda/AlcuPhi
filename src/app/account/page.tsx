import { Authentication } from "@/actions/authentication"
import { AuthForm } from "@/components/auth/auth-form";
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { action?: string; message?: string }
}) {
  // Check if user is already authenticated and redirect
  if ((await cookies()).get("header") !== undefined) {
    redirect("/dashboard")
  }

  const isRegister = (await searchParams).action === "register"
  const message = (await searchParams).message

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 bg-[radial-gradient(#3a3a3a_1px,transparent_1px)] bg-[size:20px_20px] p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800" />
      <div className="absolute inset-0 bg-[radial-gradient(#3a3a3a_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

      {/* Animated background circles */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "12s" }}
      />

      <div className="w-full max-w-md z-10">
        <AuthForm
          isRegister={isRegister}
          message={message}
          loginAction={Authentication.login}
          registerAction={Authentication.register}
        />
      </div>
    </div>
  )
}
