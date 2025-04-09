"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useFormStatus } from "react-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

      {/* Button shine effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine" />
    </Button>
  )
}

export function AuthForm({ isRegister: initialIsRegister, message, loginAction, registerAction }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isRegister, setIsRegister] = useState(initialIsRegister)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<"in" | "out">("in")
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  // Update local state when prop changes (from URL)
  useEffect(() => {
    setIsRegister(initialIsRegister)
  }, [initialIsRegister])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSwitch = (toRegister: boolean) => {
    // Prevent multiple transitions
    if (isTransitioning) return

    // Set direction based on current state and target state
    setTransitionDirection(toRegister ? "in" : "out")
    setIsTransitioning(true)

    // Start transition animation
    setTimeout(() => {
      setIsRegister(toRegister)

      // After changing form state, animate back in
      setTimeout(() => {
        setTransitionDirection(toRegister ? "out" : "in")

        // Update URL after animation completes
        setTimeout(() => {
          router.push(toRegister ? "?action=register" : "/account")
          setIsTransitioning(false)
        }, 300)
      }, 300)
    }, 300)
  }

  return (
    <Card className="bg-zinc-800 border-zinc-700 text-zinc-100 shadow-xl backdrop-blur-sm bg-opacity-95 relative overflow-hidden transition-all duration-500">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

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
          <div className="flex items-center gap-2">
            <CardTitle className="font-['STIX'] font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
              alcuφ
            </CardTitle>
          </div>
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
              className={`space-y-4 transition-all duration-500 ${isRegister ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
            >
              <div className="space-y-2 animate-slideUp">
                <Label htmlFor="name" className="text-zinc-300 flex items-center gap-1">
                  <span>Name</span>
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
                <span>Email</span>
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
                <span>Password</span>
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
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                  ) : (
                    <Eye className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 animate-slideUp" style={{ animationDelay: "300ms" }}>
              <SubmitButton />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-zinc-400 w-full text-center animate-fadeIn" style={{ animationDelay: "400ms" }}>
            {isRegister ? (
              <button
                onClick={() => handleFormSwitch(false)}
                className="text-zinc-300 hover:text-white hover:underline-offset-8 underline underline-offset-4 transition-all duration-300 bg-transparent border-none cursor-pointer"
              >
                Already have an account? Sign in
              </button>
            ) : (
              <button
                onClick={() => handleFormSwitch(true)}
                className="text-zinc-300 hover:text-white hover:underline-offset-8 underline underline-offset-4 transition-all duration-300 bg-transparent border-none cursor-pointer"
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
