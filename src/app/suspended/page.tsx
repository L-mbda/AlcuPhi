import { getSessionData } from "@/lib/session"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { redirect } from "next/navigation"

export default async function Suspended() {
  const session = await getSessionData()
  if (session.action != 'halt') {
    return redirect('/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 px-4">
      <div className="max-w-md text-center space-y-6 bg-zinc-700/50 backdrop-blur-md rounded-xl p-8 shadow-lg">
        <AlertTriangle className="mx-auto w-16 h-16 text-amber-400" />
        <h1 className="text-4xl font-extrabold text-white">
          Hello, {session.credentials?.name}.
        </h1>
        <p className="text-zinc-200 leading-relaxed">
          Your account has been suspended from <span className="font-['STIX'] font-extrabold">alcuφ</span> due to potential rule
          violations. If you believe this is a mistake or would like to appeal,
          {/* @ts-expect-error Expected */}
          please reach out to our support team <Link className="text-underline text-blue-300" href={'mailto:support@alcuphi.me?subject=Appeal%20for%20AlcuPhi%20Account%20' + session?.credentials.id}>here</Link>.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild className="px-6 bg-zinc-800 hover:bg-zinc-700">
            <Link href="/logout">Log Out</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
