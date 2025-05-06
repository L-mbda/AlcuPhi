import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {SiGithub} from "@icons-pack/react-simple-icons"

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Minimal Navigation
      <nav className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="font-['STIX'] font-extrabold text-2xl">alcuφ</div>
        <Button variant="outline" className="border-zinc-800 text-black" asChild>
          <Link href="/account">Sign In</Link>
        </Button>
      </nav> */}

      {/* Simplified Hero Section */}
      <main className="container mx-auto px-4 flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="font-['STIX'] font-extrabold text-6xl md:text-7xl">alcuφ</h1>
          <p className="text-xl text-zinc-400">
            <span className="italic">
              Like{" "}
              <Link
                href="https://artofproblemsolving.com/alcumus/problem"
                className="underline underline-offset-4 hover:text-white transition-colors"
              >
                Alcumus
              </Link>
              , but for Physicists.
            </span>
          </p>
          <div className="mt-8">
            <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-200" asChild>
              <Link href="/account">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="container mx-auto px-4 py-6 border-t border-zinc-800">
        <div className="flex justify-between items-center">
          <div className="text-zinc-500 text-sm">©{new Date().getFullYear()} <span className="font-['STRIX']">alcuφ</span></div>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/alcuphi/alcuphi"
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <SiGithub className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
            <Link
              href="https://github.com/Alcuphi/AlcuPhi/blob/main/LICENSE"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              CC0-1.0 License
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
