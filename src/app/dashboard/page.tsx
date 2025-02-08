import { DropdownMenu, GameCard } from "@/lib/menu";
import { getSessionData } from "@/lib/session";
import { SplashScreen } from "@/lib/ui";
import { Search } from "lucide-react";
import Link from "next/link";

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
      <div className="p-10 w-full bg-zinc-900">
        <h1 className="font-black text-5xl">Welcome, {session?.name}!</h1>
        <p>What would you like to practice today?</p>
      </div>
      {/* Play and other options */}
      <div className="w-full bg-zinc-900 pl-10 gap-3 flex flex-col">
        <h1 className="font-light text-3xl flex flex-row gap-3 items-center"><span><Search size={30} /></span>Explore</h1>
        {/* Div for game modes */}
        <div className="p-4">
          <h1 className="font-semibold w-fit bg-gray-50 hover:bg-gray-100 transition-colors duration-300 p-3 rounded-lg text-gray-900 font-mono flex items-center gap-3 shadow-md">
            PLATFORM ORIGINALS
          </h1>
          <div className="font-['Mulish'] mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <GameCard />                      
          </div>
        </div>
      </div>
    </div>
  );
}
