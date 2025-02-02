import { getSessionData } from "@/lib/session";
import { SplashScreen } from "@/lib/splashscreen";
export default async function Dashboard() {
  const session = (await getSessionData()).credentials;
  return (
    <div className="bg-zinc-900 h-full w-full absolute">
      <div className="w-[100%] flex justify-center p-2 items-center gap-5">
        <h1 className="font-['STRIX'] font-extrabold text-3xl">alcuφ</h1>
        <SplashScreen />
      </div>
      <h1>Welcome back, {session?.name}!</h1>
    </div>
  );
}
