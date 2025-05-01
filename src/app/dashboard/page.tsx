import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/db";
import { getSessionData } from "@/lib/session";
import { SplashScreen } from "@/lib/ui";
import { LinkIcon, LogOut, Settings } from "lucide-react";
import Link from "next/link";

// Dashboard
export default async function Dashboard() {
  const connection = await db();
  const session = (await getSessionData()).credentials;

  return (
    <>
      {/* Regular UI */}
      <div className="p-10 w-full ">
        <h1 className="font-black text-5xl">Welcome, {session?.name}!</h1>
        <p>What would you like to practice today?</p>
      </div>
      {/* Recommended sets */}
      <div className="p-10 w-full">
        <h1 className="font-black text-3xl">Classics</h1>
        <br />
        <section className="flex md:flex-row flex-col gap-3">
          {/* Card enclosed in a Link */}
          <Card className="lg:max-w-[30%] w-full min-h-52 bg-zinc-800 text-white border-0">
            <CardHeader>
              <CardTitle className="font-black text-3xl">Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=" text-lg">
                Improve your Physics knowledge with adaptive questions from
                various olympiads!
              </p>
              <Button className="mt-4" variant="default" asChild>
                <Link href="/play" className="font-bold">
                  <LinkIcon /> Play
                </Link>
              </Button>
            </CardContent>
          </Card>
          {/* Create set */}
          <Card className="lg:max-w-[30%] w-full min-h-52 bg-zinc-800 text-white border-0">
            <CardHeader>
              <CardTitle className="font-black text-3xl">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=" text-lg">
                Play sets created by other users, or create your own!
              </p>
              <Button className="mt-4" variant="default" asChild>
                <Link href="/dashboard/community" className="font-bold">
                  <LinkIcon /> Visit
                </Link>
              </Button>
            </CardContent>
          </Card>
          {/* End Link */}
        </section>
      </div>
      <div className="p-10 w-full">
        <h1 className="font-black text-3xl">Recommendations</h1>
        <i>from the community.</i>
        <br />
        <br />
        <section className="flex md:flex-row flex-col gap-3">
          {/* Card enclosed in a Link */}
          <Card className="lg:max-w-[30%] w-full min-h-52 bg-zinc-800 text-white border-0">
            <CardHeader>
              <CardTitle className="font-black text-3xl">Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=" text-lg">
                Improve your Physics knowledge with adaptive questions from
                various olympiads!
              </p>
              <Button className="mt-4" variant="default" asChild>
                <Link href="/play" className="font-bold">
                  <LinkIcon /> Play
                </Link>
              </Button>
            </CardContent>
          </Card>
          {/* Create set */}
          <Card className="lg:max-w-[30%] w-full min-h-52 bg-zinc-800 text-white border-0">
            <CardHeader>
              <CardTitle className="font-black text-3xl">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=" text-lg">
                Play sets created by other users, or create your own!
              </p>
              <Button className="mt-4" variant="default" asChild>
                <Link href="/dashboard/community" className="font-bold">
                  <LinkIcon /> Visit
                </Link>
              </Button>
            </CardContent>
          </Card>
          {/* End Link */}
        </section>
      </div>
    </>
  );
}
