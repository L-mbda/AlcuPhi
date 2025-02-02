import { DropdownMenu } from "@/lib/menu";
import { getSessionData } from "@/lib/session";
import { SplashScreen } from "@/lib/ui";

// Dashboard
export default async function Dashboard() {
  const session = (await getSessionData()).credentials;
  return (
    <div className="bg-zinc-900 h-full w-full absolute">
      {/* For the top menu */}
      <div className="w-[100%] flex justify-center p-3 items-center gap-6">
        <div className="font-['STRIX'] text-3xl underline hover:cursor-pointer select-none">
          <DropdownMenu />
        </div>
        <SplashScreen />
      </div>

      {/* Regular UI */}
      <div className="p-8 w-full bg-zinc-900">
        <h1 className="font-black text-5xl">Welcome, {session?.name}!</h1>
        <p>What would you like to do today?</p>
      </div>
    </div>
  );
}
