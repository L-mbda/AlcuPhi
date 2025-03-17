import { Button } from "@/components/ui/button";
import { CreateSetButton } from "@/lib/create-set-button";
import { CommunitySection } from "@/lib/menu";
import { getSessionData } from "@/lib/session";
import { SplashScreen } from "@/lib/ui";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";

// Dashboard
export default async function Dashboard() {
  // Get session data
  const session = (await getSessionData()).credentials;
  // Return
  return (
    <div className="bg-zinc-950 h-full w-full absolute">
      {/* For the top menu */}
      <div className="w-full flex justify-between p-3 items-center">
        <div className="flex items-center gap-6">
          <div className="font-['STRIX'] text-3xl select-none">
            <h1 className="font-['STIX'] font-extrabold">alcuφ</h1>
          </div>
          <SplashScreen />
        </div>

        {/* Settings and Logout buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Settings" asChild>
            <Link href="/dashboard/settings">
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
      <div className="p-10 w-full ">
        <h1 className="font-black text-5xl">Community</h1>
        <p>Practice with sets created by the community.</p>
        <br />
        {/* Create set component */}
        <CreateSetButton name={session?.name} />
      </div>
      {/* Components, inf scroll */}
      <CommunitySection />
    </div>
  );
}
