"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useFormStatus } from "react-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { GrGoogle } from "react-icons/gr";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff, Key } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface AuthFormProps {
  isRegister: boolean
  message?: string
  loginAction: (formData: FormData) => Promise<void>
  registerAction: (formData: FormData) => Promise<void>
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      className="w-full bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 transition-all duration-300 relative overflow-hidden group"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-zinc-400 border-t-transparent animate-spin" />
          <span className="animate-pulse">Processing</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2 group-hover:translate-x-1 transition-transform duration-200">
          Continue <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </span>
      )}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine" />
    </Button>
  )
}

export function AuthForm({
  isRegister: initialIsRegister,
  message,
  loginAction,
  registerAction,
}: AuthFormProps) {
  const router = useRouter()
  const [mode, setMode] = useState<"chooser" | "credentials">("chooser")
  const [isRegister, setIsRegister] = useState(initialIsRegister)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<"in" | "out">("in")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })

  useEffect(() => {
    setIsRegister(initialIsRegister)
  }, [initialIsRegister])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleFormSwitch(toRegister: boolean) {
    if (isTransitioning) return
    setTransitionDirection(toRegister ? "in" : "out")
    setIsTransitioning(true)
    setTimeout(() => {
      setIsRegister(toRegister)
      setTimeout(() => {
        setTransitionDirection(toRegister ? "out" : "in")
        setTimeout(() => {
          router.push(toRegister ? "?action=register" : "/account")
          setIsTransitioning(false)
        }, 300)
      }, 300)
    }, 300)
  }

  // **1. chooser**: show just the two buttons
  if (mode === "chooser") {
    return (
      <Card className="bg-zinc-800 border-zinc-700 text-zinc-100 shadow-xl backdrop-blur-sm bg-opacity-95 p-6 space-y-4">
        <CardHeader className="space-y-1">
          <CardTitle className="font-['STIX'] font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
            alcuφ
          </CardTitle>
          <CardDescription className="text-zinc-300">
            Choose how you want to authenticate yourself.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={() => setMode("credentials")}
            className="w-full py-2 rounded-md font-medium bg-zinc-700 text-white hover:bg-zinc-600 transition"
          >
            <Key />
            Continue with Credentials
          </Button>
          <Button
            onClick={() => alert("Google OAuth not implemented yet")}
            className="w-full py-2 rounded-md font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <GrGoogle />
            Continue with Google
          </Button>
        </CardContent>
        {/* <CardFooter>
            ©{new Date().getFullYear()}
        </CardFooter> */}
      </Card>
    )
  }

  // **2. credentials**: render your full form
  return (
    <Card className="bg-zinc-800 border-zinc-700 text-zinc-100 shadow-xl backdrop-blur-sm bg-opacity-95 relative overflow-hidden transition-all duration-500">
      <div
        className={`relative z-10 transition-all duration-500 ${
          isTransitioning
            ? transitionDirection === "out"
              ? "opacity-0 translate-x-10"
              : "opacity-0 -translate-x-10"
            : "opacity-100 translate-x-0"
        }`}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="font-['STIX'] font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
            alcuφ
          </CardTitle>
          <CardDescription className="text-zinc-300">
            {isRegister
              ? "Create an account to start practicing adaptive physics problems."
              : "Sign in to your account to continue."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-800 text-red-300 animate-fadeIn">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          <form action={isRegister ? registerAction : loginAction} className="space-y-4">
            <div
              className={`space-y-4 transition-all duration-500 ${
                isRegister ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="space-y-2 animate-slideUp">
                <Label htmlFor="name" className="text-zinc-300 flex items-center gap-1">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Lambda"
                  required={isRegister}
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-zinc-700/50 border-zinc-600 text-zinc-100 focus-visible:ring-purple-500/50 transition-all duration-200 focus:scale-[1.01]"
                />
              </div>
            </div>
            <div className="space-y-2 animate-slideUp" style={{ animationDelay: "100ms" }}>
              <Label htmlFor="email" className="text-zinc-300 flex items-center gap-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="hello@alcuphi.me"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-zinc-700/50 border-zinc-600 text-zinc-100 focus-visible:ring-purple-500/50 transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
            <div className="space-y-2 animate-slideUp" style={{ animationDelay: "200ms" }}>
              <Label htmlFor="password" className="text-zinc-300 flex items-center gap-1">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-zinc-700/50 border-zinc-600 text-zinc-100 focus-visible:ring-purple-500/50 transition-all duration-200 focus:scale-[1.01] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="pt-2 animate-slideUp" style={{ animationDelay: "300ms" }}>
              {isRegister && (
                <>
                  <p className="text-[12.5px]">
                    By registering, you&apos;re agreeing to the{" "}
                    <Link href="/terms" className="hover:underline text-gray-400 hover:text-blue-300">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="hover:underline text-gray-400 hover:text-blue-300">
                      Privacy Policy
                    </Link>
                  </p>
                  <br />
                </>
              )}
              <SubmitButton />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-zinc-400 w-full text-center animate-fadeIn" style={{ animationDelay: "400ms" }}>
            {isRegister ? (
              <button
                onClick={() => handleFormSwitch(false)}
                className="text-zinc-300 hover:text-white underline underline-offset-4 transition-all duration-300 bg-transparent border-none cursor-pointer"
              >
                Already have an account? Sign in
              </button>
            ) : (
              <button
                onClick={() => handleFormSwitch(true)}
                className="text-zinc-300 hover:text-white underline underline-offset-4 transition-all duration-300 bg-transparent border-none cursor-pointer"
              >
                Don&apos;t have an account? Sign up
              </button>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
