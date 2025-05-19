import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionData } from "@/lib/session";
import { WavingHand } from "@/lib/visuals";
import { LinkIcon } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const session = (await getSessionData()).credentials;

  return (
    <div className="min-h-screen text-zinc-100">
      {/* HERO */}
      <section className="mx-auto mt-12 max-w-4xl rounded-lg bg-zinc-800 p-8 text-center shadow-md">
        <div className="inline-flex items-center gap-4">
          <WavingHand  />
          <h1 className="text-3xl font-extrabold">
            Hello, <span className="text-zinc-50">{session?.name}</span>!
          </h1>
        </div>
        <p className="mt-2 text-zinc-300">
          What would you like to practice today?
        </p>
      </section>

      {/* CONTENT */}
      <main className="mx-auto my-16 max-w-6xl space-y-12 px-6">
        {/* CLASSICS */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-zinc-700 pb-2">
            Classics
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Practice */}
            <Link href="/play" passHref>
              <Card
                className="group relative flex flex-col justify-between overflow-hidden rounded-lg bg-zinc-800 p-6 
                           transition hover:scale-105 hover:shadow-lg border-none"
              >
                <CardHeader className="p-0">
                  <CardTitle className="text-xl font-semibold text-zinc-50">
                    Practice
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-4 flex-1 p-0">
                  <p className="text-zinc-400">
                    Adaptive Physics questions from top olympiads.
                  </p>
                </CardContent>
                <Button
                  asChild
                  className="mt-6 w-full bg-zinc-600 text-zinc-100 transition hover:bg-zinc-500"
                >
                  <span className="flex items-center justify-center gap-2 font-medium">
                    <LinkIcon /> Play Now
                  </span>
                </Button>
              </Card>
            </Link>

            {/* Community */}
            <Link href="/dashboard/community" passHref>
              <Card
                className="group relative flex flex-col justify-between overflow-hidden rounded-lg bg-zinc-800 p-6 
                           transition hover:scale-105 hover:shadow-lg border-none"
              >
                <CardHeader className="p-0">
                  <CardTitle className="text-xl font-semibold text-zinc-50">
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-4 flex-1 p-0">
                  <p className="text-zinc-400">
                    Explore sets by others or create your own challenges.
                  </p>
                </CardContent>
                <Button
                  asChild
                  className="mt-6 w-full bg-zinc-600 text-zinc-100 transition hover:bg-zinc-500"
                >
                  <span className="flex items-center justify-center gap-2 font-medium">
                    <LinkIcon /> Explore
                  </span>
                </Button>
              </Card>
            </Link>

            {/* [Add more bg-zinc-800 cards here as needed] */}
          </div>
        </section>

        {/* FUTURE SECTION EXAMPLE */}
        {/* <section className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-zinc-700 pb-2">
            Your Progress
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-zinc-800 p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold text-zinc-50">
                  Total Points
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 p-0">
                <p className="text-3xl font-bold text-zinc-100">1,240</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-800 p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold text-zinc-50">
                  Sets Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 p-0">
                <p className="text-3xl font-bold text-zinc-100">18</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-800 p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold text-zinc-50">
                  Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 p-0">
                <p className="text-3xl font-bold text-zinc-100">5 days</p>
              </CardContent>
            </Card>
          </div>
        </section> */}
      </main>
    </div>
  );
}
